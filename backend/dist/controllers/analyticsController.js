"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployerAnalytics = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getEmployerAnalytics = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        // 1. Find employer
        const employer = await prisma_1.default.user.findUnique({
            where: { clerkId },
            include: {
                jobs: {
                    include: {
                        applications: true
                    }
                }
            }
        });
        if (!employer) {
            return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
        }
        // 2. Aggregate Stats
        const allApplications = employer.jobs.flatMap(job => job.applications);
        const totalCandidates = allApplications.length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newApplications = allApplications.filter(app => new Date(app.appliedAt) > thirtyDaysAgo).length;
        const interviewCount = allApplications.filter(app => app.stage === 'Interview').length;
        // 3. Average Time to Hire
        // We consider "Hired" as the final stage to calculate this
        const hiredApplications = allApplications.filter(app => app.stage === 'Hired');
        let avgTimeToHire = 0;
        if (hiredApplications.length > 0) {
            const totalDays = hiredApplications.reduce((acc, app) => {
                const start = new Date(app.appliedAt);
                const end = new Date(app.updatedAt);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return acc + diffDays;
            }, 0);
            avgTimeToHire = Math.round(totalDays / hiredApplications.length);
        }
        // 4. Pipeline Data
        const stages = ['Applied', 'Screening', 'Interview', 'Offered', 'Hired', 'Rejected'];
        const pipelineData = stages.map(stage => {
            const count = allApplications.filter(app => app.stage === stage).length;
            const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
            // Map names to display friendly ones
            const stageMap = {
                'Applied': 'Müraciət',
                'Screening': 'Skanlama',
                'Interview': 'Müsahibə',
                'Offered': 'Təklif',
                'Hired': 'İşə Qəbul',
                'Rejected': 'Rədd'
            };
            return {
                stage: stageMap[stage] || stage,
                count,
                percentage
            };
        });
        // 5. Source analysis (Mocked for now as we don't track source in DB)
        const sourceAnalysis = [
            { label: "LinkedIn", color: "bg-blue-500", percentage: "64%" },
            { label: "Referral", color: "bg-emerald-500", percentage: "18%" },
            { label: "Job Boards", color: "bg-purple-500", percentage: "12%" },
            { label: "Digər", color: "bg-orange-500", percentage: "6%" },
        ];
        // 6. Trends (Comparison with previous 30 days - Simplified)
        // For now we use some plausible trends
        const stats = [
            {
                label: "Cəmi Namizəd",
                value: totalCandidates.toString(),
                change: "+5%",
                trending: "up",
                icon: "Users",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
            },
            {
                label: "Yeni Müraciətlər",
                value: newApplications.toString(),
                change: "+12%",
                trending: "up",
                icon: "TrendingUp",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
            },
            {
                label: "Müsahibə Mərhələsi",
                value: interviewCount.toString(),
                change: "+2%",
                trending: "up",
                icon: "UserCheck",
                color: "text-orange-500",
                bg: "bg-orange-500/10"
            },
            {
                label: "Orta İşə Qəbul Vaxtı",
                value: avgTimeToHire > 0 ? `${avgTimeToHire} gün` : "0 gün",
                change: "-3%",
                trending: "down",
                icon: "Clock",
                color: "text-purple-500",
                bg: "bg-purple-500/10"
            },
        ];
        res.json({
            stats,
            pipelineData,
            sourceAnalysis
        });
    }
    catch (error) {
        console.error('getEmployerAnalytics error:', error);
        res.status(500).json({ message: 'Analitika məlumatlarını gətirərkən xəta baş verdi', error: error.message });
    }
};
exports.getEmployerAnalytics = getEmployerAnalytics;
