import React, { useState, useEffect } from 'react';
import { Vehicle, CartItem, TrimOption, VehicleColor, WheelOption, InteriorOption, Order } from './types';
import { StorageService } from './services/storage';
import { soundEngine } from './services/audio';

// Components
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { VehicleMarketplace } from './components/explore/VehicleMarketplace';
import { RoadsterExperience } from './components/roadster/RoadsterExperience';
import { VehicleConfigurator } from './components/configurator/VehicleConfigurator';
import { VehicleDetailsModal } from './components/details/VehicleDetailsModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { VehicleCompareModal } from './components/compare/VehicleCompareModal';
import { AboutTesla } from './components/about/AboutTesla';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/footer/Footer';
import { CustomerChatWidget } from './components/chat/CustomerChatWidget';

export default function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => StorageService.getVehicles());
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [activeUser, setActiveUser] = useState(() => StorageService.getActiveUser());

  // Navigation & Modals state
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedVehicleForDetails, setSelectedVehicleForDetails] = useState<Vehicle | null>(null);
  const [configuratorVehicleId, setConfiguratorVehicleId] = useState<string>('roadster-2026');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [prefilledInquiryVehicle, setPrefilledInquiryVehicle] = useState('Tesla Roadster');

  // Flash notification toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync state with local events
  useEffect(() => {
    const handleVehiclesUpdate = () => {
      setVehicles(StorageService.getVehicles());
    };
    const handleCartUpdate = () => {
      setCart(StorageService.getCart());
    };
    const handleUserUpdate = () => {
      setActiveUser(StorageService.getActiveUser());
    };

    window.addEventListener('tesla_vehicles_updated', handleVehiclesUpdate);
    window.addEventListener('tesla_cart_updated', handleCartUpdate);
    window.addEventListener('tesla_user_updated', handleUserUpdate);

    return () => {
      window.removeEventListener('tesla_vehicles_updated', handleVehiclesUpdate);
      window.removeEventListener('tesla_cart_updated', handleCartUpdate);
      window.removeEventListener('tesla_user_updated', handleUserUpdate);
    };
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleFavorite = (id: string) => {
    const added = StorageService.toggleFavorite(id);
    setActiveUser(StorageService.getActiveUser());
    showToast(added ? 'Added to Saved Vehicles' : 'Removed from Saved Vehicles');
  };

  const handleAddToCartFromConfig = (config: {
    vehicle: Vehicle;
    trim: TrimOption;
    color: VehicleColor;
    wheel: WheelOption;
    interior: InteriorOption;
    fsdIncluded: boolean;
    totalPrice: number;
  }) => {
    const cartItem: CartItem = {
      id: `cart-${Date.now()}`,
      vehicleId: config.vehicle.id,
      vehicleName: `${config.vehicle.name} (${config.trim.name})`,
      vehicleImage: config.vehicle.images.hero,
      trim: config.trim,
      color: config.color,
      wheel: config.wheel,
      interior: config.interior,
      fsdIncluded: config.fsdIncluded,
      unitPrice: config.totalPrice,
      quantity: 1,
      configuredAt: new Date().toISOString(),
    };

    StorageService.addToCart(cartItem);
    setIsCartOpen(true);
    showToast(`${config.vehicle.name} added to cart`);
  };

  const handleInstantBuy = (vehicle: Vehicle) => {
    const cartItem: CartItem = {
      id: `cart-${Date.now()}`,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.name} (${vehicle.trims[0].name})`,
      vehicleImage: vehicle.images.hero,
      trim: vehicle.trims[0],
      color: vehicle.colors[0],
      wheel: vehicle.wheels[0],
      interior: vehicle.interiors[0],
      fsdIncluded: false,
      unitPrice: vehicle.basePrice,
      quantity: 1,
      configuredAt: new Date().toISOString(),
    };

    StorageService.addToCart(cartItem);
    setIsCheckoutOpen(true);
  };

  const handleProceedCheckoutFromConfig = (config: {
    vehicle: Vehicle;
    trim: TrimOption;
    color: VehicleColor;
    wheel: WheelOption;
    interior: InteriorOption;
    fsdIncluded: boolean;
    totalPrice: number;
  }) => {
    handleAddToCartFromConfig(config);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Find the Roadster for dedicated section
  const roadsterVehicle = vehicles.find(v => v.modelType === 'roadster') || vehicles[0];

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex flex-col font-sans selection:bg-[#e82127] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-60 glass-panel-glow px-4 py-3 rounded-2xl text-xs font-mono text-white flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-[#e82127] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Top Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        favoritesCount={activeUser?.savedFavorites.length || 0}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFavorites={() => setIsAccountOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />

      <main className="flex-1">
        {/* SECTION 1: CINEMATIC 3D LANDING HERO */}
        <div id="hero">
          <HeroSection
            onExploreVehicles={() => handleNavigate('explore')}
            onDiscoverRoadster={() => handleNavigate('roadster')}
            onConfigureVehicle={() => handleNavigate('configurator')}
          />
        </div>

        {/* SECTION 2: EXPLORE TESLA VEHICLES */}
        <div id="models">
          <VehicleMarketplace
            vehicles={vehicles}
            favorites={activeUser?.savedFavorites || []}
            onToggleFavorite={handleToggleFavorite}
            onSelectVehicle={(veh) => setSelectedVehicleForDetails(veh)}
            onConfigureVehicle={(veh) => {
              setConfiguratorVehicleId(veh.id);
              handleNavigate('configurator');
            }}
            onInstantBuy={handleInstantBuy}
          />
        </div>

        {/* SECTION 3: EXCLUSIVE TESLA ROADSTER EXPERIENCE */}
        <RoadsterExperience
          roadster={roadsterVehicle}
          onReserve={(veh) => {
            setConfiguratorVehicleId(veh.id);
            handleNavigate('configurator');
          }}
          onOpenEnquiry={(vehName) => {
            setPrefilledInquiryVehicle(vehName);
            handleNavigate('contact');
          }}
        />

        {/* SECTION 4: 3D VEHICLE CONFIGURATOR */}
        <VehicleConfigurator
          vehicles={vehicles}
          initialVehicleId={configuratorVehicleId}
          onAddToCart={handleAddToCartFromConfig}
          onProceedCheckout={handleProceedCheckoutFromConfig}
        />

        {/* SECTION 9: ABOUT TESLA & TECHNOLOGY */}
        <AboutTesla />

        {/* SECTION 10: CONTACT AND ENQUIRIES */}
        <ContactSection
          vehicles={vehicles}
          prefilledVehicle={prefilledInquiryVehicle}
        />
      </main>

      {/* SECTION 11: FOOTER */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS & OVERLAYS */}
      {/* 1. Vehicle Details Modal */}
      {selectedVehicleForDetails && (
        <VehicleDetailsModal
          vehicle={selectedVehicleForDetails}
          onClose={() => setSelectedVehicleForDetails(null)}
          onConfigure={(veh) => {
            setConfiguratorVehicleId(veh.id);
            handleNavigate('configurator');
          }}
          onContactSeller={(vehName) => {
            setPrefilledInquiryVehicle(vehName);
            handleNavigate('contact');
          }}
          onInstantBuy={handleInstantBuy}
          onChatWithAdmin={(veh) => {
            window.dispatchEvent(new CustomEvent('tesla_open_chat', { detail: { vehicle: veh } }));
          }}
        />
      )}

      {/* 2. Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={(id, qty) => StorageService.updateCartQuantity(id, qty)}
          onRemoveItem={(id) => StorageService.removeFromCart(id)}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* 3. Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          onOrderSuccess={(order) => {
            showToast(`Order #${order.id} registered successfully!`);
          }}
        />
      )}

      {/* 4. Customer Account Modal */}
      {isAccountOpen && (
        <CustomerAccountModal
          isOpen={isAccountOpen}
          onClose={() => setIsAccountOpen(false)}
          vehicles={vehicles}
          onSelectVehicle={(veh) => setSelectedVehicleForDetails(veh)}
        />
      )}

      {/* 5. Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          vehicles={vehicles}
          onVehiclesChanged={() => setVehicles(StorageService.getVehicles())}
        />
      )}

      {/* 6. Vehicle Compare Modal */}
      {isCompareOpen && (
        <VehicleCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          vehicles={vehicles}
          onConfigureVehicle={(veh) => {
            setConfiguratorVehicleId(veh.id);
            handleNavigate('configurator');
          }}
        />
      )}

      {/* 7. Live Customer-to-Admin Sales & Dispatch Chat Widget */}
      <CustomerChatWidget
        currentVehicleContext={selectedVehicleForDetails}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />
    </div>
  );
}
