import { Request, Response } from 'express';
import prisma from '../lib/prisma';

import axios from 'axios';
import pdf from 'pdf-parse';
import groq from '../lib/groq';
import { cloudinary } from '../lib/cloudinary';

export const applyForJob = async (req: any, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'CV faylı yüklənməyib' });
    }

    console.log('--- Resume Analysis Started (Memory Mode) ---');
    console.log('File Name:', file.originalname);

    // Helper to sanitize filename for Cloudinary
    const sanitizeFilename = (filename: string) => {
      return filename
        .split('.')[0]
        .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric with hyphen
        .replace(/-+/g, '-')         // Remove double hyphens
        .substring(0, 50);           // Keep it short
    };

    // 1. Extract text from PDF buffer directly
    console.log('1. Attempting to parse PDF text from buffer...');
    let pdfData;
    try {
      pdfData = await pdf(file.buffer);
      console.log('PDF text extracted, characters:', pdfData.text?.length || 0);
    } catch (parseError: any) {
      console.error('Detailed PDF Parse Error:', parseError);
      throw parseError;
    }
    const resumeText = pdfData.text;

    // 2. Analyze with Groq AI
    console.log('2. Sending to Groq AI for analysis...');
    const prompt = `
      Sən peşəkar bir HR köməkçisisən. Aşağıdakı CV mətnini analiz et və mənə JSON formatında geri qaytar:
      Format belə olmalıdır:
      {
        "name": "Namizədin adı",
        "skills": ["bacarıq1", "bacarıq2"],
        "summary": "Qısa xülasə",
        "experience": "Təcrübə haqqında qısa məlumat"
      }

      CV Mətni:
      ${resumeText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const aiAnalysis = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    console.log('3. AI Analysis Result:', aiAnalysis);

    // 3. Upload buffer to Cloudinary (Stream)
    console.log('4. Uploading to Cloudinary...');
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const safeName = sanitizeFilename(file.originalname);
        
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'resumes',
            resource_type: 'raw', // PDF üçün ən doğru format 'raw'dır, lakin Cloudinary kilidi açılmalıdır
            public_id: `${Date.now()}-${safeName}.pdf`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    };

    const cloudinaryResult: any = await uploadToCloudinary();
    console.log('Cloudinary Upload Success:', cloudinaryResult.secure_url);

    // 4. Find the local user ID from Clerk ID
    console.log('5. Finding local user in DB...');
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      console.error('User not found in DB for Clerk ID:', userId);
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    // 5. Save to database
    console.log('6. Saving application to DB...');
    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: user.id,
        resumeUrl: cloudinaryResult.secure_url,
        resumeText: JSON.stringify(aiAnalysis),
        stage: 'Applied'
      }
    });

    console.log('--- Application Completed Successfully ---');
    res.status(201).json({ 
      message: 'Müraciət uğurla tamamlandı', 
      application,
      analysis: aiAnalysis 
    });

  } catch (error: any) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Müraciət zamanı xəta baş verdi', error: error.message });
  }
};

export const getApplicationResumeUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application || !application.resumeUrl) {
      return res.status(404).json({ message: 'Müraciət və ya CV tapılmadı' });
    }

    const { resumeUrl } = application;
    const isRaw = resumeUrl.includes('/raw/upload/');
    const resourceType = isRaw ? 'raw' : 'image';

    let publicId = resumeUrl.split('/upload/')[1];
    if (publicId && publicId.match(/^v\d+\//)) {
      publicId = publicId.replace(/^v\d+\//, '');
    }

    try {
      // CDN yaddaşını (cache) aşmaq və 100% dəqiqlik üçün Cloudinary Admin API istifadə edirik
      await cloudinary.api.resource(publicId, { resource_type: resourceType });
      
      const urlWithCacheBuster = `${resumeUrl}?t=${Date.now()}`;
      return res.status(200).json({ url: urlWithCacheBuster });
    } catch (err: any) {
      // Cloudinary api.resource faylı tapmadıqda 404 xətası atır
      if (err.error && err.error.http_code === 404) {
        return res.status(404).json({ message: 'Bu CV Cloudinary bazasından admin tərəfindən silinib.' });
      }
      if (err.http_code === 404) {
         return res.status(404).json({ message: 'Bu CV Cloudinary bazasından admin tərəfindən silinib.' });
      }
      // Hər ehtimala qarşı başqa error varsa, linki qaytarırıq (bəlkə API limitinə düşmüşük)
      return res.status(200).json({ url: `${resumeUrl}?t=${Date.now()}` });
    }
  } catch (error) {
    console.error('get resume url error:', error);
    res.status(500).json({ message: 'CV axtarışı zamanı xəta' });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.query;
    console.log('Fetching applications. jobId filter:', jobId || 'none');
    
    // 1. Fetch real applications
    const applications = await prisma.application.findMany({
      where: jobId ? { jobId: String(jobId) } : {},
      include: {
        candidate: {
          select: {
            name: true,
            email: true
          }
        },
        job: {
          select: {
            title: true,
            company: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
    
    // 2. Fetch all user resumes (Talent Pool) - only if no specific job filter or we want a general pool
    // For now, let's include them as "General Talent Pool" if no jobId is specified
    let virtualApplications: any[] = [];
    if (!jobId) {
      const allResumes = await prisma.resume.findMany({
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      virtualApplications = allResumes.map(resume => ({
        id: `resume-${resume.id}`, // Unique ID for frontend
        candidateId: resume.userId,
        candidate: resume.user,
        resumeUrl: resume.url,
        resumeText: null,
        stage: 'Pool', // Special stage for Talent Pool
        rating: 0,
        appliedAt: resume.createdAt,
        jobId: 'talent-pool',
        job: {
          title: 'Ümumi Baza (Talent Pool)',
          company: 'Sistem'
        },
        isVirtual: true // Flag to identify it's from profile resumes
      }));
    }
    
    // 3. Merge and sort
    const allItems = [...applications, ...virtualApplications].sort((a, b) => 
      new Date(b.appliedAt || b.createdAt).getTime() - new Date(a.appliedAt || a.createdAt).getTime()
    );

    console.log(`Found ${applications.length} real apps and ${virtualApplications.length} pool resumes`);
    
    // Fix URLs on the fly
    const fixedItems = allItems.map(item => {
      const url = item.resumeUrl || '';
      const hasExtension = /\.(pdf|docx|doc|txt|png|jpg|jpeg)$/i.test(url.split('?')[0]);
      
      if (url.includes('cloudinary') && !hasExtension) {
        return { ...item, resumeUrl: `${url}.pdf` };
      }
      return item;
    });

    res.json(fixedItems);
  } catch (error) {
    console.error('getApplications error:', error);
    res.status(500).json({ message: 'Müraciətləri gətirərkən xəta baş verdi', error });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stage, rating } = req.body;
    const updated = await prisma.application.update({
      where: { id },
      data: { stage, rating }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Müraciət yenilənərkən xəta baş verdi', error });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.application.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Müraciət silinərkən xəta baş verdi', error });
  }
};
