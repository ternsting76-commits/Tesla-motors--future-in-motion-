import React, { useState } from 'react';
import { Vehicle, VehicleCategory } from '../../types';
import { soundEngine } from '../../services/audio';
import {
  Zap,
  Gauge,
  BatteryCharging,
  Eye,
  ShoppingBag,
  Sliders,
  Heart,
  Search,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface VehicleMarketplaceProps {
  vehicles: Vehicle[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onConfigureVehicle: (vehicle: Vehicle) => void;
  onInstantBuy: (vehicle: Vehicle) => void;
}

export const VehicleMarketplace: React.FC<VehicleMarketplaceProps> = ({
  vehicles,
  favorites,
  onToggleFavorite,
  onSelectVehicle,
  onConfigureVehicle,
  onInstantBuy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'speed' | 'range'>('recommended');
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, string>>({});

  const categories: VehicleCategory[] = ['All', 'Hypercar', 'Sedan', 'SUV', 'Cyber'];

  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchesCategory = selectedCategory === 'All' || vehicle.category === selectedCategory;
      const matchesSearch =
        vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.drivetrain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'range') return parseInt(b.range) - parseInt(a.range);
      if (sortBy === 'speed') return parseFloat(a.acceleration060) - parseFloat(b.acceleration060);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  const handleColorPick = (vehicleId: string, hex: string) => {
    soundEngine.playClick();
    setSelectedColorMap(prev => ({ ...prev, [vehicleId]: hex }));
  };

  return (
    <section id="explore" className="py-24 bg-[#08080a] relative border-t border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#e82127]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e82127] uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Electric Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase text-white tracking-tight">
              Explore Tesla Vehicles
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base mt-2 max-w-xl">
              Engineered for maximum safety, instantaneous torque and industry-leading range.
              Every model crafted for sustainable high performance.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, specs..."
              className="w-full bg-[#121217] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127] transition-colors"
            />
          </div>
        </div>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#e82127] text-white shadow-[0_0_20px_rgba(232,33,39,0.4)]'
                    : 'bg-[#14141a] text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#14141a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
            >
              <option value="recommended">Recommended</option>
              <option value="speed">Quickest 0-60</option>
              <option value="range">Highest Range</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVehicles.map((vehicle) => {
            const isFav = favorites.includes(vehicle.id);
            const activeColor = selectedColorMap[vehicle.id] || vehicle.colors[0]?.hex;

            return (
              <div
                key={vehicle.id}
                className="group relative bg-[#111116] border border-white/10 hover:border-[#e82127]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(232,33,39,0.18)] hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Top Badge & Heart Favorite */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                  <img
                    src={vehicle.images.hero}
                    alt={vehicle.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-black/60" />

                  {/* Top Bar inside Image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                      {vehicle.category}
                    </span>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onToggleFavorite(vehicle.id);
                      }}
                      title={isFav ? 'Remove from saved' : 'Save vehicle'}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFav
                          ? 'bg-[#e82127] text-white shadow-[0_0_12px_rgba(232,33,39,0.5)]'
                          : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-white uppercase tracking-tight">
                        {vehicle.name}
                      </h3>
                      <p className="text-xs text-neutral-300 font-mono">
                        {vehicle.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body & Specs */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  {/* Pricing row */}
                  <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-white/5">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block">Starting at</span>
                      <span className="text-2xl font-heading font-extrabold text-white">
                        ${vehicle.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block">Est. Lease</span>
                      <span className="text-xs font-mono text-neutral-300">
                        ${Math.round(vehicle.basePrice * 0.0125).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Key Telemetry Badges */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 mb-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400 mb-0.5">
                        <Zap className="w-3 h-3 text-[#e82127]" />
                        <span>0-60</span>
                      </div>
                      <div className="text-sm font-heading font-bold text-white">
                        {vehicle.acceleration060}
                      </div>
                    </div>

                    <div className="border-x border-white/10 px-1">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400 mb-0.5">
                        <BatteryCharging className="w-3 h-3 text-emerald-400" />
                        <span>Range</span>
                      </div>
                      <div className="text-sm font-heading font-bold text-white">
                        {vehicle.range}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-neutral-400 mb-0.5">
                        <Gauge className="w-3 h-3 text-sky-400" />
                        <span>Top Speed</span>
                      </div>
                      <div className="text-sm font-heading font-bold text-white">
                        {vehicle.topSpeed}
                      </div>
                    </div>
                  </div>

                  {/* Available Colors preview */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-mono text-neutral-400">Available Finishes:</span>
                    <div className="flex items-center gap-1.5">
                      {vehicle.colors.map(col => (
                        <button
                          key={col.id}
                          onClick={() => handleColorPick(vehicle.id, col.hex)}
                          title={col.name}
                          style={{ backgroundColor: col.hex }}
                          className={`w-4 h-4 rounded-full border transition-all ${
                            activeColor === col.hex
                              ? 'border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                              : 'border-white/20 hover:scale-110'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description preview */}
                  <p className="text-xs text-neutral-400 line-clamp-2 mb-5">
                    {vehicle.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onSelectVehicle(vehicle);
                      }}
                      className="px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.playElectricAcceleration();
                        onConfigureVehicle(vehicle);
                      }}
                      className="px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] transition-colors flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(232,33,39,0.3)]"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
