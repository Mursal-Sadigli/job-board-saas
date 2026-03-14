import { Request, Response } from 'express';
import prisma from '../lib/prisma';

import axios from 'axios';
import pdf from 'pdf-parse';
import groq from '../lib/groq';

export const applyForJob = async (req: any, res: Response) => {
  try {
    const { jobId } = req.body;
    const userId = req.auth.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'CV faylı yüklənməyib' });
    }

    console.log('--- Resume Analysis Started ---');
    console.log('File Path (URL):', file.path);

    // 1. Fetch file from Cloudinary to get buffer
    console.log('1. Fetching file buffer from Cloudinary...');
    const response = await axios.get(file.path, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    console.log('File buffer fetched successfully, size:', buffer.length);

    // 2. Extract text from PDF
    console.log('2. Attempting to parse PDF text...');
    let pdfData;
    try {
      pdfData = await pdf(buffer);
      console.log('PDF text extracted, characters:', pdfData.text?.length || 0);
    } catch (parseError: any) {
      console.error('Detailed PDF Parse Error:', parseError);
      throw parseError;
    }
    const resumeText = pdfData.text;

    // 3. Analyze with Groq AI
    console.log('3. Sending to Groq AI for analysis...');
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
      ${resumeText.substring(0, 5000)}
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const aiAnalysis = JSON.parse(chatCompletion.choices[0].message.content || '{}');
    console.log('4. AI Analysis Result:', aiAnalysis);

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
        resumeUrl: file.path,
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

export const getApplications = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.query;
    console.log('Fetching applications. jobId filter:', jobId || 'none');
    
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
    
    console.log(`Found ${applications.length} applications`);
    res.json(applications);
  } catch (error) {
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
