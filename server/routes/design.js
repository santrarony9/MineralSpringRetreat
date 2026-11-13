import express from 'express';
import { readDB, writeDB } from '../db.js';
import { requireAdminMiddleware, logActivity } from '../auth.js';

const router = express.Router();

// Sanitizer for CSS property values to prevent injection
function sanitizeCssValue(val, fallback) {
  if (typeof val !== 'string') return fallback;
  // Disallow braces, semicolons, script tags, url(), expression()
  if (/[;{}<>\\/]|\bexpression\b|\bjavascript\b/i.test(val)) {
    return fallback;
  }
  return val.trim();
}

/**
 * GET /api/design
 * Public design tokens
 */
router.get('/', (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  res.json(db.designTokens || {});
});

/**
 * PUT /api/design
 * Admin updates design tokens
 */
router.put('/', requireAdminMiddleware, (req, res) => {
  const db = readDB();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const current = db.designTokens || {};
  const updates = req.body || {};

  const cleanTokens = {
    headingFont: sanitizeCssValue(updates.headingFont, current.headingFont || "'Cormorant Garamond', Georgia, serif"),
    bodyFont: sanitizeCssValue(updates.bodyFont, current.bodyFont || "'DM Sans', sans-serif"),
    h1SizeDesktop: sanitizeCssValue(updates.h1SizeDesktop, current.h1SizeDesktop || "64px"),
    h1SizeMobile: sanitizeCssValue(updates.h1SizeMobile, current.h1SizeMobile || "38px"),
    h2SizeDesktop: sanitizeCssValue(updates.h2SizeDesktop, current.h2SizeDesktop || "44px"),
    h2SizeMobile: sanitizeCssValue(updates.h2SizeMobile, current.h2SizeMobile || "28px"),
    h3SizeDesktop: sanitizeCssValue(updates.h3SizeDesktop, current.h3SizeDesktop || "26px"),
    h3SizeMobile: sanitizeCssValue(updates.h3SizeMobile, current.h3SizeMobile || "20px"),
    bodySize: sanitizeCssValue(updates.bodySize, current.bodySize || "15px"),
    colorHeaderBg: sanitizeCssValue(updates.colorHeaderBg, current.colorHeaderBg || "#17251D"),
    colorFooterBg: sanitizeCssValue(updates.colorFooterBg, current.colorFooterBg || "#111613"),
    colorAccentGold: sanitizeCssValue(updates.colorAccentGold, current.colorAccentGold || "#B89A70"),
    colorGoldLight: sanitizeCssValue(updates.colorGoldLight, current.colorGoldLight || "#CBB08B"),
    colorBodyDark: sanitizeCssValue(updates.colorBodyDark, current.colorBodyDark || "#1A1A1A"),
    colorPageBg: sanitizeCssValue(updates.colorPageBg, current.colorPageBg || "#FAF7F2"),
    colorSectionLight: sanitizeCssValue(updates.colorSectionLight, current.colorSectionLight || "#F3EFEA"),
    sectionPaddingDesktop: sanitizeCssValue(updates.sectionPaddingDesktop, current.sectionPaddingDesktop || "96px"),
    sectionPaddingMobile: sanitizeCssValue(updates.sectionPaddingMobile, current.sectionPaddingMobile || "64px"),
    borderRadius: sanitizeCssValue(updates.borderRadius, current.borderRadius || "0px")
  };

  db.designTokens = cleanTokens;
  writeDB(db);

  logActivity('DESIGN_TOKENS_UPDATED', 'Updated typography and design tokens', req.ip, req.adminUser.username);
  res.json({ success: true, tokens: db.designTokens });
});

export default router;
