import prisma from '../lib/prisma';
import axios from 'axios';
import { sendWhatsAppNotification } from './whatsappService';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // Məsələn: @vakansiyalar_az

/**
 * Telegram-a mesaj göndərən köməkçi funksiya
 */
const sendTelegramMessage = async (chatId: string, text: string) => {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram Bot Token tapılmadı (.env faylını yoxlayın)');
    return;
  }
  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error: any) {
    console.error('Telegram message error:', error.response?.data || error.message);
  }
};

/**
 * Yeni vakansiya paylaşıldıqda Telegram kanalına və abunəçilərə bildiriş göndərir
 */
export const sendJobNotificationToTelegram = async (jobId: string) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { category: true }
    });

    if (!job) return;

    const message = `
🔔 <b>Yeni Vakansiya!</b>

💼 <b>Vəzifə:</b> ${job.title}
🏢 <b>Şirkət:</b> ${job.company}
📍 <b>Məkan:</b> ${job.city || job.location}
💰 <b>Maaş:</b> ${job.salary || 'Razılaşma yolu ilə'}
📂 <b>Kateqoriya:</b> ${job.category?.name || 'Digər'}

🔗 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/jobs/${job.id}">Ətraflı bax və müraciət et</a>
    `;

    // 1. Kanala göndər (Hər kəs üçün)
    if (TELEGRAM_CHANNEL_ID) {
      await sendTelegramMessage(TELEGRAM_CHANNEL_ID, message);
    }

    // 2. Namizədlərə göndər (Gələcəkdə filtrasiya əsasında fərdiləşdirilə bilər)
    // Şimdilik yalnız kanala kifayətdir

    // WhatsApp bildirişi (əlavə olaraq)
    // Bu hissə gələcəkdə abunəçilərə göndərmək üçün genişləndirilə bilər
    // Hal-hazırda sadəcə bir nümunə olaraq qeyd olunur
    // await sendWhatsAppNotification('TARGET_PHONE_NUMBER', `Yeni Vakansiya: ${job.title} - ${job.company}. Ətraflı: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/jobs/${job.id}`);

  } catch (error) {
    console.error('sendJobNotificationToTelegram error:', error);
  }
};

export const sendNewApplicationNotification = async (applicationId: string) => {
  try {
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
            email: true,
            phone: true // WhatsApp üçün telefon nömrəsi əlavə edildi
          }
        }
      }
    });

    if (!application || !application.job.employer) return;

    const employer = application.job.employer;
    const settings: any = employer.notificationSettings || {};
    const candidateRating = application.rating || 0;

    // Setting checks
    const sendEmail = !!settings.newApplications;
    const sendTelegram = !!settings.telegramNewApplications;
    const sendWhatsApp = !!settings.whatsappNewApplications; // WhatsApp bildirişi üçün setting

    // Telegram Bildirişi (İşəgötürənin özünə)
    if (sendTelegram && employer.telegramId) {
      const tgMessage = `
📩 <b>Yeni Müraciət!</b>

👤 <b>Namizəd:</b> ${application.candidate?.name}
🎯 <b>Vakansiya:</b> ${application.job.title}
⭐ <b>AI Reytinqi:</b> ${candidateRating}/5 ulduz

Namizədin CV-sini və AI analizini görmək üçün idarəetmə panelinə daxil olun.
      `;
      await sendTelegramMessage(employer.telegramId, tgMessage);
    }

    // WhatsApp Bildirişi (İşəgötürənin özünə)
    if (sendWhatsApp && employer.phone) { // İşəgötürənin telefon nömrəsi olmalıdır
      const whatsappMessage = `Yeni Müraciət!
Namizəd: ${application.candidate?.name}
Vakansiya: ${application.job.title}
AI Reytinqi: ${candidateRating}/5 ulduz

Namizədin CV-sini və AI analizini görmək üçün idarəetmə panelinə daxil olun.`;
      await sendWhatsAppNotification(employer.phone, whatsappMessage);
    }

    // Email LOG (Simulyasiya)
    if (sendEmail) {
      console.log(`Notification sent to ${employer.email} for application ${applicationId}`);
    }

  } catch (error) {
    console.error('Error sending new application notification:', error);
  }
};
