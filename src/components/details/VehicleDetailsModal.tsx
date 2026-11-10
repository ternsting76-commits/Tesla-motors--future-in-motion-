import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { soundEngine } from '../../services/audio';
import {
  X,
  Zap,
  Gauge,
  BatteryCharging,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Sliders,
  DollarSign
} from 'lucide-react';

interface VehicleDetailsModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onConfigure: (vehicle: Vehicle) => void;
  onContactSeller: (vehicleName: string) => void;
  onInstantBuy: (vehicle: Vehicle) => void;
  onChatWithAdmin?: (vehicle: Vehicle) => void;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  vehicle,
  onClose,
  onConfigure,
  onContactSeller,
  onInstantBuy,
  onChatWithAdmin,
}) => {
  const [activeGalleryTab, setActiveGalleryTab] = useState<'exterior' | 'interior'>('exterior');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Financing calculator state
  const [downPayment, setDownPayment] = useState(() => vehicle ? Math.round(vehicle.basePrice * 0.15) : 0);
  const [loanTerm, setLoanTerm] = useState(72);
  const interestRate = 0.0499; // 4.99% APR

  if (!vehicle) return null;

  const principal = Math.max(0, vehicle.basePrice - downPayment);
  const monthlyRate = interestRate / 12;
  const monthlyPayment = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) /
    (Math.pow(1 + monthlyRate, loanTerm) - 1)
  );

  const imagesToShow = activeGalleryTab === 'exterior'
    ? [vehicle.images.hero, ...vehicle.images.exterior]
    : vehicle.images.interior;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0c0c10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-neutral-800 text-white/80 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Header */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-black overflow-hidden">
          <img
            src={imagesToShow[activeImageIndex] || vehicle.images.hero}
            alt={vehicle.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-transparent to-black/50" />

          {/* Gallery Switcher */}
          <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveGalleryTab('exterior');
                setActiveImageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeGalleryTab === 'exterior'
                  ? 'bg-[#e82127] text-white shadow-[0_0_15px_rgba(232,33,39,0.5)]'
                  : 'bg-black/60 text-neutral-300 hover:text-white'
              }`}
            >
              Exterior ({vehicle.images.exterior.length + 1})
            </button>
            <button
              onClick={() => {
                setActiveGalleryTab('interior');
                setActiveImageIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                activeGalleryTab === 'interior'
                  ? 'bg-[#e82127] text-white shadow-[0_0_15px_rgba(232,33,39,0.5)]'
                  : 'bg-black/60 text-neutral-300 hover:text-white'
              }`}
            >
              Interior Cockpit ({vehicle.images.interior.length})
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-3 py-1 rounded-md bg-[#e82127]/20 border border-[#e82127]/40 text-[#e82127] text-[10px] font-mono uppercase tracking-wider mb-2 inline-block">
              {vehicle.category} &bull; {vehicle.drivetrain}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold uppercase text-white tracking-tight">
              {vehicle.name}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono">
              {vehicle.tagline}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <Zap className="w-4 h-4 text-[#e82127]" />
                <span>0-60 MPH</span>
              </div>
              <div className="text-2xl font-heading font-bold text-white">
                {vehicle.acceleration060}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>Range (EPA Est.)</span>
              </div>
              <div className="text-2xl font-heading font-bold text-white">
                {vehicle.range}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <Gauge className="w-4 h-4 text-sky-400" />
                <span>Top Speed</span>
              </div>
              <div className="text-2xl font-heading font-bold text-white">
                {vehicle.topSpeed}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-mono mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Peak Power</span>
              </div>
              <div className="text-2xl font-heading font-bold text-white">
                {vehicle.horsepower}
              </div>
            </div>
          </div>

          {/* Description & Key Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-300 mb-3">
                Vehicle Overview
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                {vehicle.description}
              </p>

              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400 mb-3">
                Standard Engineering Features
              </h4>
              <ul className="space-y-2">
                {vehicle.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#e82127] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Specifications Matrix */}
            <div>
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-neutral-300 mb-3">
                Technical Specifications
              </h3>
              <div className="glass-panel rounded-2xl divide-y divide-white/5 text-xs font-mono">
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Drivetrain</span>
                  <span className="text-white font-semibold">{vehicle.drivetrain}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Seating Capacity</span>
                  <span className="text-white">{vehicle.seating} Adults</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Cargo Volume</span>
                  <span className="text-white">{vehicle.cargoCapacity}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Curb Weight</span>
                  <span className="text-white">{vehicle.weight}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Supercharging Rate</span>
                  <span className="text-white">{vehicle.superchargingSpeed}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-neutral-400">Inventory Status</span>
                  <span className="text-emerald-400 font-semibold">{vehicle.inStock} Available in Showroom</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financing Calculator */}
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-heading font-bold uppercase tracking-wider text-white">
                Tesla Electric Financing Estimator
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">
                  Down Payment: ${downPayment.toLocaleString()}
                </label>
                <input
                  type="range"
                  min="0"
                  max={vehicle.basePrice * 0.5}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full accent-[#e82127]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">
                  Loan Duration: {loanTerm} Months
                </label>
                <div className="flex gap-2">
                  {[36, 48, 60, 72].map(term => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                        loanTerm === term ? 'bg-[#e82127] text-white font-bold' : 'bg-white/10 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {term}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-xl border border-white/10 text-right">
                <span className="text-[10px] font-mono text-neutral-400 block">Est. Monthly Payment</span>
                <div className="text-2xl font-heading font-extrabold text-emerald-400">
                  ${monthlyPayment.toLocaleString()}<span className="text-xs text-neutral-400 font-normal">/mo</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Based on 4.99% APR with $0 acquisition fee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 bg-[#08080b] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase block">Starting Base Price</span>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              ${vehicle.basePrice.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onChatWithAdmin && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                  onChatWithAdmin(vehicle);
                }}
                className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-[#151520] hover:bg-[#202030] border border-white/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#e82127]" />
                <span>Chat With Admin To Buy</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
                onContactSeller(vehicle.name);
              }}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Contact Showroom</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playElectricAcceleration();
                onClose();
                onConfigure(vehicle);
              }}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_25px_rgba(232,33,39,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize & Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
