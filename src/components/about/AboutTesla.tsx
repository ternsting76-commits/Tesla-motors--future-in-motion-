import React from 'react';
import {
  Zap,
  BatteryCharging,
  ShieldCheck,
  Cpu,
  Globe2,
  Leaf,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AboutTesla: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#050508] text-white relative border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#e82127]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e82127] uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mission & Engineering Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase tracking-tight">
            Accelerating The World's Transition to Sustainable Energy
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-4 leading-relaxed">
            Tesla builds not only all-electric vehicles but also infinitely scalable clean energy generation and storage products. We believe the faster the world stops relying on fossil fuels and moves towards a zero-emission future, the better.
          </p>
        </div>

        {/* 4 Pillar Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-[#e82127]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#e82127]/10 border border-[#e82127]/30 flex items-center justify-center text-[#e82127]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Instantaneous Torque
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Unlike internal combustion engines with hundreds of moving parts, Tesla electric motors deliver full torque at 0 RPM, propelling vehicles from 0 to 60 in under 2 seconds with linear, seamless power delivery.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-[#e82127]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Structural 4680 Pack
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The battery pack is an integral structural member of the car's chassis, providing exceptional torsional rigidity, a low center of gravity to prevent rollover, and 500+ miles of high-efficiency driving range.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-[#e82127]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Neural Net AI Vision
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Full Self-Driving relies exclusively on neural networks trained on millions of real-world fleet miles, processing 360-degree high-definition video at the speed of human intuition without requiring expensive lidar mapping.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4 hover:border-[#e82127]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg uppercase text-white">
              Global Supercharging
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Over 50,000 Superchargers stationed worldwide across prime travel corridors. Add up to 200 miles of highway range in just 15 minutes with seamless plug-and-charge automation.
            </p>
          </div>
        </div>

        {/* Independent Marketplace Transparency Notice */}
        <div className="p-8 rounded-3xl bg-[#0f0f16] border border-[#e82127]/30 shadow-[0_0_40px_rgba(232,33,39,0.1)] flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#e82127] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Independent Authorized Vehicle Marketplace</span>
            </div>
            <h4 className="font-heading font-bold text-xl uppercase text-white">
              Authentic Allocation & Certified Experience
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Tesla Motors – Future in Motion is an independent electric vehicle showcase and premium reservation facilitator. All vehicle specifications, production queues, warranties, and delivery logistics are officially coordinated with regional Tesla delivery centers and factory logistics.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right font-mono text-xs text-neutral-400">
              <div className="text-white font-bold">100% Genuine Allocation</div>
              <div>Direct Factory Warranty Included</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
