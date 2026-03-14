"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getApplications = exports.applyForJob = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const groq_1 = __importDefault(require("../lib/groq"));
const cloudinary_1 = require("../lib/cloudinary");
const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.auth.userId;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'CV faylı yüklənməyib' });
        }
        console.log('--- Resume Analysis Started (Memory Mode) ---');
        console.log('File Name:', file.originalname);
        // 1. Extract text from PDF buffer directly
        console.log('1. Attempting to parse PDF text from buffer...');
        let pdfData;
        try {
            pdfData = await (0, pdf_parse_1.default)(file.buffer);
            console.log('PDF text extracted, characters:', pdfData.text?.length || 0);
        }
        catch (parseError) {
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
      ${resumeText.substring(0, 5000)}
    `;
        const chatCompletion = await groq_1.default.chat.completions.create({
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
                const extension = file.originalname.split('.').pop()?.toLowerCase() || 'pdf';
                const baseName = file.originalname.split('.')[0] || 'resume';
                const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                    folder: 'resumes',
                    resource_type: 'auto',
                    public_id: `${Date.now()}-${baseName}`,
                    format: extension
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                stream.end(file.buffer);
            });
        };
        const cloudinaryResult = await uploadToCloudinary();
        console.log('Cloudinary Upload Success:', cloudinaryResult.secure_url);
        // 4. Find the local user ID from Clerk ID
        console.log('5. Finding local user in DB...');
        const user = await prisma_1.default.user.findUnique({
            where: { clerkId: userId }
        });
        if (!user) {
            console.error('User not found in DB for Clerk ID:', userId);
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        }
        // 5. Save to database
        console.log('6. Saving application to DB...');
        const application = await prisma_1.default.application.create({
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
    }
    catch (error) {
        console.error('Apply for job error:', error);
        res.status(500).json({ message: 'Müraciət zamanı xəta baş verdi', error: error.message });
    }
};
exports.applyForJob = applyForJob;
const getApplications = async (req, res) => {
    try {
        const { jobId } = req.query;
        console.log('Fetching applications. jobId filter:', jobId || 'none');
        const applications = await prisma_1.default.application.findMany({
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
        // Fix URLs on the fly if they are missing extensions (for old data)
        const fixedApplications = applications.map(app => {
            const url = app.resumeUrl || '';
            const hasExtension = /\.(pdf|docx|doc|txt|png|jpg|jpeg)$/i.test(url.split('?')[0]);
            if (url.includes('cloudinary') && !hasExtension) {
                return { ...app, resumeUrl: `${url}.pdf` };
            }
            return app;
        });
        res.json(fixedApplications);
    }
    catch (error) {
        res.status(500).json({ message: 'Müraciətləri gətirərkən xəta baş verdi', error });
    }
};
exports.getApplications = getApplications;
const updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { stage, rating } = req.body;
        const updated = await prisma_1.default.application.update({
            where: { id },
            data: { stage, rating }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Müraciət yenilənərkən xəta baş verdi', error });
    }
};
exports.updateApplication = updateApplication;
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.application.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Müraciət silinərkən xəta baş verdi', error });
    }
};
exports.deleteApplication = deleteApplication;
