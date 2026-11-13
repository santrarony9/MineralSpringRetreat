import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, MapPin, Phone, Mail, ArrowUp, Star, ExternalLink } from 'lucide-react';

export default function CozyFooter({ setActivePage }) {
  const { settings, openBooking, setPolicyModal, pages } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const footerData = pages?.footer;
  const brandTitle = footerData?.brandTitle || 'MINERAL SPRINGS';
  const brandSubtitle = footerData?.brandSubtitle || 'RETREAT · DAWAIPANI';
  const bio = footerData?.bio || 'Mineral Springs Retreat is a rustic boutique eco-stay in Dawaipani village, overlooking Mount Kanchenjunga and the expansive Lebong tea gardens. Offering simple clean accommodation, home-cooked Gorkha meals, and unbroken mountain peace.';
  const phone = footerData?.phone || settings?.phone || '+91 98320 12345';
  const email = footerData?.email || settings?.email || 'stay@mineralspringsretreat.com';
  const fullAddress = footerData?.address || settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';
  const directionsUrl = footerData?.directionsUrl || settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const googleReviewsUrl = footerData?.googleReviewsUrl || settings?.googleReviewsUrl || 'https://www.google.com/travel/search?q=mineral+springs+retreat+dawaipani';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="relative bg-[#111613] text-white select-none border-t border-white/10">
      
      {/* Main Footer Container (Exact CozyStay 3-Column Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14">
          
          {/* Column 1: Brand & Bio (Exact CozyStay Style) */}
          <div className="lg:col-span-5 space-y-5 reveal-init">
            <div>
              <h3 className="font-roman text-2xl sm:text-3xl text-white font-normal tracking-[0.16em] uppercase">
                {brandTitle}
              </h3>
              <span className="text-[10px] font-roman tracking-[0.28em] text-[#CBB08B] uppercase font-light">
                {brandSubtitle}
              </span>
            </div>

            <p className="typo-small text-white/70 leading-relaxed max-w-sm">
              {bio}
            </p>

            {/* Verified Google Badge */}
            <div className="pt-2">
              <a
                href={googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2.5 bg-white/5 border border-white/15 hover:border-[#B89D77] rounded-xl px-4 py-2.5 shadow-sm hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-sans text-white/80">
                  4.9 · 19 Google Reviews
                </span>
                <ExternalLink className="w-3 h-3 text-[#B89D77]" />
              </a>
            </div>
          </div>

          {/* Column 2: Reach Out (Exact CozyStay Style) */}
          <div className="lg:col-span-4 space-y-4 reveal-init reveal-delay-1">
            <h4 className="typo-card-heading text-white font-normal uppercase tracking-wider">
              Reach Out
            </h4>

            <div className="space-y-2 typo-small text-white/75 leading-relaxed">
              <p>
                <span className="text-white/50">Email:</span>{' '}
                <a href={`mailto:${email}`} className="text-white hover:text-[#B89D77] transition-colors">
                  {email}
                </a>
              </p>
              <p>
                <span className="text-white/50">Tel:</span>{' '}
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-white hover:text-[#B89D77] transition-colors">
                  {phone}
                </a>
              </p>
              <p className="pt-1 text-white/80">
                {fullAddress}
              </p>
            </div>

            <div className="pt-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block typo-nav text-xs text-white hover:text-[#B89D77] border-b border-white hover:border-[#B89D77] pb-1 transition-all duration-200"
              >
                GET DIRECTIONS
              </a>
            </div>
          </div>

          {/* Column 3: Newsletter & Stay Connected (Exact CozyStay Style) */}
          <div className="lg:col-span-3 space-y-4 reveal-init reveal-delay-2">
            <h4 className="typo-card-heading text-white font-normal uppercase tracking-wider">
              Sign up for newsletter
            </h4>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative border-b border-white/30 focus-within:border-[#B89D77] transition-colors pb-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="bg-transparent text-white text-xs w-full pr-8 py-1 focus:outline-none placeholder-white/40 font-sans"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/70 hover:text-[#B89D77] transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {subscribed && (
                <p className="text-[11px] text-[#B89D77] font-sans">
                  Thank you for subscribing!
                </p>
              )}

              <label className="flex items-start space-x-2 text-[10px] text-white/60 font-sans cursor-pointer pt-1">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded bg-transparent border-white/30" />
                <span>I agree to the Privacy Policy</span>
              </label>
            </form>

            <div className="pt-4 text-xs font-sans text-white/60">
              <p>Host Concierge Hours: 7:00 AM – 9:30 PM IST</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Policies on Left, Copyright on Right (Exact CozyStay Reference) */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between typo-small text-xs text-white/50 tracking-wider gap-4 reveal-init reveal-delay-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 typo-nav text-xs">
            <button
              onClick={() => setActivePage('dawaipani')}
              className="hover:text-white transition-colors"
            >
              ABOUT DAWAIPANI
            </button>
            <button
              onClick={() => setActivePage('travel')}
              className="hover:text-white transition-colors"
            >
              TRAVEL GUIDE
            </button>
            <button
              onClick={() => setPolicyModal('privacy')}
              className="hover:text-white transition-colors"
            >
              PRIVACY
            </button>
            <button
              onClick={() => setPolicyModal('terms')}
              className="hover:text-white transition-colors"
            >
              TERMS OF USE
            </button>
          </div>

          <div className="text-center sm:text-right typo-small text-xs">
            © Copyright Mineral Springs Retreat. All Rights Reserved.
          </div>
        </div>

      </div>

      {/* Floating Scroll to Top Arrow (Exact CozyStay Floating Button - Luxury Satin Gold Finish) */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-11 h-11 border border-[#B89D77]/40 bg-[#151F18]/90 backdrop-blur-md hover:bg-gradient-to-r hover:from-[#CBB08B] hover:to-[#B89D77] text-white flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none hover:-translate-y-1 rounded-full"
        aria-label="Back to Top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

    </footer>
  );
}
