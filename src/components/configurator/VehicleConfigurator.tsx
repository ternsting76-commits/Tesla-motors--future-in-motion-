import React, { useState, useEffect } from 'react';
import { Showroom3D } from '../3d/Showroom3D';
import { Vehicle, VehicleColor, WheelOption, InteriorOption, TrimOption } from '../../types';
import { soundEngine } from '../../services/audio';
import {
  Check,
  Zap,
  Gauge,
  BatteryCharging,
  Sliders,
  DollarSign,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface VehicleConfiguratorProps {
  vehicles: Vehicle[];
  initialVehicleId?: string;
  onAddToCart: (configured: {
    vehicle: Vehicle;
    trim: TrimOption;
    color: VehicleColor;
    wheel: WheelOption;
    interior: InteriorOption;
    fsdIncluded: boolean;
    totalPrice: number;
  }) => void;
  onProceedCheckout: (configured: {
    vehicle: Vehicle;
    trim: TrimOption;
    color: VehicleColor;
    wheel: WheelOption;
    interior: InteriorOption;
    fsdIncluded: boolean;
    totalPrice: number;
  }) => void;
}

export const VehicleConfigurator: React.FC<VehicleConfiguratorProps> = ({
  vehicles,
  initialVehicleId,
  onAddToCart,
  onProceedCheckout,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(() => {
    return vehicles.find(v => v.id === initialVehicleId) || vehicles[0];
  });

  const [selectedTrim, setSelectedTrim] = useState<TrimOption>(selectedVehicle.trims[0]);
  const [selectedColor, setSelectedColor] = useState<VehicleColor>(selectedVehicle.colors[0]);
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(selectedVehicle.wheels[0]);
  const [selectedInterior, setSelectedInterior] = useState<InteriorOption>(selectedVehicle.interiors[0]);
  const [fsdIncluded, setFsdIncluded] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'model' | 'trim' | 'paint' | 'wheels' | 'interior' | 'autopilot'>('paint');

  // Update dependent options if vehicle changes
  const handleVehicleChange = (vehicle: Vehicle) => {
    soundEngine.playClick();
    setSelectedVehicle(vehicle);
    setSelectedTrim(vehicle.trims[0]);
    setSelectedColor(vehicle.colors[0]);
    setSelectedWheel(vehicle.wheels[0]);
    setSelectedInterior(vehicle.interiors[0]);
  };

  // Sync if initialVehicleId changes externally
  useEffect(() => {
    if (initialVehicleId) {
      const v = vehicles.find(item => item.id === initialVehicleId);
      if (v && v.id !== selectedVehicle.id) {
        handleVehicleChange(v);
      }
    }
  }, [initialVehicleId]);

  // Price calculations
  const fsdPrice = fsdIncluded ? 8000 : 0;
  const totalPrice =
    selectedTrim.price +
    selectedColor.priceDelta +
    selectedWheel.priceDelta +
    selectedInterior.priceDelta +
    fsdPrice;

  // Monthly financing estimation (72 months at 4.99% APR, 10% down)
  const principal = totalPrice * 0.9;
  const monthlyRate = 0.0499 / 12;
  const numPayments = 72;
  const estimatedMonthly = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );

  const handleConfigDone = (action: 'cart' | 'checkout') => {
    soundEngine.playElectricAcceleration();
    const configData = {
      vehicle: selectedVehicle,
      trim: selectedTrim,
      color: selectedColor,
      wheel: selectedWheel,
      interior: selectedInterior,
      fsdIncluded,
      totalPrice,
    };
    if (action === 'cart') {
      onAddToCart(configData);
    } else {
      onProceedCheckout(configData);
    }
  };

  return (
    <section id="configurator" className="py-24 bg-[#07070a] text-white relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e82127] uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive 3D Studio Customizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold uppercase tracking-tight">
            Design Your Tesla
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2">
            Customize model trims, paint finishes, aerodynamic wheels, and full self-driving capability with real-time 3D feedback.
          </p>
        </div>

        {/* Model Selection Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 justify-start sm:justify-center mb-8">
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => handleVehicleChange(v)}
              className={`px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedVehicle.id === v.id
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'bg-[#121216] text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Main Configurator Layout (3D Left, Customization Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Visualizer Canvas (lg:col-span-7) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
            <Showroom3D
              modelType={selectedVehicle.modelType}
              currentColorHex={selectedColor.hex}
              height="h-[480px] sm:h-[580px]"
              showAllControls={false}
              interactiveControls={true}
            />

            {/* Live Specs Floating Badge */}
            <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl px-4 py-2 text-xs font-mono flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Zap className="w-3.5 h-3.5 text-[#e82127]" />
                <span>{selectedTrim.acceleration060} 0-60</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedTrim.range}</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
                <span>{selectedTrim.topSpeed}</span>
              </div>
            </div>
          </div>

          {/* Customization Options Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            {/* Step Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              {(['trim', 'paint', 'wheels', 'interior', 'autopilot'] as const).map(step => (
                <button
                  key={step}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveStep(step);
                  }}
                  className={`text-xs font-mono uppercase tracking-wider transition-colors pb-1 border-b-2 ${
                    activeStep === step
                      ? 'border-[#e82127] text-white font-bold'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: TRIM */}
            {activeStep === 'trim' && (
              <div className="space-y-3">
                <h3 className="text-sm font-heading uppercase text-neutral-400 font-semibold">
                  Select Powertrain Trim
                </h3>
                {selectedVehicle.trims.map(trim => (
                  <button
                    key={trim.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTrim(trim);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedTrim.id === trim.id
                        ? 'bg-[#181820] border-[#e82127] shadow-[0_0_20px_rgba(232,33,39,0.2)]'
                        : 'bg-[#101014] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-heading font-bold text-white text-base">
                        {trim.name}
                      </span>
                      <span className="font-mono text-sm text-white font-semibold">
                        ${trim.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3">{trim.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-300">
                      <span>0-60: {trim.acceleration060}</span>
                      <span>&bull;</span>
                      <span>Range: {trim.range}</span>
                      <span>&bull;</span>
                      <span>Top: {trim.topSpeed}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT: PAINT */}
            {activeStep === 'paint' && (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-heading uppercase text-neutral-400 font-semibold">
                    Exterior Paint Finish
                  </h3>
                  <span className="text-xs font-mono text-white">
                    {selectedColor.name} {selectedColor.priceDelta > 0 ? `(+$${selectedColor.priceDelta.toLocaleString()})` : '(Included)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedVehicle.colors.map(col => (
                    <button
                      key={col.id}
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedColor(col);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                        selectedColor.id === col.id
                          ? 'bg-[#181820] border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-[#101014] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-full border border-white/30 flex-shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-medium text-white truncate">{col.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">
                          {col.priceDelta > 0 ? `+$${col.priceDelta}` : 'Included'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: WHEELS */}
            {activeStep === 'wheels' && (
              <div className="space-y-3">
                <h3 className="text-sm font-heading uppercase text-neutral-400 font-semibold">
                  Wheel Design & Aerodynamics
                </h3>
                {selectedVehicle.wheels.map(wh => (
                  <button
                    key={wh.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedWheel(wh);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedWheel.id === wh.id
                        ? 'bg-[#181820] border-[#e82127] shadow-[0_0_20px_rgba(232,33,39,0.2)]'
                        : 'bg-[#101014] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-heading font-bold text-white text-sm">
                        {wh.name}
                      </span>
                      <span className="font-mono text-xs text-white">
                        {wh.priceDelta > 0 ? `+$${wh.priceDelta.toLocaleString()}` : wh.priceDelta < 0 ? `-$${Math.abs(wh.priceDelta).toLocaleString()}` : 'Included'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{wh.description}</p>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT: INTERIOR */}
            {activeStep === 'interior' && (
              <div className="space-y-3">
                <h3 className="text-sm font-heading uppercase text-neutral-400 font-semibold">
                  Cabin Interior & Upholstery
                </h3>
                {selectedVehicle.interiors.map(int => (
                  <button
                    key={int.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedInterior(int);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 ${
                      selectedInterior.id === int.id
                        ? 'bg-[#181820] border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'bg-[#101014] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: int.colorHex }}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: int.accentHex }} />
                      </div>
                      <div>
                        <div className="text-sm font-heading font-bold text-white">{int.name}</div>
                        <div className="text-xs text-neutral-400">{int.description}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-white flex-shrink-0">
                      {int.priceDelta > 0 ? `+$${int.priceDelta.toLocaleString()}` : 'Included'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* TAB CONTENT: AUTOPILOT / FSD */}
            {activeStep === 'autopilot' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#101016] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#e82127]" />
                      <span className="font-heading font-bold text-sm text-white uppercase">
                        Full Self-Driving (Supervised)
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-white">+$8,000</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                    Your car will be able to drive itself almost anywhere with minimal driver intervention, including automatic lane changes, highway exits, traffic light recognition and Smart Summon.
                  </p>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setFsdIncluded(!fsdIncluded);
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all ${
                      fsdIncluded
                        ? 'bg-[#e82127] text-white shadow-[0_0_15px_rgba(232,33,39,0.4)]'
                        : 'bg-white/10 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {fsdIncluded ? 'Full Self-Driving Added ✓' : 'Add Full Self-Driving ($8,000)'}
                  </button>
                </div>
              </div>
            )}

            {/* Price Summary & Purchase Actions */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block">Total Vehicle Price</span>
                  <div className="text-3xl font-heading font-extrabold text-white">
                    ${totalPrice.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 block">Est. Financing</span>
                  <div className="text-sm font-mono text-neutral-300">
                    ${estimatedMonthly.toLocaleString()}<span className="text-xs text-neutral-500">/mo</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleConfigDone('cart')}
                  className="w-full py-3.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-neutral-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={() => handleConfigDone('checkout')}
                  className="w-full py-3.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_25px_rgba(232,33,39,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
