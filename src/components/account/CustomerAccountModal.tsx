import React, { useState, useEffect } from 'react';
import { UserAccount, Order, Vehicle } from '../../types';
import { StorageService } from '../../services/storage';
import { soundEngine } from '../../services/audio';
import {
  X,
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onSelectVehicle: (v: Vehicle) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onSelectVehicle,
}) => {
  // All hooks declared unconditionally at top level (React 19 fiber safety)
  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => StorageService.getActiveUser());
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'profile'>('orders');

  // Email Login/Register form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('+1 320-738-1283');
  const [loginAddress, setLoginAddress] = useState('100 Tesla Road');
  const [loginCity, setLoginCity] = useState('Austin');
  const [loginState, setLoginState] = useState('TX');
  const [loginZip, setLoginZip] = useState('78725');
  const [isRegistering, setIsRegistering] = useState(false);

  // Google sign in prompt state
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('wj3201113@gmail.com');
  const [googleName, setGoogleName] = useState('Tesla VIP Client');

  // Profile edit state
  const [profileName, setProfileName] = useState(() => StorageService.getActiveUser()?.name || '');
  const [profilePhone, setProfilePhone] = useState(() => StorageService.getActiveUser()?.phone || '+1 320-738-1283');
  const [profileAddress, setProfileAddress] = useState(() => StorageService.getActiveUser()?.address || '742 Evergreen Terrace');
  const [profileCity, setProfileCity] = useState(() => StorageService.getActiveUser()?.city || 'Austin');
  const [profileState, setProfileState] = useState(() => StorageService.getActiveUser()?.state || 'TX');
  const [profileZip, setProfileZip] = useState(() => StorageService.getActiveUser()?.zipCode || '78725');
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false);

  // Refresh local state when user updates in storage
  useEffect(() => {
    const handleUserUpdate = () => {
      const u = StorageService.getActiveUser();
      setActiveUser(u);
      if (u) {
        setProfileName(u.name);
        setProfilePhone(u.phone || '+1 320-738-1283');
        setProfileAddress(u.address || '');
        setProfileCity(u.city || '');
        setProfileState(u.state || '');
        setProfileZip(u.zipCode || '');
      }
    };
    window.addEventListener('tesla_user_updated', handleUserUpdate);
    return () => window.removeEventListener('tesla_user_updated', handleUserUpdate);
  }, []);

  if (!isOpen) return null;

  const orders = StorageService.getOrders();
  const userOrders = activeUser
    ? orders.filter(o => o.customer.email.toLowerCase() === activeUser.email.toLowerCase() || activeUser.orders.includes(o.id))
    : [];

  const favoriteVehicles = vehicles.filter(v => activeUser?.savedFavorites?.includes(v.id));

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playElectricAcceleration();
    if (isRegistering) {
      const user = StorageService.registerUser(
        loginName || 'Tesla Driver',
        loginEmail,
        loginPhone,
        `${loginAddress}, ${loginCity}, ${loginState} ${loginZip}`
      );
      setActiveUser(user);
    } else {
      const user = StorageService.loginUser(loginEmail);
      setActiveUser(user);
    }
  };

  const handleGoogleAuth = () => {
    soundEngine.playSuccess();
    const user = StorageService.loginWithGoogle(googleEmail.trim() || 'wj3201113@gmail.com', googleName.trim() || 'Tesla VIP Client');
    setActiveUser(user);
    setShowGooglePrompt(false);
  };

  const handleLogout = () => {
    soundEngine.playClick();
    StorageService.setActiveUser(null);
    setActiveUser(null);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    soundEngine.playClick();
    const updated: UserAccount = {
      ...activeUser,
      name: profileName,
      phone: profilePhone,
      address: profileAddress,
      city: profileCity,
      state: profileState,
      zipCode: profileZip,
    };
    StorageService.updateUser(updated);
    setActiveUser(updated);

    // Update conversation destination address if a chat exists
    const conv = StorageService.getOrCreateConversationForUser(updated);
    if (conv && profileAddress) {
      StorageService.updateDestinationAddress(conv.id, `${profileAddress}, ${profileCity} ${profileState} ${profileZip}`);
    }

    setSavedSuccessMsg(true);
    setTimeout(() => setSavedSuccessMsg(false), 3000);
  };

  const orderStatusSteps = ['Deposit Confirmed', 'VIN Assigned', 'In Production', 'Transit', 'Ready for Delivery'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#0c0c11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white overflow-hidden">
              {activeUser?.avatar ? (
                <img src={activeUser.avatar} alt={activeUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#e82127]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                  {activeUser ? activeUser.name : 'Tesla Customer Portal'}
                </h3>
                {activeUser?.authProvider === 'google' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono flex items-center gap-1 border border-blue-500/30">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    Google Account
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {activeUser ? activeUser.email : 'Sign in to access your garage, orders & destination delivery'}
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

        {/* NOT LOGGED IN: LOGIN / REGISTER / GOOGLE AUTH */}
        {!activeUser ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto space-y-6">
            <div className="text-center">
              <h4 className="text-2xl font-heading font-bold text-white uppercase mb-2">
                {isRegistering ? 'Create Customer Account' : 'Welcome to Tesla'}
              </h4>
              <p className="text-xs text-neutral-400">
                {isRegistering
                  ? 'Create your customer profile to configure vehicles, chat with sales admin, and receive home delivery.'
                  : 'Access your reservation orders, saved models, and direct dealership chat.'}
              </p>
            </div>

            {/* GOOGLE ONE-CLICK SIGN IN BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setShowGooglePrompt(true);
                }}
                className="w-full py-3 px-4 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-neutral-900 bg-white hover:bg-neutral-100 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {/* Official Google multicolored G logo */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0c0c11] px-3 text-[10px] font-mono text-neutral-500 uppercase">
                  or sign in with email
                </span>
                <div className="border-t border-white/10 w-full" />
              </div>
            </div>

            {/* Google Quick Confirmation Modal/Dropdown if clicked */}
            {showGooglePrompt && (
              <div className="p-4 rounded-2xl bg-[#14141d] border border-blue-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.35 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span className="text-xs font-mono font-bold text-white uppercase">Google Account Link</span>
                  </div>
                  <button onClick={() => setShowGooglePrompt(false)} className="text-neutral-400 hover:text-white text-xs">
                    ✕
                  </button>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Google Email</label>
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={e => setGoogleEmail(e.target.value)}
                    placeholder="wj3201113@gmail.com"
                    className="w-full bg-[#1b1b24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 block mb-1">Display Name</label>
                  <input
                    type="text"
                    value={googleName}
                    onChange={e => setGoogleName(e.target.value)}
                    placeholder="Tesla VIP Client"
                    className="w-full bg-[#1b1b24] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider"
                >
                  Confirm Sign In With Google
                </button>
              </div>
            )}

            {/* Standard Email Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {isRegistering && (
                <>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={loginName}
                      onChange={e => setLoginName(e.target.value)}
                      placeholder="e.g. Elon Vance"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      value={loginPhone}
                      onChange={e => setLoginPhone(e.target.value)}
                      placeholder="+1 320-738-1283"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Delivery Destination Street</label>
                    <input
                      type="text"
                      required
                      value={loginAddress}
                      onChange={e => setLoginAddress(e.target.value)}
                      placeholder="e.g. 100 Tesla Road"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">City</label>
                      <input
                        type="text"
                        value={loginCity}
                        onChange={e => setLoginCity(e.target.value)}
                        placeholder="Austin"
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">State</label>
                      <input
                        type="text"
                        value={loginState}
                        onChange={e => setLoginState(e.target.value)}
                        placeholder="TX"
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">Zip</label>
                      <input
                        type="text"
                        value={loginZip}
                        onChange={e => setLoginZip(e.target.value)}
                        placeholder="78725"
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_20px_rgba(232,33,39,0.35)] transition-all cursor-pointer"
              >
                {isRegistering ? 'Complete Registration & Open Account' : 'Sign In With Email'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register new account"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* LOGGED IN ACCOUNT CONTENT */
          <div>
            {/* Nav Tabs */}
            <div className="flex border-b border-white/10 px-6 bg-[#0e0e14]">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('orders');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders & Deliveries ({userOrders.length})</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('favorites');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'favorites'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Saved Garage ({favoriteVehicles.length})</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('profile');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Destination & Profile</span>
              </button>

              <button
                onClick={handleLogout}
                className="ml-auto py-3.5 px-3 text-xs font-mono text-neutral-500 hover:text-[#e82127] flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* TAB: ORDERS */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {userOrders.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                      <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="font-heading font-semibold text-white">No Active Orders Yet</p>
                      <p className="text-xs text-neutral-500 mt-1">Configure your vehicle or purchase directly from the Admin Sales Chat.</p>
                    </div>
                  ) : (
                    userOrders.map(order => {
                      const currentStepIndex = orderStatusSteps.indexOf(order.status);

                      return (
                        <div key={order.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/10 pb-4">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-[#e82127] block">Official Reservation</span>
                              <h4 className="font-heading font-bold text-lg text-white">Order #{order.id}</h4>
                              <p className="text-xs text-neutral-400 font-mono">VIN: {order.vin || 'Pending allocation'}</p>
                              <p className="text-xs text-neutral-400 font-mono flex items-center gap-1 mt-1">
                                <MapPin className="w-3.5 h-3.5 text-[#e82127]" />
                                <span>Destination: {order.customer.address}, {order.customer.city} {order.customer.state}</span>
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-xs font-mono text-emerald-400 block font-semibold">{order.paymentStatus}</span>
                              <span className="text-sm font-heading font-bold text-white">${order.total.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Order Status Progress Bar */}
                          <div className="space-y-2">
                            <span className="text-xs font-mono text-neutral-400 block">Manufacturing & Enclosed Transport Status:</span>
                            <div className="grid grid-cols-5 gap-1">
                              {orderStatusSteps.map((s, idx) => {
                                const isPassed = currentStepIndex >= idx;
                                const isCurrent = currentStepIndex === idx;

                                return (
                                  <div key={s} className="space-y-1">
                                    <div
                                      className={`h-1.5 rounded-full transition-all ${
                                        isPassed ? 'bg-[#e82127]' : 'bg-white/10'
                                      }`}
                                    />
                                    <span className={`text-[9px] font-mono block truncate ${
                                      isCurrent ? 'text-white font-bold' : isPassed ? 'text-neutral-400' : 'text-neutral-600'
                                    }`}>
                                      {s}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Ordered Items Summary */}
                          <div className="space-y-3 pt-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs font-mono bg-black/40 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <img src={item.vehicleImage} alt={item.vehicleName} className="w-12 h-10 object-cover rounded-lg border border-white/10" />
                                  <div>
                                    <div className="font-bold text-white">{item.vehicleName}</div>
                                    <div className="text-neutral-400 text-[10px]">{item.color.name} &bull; {item.wheel.name}</div>
                                  </div>
                                </div>
                                <div className="text-right text-white font-semibold">
                                  ${item.unitPrice.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB: FAVORITES */}
              {activeTab === 'favorites' && (
                <div className="space-y-4">
                  {favoriteVehicles.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                      <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                      <p className="font-heading font-semibold text-white">No Saved Vehicles</p>
                      <p className="text-xs text-neutral-500 mt-1">Tap the heart icon on any vehicle card in the showroom to save it here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {favoriteVehicles.map(v => (
                        <div key={v.id} className="glass-panel p-4 rounded-2xl flex flex-col justify-between border border-white/10">
                          <img src={v.images.hero} alt={v.name} className="w-full aspect-[16/10] object-cover rounded-xl mb-3" />
                          <div>
                            <h4 className="font-heading font-bold text-white text-base">{v.name}</h4>
                            <p className="text-xs font-mono text-[#e82127] mb-2">{v.tagline}</p>
                            <p className="text-sm font-heading font-extrabold text-white mb-4">
                              ${v.basePrice.toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              onClose();
                              onSelectVehicle(v);
                            }}
                            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <span>View Vehicle</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: PROFILE & DESTINATION SETTINGS */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="max-w-xl space-y-5">
                  {savedSuccessMsg && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Profile & destination address saved and synchronized with dealership dispatch!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={e => setProfileName(e.target.value)}
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Primary Email</label>
                      <input
                        type="email"
                        disabled
                        value={activeUser.email}
                        className="w-full bg-[#181820] border border-white/5 rounded-xl px-4 py-2.5 text-xs text-neutral-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Direct Contact Phone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      placeholder="+1 320-738-1283"
                      className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                    />
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#e82127]" />
                      <h5 className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Vehicle Destination & Delivery Address
                      </h5>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      This address will be used by the Admin to dispatch your purchased Tesla via enclosed transporter.
                    </p>

                    <div>
                      <label className="text-xs font-mono text-neutral-400 block mb-1">Street Address</label>
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={e => setProfileAddress(e.target.value)}
                        placeholder="e.g. 742 Evergreen Terrace"
                        className="w-full bg-[#131318] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#e82127]"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">City</label>
                        <input
                          type="text"
                          value={profileCity}
                          onChange={e => setProfileCity(e.target.value)}
                          placeholder="Austin"
                          className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">State / Province</label>
                        <input
                          type="text"
                          value={profileState}
                          onChange={e => setProfileState(e.target.value)}
                          placeholder="TX"
                          className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">Postal / Zip Code</label>
                        <input
                          type="text"
                          value={profileZip}
                          onChange={e => setProfileZip(e.target.value)}
                          placeholder="78725"
                          className="w-full bg-[#131318] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e82127]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl font-heading font-bold uppercase tracking-wider text-xs text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_15px_rgba(232,33,39,0.3)] transition-all cursor-pointer"
                    >
                      Save Destination & Profile
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
