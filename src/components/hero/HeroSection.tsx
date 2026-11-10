import React from 'react';
import { Showroom3D } from '../3d/Showroom3D';
import { soundEngine } from '../../services/audio';
import { ChevronRight, ArrowDown, Gauge, BatteryCharging, Zap, Shield } from 'lucide-react';

interface HeroSectionProps {
  onExploreVehicles: () => void;
  onDiscoverRoadster: () => void;
  onConfigureVehicle: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreVehicles,
  onDiscoverRoadster,
  onConfigureVehicle,
}) => {
  return (
    <section className="relative w-full min-h-screen bg-[#050505] flex flex-col justify-between overflow-hidden pt-20">
      {/* 3D Interactive Vehicle Stage */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Showroom3D
          modelType="roadster"
          currentColorHex="#b30000"
          height="h-full min-h-screen"
          showAllControls={true}
          interactiveControls={true}
        />
      </div>

      {/* Top Hero Text Overlays (Positioned with pointer-events-none so 3D controls remain interactive) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 sm:pt-14 pointer-events-none">
        <div className="max-w-3xl">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-[#e82127] animate-ping" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-300">
              Next-Generation Powertrain Architecture
            </span>
          </div>

          {/* 3D Bold Metallic Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight uppercase leading-[0.95] mb-4">
            <span className="text-metallic drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
              THE FUTURE IS
            </span>
            <br />
            <span className="text-white drop-shadow-[0_0_35px_rgba(232,33,39,0.5)]">
              ELECTRIC<span className="text-[#e82127]">.</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-neutral-300 font-light max-w-2xl leading-relaxed mb-6 drop-shadow-md">
            Experience innovation, performance and luxury with the next generation of electric vehicles.
            Engineered with record-shattering acceleration and uncompromised range.
          </p>

          {/* Action Buttons (pointer-events-auto so they can be clicked) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto">
            <button
              onClick={() => {
                soundEngine.playElectricAcceleration();
                onExploreVehicles();
              }}
              className="px-6 py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-[#e82127] hover:bg-[#c9181e] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_30px_rgba(232,33,39,0.4)] flex items-center gap-2 group"
            >
              <span>Explore Vehicles</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                soundEngine.playElectricAcceleration();
                onDiscoverRoadster();
              }}
              className="px-6 py-3.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all backdrop-blur-md transform hover:-translate-y-0.5"
            >
              Discover The Roadster
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                onConfigureVehicle();
              }}
              className="hidden sm:inline-flex px-5 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider text-neutral-300 hover:text-white bg-black/40 hover:bg-black/60 border border-white/10 transition-colors backdrop-blur-md"
            >
              3D Configurator
            </button>
          </div>
        </div>
      </div>

      {/* Floating Bottom Telemetry / Quick Benchmarks */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 sm:pb-24 pointer-events-none">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl">
          <div className="glass-panel rounded-xl p-3 sm:p-4 border-l-2 border-l-[#e82127]">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5 text-[#e82127]" />
              <span>0-60 MPH</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              1.9<span className="text-sm font-sans font-normal text-neutral-400 ml-1">sec</span>
            </div>
            <div className="text-[11px] text-neutral-400">Quickest in production</div>
          </div>

          <div className="glass-panel rounded-xl p-3 sm:p-4 border-l-2 border-l-white/30">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>TOP SPEED</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              250+<span className="text-sm font-sans font-normal text-neutral-400 ml-1">mph</span>
            </div>
            <div className="text-[11px] text-neutral-400">Aero active diffuser</div>
          </div>

          <div className="glass-panel rounded-xl p-3 sm:p-4 border-l-2 border-l-emerald-500">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
              <span>MAX RANGE</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              620<span className="text-sm font-sans font-normal text-neutral-400 ml-1">mi</span>
            </div>
            <div className="text-[11px] text-neutral-400">200 kWh structural pack</div>
          </div>

          <div className="glass-panel rounded-xl p-3 sm:p-4 border-l-2 border-l-amber-500">
            <div className="flex items-center gap-2 text-neutral-400 text-xs font-mono mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>DRIVE SYSTEM</span>
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              AWD<span className="text-xs font-mono font-normal text-neutral-400 ml-1">Tri-Motor</span>
            </div>
            <div className="text-[11px] text-neutral-400">Torque vectoring control</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onExploreVehicles}
            className="pointer-events-auto flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <span>Scroll to explore models</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#e82127] animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};
