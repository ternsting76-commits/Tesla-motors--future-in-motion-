import React, { useState } from 'react';
import { soundEngine } from '../../services/audio';
import {
  ShieldCheck,
  Send,
  X,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const [activePolicyModal, setActivePolicyModal] = useState<'privacy' | 'terms' | 'refund' | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      soundEngine.playSuccess();
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#030305] text-white border-t border-white/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
            {/* Column 1: Brand Wordmark */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <svg viewBox="0 0 342 35" className="h-4 w-auto fill-current text-white">
                  <path d="M0 .1a9.7 9.7 0 0 0 7 7h11v27h7.1V7.1h11a9.7 9.7 0 0 0 7-7H0zm68.6 0H61v34h7.6V20.8h16.2V15H68.6V5.9h17.1V.1H68.6zm44.2 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5zm44.2-28.3a9.7 9.7 0 0 0-7 7v27h7.6V7.1a2.2 2.2 0 0 1 2.2-2.2h15.4V.1h-17.6zm47 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5zm44.2-28.3a9.7 9.7 0 0 0-7 7v27h7.6V7.1a2.2 2.2 0 0 1 2.2-2.2h15.4V.1h-17.6zm47 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5z" />
                </svg>
                <span className="text-[10px] font-mono tracking-widest text-[#e82127] uppercase">
                  MOTORS &bull; FUTURE IN MOTION
                </span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Luxury electric mobility marketplace. Experience the next era of high-speed automotive engineering, zero-emission supercars, and autonomous driving.
              </p>

              <div className="flex items-center gap-3 pt-2">
                {[
                  { icon: Twitter, href: 'https://twitter.com/tesla' },
                  { icon: Instagram, href: 'https://instagram.com/teslamotors' },
                  { icon: Youtube, href: 'https://youtube.com/tesla' },
                  { icon: Linkedin, href: 'https://linkedin.com' },
                ].map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Fleet Models */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Vehicle Range
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li><button onClick={() => onNavigate('roadster')} className="hover:text-white transition-colors">Tesla Roadster</button></li>
                <li><button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">Cybertruck</button></li>
                <li><button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">Model S Plaid</button></li>
                <li><button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">Model 3 Performance</button></li>
                <li><button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">Model X Plaid</button></li>
                <li><button onClick={() => onNavigate('explore')} className="hover:text-white transition-colors">Model Y Long Range</button></li>
              </ul>
            </div>

            {/* Column 3: Navigation & Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Experience
              </h4>
              <ul className="space-y-2 text-xs text-neutral-400 font-mono">
                <li><button onClick={() => onNavigate('configurator')} className="hover:text-white transition-colors">3D Configurator</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Autonomous Autopilot</button></li>
                <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Supercharger Network</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Schedule Test Drive</button></li>
                <li><button onClick={onOpenAdmin} className="hover:text-[#e82127] text-neutral-400 transition-colors">Dealership Admin</button></li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Future In Motion Brief
              </h4>
              <p className="text-xs text-neutral-400">
                Receive production announcements, software updates, and Roadster delivery alerts.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email..."
                    className="flex-1 bg-[#121217] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127]"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#e82127] hover:bg-[#c9181e] text-white rounded-xl transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {newsletterSuccess && (
                  <span className="text-[10px] font-mono text-emerald-400 block">
                    Subscribed to Tesla Dispatch ✓
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Legal & Policies */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
            <p>
              &copy; {new Date().getFullYear()} Tesla Motors – Future in Motion. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActivePolicyModal('privacy')}
                className="hover:text-neutral-300 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActivePolicyModal('terms')}
                className="hover:text-neutral-300 transition-colors"
              >
                Terms and Conditions
              </button>
              <button
                onClick={() => setActivePolicyModal('refund')}
                className="hover:text-neutral-300 transition-colors"
              >
                Refund Policy
              </button>
              <button
                onClick={scrollToTop}
                title="Back to top"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* POLICY MODAL DIALOG */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101016] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="font-heading font-bold text-lg uppercase">
                {activePolicyModal === 'privacy' && 'Privacy Policy'}
                {activePolicyModal === 'terms' && 'Terms and Conditions'}
                {activePolicyModal === 'refund' && 'Vehicle Reservation & Refund Policy'}
              </h3>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-300 space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed font-sans">
              {activePolicyModal === 'privacy' && (
                <>
                  <p>At Tesla Motors – Future in Motion, we respect your privacy regarding all telemetry, personal contact details, and vehicle telemetry information collected through our marketplace.</p>
                  <p><strong>1. Data Collection:</strong> We collect contact information during test drive bookings, custom vehicle configurations, and reservation checkouts solely to coordinate manufacturing queues and delivery schedules.</p>
                  <p><strong>2. Payment Information:</strong> We do not store full credit card details. Payment processing is tokenized through secure PCI-compliant providers.</p>
                  <p><strong>3. Telemetry:</strong> Vehicle telemetry is encrypted and anonymized to improve safety algorithms and autonomous features.</p>
                </>
              )}

              {activePolicyModal === 'terms' && (
                <>
                  <p><strong>1. Agreement:</strong> By accessing this showroom marketplace, you agree to comply with standard motor vehicle reservation guidelines.</p>
                  <p><strong>2. Vehicle Pricing:</strong> Prices listed exclude local taxes, registration fees, and optional transport upgrades unless specifically delineated in the order agreement.</p>
                  <p><strong>3. Independent Status:</strong> This platform is an authorized independent reservation showroom connecting verified clientele with production allocations.</p>
                </>
              )}

              {activePolicyModal === 'refund' && (
                <>
                  <p><strong>1. Refundable Deposits:</strong> Vehicle reservation deposits (e.g. $5,000 for Tesla Roadster and other standard models) are fully refundable at any time prior to the assignment and signing of your Motor Vehicle Purchase Agreement (MVPA).</p>
                  <p><strong>2. Cancellation Window:</strong> You may request a cancellation directly through your Customer Account portal or by contacting your dedicated concierge specialist.</p>
                  <p><strong>3. Processing Time:</strong> Approved deposit refunds are credited back to the original payment method within 5–7 business days.</p>
                </>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono uppercase tracking-wider text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
