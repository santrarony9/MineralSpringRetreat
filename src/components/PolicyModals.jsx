import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, FileText, Eye } from 'lucide-react';

export default function PolicyModals() {
  const { policyModal, setPolicyModal, settings } = useApp();

  if (!policyModal) return null;

  const homestayName = settings?.homestayName || 'MINERAL SPRINGS RETREAT';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in text-[#1A1A1A]">
      <div 
        className="relative bg-[#FAF7F2] w-full max-w-2xl shadow-2xl border border-[#EAE4DB] p-6 sm:p-10 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setPolicyModal(null)}
          className="absolute top-4 right-4 p-2 bg-white hover:bg-[#111111] hover:text-white rounded-full transition-colors border border-[#EAE4DB]"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {policyModal === 'privacy' && (
          <div>
            <div className="flex items-center space-x-2 text-[#B89D77] mb-2 typo-eyebrow">
              <ShieldCheck className="w-4 h-4" />
              <span>LEGAL & PRIVACY</span>
            </div>
            <h2 className="typo-subsection-heading text-[#1A1A1A] font-normal mb-4">Privacy Policy</h2>
            <div className="space-y-4 typo-body text-sm text-[#4A524D] leading-relaxed">
              <p>
                At <strong>{homestayName}</strong>, we respect your personal privacy. This policy outlines how we handle information gathered during inquiries and reservations.
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">Information We Collect</h4>
              <p>
                We only collect information directly submitted by you—specifically your name, phone number, email address, reservation dates, and any preferences you share.
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">How We Use Your Details</h4>
              <p>
                Your contact details are strictly utilized to coordinate your stay, provide check-in information, and respond to your direct inquiries. We never sell, rent, or distribute guest data.
              </p>
            </div>
          </div>
        )}

        {policyModal === 'terms' && (
          <div>
            <div className="flex items-center space-x-2 text-[#B89D77] mb-2 typo-eyebrow">
              <FileText className="w-4 h-4" />
              <span>GUEST GUIDELINES</span>
            </div>
            <h2 className="typo-subsection-heading text-[#1A1A1A] font-normal mb-4">Terms & Conditions</h2>
            <div className="space-y-4 typo-body text-sm text-[#4A524D] leading-relaxed">
              <p>
                Welcome to <strong>{homestayName}</strong>. All guests are kindly asked to observe the following gentle policies:
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">Check-in & Check-out</h4>
              <p>
                Check-in is welcomed from <strong>{settings?.checkInTime || '2:00 PM'}</strong> onwards. Check-out is requested by <strong>{settings?.checkOutTime || '11:00 AM'}</strong>.
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">Smoke-Free Environment</h4>
              <p>
                All interior suites and common areas are strictly non-smoking to preserve air freshness and guest comfort.
              </p>
            </div>
          </div>
        )}

        {policyModal === 'accessibility' && (
          <div>
            <div className="flex items-center space-x-2 text-[#B89D77] mb-2 typo-eyebrow">
              <Eye className="w-4 h-4" />
              <span>COMMITMENT</span>
            </div>
            <h2 className="typo-subsection-heading text-[#1A1A1A] font-normal mb-4">Accessibility Statement</h2>
            <div className="space-y-4 typo-body text-sm text-[#4A524D] leading-relaxed">
              <p>
                At <strong>{homestayName}</strong>, we are dedicated to ensuring digital and physical accessibility for all our guests.
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">Digital Standards</h4>
              <p>
                Our website is designed in accordance with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, featuring high contrast typography, keyboard-friendly navigation, and semantic structural tags.
              </p>
              <h4 className="font-serif text-base text-[#1A1A1A] font-medium pt-2">Property Accessibility</h4>
              <p>
                Ground floor suites with step-free entrance, roll-in showers, and dedicated accessible parking are available. Please let our concierge know your specific requirements.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#EAE4DB] text-right">
          <button
            onClick={() => setPolicyModal(null)}
            className="cozy-btn-outline-box typo-btn text-xs text-[#1A1A1A] border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
