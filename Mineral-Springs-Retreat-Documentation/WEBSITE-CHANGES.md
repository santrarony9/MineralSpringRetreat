# Mineral Springs Retreat — Website Changes & Asset Placement Log

This document tracks all changes made to the codebase, content schemas, visual components, and media assets.

---

## 📸 Integrated Image Inventory & Section Placement

| # | Asset Filename | Visual Subject & Orientation | Website Section | Component / Schema |
|---|----------------|------------------------------|-----------------|--------------------|
| 1 | `dawaipani-balcony-sunset-clouds.jpg` | Golden sunset & cloud sea from verandah (Landscape) | Homepage Hero & Experience 3 | `CozyHero.jsx`, `db.settings.heroImage`, `db.pages.home.hero` |
| 2 | `mineral-springs-retreat-complex-facade.jpg` | Main lodge complex & hillside slope (Landscape) | Homepage Carousel & Room 1 Gallery | `CozyAbout.jsx`, `db.rooms[0]`, `db.settings.section1Image` |
| 3 | `dawaipani-kanchenjunga-snow-peaks.jpg` | Sleeping Buddha Mt. Kanchenjunga (Landscape) | Dawaipani Feature 1 & Gallery | `CozyDawaipani.jsx`, `db.gallery` |
| 4 | `dawaipani-drone-canopy-aerial.jpg` | 90° Top-down aerial canopy over cottages (Square) | Dawaipani Feature 2 & Gallery | `CozyDawaipani.jsx`, `db.settings.section2Image` |
| 5 | `dawaipani-darjeeling-night-lights.jpg` | Darjeeling night lights over cloud inversion (Landscape) | Dawaipani Feature 3 & Gallery | `CozyDawaipani.jsx`, `db.settings.section3Image` |
| 6 | `darjeeling-tea-gardens-panoramic.jpg` | Panoramic rolling tea terraces (Landscape) | Dawaipani Feature 4, Dining & Exp 2 | `CozyDawaipani.jsx`, `CozyTariffDining.jsx`, `db.experiences[1]` |
| 7 | `darjeeling-tea-macro-dewdrops.jpg` | Macro organic tea leaves with morning dew (Square) | Dining & Tea Heritage Showcase | `CozyTariffDining.jsx`, `db.gallery` |
| 8 | `mineral-springs-waterfall-stream.jpg` | Natural cascading mountain waterfalls (Portrait) | Experience 1 & Gallery | `CozyExperiences.jsx`, `CozyExperiencesPage.jsx`, `db.experiences[0]` |
| 9 | `guest-mindfulness-mountain-river.jpg` | Mindful meditation on river boulders (Portrait) | Gallery & Media Library | `CozyGalleryPage.jsx`, `db.gallery`, `db.media` |
| 10 | `dawaipani-golden-tea-slopes-sunrise.jpg` | Morning sunrise over tea slopes (Landscape) | Gallery & Media Library | `CozyGalleryPage.jsx`, `db.gallery`, `db.media` |
| 11 | `darjeeling-unesco-steam-locomotive.jpg` | Blue DHR steam locomotive with garlands (Portrait) | Travel Guide & Experience 5 | `CozyTravelPage.jsx`, `CozyExperiencesPage.jsx`, `db.experiences[4]` |
| 12 | `darjeeling-toy-train-tracks.jpg` | Narrow-gauge railway track trail (Landscape) | Travel Guide & Gallery | `CozyTravelPage.jsx`, `db.gallery`, `db.media` |
| 13 | `dawaipani-tibetan-prayer-flags.jpg` | Buddhist prayer flags on retreat grounds (Landscape) | Gallery & Media Library | `CozyGalleryPage.jsx`, `db.gallery`, `db.media` |
| 14 | `darjeeling-tea-leaves-fresh-tip.jpg` | Fresh two-leaves-and-a-bud shoot (Macro) | Media Library | `db.media`, `AdminPanel.jsx` |
| 15 | `dawaipani-forest-trail-walk.jpg` | Cardamom forest walking trail (Landscape) | Experience 4 & Gallery | `CozyExperiences.jsx`, `CozyExperiencesPage.jsx`, `db.experiences[3]` |
| 16 | `retreat-wooden-verandah-balcony.jpg` | Pine timber balcony overlooking valley (Landscape) | Homepage Carousel & Room 1 Gallery | `CozyAbout.jsx`, `db.rooms[0]`, `db.gallery` |
| 17 | `retreat-cottage-hillside-canopy.jpg` | Red-roofed cottage nestled in pine forest (Landscape) | Homepage Carousel & Room 2 Gallery | `CozyAbout.jsx`, `db.rooms[1]`, `db.gallery` |
| 18 | `mineral-springs-crystal-stream.jpg` | Crystal mountain stream & mossy rocks (Portrait) | Gallery & Media Library | `CozyGalleryPage.jsx`, `db.gallery`, `db.media` |
| 19 | `mineral-springs-boulder-riverbed.jpg` | Wide boulder riverbed in valley (Landscape) | Media Library | `db.media`, `AdminPanel.jsx` |
| 20 | `host-founder-portrait.jpg` | Retreat founder studio portrait (Landscape) | About Page ("Meet Your Hosts") & Gallery | `CozyAboutPage.jsx`, `db.gallery`, `db.media` |
| 21 | `host-co-founder-portrait.jpg` | Retreat co-founder portrait (Landscape) | About Page ("Meet Your Hosts") & Gallery | `CozyAboutPage.jsx`, `db.gallery`, `db.media` |
| 22 | `host-hospitality-portrait.jpg` | Resident hostess welcome portrait (Landscape) | Media Library & Admin Panel | `db.media`, `AdminPanel.jsx` |
| 23 | `dawaipani-misty-valley-morning.jpg` | Early morning mist rising from valley (Landscape) | Gallery & Media Library | `CozyGalleryPage.jsx`, `db.gallery`, `db.media` |
| 24 | `dawaipani-reel.mp4` | 30s 1080p rolling sea of clouds & valley (Portrait Reel) | Desktop Homepage Hero (&ge; 1024px) | `CozyHero.jsx`, `db.pages.home.hero.video`, `db.settings.heroVideo` |
| 25 | `meditation-waterfall-river-rocks.webp` | Man meditating in lotus pose before rushing waterfall (Portrait) | Experience 1 (Homepage & Subpage) | `CozyExperiences.jsx`, `CozyExperiencesPage.jsx`, `db.experiences[0]` |
| 26 | `forest-railway-nature-walk.webp` | Casual stroll on train tracks through pine forest (Portrait) | Experience 5 (Subpage) | `CozyExperiencesPage.jsx`, `db.experiences[4]` |

---

## 🛠️ Component-Level Modifications

### 1. `src/components/cozystay/CozyHero.jsx`
- Replaced the desktop homepage hero background exclusively with the authentic Google Drive drone footage (`/videos/dawaipani-reel.mp4`).
- Completely eliminated the old sunset image (`dawaipani-balcony-sunset-clouds.jpg`) from desktop/laptop rendering:
  - Replaced the video `poster` with the drone footage poster frame (`/images/mineral-springs/dawaipani-reel-poster.webp`).
  - Replaced desktop fallback with the drone footage poster, guaranteeing that the sunset photograph is never displayed behind or alongside the video.
- Enforced DOM-level `muted` attributes and properties (`video.defaultMuted = true; video.muted = true; video.setAttribute('muted', '')`) to eliminate the React 18/19 autoplay block in Chrome/Safari.
- Tuned the dark overlay to a subtle, natural scrim (`bg-black/25` and `from-black/75 via-transparent to-black/40`), ensuring the Himalayan mountains, tea garden slopes, and swirling clouds are vivid and clear while text remains crisp.
- Maintained mobile and tablet viewports completely unchanged: `<img src={mobileHeroImage} className="block lg:hidden ... scale-105 animate-hero-drift" />`.
- Preserved navigation bar, hero title, gold badge, statistics, and parallax scroll dynamics.

### 2. `src/components/cozystay/CozyAbout.jsx`
- Replaced generic exterior items in `defaultImages` carousel with authentic property photos: `mineral-springs-retreat-complex-facade.jpg`, `retreat-wooden-verandah-balcony.jpg`, and `retreat-cottage-hillside-canopy.jpg`.

### 3. `src/components/cozystay/CozyDawaipani.jsx`
- Replaced 4 generic place-holder cards with exact authentic visual highlights:
  - *Sleeping Buddha:* `dawaipani-kanchenjunga-snow-peaks.jpg`
  - *Valley Mist:* `dawaipani-drone-canopy-aerial.jpg`
  - *Darjeeling at Night:* `dawaipani-darjeeling-night-lights.jpg`
  - *Tea Garden Slopes:* `darjeeling-tea-gardens-panoramic.jpg`

### 4. `src/components/cozystay/CozyAboutPage.jsx`
- Added the "Meet Your Homestay Hosts" section introducing the founder and co-founder with real portraits (`host-founder-portrait.jpg` and `host-co-founder-portrait.jpg`).

### 5. `src/components/cozystay/CozyTravelPage.jsx`
- Integrated a dedicated UNESCO World Heritage Toy Train section featuring `darjeeling-unesco-steam-locomotive.jpg` and `darjeeling-toy-train-tracks.jpg` with historical background on the Darjeeling Himalayan Railway.

### 6. `src/components/cozystay/CozyTariffDining.jsx`
- Added an "Organic Darjeeling Tea & Mountain-Grown Dining" showcase featuring `darjeeling-tea-macro-dewdrops.jpg` and `darjeeling-tea-gardens-panoramic.jpg` highlighting first flush harvests and farm-to-table cuisine.

### 7. `src/components/cozystay/CozyGalleryPage.jsx`
- Replaced hardcoded 16 items with all 28 authentic photos and expanded categories to 6 modern filters: All Photos, Scenery & Vistas, Rooms & Verandahs, Experiences & Trails, Culture & Heritage, Nature & Streams.

### 8. `src/components/cozystay/CozyExperiences.jsx` & `CozyExperiencesPage.jsx`
- Upgraded Experience photographs with ultra-high-resolution, optimized WebP imagery:
  - **Experience 1 (Mineral Springs Waterfall & River Trek):** Replaced previous asset with Unsplash photograph `meditation-waterfall-river-rocks.webp` (1600x2133, photographer Ali Sayed). Implemented `objectPosition: 'center 35%'` so the meditating subject and cascading waterfall torrent remain prominently centered without awkward cropping across desktop, tablet, and mobile.
  - **Experience 5 (UNESCO Darjeeling Toy Train Heritage Excursion / Forest Railway Nature Walk):** Replaced previous asset with Pexels photograph `forest-railway-nature-walk.webp` (1600x2400, photographer Vijil Vincent). Implemented `objectPosition: 'center 40%'` keeping the track-walking subjects cleanly framed amidst towering forest canopies.
- Preserved existing layout, card dimensions, typography, badges, and interactive functionality.
- Maintained zero duplication across the website.

### 9. `src/components/AdminPanel.jsx` & CMS Database
- Expanded `RETREAT_LIBRARY_PHOTOS` with `lib-44` (`meditation-waterfall-river-rocks.webp`) and `lib-45` (`forest-railway-nature-walk.webp`), enabling immediate administrative management and selection.
- Synchronized `server/data/db.json` and `server/data/db.example.json` experiences and media arrays.
