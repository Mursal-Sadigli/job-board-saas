/**
 * WhatsApp Notification Service (Mock)
 * Currently set up to log notifications instead of sending real messages.
 */

export const sendWhatsAppNotification = async (phoneNumber: string, message: string) => {
  try {
    console.log(`[WhatsApp Notification (Mock)] Sending to: ${phoneNumber}`);
    console.log(`[WhatsApp Notification (Mock)] Message: ${message}`);
    
    return { success: true, messageId: `mock_wa_${Date.now()}` };
  } catch (error) {
    console.error('WhatsApp Notification Error:', error);
    return { success: false, error };
  }
};

export const sendNewJobWhatsAppNotification = async (jobTitle: string, salary: string, link: string) => {
  const message = `🚀 Yeni Vakansiya!\n\n📌 Vəzifə: ${jobTitle}\n💰 Maaş: ${salary}\n🔗 Ətraflı: ${link}\n\nWDS Jobs - Sizin iş bələdçiniz!`;
  
  // For demo/mock purposes, we log it
  console.log('--- WhatsApp Broadcast Simulation ---');
  console.log(message);
};
