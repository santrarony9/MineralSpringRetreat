import React from 'react';
import { useApp } from '../../context/AppContext';
import { CozySparkle } from './CozyIcons';
import { Mountain, Heart, Compass, ShieldCheck, CloudFog, UtensilsCrossed, ArrowRight } from 'lucide-react';

const defaultValues = [
  {
    title: 'Authentic Gorkha Warmth',
    desc: 'We are not a commercial hotel chain. We offer sincere, respectful homestay hospitality where guests are welcomed as extended family into a genuine mountain home.',
    icon: Heart
  },
  {
    title: 'Nourishing Local Food',
    desc: 'All 4 daily meals are prepared fresh in our kitchen with local ingredients, organic seasonal vegetables, and traditional recipes perfected through generations.',
    icon: UtensilsCrossed
  },
  {
    title: 'Nature Stewardship',
    desc: 'We respect our delicate Himalayan ecology. We encourage slow walking, bird-watching, responsible waste management, and honoring the heritage of the sacred mineral springs.',
    icon: Compass
  }
];

export default function CozyAboutPage({ setActivePage }) {
  const { openBooking, pages } = useApp();
  const aboutData = pages?.about;

  const heroTitle = aboutData?.heroTitle || 'About Mineral Springs Retreat';
  const heroSubtitle = aboutData?.heroSubtitle || 'A rustic eco-stay perched in the tranquil heights of Dawaipani, offering authentic mountain living, mindful hospitality, and unbroken peace.';
  const storyHeading = aboutData?.storyHeading || 'A Place Where the Mountain Sets the Pace';
  const storyParagraph1 = aboutData?.storyParagraph1 || 'Mineral Springs Retreat was founded on a simple conviction: that modern travelers need places where time slows down. Situated in the serene mountain hamlet of Dawaipani, overlooking the rolling terraces of Lebong and Mineral Spring Tea Gardens, our homestay invites you to leave behind the rush of urban life.';
  const storyParagraph2 = aboutData?.storyParagraph2 || 'Here, mornings begin with the golden crown of Mount Kanchenjunga catching the first light. Afternoons bring the gentle mountain mist that sweeps across the valley and drifts peacefully through your room\'s private balcony. Evenings close around a table of warm, home-cooked Gorkha cuisine prepared from organic garden produce.';
  const aboutImage = aboutData?.image || '/images/mineral-springs/retreat-main-cottage-facade.jpg';

  const icons = [Heart, UtensilsCrossed, Compass];
  const values = (aboutData?.values && aboutData.values.length > 0)
    ? aboutData.values.map((v, idx) => ({
        title: v.title,
        desc: v.desc,
        icon: icons[idx % icons.length]
      }))
    : defaultValues;

  return (
    <div className="pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-28 bg-cozy-cream select-none min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="typo-eyebrow block mb-3">
            OUR STORY & SANCTUARY
          </span>
          <h1 className="typo-page-title text-cozy-forest font-normal">
            {heroTitle}
          </h1>
          <p className="typo-body text-cozy-muted font-normal mt-4 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
        </div>

        {/* Editorial Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 sm:mb-28">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="typo-eyebrow text-cozy-sandDark block">
              THE ESSENCE OF DAWAIPANI
            </span>
            <h2 className="typo-section-heading text-cozy-forest font-normal">
              {storyHeading}
            </h2>
            <p className="typo-body text-cozy-muted font-light">
              {storyParagraph1}
            </p>
            <p className="typo-body text-cozy-muted font-light">
              {storyParagraph2}
            </p>
            
            <div className="pt-4 flex items-center space-x-6 text-cozy-forest">
              <div className="flex items-center space-x-2">
                <Mountain className="w-5 h-5 text-cozy-sandDark" />
                <span className="typo-eyebrow text-cozy-forest tabular-nums whitespace-nowrap">6,500 ft Elevation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CloudFog className="w-5 h-5 text-cozy-sandDark" />
                <span className="typo-eyebrow text-cozy-forest">Afternoon Mist</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#B89D77]/25">
              <img
                src={aboutImage}
                alt="Mineral Springs Retreat authentic mountain cottage facade"
                className="w-full h-[440px] sm:h-[520px] object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="typo-eyebrow text-[#CBB08B] block mb-1">
                  GENUINE ECO-STAY
                </span>
                <p className="typo-card-heading text-xl sm:text-2xl font-normal leading-tight">
                  "If u want to spend some time with urself amidst nature, its the place."
                </p>
                <span className="typo-small text-xs text-white/70 block mt-1">— Sanju Sur, Verified Google Review</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Core Homestay Values */}
        <div className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-14 lg:p-16 border border-[#EAE3D8] shadow-xl mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="typo-eyebrow text-[#B89D77] block mb-2 font-medium">OUR COMMITMENT</span>
            <h2 className="typo-section-heading text-cozy-forest font-normal">
              What Defines Our Hospitality
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const Icon = val.icon || Heart;
              return (
                <div key={idx} className="space-y-3 h-full flex flex-col justify-start p-6 sm:p-7 rounded-2xl bg-white border border-[#EAE3D8] hover:border-[#B89D77]/70 shadow-xs hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-[#B89D77]/15 border border-[#B89D77]/30 flex items-center justify-center text-[#B89D77] shrink-0">
                    <Icon className="w-6 h-6 text-[#B89D77]" />
                  </div>
                  <h3 className="typo-card-heading text-cozy-forest font-normal md:min-h-[2.5rem] flex items-start">
                    {val.title}
                  </h3>
                  <p className="typo-small text-cozy-muted font-light flex-1">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-[#1E2C22] text-white rounded-3xl p-8 sm:p-14 text-center border border-[#2D3B31] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="typo-section-heading text-white font-normal">
              Come Experience the Stillness
            </h2>
            <p className="typo-body text-white/80 font-light">
              Plan your getaway to Dawaipani. Reach out directly to discuss travel dates, road coordination, and tariffs.
            </p>
            <div className="pt-4">
              <button
                onClick={() => openBooking()}
                className="cozy-btn-sand typo-btn py-3.5 px-8 shadow-xl"
              >
                <span>Book Your Stay</span>
                <CozySparkle className="w-3.5 h-3.5 text-[#151F18]" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
