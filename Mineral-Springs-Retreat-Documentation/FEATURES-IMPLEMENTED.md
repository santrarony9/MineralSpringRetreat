# Mineral Springs Retreat — Implemented Features & System Capabilities

## 1. Authentic Photography & Asset Integration Engine
- **Source Verification:** Directly integrated 23 high-resolution authentic photographs from the owner's Google Drive repository (`darjeeling02` and `HOST` DSLR collections).
- **Cryptographic Zero-Duplication:** Verified all existing retreat media via MD5 hashing to ensure zero duplicate imagery across the site.
- **Image Optimization & Processing:** High-resolution Canon EOS DSLR host portraits resampled to web-optimized dimensions (1600×1067) using high-quality bicubic interpolation with fine-tuned JPEG encoding to preserve skin tones and fabric textures while keeping file size under 300KB.
- **Expanded Visual Gallery:** 28 curated photographs with 6 interactive categories:
  - *All Photos* (28 items)
  - *Scenery & Vistas* (Mt. Kanchenjunga sunrise, rolling cloud inversions, valley panoramas)
  - *Rooms & Verandahs* (timber cottages, interior bedrooms, wooden balconies)
  - *Experiences & Trails* (natural waterfall cascades, cardamom forest walks, mountain streams)
  - *Culture & Heritage* (resident homestay hosts, UNESCO Toy Train, fluttering prayer flags)
  - *Nature & Streams* (macro tea leaf dewdrops, crystal mountain streams, river boulders)
- **CMS Media Library Registration:** Populated 42 indexed assets in `RETREAT_LIBRARY_PHOTOS` within the Admin Panel (`/admin`) for one-click photo selection across rooms, packages, and pages.

---

## 2. Real Google OAuth 2.0 Authentication
- **Google Cloud Platform (GCP) Project:** `strong-keel-514612-k6` (Project Number: `465876529150`).
- **OAuth 2.0 Client ID:** `465876529150-ttmo87mj8jdi1n4lh8u9e6uoqa6j133n.apps.googleusercontent.com`.
- **Authorized Redirect URIs:**
  - `https://mineral-springs-retreat.vercel.app/api/auth/google/callback`
  - `http://localhost:5000/api/auth/google/callback`
- **Authorized JavaScript Origins:**
  - `https://mineral-springs-retreat.vercel.app`
  - `http://localhost:5000`
  - `http://localhost:3000`
- **Security & Integrity:** Eliminates mock/demo sign-in; validates genuine Google ID tokens (`sub`, email, name, picture) and persists guest profiles in local and production databases.

---

## 3. Responsive Editorial Guest Website
- **Luxury Himalayan Aesthetic:** Custom CozyStay design language using Deep Forest Pine (`#1E2C22`, `#151F18`), Warm Sand/Gold (`#B89A70`, `#DFCCA8`), and Crisp Cream (`#FAF7F2`).
- **Typography & Precision Layout:** High-contrast Cormorant Garamond serif headings paired with clean, accessible sans-serif body typography.
- **Homepage Sections:**
  - *Cinematic Parallax Hero:* Golden sunrise and sea of clouds over Mt. Kanchenjunga.
  - *Introduction & Carousel:* Continuous smooth carousel showcasing the retreat complex, wooden verandah, and pine canopy.
  - *Dawaipani Showcase:* Authentic imagery of the Sleeping Buddha snow peaks, drone aerial canopy, night city lights, and tea terraces.
  - *Tariff & 4-Meal Plan:* Double and Triple/Group sharing rates with full daily meal breakdown and organic tea heritage feature.
  - *Curated Experiences:* Authentic waterfall trek, tea tasting, Kanchenjunga sunrise, forest trails, and UNESCO Toy Train.
  - *Meet Your Hosts:* Dedicated host introduction featuring portraits of the founder and co-founder.
  - *Travel Guide:* Distance metrics, route guidance, and Darjeeling Himalayan Railway heritage.
  - *Interactive Reservation Bar:* Fixed-alignment, responsive date picker and guest counter.

---

## 4. Property Management & Booking System
- **Interactive Calendar Suite:**
  - *Monthly Grid:* 30/31-day visual occupancy with availability chips (`2/2 free`, `1/2 free`, `Sold Out`) and multi-day stay pills (`↳ IN`, stay, `↲ OUT`).
  - *Weekly Timeline:* 7-day multi-column timeline display.
  - *Daily Matrix:* 4 KPI counters and an Accommodation Inventory Matrix tracking individual unit occupancy (Unit 1 & Unit 2) for each room type.
  - *Sortable List:* Searchable table with instant status updates.
- **Strict Overlap Prevention:** Half-open interval checking (`[checkIn, checkOut)`) that prevents accidental double bookings while properly allowing check-in on the exact date an outgoing guest departs.
- **Meta WhatsApp Cloud API:** Real-time host notifications on new booking inquiries, reservation confirmations, and status transitions.

---

## 5. Desktop Cinematic Video Background & Adaptive Delivery
- **Original Source Inspection:** Downloaded and verified `Dawaipani Reel .mp4` (1080×1920 portrait video at 60fps) from Google Drive file ID `11h9HSosnwzi6jaYtSld5GtFlFbWqAZbX`.
- **Web Stream Optimization:** Re-encoded using FFmpeg with H.264 High Profile, visually lossless CRF 22, 30fps cadence, stripped silent audio track, and `+faststart` moov-atom header repositioning. File size reduced from 98.4MB to 13.9MB (86% reduction) for instant playback without buffering.
- **Adaptive Viewport Isolation:**
  - *Laptops & Desktops (&ge; 1024px):* Full-bleed cinematic video background rendered with smooth looping, muted autoplay, responsive cropping (`object-[center_35%]`), zero video chrome, and high-definition poster frame fallback.
  - *Mobile & Tablet Devices (&lt; 1024px):* The `<video>` element is completely omitted from rendering; the existing static mountain photograph (`heroImage`) is displayed with subtle CSS drift animation to ensure zero cellular data consumption and identical performance.
- **Accessibility & Error Resilience:** Automatically detects `prefers-reduced-motion` and video load errors, immediately reverting to the static photograph without visual clipping or broken media states.
- **CMS Management:** Configured in `pages.home.hero.video` and `settings.heroVideo`; editable in real-time through the Admin Panel (`/admin`) with asset picker and one-click removal controls.
