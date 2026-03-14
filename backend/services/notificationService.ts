import prisma from '../lib/prisma';

export const sendNewApplicationNotification = async (applicationId: string) => {
  try {
    // 1. Get application details with job and employer
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        job: {
          include: {
            employer: true
          }
        },
        candidate: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!application || !application.job.employer) return;

    const employer = application.job.employer;
    const settings: any = employer.notificationSettings || {};
    const candidateRating = application.rating || 0;

    // 2. Check "New Applications" setting
    if (!settings.newApplications) {
      console.log(`Notification skipped for employer ${employer.email}: "New Applications" setting is OFF.`);
      return;
    }

    // 3. Check "Smart Filter" (minRating)
    const minRatingStr = settings.minRating || 'any';
    if (minRatingStr !== 'any') {
      const minRating = parseInt(minRatingStr);
      if (candidateRating < minRating) {
        console.log(`Notification skipped for employer ${employer.email}: Rating ${candidateRating} is below threshold ${minRating}.`);
        return;
      }
    }

    // 4. Send Notification (Simulated for now, can be extended with Nodemailer/SendGrid)
    console.log('--- Real-Notification Triggered ---');
    console.log(`To: ${employer.email}`);
    console.log(`Subject: Yeni Müraciət - ${application.job.title}`);
    console.log(`Message: ${application.candidate?.name} (${application.candidate?.email}) vakansiyanıza müraciət etdi. AI Qiymətləndirməsi: ${candidateRating} ulduz.`);
    
    // NOTE: In a production environment, you would call an email service here.
    // Example: await emailService.sendMail({ ... });

  } catch (error) {
    console.error('Error sending new application notification:', error);
  }
};
