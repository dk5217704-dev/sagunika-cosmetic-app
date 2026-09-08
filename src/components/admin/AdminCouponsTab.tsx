import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Sparkles,
  Percent,
  Calendar,
  AlertTriangle,
  Gift,
  Check,
  ShieldCheck
} from 'lucide-react';
import { CouponRecord } from '../../types';
import { firestoreRepo } from '../../services/firebase';

export const AdminCouponsTab: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState('20');
  const [minOrder, setMinOrder] = useState('2999');
  const [maxDiscount, setMaxDiscount] = useState('1500');
  const [description, setDescription] = useState('Exclusive Royal Wedding 20% discount voucher');
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [active, setActive] = useState(true);

  // Test Code Validator
  const [testCode, setTestCode] = useState('');
  const [testOrderTotal, setTestOrderTotal] = useState('4500');
  const [testResult, setTestResult] = useState<{ valid: boolean; discount: number; message: string } | null>(null);

  // Deletion State
  const [couponToDelete, setCouponToDelete] = useState<CouponRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCoupons(firestoreRepo.getCoupons());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountPercent('20');
    setMinOrder('2999');
    setMaxDiscount('1500');
    setDescription('Exclusive Royal Wedding 20% discount voucher');
    setValidUntil('2026-12-31');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CouponRecord) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountPercent(c.discountPercent.toString());
    setMinOrder(c.minOrder.toString());
    setMaxDiscount(c.maxDiscount.toString());
    setDescription(c.description);
    setValidUntil(c.validUntil);
    setActive(c.active);
    setIsModalOpen(true);
  };

  const handleToggleActive = (c: CouponRecord) => {
    const updated = firestoreRepo.updateCoupon(c.id, { active: !c.active });
    setCoupons(updated);
    showToast(`Coupon ${c.code} marked ${!c.active ? 'Active' : 'Deactivated'}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const cleanCode = code.trim().toUpperCase();

    if (editingCoupon) {
      const updated = firestoreRepo.updateCoupon(editingCoupon.id, {
        code: cleanCode,
        discountPercent: parseInt(discountPercent) || 10,
        minOrder: parseInt(minOrder) || 0,
        maxDiscount: parseInt(maxDiscount) || 1000,
        description: description.trim(),
        validUntil,
        active
      });
      setCoupons(updated);
      showToast(`Updated coupon ${cleanCode}.`);
    } else {
      const newCoupon: CouponRecord = {
        id: `cpn-${Date.now()}`,
        code: cleanCode,
        discountPercent: parseInt(discountPercent) || 10,
        minOrder: parseInt(minOrder) || 0,
        maxDiscount: parseInt(maxDiscount) || 1000,
        description: description.trim(),
        validUntil,
        active
      };
      const updated = firestoreRepo.addCoupon(newCoupon);
      setCoupons(updated);
      showToast(`Added coupon code ${cleanCode}.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!couponToDelete) return;
    const updated = firestoreRepo.deleteCoupon(couponToDelete.id);
    setCoupons(updated);
    showToast(`Removed coupon ${couponToDelete.code}.`);
    setCouponToDelete(null);
  };

  const runTestValidation = () => {
    if (!testCode.trim()) return;
    const res = firestoreRepo.validateCoupon(testCode, parseInt(testOrderTotal) || 0);
    setTestResult(res);
  };

  return (
    <div id="admin-coupons-tab" className="space-y-4">
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
              <Tag className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Promotional Discount Coupons ({coupons.length})
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore collection: <code className="text-gray-700">coupons</code>
          </p>
        </div>

        <button
          id="btn-add-coupon"
          onClick={openAddModal}
          className="py-2 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Promo Code</span>
        </button>
      </div>

      {/* Interactive Coupon Validation Tester */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#FAF0F3] to-[#FDF5F7] border border-[#E8B4B8]/60 space-y-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#B76E79]" />
          <span className="text-xs font-bold text-[#4A154B]">
            Real-Time Checkout Rule Simulator
          </span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter coupon code (e.g. SAGUNIKA20)"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-white text-xs border border-gray-300 rounded-xl uppercase font-mono font-bold"
          />
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Order: ₹</span>
            <input
              type="number"
              value={testOrderTotal}
              onChange={(e) => setTestOrderTotal(e.target.value)}
              className="w-24 px-2 py-1.5 bg-white text-xs border border-gray-300 rounded-xl font-mono"
            />
            <button
              onClick={runTestValidation}
              className="px-3 py-1.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] cursor-pointer"
            >
              Validate
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
              testResult.valid
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.valid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {coupons.map((c) => (
          <div
            key={c.id}
            id={`coupon-card-${c.id}`}
            className="bg-white rounded-2xl border border-[#E8D5C4] p-4 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="px-2.5 py-1 rounded-lg bg-[#FAF0F3] border border-[#E8B4B8] font-mono font-bold text-sm text-[#4A154B] tracking-wider">
                    {c.code}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      c.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {c.active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <span className="font-serif text-lg font-bold text-[#B76E79]">
                  {c.discountPercent}% OFF
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-2 font-medium">{c.description}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Min Order</span>
                  <span className="font-mono font-bold text-gray-800">
                    ₹{c.minOrder.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Max Discount</span>
                  <span className="font-mono font-bold text-gray-800">
                    ₹{c.maxDiscount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Expires On</span>
                  <span className="font-medium text-gray-700">{c.validUntil}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Eligibility</span>
                  <span className="font-medium text-emerald-700">All Patrons</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button
                onClick={() => handleToggleActive(c)}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                {c.active ? 'Deactivate' : 'Activate'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="py-1 px-3 rounded-lg border border-gray-200 text-gray-700 hover:text-[#4A154B] hover:bg-[#FAF0F3] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setCouponToDelete(c)}
                  className="py-1 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT COUPON */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingCoupon ? 'Edit Coupon Code' : 'Issue New Promo Voucher'}
                  </h3>
                  <span className="text-[10px] text-gray-500">Firestore Coupon Engine</span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Coupon Code (Uppercase) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAGUNIKA25"
                  className="w-full p-2.5 rounded-xl border border-gray-300 font-mono font-bold focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Discount % *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Promotion Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Royal Wedding Special 20% savings on purchases above ₹2,999"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-coupon-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-[#4A154B] rounded border-gray-300 focus:ring-[#4A154B]"
                />
                <label htmlFor="chk-coupon-active" className="font-bold text-gray-700 cursor-pointer">
                  Activate Promo Code Immediately
                </label>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-coupon"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs"
                >
                  {editingCoupon ? 'Save Voucher' : 'Publish Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-rose-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">Delete Voucher</h4>
                <p className="text-[10px] text-gray-500">Action cannot be reversed.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to delete coupon code <strong className="text-gray-900 font-mono font-bold">"{couponToDelete.code}"</strong>?
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setCouponToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Keep
              </button>
              <button
                type="button"
                id="btn-confirm-delete-coupon"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
