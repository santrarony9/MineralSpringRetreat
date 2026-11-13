import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, Sparkles, Check, ArrowRight, UserCheck } from 'lucide-react';

export default function GuestAuthModal() {
  const {
    guestAuthModalOpen,
    setGuestAuthModalOpen,
    guestDevLogin,
    guestLoading,
    settings
  } = useApp();

  const [googleConfig, setGoogleConfig] = useState({ configured: false, devMode: true });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [error, setError] = useState('');
  const [devName, setDevName] = useState('Sarah Jenkins');
  const [devEmail, setDevEmail] = useState('sarah.jenkins@gmail.com');
  const [devPhone, setDevPhone] = useState('+91 98320 54321');
  const [showCustomDev, setShowCustomDev] = useState(false);

  useEffect(() => {
    if (guestAuthModalOpen) {
      setError('');
      setLoadingConfig(true);
      fetch('/api/auth/google/config')
        .then(res => res.json())
        .then(data => {
          setGoogleConfig(data);
        })
        .catch(err => {
          console.warn('Failed to load Google auth config:', err);
        })
        .finally(() => setLoadingConfig(false));
    }
  }, [guestAuthModalOpen]);

  if (!guestAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();
      if (data.configured && data.url) {
        // Redirect to Google OAuth Consent screen
        window.location.href = data.url;
      } else {
        // Dev fallback mode
        await guestDevLogin({
          name: devName,
          email: devEmail,
          phone: devPhone
        });
      }
    } catch (err) {
      setError('Unable to initiate Google Sign-in: ' + err.message);
    }
  };

  const handleQuickDevLogin = async (name, email) => {
    setError('');
    const res = await guestDevLogin({
      name,
      email,
      phone: devPhone
    });
    if (!res.success) {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none text-[#1A1A1A]">
      <div
        className="relative bg-[#FAF7F2] w-full max-w-md shadow-2xl border border-[#D5C9B8] rounded-3xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#17251D] px-6 py-6 text-center relative border-b border-[#B89A70]/30">
          <button
            onClick={() => setGuestAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#FAF7F2]/70 hover:text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-[10px] font-roman uppercase tracking-[0.28em] text-[#B89A70] block mb-1">
            {settings?.homestayName || 'MINERAL SPRINGS RETREAT'}
          </span>
          <h3 className="font-roman text-2xl text-[#FAF7F2] font-normal uppercase tracking-wider">
            Guest Sign In
          </h3>
          <p className="text-[11px] text-[#FAF7F2]/70 font-sans mt-1">
            DAWAIPANI · DARJEELING HILLS
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-sans">
              {error}
            </div>
          )}

          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-[#555D56] leading-relaxed font-sans">
              Sign in with your verified <strong>Google (Gmail)</strong> account to complete reservations, track booking status, and coordinate your stay.
            </p>
          </div>

          {/* Primary Action: Continue with Google Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={guestLoading}
              className="w-full flex items-center justify-center space-x-3 px-5 py-3.5 bg-white hover:bg-neutral-50 text-neutral-800 font-sans text-xs sm:text-sm font-semibold rounded-2xl border border-neutral-300 shadow-sm hover:shadow transition-all group"
            >
              {/* Google Brand 'G' Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{guestLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
          </div>

          {/* Development / Demo Mode Helpers (displayed when running locally or client ID pending) */}
          {googleConfig.devMode && (
            <div className="pt-3 border-t border-[#D5C9B8]/60 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7A65]">
                  Development Demo Mode Active
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomDev(!showCustomDev)}
                  className="text-[10px] text-[#B89A70] hover:underline"
                >
                  {showCustomDev ? 'Hide custom' : 'Custom account'}
                </button>
              </div>

              {!showCustomDev ? (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDevLogin('Sarah Jenkins', 'sarah.jenkins@gmail.com')}
                    className="p-2.5 bg-white hover:bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl text-left text-neutral-700 transition-colors shadow-xs"
                  >
                    <div className="font-semibold text-[11px] text-[#17251D]">Sarah Jenkins</div>
                    <div className="text-[9.5px] text-neutral-500 truncate">sarah.j@gmail.com</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDevLogin('Marcus Vance', 'marcus.vance@gmail.com')}
                    className="p-2.5 bg-white hover:bg-[#FAF7F2] border border-[#D5C9B8] rounded-xl text-left text-neutral-700 transition-colors shadow-xs"
                  >
                    <div className="font-semibold text-[11px] text-[#17251D]">Marcus Vance</div>
                    <div className="text-[9.5px] text-neutral-500 truncate">marcus.v@gmail.com</div>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-white border border-[#D5C9B8] rounded-2xl space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-neutral-500 block">Name</label>
                    <input
                      type="text"
                      value={devName}
                      onChange={(e) => setDevName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D5C9B8] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-neutral-500 block">Gmail</label>
                    <input
                      type="email"
                      value={devEmail}
                      onChange={(e) => setDevEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D5C9B8] rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-neutral-500 block">Phone</label>
                    <input
                      type="tel"
                      value={devPhone}
                      onChange={(e) => setDevPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#D5C9B8] rounded-lg text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickDevLogin(devName, devEmail)}
                    className="w-full py-2 bg-[#17251D] text-[#FAF7F2] rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                  >
                    Sign in with this account
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Privacy & Security Guarantee */}
          <div className="pt-2 flex items-start space-x-2 text-[11px] text-[#555D56] leading-relaxed font-sans">
            <ShieldCheck className="w-4 h-4 text-[#B89A70] shrink-0 mt-0.5" />
            <span>
              Secure OAuth 2.0 authentication. We only verify your email and name. We never store or access your Google password.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
