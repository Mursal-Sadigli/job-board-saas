"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = exports.getAllJobs = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllJobs = async (req, res) => {
    try {
        const jobs = await prisma_1.default.job.findMany({
            where: { isActive: true },
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
const createJob = async (req, res) => {
    try {
        const { title, description, company, location, locationType, jobType, experienceLevel, salary, employerId } = req.body;
        const newJob = await prisma_1.default.job.create({
            data: {
                title,
                description,
                company,
                location,
                locationType,
                jobType,
                experienceLevel,
                salary,
                employerId
            }
        });
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(500).json({ message: 'İş elanı yaradılarkən xəta baş verdi', error });
    }
};
exports.createJob = createJob;
