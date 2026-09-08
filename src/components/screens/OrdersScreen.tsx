import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw,
  Sparkles,
  Store,
  MessageCircle,
  MapPin,
  ExternalLink,
  CreditCard,
  X,
  AlertTriangle,
  RefreshCw,
  Bell,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Check
} from 'lucide-react';
import { Order, OrderStatus, ScreenName, StoreSettings, FCMNotification } from '../../types';
import { OrderShipmentTracker } from '../OrderShipmentTracker';
import { firestoreRepo } from '../../services/firebase';

interface OrdersScreenProps {
  orders: Order[];
  storeSettings: StoreSettings;
  onNavigate: (screen: ScreenName) => void;
  onReorder: (order: Order) => void;
  onOpenInvoice?: (order: Order) => void;
  onUpdateOrders?: (orders: Order[]) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  storeSettings,
  onNavigate,
  onReorder,
  onOpenInvoice,
  onUpdateOrders,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'refunds'>('active');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    orders[0]?.id || null
  );

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('Ordered incorrect cosmetic shade / variant');
  const [cancelNotes, setCancelNotes] = useState('');

  // Return Modal State
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Shade mismatch with bridal attire');
  const [returnNotes, setReturnNotes] = useState('');
  const [returnPickupDate, setReturnPickupDate] = useState('Tomorrow (10:00 AM – 02:00 PM)');

  // Refund Detail Modal State
  const [viewingRefundOrder, setViewingRefundOrder] = useState<Order | null>(null);

  // Notification Log Modal State
  const [notificationLogOrder, setNotificationLogOrder] = useState<Order | null>(null);
  const [notificationSentToast, setNotificationSentToast] = useState<string | null>(null);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    let milestoneTitle = 'Status Updated';
    let milestoneDesc = `Order updated to ${newStatus}.`;

    if (newStatus === 'packed') {
      milestoneTitle = 'Handcrafted in Gift Packaging';
      milestoneDesc = 'Enclosed in rose-gold bespoke packaging at Sagunika Studio.';
    } else if (newStatus === 'shipped') {
      milestoneTitle = 'Dispatched via BlueDart Air';
      milestoneDesc = 'Parcel handed over to logistics courier partner.';
    } else if (newStatus === 'out_for_delivery') {
      milestoneTitle = 'Out for VIP Delivery';
      milestoneDesc = 'Sagunika delivery concierge is en route to customer destination.';
    } else if (newStatus === 'delivered') {
      milestoneTitle = 'Order Delivered Successfully';
      milestoneDesc = 'Parcel received by customer with digital confirmation.';
    }

    const updated = firestoreRepo.updateOrderStatus(orderId, newStatus, milestoneTitle, milestoneDesc);
    if (onUpdateOrders) {
      onUpdateOrders(updated);
    }
  };

  // Process Cancellation
  const handleConfirmCancellation = () => {
    if (!cancellingOrder) return;
    const fullReason = cancelNotes.trim() ? `${cancelReason} - ${cancelNotes.trim()}` : cancelReason;
    const updated = firestoreRepo.cancelOrder(cancellingOrder.id, fullReason);
    if (onUpdateOrders) {
      onUpdateOrders(updated);
    }
    setCancellingOrder(null);
    setCancelNotes('');
    setNotificationSentToast(`Order #${cancellingOrder.orderNumber} cancelled. Refund tracking updated.`);
    setTimeout(() => setNotificationSentToast(null), 3500);
  };

  // Process Return Request
  const handleConfirmReturn = () => {
    if (!returningOrder) return;
    const updated = firestoreRepo.requestReturn(returningOrder.id, {
      reason: returnReason,
      detailedNotes: returnNotes.trim() || undefined,
      pickupDate: returnPickupDate
    });
    if (onUpdateOrders) {
      onUpdateOrders(updated);
    }
    setReturningOrder(null);
    setReturnNotes('');
    setNotificationSentToast(`Return requested for #${returningOrder.orderNumber}. BlueDart pickup scheduled.`);
    setTimeout(() => setNotificationSentToast(null), 3500);
  };

  // Toggle order notification alert
  const handleToggleNotifications = (orderId: string, currentVal: boolean = true) => {
    const newVal = !currentVal;
    const updated = firestoreRepo.toggleOrderNotifications(orderId, newVal);
    if (onUpdateOrders) {
      onUpdateOrders(updated);
    }
    setNotificationSentToast(
      newVal ? '✓ Live shipment alerts activated (SMS & WhatsApp).' : 'Shipment notifications paused.'
    );
    setTimeout(() => setNotificationSentToast(null), 3000);
  };

  // Trigger test delivery notification
  const handleSendTestNotification = (order: Order) => {
    const notif: FCMNotification = {
      id: `notif-order-${Date.now()}`,
      title: `📦 Update: Order #${order.orderNumber}`,
      body: `BlueDart Air Tracking: Package is currently in Pune hub, scheduled delivery: ${order.estimatedDelivery}.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      targetScreen: 'orders'
    };
    firestoreRepo.addNotification(notif);
    setNotificationSentToast(`FCM Alert pushed for Order #${order.orderNumber}`);
    setTimeout(() => setNotificationSentToast(null), 3000);
  };

  const activeOrders = orders.filter(
    (o) => o.status !== 'delivered' && o.status !== 'cancelled' && o.status !== 'returned' && o.status !== 'refunded'
  );
  const completedOrders = orders.filter(
    (o) => o.status === 'delivered' || o.status === 'cancelled' || o.status === 'returned' || o.status === 'refunded'
  );
  const refundOrders = orders.filter((o) => o.refundDetails !== undefined || o.status === 'refunded');

  let displayedOrders = activeOrders;
  if (activeTab === 'completed') displayedOrders = completedOrders;
  if (activeTab === 'refunds') displayedOrders = refundOrders;

  const toggleExpand = (orderId: string) => {
    setExpandedOrderId((curr) => (curr === orderId ? null : orderId));
  };

  const openWhatsAppForOrder = (orderNum: string) => {
    const clean = (storeSettings.whatsappNumber || '919876543210').replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello Sagunika Studio Concierge! 🌸 I would like an update regarding my Order #${orderNum}.`
    );
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="screen-orders" className="pb-28 bg-[#FAF8F9] min-h-screen text-gray-900">
      {/* Toast Alert */}
      {notificationSentToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#4A154B] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center space-x-2 border border-[#B76E79]/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
          <span>{notificationSentToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3.5 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <div className="w-8" />
        <div className="text-center">
          <h2 className="font-serif text-base font-bold text-[#4A154B]">
            My Orders & Tracking
          </h2>
          <p className="text-[10px] text-gray-500 tracking-wide">
            Live BlueDart Logistics • Returns & Instant Refunds
          </p>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            id="btn-nav-payment-history"
            onClick={() => onNavigate('payment_history')}
            className="p-1.5 rounded-full text-[#4A154B] hover:bg-[#FAF0F3] transition-colors"
            title="Razorpay Payment History"
          >
            <CreditCard className="w-5 h-5" />
          </button>
          <button
            onClick={() => openWhatsAppForOrder('General')}
            className="p-1.5 rounded-full text-emerald-600 hover:bg-emerald-50"
            title="WhatsApp Concierge"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs: Active vs Past vs Refunds */}
      <div className="p-4 pb-2">
        <div className="flex rounded-xl bg-white border border-[#E8D5C4] p-1 shadow-2xs">
          <button
            id="tab-orders-active"
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'active'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Active ({activeOrders.length})
          </button>
          <button
            id="tab-orders-completed"
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Past ({completedOrders.length})
          </button>
          <button
            id="tab-orders-refunds"
            onClick={() => setActiveTab('refunds')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'refunds'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Refunds ({refundOrders.length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {displayedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center mt-6 space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] flex items-center justify-center text-[#B76E79]">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-base font-bold text-[#2D0C34]">
            {activeTab === 'active'
              ? 'No Orders in Transit'
              : activeTab === 'completed'
              ? 'No Completed Orders'
              : 'No Active Refunds'}
          </h3>
          <p className="text-xs text-gray-500 max-w-xs">
            {activeTab === 'active'
              ? 'You have no parcels currently in delivery. Discover our ceremonial bridal vault and sovereign groom chest.'
              : activeTab === 'completed'
              ? 'You have not completed any past orders yet.'
              : 'All your orders are in good standing with zero refund tickets open.'}
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-2 py-2.5 px-5 rounded-xl bg-[#4A154B] text-white text-xs font-bold shadow-xs hover:bg-[#67226B]"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3 pt-2">
          {displayedOrders.map((order, orderIdx) => {
            const isExpanded = expandedOrderId === order.id;
            const canCancel =
              order.status === 'confirmed' ||
              order.status === 'packed' ||
              order.status === 'shipped';
            const canReturn = order.status === 'delivered' && !order.returnDetails;
            const hasReturn = !!order.returnDetails;
            const hasRefund = !!order.refundDetails;
            const notifEnabled = order.notificationsEnabled !== false;

            return (
              <div
                key={`${order.id}-${orderIdx}`}
                id={`order-card-${order.id}`}
                className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-4 shadow-2xs space-y-3 transition-all"
              >
                {/* Order Top Bar */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-sm font-bold text-[#4A154B]">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : order.status === 'return_requested'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-[#FAF0F3] text-[#8C4A5A] border border-[#E8B4B8]/40'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      Placed on {order.createdAt} • {order.items.length} item(s)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-gray-900 block font-mono">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {order.paymentStatus === 'paid'
                        ? 'Paid via ' + order.paymentMethod.toUpperCase()
                        : 'Pending COD'}
                    </span>
                  </div>
                </div>

                {/* FEATURE 1: PROMINENT DELIVERY DATE & COURIER BADGE */}
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#FAF8F9] to-[#FDF5F7] border border-[#E8D5C4]/70 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-lg bg-white border border-[#E8D5C4] text-[#4A154B]">
                      <Calendar className="w-4 h-4 text-[#B76E79]" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">
                        {order.status === 'delivered' ? 'Delivered On' : 'Guaranteed Delivery Date'}
                      </span>
                      <span className="text-xs font-bold text-gray-900 block font-mono">
                        {order.deliveryDate || order.estimatedDelivery || 'Friday, 5 Sep 2026'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-200 block">
                      {order.status === 'delivered' ? 'Delivered' : 'On Schedule'}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-0.5">
                      BlueDart Air Express
                    </span>
                  </div>
                </div>

                {/* FEATURE 2: REFUND STATUS CALLOUT (If Refund exists) */}
                {hasRefund && order.refundDetails && (
                  <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-600 text-white">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-purple-900">
                            Refund {order.refundDetails.status.toUpperCase()}
                          </span>
                          <span className="text-[9px] font-mono bg-purple-200/70 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                            ₹{order.refundDetails.amount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-700 block">
                          Bank ARN: {order.refundDetails.bankReferenceNumber || 'ARN-90214812'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setViewingRefundOrder(order)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-purple-300 text-purple-800 font-bold text-[10px] hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      Track Refund
                    </button>
                  </div>
                )}

                {/* FEATURE 3: RETURN REQUEST STATUS CALLOUT (If Return is active) */}
                {hasReturn && order.returnDetails && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-500 text-white">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-amber-900 block">
                          Return Status: {order.returnDetails.status.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-amber-700 block">
                          Pickup Slot: {order.returnDetails.pickupDate || 'Tomorrow'} • Waybill #{order.returnDetails.trackingNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded font-bold">
                      Reverse Logistics
                    </span>
                  </div>
                )}

                {/* Fulfillment Type & Expand Header */}
                <div className="p-2 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-gray-700">
                    {order.deliveryType === 'pickup' ? (
                      <Store className="w-4 h-4 text-[#4A154B]" />
                    ) : (
                      <Truck className="w-4 h-4 text-[#B76E79]" />
                    )}
                    <span className="font-medium">
                      {order.deliveryType === 'pickup'
                        ? 'Studio Store Pickup (Koregaon Park Pune)'
                        : `Courier Logistics (${order.distanceKm || '3.5'} KM Zone)`}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleExpand(order.id)}
                    className="text-xs font-bold text-[#B76E79] flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <span>{isExpanded ? 'Collapse' : 'Track Live'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Items Preview */}
                <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="w-12 h-12 rounded-xl bg-[#FAF8F9] border border-gray-200 overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="text-xs text-gray-600 pl-2">
                    <p className="font-semibold line-clamp-1">{order.items[0]?.product.name}</p>
                    {order.items.length > 1 && (
                      <p className="text-[10px] text-gray-400">+{order.items.length - 1} other luxury item(s)</p>
                    )}
                  </div>
                </div>

                {/* Compact Real-Time Shipment Tracker (Collapsed view) */}
                {!isExpanded && (
                  <div className="pt-2 border-t border-[#E8D5C4]/50">
                    <OrderShipmentTracker
                      order={order}
                      compact={true}
                      onStatusChange={handleStatusChange}
                    />
                  </div>
                )}

                {/* Expanded Detailed View */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#EFE8ED] space-y-4">
                    {/* Full Real-Time Shipment Progress Visualization */}
                    <OrderShipmentTracker
                      order={order}
                      compact={false}
                      onStatusChange={handleStatusChange}
                    />

                    {/* Notification Controls for this Order */}
                    <div className="p-3 rounded-xl bg-white border border-[#E8D5C4] flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className={`w-4 h-4 ${notifEnabled ? 'text-[#4A154B]' : 'text-gray-400'}`} />
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">
                            Order Notifications (SMS & Push)
                          </span>
                          <span className="text-[10px] text-gray-500">
                            {notifEnabled ? 'Real-time BlueDart status alerts active' : 'Notifications paused'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSendTestNotification(order)}
                          className="px-2 py-1 rounded-lg bg-[#FAF0F3] hover:bg-[#F3E5EB] text-[#4A154B] text-[10px] font-bold border border-[#E8B4B8] transition-colors"
                          title="Simulate FCM Alert"
                        >
                          Simulate Alert
                        </button>
                        <button
                          onClick={() => handleToggleNotifications(order.id, notifEnabled)}
                          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                            notifEnabled ? 'bg-[#4A154B]' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-0.5 ${
                              notifEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Stepper Timeline */}
                    <div className="flex items-center justify-between pt-1">
                      <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                        Live Milestone Dispatch Log
                      </h4>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Firestore Realtime Sync
                      </span>
                    </div>

                    <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8D5C4]">
                      {order.trackingSteps.map((step, sIdx) => (
                        <div key={sIdx} className="relative">
                          <div
                            className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white ${
                              step.completed
                                ? 'bg-[#4A154B] text-white'
                                : step.current
                                ? 'bg-[#B76E79] text-white animate-pulse'
                                : 'bg-gray-200'
                            }`}
                          >
                            {step.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-bold ${
                                  step.completed || step.current ? 'text-[#4A154B]' : 'text-gray-400'
                                }`}
                              >
                                {step.title}
                              </span>
                              <span className="text-[10px] text-gray-400 font-medium font-mono">
                                {step.date}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Destination Box */}
                    <div className="p-3 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/50 text-xs space-y-1">
                      <span className="font-bold text-[#4A154B] block text-[10px] uppercase tracking-wider">
                        {order.deliveryType === 'pickup' ? 'Studio Collection Point' : 'Delivery Destination'}
                      </span>
                      {order.deliveryType === 'pickup' ? (
                        <div>
                          <p className="font-bold text-gray-800">
                            Sagunika Cosmetic Studio, Lane 5, Koregaon Park, Pune
                          </p>
                          <p className="text-[11px] text-gray-600">
                            Slot: <strong>{order.pickupSlot?.date || 'Today'} {order.pickupSlot?.time || '04:00 PM – 06:00 PM'}</strong>
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-700">
                          {order.shippingAddress.fullName} • {order.shippingAddress.street},{' '}
                          {order.shippingAddress.city}, {order.shippingAddress.pincode}
                        </p>
                      )}
                    </div>

                    {/* Action buttons: Cancel, Return, Refund, Invoice, WhatsApp, Reorder */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Cancel Order Button */}
                      {canCancel && (
                        <button
                          id={`btn-cancel-order-${order.orderNumber}`}
                          onClick={() => setCancellingOrder(order)}
                          className="py-2 px-3 rounded-xl border border-rose-200 hover:border-rose-400 text-rose-700 hover:text-rose-800 text-xs font-bold bg-rose-50/50 hover:bg-rose-100/50 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}

                      {/* Return Order Button (For delivered orders) */}
                      {canReturn && (
                        <button
                          id={`btn-return-order-${order.orderNumber}`}
                          onClick={() => setReturningOrder(order)}
                          className="py-2 px-3 rounded-xl border border-amber-300 hover:border-amber-500 text-amber-800 hover:text-amber-900 text-xs font-bold bg-amber-50/50 hover:bg-amber-100/50 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Return / Exchange</span>
                        </button>
                      )}

                      {/* View Refund Details (if exists) */}
                      {hasRefund && (
                        <button
                          onClick={() => setViewingRefundOrder(order)}
                          className="py-2 px-3 rounded-xl border border-purple-300 text-purple-800 text-xs font-bold bg-purple-50 hover:bg-purple-100 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Refund Breakdown</span>
                        </button>
                      )}

                      <button
                        onClick={() => openWhatsAppForOrder(order.orderNumber)}
                        className="py-2 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center space-x-1.5 shadow-xs flex-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp Concierge</span>
                      </button>

                      <button
                        onClick={() => onReorder(order)}
                        className="py-2 px-3 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder</span>
                      </button>

                      <button
                        id={`btn-order-invoice-${order.orderNumber}`}
                        onClick={() => (onOpenInvoice ? onOpenInvoice(order) : undefined)}
                        className="py-2 px-3 rounded-xl border border-[#E8D5C4] hover:border-[#B76E79] text-gray-700 hover:text-[#4A154B] text-xs font-bold bg-white hover:bg-[#FAF0F3]/50 transition-colors flex items-center justify-center space-x-1"
                        title="View & Download GST Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#B76E79]" />
                        <span>GST Invoice</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CANCEL ORDER DIALOG */}
      {/* ========================================================= */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-gray-900">
                    Cancel Order #{cancellingOrder.orderNumber}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Bespoke Cancellation & Instant Refund Workflow
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCancellingOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/40 text-xs space-y-1 text-gray-700">
              <p className="font-bold text-[#4A154B]">
                Order Amount: ₹{cancellingOrder.total.toLocaleString()} ({cancellingOrder.items.length} items)
              </p>
              <p className="text-[11px] text-gray-600">
                {cancellingOrder.paymentStatus === 'paid'
                  ? `✓ 100% Instant Refund will be initiated to your original payment method (${cancellingOrder.paymentMethod.toUpperCase()}). Razorpay will credit your account in 24-48 business hours.`
                  : 'Cash on Delivery order. Cancellation will be processed immediately with zero fee.'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Please select cancellation reason:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
              >
                <option value="Ordered incorrect cosmetic shade / variant">
                  Ordered incorrect cosmetic shade / variant
                </option>
                <option value="Want to change delivery destination address">
                  Want to change delivery destination address
                </option>
                <option value="Found alternative ceremonial vanity set">
                  Found alternative ceremonial vanity set
                </option>
                <option value="Delivery date no longer fits wedding schedule">
                  Delivery date no longer fits wedding schedule
                </option>
                <option value="Duplicate order placed by mistake">
                  Duplicate order placed by mistake
                </option>
                <option value="Other bespoke reason">Other bespoke reason</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">
                Additional Comments (Optional):
              </label>
              <textarea
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                rows={2}
                placeholder="Let our studio concierge know how we can improve..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Keep Order
              </button>
              <button
                type="button"
                id="btn-confirm-cancel-order"
                onClick={handleConfirmCancellation}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RETURN & EXCHANGE DIALOG */}
      {/* ========================================================= */}
      {returningOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-gray-900">
                    Return / Exchange #{returningOrder.orderNumber}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    7-Day Luxury Guarantee • Free Doorstep Pickup
                  </span>
                </div>
              </div>
              <button
                onClick={() => setReturningOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1 text-amber-900">
              <p className="font-bold">Sagunika Luxury Assurance</p>
              <p className="text-[11px] text-amber-800">
                Our concierge arranges a verified reverse courier pickup from your doorstep. 100% refund or replacement will be disbursed upon verification.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Select Reason for Return / Replacement:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
              >
                <option value="Shade mismatch with bridal attire">
                  Shade mismatch with bridal attire
                </option>
                <option value="Item damaged in transit / seal compromised">
                  Item damaged in transit / seal compromised
                </option>
                <option value="Dispenser pump / dropper packaging defective">
                  Dispenser pump / dropper packaging defective
                </option>
                <option value="Skin sensitivity or allergic reaction">
                  Skin sensitivity or allergic reaction
                </option>
                <option value="Received incorrect product from vault">
                  Received incorrect product from vault
                </option>
                <option value="Exchange for different fragrance variant">
                  Exchange for different fragrance variant
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 block">
                Preferred Courier Pickup Window:
              </label>
              <select
                value={returnPickupDate}
                onChange={(e) => setReturnPickupDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
              >
                <option value="Tomorrow (10:00 AM – 02:00 PM)">
                  Tomorrow Morning (10:00 AM – 02:00 PM)
                </option>
                <option value="Tomorrow (02:00 PM – 06:00 PM)">
                  Tomorrow Evening (02:00 PM – 06:00 PM)
                </option>
                <option value="Day after Tomorrow (10:00 AM – 02:00 PM)">
                  Day after Tomorrow (10:00 AM – 02:00 PM)
                </option>
                <option value="Studio Handover at Koregaon Park">
                  Direct Studio Handover (Koregaon Park Pune)
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-gray-600 block">
                Detailed Notes for Quality Team (Optional):
              </label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                rows={2}
                placeholder="Mention specific shade details or bottle defect..."
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setReturningOrder(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-return-order"
                onClick={handleConfirmReturn}
                className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors shadow-xs"
              >
                Submit Return Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DETAILED REFUND TRACKER */}
      {/* ========================================================= */}
      {viewingRefundOrder && viewingRefundOrder.refundDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-gray-900">
                    Razorpay Refund Tracker
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Order #{viewingRefundOrder.orderNumber} • Reference Ledger
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingRefundOrder(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Refund Metric Highlight */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-700">Total Refund Amount</span>
              <div className="text-2xl font-extrabold text-purple-950 font-mono">
                ₹{viewingRefundOrder.refundDetails.amount.toLocaleString('en-IN')}
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 uppercase tracking-wider">
                Status: {viewingRefundOrder.refundDetails.status}
              </span>
            </div>

            {/* Reference Details */}
            <div className="space-y-2 text-xs divide-y divide-gray-100">
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Bank ARN / UTR Number:</span>
                <span className="font-mono font-bold text-gray-900">
                  {viewingRefundOrder.refundDetails.bankReferenceNumber || 'ARN-88192041'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Refund Destination:</span>
                <span className="font-semibold text-gray-800">
                  {viewingRefundOrder.refundDetails.destinationAccount || 'Original UPI / Card Account'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Initiated At:</span>
                <span className="font-medium text-gray-700">
                  {viewingRefundOrder.refundDetails.initiatedAt}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Reason:</span>
                <span className="font-medium text-gray-700 text-right max-w-[200px] truncate">
                  {viewingRefundOrder.refundDetails.reason}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-3 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-500 block">
                Razorpay Settlement Pipeline
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Refund Initiated on Razorpay Gateway</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Acquirer Bank Clearance Verified</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Beneficiary Bank Posting (24-48 Hours)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setViewingRefundOrder(null)}
              className="w-full py-2.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

