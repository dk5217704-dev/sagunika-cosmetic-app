import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  RotateCcw,
  Users,
  CreditCard,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { Order, Product } from '../../types';

interface AdminAnalyticsTabProps {
  orders: Order[];
  products: Product[];
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  orders,
  products,
}) => {
  // Financial Calculations
  const grossRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalRefunds = orders.reduce((sum, o) => sum + (o.refundDetails ? o.refundDetails.amount : 0), 0);
  const netRevenue = Math.max(0, grossRevenue - totalRefunds);
  const averageOrderValue = orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;

  // Status Breakdown
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const inTransitCount = orders.filter((o) => o.status === 'shipped' || o.status === 'out_for_delivery').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;
  const returnRefundCount = orders.filter(
    (o) => o.status === 'return_requested' || o.status === 'returned' || o.status === 'refunded'
  ).length;

  // Payment method breakdown
  const upiOrders = orders.filter((o) => o.paymentMethod === 'upi').length;
  const cardOrders = orders.filter((o) => o.paymentMethod === 'card' || o.paymentMethod === 'razorpay').length;
  const codOrders = orders.filter((o) => o.paymentMethod === 'cod').length;

  // Top Products by order count
  const productSalesMap: Record<string, { count: number; revenue: number; product: Product }> = {};

  orders.forEach((o) => {
    o.items.forEach((item) => {
      const pid = item.product.id;
      if (!productSalesMap[pid]) {
        productSalesMap[pid] = { count: 0, revenue: 0, product: item.product };
      }
      productSalesMap[pid].count += item.quantity;
      productSalesMap[pid].revenue += item.quantity * item.product.price;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div id="admin-analytics-tab" className="space-y-4">
      {/* Top Headline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400">Net Revenue</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
              +18.4%
            </span>
          </div>
          <span className="text-xl font-extrabold text-[#4A154B] font-mono block mt-1">
            ₹{netRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Gross: ₹{grossRevenue.toLocaleString()}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400">Avg Order Value</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 font-mono block mt-1">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Per luxury transaction
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Orders</span>
            <ShoppingBag className="w-3.5 h-3.5 text-[#B76E79]" />
          </div>
          <span className="text-xl font-extrabold text-[#B76E79] font-mono block mt-1">
            {orders.length}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            {deliveredCount} delivered successfully
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-600">Refunds & Returns</span>
            <RotateCcw className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <span className="text-xl font-extrabold text-purple-900 font-mono block mt-1">
            ₹{totalRefunds.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-purple-700 block mt-0.5">
            {returnRefundCount} return / refund cases
          </span>
        </div>
      </div>

      {/* Order Status Funnel & Channel Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Order Pipeline Health */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-[#4A154B]" />
              <h4 className="font-serif text-xs font-bold text-[#4A154B]">
                Order Status Pipeline
              </h4>
            </div>
            <span className="text-[10px] text-gray-400">Total {orders.length}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Delivered Successfully</span>
                <span className="font-bold text-emerald-700 font-mono">{deliveredCount}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${orders.length ? (deliveredCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>In Logistics / Transit</span>
                <span className="font-bold text-[#B76E79] font-mono">{inTransitCount}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B76E79] rounded-full"
                  style={{ width: `${orders.length ? (inTransitCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Returns & Refunds</span>
                <span className="font-bold text-purple-700 font-mono">{returnRefundCount}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${orders.length ? (returnRefundCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1">
                <span>Cancelled</span>
                <span className="font-bold text-rose-700 font-mono">{cancelledCount}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${orders.length ? (cancelledCount / orders.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Channels */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-[#4A154B]" />
              <h4 className="font-serif text-xs font-bold text-[#4A154B]">
                Razorpay Payment Gateways
              </h4>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              100% Secured
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-950 block">Instant UPI (GPay / PhonePe)</span>
                <span className="text-[10px] text-purple-700">Preferred by 68% of bridal shoppers</span>
              </div>
              <span className="font-mono font-bold text-sm text-purple-900">{upiOrders} orders</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/40 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#4A154B] block">Credit / Debit Cards (Visa, MC)</span>
                <span className="text-[10px] text-gray-500">Includes HDFC & ICICI 3D Secure</span>
              </div>
              <span className="font-mono font-bold text-sm text-[#4A154B]">{cardOrders} orders</span>
            </div>

            <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-800 block">Cash On Delivery (COD)</span>
                <span className="text-[10px] text-gray-500">Local Pune & Mumbai courier delivery</span>
              </div>
              <span className="font-mono font-bold text-sm text-gray-700">{codOrders} orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products Leaderboard */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h4 className="font-serif text-xs font-bold text-[#4A154B]">
              Top Revenue Generating SKUs
            </h4>
          </div>
          <span className="text-[10px] text-gray-400">Leaderboard</span>
        </div>

        <div className="divide-y divide-gray-100">
          {topProducts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-gray-400 w-4">{idx + 1}</span>
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block truncate max-w-[200px]">
                    {item.product.name}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {item.count} units sold • {item.product.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-[#4A154B] font-mono block">
                  ₹{item.revenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  ₹{item.product.price} / unit
                </span>
              </div>
            </div>
          ))}

          {topProducts.length === 0 && (
            <div className="py-6 text-center text-gray-400 text-xs">
              Place orders to generate SKU sales velocity rankings.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
