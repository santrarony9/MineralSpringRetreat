import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashPassword } from '../auth.js';
import { readDB, writeDB } from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function runMigration() {
  if (process.env.VERCEL) {
    // In Vercel serverless, schema is pre-seeded via db.example.json or Vercel KV
    console.log('[MIGRATION] Serverless environment detected; skipping disk migration.');
    return true;
  }
  console.log('[MIGRATION] Starting database migration & schema expansion...');
  let db = readDB() || {};

  // 1. ADMIN USERS
  if (!db.users || !Array.isArray(db.users) || db.users.length === 0) {
    const defaultPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin@Mineral2026!';
    db.users = [
      {
        id: 'usr-admin-1',
        username: 'admin',
        email: 'stay@mineralspringsretreat.com',
        passwordHash: hashPassword(defaultPassword),
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null
      }
    ];
    console.log(`[MIGRATION] Created initial admin user (username: admin, default password configured)`);
  }

  // 2. SESSIONS & LOGS
  if (!db.sessions) db.sessions = [];
  if (!db.auditLogs) db.auditLogs = [];
  if (!db.passwordResets) db.passwordResets = [];

  // 3. COMPLETE MODULAR PAGES CONTENT (ALL 10 SECTIONS/PAGES)
  if (!db.pages) db.pages = {};

  // 3.1 HOMEPAGE
  if (!db.pages.home) {
    db.pages.home = {
      hero: {
        badge: "BOUTIQUE RETREAT OFFERING TIMELESS HIMALAYAN TRANQUILITY",
        title: "A Peaceful Escape in the\nHeart of the Mountains",
        subtitle: "",
        image: "/images/mineral-springs/dawaipani-balcony-valley-vista.jpg",
        stats: [
          { id: "stat-1", value: "6,500", unit: "ft", label: "RETREAT ALTITUDE" },
          { id: "stat-2", value: "4", unit: "Meals", label: "DAILY INCLUDED" },
          { id: "stat-3", value: "70", unit: "km", label: "FROM NJP & BAGDOGRA" }
        ]
      },
      intro: {
        eyebrow: "HIMALAYAN SERENITY MEETS RUSTIC COMFORT",
        heading: "Mineral Springs Retreat in the heart of the mountains is an authentic sanctuary offering simple, clean accommodations with unrivaled tea garden walks and valley peace.",
        paragraph: "Perched at 6,500 feet in the serene village of Dawaipani, overlooking Mount Kanchenjunga and the expansive Lebong tea gardens. Unwind in quiet rustic rooms, savor traditional home-cooked meals, and experience the spellbinding afternoon clouds drifting through your private balcony.",
        images: [
          { src: "/images/mineral-springs/retreat-main-cottage-facade.jpg", alt: "Mineral Springs Retreat wooden cottage with lace trim nestled in pine hills", caption: "Main Mountain Cottage Facade" },
          { src: "/images/mineral-springs/retreat-wooden-balcony-guitar.jpg", alt: "Peaceful wooden verandah with acoustic guitar and mountain valley views", caption: "Verandah Overlooking the Valley" },
          { src: "/images/mineral-springs/retreat-cottages-mountain-slope.jpg", alt: "Red-roofed retreat cottages terraced on mountain garden slope", caption: "Cottages Along the Garden Slope" },
          { src: "/images/mineral-springs/retreat-patio-deck-lounge.jpg", alt: "Outdoor timber patio deck with cushioned lounge seating", caption: "Patio Deck & Fireside Lounge" },
          { src: "/images/mineral-springs/retreat-hillside-eco-cottage.jpg", alt: "Traditional wooden hillside cottage on stilts nested in pine forest", caption: "Hillside Stilt Eco-Cottage" }
        ]
      },
      facilities: {
        eyebrow: "COMFORTS & ESSENTIALS",
        heading: "Thoughtful Himalayan Hospitality",
        subtitle: "Everything you need for an authentic, comfortable and restorative stay in the quiet hills of Dawaipani.",
        items: [
          { title: "Attached Western Toilets", desc: "Clean, sanitized ensuite Western toilets in all rooms with geysers for 24/7 hot water." },
          { title: "Panoramic Private Balconies", desc: "Sit back and watch afternoon mist and clouds roll right past your bedroom window." },
          { title: "All 4 Daily Meals Included", desc: "Freshly cooked local Gorkha and Nepali cuisine prepared from village-harvested organic ingredients." },
          { title: "Tea Garden & Pine Forest Trails", desc: "Direct access to Lebong tea estate walking paths and fragrant pine forest walking tracks." }
        ]
      },
      activities: {
        eyebrow: "LOCAL LIVING & DISCOVERY",
        heading: "Immerse in Mountain Life",
        subtitle: "Experience the authentic rhythms of Himalayan village life in Dawaipani.",
        items: [
          { title: "Kanchenjunga Sunrise Walks", desc: "Wake up to breathtaking golden sunrises over the Kanchenjunga mountain range." },
          { title: "Lebong Tea Garden Treks", desc: "Gentle hillside walks through historic tea garden slopes with local village guides." },
          { title: "Evening Deck Bonfires", desc: "Cozy fireside gatherings under starlit Himalayan skies with hot tea and snacks." }
        ]
      },
      bookingCTA: {
        eyebrow: "BEGIN YOUR HIMALAYAN JOURNEY",
        heading: "Ready to Experience Dawaipani?",
        subtitle: "Book your stay at Mineral Springs Retreat today. Simple rustic rooms, delicious home-cooked meals, and breathtaking mountain vistas await.",
        buttonText: "CHECK AVAILABILITY & RESERVE"
      }
    };
  }

  // 3.2 ABOUT PAGE
  if (!db.pages.about) {
    db.pages.about = {
      heroTitle: "Our Himalayan Sanctuary",
      heroSubtitle: "A peaceful retreat born from mountain heritage and natural mineral springs.",
      storyHeading: "Living in Harmony with Nature",
      storyParagraph1: "Mineral Springs Retreat was established as an authentic sanctuary in the tranquil hamlet of Dawaipani, approximately 15 km from Darjeeling town. Surrounded by dense pine forests and the emerald slopes of the Lebong tea gardens, our retreat offers travelers a peaceful refuge from urban haste.",
      storyParagraph2: "Our architecture honors traditional Himalayan timber craftsmanship, with rustic wooden verandas, locally sourced pine finishes, and private balconies that frame uninterrupted vistas of Mount Kanchenjunga. Here, the afternoons bring gentle clouds flowing through your room, and evenings bring glowing village lights and starlit skies.",
      values: [
        { title: "Authentic Hospitality", desc: "Warm family hosting rooted in traditional Gorkha warmth and personalized care." },
        { title: "Organic Mountain Dining", desc: "Wholesome 4-meal daily dining prepared with organic farm ingredients." },
        { title: "Ecological Respect", desc: "Sustainable mountain living preserving the natural mineral springs." }
      ]
    };
  }

  // 3.3 DAWAIPANI PAGE
  if (!db.pages.dawaipani) {
    db.pages.dawaipani = {
      badge: "THE HIMALAYAN VILLAGE",
      title: "Discover Dawaipani",
      subtitle: "A secluded hill village perched at 6,500 ft, renowned for panoramic Kanchenjunga views, pure mountain air, and tranquil tea estates.",
      elevation: "6,500 ft",
      distanceFromDarjeeling: "15 km",
      weatherHighlights: "Cool summers (15°C – 22°C), crisp misty monsoons, and clear cold winters (2°C – 12°C) with spectacular snow-capped views.",
      sections: [
        {
          heading: "The Name & History",
          text: "Dawaipani translates literally to 'Medicinal Water' in Nepali, named after the natural therapeutic mineral springs that flow through the surrounding forests. Travelers historically came to these hills seeking the rejuvenating qualities of its pure spring waters and undisturbed pine canopy."
        },
        {
          heading: "Kanchenjunga Panoramic Vista",
          text: "Unlike crowded hill stations, Dawaipani offers an unobstructed, 180-degree panorama of Mount Kanchenjunga and its sibling peaks. On crisp mornings, witness the world's third highest peak turn from deep violet to glistening Himalayan gold."
        },
        {
          heading: "Lebong Mineral Spring Tea Estate",
          text: "The retreat borders the historic Lebong and Mineral Spring Tea Gardens. Guests can take guided nature walks through terraced organic tea slopes, observe artisan leaf plucking, and breathe in the distinctive floral fragrance of Darjeeling tea in flush."
        }
      ]
    };
  }

  // 3.4 STAY PAGE
  if (!db.pages.stay) {
    db.pages.stay = {
      title: "Rooms & Accommodations",
      subtitle: "Simple, clean, and comfortable rustic rooms with private balconies and inclusive 4-meal plans.",
      mealPlanNotice: "Every reservation includes all 4 daily home-cooked meals: Morning Breakfast, Wholesome Lunch, Evening Tea & Snacks, and Warming Dinner.",
      policiesHeading: "Accommodation Inclusions & Policies",
      checkInTime: "12:00 PM",
      checkOutTime: "11:00 AM",
      rules: [
        "Check-in at 12:00 PM; Check-out at 11:00 AM.",
        "Rates are per person per night and include all 4 daily meals.",
        "Attached Western toilets with 24/7 hot geyser water in all rooms.",
        "Advance booking is recommended during peak Kanchenjunga viewing seasons."
      ]
    };
  }

  // 3.5 EXPERIENCES PAGE
  if (!db.pages.experiences) {
    db.pages.experiences = {
      title: "Curated Mountain Experiences",
      subtitle: "From mist-bathed morning balconies to starlit deck bonfires and tea garden walks.",
      introText: "Every moment at Mineral Springs Retreat is crafted around the quiet wonder of the Himalayas. Immerse yourself in authentic village walks, music on the timber verandah, and heartfelt conversations with your local hosts."
    };
  }

  // 3.6 GALLERY PAGE
  if (!db.pages.gallery) {
    db.pages.gallery = {
      title: "Retreat & Landscape Gallery",
      subtitle: "Visual glimpses of our wooden cottages, mountain balconies, misty sunrises, and serene surroundings.",
      categories: ["All", "Architecture", "Rooms", "Nature", "Lifestyle"]
    };
  }

  // 3.7 TRAVEL GUIDE PAGE
  if (!db.pages.travel) {
    db.pages.travel = {
      title: "Travel & Route Guide",
      subtitle: "How to reach Mineral Springs Retreat in Dawaipani from major transit hubs.",
      altitudeWarning: "Dawaipani is located at 6,500 ft elevation. The final 3 km approach follows a scenic mountain road. 4WD / high-clearance vehicles are recommended during monsoon months.",
      distances: [
        { destination: "New Jalpaiguri (NJP) Railway Station", distance: "70 km", time: "Approx. 3.5 – 4 hours drive", route: "Via Siliguri – Kurseong – Jorebungalow – Dawaipani" },
        { destination: "Bagdogra International Airport (IXB)", distance: "75 km", time: "Approx. 4 hours drive", route: "Via Siliguri – Rohini / Mirik or Kurseong" },
        { destination: "Darjeeling Town (Mall / Chowrasta)", distance: "15 km", time: "Approx. 45 – 55 minutes drive", route: "Via Lebong Cart Road" },
        { destination: "Kalimpong Hill Station", distance: "50 km", time: "Approx. 2.5 hours drive", route: "Via Teesta Bazaar and Peshok Road" },
        { destination: "Gangtok, Sikkim", distance: "78 km", time: "Approx. 3.5 – 4 hours drive", route: "Via Rangpo and Teesta" }
      ],
      taxiAssistanceText: "We can arrange reliable local pick-up and drop-off taxis from NJP Railway Station, Siliguri, and Bagdogra Airport upon request."
    };
  }

  // 3.8 RESERVATION PAGE
  if (!db.pages.reservation) {
    db.pages.reservation = {
      title: "Reserve Your Stay",
      subtitle: "Experience rustic tranquility with all 4 home-cooked meals included.",
      inquiryInstructions: "Submit your preferred dates and room choice below. Our reservations desk will confirm availability and send you booking confirmation directly via WhatsApp or Email.",
      cancellationPolicy: "Full refund for cancellations made 7 or more days prior to check-in. 50% refund for cancellations within 3-6 days. No refund for cancellations within 48 hours."
    };
  }

  // 3.9 HEADER
  if (!db.pages.header) {
    db.pages.header = {
      brandTitle: "MINERAL SPRINGS",
      brandSubtitle: "RETREAT",
      starsCount: 5,
      navItems: [
        { id: "home", label: "HOME", visible: true },
        { id: "about", label: "ABOUT", visible: true },
        { id: "dawaipani", label: "DAWAIPANI", visible: true },
        { id: "stay", label: "STAY", visible: true },
        { id: "experiences", label: "EXPERIENCES", visible: true },
        { id: "gallery", label: "GALLERY", visible: true },
        { id: "travel", label: "TRAVEL GUIDE", visible: true }
      ],
      ctaText: "RESERVE NOW"
    };
  }

  // 3.10 FOOTER
  if (!db.pages.footer) {
    db.pages.footer = {
      brandTitle: "MINERAL SPRINGS",
      brandSubtitle: "RETREAT · DAWAIPANI",
      bio: "Mineral Springs Retreat is a rustic boutique eco-stay in Dawaipani village, overlooking Mount Kanchenjunga and the expansive Lebong tea gardens. Offering simple clean accommodation, home-cooked Gorkha meals, and unbroken mountain peace.",
      phone: "+91 98320 12345",
      email: "stay@mineralspringsretreat.com",
      address: "Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.",
      googleReviewCount: 19,
      googleRating: 4.9,
      directionsUrl: "https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598",
      googleReviewsUrl: "https://www.google.com/travel/search?q=mineral+springs+retreat+dawaipani",
      copyrightText: "© 2026 Mineral Springs Retreat, Dawaipani. All rights reserved."
    };
  }

  // 4. DESIGN & TYPOGRAPHY TOKENS
  if (!db.designTokens) {
    db.designTokens = {
      headingFont: "'Cormorant Garamond', Georgia, serif",
      bodyFont: "'DM Sans', sans-serif",
      h1SizeDesktop: "64px",
      h1SizeMobile: "38px",
      h2SizeDesktop: "44px",
      h2SizeMobile: "28px",
      h3SizeDesktop: "26px",
      h3SizeMobile: "20px",
      bodySize: "15px",
      colorHeaderBg: "#17251D",
      colorFooterBg: "#111613",
      colorAccentGold: "#B89A70",
      colorGoldLight: "#CBB08B",
      colorBodyDark: "#1A1A1A",
      colorPageBg: "#FAF7F2",
      colorSectionLight: "#F3EFEA",
      sectionPaddingDesktop: "96px",
      sectionPaddingMobile: "64px",
      borderRadius: "0px"
    };
  }

  // 5. MEDIA CATALOG
  if (!db.media || !Array.isArray(db.media) || db.media.length === 0) {
    const imagesDir = path.join(__dirname, '..', '..', 'public', 'images', 'mineral-springs');
    const mediaItems = [];
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      files.forEach((file, idx) => {
        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(file)) {
          const cleanName = file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
          const category = file.startsWith('room-') ? 'Rooms'
            : file.startsWith('retreat-') ? 'Retreat'
            : file.startsWith('dawaipani-') ? 'Vistas'
            : 'General';

          mediaItems.push({
            id: 'med-' + (idx + 1),
            filename: file,
            url: `/images/mineral-springs/${file}`,
            title: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            altText: `Mineral Springs Retreat - ${cleanName}`,
            category,
            uploadedAt: new Date().toISOString()
          });
        }
      });
    }
    db.media = mediaItems;
    console.log(`[MIGRATION] Indexed ${mediaItems.length} media assets into Media Library`);
  }

  // 6. DRAFT PAGES
  if (!db.draftPages) {
    db.draftPages = JSON.parse(JSON.stringify(db.pages));
  }

  // Save atomically via db abstraction
  writeDB(db);
  console.log('[MIGRATION] Database migration successfully completed!');
  return true;
}

// Auto run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration();
}
