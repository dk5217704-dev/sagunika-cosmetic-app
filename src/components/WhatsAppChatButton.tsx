import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Store, ShieldCheck, ChevronRight } from 'lucide-react';
import { StoreSettings } from '../types';

interface WhatsAppChatButtonProps {
  storeSettings: StoreSettings;
  orderNumber?: string;
  productName?: string;
}

export const WhatsAppChatButton: React.FC<WhatsAppChatButtonProps> = ({
  storeSettings,
  orderNumber,
  productName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const cleanPhone = (storeSettings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');

  const openWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    openWhatsApp(customMsg.trim());
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Concierge Chat Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#E8D5C4] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-xs tracking-wide">Sagunika VIP Concierge</span>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <p className="text-[10px] text-white/90">Official WhatsApp Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Quick Options */}
          <div className="p-3 bg-[#FAF8F9] space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Instant Concierge Prompts:
            </span>

            {/* Prompt 1: Bridal Stylist */}
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  `Namaste Sagunika Studio! 🌸 I would like a complimentary consultation for Bridal Trousseau vanity kits and ceremonial shades.`
                )
              }
              className="w-full text-left p-2 rounded-xl bg-white border border-[#E8D5C4]/70 hover:border-[#4A154B] transition-colors flex items-center justify-between text-xs group"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                <span className="font-semibold text-gray-800 text-[11px]">
                  Bridal & Wedding Consultation
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4A154B]" />
            </button>

            {/* Prompt 2: Store Pickup & Studio */}
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  `Hello! I would like to inquire about same-day Store Pickup at Sagunika Studio, Koregaon Park Pune.`
                )
              }
              className="w-full text-left p-2 rounded-xl bg-white border border-[#E8D5C4]/70 hover:border-[#4A154B] transition-colors flex items-center justify-between text-xs group"
            >
              <div className="flex items-center space-x-2">
                <Store className="w-3.5 h-3.5 text-[#4A154B]" />
                <span className="font-semibold text-gray-800 text-[11px]">
                  Koregaon Park Studio Availability
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#4A154B]" />
            </button>

            {/* Prompt 3: Order Enquiry (if active) */}
            {orderNumber && (
              <button
                type="button"
                onClick={() =>
                  openWhatsApp(
                    `Hi, I need assistance regarding my recent order #${orderNumber} placed on Sagunika app.`
                  )
                }
                className="w-full text-left p-2 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/60 hover:border-[#B76E79] transition-colors flex items-center justify-between text-xs group"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span className="font-semibold text-[#4A154B] text-[11px]">
                    Track Order #{orderNumber}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#B76E79]" />
              </button>
            )}

            {/* Custom Input */}
            <form onSubmit={handleSendCustom} className="pt-1 flex items-center gap-1.5">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your luxury inquiry..."
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#25D366] outline-hidden"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white transition-colors"
                title="Send to WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        id="btn-floating-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] flex items-center justify-center transition-all transform active:scale-95 relative group ring-4 ring-white"
        title="Chat with Sagunika on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />

        {/* Pulsing indicator aura */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white" />
      </button>
    </div>
  );
};
