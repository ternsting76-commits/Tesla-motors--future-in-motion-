import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CartItem, Order, OrderCustomerInfo } from '../../types';
import { StorageService } from '../../services/storage';
import { soundEngine } from '../../services/audio';
import {
  X,
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle,
  Truck,
  Building2,
  DollarSign,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Download
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess,
}) => {
  const activeUser = StorageService.getActiveUser();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [deliveryMethod, setDeliveryMethod] = useState<'Tesla Delivery Center Pickup' | 'Home Delivery'>('Tesla Delivery Center Pickup');

  // Customer Details Form State
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: activeUser?.name || 'Alexander Vance',
    email: activeUser?.email || 'customer@tesla-motion.com',
    phone: activeUser?.phone || '+1 320-738-1283',
    address: '100 Tesla Road',
    city: 'Austin',
    state: 'TX',
    zipCode: '78725',
    country: 'United States',
    deliveryMethod: 'Tesla Delivery Center Pickup',
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'Tesla Financing' | 'Cryptocurrency'>('Credit / Debit Card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardZip, setCardZip] = useState('78725');
  const [payFullOrDeposit, setPayFullOrDeposit] = useState<'deposit' | 'full'>('deposit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;
  const depositAmount = cart.length * 5000;
  const chargedToday = payFullOrDeposit === 'deposit' ? depositAmount : total;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playClick();
    setFormData(prev => ({ ...prev, deliveryMethod }));
    setStep('payment');
  };

  const fillTestCard = () => {
    soundEngine.playClick();
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('08/29');
    setCardCvc('321');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    soundEngine.playElectricAcceleration();

    setTimeout(() => {
      setIsProcessing(false);

      // Generate random unique Order & VIN
      const orderId = `TSLA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const randomVin = `5YJSA1E2${Math.floor(10 + Math.random() * 89)}HF${Math.floor(10000 + Math.random() * 90000)}`;

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: formData,
        items: [...cart],
        subtotal,
        tax,
        total,
        depositAmount: chargedToday,
        paymentMethod,
        paymentStatus: payFullOrDeposit === 'deposit' ? 'Deposit Paid' : 'Paid',
        status: 'Deposit Confirmed',
        estimatedDelivery: '2-4 Weeks',
        vin: randomVin,
      };

      StorageService.addOrder(newOrder);
      StorageService.clearCart();
      setCompletedOrder(newOrder);
      setStep('success');

      soundEngine.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti catch
      }

      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0c0c11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#e82127]/20 border border-[#e82127]/40 flex items-center justify-center text-[#e82127]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                Tesla Secure Checkout
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                256-Bit SSL Encrypted &bull; Official Vehicle Reservation
              </span>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress */}
        {step !== 'success' && (
          <div className="px-6 py-3 bg-[#111116] border-b border-white/5 flex items-center justify-center gap-8 text-xs font-mono">
            <span className={step === 'details' ? 'text-white font-bold flex items-center gap-1.5' : 'text-neutral-500'}>
              1. Delivery & Customer Info
            </span>
            <span className="text-neutral-600">&rarr;</span>
            <span className={step === 'payment' ? 'text-white font-bold flex items-center gap-1.5' : 'text-neutral-500'}>
              2. Secure Payment & Order
            </span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: DELIVERY & CUSTOMER DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400">
                  Select Delivery Option
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Tesla Delivery Center Pickup')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === 'Tesla Delivery Center Pickup'
                        ? 'bg-[#181822] border-[#e82127] shadow-[0_0_15px_rgba(232,33,39,0.2)]'
                        : 'bg-[#101014] border-white/5 text-neutral-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#e82127] mt-0.5" />
                    <div>
                      <div className="text-sm font-heading font-bold text-white">Tesla Delivery Center</div>
                      <div className="text-xs text-neutral-400">Complimentary priority vehicle orientation and handover</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('Home Delivery')}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      deliveryMethod === 'Home Delivery'
                        ? 'bg-[#181822] border-[#e82127] shadow-[0_0_15px_rgba(232,33,39,0.2)]'
                        : 'bg-[#101014] border-white/5 text-neutral-400'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-sky-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-heading font-bold text-white">Direct Home Delivery</div>
                      <div className="text-xs text-neutral-400">Enclosed transport delivered directly to your driveway</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400">
                  Customer Contact & Registration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={e => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Preview Box */}
              <div className="glass-panel p-4 rounded-2xl flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block">Total Due at Handover:</span>
                  <span className="text-base font-bold text-white font-heading">${total.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-neutral-400 block">Required Deposit Today:</span>
                  <span className="text-base font-bold text-[#e82127] font-heading">${depositAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_20px_rgba(232,33,39,0.35)] transition-all flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD & SUBMISSION */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Type Selection */}
              <div className="space-y-3">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-400">
                  Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'Credit / Debit Card', label: 'Credit Card (Stripe)', icon: CreditCard },
                    { id: 'Tesla Financing', label: 'Tesla Financing', icon: DollarSign },
                    { id: 'Cryptocurrency', label: 'Bitcoin / Crypto', icon: QrCode },
                  ].map(method => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playClick();
                          setPaymentMethod(method.id as any);
                        }}
                        className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === method.id
                            ? 'bg-[#181822] border-[#e82127] shadow-[0_0_15px_rgba(232,33,39,0.2)]'
                            : 'bg-[#101014] border-white/5 text-neutral-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-neutral-300" />
                        <span className="text-[11px] font-mono font-medium text-white">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deposit vs Full Payment Toggle */}
              <div className="glass-panel p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-300">Payment Option:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPayFullOrDeposit('deposit')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        payFullOrDeposit === 'deposit'
                          ? 'bg-[#e82127] text-white font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Deposit Only (${depositAmount.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayFullOrDeposit('full')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                        payFullOrDeposit === 'full'
                          ? 'bg-[#e82127] text-white font-bold'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      Pay Full Amount (${total.toLocaleString()})
                    </button>
                  </div>
                </div>
              </div>

              {/* Stripe Credit Card Form Simulator */}
              {paymentMethod === 'Credit / Debit Card' && (
                <div className="space-y-4 p-5 rounded-2xl bg-[#101016] border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" /> Stripe Secure Elements
                    </span>
                    <button
                      type="button"
                      onClick={fillTestCard}
                      className="text-[10px] font-mono text-[#e82127] hover:underline"
                    >
                      Auto-Fill Test Card
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-[#16161c] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[#16161c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">CVC</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full bg-[#16161c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={cardZip}
                        onChange={e => setCardZip(e.target.value)}
                        className="w-full bg-[#16161c] border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Tesla Financing' && (
                <div className="p-5 rounded-2xl bg-[#101016] border border-white/10 text-xs text-neutral-300 space-y-2">
                  <p className="font-semibold text-white">Tesla Financial Services Pre-Qualification</p>
                  <p>Your deposit of ${depositAmount.toLocaleString()} locks in your 4.99% promotional APR rate for 72 months. A credit specialist will contact you within 24 hours to finalize paperwork.</p>
                </div>
              )}

              {paymentMethod === 'Cryptocurrency' && (
                <div className="p-5 rounded-2xl bg-[#101016] border border-white/10 text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-28 h-28 text-black" />
                  </div>
                  <p className="text-xs font-mono text-neutral-300">
                    Scan Lightning Invoice or send BTC to escrow address
                  </p>
                  <p className="text-[10px] font-mono text-neutral-500 break-all">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-8 py-3.5 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] disabled:opacity-50 shadow-[0_0_25px_rgba(232,33,39,0.4)] transition-all flex items-center gap-2"
                >
                  {isProcessing ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <>
                      <span>Pay ${chargedToday.toLocaleString()} & Confirm</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT */}
          {step === 'success' && completedOrder && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                  Payment Authorized & Order Confirmed
                </span>
                <h3 className="text-3xl font-heading font-extrabold uppercase text-white">
                  Welcome to the Future of Motion
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mt-2">
                  Your reservation is registered in our manufacturing queue. A confirmation email and production timeline have been dispatched to {completedOrder.customer.email}.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="glass-panel p-6 rounded-2xl text-left font-mono text-xs max-w-lg mx-auto border border-white/10 space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Order ID</span>
                  <span className="text-white font-bold">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">VIN Allocation</span>
                  <span className="text-white">{completedOrder.vin}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Vehicles Ordered</span>
                  <span className="text-white">{completedOrder.items.map(i => i.vehicleName).join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Delivery Method</span>
                  <span className="text-white">{completedOrder.customer.deliveryMethod}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400">Deposit Charged Today</span>
                  <span className="text-emerald-400 font-bold">${completedOrder.depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-neutral-400">Remaining Balance at Handover</span>
                  <span className="text-white font-bold">${(completedOrder.total - completedOrder.depositAmount).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    window.print();
                  }}
                  className="px-5 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="px-8 py-3 rounded-xl text-xs sm:text-sm font-heading font-bold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_20px_rgba(232,33,39,0.4)] transition-all"
                >
                  Return to Showroom
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
