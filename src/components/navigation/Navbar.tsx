import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sliders,
  Scale
} from 'lucide-react';
import { soundEngine } from '../../services/audio';

interface NavbarProps {
  cartCount: number;
  favoritesCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenAdmin: () => void;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  favoritesCount,
  onOpenCart,
  onOpenAccount,
  onOpenAdmin,
  onOpenFavorites,
  onOpenCompare,
  onNavigate,
  activeSection = 'hero'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    soundEngine.playClick();
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) soundEngine.playElectricAcceleration();
  };

  const navLinks = [
    { id: 'hero', label: 'Home' },
    { id: 'explore', label: 'Explore Vehicles' },
    { id: 'models', label: 'Model Range' },
    { id: 'roadster', label: 'Roadster' },
    { id: 'configurator', label: 'Configurator' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#060608]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            {/* Custom stylized Tesla T Logo SVG */}
            <div className="w-8 h-8 flex items-center justify-center text-white group-hover:text-[#e82127] transition-colors">
              <svg viewBox="0 0 342 35" className="h-4 w-auto fill-current">
                <path d="M0 .1a9.7 9.7 0 0 0 7 7h11v27h7.1V7.1h11a9.7 9.7 0 0 0 7-7H0zm68.6 0H61v34h7.6V20.8h16.2V15H68.6V5.9h17.1V.1H68.6zm44.2 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5zm44.2-28.3a9.7 9.7 0 0 0-7 7v27h7.6V7.1a2.2 2.2 0 0 1 2.2-2.2h15.4V.1h-17.6zm47 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5zm44.2-28.3a9.7 9.7 0 0 0-7 7v27h7.6V7.1a2.2 2.2 0 0 1 2.2-2.2h15.4V.1h-17.6zm47 0a9.7 9.7 0 0 0-7 7v20.4a9.7 9.7 0 0 0 7 7h22.6a9.7 9.7 0 0 0 7-7V7.1a9.7 9.7 0 0 0-7-7h-22.6zm15.5 28.3h-8.4V5.9h8.4v22.5z" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="block text-[10px] tracking-[0.25em] text-neutral-400 font-mono uppercase group-hover:text-white transition-colors">
                FUTURE IN MOTION
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium tracking-wide transition-all rounded-lg ${
                  activeSection === link.id
                    ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Turn on sound' : 'Mute sound'}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#e82127]" />}
            </button>

            {/* Compare Tool */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCompare();
              }}
              title="Compare Tesla Models"
              className="hidden md:flex items-center gap-1 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenFavorites();
              }}
              title="Saved Vehicles"
              className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e82127] text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCart();
              }}
              title="Shopping Cart"
              className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e82127] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Profile */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAccount();
              }}
              title="Customer Account & Orders"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenAdmin();
              }}
              title="Admin Portal"
              className="p-2 rounded-lg text-neutral-400 hover:text-[#e82127] hover:bg-white/10 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* CTA Button */}
            <button
              onClick={() => handleNavClick('explore')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-white bg-[#e82127] hover:bg-[#c9181e] active:scale-95 transition-all rounded-lg shadow-[0_0_15px_rgba(232,33,39,0.35)]"
            >
              Shop Now
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden flex flex-col pt-24 px-6 pb-8 border-b border-white/10 animate-in fade-in duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-3 px-4 rounded-xl text-base font-medium tracking-wide ${
                  activeSection === link.id
                    ? 'text-white bg-[#e82127]/20 border border-[#e82127]/40'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCompare();
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-neutral-300 hover:text-white bg-white/5"
            >
              <Scale className="w-4 h-4" />
              <span>Compare Models</span>
            </button>
            <button
              onClick={() => handleNavClick('explore')}
              className="w-full py-3.5 px-4 rounded-xl text-center font-bold uppercase tracking-wider text-white bg-[#e82127] shadow-[0_0_20px_rgba(232,33,39,0.4)]"
            >
              Explore All Vehicles
            </button>
          </div>
        </div>
      )}
    </>
  );
};
