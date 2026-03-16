import { Request, Response } from 'express';
import prisma from '../lib/prisma';

import axios from 'axios';
import pdf from 'pdf-parse';
import groq from '../lib/groq';
import { cloudinary } from '../lib/cloudinary';
import { sendNewApplicationNotification } from '../services/notificationService';
import { compareCVWithJob } from '../services/aiService';

export const applyForJob = async (req: any, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId;
    const file = req.file;

    // 0. Check Limits
    const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    const isPremium = currentUser?.plan === 'PREMIUM';
    
    if (!isPremium && currentUser && currentUser.cvUploadCount >= 3) {
      return res.status(403).json({ 
        message: 'CV yükləmə limiti dolub. Zəhmət olmasa planınızı yeniləyin.',
        limitReached: true 
      });
    }

    if (!file) {
      console.error('Apply error: No file provided in request. Field name expected: "resume"');
      return res.status(400).json({ message: 'CV faylı yüklənməyib. Zəhmət olmasa "resume" sahəsində PDF faylı göndərin.' });
    }

    console.log('--- Resume Analysis Started (Memory Mode) ---');
    console.log('File Name:', file.originalname);
    console.log('File Size:', file.size, 'bytes');
    console.log('Mime Type:', file.mimetype);

    const allowedMimeTypes = ['application/pdf', 'application/x-pdf', 'application/octet-stream'];
    const isPDF = allowedMimeTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.pdf');

    if (!isPDF) {
      return res.status(400).json({ message: 'Yalnız PDF formatında CV qəbul edilir. Sizin göndərdiyiniz: ' + file.mimetype });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Fayl ölçüsü çox böyükdür (Max: 5MB)' });
    }

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
      Sən peşəkar bir HR köməkçisisən. Aşağıdakı CV mətnini analiz et və mənə JSON formatında geri qaytar.
      Bundan əlavə, namizədin ümumi uyğunluğunu 1 ilə 5 arasında bir reytinqlə ("rating") qiymətləndir (1 - çox zəif, 5 - ideal).
      
      Format belə olmalıdır:
      {
        "name": "Namizədin adı",
        "skills": ["bacarıq1", "bacarıq2"],
        "summary": "Qısa xülasə",
        "experience": "Təcrübə haqqında qısa məlumat",
        "rating": 5
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
    console.log('AI assigned rating:', aiAnalysis.rating);

    // 3. Upload buffer to Cloudinary (Stream)
    console.log('4. Uploading to Cloudinary...');
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const safeName = sanitizeFilename(file.originalname);
        
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'resumes',
            resource_type: 'auto', // PDF-in düzgün tanınması və .pdf uzantısının işləməsi üçün 'auto' istifadə olunur
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
    console.log('6. Create Application record');
    const application = await prisma.application.create({
      data: {
        candidateId: user.id,
        jobId: jobId,
        resumeUrl: cloudinaryResult.secure_url,
        resumeText: resumeText,
        rating: aiAnalysis.rating || 0,
        stage: 'Applied',
      }
    });

    // 7. Increment upload count
    await prisma.user.update({
      where: { clerkId: userId },
      data: { cvUploadCount: { increment: 1 } }
    });

    // 8. Trigger notification (Async - don't block response)
    sendNewApplicationNotification(application.id);

    console.log('--- Application Completed Successfully ---');
    res.status(201).json({ 
      message: 'Müraciət uğurla tamamlandı', 
      application,
      analysis: aiAnalysis 
    });

  } catch (error: any) {
    console.error('Apply for job error - FULL DETAILS:', error);
    res.status(500).json({ 
      message: 'Müraciət zamanı xəta baş verdi: ' + (error.message || 'Naməlum xəta'), 
      debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const analyzeApplication = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth?.userId;

    // 1. Find Application with Job details
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
      }
    });

    if (!application) {
      return res.status(404).json({ message: 'Müraciət tapılmadı' });
    }

    if (!application.resumeText) {
      return res.status(400).json({ message: 'CV mətni tapılmadı, xahiş olunur CV-ni yenidən yükləyin.' });
    }

    // 2. Perform AI Comparison
    console.log(`Analyzing application ${id} against job ${application.job.title}`);
    const analysisResult = await compareCVWithJob(
      application.resumeText,
      application.job.title,
      application.job.description
    );

    // 3. Update Application in DB
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        matchScore: analysisResult.matchScore,
        aiAnalysis: analysisResult as any, // Store full JSON
      }
    });

    res.json({
      message: 'Analiz uğurla tamamlandı',
      matchScore: analysisResult.matchScore,
      analysis: analysisResult
    });

  } catch (error: any) {
    console.error('analyzeApplication error:', error);
    res.status(500).json({ message: 'Analiz zamanı xəta baş verdi', error: error.message });
  }
};

export const getApplicationResumeUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let resumeUrl: string | null = null;

    // 1. Handle Virtual (Talent Pool) vs Real Applications
    if (id.startsWith('resume-')) {
      const resumeId = id.replace('resume-', '');
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId }
      });
      resumeUrl = resume?.url || null;
    } else {
      const application = await prisma.application.findUnique({
        where: { id }
      });
      resumeUrl = application?.resumeUrl || null;
    }

    if (!resumeUrl) {
      return res.status(404).json({ message: 'CV tapılmadı' });
    }

    // 2. Cloudinary API check (Optional but good for validation)
    try {
      if (resumeUrl.includes('cloudinary')) {
        const parts = resumeUrl.split('/upload/');
        if (parts.length > 1) {
          let publicId = parts[1];
          // Remove versioning (v12345678/)
          if (publicId.match(/^v\d+\//)) {
            publicId = publicId.replace(/^v\d+\//, '');
          }
          
          // Determine resource type
          const isRaw = resumeUrl.includes('/raw/upload/');
          const resourceType = isRaw ? 'raw' : 'image';

          // Validate with Cloudinary API
          await cloudinary.api.resource(publicId, { resource_type: resourceType });
        }
      }
      
      const urlWithCacheBuster = resumeUrl.includes('?') 
        ? `${resumeUrl}&t=${Date.now()}` 
        : `${resumeUrl}?t=${Date.now()}`;
        
      return res.status(200).json({ url: urlWithCacheBuster });
    } catch (err: any) {
      console.warn('Cloudinary verification warning:', err.message);
      // Fallback: return the URL even if API check fails (maybe API limits)
      return res.status(200).json({ url: resumeUrl });
    }
  } catch (error) {
    console.error('get resume url error:', error);
    res.status(500).json({ message: 'CV axtarışı zamanı daxili xəta baş verdi' });
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

export const getCandidates = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth.userId;

    // Helper to calculate total experience years from JSON
    const calculateExpYears = (expJson: any): number => {
      try {
        const experiences = typeof expJson === 'string' ? JSON.parse(expJson) : expJson;
        if (!Array.isArray(experiences)) return 0;
        
        let totalMonths = 0;
        experiences.forEach((exp: any) => {
          if (exp.startDate && exp.endDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate === 'hazırda' || !exp.endDate ? new Date() : new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
          }
        });
        return Math.floor(totalMonths / 12);
      } catch (e) {
        return 0;
      }
    };

    // Find employer
    const employer = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        jobs: {
          include: {
            applications: {
              include: {
                candidate: true
              }
            }
          }
        }
      }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    // 1. Get all candidates who applied to employer's jobs
    const candidatesMap = new Map<string, any>();
    
    employer.jobs.forEach(job => {
      job.applications.forEach(app => {
        const candidate = app.candidate;
        const currentData = candidatesMap.get(candidate.email);
        
        // If candidate already exists, we might want the most recent application
        if (!currentData || new Date(app.appliedAt) > new Date(currentData.appliedAt)) {
          candidatesMap.set(candidate.email, {
            id: candidate.id,
            applicationId: app.id, // CRITICAL: Added for real status updates
            name: candidate.name || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Anonim',
            email: candidate.email,
            location: candidate.location || 'Bakı, Azərbaycan',
            experienceYears: calculateExpYears(candidate.experience),
            skills: candidate.skills || [],
            education: (candidate.education as any) || [],
            matchingScore: app.rating * 20, // 1-5 to 0-100
            analysisStatus: 'completed',
            appliedAt: app.appliedAt,
            status: app.stage,
            appliedJobId: job.id,
            appliedJobTitle: job.title
          });
        }
      });
    });

    // 2. Get all resumes in Talent Pool (Resume model)
    const resumes = await prisma.resume.findMany({
      include: {
        user: true
      }
    });

    resumes.forEach(resume => {
      const user = resume.user;
      if (!candidatesMap.has(user.email)) {
        candidatesMap.set(user.email, {
          id: user.id,
          applicationId: null, // No application yet
          name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonim',
          email: user.email,
          location: user.location || 'Bakı, Azərbaycan',
          experienceYears: calculateExpYears(user.experience),
          skills: user.skills || [],
          education: (user.education as any) || [],
          matchingScore: 0,
          analysisStatus: 'completed',
          appliedAt: resume.createdAt,
          status: 'Applied',
          appliedJobTitle: 'İstedad Hovuzu'
        });
      }
    });

    const finalCandidates = Array.from(candidatesMap.values())
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    res.json(finalCandidates);
  } catch (error: any) {
    console.error('getCandidates error:', error);
    res.status(500).json({ message: 'Namizədləri gətirərkən xəta baş verdi', error: error.message });
  }
};

export const getTalentPool = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth.userId;

    // Helper to calculate total experience years from JSON
    const calculateExpYears = (expJson: any): number => {
      try {
        const experiences = typeof expJson === 'string' ? JSON.parse(expJson) : expJson;
        if (!Array.isArray(experiences)) return 0;
        
        let totalMonths = 0;
        experiences.forEach((exp: any) => {
          if (exp.startDate && exp.endDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate === 'hazırda' || !exp.endDate ? new Date() : new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
          }
        });
        return Math.floor(totalMonths / 12);
      } catch (e) {
        return 0;
      }
    };

    // Find employer
    const employer = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        jobs: {
          include: {
            applications: {
              include: {
                candidate: true
              }
            }
          }
        }
      }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    const candidatesMap = new Map<string, any>();
    
    // 1. Get from Resume model (Directly added to pool)
    const poolResumes = await prisma.resume.findMany({
      include: {
        user: true
      }
    });

    poolResumes.forEach(resume => {
      const user = resume.user;
      candidatesMap.set(user.email, {
        id: user.id,
        applicationId: null,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonim',
        email: user.email,
        location: user.location || 'Bakı, Azərbaycan',
        experienceYears: calculateExpYears(user.experience),
        skills: user.skills || [],
        education: (user.education as any) || [],
        matchingScore: 0,
        status: 'Applied',
        appliedAt: resume.createdAt,
        appliedJobTitle: 'İstedad Hovuzu'
      });
    });

    // 2. Add applicants who are not rejected/hired (Potential candidates)
    employer.jobs.forEach(job => {
      job.applications.forEach(app => {
        const candidate = app.candidate;
        if (!candidatesMap.has(candidate.email)) {
          candidatesMap.set(candidate.email, {
            id: candidate.id,
            applicationId: app.id,
            name: candidate.name || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Anonim',
            email: candidate.email,
            location: candidate.location || 'Bakı, Azərbaycan',
            experienceYears: calculateExpYears(candidate.experience),
            skills: candidate.skills || [],
            education: (candidate.education as any) || [],
            matchingScore: app.rating * 20,
            status: app.stage,
            appliedAt: app.appliedAt,
            appliedJobTitle: job.title
          });
        }
      });
    });

    const finalPool = Array.from(candidatesMap.values())
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    res.json(finalPool);
  } catch (error: any) {
    console.error('getTalentPool error:', error);
    res.status(500).json({ message: 'Talent Pool gətirərkən xəta baş verdi', error: error.message });
  }
};

export const getCandidateById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth.userId;

    // Find employer to ensure authorization
    const employer = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    // Try to find candidate in Users (Candidate might be in Talent Pool or have an application)
    const candidate = await prisma.user.findUnique({
      where: { id },
      include: {
        applications: {
          where: {
            job: {
              employerId: employer.id
            }
          },
          include: {
            job: true
          }
        },
        resumes: true
      }
    });

    if (!candidate) {
      return res.status(404).json({ message: 'Namizəd tapılmadı' });
    }

    // Dynamic experience calculation
    const calculateExpYears = (expJson: any): number => {
      try {
        const experiences = typeof expJson === 'string' ? JSON.parse(expJson) : expJson;
        if (!Array.isArray(experiences)) return 0;
        let totalMonths = 0;
        experiences.forEach((exp: any) => {
          if (exp.startDate && exp.endDate) {
            const start = new Date(exp.startDate);
            const end = exp.endDate === 'hazırda' || !exp.endDate ? new Date() : new Date(exp.endDate);
            const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
            totalMonths += Math.max(0, months);
          }
        });
        return Math.floor(totalMonths / 12);
      } catch (e) { return 0; }
    };

    // Prepare unified candidate view
    const application = candidate.applications[0]; // Get most recent if multiple (simplified)
    const resume = candidate.resumes[0];

    const result = {
      id: candidate.id,
      applicationId: application?.id || null,
      name: candidate.name || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Anonim',
      email: candidate.email,
      location: candidate.location || 'Məlumat yoxdur',
      experienceYears: calculateExpYears(candidate.experience),
      skills: candidate.skills || [],
      education: (candidate.education as any) || [],
      matchingScore: application ? application.rating * 20 : 0,
      status: application ? application.stage : 'In Pool',
      appliedAt: application ? application.appliedAt : resume?.createdAt || candidate.createdAt,
      appliedJobTitle: application ? application.job.title : 'İstedad Hovuzu',
      resumeUrl: application?.resumeUrl || resume?.url || null,
      bio: candidate.bio || '',
      phone: candidate.phone || ''
    };

    res.json(result);
  } catch (error: any) {
    console.error('getCandidateById error:', error);
    res.status(500).json({ message: 'Namizəd məlumatlarını gətirərkən xəta baş verdi', error: error.message });
  }
};

export const analyzeAndAddToPool = async (req: any, res: Response) => {
  try {
    const userId = req.auth?.userId;
    const file = req.file;

    if (userId) {
      const currentUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (currentUser?.plan === 'FREE' && currentUser.cvUploadCount >= 3) {
        return res.status(403).json({ 
          message: 'Limit dolub. Yeni namizəd əlavə etmək üçün planınızı yeniləyin.',
          limitReached: true 
        });
      }
    }
    if (!file) {
      return res.status(400).json({ message: 'CV faylı yüklənməyib' });
    }

    console.log('--- Talent Pool AI Analysis Started ---');

    // 1. Extract text from PDF
    const pdfData = await pdf(file.buffer);
    const resumeText = pdfData.text;

    // 2. AI Analysis with Groq
    const prompt = `
      Sən peşəkar bir HR köməkçisisən. Aşağıdakı CV mətnini analiz et və mənə JSON formatında geri qaytar.
      Mütləq bu formatda olsun (heç bir əlavə mətn yazma):
      {
        "name": "Namizədin adı",
        "email": "namizədin@emaili.com",
        "skills": ["bacarıq1", "bacarıq2"],
        "summary": "Qısa xülasə/bio",
        "location": "Şəhər, Ölkə",
        "experienceYears": 5,
        "education": [{"school": "Universitet", "degree": "Bakalavr"}]
      }

      CV Mətni:
      ${resumeText}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const aiData = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    
    // 3. Upload to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'resumes',
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
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

    // 4. Persistence - Create/Update virtual User
    const virtualClerkId = `virtual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const candidate = await prisma.user.upsert({
      where: { email: aiData.email || `temp_${Date.now()}@virtual.com` },
      update: {
        skills: aiData.skills || [],
        bio: aiData.summary || '',
        location: aiData.location || 'Məlumat yoxdur',
        name: aiData.name || 'Yeni Namizəd',
        education: aiData.education || []
      },
      create: {
        clerkId: virtualClerkId,
        email: aiData.email || `temp_${Date.now()}@virtual.com`,
        name: aiData.name || 'Yeni Namizəd',
        role: 'CANDIDATE',
        skills: aiData.skills || [],
        bio: aiData.summary || '',
        location: aiData.location || 'Məlumat yoxdur',
        education: aiData.education || []
      }
    });

    await prisma.resume.create({
      data: {
        userId: candidate.id,
        name: file.originalname,
        size: file.size,
        url: cloudinaryResult.secure_url
      }
    });

    // 6. Increment upload count if it's a logged-in employer
    if (userId) {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { cvUploadCount: { increment: 1 } }
      });
    }

    res.status(200).json({ 
      message: 'Namizəd analiz edildi və hovuza əlavə olundu',
      candidateId: candidate.id,
      aiData 
    });

  } catch (error: any) {
    console.error('analyzeAndAddToPool error:', error);
    res.status(500).json({ message: 'Analiz zamanı xəta yarandı', error: error.message });
  }
};
