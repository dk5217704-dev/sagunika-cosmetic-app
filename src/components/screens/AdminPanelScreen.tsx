import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  Bell, 
  Database, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  Layers,
  Image as ImageIcon,
  Users,
  Tag,
  Boxes,
  TrendingUp,
  MapPin,
  Save,
  Send
} from 'lucide-react';

import { 
  Product, 
  Order, 
  StoreSettings, 
  FCMNotification, 
  ScreenName
} from '../../types';

import { firestoreRepo } from '../../services/firebase';

// Modular Admin Sub-Tabs
import { AdminProductsTab } from '../admin/AdminProductsTab';
import { AdminCategoriesTab } from '../admin/AdminCategoriesTab';
import { AdminBannersTab } from '../admin/AdminBannersTab';
import { AdminOrdersTab } from '../admin/AdminOrdersTab';
import { AdminCustomersTab } from '../admin/AdminCustomersTab';
import { AdminCouponsTab } from '../admin/AdminCouponsTab';
import { AdminStockTab } from '../admin/AdminStockTab';
import { AdminAnalyticsTab } from '../admin/AdminAnalyticsTab';

type AdminTabKey = 
  | 'overview'
  | 'products'
  | 'categories'
  | 'banners'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'stock'
  | 'analytics'
  | 'settings'
  | 'broadcast'
  | 'firestore';

interface AdminPanelScreenProps {
  products: Product[];
  orders: Order[];
  storeSettings: StoreSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
  onBroadcastNotification: (notif: FCMNotification) => void;
  onNavigate: (screen: ScreenName) => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  products,
  orders,
  storeSettings,
  onUpdateProducts,
  onUpdateOrders,
  onUpdateStoreSettings,
  onBroadcastNotification,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');

  // Editable Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Push Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('✨ Sagunika Royal Flash Drop!');
  const [broadcastBody, setBroadcastBody] = useState('Limited Edition 24K Bridal Vault restocked at Koregaon Park Studio.');
  const [broadcastTarget, setBroadcastTarget] = useState<ScreenName>('wedding');
  const [broadcastSentMessage, setBroadcastSentMessage] = useState(false);

  // Firestore Inspector active collection
  const [inspectCollection, setInspectCollection] = useState<string>('products');

  // Quick Overview Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.quantity, 0), 0);

  // Handle Save Store Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = firestoreRepo.updateStoreSettings(settingsForm);
    onUpdateStoreSettings(updated);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 2500);
  };

  // Handle Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    const notif: FCMNotification = {
      id: `notif-${Date.now()}`,
      title: broadcastTitle.trim(),
      body: broadcastBody.trim(),
      timestamp: 'Just now',
      read: false,
      type: 'promotion',
      targetScreen: broadcastTarget
    };

    onBroadcastNotification(notif);
    setBroadcastSentMessage(true);
    setTimeout(() => setBroadcastSentMessage(false), 2500);
  };

  const navTabs: { id: AdminTabKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: `Products (${products.length})`, icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'stock', label: 'Stock', icon: Boxes },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: '10 KM Zone', icon: Settings },
    { id: 'broadcast', label: 'Broadcast', icon: Bell },
    { id: 'firestore', label: '13 Collections', icon: Database },
  ];

  return (
    <div id="screen-admin-panel" className="pb-28 bg-[#FAF8F9] min-h-screen text-gray-900">
      {/* Top Header */}
      <div className="sticky top-0 bg-[#4A154B] text-white z-30 px-4 py-3 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="p-1.5 -ml-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-serif text-sm font-bold tracking-wide">Sagunika Admin Panel</h2>
              <span className="text-[9px] bg-[#B76E79] px-2 py-0.5 rounded-full font-bold uppercase">
                Enterprise
              </span>
            </div>
            <p className="text-[10px] text-[#E8D5C4]">Firestore Catalog & Operations Manager</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset all 13 Firestore collections to default state?')) {
              firestoreRepo.resetAllCollections();
              location.reload();
            }
          }}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#E8D5C4] text-xs flex items-center space-x-1"
          title="Reset Collections"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[10px]">Reset DB</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs Slider */}
      <div className="bg-white border-b border-[#E8D5C4] px-2 py-2 overflow-x-auto flex items-center space-x-1.5 no-scrollbar text-xs sticky top-[53px] z-20 shadow-2xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-admin-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 space-y-4 max-w-6xl mx-auto">
        {/* ========================================================= */}
        {/* TAB: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Revenue</span>
                <span className="text-xl font-extrabold text-[#4A154B] font-mono">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  ✓ Verified in Firestore
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Orders Handled</span>
                <span className="text-xl font-extrabold text-gray-800 font-mono">
                  {orders.length} Orders
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  {totalItemsSold} Luxury Items Sold
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Active Products</span>
                <span className="text-xl font-extrabold text-[#B76E79] font-mono">
                  {products.length} SKUs
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Bridal Vault & Groom Care
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Delivery Zone</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono">
                  {storeSettings.deliveryRadiusKm} KM Limit
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  Studio: Koregaon Park Pune
                </span>
              </div>
            </div>

            {/* Hub Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setActiveTab('products')}
                className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] text-left hover:border-[#4A154B] transition-colors cursor-pointer group shadow-2xs"
              >
                <div className="p-2 rounded-xl bg-purple-50 text-[#4A154B] w-fit mb-2 group-hover:bg-[#4A154B] group-hover:text-white transition-colors">
                  <Package className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-xs font-bold text-gray-900">Manage Catalog</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Add, edit, or delete cosmetic items</p>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] text-left hover:border-[#4A154B] transition-colors cursor-pointer group shadow-2xs"
              >
                <div className="p-2 rounded-xl bg-rose-50 text-[#B76E79] w-fit mb-2 group-hover:bg-[#B76E79] group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-xs font-bold text-gray-900">Categories</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Organize taxonomy & badges</p>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] text-left hover:border-[#4A154B] transition-colors cursor-pointer group shadow-2xs"
              >
                <div className="p-2 rounded-xl bg-amber-50 text-amber-800 w-fit mb-2 group-hover:bg-amber-800 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-xs font-bold text-gray-900">Orders & Returns</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Status updates & refund execution</p>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] text-left hover:border-[#4A154B] transition-colors cursor-pointer group shadow-2xs"
              >
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 w-fit mb-2 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-xs font-bold text-gray-900">Analytics & BI</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">Revenue funnels & top SKUs</p>
              </button>
            </div>

            {/* Quick Actions Card */}
            <div className="p-4 rounded-2xl bg-[#4A154B] text-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#E8D5C4]">
                  Live Store Administrative Console
                </h3>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
                  Active
                </span>
              </div>
              <p className="text-xs text-white/80">
                Manage stock levels, review return requests, issue promo vouchers, or adjust delivery boundaries in real-time.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => setActiveTab('stock')}
                  className="px-3 py-1.5 rounded-lg bg-white text-[#4A154B] font-bold text-xs hover:bg-[#FAF8F9] flex items-center space-x-1 cursor-pointer"
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>Stock Inventory</span>
                </button>

                <button
                  onClick={() => setActiveTab('coupons')}
                  className="px-3 py-1.5 rounded-lg bg-[#B76E79] text-white font-bold text-xs hover:bg-[#A35D68] flex items-center space-x-1 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Issue Coupon</span>
                </button>

                <button
                  onClick={() => setActiveTab('banners')}
                  className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold text-xs hover:bg-white/30 flex items-center space-x-1 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Hero Banners</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PRODUCTS (Add / Edit / Delete) */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <AdminProductsTab
            products={products}
            onUpdateProducts={onUpdateProducts}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: CATEGORIES */}
        {/* ========================================================= */}
        {activeTab === 'categories' && (
          <AdminCategoriesTab />
        )}

        {/* ========================================================= */}
        {/* TAB: BANNERS */}
        {/* ========================================================= */}
        {activeTab === 'banners' && (
          <AdminBannersTab />
        )}

        {/* ========================================================= */}
        {/* TAB: ORDERS & RETURNS */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            onUpdateOrders={onUpdateOrders}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: CUSTOMERS */}
        {/* ========================================================= */}
        {activeTab === 'customers' && (
          <AdminCustomersTab />
        )}

        {/* ========================================================= */}
        {/* TAB: COUPONS */}
        {/* ========================================================= */}
        {activeTab === 'coupons' && (
          <AdminCouponsTab />
        )}

        {/* ========================================================= */}
        {/* TAB: STOCK */}
        {/* ========================================================= */}
        {activeTab === 'stock' && (
          <AdminStockTab
            products={products}
            onUpdateProducts={onUpdateProducts}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsTab
            orders={orders}
            products={products}
          />
        )}

        {/* ========================================================= */}
        {/* TAB: STORE SETTINGS (10 KM Radius) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="p-4 bg-white rounded-2xl border border-[#E8D5C4] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                  Store Settings & Location Configuration
                </h3>
                <p className="text-[10px] text-gray-500">
                  Controls the 10 KM delivery boundary, Razorpay, and Studio details
                </p>
              </div>
              {settingsSavedMessage && (
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.tagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Studio Street Address (Koregaon Park Pune)
                </label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg"
                />
              </div>

              {/* 10 KM DELIVERY RADIUS RESTRICTION */}
              <div className="p-3.5 bg-[#FAF0F3] rounded-xl border border-[#E8B4B8]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-[#4A154B]" />
                    <span className="font-bold text-xs text-[#4A154B]">
                      Delivery Radius Restriction Limit
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-sm text-[#4A154B]">
                    {settingsForm.deliveryRadiusKm} KM
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Addresses outside this radius are restricted to Studio Store Pickup at Koregaon Park.
                </p>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={settingsForm.deliveryRadiusKm}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      deliveryRadiusKm: parseInt(e.target.value) || 10,
                    })
                  }
                  className="w-full accent-[#4A154B]"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>5 KM</span>
                  <span className="font-bold text-[#4A154B]">10 KM (Default)</span>
                  <span>30 KM</span>
                </div>
              </div>

              {/* Studio Coordinates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Latitude (Pune Koregaon Park)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settingsForm.latitude}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        latitude: parseFloat(e.target.value) || 18.5362,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Longitude (Pune Koregaon Park)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={settingsForm.longitude}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        longitude: parseFloat(e.target.value) || 73.8958,
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    WhatsApp Support Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    value={settingsForm.razorpayKeyId}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Standard Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardDeliveryFee}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        standardDeliveryFee: parseInt(e.target.value) || 99,
                      })
                    }
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Express Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.expressDeliveryFee}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        expressDeliveryFee: parseInt(e.target.value) || 149,
                      })
                    }
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Free If Over (₹)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        freeDeliveryThreshold: parseInt(e.target.value) || 999,
                      })
                    }
                    className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Allow Free Store Pickup at Koregaon Park Studio
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Customers can pick up their orders in person even if outside delivery zone.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settingsForm.storePickupEnabled}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      storePickupEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#4A154B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#4A154B] text-white font-bold text-xs hover:bg-[#67226B] shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Store Settings to Firestore</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PUSH NOTIFICATIONS BROADCAST */}
        {/* ========================================================= */}
        {activeTab === 'broadcast' && (
          <div className="p-4 bg-white rounded-2xl border border-[#E8D5C4] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                  Broadcast Push Notification (FCM)
                </h3>
                <p className="text-[10px] text-gray-500">
                  Sends instant heads-up alert to all active customer devices
                </p>
              </div>
              {broadcastSentMessage && (
                <span className="text-xs text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md font-bold flex items-center space-x-1 animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Broadcast Sent!</span>
                </span>
              )}
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Notification Message Body *
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Tap Action / Target Screen
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value as ScreenName)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl bg-white"
                >
                  <option value="wedding">Wedding / Bridal Vault</option>
                  <option value="groom">Royal Groom Collection</option>
                  <option value="catalog">Full Catalog</option>
                  <option value="orders">Orders Tracker</option>
                  <option value="home">Home Feed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#B76E79] text-white font-bold text-xs hover:opacity-95 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Broadcast Push Notification to Customers</span>
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: 13 FIRESTORE COLLECTIONS INSPECTOR */}
        {/* ========================================================= */}
        {activeTab === 'firestore' && (
          <div className="p-4 bg-white rounded-2xl border border-[#E8D5C4] shadow-2xs space-y-3">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                Cloud Firestore Collections (13 Collections)
              </h3>
              <p className="text-[10px] text-gray-500">
                Live database schemas and documents matching Sagunika architecture
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {[
                'admins',
                'store',
                'products',
                'categories',
                'customers',
                'cart',
                'wishlist',
                'orders',
                'payments',
                'reviews',
                'coupons',
                'notifications',
                'banners',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInspectCollection(c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold truncate transition-all cursor-pointer ${
                    inspectCollection === c
                      ? 'bg-[#4A154B] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="bg-slate-950 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto max-h-80 border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span>Collection: /{inspectCollection}</span>
                <span>Firestore: Synced</span>
              </div>
              <pre className="text-emerald-300">
                {inspectCollection === 'store' && JSON.stringify(storeSettings, null, 2)}
                {inspectCollection === 'products' && JSON.stringify(products.slice(0, 3), null, 2)}
                {inspectCollection === 'orders' && JSON.stringify(orders.slice(0, 2), null, 2)}
                {inspectCollection === 'admins' && JSON.stringify(firestoreRepo.getAdmins(), null, 2)}
                {inspectCollection === 'categories' && JSON.stringify(firestoreRepo.getCategories(), null, 2)}
                {inspectCollection === 'customers' && JSON.stringify(firestoreRepo.getCustomers(), null, 2)}
                {inspectCollection === 'coupons' && JSON.stringify(firestoreRepo.getCoupons(), null, 2)}
                {inspectCollection === 'payments' && JSON.stringify(firestoreRepo.getPayments(), null, 2)}
                {inspectCollection === 'reviews' && JSON.stringify(firestoreRepo.getReviews(), null, 2)}
                {inspectCollection === 'notifications' && JSON.stringify(firestoreRepo.getNotifications().slice(0, 3), null, 2)}
                {inspectCollection === 'banners' && JSON.stringify(firestoreRepo.getBanners(), null, 2)}
                {inspectCollection === 'cart' && JSON.stringify(firestoreRepo.getCart('user-patron-01'), null, 2)}
                {inspectCollection === 'wishlist' && JSON.stringify(firestoreRepo.getWishlist('user-patron-01'), null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
