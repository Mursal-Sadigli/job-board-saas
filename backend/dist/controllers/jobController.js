"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeJob = exports.incrementJobView = exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobsByEmployer = exports.getAllJobs = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllJobs = async (req, res) => {
    try {
        const { category } = req.query;
        const jobs = await prisma_1.default.job.findMany({
            where: {
                isActive: true,
                ...(category && category !== 'any' ? { category: String(category) } : {})
            },
            orderBy: { postedAt: 'desc' },
            include: {
                employer: {
                    select: {
                        companyName: true,
                        logoUrl: true
                    }
                }
            }
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'İş elanlarını gətirərkən xəta baş verdi', error });
    }
};
exports.getAllJobs = getAllJobs;
const getJobsByEmployer = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId)
            return res.status(401).json({ message: 'İcazə yoxdur' });
        // Find local user from clerk ID
        const user = await prisma_1.default.user.findUnique({ where: { clerkId } });
        if (!user)
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        const jobs = await prisma_1.default.job.findMany({
            where: { employerId: user.id },
            orderBy: { postedAt: 'desc' },
            include: {
                _count: { select: { applications: true } },
                applications: {
                    select: {
                        id: true,
                        stage: true,
                        rating: true,
                        appliedAt: true,
                        resumeUrl: true,
                        candidate: { select: { name: true, email: true } }
                    },
                    orderBy: { appliedAt: 'desc' }
                }
            }
        });
        res.json(jobs);
    }
    catch (error) {
        res.status(500).json({ message: 'Elanları gətirərkən xəta baş verdi', error });
    }
};
exports.getJobsByEmployer = getJobsByEmployer;
const createJob = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId)
            return res.status(401).json({ message: 'İcazə yoxdur' });
        const user = await prisma_1.default.user.findUnique({ where: { clerkId } });
        if (!user)
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        const { title, description, company, location, locationType, jobType, category, experienceLevel, salary, city, district, deadline, isFeatured } = req.body;
        const logoUrl = req.file ? req.file.path : undefined;
        const newJob = await prisma_1.default.job.create({
            data: {
                title,
                description,
                company: company || user.companyName || 'Şirkət',
                location: [city, district].filter(Boolean).join(', ') || location || '',
                locationType,
                jobType,
                category: category || 'other',
                experienceLevel,
                salary,
                logoUrl,
                isFeatured: isFeatured === 'true' || isFeatured === true, // handle string from FormData
                employerId: user.id
            }
        });
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(500).json({ message: 'İş elanı yaradılarkən xəta baş verdi', error });
    }
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId)
            return res.status(401).json({ message: 'İcazə yoxdur' });
        const user = await prisma_1.default.user.findUnique({ where: { clerkId } });
        if (!user)
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        const { id } = req.params;
        const { title, description, company, location, locationType, jobType, category, experienceLevel, salary, isActive, isFeatured, city, district } = req.body;
        // Verify ownership
        const existing = await prisma_1.default.job.findFirst({ where: { id, employerId: user.id } });
        if (!existing)
            return res.status(404).json({ message: 'Elan tapılmadı' });
        const logoUrl = req.file ? req.file.path : undefined;
        const updated = await prisma_1.default.job.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(company !== undefined && { company }),
                ...(locationType !== undefined && { locationType }),
                ...(jobType !== undefined && { jobType }),
                ...(category !== undefined && { category }),
                ...(experienceLevel !== undefined && { experienceLevel }),
                ...(salary !== undefined && { salary }),
                ...(isActive !== undefined && (isActive === 'true' || isActive === true ? { isActive: true } : { isActive: false })),
                ...(isFeatured !== undefined && (isFeatured === 'true' || isFeatured === true ? { isFeatured: true } : { isFeatured: false })),
                ...(logoUrl && { logoUrl }),
                ...((city !== undefined || district !== undefined) && {
                    location: [city ?? '', district ?? ''].filter(Boolean).join(', ')
                }),
                ...(location !== undefined && !city && !district && { location }),
            }
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Elan yenilənərkən xəta baş verdi', error });
    }
};
exports.updateJob = updateJob;
const deleteJob = async (req, res) => {
    try {
        const clerkId = req.auth?.userId;
        if (!clerkId)
            return res.status(401).json({ message: 'İcazə yoxdur' });
        const user = await prisma_1.default.user.findUnique({ where: { clerkId } });
        if (!user)
            return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
        const { id } = req.params;
        // Verify ownership
        const existing = await prisma_1.default.job.findFirst({ where: { id, employerId: user.id } });
        if (!existing)
            return res.status(404).json({ message: 'Elan tapılmadı' });
        // Delete applications first, then job
        await prisma_1.default.application.deleteMany({ where: { jobId: id } });
        await prisma_1.default.job.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Elan silinərkən xəta baş verdi', error });
    }
};
exports.deleteJob = deleteJob;
const incrementJobView = async (req, res) => {
    try {
        const { id } = req.params;
        // Yalnız bazada varsa yeniləyək
        const job = await prisma_1.default.job.findUnique({ where: { id } });
        if (!job)
            return res.status(404).json({ message: 'İş elanı tapılmadı' });
        const updatedJob = await prisma_1.default.job.update({
            where: { id },
            data: {
                viewsCount: { increment: 1 }
            }
        });
        res.json({ viewsCount: updatedJob.viewsCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Baxış sayı artırılarkən xəta baş verdi', error });
    }
};
exports.incrementJobView = incrementJobView;
const likeJob = async (req, res) => {
    try {
        const { id } = req.params;
        // Auth tələb etmirik ki, qonaqlar da test edə bilsin. İdealda istifadəçiyə görə məhdudlaşdırıla bilər.
        const job = await prisma_1.default.job.findUnique({ where: { id } });
        if (!job)
            return res.status(404).json({ message: 'İş elanı tapılmadı' });
        const updatedJob = await prisma_1.default.job.update({
            where: { id },
            data: {
                likesCount: { increment: 1 }
            }
        });
        res.json({ likesCount: updatedJob.likesCount });
    }
    catch (error) {
        res.status(500).json({ message: 'Bəyənmə xətası', error });
    }
};
exports.likeJob = likeJob;
