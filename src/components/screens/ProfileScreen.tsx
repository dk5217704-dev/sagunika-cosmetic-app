import React, { useState, useRef } from 'react';
import {
  User as UserIcon,
  Shield,
  PlusCircle,
  MapPin,
  Bell,
  Heart,
  Package,
  Headphones,
  LogOut,
  Code2,
  Database,
  CheckCircle2,
  Lock,
  Camera,
  Edit2,
  Plus,
  Trash2,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Upload,
  X,
  Mail,
  Phone,
  Clock,
  Send,
  AlertCircle,
  CreditCard,
  FileText
} from 'lucide-react';
import { User as UserType, ScreenName, Order, Address } from '../../types';
import { firebaseAuthService, PRESET_AVATARS } from '../../services/firebaseAuth';

interface ProfileScreenProps {
  user: UserType;
  orders: Order[];
  onToggleRole: () => void;
  onOpenAddProductModal: () => void;
  onNavigate: (screen: ScreenName) => void;
  onOpenFlutterCode: () => void;
  onOpenFirebaseModal: () => void;
  onLogout: () => void;
  fcmEnabled: boolean;
  onToggleFCM: () => void;
  wishlistCount: number;
  orderCount: number;
  onUpdateUser: (user: UserType) => void;
  onReorder?: (order: Order) => void;
  onOpenInvoice?: (order: Order) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  orders,
  onToggleRole,
  onOpenAddProductModal,
  onNavigate,
  onOpenFlutterCode,
  onOpenFirebaseModal,
  onLogout,
  fcmEnabled,
  onToggleFCM,
  wishlistCount,
  orderCount,
  onUpdateUser,
  onReorder,
  onOpenInvoice,
}) => {
  const isAdmin = user.role === 'admin';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses'>('overview');

  // Modals
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);

  // Edit Profile Form State
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editEmail, setEditEmail] = useState(user.email);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // Add Address Form State
  const [addressName, setAddressName] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('Pune');
  const [addressState, setAddressState] = useState('Maharashtra');
  const [addressPincode, setAddressPincode] = useState('411001');
  const [addressIsDefault, setAddressIsDefault] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = firebaseAuthService.updateProfile(user.uid, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    });
    onUpdateUser(updated);
    setIsEditProfileModalOpen(false);
  };

  // Select Avatar from preset or custom
  const handleSelectAvatar = (url: string) => {
    const updated = firebaseAuthService.updateProfile(user.uid, { avatarUrl: url });
    onUpdateUser(updated);
    setIsAvatarModalOpen(false);
  };

  // Upload Custom Photo from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          handleSelectAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save new address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressStreet.trim() || !addressName.trim() || !addressPhone.trim()) {
      return;
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName: addressName.trim(),
      phone: addressPhone.trim(),
      street: addressStreet.trim(),
      city: addressCity.trim(),
      state: addressState.trim(),
      pincode: addressPincode.trim(),
      isDefault: addressIsDefault || user.savedAddresses.length === 0,
    };

    const updated = firebaseAuthService.saveAddress(user.uid, newAddress);
    onUpdateUser(updated);
    setIsAddAddressModalOpen(false);

    // Reset form
    setAddressName('');
    setAddressPhone('');
    setAddressStreet('');
    setAddressPincode('411001');
    setAddressIsDefault(false);
  };

  // Delete address
  const handleDeleteAddress = (addrId: string) => {
    const updated = firebaseAuthService.deleteAddress(user.uid, addrId);
    onUpdateUser(updated);
  };

  // Set default address
  const handleSetDefaultAddress = (address: Address) => {
    const updated = firebaseAuthService.saveAddress(user.uid, {
      ...address,
      isDefault: true,
    });
    onUpdateUser(updated);
  };

  // Send email verification
  const handleSendVerificationEmail = async () => {
    try {
      const res = await firebaseAuthService.sendVerificationEmail(user);
      setVerificationFeedback(res.message);
    } catch (e: any) {
      setVerificationFeedback('Could not dispatch verification email at this moment.');
    }
  };

  // Confirm verification
  const handleConfirmVerification = () => {
    const updated = firebaseAuthService.confirmEmailVerified(user);
    onUpdateUser(updated);
    setVerificationFeedback('Email address verified successfully!');
  };

  return (
    <div id="screen-profile" className="pb-28 bg-[#FAF8F9] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60">
        <h2 className="font-serif text-base font-bold text-[#4A154B] text-center">
          Sagunika Patron Profile
        </h2>
        <p className="text-[10px] text-gray-500 text-center tracking-wide">
          Firebase Authentication & Customer Identity
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================= */}
        {/* USER PROFILE CARD */}
        {/* ========================================= */}
        <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-4 shadow-2xs relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3.5">
              {/* Profile Photo with Camera Trigger */}
              <div className="relative group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#4A154B] p-[2px] shadow-sm overflow-hidden flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#FAF0F3] flex items-center justify-center font-serif text-lg font-bold text-[#4A154B]">
                      {user.name ? user.name.slice(0, 2).toUpperCase() : 'SC'}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  id="btn-edit-avatar"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#4A154B] text-white shadow-md hover:bg-[#67226B] active:scale-95 transition-all cursor-pointer"
                  title="Change Profile Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Identity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-serif text-base font-bold text-gray-900 truncate">
                    {user.name || 'Sagunika Patron'}
                  </h3>
                  <button
                    type="button"
                    id="btn-edit-profile-open"
                    onClick={() => {
                      setEditName(user.name);
                      setEditPhone(user.phone);
                      setEditEmail(user.email);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="p-1 text-gray-400 hover:text-[#4A154B] cursor-pointer"
                    title="Edit Name & Phone"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-gray-600 mt-0.5">
                  <Phone className="w-3 h-3 text-[#B76E79]" />
                  <span>{user.phone || '+91 98765 43210'}</span>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mt-0.5">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="truncate">{user.email || 'customer@sagunika.com'}</span>
                </div>

                {/* Email Verification Badge */}
                <div className="mt-1.5 flex items-center space-x-2">
                  {user.emailVerified ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Patron</span>
                    </span>
                  ) : (
                    <div className="inline-flex items-center space-x-1">
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Email Pending</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleConfirmVerification}
                        className="text-[10px] text-[#8C4A5A] font-bold underline hover:text-[#4A154B] cursor-pointer"
                      >
                        Verify Now
                      </button>
                    </div>
                  )}
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isAdmin
                        ? 'bg-[#4A154B] text-white'
                        : 'bg-[#FAF0F3] text-[#8C4A5A] border border-[#E8B4B8]/50'
                    }`}
                  >
                    {isAdmin ? 'Store Admin' : 'VIP Gold'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {verificationFeedback && (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] flex items-center justify-between">
              <span>{verificationFeedback}</span>
              <button
                onClick={() => setVerificationFeedback(null)}
                className="text-emerald-700 font-bold ml-2 text-xs"
              >
                ×
              </button>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="mt-4 pt-3 border-t border-[#EFE8ED] grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#FAF0F3] border border-[#E8B4B8]/60'
                  : 'bg-[#FAF8F9] hover:bg-[#FAF0F3]'
              }`}
            >
              <span className="font-extrabold text-sm text-[#4A154B] block">{orders.length}</span>
              <span className="text-[10px] text-gray-500 font-medium">Orders Placed</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('addresses')}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#FAF0F3] border border-[#E8B4B8]/60'
                  : 'bg-[#FAF8F9] hover:bg-[#FAF0F3]'
              }`}
            >
              <span className="font-extrabold text-sm text-[#4A154B] block">
                {user.savedAddresses?.length || 0}
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Addresses</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('wishlist')}
              className="p-2 rounded-xl bg-[#FAF8F9] hover:bg-[#FAF0F3] transition-colors cursor-pointer"
            >
              <span className="font-extrabold text-sm text-[#B76E79] block">{wishlistCount}</span>
              <span className="text-[10px] text-gray-500 font-medium">Wishlist Items</span>
            </button>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#FAF0F3] rounded-xl border border-[#E8B4B8]/40 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-white text-[#4A154B] shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Addresses ({user.savedAddresses?.length || 0})
          </button>
        </div>

        {/* ========================================= */}
        {/* TAB 1: OVERVIEW */}
        {/* ========================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Admin Role Switcher & Controls */}
            <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-[#4A154B]" />
                  <div>
                    <h4 className="font-serif text-xs font-bold text-gray-900">
                      Store Administration Mode
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      Switch between Customer & Admin view
                    </p>
                  </div>
                </div>

                <button
                  id="btn-toggle-admin-mode"
                  onClick={onToggleRole}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isAdmin ? 'bg-[#4A154B]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isAdmin ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {isAdmin ? (
                <div className="p-3 rounded-xl bg-[#F3EAF4] border border-[#4A154B]/30 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#4A154B]">
                    <CheckCircle2 className="w-4 h-4 text-[#4A154B]" />
                    <span>Admin Privileges Active</span>
                  </div>
                  <p className="text-[11px] text-[#2D0C34] leading-relaxed">
                    As an authorized Sagunika Admin, manage catalog, order milestones, 10 KM delivery radius, and push broadcasts.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id="btn-admin-add-product"
                      onClick={onOpenAddProductModal}
                      className="py-2.5 px-3 rounded-xl bg-white border border-[#4A154B] text-[#4A154B] font-bold text-xs shadow-2xs hover:bg-[#FAF8F9] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Product</span>
                    </button>
                    <button
                      id="btn-admin-open-panel"
                      onClick={() => onNavigate('admin_panel')}
                      className="py-2.5 px-3 rounded-xl bg-[#4A154B] text-white font-bold text-xs shadow-xs hover:bg-[#67226B] transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#FAF8F9] border border-gray-200 text-xs text-gray-600 flex items-start space-x-2">
                  <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-800 block">Customer Security Policy</span>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Your customer profile is protected with 256-bit Firebase Authentication and secure cloud storage.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Developer & Firebase Suite Architecture Tools */}
            <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-4 shadow-2xs space-y-2.5">
              <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                Developer & Backend Tools
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onOpenFlutterCode}
                  className="p-3 rounded-xl border border-[#B76E79]/50 bg-[#FAF0F3] hover:bg-[#FDF7F8] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#8C4A5A]">
                    <Code2 className="w-4 h-4 text-[#B76E79]" />
                    <span>Flutter Code</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    Export Dart Project
                  </p>
                </button>

                <button
                  onClick={onOpenFirebaseModal}
                  className="p-3 rounded-xl border border-[#4A154B]/30 bg-[#F3EAF4] hover:bg-purple-100 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-[#4A154B]">
                    <Database className="w-4 h-4 text-[#4A154B]" />
                    <span>Firebase DB</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">
                    13 Collections & Rules
                  </p>
                </button>
              </div>
            </div>

            {/* Quick Settings List */}
            <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 divide-y divide-[#EFE8ED] shadow-2xs overflow-hidden">
              {/* Notifications Toggle */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#FAF0F3] text-[#B76E79]">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">FCM Push Notifications</span>
                    <span className="text-[10px] text-gray-400">Shipment milestones & bridal launches</span>
                  </div>
                </div>
                <button
                  onClick={onToggleFCM}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    fcmEnabled ? 'bg-[#4A154B]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      fcmEnabled ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Payment & Transaction History */}
              <div
                id="btn-profile-payment-history"
                onClick={() => onNavigate('payment_history')}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F9]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Payment & Transaction History</span>
                    <span className="text-[10px] text-gray-400">Razorpay receipts, UPI, Card, NetBanking ledger</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>

              {/* Customer Support Concierge */}
              <div
                onClick={() => alert('Sagunika Luxury Concierge: concierge@sagunika.com | WhatsApp: +91 98765 43210 | Koregaon Park Studio, Pune')}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#FAF8F9]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#FAF0F3] text-[#8C4A5A]">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 block">Customer Concierge</span>
                    <span className="text-[10px] text-gray-400">Ceremonial cosmetics advice</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: ORDER HISTORY */}
        {/* ========================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#4A154B]">
                  Your Order History
                </h4>
                <p className="text-[10px] text-gray-500">
                  Real-time status updates synced with Cloud Firestore
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="text-xs font-bold text-[#8C4A5A] hover:text-[#4A154B] flex items-center space-x-1 cursor-pointer"
              >
                <span>Full Tracker</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF0F3] text-[#B76E79] mx-auto flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
                <h5 className="font-serif font-bold text-gray-900 text-sm">No Orders Placed Yet</h5>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Explore our Royal Bridal & Sovereign Groom collections to place your first luxury order.
                </p>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold shadow-xs hover:bg-[#67226B] cursor-pointer"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              orders.map((order, orderIdx) => {
                const isDelivered = order.status === 'delivered';
                return (
                  <div
                    key={`${order.id}-${orderIdx}`}
                    className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-3.5 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#EFE8ED] pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-xs text-[#4A154B]">
                          #{order.orderNumber}
                        </span>
                        <div className="flex items-center space-x-1 text-[10px] text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{order.createdAt}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDelivered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Order Item Thumbnails Strip */}
                    <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="relative w-12 h-12 rounded-xl border border-[#E8D5C4]/60 overflow-hidden flex-shrink-0"
                          title={`${item.product.name} (${item.quantity}x)`}
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {item.quantity > 1 && (
                            <span className="absolute bottom-0.5 right-0.5 bg-[#4A154B] text-white text-[9px] font-bold px-1 rounded-full">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="text-xs text-gray-600 pl-1">
                        <span className="font-semibold block">{order.items.length} item(s)</span>
                        <span className="text-[10px] text-gray-400 capitalize">
                          {order.deliveryType === 'pickup' ? 'Studio Handover' : 'BlueDart Express'}
                        </span>
                      </div>
                    </div>

                    {/* Total & Action Buttons */}
                    <div className="pt-2 border-t border-[#EFE8ED] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Total Paid</span>
                        <span className="font-bold text-xs text-[#4A154B]">
                          ₹{order.total.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {onOpenInvoice && (
                          <button
                            type="button"
                            onClick={() => onOpenInvoice(order)}
                            className="px-2 py-1.5 rounded-lg border border-[#E8D5C4] hover:border-[#B76E79] text-gray-700 hover:text-[#4A154B] bg-white text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                            title="View GST Tax Invoice"
                          >
                            <FileText className="w-3 h-3 text-[#B76E79]" />
                            <span>Invoice</span>
                          </button>
                        )}
                        {onReorder && (
                          <button
                            type="button"
                            onClick={() => onReorder(order)}
                            className="px-2.5 py-1.5 rounded-lg border border-[#B76E79] text-[#B76E79] hover:bg-[#FAF0F3] text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reorder</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onNavigate('orders')}
                          className="px-3 py-1.5 rounded-lg bg-[#4A154B] text-white hover:bg-[#67226B] text-[10px] font-bold shadow-2xs flex items-center space-x-1 cursor-pointer"
                        >
                          <Package className="w-3 h-3" />
                          <span>Track</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: SAVED ADDRESSES */}
        {/* ========================================= */}
        {activeTab === 'addresses' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h4 className="font-serif text-sm font-bold text-[#4A154B]">
                  Your Delivery Addresses
                </h4>
                <p className="text-[10px] text-gray-500">
                  10 KM delivery radius verified against Pune Studio
                </p>
              </div>
              <button
                type="button"
                id="btn-add-address-modal"
                onClick={() => setIsAddAddressModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-[#4A154B] text-white font-bold text-xs shadow-2xs hover:bg-[#67226B] flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {user.savedAddresses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF0F3] text-[#4A154B] mx-auto flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h5 className="font-serif font-bold text-gray-900 text-sm">No Saved Addresses</h5>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Add your residence or bridal suite address to enable instant checkout.
                </p>
              </div>
            ) : (
              user.savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-2 transition-all ${
                    addr.isDefault ? 'border-[#B76E79] ring-1 ring-[#B76E79]/30' : 'border-[#E8D5C4]/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-xs text-gray-900">
                        {addr.fullName}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF0F3] text-[#B76E79] border border-[#E8B4B8]/50">
                          Primary Default
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr)}
                          className="text-[11px] text-[#4A154B] hover:underline font-semibold cursor-pointer"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>

                  <div className="flex items-center space-x-2 text-[11px] text-gray-500 pt-1">
                    <Phone className="w-3 h-3 text-[#B76E79]" />
                    <span>{addr.phone}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sign Out Action Button */}
        <button
          id="btn-profile-logout"
          onClick={onLogout}
          className="w-full py-3 rounded-xl border border-red-200 text-red-600 bg-white hover:bg-red-50 text-xs font-bold transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>

      {/* ================================================= */}
      {/* MODAL 1: EDIT PROFILE (Name & Phone) */}
      {/* ================================================= */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8ED] pb-3">
              <h3 className="font-serif font-bold text-sm text-[#4A154B]">
                Edit Patron Details
              </h3>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL 2: CHANGE PROFILE PHOTO (Avatar Selector) */}
      {/* ================================================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8ED] pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#4A154B]">
                  Select Profile Photo
                </h3>
                <p className="text-[10px] text-gray-500">
                  Pick a luxury bridal avatar or upload your own
                </p>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-2">
                Bespoke Royal Avatars
              </span>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => handleSelectAvatar(av.url)}
                    className="group relative rounded-full p-0.5 border-2 hover:border-[#4A154B] transition-all overflow-hidden focus:outline-none cursor-pointer"
                    title={av.name}
                  >
                    <img
                      src={av.url}
                      alt={av.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Upload */}
            <div className="pt-2 border-t border-[#EFE8ED] space-y-2">
              <span className="text-xs font-semibold text-gray-700 block">
                Upload Custom Photo
              </span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#B76E79] bg-[#FAF0F3] hover:bg-[#FDF7F8] text-[#8C4A5A] text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4 text-[#B76E79]" />
                <span>Choose Image from Device</span>
              </button>
            </div>

            {/* URL Input */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-gray-500">Or paste image web link:</span>
              <div className="flex space-x-1.5">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-xl border border-[#E8D5C4] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarUrl.trim()) {
                      handleSelectAvatar(customAvatarUrl.trim());
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MODAL 3: ADD NEW ADDRESS */}
      {/* ================================================= */}
      {isAddAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E8D5C4] w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE8ED] pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#4A154B]">
                  Add Delivery Address
                </h3>
                <p className="text-[10px] text-gray-500">
                  Eligible for Pune 10 KM express delivery
                </p>
              </div>
              <button
                onClick={() => setIsAddAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={addressName}
                  onChange={(e) => setAddressName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={addressPhone}
                  onChange={(e) => setAddressPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A154B] mb-1">
                  Street / Apartment / Suite
                </label>
                <textarea
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  placeholder="e.g. Bungalow 12, Koregaon Park North Main Rd"
                  rows={2}
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5C4] outline-none focus:ring-2 focus:ring-[#B76E79]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A154B] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E8D5C4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#4A154B] mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    value={addressPincode}
                    onChange={(e) => setAddressPincode(e.target.value)}
                    maxLength={6}
                    required
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E8D5C4] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-default-addr"
                  checked={addressIsDefault}
                  onChange={(e) => setAddressIsDefault(e.target.checked)}
                  className="rounded text-[#4A154B] focus:ring-[#4A154B] cursor-pointer"
                />
                <label htmlFor="chk-default-addr" className="text-xs text-gray-700 cursor-pointer">
                  Set as Primary Delivery Address
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddAddressModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] shadow-xs cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
