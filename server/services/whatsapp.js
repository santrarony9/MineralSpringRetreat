import { readDB, writeDB } from '../db.js';
import { logActivity } from '../auth.js';

/**
 * Format the booking details into the exact WhatsApp notification format
 * requested by Mineral Springs Retreat
 */
export function formatBookingWhatsAppMessage(booking) {
  const guestName = booking.guestName || booking.name || 'Guest';
  const phone = booking.phone || 'Not provided';
  const email = booking.email || 'Not provided';
  const bookingId = booking.id || 'N/A';
  const checkIn = booking.checkIn || 'N/A';
  const checkOut = booking.checkOut || 'N/A';
  const adults = booking.adults !== undefined ? booking.adults : 1;
  const children = booking.children !== undefined ? booking.children : 0;
  const roomType = booking.room || booking.roomType || 'Deluxe Valley View Room';
  const numRooms = booking.numRooms || booking.rooms || 1;
  const specialRequests = booking.specialRequests && booking.specialRequests.trim()
    ? booking.specialRequests.trim()
    : 'None';
  const status = booking.status || 'Pending';

  return (
    `*NEW ROOM BOOKING – MINERAL SPRINGS RETREAT*\n\n` +
    `A new booking request has been received.\n\n` +
    `*Guest Details:*\n` +
    `- Name: ${guestName}\n` +
    `- Phone: ${phone}\n` +
    `- Email: ${email}\n\n` +
    `*Booking Details:*\n` +
    `- Booking ID: ${bookingId}\n` +
    `- Check-in: ${checkIn}\n` +
    `- Check-out: ${checkOut}\n` +
    `- Adults: ${adults}\n` +
    `- Children: ${children}\n` +
    `- Room Type: ${roomType}\n` +
    `- Number of Rooms: ${numRooms}\n` +
    `- Special Requests: ${specialRequests}\n\n` +
    `*Booking Status:* ${status}\n\n` +
    `Please log in to your admin dashboard to review this booking.`
  );
}

/**
 * Format a booking cancellation notification message
 */
export function formatBookingCancellationMessage(booking) {
  const guestName = booking.guestName || booking.name || 'Guest';
  const phone = booking.phone || 'Not provided';
  const email = booking.email || 'Not provided';
  const bookingId = booking.id || 'N/A';
  const checkIn = booking.checkIn || 'N/A';
  const checkOut = booking.checkOut || 'N/A';
  const roomType = booking.room || booking.roomType || 'Deluxe Valley View Room';

  return (
    `*BOOKING CANCELLED – MINERAL SPRINGS RETREAT*\n\n` +
    `A booking cancellation has been received.\n\n` +
    `*Guest Details:*\n` +
    `- Name: ${guestName}\n` +
    `- Phone: ${phone}\n` +
    `- Email: ${email}\n\n` +
    `*Booking Details:*\n` +
    `- Booking ID: ${bookingId}\n` +
    `- Check-in: ${checkIn}\n` +
    `- Check-out: ${checkOut}\n` +
    `- Room Type: ${roomType}\n\n` +
    `*Booking Status:* Cancelled\n\n` +
    `Please log in to your admin dashboard to review this cancellation.`
  );
}

/**
 * Format a booking modification notification message
 */
export function formatBookingModificationMessage(booking) {
  const guestName = booking.guestName || booking.name || 'Guest';
  const phone = booking.phone || 'Not provided';
  const email = booking.email || 'Not provided';
  const bookingId = booking.id || 'N/A';
  const checkIn = booking.checkIn || 'N/A';
  const checkOut = booking.checkOut || 'N/A';
  const adults = booking.adults !== undefined ? booking.adults : 1;
  const children = booking.children !== undefined ? booking.children : 0;
  const roomType = booking.room || booking.roomType || 'Deluxe Valley View Room';
  const numRooms = booking.numRooms || booking.rooms || 1;
  const specialRequests = booking.specialRequests && booking.specialRequests.trim()
    ? booking.specialRequests.trim()
    : 'None';
  const status = booking.status || 'Updated';

  return (
    `*BOOKING MODIFIED – MINERAL SPRINGS RETREAT*\n\n` +
    `A booking modification has been received.\n\n` +
    `*Guest Details:*\n` +
    `- Name: ${guestName}\n` +
    `- Phone: ${phone}\n` +
    `- Email: ${email}\n\n` +
    `*Updated Booking Details:*\n` +
    `- Booking ID: ${bookingId}\n` +
    `- Check-in: ${checkIn}\n` +
    `- Check-out: ${checkOut}\n` +
    `- Adults: ${adults}\n` +
    `- Children: ${children}\n` +
    `- Room Type: ${roomType}\n` +
    `- Number of Rooms: ${numRooms}\n` +
    `- Special Requests: ${specialRequests}\n\n` +
    `*Booking Status:* ${status}\n\n` +
    `Please log in to your admin dashboard to review this modification.`
  );
}

/**
 * Sanitize phone number for Meta WhatsApp Cloud API (country code without +, spaces, or dashes)
 */
export function sanitizeWhatsAppNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned;
}

/**
 * Retrieve WhatsApp configuration from Database or Environment Variables
 */
export function getWhatsAppConfig() {
  const db = readDB();
  const dbConfig = db?.settings?.whatsappNotificationConfig || {};

  const enabled = dbConfig.enabled !== undefined
    ? Boolean(dbConfig.enabled)
    : process.env.WHATSAPP_NOTIFICATIONS_ENABLED !== 'false';

  const hostPhone = dbConfig.hostPhone ||
    process.env.WHATSAPP_HOST_PHONE ||
    db?.settings?.whatsapp ||
    db?.settings?.phone ||
    '+917908192498';

  const phoneNumberId = dbConfig.phoneNumberId ||
    process.env.WHATSAPP_PHONE_NUMBER_ID ||
    'placeholder_phone_number_id';

  const accessToken = dbConfig.accessToken ||
    process.env.WHATSAPP_ACCESS_TOKEN ||
    'placeholder_access_token';

  const businessAccountId = dbConfig.businessAccountId ||
    process.env.WHATSAPP_BUSINESS_ACCOUNT_ID ||
    '';

  const apiVersion = dbConfig.apiVersion ||
    process.env.WHATSAPP_API_VERSION ||
    'v21.0';

  const templateName = dbConfig.templateName ||
    process.env.WHATSAPP_TEMPLATE_NAME ||
    '';

  const isConfigured = Boolean(
    accessToken &&
    phoneNumberId &&
    !accessToken.includes('placeholder') &&
    !phoneNumberId.includes('placeholder')
  );

  return {
    enabled,
    hostPhone,
    cleanHostPhone: sanitizeWhatsAppNumber(hostPhone),
    phoneNumberId,
    accessToken,
    businessAccountId,
    apiVersion,
    templateName,
    isConfigured,
    devMode: !isConfigured
  };
}

/**
 * Save WhatsApp configuration in Database
 */
export function saveWhatsAppConfig(configUpdate) {
  const db = readDB();
  if (!db) throw new Error('Database unavailable');
  if (!db.settings) db.settings = {};

  const currentConfig = db.settings.whatsappNotificationConfig || {};
  db.settings.whatsappNotificationConfig = {
    ...currentConfig,
    ...configUpdate,
    updatedAt: new Date().toISOString()
  };

  writeDB(db);
  return getWhatsAppConfig();
}

/**
 * Core function to send an automated WhatsApp message to the host.
 * Supports events: 'new' | 'cancel' | 'modify'
 */
export async function sendWhatsAppBookingNotification(booking, eventType = 'new') {
  if (!booking || !booking.id) {
    console.warn('[WHATSAPP] Cannot send notification: invalid booking object');
    return { success: false, error: 'Invalid booking data' };
  }

  // Idempotency: Prevent duplicate notifications for the exact same event on a booking
  const eventFlagKey = `whatsapp_${eventType}_sent`;
  if (booking[eventFlagKey]) {
    console.log(`[WHATSAPP] ${eventType.toUpperCase()} notification already sent for booking ${booking.id}. Skipping duplicate.`);
    return { success: true, skipped: true, message: `Notification already sent for ${eventType}` };
  }

  const config = getWhatsAppConfig();

  if (!config.enabled) {
    console.log(`[WHATSAPP] Notifications disabled in configuration. Skipping booking ${booking.id}.`);
    return { success: true, skipped: true, message: 'Notifications disabled' };
  }

  let messageText = '';
  if (eventType === 'cancel') {
    messageText = formatBookingCancellationMessage(booking);
  } else if (eventType === 'modify') {
    messageText = formatBookingModificationMessage(booking);
  } else {
    messageText = formatBookingWhatsAppMessage(booking);
  }

  const targetRecipient = config.cleanHostPhone;

  if (!targetRecipient) {
    console.error(`[WHATSAPP] Missing host recipient phone number for booking ${booking.id}`);
    return { success: false, error: 'No recipient phone number configured' };
  }

  console.log(`[WHATSAPP] Initiating ${eventType.toUpperCase()} notification for booking ${booking.id} to host ${targetRecipient}...`);

  try {
    if (config.isConfigured) {
      // Send via Official Meta WhatsApp Business Cloud API
      const endpoint = `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`;

      let payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: targetRecipient,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText
        }
      };

      // If approved template is configured, use template structure
      if (config.templateName) {
        payload = {
          messaging_product: 'whatsapp',
          to: targetRecipient,
          type: 'template',
          template: {
            name: config.templateName,
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: booking.guestName || 'Guest' },
                  { type: 'text', text: booking.id || 'N/A' },
                  { type: 'text', text: booking.checkIn || 'N/A' },
                  { type: 'text', text: booking.checkOut || 'N/A' },
                  { type: 'text', text: booking.room || 'Deluxe Valley View' }
                ]
              }
            ]
          }
        };
      }

      const apiRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseData = await apiRes.json();

      if (!apiRes.ok || responseData.error) {
        const errorMsg = responseData.error?.message || responseData.error?.error_user_msg || 'Meta Cloud API call failed';
        console.error(`[WHATSAPP_ERROR] Meta API error for booking ${booking.id}:`, responseData.error);

        updateBookingNotificationStatus(booking.id, {
          status: 'failed',
          eventType,
          provider: 'meta_cloud_api',
          error: errorMsg,
          attemptedAt: new Date().toISOString(),
          recipient: targetRecipient
        });

        return {
          success: false,
          error: errorMsg,
          details: responseData.error
        };
      }

      // Success with Meta Cloud API
      const messageId = responseData.messages?.[0]?.id || 'meta-msg-' + Date.now();
      console.log(`[WHATSAPP_SUCCESS] Meta WhatsApp message delivered! Message ID: ${messageId}`);

      updateBookingNotificationStatus(booking.id, {
        status: 'sent',
        eventType,
        provider: 'meta_cloud_api',
        messageId,
        recipient: targetRecipient,
        sentAt: new Date().toISOString()
      }, eventFlagKey);

      logActivity(
        'WHATSAPP_NOTIFICATION_SENT',
        `Automated WhatsApp ${eventType} alert delivered to host (${targetRecipient}) for booking ${booking.id}`,
        '127.0.0.1',
        'WhatsAppService'
      );

      return {
        success: true,
        messageId,
        recipient: targetRecipient,
        provider: 'meta_cloud_api'
      };

    } else {
      // Graceful Development & Simulation Mode (Placeholder credentials)
      console.log(`[WHATSAPP_SIMULATED] Dev Mode Active. Simulated host delivery to ${targetRecipient}:`);
      console.log('--------------------------------------------------');
      console.log(messageText);
      console.log('--------------------------------------------------');

      const simMessageId = 'sim-wamid-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      updateBookingNotificationStatus(booking.id, {
        status: 'simulated',
        eventType,
        provider: 'meta_cloud_api_simulated',
        messageId: simMessageId,
        recipient: targetRecipient,
        messageText,
        note: 'Simulated delivery - live Meta WhatsApp Cloud API credentials pending in .env or Admin Panel.',
        sentAt: new Date().toISOString()
      }, eventFlagKey);

      logActivity(
        'WHATSAPP_NOTIFICATION_SIMULATED',
        `Simulated WhatsApp ${eventType} alert recorded for host (${targetRecipient}) for booking ${booking.id}`,
        '127.0.0.1',
        'WhatsAppService'
      );

      return {
        success: true,
        simulated: true,
        messageId: simMessageId,
        recipient: targetRecipient,
        messageText,
        note: 'Live credentials pending in .env or Admin Configuration'
      };
    }
  } catch (err) {
    console.error(`[WHATSAPP_EXCEPTION] Failed to send notification for booking ${booking.id}:`, err);

    updateBookingNotificationStatus(booking.id, {
      status: 'failed',
      eventType,
      error: err.message,
      attemptedAt: new Date().toISOString(),
      recipient: targetRecipient
    });

    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Update an inquiry's notification record in db.json safely
 */
function updateBookingNotificationStatus(bookingId, notificationData, flagKey = null) {
  try {
    const db = readDB();
    if (!db || !db.inquiries) return;

    const idx = db.inquiries.findIndex(i => i.id === bookingId);
    if (idx !== -1) {
      if (!db.inquiries[idx].whatsappNotifications) {
        db.inquiries[idx].whatsappNotifications = [];
      }
      db.inquiries[idx].whatsappNotifications.unshift(notificationData);
      db.inquiries[idx].whatsappNotification = notificationData;
      if (flagKey) {
        db.inquiries[idx][flagKey] = true;
      }
      db.inquiries[idx].whatsappNotificationSent = true;
      writeDB(db);
    }
  } catch (err) {
    console.error('[WHATSAPP] Failed to update inquiry notification status:', err);
  }
}

/**
 * Send a test WhatsApp message to verify host credentials and connectivity
 */
export async function sendTestWhatsAppNotification({ hostPhone, accessToken, phoneNumberId }) {
  const config = getWhatsAppConfig();
  const token = accessToken || config.accessToken;
  const phoneId = phoneNumberId || config.phoneNumberId;
  const target = sanitizeWhatsAppNumber(hostPhone || config.hostPhone);

  if (!target) {
    return { success: false, error: 'Recipient phone number is required.' };
  }

  const isReal = Boolean(token && phoneId && !token.includes('placeholder') && !phoneId.includes('placeholder'));

  const testMessage = (
    `*MINERAL SPRINGS RETREAT – WHATSAPP SYSTEM TEST*\n\n` +
    `Hello! This is an automated test notification from the Mineral Springs Retreat website.\n\n` +
    `✅ Your WhatsApp notification system is successfully configured and active!\n` +
    `Host Number: +${target}\n` +
    `Timestamp: ${new Date().toLocaleString()}\n\n` +
    `Whenever guests submit bookings, cancel, or modify reservations, you will receive full details here automatically.`
  );

  if (isReal) {
    try {
      const endpoint = `https://graph.facebook.com/${config.apiVersion}/${phoneId}/messages`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: target,
          type: 'text',
          text: {
            preview_url: false,
            body: testMessage
          }
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        return {
          success: false,
          error: data.error?.message || 'Meta API returned an error',
          details: data.error
        };
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        recipient: target
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[TEST_WHATSAPP_SIMULATED] Simulated test message to +${target}`);
    return {
      success: true,
      simulated: true,
      recipient: target,
      message: 'Test notification verified in development mode. To deliver real WhatsApp messages to your mobile, configure your Meta WhatsApp Cloud API credentials in Admin Settings or .env.'
    };
  }
}
