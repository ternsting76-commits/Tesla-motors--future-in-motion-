import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { soundEngine } from '../../services/audio';
import { X, Scale, Check, Zap, BatteryCharging, Gauge, Sliders } from 'lucide-react';

interface VehicleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onConfigureVehicle: (v: Vehicle) => void;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onConfigureVehicle,
}) => {
  // Selected vehicle IDs for comparison (up to 3)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    vehicles[0]?.id || 'roadster-2026',
    vehicles[1]?.id || 'cybertruck-2026',
    vehicles[2]?.id || 'models-plaid',
  ]);

  if (!isOpen) return null;

  const handleSelectSlot = (index: number, vehicleId: string) => {
    soundEngine.playClick();
    const copy = [...selectedIds];
    copy[index] = vehicleId;
    setSelectedIds(copy);
  };

  const comparedVehicles = selectedIds.map(id => vehicles.find(v => v.id === id) || vehicles[0]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0c0c11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e82127]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                Tesla Specification Comparison
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                Compare engineering telemetry and performance specs side-by-side
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-6 sm:p-8 overflow-x-auto max-h-[75vh]">
          {/* Header row with vehicle selectors */}
          <div className="grid grid-cols-4 gap-4 pb-6 border-b border-white/10 min-w-[650px]">
            <div className="text-xs font-mono text-neutral-400 flex items-end">
              Select Vehicle Models:
            </div>
            {comparedVehicles.map((v, idx) => (
              <div key={idx} className="space-y-3">
                <select
                  value={v.id}
                  onChange={(e) => handleSelectSlot(idx, e.target.value)}
                  className="w-full bg-[#14141c] border border-white/20 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                >
                  {vehicles.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <img src={v.images.hero} alt={v.name} className="w-full aspect-[16/10] object-cover rounded-xl border border-white/10" />
                <div>
                  <h4 className="font-heading font-bold text-sm text-white uppercase">{v.name}</h4>
                  <p className="text-sm font-heading font-extrabold text-[#e82127]">${v.basePrice.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Matrix Rows */}
          <div className="divide-y divide-white/5 text-xs font-mono min-w-[650px]">
            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#e82127]" /> 0-60 MPH
              </span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-white font-bold">{v.acceleration060}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" /> EPA Est. Range
              </span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-emerald-400 font-bold">{v.range}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400" /> Top Speed
              </span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-white">{v.topSpeed}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400">Peak Horsepower</span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-white">{v.horsepower}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400">Drivetrain</span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-neutral-300">{v.drivetrain}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400">Seating</span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-white">{v.seating} Adults</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400">Cargo Capacity</span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-neutral-300">{v.cargoCapacity}</span>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-4 py-3 items-center">
              <span className="text-neutral-400">Supercharging Rate</span>
              {comparedVehicles.map((v, i) => (
                <span key={i} className="text-neutral-300 text-[11px]">{v.superchargingSpeed}</span>
              ))}
            </div>

            {/* Configure Action Row */}
            <div className="grid grid-cols-4 gap-4 pt-6">
              <div />
              {comparedVehicles.map((v, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundEngine.playElectricAcceleration();
                    onClose();
                    onConfigureVehicle(v);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Configure
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
