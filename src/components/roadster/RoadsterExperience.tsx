import React, { useState } from 'react';
import { Showroom3D } from '../3d/Showroom3D';
import { Vehicle } from '../../types';
import { soundEngine } from '../../services/audio';
import {
  Zap,
  Gauge,
  Flame,
  BatteryCharging,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Check,
  ChevronRight
} from 'lucide-react';

interface RoadsterExperienceProps {
  roadster: Vehicle;
  onReserve: (vehicle: Vehicle) => void;
  onOpenEnquiry: (vehicleName: string) => void;
}

export const RoadsterExperience: React.FC<RoadsterExperienceProps> = ({
  roadster,
  onReserve,
  onOpenEnquiry
}) => {
  const [activeTab, setActiveTab] = useState<'3d' | 'exterior' | 'interior' | 'spacex'>('3d');
  const [selectedColor, setSelectedColor] = useState(roadster.colors[0]?.hex || '#b30000');

  const benchmarks = [
    { label: '0-60 MPH', value: '1.9 s', sub: 'Base Model (1.1s SpaceX Pkg)' },
    { label: '0-100 MPH', value: '4.2 s', sub: 'Unprecedented pull' },
    { label: '1/4 MILE', value: '8.8 s', sub: 'Record for street legal' },
    { label: 'TOP SPEED', value: '250+ mph', sub: 'Aerodynamic active downforce' },
    { label: 'WHEEL TORQUE', value: '10,000 Nm', sub: 'Instant electric response' },
    { label: 'HIGHWAY RANGE', value: '620 miles', sub: '200 kWh structural battery' },
  ];

  return (
    <section id="roadster" className="relative py-28 bg-[#040406] text-white overflow-hidden border-t border-b border-white/10">
      {/* Background Cinematic Lighting Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e82127]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Headline */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e82127]/10 border border-[#e82127]/30 text-xs font-mono text-[#e82127] tracking-widest uppercase mb-4">
            <Flame className="w-4 h-4 text-[#e82127]" />
            <span>Founders Series & SpaceX Edition</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight uppercase leading-none mb-4">
            <span className="text-metallic">BEYOND SPEED.</span>
            <br />
            <span className="text-white drop-shadow-[0_0_40px_rgba(232,33,39,0.5)]">
              BEYOND EXPECTATIONS<span className="text-[#e82127]">.</span>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
            The quickest car in the world, with record-setting acceleration, range and performance.
            Designed to shatter records and redefine physics.
          </p>
        </div>

        {/* Interactive Presentation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#101015] border border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('3d');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === '3d'
                  ? 'bg-[#e82127] text-white shadow-[0_0_20px_rgba(232,33,39,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Interactive 3D Showroom
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('exterior');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'exterior'
                  ? 'bg-[#e82127] text-white shadow-[0_0_20px_rgba(232,33,39,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Exterior Design
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('interior');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'interior'
                  ? 'bg-[#e82127] text-white shadow-[0_0_20px_rgba(232,33,39,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cockpit & Glass Roof
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('spacex');
              }}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'spacex'
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SpaceX Package
            </button>
          </div>
        </div>

        {/* Viewport Display Box */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#09090d] shadow-2xl mb-16">
          {activeTab === '3d' && (
            <div className="w-full h-[520px] sm:h-[620px] relative">
              <Showroom3D
                modelType="roadster"
                currentColorHex={selectedColor}
                height="h-full"
                showAllControls={true}
                interactiveControls={true}
                onColorChange={(hex) => setSelectedColor(hex)}
              />
            </div>
          )}

          {activeTab === 'exterior' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 sm:p-8">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={roadster.images.hero}
                  alt="Roadster Front"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={roadster.images.exterior[1] || roadster.images.hero}
                  alt="Roadster Side"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {activeTab === 'interior' && (
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 aspect-[16/10] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={roadster.images.interior[0]}
                  alt="Roadster Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-xl font-heading font-bold uppercase mb-2">
                  Glass Targa Roof
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                  A lightweight, removable glass roof stores seamlessly in the trunk for an open-air, convertible driving experience without sacrificing aerodynamic slip.
                </p>
                <div className="space-y-2 text-xs font-mono text-neutral-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e82127]" />
                    <span>Seating for 4 passengers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e82127]" />
                    <span>Next-gen ergonomic drive yoke</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#e82127]" />
                    <span>Curved central OLED glass screen</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spacex' && (
            <div className="p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-black to-neutral-950">
              <div className="max-w-2xl">
                <span className="px-3 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono uppercase tracking-widest mb-4 inline-block">
                  Aero-Rocketry Technology
                </span>
                <h3 className="text-3xl sm:text-4xl font-heading font-extrabold uppercase mb-4">
                  Cold Gas Rocket Thrusters
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  Developed in tandem with SpaceX, the optional rocket package replaces the rear two seats with a composite overwrapped pressure vessel (COPV) air tank, feeding ultra-high-pressure cold gas thrusters arranged around the car for physics-defying 1.1s 0-60 acceleration, braking, and lateral cornering.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/60 p-3 rounded-xl border border-purple-500/30">
                    <span className="text-[10px] font-mono text-purple-300 block">0-60 MPH (SpaceX)</span>
                    <span className="text-2xl font-heading font-bold text-white">1.1 sec</span>
                  </div>
                  <div className="bg-black/60 p-3 rounded-xl border border-purple-500/30">
                    <span className="text-[10px] font-mono text-purple-300 block">Lateral G-Force</span>
                    <span className="text-2xl font-heading font-bold text-white">2.5+ G</span>
                  </div>
                  <div className="bg-black/60 p-3 rounded-xl border border-purple-500/30">
                    <span className="text-[10px] font-mono text-purple-300 block">Braking Distance</span>
                    <span className="text-2xl font-heading font-bold text-white">-40%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playElectricAcceleration();
                    onReserve(roadster);
                  }}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all"
                >
                  Reserve SpaceX Package ($250,000)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Key Performance Benchmarks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {benchmarks.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-4 rounded-2xl border-t-2 border-t-[#e82127]/60 hover:border-[#e82127] transition-all group"
            >
              <div className="text-[10px] font-mono uppercase text-neutral-400 mb-1">
                {item.label}
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white group-hover:text-[#e82127] transition-colors">
                {item.value}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {item.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing & Reservation CTA Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-[#e82127]/30 shadow-[0_0_50px_rgba(232,33,39,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#e82127] block mb-1">
              Official Founders Series Allocation
            </span>
            <h3 className="text-2xl sm:text-4xl font-heading font-bold uppercase text-white mb-2">
              Reserve Your Roadster Today
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl">
              Lock in your priority delivery spot. Base reservation requires a $5,000 refundable wire or credit card deposit today, with full balance upon VIN assignment.
            </p>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl sm:text-4xl font-heading font-extrabold text-white">
                ${roadster.basePrice.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                (or $5,000 reservation deposit)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenEnquiry(roadster.name);
              }}
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-center"
            >
              VIP Consultation
            </button>

            <button
              onClick={() => {
                soundEngine.playElectricAcceleration();
                onReserve(roadster);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] transition-all transform hover:-translate-y-0.5 shadow-[0_0_35px_rgba(232,33,39,0.5)] flex items-center justify-center gap-2"
            >
              <span>Reserve Your Roadster</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
