import React from 'react';
import { X, Database, ShieldCheck, Flame, Bell, HardDrive, KeyRound, CheckCircle2 } from 'lucide-react';

interface FirebaseArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCount: number;
  orderCount: number;
}

export const FirebaseArchitectureModal: React.FC<FirebaseArchitectureModalProps> = ({
  isOpen,
  onClose,
  productCount,
  orderCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EFE8ED]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4A154B] text-white flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#4A154B]">
                Firebase Suite Architecture
              </h3>
              <p className="text-[10px] text-gray-500">
                Sagunika Cosmetic E-Commerce Infrastructure
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Firebase Authentication */}
        <div className="p-3 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#4A154B]">
            <KeyRound className="w-4 h-4 text-[#B76E79]" />
            <span>1. Firebase Authentication (Phone OTP + Google Login)</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            Supports seamless SMS OTP verification with 60-second timeouts and automatic credential syncing to Firestore, alongside one-tap Google OAuth Sign-In.
          </p>
          <div className="flex gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-gray-700">
              PhoneAuthCredential
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[10px] font-semibold text-gray-700">
              GoogleAuthProvider
            </span>
          </div>
        </div>

        {/* 2. Cloud Firestore Schema */}
        <div className="p-3 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#4A154B]">
            <Flame className="w-4 h-4 text-amber-600" />
            <span>2. Cloud Firestore Collections Schema</span>
          </div>
          <p className="text-[11px] text-gray-600">
            Real-time NoSQL document store configured with sub-collections:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
            <div className="p-2 rounded-md bg-white border border-gray-200">
              <span className="text-[#4A154B] font-bold">/products</span>
              <p className="text-gray-500 font-sans text-[9px]">{productCount} cosmetic items</p>
            </div>
            <div className="p-2 rounded-md bg-white border border-gray-200">
              <span className="text-[#4A154B] font-bold">/orders</span>
              <p className="text-gray-500 font-sans text-[9px]">{orderCount} active tracking docs</p>
            </div>
            <div className="p-2 rounded-md bg-white border border-gray-200">
              <span className="text-[#4A154B] font-bold">/users</span>
              <p className="text-gray-500 font-sans text-[9px]">Roles, FCM tokens, addresses</p>
            </div>
            <div className="p-2 rounded-md bg-white border border-gray-200">
              <span className="text-[#4A154B] font-bold">/categories</span>
              <p className="text-gray-500 font-sans text-[9px]">Wedding & Groom taxonomies</p>
            </div>
          </div>
        </div>

        {/* 3. Security Rules: Admin vs Customer Enforcement */}
        <div className="p-3 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8]/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#8C4A5A]">
            <ShieldCheck className="w-4 h-4 text-[#B76E79]" />
            <span>3. Role-Based Security Rules (Admin Enforcement)</span>
          </div>
          <p className="text-[11px] text-gray-700">
            Enforced requirement: <strong>"Only admin can add products. Customers cannot upload products. Do not add marketplace functionality."</strong>
          </p>
          <pre className="p-2.5 rounded-lg bg-[#2D0C34] text-rose-100 text-[10px] font-mono overflow-x-auto leading-tight">
{`// Cloud Firestore Security Rule
match /products/{productId} {
  allow read: if true; // Public catalog
  allow write: if request.auth != null && 
    request.auth.token.role == 'admin'; // Admin only!
}`}
          </pre>
        </div>

        {/* 4. Firebase Storage & FCM */}
        <div className="p-3 rounded-xl bg-[#FAF8F9] border border-[#E8D5C4]/60 space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#4A154B]">
            <Bell className="w-4 h-4 text-[#67226B]" />
            <span>4. Firebase Storage & Cloud Messaging (FCM)</span>
          </div>
          <p className="text-[11px] text-gray-600 leading-relaxed">
            • <strong>Firebase Storage:</strong> Houses 4K cosmetic photography, product banners, and ceremony lookbooks under <code>/products/[productId]/</code>.<br/>
            • <strong>Firebase Cloud Messaging:</strong> Automatic push notifications dispatched for order lifecycle tracking and bridal discount campaigns.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#4A154B] text-white font-bold text-xs hover:bg-[#67226B] transition-colors"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
