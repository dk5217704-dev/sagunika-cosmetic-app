import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
  Sparkles,
  Lock,
  Store,
  Calendar,
  Clock,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  Navigation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Address, CartItem, Order, PaymentRecord, ScreenName, StoreSettings } from '../../types';
import { GoogleMapsRadiusPicker } from '../GoogleMapsRadiusPicker';
import { RazorpayModal } from '../RazorpayModal';
import { firestoreRepo, calculateDistanceKm } from '../../services/firebase';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  addresses: Address[];
  discountAmount: number;
  appliedCoupon: string;
  storeSettings: StoreSettings;
  onPlaceOrder: (order: Order, paymentRecord?: PaymentRecord) => void;
  onPaymentFailed?: (order: Order, paymentRecord: PaymentRecord) => void;
  onNavigate: (screen: ScreenName) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  addresses,
  discountAmount,
  appliedCoupon,
  storeSettings,
  onPlaceOrder,
  onPaymentFailed,
  onNavigate,
}) => {
  // Fulfillment Type: Doorstep Delivery vs Store Pickup (Feature 8)
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');

  // Address & Google Maps Distance State (Feature 7)
  const [currentAddress, setCurrentAddress] = useState<Address>(
    addresses[0] || {
      id: 'addr-default',
      fullName: 'Ananya Sharma',
      phone: '+91 98765 43210',
      street: 'Plot 12, Lane 7, Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      latitude: 18.5378,
      longitude: 73.8965,
      distanceKm: 0.8,
      isDefault: true,
    }
  );

  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number>(
    currentAddress.distanceKm ||
      calculateDistanceKm(
        storeSettings.latitude,
        storeSettings.longitude,
        currentAddress.latitude || 18.5378,
        currentAddress.longitude || 73.8965
      )
  );

  const isDeliveryEligible = deliveryDistanceKm <= storeSettings.deliveryRadiusKm;

  // Store Pickup Slot
  const [pickupDate, setPickupDate] = useState<'today' | 'tomorrow' | 'day_after'>('today');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('04:00 PM – 06:00 PM');

  // Shipping Method
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment Method & Razorpay State (Feature 6)
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card' | 'cod'>('razorpay');
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState(() => `ord-${Date.now()}`);

  // Calculations
  const subtotal = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  // Delivery fee is 0 for store pickup or over threshold
  const deliveryFee =
    fulfillmentType === 'pickup'
      ? 0
      : deliveryMethod === 'express'
      ? storeSettings.expressDeliveryFee
      : subtotal >= storeSettings.freeDeliveryThreshold
      ? 0
      : storeSettings.standardDeliveryFee;

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  // Handle Google Maps Location change
  const handleAddressSelect = (addr: Address, distance: number, eligible: boolean) => {
    setCurrentAddress(addr);
    setDeliveryDistanceKm(distance);
  };

  // Trigger Place Order Flow
  const handleInitiateOrder = () => {
    // If delivery chosen but outside 10 KM radius, prevent and alert
    if (fulfillmentType === 'delivery' && !isDeliveryEligible) {
      alert(
        `Address is ${deliveryDistanceKm} KM away, exceeding our ${storeSettings.deliveryRadiusKm} KM delivery limit. Please switch to Store Pickup or choose an address within ${storeSettings.deliveryRadiusKm} KM.`
      );
      return;
    }

    const orderNumber = `SG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrdId = `ord-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    setConfirmedOrderNumber(orderNumber);
    setCurrentOrderId(newOrdId);

    // If online payment, open Razorpay Modal
    if (paymentMethod === 'razorpay' || paymentMethod === 'upi' || paymentMethod === 'card') {
      setIsRazorpayModalOpen(true);
      return;
    }

    // Otherwise Cash on Delivery
    finalizeOrder(orderNumber, 'cod', 'pending', undefined, undefined, newOrdId);
  };

  // Finalize order into Firestore
  const finalizeOrder = (
    orderNum: string,
    method: 'razorpay' | 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod',
    payStatus: 'paid' | 'pending',
    razorpayPmtId?: string,
    subMethod?: string,
    explicitOrderId?: string
  ) => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);

      const resolvedOrderId = explicitOrderId || currentOrderId || `ord-${Date.now()}`;

      const paymentRecord: PaymentRecord = {
        id: razorpayPmtId || `pay_sg_${Date.now().toString().slice(-6)}`,
        orderId: resolvedOrderId,
        orderNumber: orderNum,
        amount: total,
        currency: 'INR',
        paymentMethod: method === 'cod' ? 'cod' : method,
        paymentSubMethod: subMethod || (method === 'cod' ? 'Cash on Delivery' : 'Razorpay VIP Instant'),
        status: payStatus === 'paid' ? 'captured' : 'pending',
        razorpayPaymentId: razorpayPmtId,
        invoiceNumber: `SG-INV-${orderNum.replace(/[^0-9]/g, '') || '202601'}`,
        customerId: 'user-patron-01',
        customerEmail: 'ananya.sharma@example.com',
        customerPhone: currentAddress.phone,
        timestamp: new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Record payment transaction into Firestore
      firestoreRepo.recordPayment(paymentRecord);

      const newOrder: Order = {
        id: resolvedOrderId,
        orderNumber: orderNum,
        createdAt: 'Just now',
        status: 'confirmed',
        items: [...cartItems],
        subtotal,
        discount: discountAmount,
        deliveryFee,
        total,
        deliveryType: fulfillmentType,
        shippingAddress: currentAddress,
        distanceKm: deliveryDistanceKm,
        pickupSlot:
          fulfillmentType === 'pickup'
            ? {
                date: pickupDate === 'today' ? 'Today' : pickupDate === 'tomorrow' ? 'Tomorrow' : 'In 2 Days',
                time: pickupTimeSlot,
              }
            : undefined,
        paymentMethod: method === 'netbanking' || method === 'wallet' ? 'razorpay' : (method as any),
        paymentStatus: payStatus,
        razorpayPaymentId: razorpayPmtId,
        estimatedDelivery:
          fulfillmentType === 'pickup'
            ? `Ready for Studio Pickup (${pickupDate === 'today' ? 'Today' : 'Tomorrow'} ${pickupTimeSlot})`
            : deliveryMethod === 'express'
            ? 'Guaranteed Tomorrow by 2 PM'
            : '2-3 Business Days',
        trackingSteps: [
          {
            title: 'Order Confirmed',
            date: 'Just now',
            completed: true,
            current: true,
            description: `Payment captured via Razorpay (${subMethod || method.toUpperCase()}). Order processing at Sagunika Studio.`,
          },
          {
            title: fulfillmentType === 'pickup' ? 'Handcrafted & Staged at Studio' : 'Handcrafted Packaging',
            date: 'Pending',
            completed: false,
            current: false,
            description:
              fulfillmentType === 'pickup'
                ? 'Packaged in ceremonial gift box ready at Koregaon Park Concierge.'
                : 'Packaged in signature rose gold box.',
          },
          {
            title: fulfillmentType === 'pickup' ? 'Ready for Customer Pickup' : 'Dispatched via BlueDart Air',
            date: 'Pending',
            completed: false,
            current: false,
            description:
              fulfillmentType === 'pickup'
                ? 'Show your Order ID at Lane 5 Koregaon Park Studio.'
                : 'Tracking details will be synced live with your app.',
          },
          {
            title: fulfillmentType === 'pickup' ? 'Collected at Studio' : 'Delivered to Doorstep',
            date: 'Pending',
            completed: false,
            current: false,
            description: 'Enjoy your Sagunika luxury radiance!',
          },
        ],
      };

      setTimeout(() => {
        onPlaceOrder(newOrder, paymentRecord);
      }, 1200);
    }, 600);
  };

  const handlePaymentFailure = (orderNum: string, reason: string, errCode: string) => {
    const resolvedOrderId = currentOrderId || `ord-${Date.now()}`;
    const failedPayment: PaymentRecord = {
      id: `pay_failed_${Date.now().toString().slice(-6)}`,
      orderId: resolvedOrderId,
      orderNumber: orderNum,
      amount: total,
      currency: 'INR',
      paymentMethod: 'razorpay',
      paymentSubMethod: 'Razorpay Gateway',
      status: 'failed',
      failureReason: reason,
      errorCode: errCode,
      razorpayPaymentId: `pay_failed_${Date.now().toString().slice(-6)}`,
      customerId: 'user-patron-01',
      customerEmail: 'ananya.sharma@example.com',
      customerPhone: currentAddress.phone,
      timestamp: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    firestoreRepo.recordPayment(failedPayment);

    const pendingOrder: Order = {
      id: resolvedOrderId,
      orderNumber: orderNum,
      createdAt: 'Just now',
      status: 'confirmed',
      items: [...cartItems],
      subtotal,
      discount: discountAmount,
      deliveryFee,
      total,
      deliveryType: fulfillmentType,
      shippingAddress: currentAddress,
      distanceKm: deliveryDistanceKm,
      pickupSlot:
        fulfillmentType === 'pickup'
          ? {
              date: pickupDate === 'today' ? 'Today' : pickupDate === 'tomorrow' ? 'Tomorrow' : 'In 2 Days',
              time: pickupTimeSlot,
            }
          : undefined,
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
      estimatedDelivery: 'Pending Payment Authorization',
      trackingSteps: [],
    };

    if (onPaymentFailed) {
      onPaymentFailed(pendingOrder, failedPayment);
    }
  };

  // Success Screen
  if (orderSuccess) {
    return (
      <div className="min-h-[640px] h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#FAF8F9] to-white text-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF0F3] border-2 border-[#B76E79] flex items-center justify-center text-[#B76E79] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="mt-4 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-[#B76E79] uppercase">
            Order #{confirmedOrderNumber} Confirmed
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#4A154B]">
            Order Authorized & Recorded
          </h2>
          <p className="text-xs text-gray-500 max-w-xs">
            {fulfillmentType === 'pickup'
              ? `Your items are being staged at Sagunika Studio (Koregaon Park Pune) for pickup (${pickupTimeSlot}).`
              : `Your luxury parcel is being dispatched via express logistics. Delivery address verified within ${storeSettings.deliveryRadiusKm} KM.`}
          </p>
        </div>

        <div className="mt-5 p-4 rounded-xl bg-white border border-[#E8D5C4] max-w-xs w-full text-left space-y-1.5 text-xs shadow-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Total:</span>
            <span className="font-bold text-[#4A154B]">₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Fulfillment:</span>
            <span className="font-bold text-gray-800">
              {fulfillmentType === 'pickup' ? 'Store Pickup (Koregaon Park)' : 'Doorstep Courier'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment:</span>
            <span className="font-bold text-emerald-600">
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid via Razorpay'}
            </span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-[#B76E79] font-medium">
          Redirecting to Live Order Tracking...
        </p>
      </div>
    );
  }

  return (
    <div id="screen-checkout" className="pb-36 bg-[#FAF8F9] min-h-screen text-gray-900">
      {/* Top Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <button
          onClick={() => onNavigate('cart')}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="font-serif text-base font-bold text-[#4A154B]">
            Checkout & Fulfillment
          </h2>
          <span className="text-[10px] text-[#B76E79] font-semibold flex items-center justify-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>256-Bit Razorpay Encrypted</span>
          </span>
        </div>

        <div className="w-8" />
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================= */}
        {/* FULFILLMENT MODE: DOORSTEP DELIVERY VS STORE PICKUP (Feature 8) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#E8D5C4] p-1.5 shadow-2xs">
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setFulfillmentType('delivery')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                fulfillmentType === 'delivery'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Doorstep Delivery</span>
            </button>

            <button
              type="button"
              onClick={() => setFulfillmentType('pickup')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                fulfillmentType === 'pickup'
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Store Pickup (Free)</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODE A: DOORSTEP DELIVERY WITH GOOGLE MAPS 10 KM CHECK (Feature 7) */}
        {/* ========================================================= */}
        {fulfillmentType === 'delivery' ? (
          <div className="space-y-4">
            {/* Google Maps Delivery Verification Component */}
            <GoogleMapsRadiusPicker
              storeSettings={storeSettings}
              selectedAddress={currentAddress}
              onAddressSelect={handleAddressSelect}
            />

            {/* Delivery Speed Options */}
            <div className="bg-white rounded-2xl border border-[#E8D5C4]/60 p-4 shadow-2xs space-y-3">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#4A154B]" />
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                  Shipping Courier Speed
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('standard')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-[#4A154B] bg-[#F3EAF4] ring-1 ring-[#4A154B]'
                      : 'border-[#E8D5C4] bg-white'
                  }`}
                >
                  <span className="text-xs font-bold text-gray-900 block">Standard Courier</span>
                  <span className="text-[10px] text-gray-500 block">2-3 Business Days</span>
                  <span className="text-[11px] font-extrabold text-[#B76E79] mt-1 block">
                    {subtotal >= storeSettings.freeDeliveryThreshold
                      ? 'FREE'
                      : `₹${storeSettings.standardDeliveryFee}`}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod('express')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-[#B76E79] bg-[#FAF0F3] ring-1 ring-[#B76E79]'
                      : 'border-[#E8D5C4] bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-[#B76E79]" />
                    <span className="text-xs font-bold text-[#4A154B]">VIP Express</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">Guaranteed Tomorrow</span>
                  <span className="text-[11px] font-extrabold text-[#4A154B] mt-1 block">
                    ₹{storeSettings.expressDeliveryFee}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* MODE B: STORE PICKUP AT SAGUNIKA STUDIO (Feature 8) */
          /* ========================================================= */
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-4 shadow-2xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF0F3] text-[#4A154B] flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    Sagunika Cosmetic Studio
                  </h3>
                  <p className="text-[10px] text-gray-500">{storeSettings.address}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                FREE PICKUP
              </span>
            </div>

            {/* Studio Hours & Pickup Details */}
            <div className="p-3 bg-[#FAF8F9] rounded-xl border border-[#E8D5C4]/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>Studio Hours:</span>
                </span>
                <strong className="text-gray-900">{storeSettings.openingHours}</strong>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-600">
                <span className="flex items-center space-x-1">
                  <Navigation className="w-3.5 h-3.5 text-[#4A154B]" />
                  <span>Location:</span>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${storeSettings.latitude},${storeSettings.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#4A154B] flex items-center space-x-0.5 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Slot Selectors */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 block">
                Select Pickup Day:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'today', label: 'Today', sub: 'Ready in 2h' },
                  { id: 'tomorrow', label: 'Tomorrow', sub: 'Anytime' },
                  { id: 'day_after', label: 'In 2 Days', sub: 'Reserved' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setPickupDate(d.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      pickupDate === d.id
                        ? 'border-[#4A154B] bg-[#FAF0F3] ring-1 ring-[#4A154B]'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs text-gray-900 block">{d.label}</span>
                    <span className="text-[10px] text-[#B76E79] block">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Selectors */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 block">
                Select Preferred Time Slot:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  '11:00 AM – 01:00 PM',
                  '02:00 PM – 04:00 PM',
                  '04:00 PM – 06:00 PM',
                  '06:30 PM – 08:30 PM',
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setPickupTimeSlot(slot)}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      pickupTimeSlot === slot
                        ? 'border-[#4A154B] bg-[#4A154B] text-white font-bold'
                        : 'border-gray-200 bg-gray-50 text-gray-700'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* PAYMENT METHODS (Feature 6: RAZORPAY GATEWAY) */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#E8D5C4]/60 p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#B76E79]" />
              <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                Payment Option
              </h3>
            </div>
            <span className="text-[10px] font-mono text-gray-400">
              Razorpay Secured
            </span>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'razorpay',
                title: 'Razorpay VIP Gateway (Instant)',
                desc: 'Google Pay, PhonePe, UPI QR, Credit/Debit Cards & Netbanking',
                badge: 'Recommended',
              },
              {
                id: 'cod',
                title: fulfillmentType === 'pickup' ? 'Pay at Studio Counter' : 'Cash / UPI on Delivery',
                desc:
                  fulfillmentType === 'pickup'
                    ? 'Pay via Card or Cash at Sagunika Studio Concierge'
                    : 'Pay when parcel arrives at your doorstep',
              },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === method.id
                    ? 'border-[#4A154B] bg-[#F3EAF4] ring-1 ring-[#4A154B]'
                    : 'border-[#E8D5C4] bg-white hover:bg-[#FAF8F9]'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-900">{method.title}</span>
                    {method.badge && (
                      <span className="text-[9px] bg-[#FAF0F3] text-[#B76E79] px-2 py-0.5 rounded-full font-bold border border-[#E8B4B8]/40">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{method.desc}</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === method.id}
                  onChange={() => setPaymentMethod(method.id as any)}
                  className="accent-[#4A154B]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ORDER SUMMARY */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-[#E8D5C4]/60 p-4 shadow-2xs space-y-2 text-xs">
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
            Price Summary ({cartItems.length} items)
          </h4>

          <div className="space-y-1.5 text-gray-600 divide-y divide-gray-100">
            <div className="flex justify-between pt-1">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between pt-1 text-emerald-600">
                <span>Coupon Savings ({appliedCoupon})</span>
                <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between pt-1">
              <span>
                {fulfillmentType === 'pickup'
                  ? 'Store Pickup Fee'
                  : `Courier Delivery (${deliveryDistanceKm} KM)`}
              </span>
              <span className="font-semibold text-gray-900">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-sm font-bold text-[#4A154B]">
              <span>Final Grand Total</span>
              <span className="text-base font-extrabold font-mono">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FLOATING ACTION BOTTOM BAR */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E8D5C4] px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(74,21,75,0.12)]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-medium">
              Grand Total
            </span>
            <span className="text-lg font-extrabold text-[#4A154B] font-mono">
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            id="btn-confirm-checkout-action"
            onClick={handleInitiateOrder}
            disabled={isProcessing || (fulfillmentType === 'delivery' && !isDeliveryEligible)}
            className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : fulfillmentType === 'delivery' && !isDeliveryEligible ? (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-300" />
                <span>Outside 10 KM Limit</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>
                  {paymentMethod === 'razorpay'
                    ? `Pay ₹${total.toLocaleString('en-IN')} via Razorpay`
                    : 'Confirm Order'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RAZORPAY GATEWAY MODAL (Feature 6) */}
      {/* ========================================================= */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        orderNumber={confirmedOrderNumber}
        orderId={currentOrderId}
        amount={total}
        customerName={currentAddress.fullName}
        customerEmail="ananya.sharma@example.com"
        customerPhone={currentAddress.phone}
        storeSettings={storeSettings}
        onClose={() => setIsRazorpayModalOpen(false)}
        onSuccess={(pmtId, pMethod, subMethod) => {
          setIsRazorpayModalOpen(false);
          finalizeOrder(confirmedOrderNumber, pMethod, 'paid', pmtId, subMethod);
        }}
        onFailure={(reason, errorCode) => {
          setIsRazorpayModalOpen(false);
          handlePaymentFailure(confirmedOrderNumber, reason, errorCode);
        }}
      />
    </div>
  );
};
