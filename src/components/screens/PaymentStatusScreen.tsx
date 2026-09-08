import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  ArrowRight,
  CreditCard,
  Building2,
  AlertTriangle,
  MessageCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Order, PaymentRecord, ScreenName, StoreSettings } from '../../types';

interface PaymentStatusScreenProps {
  status: 'success' | 'failure';
  order: Order | null;
  paymentRecord: PaymentRecord | null;
  storeSettings: StoreSettings;
  onNavigate: (screen: ScreenName) => void;
  onOpenInvoice: (order: Order) => void;
  onRetryPayment?: () => void;
  onSwitchToCod?: () => void;
}

export const PaymentStatusScreen: React.FC<PaymentStatusScreenProps> = ({
  status,
  order,
  paymentRecord,
  storeSettings,
  onNavigate,
  onOpenInvoice,
  onRetryPayment,
  onSwitchToCod,
}) => {
  useEffect(() => {
    if (status === 'success') {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#B76E79', '#4A154B', '#10B981', '#E8D5C4', '#FBBF24'],
        });
      } catch (e) {
        // Fallback
      }
    }
  }, [status]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard: ${text}`);
  };

  const openWhatsApp = () => {
    const cleanPhone = (storeSettings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello Sagunika Concierge! 🌸 I encountered an issue while completing payment for Order #${order?.orderNumber || 'New'}. Could you assist me?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  // SUCCESS STATE
  if (status === 'success' && order) {
    return (
      <div id="screen-payment-success" className="min-h-screen bg-[#FAF8F9] pb-32 text-gray-900">
        {/* Top Header */}
        <div className="bg-gradient-to-b from-[#FAF0F3] via-white to-[#FAF8F9] border-b border-[#E8D5C4]/60 px-4 pt-8 pb-6 text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-lg mx-auto">
              <CheckCircle2 className="w-10 h-10 animate-in zoom-in-50 duration-300" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#4A154B] text-white p-1.5 rounded-full shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#E8B4B8]" />
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 inline-block">
              Payment Captured & Verified
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#4A154B]">
              Order #{order.orderNumber} Confirmed!
            </h1>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Thank you for choosing Sagunika. Your bespoke luxury items are now being prepared at our Koregaon Park Studio.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-4">
          {/* Razorpay Transaction Card */}
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#0C2340] text-white flex items-center justify-center font-bold text-xs font-serif">
                  R
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Razorpay Payment Receipt</span>
                  <span className="text-[10px] text-gray-400">256-Bit SSL Gateway Authorization</span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-[#4A154B] font-mono">
                ₹{order.total.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="space-y-2 text-xs divide-y divide-gray-50">
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500">Razorpay Payment ID:</span>
                <div className="flex items-center space-x-1.5 font-mono text-gray-800 font-bold">
                  <span>{paymentRecord?.razorpayPaymentId || order.razorpayPaymentId || `pay_sg_${order.orderNumber}`}</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        paymentRecord?.razorpayPaymentId || order.razorpayPaymentId || `pay_sg_${order.orderNumber}`,
                        'Payment ID'
                      )
                    }
                    className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500">Payment Mode:</span>
                <span className="font-semibold text-gray-800 capitalize">
                  {paymentRecord?.paymentSubMethod || order.paymentMethod.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500">Payment Date & Time:</span>
                <span className="text-gray-700 font-medium">
                  {paymentRecord?.timestamp || 'Just now (Synced)'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-500">Fulfillment Type:</span>
                <span className="font-bold text-[#4A154B]">
                  {order.deliveryType === 'pickup' ? 'Store Pickup (Koregaon Park)' : 'Doorstep Courier Express'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="btn-view-tax-invoice-success"
              type="button"
              onClick={() => onOpenInvoice(order)}
              className="p-3.5 rounded-xl bg-white border border-[#E8D5C4] hover:border-[#B76E79] shadow-2xs flex flex-col items-center justify-center text-center space-y-1 transition-all group"
            >
              <FileText className="w-5 h-5 text-[#B76E79] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-800">GST Tax Invoice</span>
              <span className="text-[10px] text-gray-400">View & Download</span>
            </button>

            <button
              id="btn-track-order-success"
              type="button"
              onClick={() => onNavigate('orders')}
              className="p-3.5 rounded-xl bg-white border border-[#E8D5C4] hover:border-[#4A154B] shadow-2xs flex flex-col items-center justify-center text-center space-y-1 transition-all group"
            >
              <Truck className="w-5 h-5 text-[#4A154B] group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-800">Track Shipment</span>
              <span className="text-[10px] text-gray-400">Live Delivery Tracker</span>
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-[#FAF0F3] rounded-2xl border border-[#E8B4B8]/50 p-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#4A154B]">
              <Sparkles className="w-4 h-4 text-[#B76E79]" />
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Sagunika Concierge Note
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed text-[11px]">
              A confirmation email and SMS with your live tracking URL have been dispatched. Your invoice is also stored securely under your account's Payment History.
            </p>
          </div>

          {/* Footer Navigation Buttons */}
          <div className="space-y-2 pt-2">
            <button
              id="btn-go-payment-history"
              type="button"
              onClick={() => onNavigate('payment_history')}
              className="w-full py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center space-x-2 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>View All Payment History</span>
            </button>

            <button
              id="btn-continue-shopping"
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full py-3.5 px-4 rounded-xl bg-[#4A154B] text-white font-bold text-xs hover:bg-[#67226B] shadow-md flex items-center justify-center space-x-2 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // FAILURE STATE
  return (
    <div id="screen-payment-failure" className="min-h-screen bg-[#FAF8F9] pb-32 text-gray-900">
      {/* Top Header */}
      <div className="bg-gradient-to-b from-rose-50 via-white to-[#FAF8F9] border-b border-rose-200 px-4 pt-8 pb-6 text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-500 flex items-center justify-center text-rose-600 shadow-lg mx-auto">
            <XCircle className="w-10 h-10 animate-in zoom-in-50 duration-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1.5 rounded-full shadow-md">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 inline-block">
            Payment Incomplete
          </span>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Payment Failed or Declined</h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            We could not complete your transaction via Razorpay. Your cart items and order selections remain saved safely.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Diagnostic Card */}
        <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-rose-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold">Transaction Diagnostic Details</span>
            </div>
            <span className="text-[10px] font-mono bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200">
              {paymentRecord?.errorCode || 'GATEWAY_ERROR'}
            </span>
          </div>

          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200/80 text-xs text-rose-900 space-y-1">
            <span className="font-bold block">Reason:</span>
            <p className="text-[11px] leading-relaxed text-rose-800">
              {paymentRecord?.failureReason ||
                'The transaction was declined by the bank or cancelled. If your account was debited, the amount will be automatically refunded by Razorpay within 2-4 business days.'}
            </p>
          </div>

          <div className="space-y-2 text-xs divide-y divide-gray-50 pt-1">
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Order Reference:</span>
              <span className="font-mono font-bold text-gray-800">#{order?.orderNumber || 'SG-PENDING'}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500">Attempted Amount:</span>
              <span className="font-bold text-gray-900 font-mono">
                ₹{(order?.total || 0).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-500">Gateway Session:</span>
              <span className="font-mono text-gray-600 text-[11px]">
                {paymentRecord?.razorpayPaymentId || `pay_failed_${Date.now().toString().slice(-6)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-2.5">
          {onRetryPayment && (
            <button
              id="btn-retry-payment-razorpay"
              type="button"
              onClick={onRetryPayment}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Payment with Razorpay</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onNavigate('checkout')}
              className="py-3 px-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span>Change Method</span>
            </button>

            {onSwitchToCod && (
              <button
                type="button"
                onClick={onSwitchToCod}
                className="py-3 px-3 rounded-xl bg-white border border-[#4A154B] text-[#4A154B] font-bold text-xs hover:bg-[#FAF0F3] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Switch to COD / Pickup</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 flex items-center justify-center space-x-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat with Concierge for Instant Help</span>
          </button>
        </div>

        {/* View Payment History button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => onNavigate('payment_history')}
            className="text-xs text-gray-500 hover:text-[#4A154B] font-medium underline"
          >
            Review all previous transactions in Payment History
          </button>
        </div>
      </div>
    </div>
  );
};
