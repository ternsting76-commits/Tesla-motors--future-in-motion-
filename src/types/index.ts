export type VehicleCategory = 'Hypercar' | 'Sedan' | 'SUV' | 'Cyber' | 'All';

export interface VehicleColor {
  id: string;
  name: string;
  hex: string;
  priceDelta: number;
}

export interface WheelOption {
  id: string;
  name: string;
  size: string;
  priceDelta: number;
  description: string;
}

export interface InteriorOption {
  id: string;
  name: string;
  priceDelta: number;
  colorHex: string;
  accentHex: string;
  description: string;
}

export interface TrimOption {
  id: string;
  name: string;
  price: number;
  acceleration060: string;
  topSpeed: string;
  range: string;
  drivetrain: string;
  description: string;
}

export interface Vehicle {
  id: string;
  name: string;
  tagline: string;
  category: VehicleCategory;
  modelType: 'roadster' | 'cybertruck' | 'models' | 'model3' | 'modelx' | 'modely';
  basePrice: number;
  acceleration060: string; // e.g. "1.9s"
  topSpeed: string; // e.g. "250+ mph"
  range: string; // e.g. "620 mi"
  horsepower: string;
  drivetrain: string; // e.g. "Tri-Motor All-Wheel Drive"
  seating: number;
  cargoCapacity: string;
  weight: string;
  superchargingSpeed: string;
  colors: VehicleColor[];
  wheels: WheelOption[];
  interiors: InteriorOption[];
  trims: TrimOption[];
  images: {
    hero: string;
    exterior: string[];
    interior: string[];
  };
  features: string[];
  description: string;
  inStock: number;
  verified: boolean;
  featured?: boolean;
}

export interface ConfiguredVehicle {
  vehicle: Vehicle;
  selectedTrim: TrimOption;
  selectedColor: VehicleColor;
  selectedWheel: WheelOption;
  selectedInterior: InteriorOption;
  fsdIncluded: boolean; // Full Self-Driving ($8,000)
  totalPrice: number;
  estimatedMonthly: number;
}

export interface CartItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  vehicleImage: string;
  trim: TrimOption;
  color: VehicleColor;
  wheel: WheelOption;
  interior: InteriorOption;
  fsdIncluded: boolean;
  unitPrice: number;
  quantity: number;
  configuredAt: string;
}

export type OrderStatus = 'Deposit Confirmed' | 'VIN Assigned' | 'In Production' | 'Transit' | 'Ready for Delivery' | 'Completed' | 'Cancelled';

export interface OrderCustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  deliveryMethod: 'Home Delivery' | 'Tesla Delivery Center Pickup';
}

export interface Order {
  id: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  depositAmount: number;
  paymentMethod: 'Credit / Debit Card' | 'Tesla Financing' | 'Cryptocurrency';
  paymentStatus: 'Paid' | 'Deposit Paid' | 'Financing Approved';
  status: OrderStatus;
  estimatedDelivery: string;
  vin?: string;
}

export interface CustomerInquiry {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  vehicleOfInterest: string;
  inquiryType: 'Purchase Enquiry' | 'Schedule Test Drive' | 'Financing Assistance' | 'Fleet / Commercial';
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
  vehicleContext?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  invoiceOffer?: {
    vehicleName: string;
    vehicleId: string;
    totalPrice: number;
    depositRequired: number;
    destinationAddress: string;
    status: 'pending' | 'paid' | 'dispatched';
  };
}

export type DealStatus = 'Negotiating' | 'Payment Requested' | 'Payment Received' | 'Dispatched to Address' | 'Delivered';

export interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  destinationAddress: string;
  messages: ChatMessage[];
  lastUpdated: string;
  unreadForAdmin: number;
  unreadForCustomer: number;
  dealStatus: DealStatus;
  assignedCarId?: string;
  assignedCarName?: string;
  trackingNumber?: string;
  carrierName?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  authProvider?: 'email' | 'google';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  savedFavorites: string[]; // vehicle IDs
  orders: string[]; // order IDs
  createdAt: string;
}

