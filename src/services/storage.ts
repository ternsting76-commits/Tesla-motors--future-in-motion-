import {
  Vehicle,
  CartItem,
  Order,
  CustomerInquiry,
  UserAccount,
  OrderStatus,
  ChatConversation,
  ChatMessage,
  DealStatus
} from '../types';
import { INITIAL_VEHICLES } from '../data/initialVehicles';

const STORAGE_KEYS = {
  VEHICLES: 'tesla_vehicles_v2', // Updated to ensure all 50+ vehicles are active
  CART: 'tesla_cart_v1',
  ORDERS: 'tesla_orders_v1',
  INQUIRIES: 'tesla_inquiries_v1',
  USERS: 'tesla_users_v1',
  ACTIVE_USER: 'tesla_active_user_v1',
  ADMIN_AUTH: 'tesla_admin_auth_v1',
  CHATS: 'tesla_chats_v1',
};

// Initial Seed Orders for realistic showroom history
const INITIAL_ORDERS: Order[] = [
  {
    id: 'TSLA-2026-89412',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      fullName: 'Alex Vance',
      email: 'alex.vance@example.com',
      phone: '+1 320-738-1283',
      address: '742 Ocean Drive',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
      country: 'United States',
      deliveryMethod: 'Home Delivery',
    },
    items: [
      {
        id: 'cart-init-1',
        vehicleId: 'roadster-2026',
        vehicleName: 'Tesla Roadster Founders Series',
        vehicleImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
        trim: INITIAL_VEHICLES[0].trims[0],
        color: INITIAL_VEHICLES[0].colors[0],
        wheel: INITIAL_VEHICLES[0].wheels[0],
        interior: INITIAL_VEHICLES[0].interiors[0],
        fsdIncluded: true,
        unitPrice: 200000,
        quantity: 1,
        configuredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    subtotal: 200000,
    tax: 16000,
    total: 216000,
    depositAmount: 5000,
    paymentMethod: 'Credit / Debit Card',
    paymentStatus: 'Paid',
    status: 'In Production',
    estimatedDelivery: 'Q3 2026',
    vin: '5YJSA1E28HF89412',
  },
  {
    id: 'TSLA-2026-67319',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    customer: {
      fullName: 'Sarah Chen',
      email: 'sarah.chen@techventures.io',
      phone: '+1 320-738-1283',
      address: '100 Innovation Way',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
      country: 'United States',
      deliveryMethod: 'Home Delivery',
    },
    items: [
      {
        id: 'cart-init-2',
        vehicleId: 'cybertruck-2026',
        vehicleName: 'Tesla Cybertruck Cyberbeast',
        vehicleImage: 'https://images.unsplash.com/photo-1698778573682-346d219402b5?auto=format&fit=crop&w=1200&q=80',
        trim: INITIAL_VEHICLES[1].trims[0],
        color: INITIAL_VEHICLES[1].colors[0],
        wheel: INITIAL_VEHICLES[1].wheels[0],
        interior: INITIAL_VEHICLES[1].interiors[0],
        fsdIncluded: true,
        unitPrice: 99990,
        quantity: 1,
        configuredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ],
    subtotal: 99990,
    tax: 7999,
    total: 107989,
    depositAmount: 107989,
    paymentMethod: 'Tesla Financing',
    paymentStatus: 'Paid',
    status: 'Transit',
    estimatedDelivery: 'Ready in 3 days',
    vin: '7G2CEBEF8PA67319',
  }
];

// Initial Seed Inquiries
const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-101',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    fullName: 'David Miller',
    email: 'david.m@apexholdings.com',
    phone: '+1 320-738-1283',
    vehicleOfInterest: 'Tesla Roadster Founders Series',
    inquiryType: 'Purchase Enquiry',
    message: 'Interested in reserving two Founders Series Roadsters for our private collection. Can we schedule a private VIP consultation regarding delivery priority?',
    status: 'New'
  },
  {
    id: 'inq-102',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    fullName: 'Elena Rostova',
    email: 'elena.rostova@designlab.de',
    phone: '+1 320-738-1283',
    vehicleOfInterest: 'Tesla Model S Plaid',
    inquiryType: 'Schedule Test Drive',
    message: 'Would love to experience track mode testing on the Model S Plaid before finalizing my order with carbon ceramic brake upgrades.',
    status: 'In Progress'
  }
];

// Initial Seed Chat Conversations between Admin and Customers
const INITIAL_CHATS: ChatConversation[] = [
  {
    id: 'conv-demo-1',
    customerId: 'usr-vip-demo',
    customerName: 'Elon Vance',
    customerEmail: 'customer@tesla-motion.com',
    customerPhone: '+1 320-738-1283',
    destinationAddress: '742 Evergreen Terrace, Austin, TX 78725',
    dealStatus: 'Payment Received',
    assignedCarId: 'roadster-2026',
    assignedCarName: 'Tesla Roadster Founders Series',
    trackingNumber: 'TSLA-ENCLOSED-EXP-90812',
    carrierName: 'Tesla Direct Enclosed Transporter',
    lastUpdated: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    unreadForAdmin: 1,
    unreadForCustomer: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        senderName: 'Elon Vance',
        text: 'Hello Admin, I am interested in purchasing the Tesla Roadster Founders Series. Can you ship it directly to my home destination in Austin, TX?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        vehicleContext: {
          id: 'roadster-2026',
          name: 'Tesla Roadster Founders Series',
          price: 200000,
          image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80'
        }
      },
      {
        id: 'msg-2',
        sender: 'admin',
        senderName: 'Dealership Director (Admin)',
        text: 'Welcome Elon! Yes, as the authorized sales director, I handle all direct purchases, escrow payments, and enclosed transport to your address. I have prepared an official allocation for you with priority delivery.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        invoiceOffer: {
          vehicleId: 'roadster-2026',
          vehicleName: 'Tesla Roadster Founders Series',
          totalPrice: 200000,
          depositRequired: 5000,
          destinationAddress: '742 Evergreen Terrace, Austin, TX 78725',
          status: 'paid'
        }
      },
      {
        id: 'msg-3',
        sender: 'customer',
        senderName: 'Elon Vance',
        text: 'Payment has been completed! Please let me know once the transporter is dispatched with the tracking number.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      },
      {
        id: 'msg-4',
        sender: 'admin',
        senderName: 'Dealership Director (Admin)',
        text: 'Payment received in full! We have booked Tesla Direct Enclosed Transporter #TSLA-ENCLOSED-EXP-90812. Your Roadster is scheduled for departure directly to your address.',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: 'conv-demo-2',
    customerId: 'usr-sarah-chen',
    customerName: 'Sarah Chen',
    customerEmail: 'sarah.chen@techventures.io',
    customerPhone: '+1 320-738-1283',
    destinationAddress: '100 Innovation Way, Palo Alto, CA 94301',
    dealStatus: 'Payment Requested',
    assignedCarId: 'cybertruck-2026',
    assignedCarName: 'Tesla Cybertruck Cyberbeast',
    lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    unreadForAdmin: 0,
    unreadForCustomer: 1,
    messages: [
      {
        id: 'msg-201',
        sender: 'customer',
        senderName: 'Sarah Chen',
        text: 'Hi! Can you confirm if the Cybertruck Cyberbeast comes with the powershare home battery backup package?',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        vehicleContext: {
          id: 'cybertruck-2026',
          name: 'Tesla Cybertruck Cyberbeast',
          price: 99990,
          image: 'https://images.unsplash.com/photo-1698778573682-346d219402b5?auto=format&fit=crop&w=1200&q=80'
        }
      },
      {
        id: 'msg-202',
        sender: 'admin',
        senderName: 'Dealership Director (Admin)',
        text: 'Yes Sarah! The Cyberbeast includes the complete Powershare gateway hardware and bidirectional vehicle-to-home charging. Here is the direct purchase invoice for delivery to your Palo Alto address:',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        invoiceOffer: {
          vehicleId: 'cybertruck-2026',
          vehicleName: 'Tesla Cybertruck Cyberbeast',
          totalPrice: 99990,
          depositRequired: 5000,
          destinationAddress: '100 Innovation Way, Palo Alto, CA 94301',
          status: 'pending'
        }
      }
    ]
  }
];

export const StorageService = {
  // --- VEHICLES (50+ MODELS) ---
  getVehicles(): Vehicle[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
        return INITIAL_VEHICLES;
      }
      const parsed = JSON.parse(data);
      // Auto-upgrade to full 50+ models if previous cache was only the 6 initial base cars
      if (!Array.isArray(parsed) || parsed.length < 40) {
        localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
        return INITIAL_VEHICLES;
      }
      return parsed;
    } catch {
      return INITIAL_VEHICLES;
    }
  },

  getVehicleById(id: string): Vehicle | undefined {
    return this.getVehicles().find(v => v.id === id);
  },

  saveVehicle(vehicle: Vehicle): void {
    const list = this.getVehicles();
    const index = list.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      list[index] = vehicle;
    } else {
      list.unshift(vehicle);
    }
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
    window.dispatchEvent(new Event('tesla_vehicles_updated'));
  },

  deleteVehicle(id: string): void {
    const list = this.getVehicles().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(list));
    window.dispatchEvent(new Event('tesla_vehicles_updated'));
  },

  resetVehicles(): void {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_VEHICLES));
    window.dispatchEvent(new Event('tesla_vehicles_updated'));
  },

  // --- CART ---
  getCart(): CartItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToCart(item: CartItem): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(c =>
      c.vehicleId === item.vehicleId &&
      c.trim.id === item.trim.id &&
      c.color.id === item.color.id &&
      c.wheel.id === item.wheel.id &&
      c.interior.id === item.interior.id &&
      c.fsdIncluded === item.fsdIncluded
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('tesla_cart_updated'));
  },

  updateCartQuantity(itemId: string, quantity: number): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(c => c.id !== itemId);
    } else {
      cart = cart.map(c => c.id === itemId ? { ...c, quantity } : c);
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('tesla_cart_updated'));
  },

  removeFromCart(itemId: string): void {
    const cart = this.getCart().filter(c => c.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('tesla_cart_updated'));
  },

  clearCart(): void {
    localStorage.removeItem(STORAGE_KEYS.CART);
    window.dispatchEvent(new Event('tesla_cart_updated'));
  },

  // --- ORDERS ---
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    const activeUser = this.getActiveUser();
    if (activeUser) {
      activeUser.orders.push(order.id);
      this.updateUser(activeUser);
    }

    window.dispatchEvent(new Event('tesla_orders_updated'));
  },

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.getOrders().map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('tesla_orders_updated'));
  },

  // --- INQUIRIES ---
  getInquiries(): CustomerInquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
        return INITIAL_INQUIRIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_INQUIRIES;
    }
  },

  addInquiry(inquiry: CustomerInquiry): void {
    const list = this.getInquiries();
    list.unshift(inquiry);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
    window.dispatchEvent(new Event('tesla_inquiries_updated'));
  },

  updateInquiryStatus(inquiryId: string, status: CustomerInquiry['status']): void {
    const list = this.getInquiries().map(i => i.id === inquiryId ? { ...i, status } : i);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(list));
    window.dispatchEvent(new Event('tesla_inquiries_updated'));
  },

  // --- CUSTOMER LIVE CHAT WITH ADMIN ---
  getConversations(): ChatConversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHATS));
        return INITIAL_CHATS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CHATS;
    }
  },

  getConversationById(id: string): ChatConversation | undefined {
    return this.getConversations().find(c => c.id === id);
  },

  getOrCreateConversationForUser(user: UserAccount): ChatConversation {
    const convs = this.getConversations();
    let existing = convs.find(c => c.customerId === user.id || c.customerEmail.toLowerCase() === user.email.toLowerCase());
    if (existing) {
      return existing;
    }

    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      customerId: user.id,
      customerName: user.name || 'Tesla Customer',
      customerEmail: user.email,
      customerPhone: user.phone || '+1 320-738-1283',
      destinationAddress: user.address ? `${user.address}, ${user.city || ''} ${user.state || ''}` : 'Showroom Handover / Home Delivery',
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'admin',
          senderName: 'Dealership Director (Admin)',
          text: `Welcome to Tesla Motors, ${user.name}! I am the dealership sales director. You can chat with me directly right here to negotiate vehicle pricing, receive custom purchase offers, confirm your destination address, and monitor your delivery transporter. How can I assist you today?`,
          timestamp: new Date().toISOString()
        }
      ],
      lastUpdated: new Date().toISOString(),
      unreadForAdmin: 1,
      unreadForCustomer: 0,
      dealStatus: 'Negotiating'
    };

    convs.unshift(newConv);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
    window.dispatchEvent(new Event('tesla_chats_updated'));
    return newConv;
  },

  sendMessage(
    conversationId: string,
    sender: 'customer' | 'admin',
    senderName: string,
    text: string,
    vehicleContext?: ChatMessage['vehicleContext'],
    invoiceOffer?: ChatMessage['invoiceOffer']
  ): ChatMessage {
    const convs = this.getConversations();
    const convIndex = convs.findIndex(c => c.id === conversationId);

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sender,
      senderName,
      text,
      timestamp: new Date().toISOString(),
      vehicleContext,
      invoiceOffer
    };

    if (convIndex >= 0) {
      convs[convIndex].messages.push(newMessage);
      convs[convIndex].lastUpdated = new Date().toISOString();

      if (sender === 'customer') {
        convs[convIndex].unreadForAdmin += 1;
      } else {
        convs[convIndex].unreadForCustomer += 1;
      }

      if (invoiceOffer) {
        convs[convIndex].dealStatus = 'Payment Requested';
        convs[convIndex].assignedCarId = invoiceOffer.vehicleId;
        convs[convIndex].assignedCarName = invoiceOffer.vehicleName;
      }

      // Move updated conversation to top
      const [updatedConv] = convs.splice(convIndex, 1);
      convs.unshift(updatedConv);

      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
      window.dispatchEvent(new Event('tesla_chats_updated'));
    }

    return newMessage;
  },

  adminCreateOffer(
    conversationId: string,
    vehicleId: string,
    vehicleName: string,
    totalPrice: number,
    depositRequired: number,
    destinationAddress: string
  ): void {
    const offer: ChatMessage['invoiceOffer'] = {
      vehicleId,
      vehicleName,
      totalPrice,
      depositRequired,
      destinationAddress,
      status: 'pending'
    };

    this.sendMessage(
      conversationId,
      'admin',
      'Dealership Director (Admin)',
      `I have generated an official vehicle purchase contract & payment invoice for the ${vehicleName}. Please review the deposit and shipping destination to proceed with transport allocation.`,
      undefined,
      offer
    );
  },

  customerPayOffer(conversationId: string, messageId: string): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    if (!conv) return;

    const msg = conv.messages.find(m => m.id === messageId);
    if (msg && msg.invoiceOffer) {
      msg.invoiceOffer.status = 'paid';
      conv.dealStatus = 'Payment Received';
      conv.lastUpdated = new Date().toISOString();

      // Create an official order in orders list
      const orderId = `TSLA-DIR-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toISOString(),
        customer: {
          fullName: conv.customerName,
          email: conv.customerEmail,
          phone: conv.customerPhone || '+1 320-738-1283',
          address: conv.destinationAddress,
          city: 'Destination Hub',
          state: 'US',
          zipCode: '78725',
          country: 'United States',
          deliveryMethod: 'Home Delivery'
        },
        items: [
          {
            id: `item-${Date.now()}`,
            vehicleId: msg.invoiceOffer.vehicleId,
            vehicleName: msg.invoiceOffer.vehicleName,
            vehicleImage: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
            trim: INITIAL_VEHICLES[0].trims[0],
            color: INITIAL_VEHICLES[0].colors[0],
            wheel: INITIAL_VEHICLES[0].wheels[0],
            interior: INITIAL_VEHICLES[0].interiors[0],
            fsdIncluded: true,
            unitPrice: msg.invoiceOffer.totalPrice,
            quantity: 1,
            configuredAt: new Date().toISOString()
          }
        ],
        subtotal: msg.invoiceOffer.totalPrice,
        tax: Math.round(msg.invoiceOffer.totalPrice * 0.08),
        total: Math.round(msg.invoiceOffer.totalPrice * 1.08),
        depositAmount: msg.invoiceOffer.depositRequired,
        paymentMethod: 'Credit / Debit Card',
        paymentStatus: 'Paid',
        status: 'In Production',
        estimatedDelivery: '5-7 Days (Enclosed Carrier)',
        vin: `5YJSA1E2${Math.floor(10 + Math.random() * 89)}HF${Math.floor(10000 + Math.random() * 90000)}`
      };

      this.addOrder(newOrder);

      // System notification message in chat
      conv.messages.push({
        id: `msg-paid-${Date.now()}`,
        sender: 'customer',
        senderName: conv.customerName,
        text: `Deposit of $${msg.invoiceOffer.depositRequired.toLocaleString()} successfully paid! Order #${orderId} generated. Destination confirmed at: ${conv.destinationAddress}.`,
        timestamp: new Date().toISOString()
      });

      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
      window.dispatchEvent(new Event('tesla_chats_updated'));
    }
  },

  adminDispatchCar(
    conversationId: string,
    trackingNumber: string,
    carrierName: string = 'Tesla Direct Enclosed Transporter'
  ): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    if (!conv) return;

    conv.dealStatus = 'Dispatched to Address';
    conv.trackingNumber = trackingNumber;
    conv.carrierName = carrierName;
    conv.lastUpdated = new Date().toISOString();

    conv.messages.push({
      id: `msg-dispatch-${Date.now()}`,
      sender: 'admin',
      senderName: 'Dealership Director (Admin)',
      text: `Vehicle has officially departed our logistics center! Carrier: ${carrierName}. Tracking Number: ${trackingNumber}. It is en route directly to your address: ${conv.destinationAddress}.`,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
    window.dispatchEvent(new Event('tesla_chats_updated'));
  },

  updateDestinationAddress(conversationId: string, address: string): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    if (conv) {
      conv.destinationAddress = address;
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
      window.dispatchEvent(new Event('tesla_chats_updated'));
    }
  },

  markConversationRead(conversationId: string, reader: 'admin' | 'customer'): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    if (conv) {
      if (reader === 'admin') conv.unreadForAdmin = 0;
      else conv.unreadForCustomer = 0;
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(convs));
      window.dispatchEvent(new Event('tesla_chats_updated'));
    }
  },

  // --- USER ACCOUNTS (EMAIL + GOOGLE) ---
  getUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  registerUser(
    name: string,
    email: string,
    phone?: string,
    address?: string
  ): UserAccount {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.setActiveUser(existing);
      return existing;
    }
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '+1 320-738-1283',
      authProvider: 'email',
      address: address || '100 Tesla Road',
      city: 'Austin',
      state: 'TX',
      zipCode: '78725',
      country: 'United States',
      savedFavorites: ['roadster-2026', 'cybertruck-2026'],
      orders: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setActiveUser(newUser);
    return newUser;
  },

  loginWithGoogle(email: string = 'wj3201113@gmail.com', name: string = 'Tesla Customer'): UserAccount {
    const users = this.getUsers();
    let existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      existing = {
        id: `usr-google-${Date.now()}`,
        name: name || 'Google Verified Client',
        email,
        phone: '+1 320-738-1283',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        authProvider: 'google',
        address: '742 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        country: 'United States',
        savedFavorites: ['roadster-2026', 'cybertruck-2026', 'models-plaid'],
        orders: ['TSLA-2026-89412'],
        createdAt: new Date().toISOString()
      };
      users.push(existing);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
    this.setActiveUser(existing);
    return existing;
  },

  loginUser(email: string): UserAccount | null {
    const users = this.getUsers();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      user = this.registerUser('Tesla Customer', email);
    } else {
      this.setActiveUser(user);
    }
    return user;
  },

  getActiveUser(): UserAccount | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
      if (!data) {
        const defaultUser: UserAccount = {
          id: 'usr-vip-demo',
          name: 'Elon Vance',
          email: 'customer@tesla-motion.com',
          phone: '+1 320-738-1283',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          authProvider: 'email',
          address: '742 Evergreen Terrace',
          city: 'Austin',
          state: 'TX',
          zipCode: '78725',
          country: 'United States',
          savedFavorites: ['roadster-2026', 'cybertruck-2026'],
          orders: ['TSLA-2026-89412'],
          createdAt: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(defaultUser));
        return defaultUser;
      }
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setActiveUser(user: UserAccount | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
    }
    window.dispatchEvent(new Event('tesla_user_updated'));
  },

  updateUser(user: UserAccount): void {
    const users = this.getUsers().map(u => u.id === user.id ? user : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setActiveUser(user);
  },

  toggleFavorite(vehicleId: string): boolean {
    const user = this.getActiveUser();
    if (!user) return false;

    const exists = user.savedFavorites.includes(vehicleId);
    if (exists) {
      user.savedFavorites = user.savedFavorites.filter(id => id !== vehicleId);
    } else {
      user.savedFavorites.push(vehicleId);
    }
    this.updateUser(user);
    return !exists;
  },

  isFavorite(vehicleId: string): boolean {
    const user = this.getActiveUser();
    return user ? user.savedFavorites.includes(vehicleId) : false;
  },

  // --- ADMIN AUTH ---
  isAdmin(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdmin(status: boolean): void {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    window.dispatchEvent(new Event('tesla_admin_updated'));
  }
};
