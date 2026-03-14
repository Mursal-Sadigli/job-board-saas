import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const createInterview = async (req: any, res: Response) => {
  try {
    const { 
      candidateName, 
      candidateEmail, 
      role, 
      date, 
      time, 
      type, 
      location, 
      link, 
      notes 
    } = req.body;
    const clerkId = req.auth.userId;

    // Find the local user (employer)
    const employer = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    const interview = await prisma.interview.create({
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
  } catch (error: any) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: 'Müsahibə yaradılarkən xəta baş verdi', error: error.message });
  }
};

export const getInterviews = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth.userId;

    const employer = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    const interviews = await prisma.interview.findMany({
      where: { employerId: employer.id },
      orderBy: { date: 'asc' }
    });

    res.json(interviews);
  } catch (error: any) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Müsahibələri gətirərkən xəta baş verdi', error: error.message });
  }
};

export const deleteInterview = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const clerkId = req.auth.userId;

    const employer = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    const interview = await prisma.interview.findUnique({
      where: { id }
    });

    if (!interview || interview.employerId !== employer.id) {
      return res.status(404).json({ message: 'Müsahibə tapılmadı və ya icazəniz yoxdur' });
    }

    await prisma.interview.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Müsahibə silinərkən xəta baş verdi', error: error.message });
  }
};

export const updateInterview = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const clerkId = req.auth.userId;

    const employer = await prisma.user.findUnique({
      where: { clerkId }
    });

    if (!employer) {
      return res.status(404).json({ message: 'İşəgötürən tapılmadı' });
    }

    const interview = await prisma.interview.findUnique({
      where: { id }
    });

    if (!interview || interview.employerId !== employer.id) {
      return res.status(404).json({ message: 'Müsahibə tapılmadı və ya icazəniz yoxdur' });
    }

    const updated = await prisma.interview.update({
      where: { id },
      data: updateData
    });

    res.json(updated);
  } catch (error: any) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Müsahibə yenilənərkən xəta baş verdi', error: error.message });
  }
};
