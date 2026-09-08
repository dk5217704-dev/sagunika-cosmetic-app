import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  FileText,
  Copy,
  ExternalLink,
  ShieldCheck,
  Filter,
  RefreshCw,
  Building2,
  Smartphone,
  Wallet,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { Order, PaymentRecord, ScreenName, StoreSettings } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface PaymentHistoryScreenProps {
  orders: Order[];
  storeSettings: StoreSettings;
  onNavigate: (screen: ScreenName) => void;
  onOpenInvoice: (order: Order) => void;
  onSelectOrder?: (order: Order) => void;
}

export const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  orders,
  storeSettings,
  onNavigate,
  onOpenInvoice,
  onSelectOrder,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'captured' | 'failed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadPayments = () => {
    const list = firestoreRepo.getPayments();
    setPayments(list);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.orderNumber.toLowerCase().includes(q) ||
      (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q) ||
      (p.paymentSubMethod && p.paymentSubMethod.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const totalCaptured = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalSuccessCount = payments.filter((p) => p.status === 'captured').length;
  const totalFailedCount = payments.filter((p) => p.status === 'failed').length;

  const getMethodIcon = (method: string, subMethod?: string) => {
    const sm = (subMethod || '').toLowerCase();
    if (method === 'upi' || sm.includes('upi') || sm.includes('gpay') || sm.includes('phonepe')) {
      return <Smartphone className="w-4 h-4 text-purple-600" />;
    }
    if (method === 'card' || sm.includes('card') || sm.includes('visa') || sm.includes('mastercard')) {
      return <CreditCard className="w-4 h-4 text-blue-600" />;
    }
    if (method === 'netbanking' || sm.includes('netbanking') || sm.includes('bank')) {
      return <Building2 className="w-4 h-4 text-amber-600" />;
    }
    if (method === 'wallet' || sm.includes('wallet') || sm.includes('paytm')) {
      return <Wallet className="w-4 h-4 text-emerald-600" />;
    }
    return <CreditCard className="w-4 h-4 text-gray-500" />;
  };

  const handleViewOrder = (orderNum: string) => {
    const matched = orders.find((o) => o.orderNumber === orderNum);
    if (matched && onSelectOrder) {
      onSelectOrder(matched);
    }
    onNavigate('orders');
  };

  const handleOpenInvoiceForPayment = (payment: PaymentRecord) => {
    let matched = orders.find((o) => o.orderNumber === payment.orderNumber);
    if (!matched) {
      // Fallback synthetic order from payment record
      matched = {
        id: payment.orderId,
        orderNumber: payment.orderNumber,
        createdAt: payment.timestamp,
        status: 'confirmed',
        items: orders[0]?.items || [],
        subtotal: payment.amount,
        discount: 0,
        deliveryFee: 0,
        total: payment.amount,
        deliveryType: 'delivery',
        shippingAddress: orders[0]?.shippingAddress || {
          id: 'addr-default',
          fullName: 'Ananya Sharma',
          phone: payment.customerPhone || '+91 98765 43210',
          street: 'Plot 12, Lane 7, Koregaon Park',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411001',
          isDefault: true,
        },
        paymentMethod: payment.paymentMethod as any,
        paymentStatus: payment.status === 'captured' ? 'paid' : 'pending',
        razorpayPaymentId: payment.razorpayPaymentId,
        estimatedDelivery: 'Dispatched via Express',
        trackingSteps: [],
      };
    }
    onOpenInvoice(matched);
  };

  return (
    <div id="screen-payment-history" className="min-h-screen bg-[#FAF8F9] pb-32 text-gray-900">
      {/* Top Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3.5 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="font-serif text-base font-bold text-[#4A154B]">
            Payment & Transaction History
          </h2>
          <span className="text-[10px] text-gray-500 flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Razorpay Secured Gateway Ledger</span>
          </span>
        </div>

        <button
          type="button"
          onClick={loadPayments}
          className="p-1.5 rounded-full text-gray-500 hover:text-[#4A154B] hover:bg-gray-100"
          title="Refresh Ledger"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-xl mx-auto p-4 space-y-4">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-3 shadow-2xs">
            <span className="text-[10px] font-semibold text-gray-400 block uppercase">Settled Total</span>
            <span className="text-sm sm:text-base font-extrabold text-[#4A154B] font-mono block mt-0.5">
              ₹{totalCaptured.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-3 shadow-2xs">
            <span className="text-[10px] font-semibold text-emerald-600 block uppercase">Successful</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-sm sm:text-base font-extrabold text-emerald-700 font-mono">
                {totalSuccessCount}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-3 shadow-2xs">
            <span className="text-[10px] font-semibold text-rose-600 block uppercase">Failed / Declined</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-sm sm:text-base font-extrabold text-rose-700 font-mono">
                {totalFailedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Payment ID, Order ID (#SG-...), or Method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8D5C4] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#4A154B]"
            />
          </div>

          <div className="flex items-center space-x-1.5">
            {[
              { id: 'all', label: `All Transactions (${payments.length})` },
              { id: 'captured', label: `Successful (${totalSuccessCount})` },
              { id: 'failed', label: `Failed (${totalFailedCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#4A154B] text-white shadow-2xs'
                    : 'bg-white border border-[#E8D5C4] text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8D5C4] p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] flex items-center justify-center text-[#B76E79] mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-sm font-bold text-gray-800">No Payment Records Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {searchQuery
                ? `No transactions match your search "${searchQuery}".`
                : 'No transactions recorded under this filter yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment, pIdx) => {
              const isSuccess = payment.status === 'captured';
              const pmtId = payment.razorpayPaymentId || payment.id;

              return (
                <div
                  key={`${payment.id}-${pIdx}`}
                  id={`payment-card-${payment.id}`}
                  className="bg-white rounded-2xl border border-[#E8D5C4] p-4 shadow-2xs space-y-3 hover:border-[#B76E79]/60 transition-all"
                >
                  {/* Top Row: Payment ID & Status Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-gray-800">
                          {pmtId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(pmtId, payment.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-700 transition-colors"
                          title="Copy Payment ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        {copiedId === payment.id && (
                          <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        {payment.timestamp}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-extrabold text-sm text-gray-900 block">
                        ₹{payment.amount.toLocaleString('en-IN')}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-0.5 ${
                          isSuccess
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isSuccess ? 'CAPTURED / PAID' : 'FAILED / DECLINED'}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Payment Method Details */}
                  <div className="p-2.5 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-3xs">
                        {getMethodIcon(payment.paymentMethod, payment.paymentSubMethod)}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 block text-[11px]">
                          {payment.paymentSubMethod || payment.paymentMethod.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          Order Ref: <strong className="text-[#4A154B]">#{payment.orderNumber}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewOrder(payment.orderNumber)}
                      className="text-[11px] font-bold text-[#4A154B] hover:underline flex items-center space-x-0.5"
                    >
                      <span>View Order</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* If Failed: Show Diagnostic Reason */}
                  {!isSuccess && payment.failureReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-900 space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-[10px] uppercase text-rose-700">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span>Declined Reason ({payment.errorCode || 'ERROR'})</span>
                      </div>
                      <p className="text-[11px] text-rose-800 leading-snug">
                        {payment.failureReason}
                      </p>
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
                    <span className="text-[10px] text-gray-400 font-mono">
                      Gateway: Razorpay API v1
                    </span>

                    <div className="flex items-center space-x-2">
                      {isSuccess ? (
                        <button
                          type="button"
                          onClick={() => handleOpenInvoiceForPayment(payment)}
                          className="py-1.5 px-3 rounded-lg bg-white border border-[#E8D5C4] hover:border-[#B76E79] text-[#4A154B] font-bold text-[11px] flex items-center space-x-1 shadow-3xs transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#B76E79]" />
                          <span>GST Tax Invoice</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNavigate('checkout')}
                          className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-3xs transition-colors"
                        >
                          Retry Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
