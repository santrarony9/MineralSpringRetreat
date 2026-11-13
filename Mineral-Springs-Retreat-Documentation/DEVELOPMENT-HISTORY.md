# Mineral Springs Retreat — Development History & Changelog

### Phase 1: Core System & Responsive Design
- Initial full-stack implementation with Node.js/Express backend and Vite/React frontend.
- CozyStay luxury Himalayan visual theme, typography tokens, and responsive booking bar.
- Atomic file-based JSON storage (`server/data/db.json`) with automated backup rotations.

### Phase 2: Administrative Dashboard & Booking Engine
- Multi-view property calendar (Monthly, Weekly, Daily Matrix, and List).
- Half-open interval conflict detection (`[checkIn, checkOut)`).
- Meta WhatsApp Cloud API integration for automated host booking alerts.
- Room inventory configuration and pricing tier controls.

### Phase 3: Real Google OAuth 2.0 Integration
- Provisioned Google Cloud Platform project `strong-keel-514612-k6` (Project Number: `465876529150`).
- Configured production OAuth 2.0 Client ID: `465876529150-ttmo87mj8jdi1n4lh8u9e6uoqa6j133n.apps.googleusercontent.com`.
- Resolved `redirect_uri_mismatch` by synchronizing callback URIs between Google Cloud Console, `.env`, Vercel production environment, and the authentication flow (`/api/auth/google/callback`).
- Replaced demo/mock authentication with genuine Google ID token validation.

### Phase 4: Authentic Google Drive Photography Integration
- Audited 4 Google Drive folders (`darjeeling 01`, `darjeeling02`, `HOST`, `image`).
- Executed cryptographic MD5 hash comparison to eliminate duplicate assets.
- Processed, optimized, and copied 23 brand-new high-resolution photography assets into `public/images/mineral-springs/`.
- Resampled large 26-megapixel Canon EOS DSLR host portraits to crisp, web-optimized 1600×1067 resolution via PowerShell high-quality bicubic interpolation.
- Updated `server/data/db.json` and seed template `server/data/db.example.json` with 28 categorized gallery items, 5 authentic experiences, updated room image sets, and 29 indexed media library items.
- Enhanced frontend components: `CozyHero.jsx`, `CozyAbout.jsx`, `CozyAboutPage.jsx`, `CozyDawaipani.jsx`, `CozyTariffDining.jsx`, `CozyExperiences.jsx`, `CozyExperiencesPage.jsx`, `CozyTravelPage.jsx`, and `CozyGalleryPage.jsx`.
- Verified Vite production build (`npm run build`) with zero compilation errors.
- Deployed to Vercel production at `https://mineral-springs-retreat.vercel.app`.
