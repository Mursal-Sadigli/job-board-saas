"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInterview = exports.deleteInterview = exports.getInterviews = exports.createInterview = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createInterview = async (req, res) => {
    try {
        const { candidateName, candidateEmail, role, date, time, type, location, link, notes } = req.body;
        const clerkId = req.auth.userId;
        // Find the local user (employer)
        const employer = await prisma_1.default.user.findUnique({
            where: { clerkId }
        });
        if (!employer) {
            return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
        }
        const interview = await prisma_1.default.interview.create({
            data: {
                candidateName,
                candidateEmail,
                role,
                date,
                time,
                type,
                location,
                link,
                notes,
                employerId: employer.id
            }
        });
        res.status(201).json(interview);
    }
    catch (error) {
        console.error('Create interview error:', error);
        res.status(500).json({ message: 'Müsahibə yaradılarkən xəta baş verdi', error: error.message });
    }
};
exports.createInterview = createInterview;
const getInterviews = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const employer = await prisma_1.default.user.findUnique({
            where: { clerkId }
        });
        if (!employer) {
            return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
        }
        const interviews = await prisma_1.default.interview.findMany({
            where: { employerId: employer.id },
            orderBy: { date: 'asc' }
        });
        res.json(interviews);
    }
    catch (error) {
        console.error('Get interviews error:', error);
        res.status(500).json({ message: 'Müsahibələri gətirərkən xəta baş verdi', error: error.message });
    }
};
exports.getInterviews = getInterviews;
const deleteInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const clerkId = req.auth.userId;
        const employer = await prisma_1.default.user.findUnique({
            where: { clerkId }
        });
        if (!employer) {
            return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
        }
        const interview = await prisma_1.default.interview.findUnique({
            where: { id }
        });
        if (!interview || interview.employerId !== employer.id) {
            return res.status(404).json({ message: 'Müsahibə tapılmadı və ya icazəniz yoxdur' });
        }
        await prisma_1.default.interview.delete({
            where: { id }
        });
        res.status(204).send();
    }
    catch (error) {
        console.error('Delete interview error:', error);
        res.status(500).json({ message: 'Müsahibə silinərkən xəta baş verdi', error: error.message });
    }
};
exports.deleteInterview = deleteInterview;
const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const clerkId = req.auth.userId;
        const employer = await prisma_1.default.user.findUnique({
            where: { clerkId }
        });
        if (!employer) {
            return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
        }
        const interview = await prisma_1.default.interview.findUnique({
            where: { id }
        });
        if (!interview || interview.employerId !== employer.id) {
            return res.status(404).json({ message: 'Müsahibə tapılmadı və ya icazəniz yoxdur' });
        }
        const updated = await prisma_1.default.interview.update({
            where: { id },
            data: updateData
        });
        res.json(updated);
    }
    catch (error) {
        console.error('Update interview error:', error);
        res.status(500).json({ message: 'Müsahibə yenilənərkən xəta baş verdi', error: error.message });
    }
};
exports.updateInterview = updateInterview;
