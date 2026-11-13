import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Users, BedDouble, Maximize2, Check, Calendar, ChevronLeft, ChevronRight, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export default function RoomDetailModal({ room, onClose }) {
  const { openBooking, settings } = useApp();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!room) return null;

  const images = room.images && room.images.length > 0 
    ? room.images 
    : ['/images/mineral-springs/room-double-sharing-balcony.jpg'];

  const handleBookThisRoom = () => {
    onClose();
    openBooking(room.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-earth-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fade-in">
      <div 
        className="relative bg-cream-50 w-full max-w-5xl shadow-2xl border border-sand-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 bg-earth-900/80 hover:bg-earth-900 text-cream-50 rounded-full transition-all shadow-md"
          aria-label="Close room details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Image Showcase */}
          <div className="lg:col-span-7 bg-earth-950 p-6 flex flex-col justify-between">
            {/* Active Main Image */}
            <div className="relative w-full h-72 sm:h-96 overflow-hidden rounded-none shadow-md">
              <img
                src={images[activeImgIndex]}
                alt={`${room.name} view ${activeImgIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 text-cream-100 text-[11px] uppercase tracking-wider backdrop-blur-sm">
                {activeImgIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center space-x-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-16 shrink-0 overflow-hidden border-2 transition-all ${
                      idx === activeImgIndex ? 'border-brass-400 opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Room Specs Bar */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-white">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-brass-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-sand-400">Capacity</div>
                  <div className="text-xs font-medium">Up to {room.maxGuests || room.capacity} Guests</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BedDouble className="w-4 h-4 text-brass-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-sand-400">Bedding</div>
                  <div className="text-xs font-medium truncate">{room.bed}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Maximize2 className="w-4 h-4 text-brass-400 shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-sand-400">Room Size</div>
                  <div className="text-xs font-medium">{room.size || '500 sq. ft.'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Room Details & Booking Action */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-cream-50">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest-xl font-semibold text-moss-600">
                  HANDCRAFTED SUITE
                </span>
                <span className="font-serif text-2xl font-normal text-earth-900">
                  ${room.pricePerNight}
                  <span className="text-xs font-sans text-sand-500 font-normal"> / night</span>
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-earth-900 font-normal mb-2 leading-tight">
                {room.name}
              </h2>

              {room.tagline && (
                <p className="italic text-xs text-moss-700 mb-4 font-serif">
                  "{room.tagline}"
                </p>
              )}

              <p className="text-xs sm:text-sm text-earth-900/80 leading-relaxed font-light mb-6">
                {room.description}
              </p>

              {/* Facilities / Inclusions */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-earth-900 mb-3 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-moss-600" />
                  <span>SUITE AMENITIES & FACILITIES</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {room.facilities?.map((f, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-earth-900/90 font-light">
                      <Check className="w-3.5 h-3.5 text-moss-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies & Times */}
              <div className="p-4 bg-sand-100/70 border border-sand-200 mb-6 space-y-2">
                <div className="flex items-center space-x-2 text-[11px] text-earth-900 font-medium">
                  <Clock className="w-3.5 h-3.5 text-sand-500" />
                  <span>Check-in: {settings?.checkInTime || '2:00 PM'} · Check-out: {settings?.checkOutTime || '11:00 AM'}</span>
                </div>
                {room.policies?.map((pol, i) => (
                  <div key={i} className="flex items-center space-x-2 text-[11px] text-earth-900/70">
                    <ShieldCheck className="w-3.5 h-3.5 text-moss-600" />
                    <span>{pol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-sand-200 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleBookThisRoom}
                className="w-full py-3.5 px-6 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>BOOK THIS SUITE (${room.pricePerNight}/NT)</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
