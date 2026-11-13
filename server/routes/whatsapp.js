import express from 'express';
import {
  requireAdminMiddleware,
  requireSuperAdminMiddleware,
  requireAdminOrAboveMiddleware
} from '../auth.js';
import {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  sendTestWhatsAppNotification,
  sendWhatsAppBookingNotification
} from '../services/whatsapp.js';
import { readDB } from '../db.js';

const router = express.Router();

/**
 * GET /api/whatsapp/config
 * View WhatsApp notification configuration.
 * API secrets and credentials are protected and only exposed to Super Admin.
 */
router.get('/config', requireAdminMiddleware, (req, res) => {
  const config = getWhatsAppConfig();
  const isSuperAdmin = req.adminUser.role === 'superadmin';

  // Return masked token for security
  const maskedToken = config.accessToken && !config.accessToken.includes('placeholder')
    ? config.accessToken.substring(0, 7) + '...' + config.accessToken.substring(config.accessToken.length - 4)
    : config.accessToken;

  res.json({
    enabled: config.enabled,
    hostPhone: isSuperAdmin ? config.hostPhone : (config.cleanHostPhone ? `+${config.cleanHostPhone.slice(0, 4)}••••${config.cleanHostPhone.slice(-2)}` : 'Configured'),
    cleanHostPhone: config.cleanHostPhone,
    phoneNumberId: isSuperAdmin ? config.phoneNumberId : '••••••••••••••••',
    accessTokenMasked: isSuperAdmin ? maskedToken : '••••••••••••••••',
    hasCustomToken: Boolean(config.accessToken && !config.accessToken.includes('placeholder')),
    businessAccountId: isSuperAdmin ? config.businessAccountId : '••••••••••••••••',
    apiVersion: config.apiVersion,
    isConfigured: config.isConfigured,
    devMode: config.devMode,
    isSuperAdmin
  });
});

/**
 * PUT /api/whatsapp/config
 * Super Admin: Update WhatsApp notification configuration
 */
router.put('/config', requireSuperAdminMiddleware, (req, res) => {
  const {
    enabled,
    hostPhone,
    phoneNumberId,
    accessToken,
    businessAccountId,
    apiVersion
  } = req.body;

  const update = {};
  if (enabled !== undefined) update.enabled = Boolean(enabled);
  if (hostPhone !== undefined) update.hostPhone = hostPhone.trim();
  if (phoneNumberId !== undefined) update.phoneNumberId = phoneNumberId.trim();
  if (businessAccountId !== undefined) update.businessAccountId = businessAccountId.trim();
  if (apiVersion !== undefined) update.apiVersion = apiVersion.trim();

  // Only update token if provided and not masked placeholder
  if (accessToken && !accessToken.includes('...')) {
    update.accessToken = accessToken.trim();
  }

  const updatedConfig = saveWhatsAppConfig(update);

  res.json({
    success: true,
    message: 'WhatsApp notification configuration updated successfully.',
    config: {
      enabled: updatedConfig.enabled,
      hostPhone: updatedConfig.hostPhone,
      cleanHostPhone: updatedConfig.cleanHostPhone,
      phoneNumberId: updatedConfig.phoneNumberId,
      isConfigured: updatedConfig.isConfigured,
      devMode: updatedConfig.devMode
    }
  });
});

/**
 * POST /api/whatsapp/test
 * Admin: Send a test WhatsApp notification to verify host configuration
 */
router.post('/test', requireAdminMiddleware, async (req, res) => {
  const { hostPhone, accessToken, phoneNumberId } = req.body || {};

  try {
    const result = await sendTestWhatsAppNotification({
      hostPhone,
      accessToken,
      phoneNumberId
    });

    if (result.success) {
      return res.json({
        success: true,
        message: result.simulated
          ? 'Test notification verified in simulated mode.'
          : 'Live WhatsApp test notification successfully delivered to host!',
        result
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error || 'Failed to send test notification',
        details: result.details
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * POST /api/whatsapp/resend/:inquiryId
 * Admin: Resend WhatsApp notification for a specific inquiry
 */
router.post('/resend/:inquiryId', requireAdminMiddleware, async (req, res) => {
  const db = readDB();
  const inquiry = (db?.inquiries || []).find(i => i.id === req.params.inquiryId);

  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  // Force re-send by resetting flag for this call
  const bookingCopy = { ...inquiry, whatsappNotificationSent: false };
  const result = await sendWhatsAppBookingNotification(bookingCopy);

  res.json({
    success: result.success,
    result
  });
});

export default router;
