import React from 'react';
import { CartItem } from '../../types';
import { soundEngine } from '../../services/audio';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const estTax = Math.round(subtotal * 0.08); // 8% sales tax
  const total = subtotal + estTax;
  // Reservation deposit is either $5,000 flat per vehicle or full amount
  const depositRequired = cart.length * 5000;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0e] border-l border-white/10 flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#e82127]/20 text-[#e82127]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                  Your Tesla Cart
                </h3>
                <span className="text-xs font-mono text-neutral-400">
                  {cart.length} {cart.length === 1 ? 'vehicle configuration' : 'vehicle configurations'}
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mb-3 stroke-[1.5]" />
                <p className="font-heading font-semibold text-white text-base mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-neutral-500 mb-6">
                  Explore our model lineup and configure your custom electric vehicle.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#e82127] text-white text-xs font-heading font-bold uppercase tracking-wider"
                >
                  Explore Models
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#121217] border border-white/5 flex flex-col gap-3"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.vehicleImage}
                      alt={item.vehicleName}
                      className="w-20 h-16 object-cover rounded-xl border border-white/10 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-sm text-white truncate">
                        {item.vehicleName}
                      </h4>
                      <p className="text-[11px] font-mono text-[#e82127]">
                        {item.trim.name}
                      </p>
                      <p className="text-xs font-mono font-semibold text-white mt-1">
                        ${item.unitPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Config details chips */}
                  <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-neutral-400 bg-black/40 p-2 rounded-xl">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/30 flex-shrink-0"
                        style={{ backgroundColor: item.color.hex }}
                      />
                      <span className="truncate">{item.color.name}</span>
                    </div>
                    <div className="truncate text-right">
                      {item.wheel.name}
                    </div>
                    <div className="truncate">
                      Interior: {item.interior.name}
                    </div>
                    <div className="truncate text-right text-emerald-400">
                      {item.fsdIncluded ? 'FSD Included ✓' : 'Basic Autopilot'}
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onUpdateQuantity(item.id, item.quantity - 1);
                        }}
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onUpdateQuantity(item.id, item.quantity + 1);
                        }}
                        className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-neutral-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        onRemoveItem(item.id);
                      }}
                      className="text-xs text-neutral-500 hover:text-[#e82127] flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#08080c] border-t border-white/10 space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>Vehicles Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Estimated Tax & Destination Fee</span>
                  <span className="text-white">${estTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10 text-sm font-heading">
                  <span>Total Due at Delivery</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#e82127] font-semibold pt-1">
                  <span>Reservation Deposit Due Today</span>
                  <span>${depositRequired.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-neutral-400 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fully refundable deposit. Price protected upon submission.</span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playElectricAcceleration();
                  onCheckout();
                }}
                className="w-full py-4 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_25px_rgba(232,33,39,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
