import twilio from 'twilio';

// Initialize Twilio client only if credentials exist
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export const sendWhatsAppNotification = async (phoneNumber: string, message: string) => {
  try {
    if (!client || !fromNumber) {
      console.warn('[WhatsApp] Twilio etimadnamələri (.env) eksikdir. Mesaj konsola yazılır:');
      console.log(`To: ${phoneNumber}\nMessage: ${message}`);
      return { success: false, error: 'Twilio not configured', isMock: true };
    }

    // Format phone number to E.164 if needed (assuming AZ prefix if missing)
    let formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+994${phoneNumber.replace(/^0+/, '')}`;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`[WhatsApp Notification] Sent successfully. SID: ${response.sid}`);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('[WhatsApp Notification] Error:', error);
    return { success: false, error };
  }
};

export const sendNewJobWhatsAppNotification = async (jobTitle: string, salary: string, link: string) => {
  const message = `🚀 Yeni Vakansiya!\n\n📌 Vəzifə: ${jobTitle}\n💰 Maaş: ${salary}\n🔗 Ətraflı: ${link}\n\nWDS Jobs - Sizin iş bələdçiniz!`;
  
  // Note: For broadcast, we would fetch a list of subscribed numbers. 
  // Currently we just log since broadcast requires looping through numbers.
  console.log('--- WhatsApp Broadcast Simulation ---');
  console.log(message);
};
