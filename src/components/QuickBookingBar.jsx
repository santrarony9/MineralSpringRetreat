import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, Users, BedDouble, Search } from 'lucide-react';

export default function QuickBookingBar() {
  const { rooms, openBooking } = useApp();

  // Tomorrow & 3 days later default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextDays = new Date();
  nextDays.setDate(nextDays.getDate() + 4);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState(nextDays.toISOString().split('T')[0]);
  const [guests, setGuests] = useState(2);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const handleCheck = (e) => {
    e.preventDefault();
    openBooking(selectedRoomId, { checkIn, checkOut, guests });
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-10 sm:-mt-14 mb-12">
      <div className="bg-white/95 backdrop-blur-md rounded-none shadow-2xl border border-sand-200/80 p-4 sm:p-6 lg:p-7">
        <form onSubmit={handleCheck} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          
          {/* Check In */}
          <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-sand-200 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-1 flex items-center space-x-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-moss-600" />
              <span>CHECK-IN</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent text-sm font-medium text-earth-900 focus:outline-none cursor-pointer"
              required
            />
          </div>

          {/* Check Out */}
          <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-sand-200 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-1 flex items-center space-x-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-moss-600" />
              <span>CHECK-OUT</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-sm font-medium text-earth-900 focus:outline-none cursor-pointer"
              required
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-sand-200 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-1 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-moss-600" />
              <span>GUESTS</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="bg-transparent text-sm font-medium text-earth-900 focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Guest (Solo Traveler)</option>
              <option value={2}>2 Guests (Couple / Pair)</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests (Family Suite)</option>
              <option value={5}>5+ Guests (Full Villa)</option>
            </select>
          </div>

          {/* Suite / Room Option */}
          <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-sand-200 pb-3 sm:pb-0 sm:pr-4">
            <label className="text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-1 flex items-center space-x-1.5">
              <BedDouble className="w-3.5 h-3.5 text-moss-600" />
              <span>ACCOMMODATION</span>
            </label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-transparent text-sm font-medium text-earth-900 focus:outline-none cursor-pointer truncate"
            >
              <option value="">Any Available Room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (${r.pricePerNight}/nt)
                </option>
              ))}
            </select>
          </div>

          {/* Search / Inquire Button */}
          <div className="pt-2 sm:pt-0">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>CHECK RATES</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
