import React, { useState } from 'react';
import {
  ShoppingBag,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateOrders,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Return approval modal
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('Return approved & inspected by Studio');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = firestoreRepo.updateOrderStatus(orderId, newStatus);
    onUpdateOrders(updated);
    showToast(`Order status updated to "${newStatus.replace('_', ' ')}".`);
  };

  const openApproveReturnModal = (order: Order) => {
    setReturnModalOrder(order);
    setRefundAmount(order.total.toString());
    setRefundReason(order.returnDetails?.reason || 'Verified return at studio inspection');
  };

  const handleApproveRefund = () => {
    if (!returnModalOrder) return;
    const amount = parseInt(refundAmount) || returnModalOrder.total;
    const updated = firestoreRepo.updateReturnStatus(
      returnModalOrder.id,
      'refund_approved',
      `Refund approved: ₹${amount} - ${refundReason}`
    );
    onUpdateOrders(updated);
    showToast(`Refund of ₹${amount} initiated via Razorpay reverse webhook.`);
    setReturnModalOrder(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.shippingAddress.phone.includes(searchQuery);

    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'returns') {
      return (
        matchesSearch &&
        (o.status === 'return_requested' || o.status === 'returned' || o.status === 'refunded')
      );
    }
    return matchesSearch && o.status === filterStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'out_for_delivery':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'packed':
      case 'confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'return_requested':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'returned':
      case 'refunded':
        return 'bg-purple-200 text-purple-950 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div id="admin-orders-tab" className="space-y-4">
      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#4A154B] text-white text-xs font-semibold flex items-center space-x-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8D5C4] shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Order Fulfillment & Returns Hub ({orders.length})
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore collection: <code className="text-gray-700">orders</code>
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'shipped', label: 'Shipped' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'returns', label: 'Returns & Refunds' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterStatus(f.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === f.key
                  ? 'bg-[#4A154B] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by order # (e.g. SAG-), patron name, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order, orderIdx) => {
          const isExpanded = expandedOrderId === order.id;
          const isReturnCase =
            order.status === 'return_requested' ||
            order.status === 'returned' ||
            order.status === 'refunded';

          return (
            <div
              key={`${order.id}-${orderIdx}`}
              id={`admin-order-card-${order.id}`}
              className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs transition-all"
            >
              {/* Order Header Summary */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F9]/50 border-b border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-white border border-[#E8D5C4] text-[#4A154B]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm text-gray-900">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                      <span>{order.createdAt}</span>
                      <span>•</span>
                      <span>{order.shippingAddress.fullName}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-[#4A154B]">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Updater Select */}
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-gray-500">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="text-xs font-bold py-1.5 px-2.5 rounded-xl border border-gray-300 bg-white focus:border-[#4A154B] focus:outline-hidden"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out For Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="return_requested">Return Requested</option>
                    <option value="returned">Returned</option>
                    <option value="refunded">Refunded</option>
                  </select>

                  <button
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Return / Refund Action Banner if Return is Requested */}
              {order.status === 'return_requested' && (
                <div className="p-3 bg-purple-50 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-purple-950 text-xs">
                    <RotateCcw className="w-4 h-4 text-purple-700 flex-shrink-0" />
                    <span>
                      <strong>Return Requested:</strong> "{order.returnDetails?.reason || 'Patron requested return'}"
                    </span>
                  </div>
                  <button
                    onClick={() => openApproveReturnModal(order)}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 shadow-xs cursor-pointer flex items-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Approve & Issue Refund</span>
                  </button>
                </div>
              )}

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 space-y-3 bg-white text-xs">
                  {/* Items List */}
                  <div>
                    <span className="font-bold text-gray-700 block mb-2">Order Items ({order.items.length})</span>
                    <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                              <span className="font-serif font-bold text-gray-900 block truncate max-w-xs">
                                {item.product.name}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                Qty: {item.quantity} • ₹{item.product.price} each
                              </span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-gray-900">
                            ₹{(item.quantity * item.product.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Payment Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <span className="font-bold text-gray-800 block text-[11px] flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        <span>Shipping Destination</span>
                      </span>
                      <p className="text-gray-600 font-medium">
                        {order.shippingAddress.fullName} ({order.shippingAddress.phone})
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.pincode}
                      </p>
                      {order.distanceKm && (
                        <span className="text-[10px] text-emerald-700 font-bold block">
                          Distance from Boutique: {order.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                      <span className="font-bold text-gray-800 block text-[11px] flex items-center space-x-1">
                        <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                        <span>Payment Gateway Details</span>
                      </span>
                      <p className="text-gray-600 font-medium">
                        Method: <strong className="uppercase">{order.paymentMethod}</strong> (
                        <span className="text-emerald-700 font-bold capitalize">{order.paymentStatus}</span>)
                      </p>
                      {order.razorpayPaymentId && (
                        <p className="font-mono text-[10px] text-gray-500">
                          Razorpay Txn: {order.razorpayPaymentId}
                        </p>
                      )}
                      {order.refundDetails && (
                        <div className="mt-1 p-2 rounded-lg bg-purple-100 text-purple-950 text-[10px] space-y-0.5">
                          <span className="font-bold block">Refund Processed: ₹{order.refundDetails.amount}</span>
                          <span>UTR / ARN: {order.refundDetails.bankReferenceNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-xs bg-white rounded-2xl border border-gray-200">
            No orders found matching filter criteria.
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* RETURN & REFUND APPROVAL MODAL */}
      {/* ========================================================= */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-purple-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-purple-100 text-purple-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">
                  Approve Return & Reverse Payment
                </h4>
                <p className="text-[10px] text-gray-500">
                  Razorpay Refund Webhook API Simulator
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100">
                <span className="text-gray-600 block">Order: <strong>{returnModalOrder.orderNumber}</strong></span>
                <span className="text-gray-600 block">Customer: {returnModalOrder.shippingAddress.fullName}</span>
                <span className="text-gray-600 block">Original Paid: <strong>₹{returnModalOrder.total}</strong></span>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Approval Notes / Reason</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setReturnModalOrder(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApproveRefund}
                className="flex-1 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800"
              >
                Execute Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
