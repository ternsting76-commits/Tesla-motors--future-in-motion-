import React, { useState } from 'react';
import { CustomerInquiry, Vehicle } from '../../types';
import { StorageService } from '../../services/storage';
import { soundEngine } from '../../services/audio';
import {
  Send,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ContactSectionProps {
  vehicles: Vehicle[];
  prefilledVehicle?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  vehicles,
  prefilledVehicle = 'Tesla Roadster',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleOfInterest, setVehicleOfInterest] = useState(prefilledVehicle);
  const [inquiryType, setInquiryType] = useState<CustomerInquiry['inquiryType']>('Schedule Test Drive');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEngine.playElectricAcceleration();

    setTimeout(() => {
      const newInquiry: CustomerInquiry = {
        id: `inq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        fullName,
        email,
        phone,
        vehicleOfInterest,
        inquiryType,
        message,
        status: 'New',
      };

      StorageService.addInquiry(newInquiry);
      setIsSubmitting(false);
      setSubmitted(true);
      soundEngine.playSuccess();

      // Reset form
      setMessage('');
    }, 800);
  };

  return (
    <section id="contact" className="py-24 bg-[#07070a] text-white relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Showroom Info & Concierge */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e82127] uppercase tracking-wider mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Showroom Concierge</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase tracking-tight">
                Get In Touch
              </h2>
              <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
                Schedule a track test drive, inquire about custom enterprise fleet allocations, or consult with a product specialist about your Roadster reservation.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e82127]/20 flex items-center justify-center text-[#e82127] flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Global Flagship Hub</span>
                  <span className="text-white font-bold text-sm">1 Tesla Road, Austin, Texas 78725</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">VIP Concierge Line</span>
                  <span className="text-white font-bold text-sm">+1 320-738-1283 &bull; 24/7 Priority</span>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Client Inquiries</span>
                  <span className="text-white font-bold text-sm">concierge@tesla-futureinmotion.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Test Drive Form */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-heading font-bold uppercase text-white">
                  Enquiry Submitted Successfully
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  Thank you, {fullName}. Your request for the {vehicleOfInterest} has been sent to our showroom team and registered in the administrative queue. A concierge specialist will reach out within 4 business hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Elena Vance"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="elena@example.com"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 320-738-1283"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Vehicle of Interest</label>
                    <select
                      value={vehicleOfInterest}
                      onChange={e => setVehicleOfInterest(e.target.value)}
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Inquiry Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Schedule Test Drive', 'Purchase Enquiry', 'Financing Assistance', 'Fleet / Commercial'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setInquiryType(type);
                        }}
                        className={`p-2.5 rounded-xl text-[11px] font-mono transition-colors text-center ${
                          inquiryType === type
                            ? 'bg-[#e82127] text-white font-bold shadow-[0_0_15px_rgba(232,33,39,0.4)]'
                            : 'bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Your Message or Custom Request</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us about your desired delivery timeframe, trade-in vehicle, or specific questions about the powertrain..."
                    className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#e82127]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] disabled:opacity-50 shadow-[0_0_25px_rgba(232,33,39,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Official Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
