import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Navigation, Clock } from 'lucide-react';

export default function ContactSection() {
  const { settings, submitInquiry } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const phone1 = settings?.phone || '+91 79081 92498';
  const phone2 = settings?.phone2 || '+91 98303 55105';
  const email = settings?.email || 'stay@mineralspringsretreat.com';
  const address = settings?.address || 'Mineral Springs, Yankoo, Dawaipani, Lebong and Mineral Spring Tea Garden, West Bengal – 734105, India.';
  const officialName = settings?.officialName || 'Mineral Springs Retreat';
  const propertyCategory = settings?.propertyCategory || 'Homestay in Lebong and Mineral Spring Tea Garden, West Bengal.';
  const directionsUrl = settings?.googleDirectionsUrl || 'https://www.google.com/search?sa=X&q=mineral+springs+retreat+dawaipani+address&ludocid=12917762238512786598';
  const whatsapp1 = settings?.whatsapp || '+91 79081 92498';
  const whatsapp2 = settings?.whatsapp2 || '+91 98303 55105';
  const cleanPhone1 = whatsapp1.replace(/[^0-9]/g, '');
  const cleanPhone2 = whatsapp2.replace(/[^0-9]/g, '');
  const mapsEmbed = settings?.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14197.647313883734!2d88.2917!3d27.0543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a575a7f29c41%3A0x6b3f749553755b46!2sDawaipani%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  const handleWhatsAppClick1 = () => {
    const text = encodeURIComponent(`Hello! I'm interested in staying at ${settings?.homestayName || 'Mineral Springs Retreat'}. Could you provide more details about current availability?`);
    window.open(`https://wa.me/${cleanPhone1}?text=${text}`, '_blank');
  };

  const handleWhatsAppClick2 = () => {
    const text = encodeURIComponent(`Hello! I'm interested in staying at ${settings?.homestayName || 'Mineral Springs Retreat'}. Could you provide more details about current availability?`);
    window.open(`https://wa.me/${cleanPhone2}?text=${text}`, '_blank');
  };

  const handleDirectionsClick = () => {
    window.open(directionsUrl, '_blank');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      // Send as inquiry message
      await submitInquiry({
        guestName: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        room: 'General Inquiry / Message',
        roomId: 'contact-form',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: 1,
        children: 0,
        numRooms: 1,
        specialRequests: `Subject: ${formData.subject}\nMessage: ${formData.message}`
      });
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send message. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-cream-100 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest-xl font-medium text-moss-600 block mb-3">
            GET IN TOUCH
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-earth-900 font-normal leading-tight">
            Connect With Your Hosts
          </h2>
          <div className="w-12 h-[1px] bg-sand-400 mx-auto mt-6" />
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact Cards & WhatsApp */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-sand-500 font-semibold mb-2 block">
                WARM HOSPITALITY
              </span>
              <h3 className="font-serif text-3xl text-earth-900 font-normal mb-4">
                We're Here to Help Plan Your Stay
              </h3>
              <p className="text-xs sm:text-sm text-earth-900/75 leading-relaxed font-light">
                Have questions about special dietary requirements, secluded suite choices, or local trail guides? Reach out directly to our resident concierge.
              </p>
            </div>

            {/* Direct Contact Items */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-4 p-4 bg-white border border-sand-200/90 shadow-sm">
                <div className="p-2.5 bg-cream-100 text-moss-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-earth-900 mb-1">Sanctuary Location</h4>
                  <p className="text-xs text-earth-900/80 leading-relaxed font-light">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white border border-sand-200/90 shadow-sm">
                <div className="p-2.5 bg-cream-100 text-moss-600 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-earth-900 mb-1">Telephone / Direct Call</h4>
                  <div className="space-y-1">
                    <a href={`tel:${phone1.replace(/[^0-9+]/g, '')}`} className="text-xs text-earth-900/90 hover:text-moss-700 font-medium block">
                      {phone1}
                    </a>
                    <a href={`tel:${phone2.replace(/[^0-9+]/g, '')}`} className="text-xs text-earth-900/90 hover:text-moss-700 font-medium block">
                      {phone2}
                    </a>
                  </div>
                  <div className="text-[10px] text-sand-400 font-light mt-1">Available 7:00 AM – 9:00 PM IST</div>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white border border-sand-200/90 shadow-sm">
                <div className="p-2.5 bg-cream-100 text-moss-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-earth-900 mb-1">Email Inquiries</h4>
                  <a href={`mailto:${email}`} className="text-xs text-earth-900/80 hover:text-moss-700 font-light">
                    {email}
                  </a>
                  <div className="text-[10px] text-sand-400 font-light mt-0.5">Replies typically within 2 hours</div>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct Action Buttons */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleWhatsAppClick1}
                className="w-full py-3.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white uppercase tracking-wider text-[11px] font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>CHAT: {phone1}</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsAppClick2}
                className="w-full py-3.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white uppercase tracking-wider text-[11px] font-semibold shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>CHAT: {phone2}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white border border-sand-200/90 shadow-lg p-6 sm:p-10">
            {submitted ? (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-3xl text-earth-900 font-normal mb-2">
                  Message Delivered
                </h3>
                <p className="text-xs sm:text-sm text-earth-900/70 max-w-md mx-auto mb-6 font-light">
                  Thank you for reaching out. Your inquiry has been safely received by our hosts. We will respond via email or phone shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 bg-earth-900 text-cream-50 uppercase tracking-widest text-xs font-semibold"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block">
                  SEND US A NOTE
                </span>
                <h3 className="font-serif text-2xl text-earth-900 font-normal">
                  How can we make your visit memorable?
                </h3>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julian Ross"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sand-300 text-xs text-earth-900 focus:outline-none focus:border-earth-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="julian@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sand-300 text-xs text-earth-900 focus:outline-none focus:border-earth-900 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 79081 92498"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sand-300 text-xs text-earth-900 focus:outline-none focus:border-earth-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-cream-50 border border-sand-300 text-xs text-earth-900 focus:outline-none focus:border-earth-900 transition-colors"
                    >
                      <option value="General Inquiry">General Stay Question</option>
                      <option value="Suite Selection">Suite & Room Recommendations</option>
                      <option value="Dietary & Dining">Farm Dining & Special Diet</option>
                      <option value="Private Booking">Full Property / Private Buyout</option>
                      <option value="Directions & Arrival">Transportation & Arrival</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-sand-500 block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your upcoming travel dates, party size, or any special moments you are celebrating..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-50 border border-sand-300 text-xs text-earth-900 focus:outline-none focus:border-earth-900 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'SENDING NOTE...' : 'SEND INQUIRY'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Location & Interactive Google Map Section */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-sand-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-moss-600 font-semibold block mb-1">
                JOURNEY TO THE RETREAT
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-earth-900 font-normal">
                How to Reach Mineral Springs Retreat
              </h3>
            </div>
            
            <button
              onClick={handleDirectionsClick}
              className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-2.5 bg-earth-900 hover:bg-moss-700 text-cream-50 uppercase tracking-widest text-xs font-semibold shadow-sm transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions in Google Maps</span>
            </button>
          </div>

          {/* Map Frame */}
          <div className="w-full h-80 sm:h-96 bg-sand-200 border border-sand-300 shadow-inner overflow-hidden relative">
            <iframe
              title="Homestay Location Map"
              src={mapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 text-xs text-earth-900/80 font-light">
            <div className="p-4 bg-white border border-sand-200">
              <span className="font-semibold text-earth-900 uppercase tracking-wider block mb-1">By Air</span>
              Nearest regional airport is 45 minutes drive away. Private scenic transfers can be arranged on request.
            </div>
            <div className="p-4 bg-white border border-sand-200">
              <span className="font-semibold text-earth-900 uppercase tracking-wider block mb-1">Scenic Drive</span>
              Take the picturesque High Ridge Valley Route. Paved roads lead directly to our private entry gates.
            </div>
            <div className="p-4 bg-white border border-sand-200">
              <span className="font-semibold text-earth-900 uppercase tracking-wider block mb-1">Parking & Valet</span>
              Complimentary on-site guest parking with EV charging stations available.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
