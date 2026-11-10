import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, ChatMessage, Vehicle, UserAccount } from '../../types';
import { StorageService } from '../../services/storage';
import { soundEngine } from '../../services/audio';
import {
  MessageSquare,
  X,
  Send,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Car,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface CustomerChatWidgetProps {
  currentVehicleContext?: Vehicle | null;
  onOpenCheckout?: () => void;
}

export const CustomerChatWidget: React.FC<CustomerChatWidgetProps> = ({
  currentVehicleContext,
  onOpenCheckout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => StorageService.getActiveUser());
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversation = () => {
    const user = StorageService.getActiveUser();
    setActiveUser(user);
    if (user) {
      const conv = StorageService.getOrCreateConversationForUser(user);
      setConversation(conv);
      setNewAddress(conv.destinationAddress);
    }
  };

  useEffect(() => {
    loadConversation();

    const handleChatUpdate = () => {
      loadConversation();
    };
    const handleUserUpdate = () => {
      loadConversation();
    };

    const handleOpenChat = (e: Event) => {
      setIsOpen(true);
      const customEvt = e as CustomEvent<{ vehicle?: Vehicle }>;
      if (customEvt.detail?.vehicle) {
        handleAttachVehicle(customEvt.detail.vehicle);
      }
    };

    window.addEventListener('tesla_chats_updated', handleChatUpdate);
    window.addEventListener('tesla_user_updated', handleUserUpdate);
    window.addEventListener('tesla_open_chat', handleOpenChat as EventListener);

    return () => {
      window.removeEventListener('tesla_chats_updated', handleChatUpdate);
      window.removeEventListener('tesla_user_updated', handleUserUpdate);
      window.removeEventListener('tesla_open_chat', handleOpenChat as EventListener);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (conversation) {
        StorageService.markConversationRead(conversation.id, 'customer');
      }
    }
  }, [isOpen, conversation?.messages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !conversation) return;

    soundEngine.playClick();
    StorageService.sendMessage(
      conversation.id,
      'customer',
      activeUser?.name || 'Tesla Customer',
      messageInput.trim()
    );
    setMessageInput('');
  };

  const handleAttachVehicle = (veh: Vehicle) => {
    if (!conversation) return;
    soundEngine.playClick();
    StorageService.sendMessage(
      conversation.id,
      'customer',
      activeUser?.name || 'Tesla Customer',
      `I am inquiring about the ${veh.name}. What is the earliest enclosed transporter delivery date to my destination?`,
      {
        id: veh.id,
        name: veh.name,
        price: veh.basePrice,
        image: veh.images.hero
      }
    );
  };

  const handlePayInvoice = (messageId: string) => {
    if (!conversation) return;
    soundEngine.playSuccess();
    StorageService.customerPayOffer(conversation.id, messageId);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversation || !newAddress.trim()) return;
    soundEngine.playClick();
    StorageService.updateDestinationAddress(conversation.id, newAddress.trim());
    setIsEditingAddress(false);
  };

  const unreadCount = conversation?.unreadForCustomer || 0;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            soundEngine.playClick();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#101015] hover:bg-black border border-white/15 hover:border-[#e82127] text-white shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(232,33,39,0.3)] transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#e82127] flex items-center justify-center text-white shadow-[0_0_15px_rgba(232,33,39,0.6)]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-black rounded-full animate-pulse" />
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>Chat With Admin</span>
              <span className="text-[10px] text-emerald-400 font-mono font-normal">Online</span>
            </div>
            <div className="text-[10px] font-mono text-neutral-400">
              Direct Sales & Destination Delivery
            </div>
          </div>

          {unreadCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-[#e82127] text-white text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Chat Drawer / Window */}
      {isOpen && (
        <div className="w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#0d0d12] border border-white/15 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(232,33,39,0.2)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#14141c] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#e82127]/20 border border-[#e82127]/50 flex items-center justify-center text-[#e82127]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#14141c] rounded-full" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white uppercase flex items-center gap-1.5">
                  <span>Tesla Sales Admin</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Seller</span>
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                  <PhoneCall className="w-3 h-3 text-[#e82127]" />
                  <span>+1 320-738-1283</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsOpen(false);
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Destination Address Bar */}
          <div className="px-4 py-2 bg-[#181822] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#e82127] flex-shrink-0" />
              <span className="text-neutral-400">Destination:</span>
              <span className="truncate font-semibold text-white">{conversation?.destinationAddress || 'Select address'}</span>
            </div>
            <button
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-[#e82127] hover:underline text-[10px] ml-2 flex-shrink-0"
            >
              {isEditingAddress ? 'Close' : 'Change'}
            </button>
          </div>

          {/* Inline Edit Address Form */}
          {isEditingAddress && (
            <form onSubmit={handleSaveAddress} className="p-3 bg-[#111118] border-b border-white/10 flex gap-2">
              <input
                type="text"
                required
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
                placeholder="Enter street address, city, state, zip..."
                className="flex-1 bg-[#181822] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#e82127] text-white text-xs font-mono font-bold uppercase"
              >
                Save
              </button>
            </form>
          )}

          {/* Quick Context Action: Attach currently viewed vehicle if any */}
          {currentVehicleContext && (
            <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Car className="w-3.5 h-3.5 text-[#e82127]" />
                <span className="text-xs text-neutral-300 truncate">Browsing: {currentVehicleContext.name}</span>
              </div>
              <button
                onClick={() => handleAttachVehicle(currentVehicleContext)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono uppercase tracking-wider flex-shrink-0"
              >
                Inquire About This Car
              </button>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {conversation?.messages.map((msg) => {
              const isAdmin = msg.sender === 'admin';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                >
                  <span className="text-[10px] font-mono text-neutral-500 mb-1 px-1">
                    {msg.senderName} &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 shadow-md ${
                      isAdmin
                        ? 'bg-[#181824] text-neutral-200 border border-white/10 rounded-tl-sm'
                        : 'bg-[#e82127] text-white font-medium rounded-tr-sm'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Attached Vehicle Card */}
                    {msg.vehicleContext && (
                      <div className="mt-3 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-3">
                        <img
                          src={msg.vehicleContext.image}
                          alt={msg.vehicleContext.name}
                          className="w-14 h-10 object-cover rounded-lg border border-white/10"
                        />
                        <div className="truncate">
                          <div className="font-heading font-bold text-white text-xs truncate">
                            {msg.vehicleContext.name}
                          </div>
                          <div className="font-mono text-[11px] text-[#e82127]">
                            ${msg.vehicleContext.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Official Admin Invoice Offer Card */}
                    {msg.invoiceOffer && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-black/80 border border-[#e82127]/50 space-y-2 text-neutral-200 font-mono">
                        <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                          <span className="text-[10px] uppercase text-[#e82127] font-bold">Official Sales Offer</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            msg.invoiceOffer.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {msg.invoiceOffer.status === 'paid' ? 'Deposit Paid ✓' : 'Payment Required'}
                          </span>
                        </div>

                        <div className="text-sm font-heading font-bold text-white">
                          {msg.invoiceOffer.vehicleName}
                        </div>

                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Total Purchase:</span>
                          <span className="text-white font-bold">${msg.invoiceOffer.totalPrice.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-[11px]">
                          <span className="text-neutral-400">Deposit Due:</span>
                          <span className="text-[#e82127] font-bold">${msg.invoiceOffer.depositRequired.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-[10px] text-neutral-400 border-t border-white/10 pt-1.5">
                          <span>Shipping Destination:</span>
                          <span className="text-white truncate max-w-[150px]">{msg.invoiceOffer.destinationAddress}</span>
                        </div>

                        {msg.invoiceOffer.status === 'pending' ? (
                          <button
                            onClick={() => handlePayInvoice(msg.id)}
                            className="w-full mt-2 py-2.5 rounded-xl bg-[#e82127] hover:bg-[#c9181e] text-white font-heading font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(232,33,39,0.4)] transition-all flex items-center justify-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Deposit (${msg.invoiceOffer.depositRequired.toLocaleString()})</span>
                          </button>
                        ) : (
                          <div className="mt-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Payment Received & Bull; Queued for Enclosed Dispatch</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Delivery & Tracking Banner if dispatched */}
          {conversation?.trackingNumber && (
            <div className="px-4 py-2 bg-emerald-950/40 border-t border-emerald-500/30 flex items-center justify-between text-[11px] font-mono text-emerald-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Tracking: {conversation.trackingNumber}</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-200">In Transit</span>
            </div>
          )}

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#121218] border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="Ask admin about price, destination, delivery..."
              className="flex-1 bg-[#181822] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#e82127]"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-2.5 rounded-2xl bg-[#e82127] hover:bg-[#c9181e] disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
