import React, { useState, useEffect } from 'react';
import { Vehicle, Order, CustomerInquiry, OrderStatus, ChatConversation, ChatMessage } from '../../types';
import { StorageService } from '../../services/storage';
import { soundEngine } from '../../services/audio';
import {
  X,
  ShieldCheck,
  TrendingUp,
  Package,
  Car,
  MessageSquare,
  Users,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  DollarSign,
  Lock,
  LogOut,
  RefreshCw,
  AlertCircle,
  Truck,
  Send,
  MapPin,
  CreditCard,
  CheckCircle2,
  UserCheck
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  onVehiclesChanged: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  onVehiclesChanged,
}) => {
  const [isAdminAuth, setIsAdminAuth] = useState(() => StorageService.isAdmin());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'inquiries' | 'chat'>('analytics');

  // Real-time data from storage
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => StorageService.getInquiries());
  const [conversations, setConversations] = useState<ChatConversation[]>(() => StorageService.getConversations());
  const [selectedConvId, setSelectedConvId] = useState<string>(() => StorageService.getConversations()[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Live Sales Offer / Contract Modal State
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerVehicleId, setOfferVehicleId] = useState(vehicles[0]?.id || 'roadster-2026');
  const [offerPrice, setOfferPrice] = useState(vehicles[0]?.basePrice || 200000);
  const [offerDeposit, setOfferDeposit] = useState(5000);
  const [offerAddress, setOfferAddress] = useState('Showroom Handover / Home Delivery');

  // Dispatch Car Modal State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchCarrier, setDispatchCarrier] = useState('Tesla Direct Enclosed Transporter');
  const [dispatchTracking, setDispatchTracking] = useState('TSLA-ENCLOSED-EXP-90812');

  // Add/Edit Vehicle Modal State
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Vehicle form fields
  const [vName, setVName] = useState('');
  const [vTagline, setVTagline] = useState('');
  const [vPrice, setVPrice] = useState(75000);
  const [v060, setV060] = useState('2.8s');
  const [vRange, setVRange] = useState('380 mi');
  const [vTopSpeed, setVTopSpeed] = useState('175 mph');
  const [vCategory, setVCategory] = useState<'Sedan' | 'SUV' | 'Hypercar' | 'Cyber'>('Sedan');
  const [vModelType, setVModelType] = useState<'models' | 'model3' | 'modelx' | 'modely' | 'roadster' | 'cybertruck'>('models');
  const [vHeroImage, setVHeroImage] = useState('https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80');
  const [vStock, setVStock] = useState(10);
  const [vDesc, setVDesc] = useState('');

  const refreshData = () => {
    setOrders(StorageService.getOrders());
    setInquiries(StorageService.getInquiries());
    const convs = StorageService.getConversations();
    setConversations(convs);
    if (!selectedConvId && convs.length > 0) {
      setSelectedConvId(convs[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }

    const handleChatUpdate = () => {
      refreshData();
    };
    window.addEventListener('tesla_chats_updated', handleChatUpdate);
    return () => {
      window.removeEventListener('tesla_chats_updated', handleChatUpdate);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'tesla2026' || passwordInput === 'admin') {
      soundEngine.playSuccess();
      StorageService.setAdmin(true);
      setIsAdminAuth(true);
      setAuthError('');
    } else {
      soundEngine.playClick();
      setAuthError('Invalid administrator credentials. (Hint: use "tesla2026" or "admin")');
    }
  };

  const handleAdminLogout = () => {
    soundEngine.playClick();
    StorageService.setAdmin(false);
    setIsAdminAuth(false);
  };

  // Analytics Calculations
  const grossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalVehiclesSold = orders.reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.quantity, 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  // Order status update
  const handleOrderStatusChange = (orderId: string, newStatus: OrderStatus) => {
    soundEngine.playClick();
    StorageService.updateOrderStatus(orderId, newStatus);
    refreshData();
  };

  // Inquiry status update
  const handleInquiryStatusChange = (inquiryId: string, status: CustomerInquiry['status']) => {
    soundEngine.playClick();
    StorageService.updateInquiryStatus(inquiryId, status);
    refreshData();
  };

  // Vehicle Delete
  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle listing?')) {
      soundEngine.playClick();
      StorageService.deleteVehicle(id);
      onVehiclesChanged();
    }
  };

  // Open Edit Form
  const openEditVehicle = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVName(veh.name);
    setVTagline(veh.tagline);
    setVPrice(veh.basePrice);
    setV060(veh.acceleration060);
    setVRange(veh.range);
    setVTopSpeed(veh.topSpeed);
    setVCategory(veh.category as any);
    setVModelType(veh.modelType);
    setVHeroImage(veh.images.hero);
    setVStock(veh.inStock);
    setVDesc(veh.description);
    setIsAddModalOpen(true);
  };

  // Open New Form
  const openNewVehicle = () => {
    setEditingVehicle(null);
    setVName('Tesla Model 3 Highland Performance');
    setVTagline('Upgraded Track Edition');
    setVPrice(54990);
    setV060('2.9s');
    setVRange('303 mi');
    setVTopSpeed('163 mph');
    setVCategory('Sedan');
    setVModelType('model3');
    setVHeroImage('https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80');
    setVStock(8);
    setVDesc('Upgraded high-efficiency electric motors and aggressive carbon aerodynamics.');
    setIsAddModalOpen(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccess();

    const vehicleToSave: Vehicle = editingVehicle
      ? {
          ...editingVehicle,
          name: vName,
          tagline: vTagline,
          basePrice: Number(vPrice),
          acceleration060: v060,
          range: vRange,
          topSpeed: vTopSpeed,
          category: vCategory,
          modelType: vModelType,
          inStock: Number(vStock),
          description: vDesc,
          images: {
            ...editingVehicle.images,
            hero: vHeroImage,
          }
        }
      : {
          id: `custom-${Date.now()}`,
          name: vName,
          tagline: vTagline,
          category: vCategory,
          modelType: vModelType,
          basePrice: Number(vPrice),
          acceleration060: v060,
          topSpeed: vTopSpeed,
          range: vRange,
          horsepower: '680 hp',
          drivetrain: 'Dual Motor All-Wheel Drive',
          seating: 5,
          cargoCapacity: '25 cu ft',
          weight: '4,100 lbs',
          superchargingSpeed: 'Up to 175 miles in 15 mins (250kW Supercharging)',
          inStock: Number(vStock),
          verified: true,
          colors: [
            { id: 'c-red', name: 'Ultra Red Metallic', hex: '#b30000', priceDelta: 2000 },
            { id: 'c-black', name: 'Solid Obsidian Black', hex: '#0f0f11', priceDelta: 0 },
            { id: 'c-white', name: 'Pearl White Multi-Coat', hex: '#eceff1', priceDelta: 1000 },
          ],
          wheels: [
            { id: 'w-1', name: '20" Warp Forged Wheels', size: '20"', priceDelta: 0, description: 'Lightweight track-ready forged aluminum' },
          ],
          interiors: [
            { id: 'int-1', name: 'All Black Sport Interior', priceDelta: 0, colorHex: '#121212', accentHex: '#4b5563', description: 'Bolstered sport bucket seats' },
          ],
          trims: [
            {
              id: 't-1',
              name: 'Highland Performance AWD',
              price: Number(vPrice),
              acceleration060: v060,
              topSpeed: vTopSpeed,
              range: vRange,
              drivetrain: 'Dual Motor AWD',
              description: 'Next-generation adaptive damping suspension with track mode.'
            }
          ],
          images: {
            hero: vHeroImage,
            exterior: [vHeroImage],
            interior: ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'],
          },
          features: [
            'Adaptive Damping Suspension',
            'Full Self-Driving Hardware 4.0 Suite',
            'Acoustic surround glass with active noise cancellation',
            'Track telemetry mode with lap times and tire temp sensor'
          ],
          description: vDesc,
        };

    StorageService.saveVehicle(vehicleToSave);
    setIsAddModalOpen(false);
    onVehiclesChanged();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0b0b10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Top Navbar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111118]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#e82127]/20 text-[#e82127] border border-[#e82127]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight">
                Tesla Motors Management Console
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                Connected to Persistent Vehicle Database &bull; Real-time Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuth && (
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-400 hover:text-[#e82127] hover:bg-white/5 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Admin</span>
              </button>
            )}

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
        </div>

        {/* ADMIN LOGIN SCREEN */}
        {!isAdminAuth ? (
          <div className="p-10 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#e82127]/20 border border-[#e82127]/40 text-[#e82127] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-2xl font-heading font-bold text-white uppercase mb-2">
                Administrator Access
              </h4>
              <p className="text-xs text-neutral-400">
                Authorized dealership access required for pricing modifications, inventory control, and customer order fulfillment.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              {authError && (
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="Enter Passkey (Hint: tesla2026)"
                  className="w-full bg-[#14141c] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127] text-center font-mono tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-heading font-bold uppercase tracking-wider text-xs sm:text-sm text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_20px_rgba(232,33,39,0.35)] transition-all"
              >
                Authenticate Session
              </button>

              <button
                type="button"
                onClick={() => {
                  setPasswordInput('tesla2026');
                }}
                className="text-[11px] font-mono text-neutral-500 hover:text-white underline block mx-auto"
              >
                Quick Fill Demo Admin Key
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-white/10 px-6 bg-[#0e0e14]">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('analytics');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Sales Analytics</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('inventory');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'inventory'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Inventory & Vehicles ({vehicles.length})</span>
              </button>

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
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('inquiries');
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'inquiries'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Customer Inquiries ({inquiries.length})</span>
                {newInquiriesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#e82127] text-white text-[10px] font-bold flex items-center justify-center">
                    {newInquiriesCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab('chat');
                  if (conversations.length > 0 && !selectedConvId) {
                    setSelectedConvId(conversations[0].id);
                  }
                }}
                className={`py-3.5 px-4 text-xs font-mono uppercase tracking-wider border-b-2 flex items-center gap-2 transition-colors ${
                  activeTab === 'chat'
                    ? 'border-[#e82127] text-white font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4 text-[#e82127]" />
                <span>Live Sales Chat & Dispatch ({conversations.length})</span>
                {conversations.reduce((acc, c) => acc + (c.unreadForAdmin || 0), 0) > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#e82127] text-white text-[10px] font-bold flex items-center justify-center">
                    {conversations.reduce((acc, c) => acc + (c.unreadForAdmin || 0), 0)}
                  </span>
                )}
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* 1. ANALYTICS */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Gross Reservation Volume
                      </span>
                      <div className="text-3xl font-heading font-extrabold text-white">
                        ${grossSales.toLocaleString()}
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                        +18.4% vs last quarter
                      </span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#e82127]">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Vehicles Contracted
                      </span>
                      <div className="text-3xl font-heading font-extrabold text-white">
                        {totalVehiclesSold} Units
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400 mt-1 block">
                        Including Founders Series Roadsters
                      </span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-sky-500">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        Active In Production
                      </span>
                      <div className="text-3xl font-heading font-extrabold text-white">
                        {activeOrdersCount}
                      </div>
                      <span className="text-[11px] font-mono text-sky-400 mt-1 block">
                        Austin & Fremont Gigafactories
                      </span>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
                      <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                        New Inquiries
                      </span>
                      <div className="text-3xl font-heading font-extrabold text-white">
                        {newInquiriesCount}
                      </div>
                      <span className="text-[11px] font-mono text-amber-400 mt-1 block">
                        Requires VIP follow-up
                      </span>
                    </div>
                  </div>

                  {/* Monthly Performance Visualizer */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-heading font-bold text-white uppercase text-sm">
                        2026 Fleet Allocation & Sales Progression
                      </h4>
                      <span className="text-xs font-mono text-neutral-400">Quarterly Trajectory</span>
                    </div>

                    <div className="grid grid-cols-6 gap-2 h-44 items-end pt-6 border-b border-white/10 pb-2">
                      {[
                        { month: 'Nov', val: 65, sales: '$420K' },
                        { month: 'Dec', val: 80, sales: '$580K' },
                        { month: 'Jan', val: 75, sales: '$510K' },
                        { month: 'Feb', val: 92, sales: '$690K' },
                        { month: 'Mar', val: 88, sales: '$640K' },
                        { month: 'Apr (Est)', val: 100, sales: '$820K' },
                      ].map(bar => (
                        <div key={bar.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white transition-colors">
                            {bar.sales}
                          </span>
                          <div
                            style={{ height: `${bar.val}%` }}
                            className="w-full max-w-[48px] bg-gradient-to-t from-[#e82127]/30 to-[#e82127] rounded-t-lg group-hover:brightness-125 transition-all shadow-[0_0_15px_rgba(232,33,39,0.3)]"
                          />
                          <span className="text-[11px] font-mono text-neutral-400">{bar.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. INVENTORY MANAGEMENT */}
              {activeTab === 'inventory' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-heading font-bold text-white uppercase text-base">
                        Vehicle Fleet Inventory
                      </h4>
                      <p className="text-xs text-neutral-400">Add, edit prices, specs, or delete marketplace listings</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (window.confirm('Reset inventory to initial default Tesla models?')) {
                            StorageService.resetVehicles();
                            onVehiclesChanged();
                          }
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Defaults</span>
                      </button>

                      <button
                        onClick={openNewVehicle}
                        className="px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider text-white bg-[#e82127] hover:bg-[#c9181e] flex items-center gap-1.5 shadow-[0_0_15px_rgba(232,33,39,0.3)] transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Vehicle</span>
                      </button>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#14141c] text-neutral-400 uppercase border-b border-white/10">
                        <tr>
                          <th className="p-4">Vehicle</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Base Price</th>
                          <th className="p-4">0-60 MPH</th>
                          <th className="p-4">Range</th>
                          <th className="p-4">In Stock</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {vehicles.map(v => (
                          <tr key={v.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img src={v.images.hero} alt={v.name} className="w-12 h-9 object-cover rounded-lg border border-white/10" />
                              <div>
                                <div className="font-bold text-white font-heading text-sm">{v.name}</div>
                                <div className="text-[10px] text-neutral-400">{v.drivetrain}</div>
                              </div>
                            </td>
                            <td className="p-4 text-neutral-300">{v.category}</td>
                            <td className="p-4 font-bold text-white">${v.basePrice.toLocaleString()}</td>
                            <td className="p-4 text-neutral-300">{v.acceleration060}</td>
                            <td className="p-4 text-neutral-300">{v.range}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                v.inStock > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {v.inStock} Available
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => openEditVehicle(v)}
                                title="Edit Vehicle"
                                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteVehicle(v.id)}
                                title="Delete Vehicle"
                                className="p-1.5 text-neutral-400 hover:text-[#e82127] rounded-lg hover:bg-white/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. CUSTOMER ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-white uppercase text-base">
                    Order Queue & Fulfillment Tracking
                  </h4>

                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
                          <div>
                            <span className="text-[10px] font-mono text-[#e82127] uppercase">Order #{order.id}</span>
                            <h5 className="font-heading font-bold text-base text-white">{order.customer.fullName}</h5>
                            <p className="text-xs text-neutral-400 font-mono">{order.customer.email} &bull; {order.customer.phone}</p>
                          </div>
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-mono text-emerald-400 font-bold block">{order.paymentStatus}</span>
                            <span className="text-sm font-heading font-bold text-white">${order.total.toLocaleString()}</span>
                            <span className="text-[10px] text-neutral-500 block">Placed {new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Order Status Changer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                          <span className="text-neutral-400">Delivery Status:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                            className="bg-[#14141c] border border-white/20 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-[#e82127]"
                          >
                            <option value="Deposit Confirmed">Deposit Confirmed</option>
                            <option value="VIN Assigned">VIN Assigned</option>
                            <option value="In Production">In Production</option>
                            <option value="Transit">In Transit</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. CUSTOMER INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-white uppercase text-base">
                    Customer Enquiries & Test Drive Requests
                  </h4>

                  <div className="space-y-4">
                    {inquiries.length === 0 ? (
                      <p className="text-xs text-neutral-500 text-center py-8">No customer enquiries received yet.</p>
                    ) : (
                      inquiries.map(inq => (
                        <div key={inq.id} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/10 text-neutral-300 mr-2">
                                {inq.inquiryType}
                              </span>
                              <span className="font-heading font-bold text-white">{inq.fullName}</span>
                              <div className="text-xs text-neutral-400 font-mono mt-1">
                                {inq.email} &bull; {inq.phone} &bull; Vehicle: <span className="text-[#e82127]">{inq.vehicleOfInterest}</span>
                              </div>
                            </div>
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                              className="bg-[#14141c] border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
                            >
                              <option value="New">New</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </div>

                          <p className="text-xs text-neutral-300 bg-black/40 p-3 rounded-xl border border-white/5">
                            "{inq.message}"
                          </p>

                          <div className="text-[10px] font-mono text-neutral-500 text-right">
                            Received {new Date(inq.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 5. LIVE SALES CHAT & DISPATCH */}
              {activeTab === 'chat' && (
                <div className="h-[600px] flex flex-col md:flex-row rounded-2xl overflow-hidden border border-white/10 bg-[#09090d]">
                  {/* Left: Conversations List */}
                  <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-[#0d0d14] flex flex-col">
                    <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                        Active Buyers ({conversations.length})
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">Direct Sales Channel</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                      {conversations.map(conv => {
                        const isSelected = conv.id === selectedConvId;
                        const lastMsg = conv.messages[conv.messages.length - 1];

                        return (
                          <button
                            key={conv.id}
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedConvId(conv.id);
                              StorageService.markConversationRead(conv.id, 'admin');
                            }}
                            className={`w-full p-3.5 text-left transition-colors flex flex-col gap-1.5 ${
                              isSelected
                                ? 'bg-[#181824] border-l-4 border-l-[#e82127]'
                                : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-heading font-bold text-sm text-white truncate">
                                {conv.customerName}
                              </span>
                              {conv.unreadForAdmin > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-[#e82127] text-white text-[10px] font-bold">
                                  {conv.unreadForAdmin} new
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-neutral-400 truncate font-sans">
                              {lastMsg ? lastMsg.text : 'No messages'}
                            </p>

                            <div className="flex items-center justify-between text-[10px] font-mono mt-1">
                              <span className={`px-2 py-0.5 rounded-full font-bold ${
                                conv.dealStatus === 'Dispatched to Address'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : conv.dealStatus === 'Payment Received'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : conv.dealStatus === 'Payment Requested'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-white/10 text-neutral-400'
                              }`}>
                                {conv.dealStatus}
                              </span>

                              <span className="text-neutral-500 truncate max-w-[120px]">
                                {conv.destinationAddress}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Active Chat Conversation Details & Actions */}
                  {(() => {
                    const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];
                    if (!activeConv) {
                      return (
                        <div className="flex-1 flex items-center justify-center text-neutral-500 font-mono text-xs">
                          No active conversation selected.
                        </div>
                      );
                    }

                    const handleSendReply = (e: React.FormEvent) => {
                      e.preventDefault();
                      if (!adminReplyText.trim()) return;
                      soundEngine.playClick();
                      StorageService.sendMessage(
                        activeConv.id,
                        'admin',
                        'Dealership Director (Admin)',
                        adminReplyText.trim()
                      );
                      setAdminReplyText('');
                    };

                    const handleOpenOfferModal = () => {
                      soundEngine.playClick();
                      setOfferAddress(activeConv.destinationAddress);
                      setIsOfferModalOpen(true);
                    };

                    const handleOpenDispatchModal = () => {
                      soundEngine.playClick();
                      setIsDispatchModalOpen(true);
                    };

                    const handleConfirmDirectPayment = (messageId: string) => {
                      soundEngine.playSuccess();
                      StorageService.customerPayOffer(activeConv.id, messageId);
                    };

                    return (
                      <div className="flex-1 flex flex-col h-full bg-[#0a0a0f]">
                        {/* Conversation Top Bar */}
                        <div className="p-4 border-b border-white/10 bg-[#12121a] flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className="font-heading font-bold text-base text-white">
                                {activeConv.customerName}
                              </h5>
                              <span className="text-xs font-mono text-neutral-400">
                                ({activeConv.customerEmail} &bull; {activeConv.customerPhone})
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-300 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#e82127]" />
                              <span>Destination Address: <strong className="text-white">{activeConv.destinationAddress}</strong></span>
                            </div>
                          </div>

                          {/* Quick Admin Sales Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleOpenOfferModal}
                              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase flex items-center gap-1.5 transition-colors border border-white/15"
                            >
                              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Send Purchase Invoice</span>
                            </button>

                            <button
                              onClick={handleOpenDispatchModal}
                              className="px-3.5 py-1.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(232,33,39,0.3)]"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch Car to Destination</span>
                            </button>
                          </div>
                        </div>

                        {/* Messages Stream */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                          {activeConv.messages.map(msg => {
                            const isAdmin = msg.sender === 'admin';

                            return (
                              <div
                                key={msg.id}
                                className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                              >
                                <span className="text-[10px] font-mono text-neutral-500 mb-1 px-1">
                                  {msg.senderName} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>

                                <div
                                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-md text-xs ${
                                    isAdmin
                                      ? 'bg-[#e82127] text-white font-medium rounded-tr-sm'
                                      : 'bg-[#181822] text-neutral-200 border border-white/10 rounded-tl-sm'
                                  }`}
                                >
                                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                                  {/* Attached Vehicle Preview */}
                                  {msg.vehicleContext && (
                                    <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-3">
                                      <img
                                        src={msg.vehicleContext.image}
                                        alt={msg.vehicleContext.name}
                                        className="w-16 h-11 object-cover rounded-lg border border-white/10"
                                      />
                                      <div className="truncate">
                                        <div className="font-heading font-bold text-white text-xs truncate">
                                          {msg.vehicleContext.name}
                                        </div>
                                        <div className="font-mono text-xs text-[#e82127] font-semibold">
                                          ${msg.vehicleContext.price.toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Attached Purchase Offer */}
                                  {msg.invoiceOffer && (
                                    <div className="mt-3 p-3.5 rounded-xl bg-black/80 border border-white/20 space-y-2 font-mono text-xs">
                                      <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                                        <span className="text-[#e82127] font-bold uppercase text-[10px]">Purchase Contract</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                          msg.invoiceOffer.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                        }`}>
                                          {msg.invoiceOffer.status === 'paid' ? 'Paid & Booked ✓' : 'Payment Pending'}
                                        </span>
                                      </div>
                                      <div className="font-heading font-bold text-white">{msg.invoiceOffer.vehicleName}</div>
                                      <div className="flex justify-between text-neutral-300">
                                        <span>Full Total:</span>
                                        <span className="font-bold text-white">${msg.invoiceOffer.totalPrice.toLocaleString()}</span>
                                      </div>
                                      <div className="flex justify-between text-neutral-300">
                                        <span>Deposit:</span>
                                        <span className="font-bold text-[#e82127]">${msg.invoiceOffer.depositRequired.toLocaleString()}</span>
                                      </div>
                                      <div className="text-[10px] text-neutral-400 truncate">
                                        Destination: {msg.invoiceOffer.destinationAddress}
                                      </div>

                                      {msg.invoiceOffer.status === 'pending' && (
                                        <button
                                          onClick={() => handleConfirmDirectPayment(msg.id)}
                                          className="w-full mt-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                                        >
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          <span>Record Payment Received As Admin</span>
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Dispatch Status Bar if vehicle was dispatched */}
                        {activeConv.trackingNumber && (
                          <div className="px-4 py-2.5 bg-emerald-950/40 border-t border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-emerald-400" />
                              <span>Enclosed Carrier Dispatched: <strong>{activeConv.carrierName}</strong> &bull; Tracking #{activeConv.trackingNumber}</span>
                            </div>
                            <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">En Route</span>
                          </div>
                        )}

                        {/* Reply Form */}
                        <form onSubmit={handleSendReply} className="p-3 bg-[#111118] border-t border-white/10 flex gap-2">
                          <input
                            type="text"
                            value={adminReplyText}
                            onChange={e => setAdminReplyText(e.target.value)}
                            placeholder={`Reply to ${activeConv.customerName} as Dealership Director...`}
                            className="flex-1 bg-[#181824] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127]"
                          />
                          <button
                            type="submit"
                            disabled={!adminReplyText.trim()}
                            className="px-5 py-2.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] disabled:opacity-40 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </form>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADMIN GENERATE PURCHASE INVOICE & CONTRACT */}
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121218] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-heading font-bold text-lg text-white uppercase">
                    Generate Direct Purchase Contract
                  </h4>
                </div>
                <button onClick={() => setIsOfferModalOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Select Vehicle from Fleet</label>
                  <select
                    value={offerVehicleId}
                    onChange={(e) => {
                      const veh = vehicles.find(v => v.id === e.target.value);
                      setOfferVehicleId(e.target.value);
                      if (veh) setOfferPrice(veh.basePrice);
                    }}
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name} (${v.basePrice.toLocaleString()})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Agreed Vehicle Price ($)</label>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={e => setOfferPrice(Number(e.target.value))}
                      className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Deposit Required ($)</label>
                    <input
                      type="number"
                      value={offerDeposit}
                      onChange={e => setOfferDeposit(Number(e.target.value))}
                      className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Destination Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={offerAddress}
                    onChange={e => setOfferAddress(e.target.value)}
                    placeholder="Enter destination delivery address..."
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const veh = vehicles.find(v => v.id === offerVehicleId) || vehicles[0];
                    StorageService.adminCreateOffer(
                      selectedConvId,
                      veh.id,
                      veh.name,
                      offerPrice,
                      offerDeposit,
                      offerAddress
                    );
                    setIsOfferModalOpen(false);
                    soundEngine.playSuccess();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] text-white font-heading font-bold text-xs uppercase tracking-wider"
                >
                  Send Invoice to Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADMIN DISPATCH CAR TO DESTINATION */}
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-70 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121218] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#e82127]" />
                  <h4 className="font-heading font-bold text-lg text-white uppercase">
                    Dispatch Vehicle to Customer Address
                  </h4>
                </div>
                <button onClick={() => setIsDispatchModalOpen(false)} className="text-neutral-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed">
                As the selling dealer, enter the enclosed transporter carrier and tracking number. The customer will immediately receive delivery confirmation and tracking updates in their chat and portal.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Carrier Name</label>
                  <input
                    type="text"
                    required
                    value={dispatchCarrier}
                    onChange={e => setDispatchCarrier(e.target.value)}
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-neutral-400 block mb-1">Carrier Tracking Number / Bill of Lading</label>
                  <input
                    type="text"
                    required
                    value={dispatchTracking}
                    onChange={e => setDispatchTracking(e.target.value)}
                    placeholder="e.g. TSLA-ENCLOSED-EXP-90812"
                    className="w-full bg-[#181824] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    StorageService.adminDispatchCar(
                      selectedConvId,
                      dispatchTracking,
                      dispatchCarrier
                    );
                    setIsDispatchModalOpen(false);
                    soundEngine.playSuccess();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] text-white font-heading font-bold text-xs uppercase tracking-wider"
                >
                  Confirm Dispatch & Notify Customer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ADD / EDIT VEHICLE MODAL OVERLAY */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#121218] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h4 className="font-heading font-bold text-lg text-white uppercase">
                  {editingVehicle ? 'Edit Vehicle Listing' : 'Add New Tesla Model'}
                </h4>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveVehicle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Model Name</label>
                    <input
                      type="text"
                      required
                      value={vName}
                      onChange={e => setVName(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Tagline</label>
                    <input
                      type="text"
                      required
                      value={vTagline}
                      onChange={e => setVTagline(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Base Price ($)</label>
                    <input
                      type="number"
                      required
                      value={vPrice}
                      onChange={e => setVPrice(Number(e.target.value))}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">0-60 MPH Acceleration</label>
                    <input
                      type="text"
                      required
                      value={v060}
                      onChange={e => setV060(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Range</label>
                    <input
                      type="text"
                      required
                      value={vRange}
                      onChange={e => setVRange(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Top Speed</label>
                    <input
                      type="text"
                      required
                      value={vTopSpeed}
                      onChange={e => setVTopSpeed(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Category</label>
                    <select
                      value={vCategory}
                      onChange={e => setVCategory(e.target.value as any)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hypercar">Hypercar</option>
                      <option value="Cyber">Cyber</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-neutral-400 block mb-1">3D Model Mesh Preset</label>
                    <select
                      value={vModelType}
                      onChange={e => setVModelType(e.target.value as any)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="models">Model S Plaid</option>
                      <option value="model3">Model 3 Highland</option>
                      <option value="modelx">Model X Falcon</option>
                      <option value="modely">Model Y Cross</option>
                      <option value="roadster">Tesla Roadster Hypercar</option>
                      <option value="cybertruck">Cybertruck Exoskeleton</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Photograph Image URL</label>
                    <input
                      type="url"
                      required
                      value={vHeroImage}
                      onChange={e => setVHeroImage(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-mono text-neutral-400 block mb-1">Vehicle Description</label>
                    <textarea
                      rows={3}
                      value={vDesc}
                      onChange={e => setVDesc(e.target.value)}
                      className="w-full bg-[#181822] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-heading font-bold uppercase tracking-wider text-xs text-white bg-[#e82127] hover:bg-[#c9181e] shadow-[0_0_15px_rgba(232,33,39,0.3)] transition-all"
                  >
                    Save Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
