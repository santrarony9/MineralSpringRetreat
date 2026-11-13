import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, BedDouble, Sparkles, ArrowRight, Eye, Calendar } from 'lucide-react';
import RoomDetailModal from './RoomDetailModal';

export default function RoomsSection() {
  const { rooms, openBooking } = useApp();
  const [selectedRoomForModal, setSelectedRoomForModal] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredRooms = rooms.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'featured') return r.featured;
    if (activeFilter === 'villas') return r.name.toLowerCase().includes('villa');
    if (activeFilter === 'suites') return r.name.toLowerCase().includes('suite') || r.name.toLowerCase().includes('pavilion');
    return true;
  });

  return (
    <section id="accommodation" className="py-20 md:py-32 bg-cream-100 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest-xl font-medium text-moss-600 block mb-3">
              SANCTUARY SPACES
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-earth-900 font-normal leading-tight">
              Handcrafted Accommodation
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-earth-900/70 text-sm max-w-md font-light leading-relaxed">
            Each suite is thoughtfully angled to capture morning valley sunlight and sunset silhouettes, furnished with natural textiles and private outdoor terraces.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 sm:space-x-4 mb-12 border-b border-sand-200 pb-4 overflow-x-auto">
          {[
            { id: 'all', label: 'All Rooms & Suites' },
            { id: 'featured', label: 'Featured Retreats' },
            { id: 'suites', label: 'Suites & Pavilions' },
            { id: 'villas', label: 'Freestanding Villas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`text-xs uppercase tracking-widest py-2 px-4 transition-all duration-300 font-medium whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-earth-900 text-cream-50 shadow-sm'
                  : 'text-earth-900/70 hover:text-earth-900 hover:bg-sand-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
          {filteredRooms.map((room) => {
            const coverImage = room.images?.[0] || '/images/room-forest-suite.jpg';

            return (
              <div
                key={room.id}
                className="group bg-white border border-sand-200/90 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-72 sm:h-80 overflow-hidden bg-sand-200 cursor-pointer" onClick={() => setSelectedRoomForModal(room)}>
                  <img
                    src={coverImage}
                    alt={room.name}
                    className="w-full h-full object-cover img-hover-zoom"
                  />
                  
                  {/* Floating Price Pill */}
                  <div className="absolute top-4 right-4 bg-earth-950/90 backdrop-blur-md text-cream-50 px-4 py-2 border border-white/20 shadow-md">
                    <span className="font-serif text-lg font-normal">${room.pricePerNight}</span>
                    <span className="text-[10px] text-cream-200 uppercase tracking-widest ml-1 font-light">/ night</span>
                  </div>

                  {/* Featured Badge */}
                  {room.featured && (
                    <div className="absolute top-4 left-4 bg-brass-500 text-earth-950 text-[10px] uppercase tracking-widest font-bold px-3 py-1 shadow-sm">
                      Signature Stay
                    </div>
                  )}

                  {/* Quick View Details Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <span className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/95 text-earth-900 text-xs uppercase tracking-widest font-semibold shadow-lg backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5 text-moss-600" />
                      <span>View Gallery & Details</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center space-x-4 text-xs text-sand-500 font-medium mb-2 uppercase tracking-widest">
                      <span className="flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-moss-600" />
                        <span>Up to {room.maxGuests || room.capacity} Guests</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center space-x-1">
                        <BedDouble className="w-3.5 h-3.5 text-moss-600" />
                        <span>{room.bed}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl text-earth-900 font-normal mb-2 leading-tight group-hover:text-moss-700 transition-colors">
                      {room.name}
                    </h3>

                    {room.tagline && (
                      <p className="italic text-xs text-moss-700 mb-3 font-serif">
                        {room.tagline}
                      </p>
                    )}

                    <p className="text-xs sm:text-sm text-earth-900/75 leading-relaxed font-light mb-6 line-clamp-3">
                      {room.description}
                    </p>

                    {/* Facilities Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {room.facilities?.slice(0, 4).map((f, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-[11px] bg-sand-100 text-earth-900/90 border border-sand-200/80 font-light"
                        >
                          {f}
                        </span>
                      ))}
                      {room.facilities?.length > 4 && (
                        <span className="px-2 py-1 text-[11px] text-sand-500 font-medium">
                          +{room.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Details & Book Now */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-sand-200">
                    <button
                      onClick={() => setSelectedRoomForModal(room)}
                      className="py-3 px-3 text-center border border-earth-900/40 hover:border-earth-900 text-earth-900 text-xs uppercase tracking-widest font-semibold transition-all hover:bg-sand-100"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => openBooking(room.id)}
                      className="py-3 px-3 text-center bg-earth-900 hover:bg-moss-700 text-cream-50 text-xs uppercase tracking-widest font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Now</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Dedicated Room Detail Modal */}
      {selectedRoomForModal && (
        <RoomDetailModal
          room={selectedRoomForModal}
          onClose={() => setSelectedRoomForModal(null)}
        />
      )}
    </section>
  );
}
