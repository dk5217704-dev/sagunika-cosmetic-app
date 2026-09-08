import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Tag,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Heart,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  CloudCheck,
  Truck,
  HelpCircle
} from 'lucide-react';
import { CartItem, Product, ScreenName } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onMoveToWishlist?: (product: Product) => void;
  onClearCart?: () => void;
  onNavigate: (screen: ScreenName) => void;
  onProceedToCheckout: (discountAmount: number, appliedCoupon: string) => void;
  freeDeliveryThreshold?: number;
  standardDeliveryFee?: number;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onNavigate,
  onProceedToCheckout,
  freeDeliveryThreshold = 999,
  standardDeliveryFee = 99,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('SAGUNIKA20');
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Financial calculations
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalMRP = cartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice || item.product.price) * item.quantity,
    0
  );

  const productSavings = Math.max(0, totalMRP - itemsSubtotal);

  // Validate applied coupon with real Firestore repository
  let couponDiscount = 0;
  if (appliedCoupon && itemsSubtotal > 0) {
    const couponResult = firestoreRepo.validateCoupon(appliedCoupon, itemsSubtotal);
    if (couponResult.valid) {
      couponDiscount = couponResult.discount;
    }
  }

  const isFreeDelivery = itemsSubtotal >= freeDeliveryThreshold || itemsSubtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : standardDeliveryFee;
  const grandTotal = Math.max(0, itemsSubtotal - couponDiscount + deliveryFee);

  // Available coupons for quick click
  const availableCoupons = firestoreRepo.getCoupons().filter((c) => c.active);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    const result = firestoreRepo.validateCoupon(code, itemsSubtotal);
    if (result.valid) {
      setAppliedCoupon(code);
      setCouponMessage(result.message);
      setCouponError(null);
      setCouponCode('');
    } else {
      setCouponError(result.message);
      setCouponMessage(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
    setCouponMessage(null);
  };

  return (
    <div id="screen-cart" className="pb-32 bg-[#FAF8F9] min-h-screen">
      {/* Top Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            id="btn-cart-back"
            onClick={() => onNavigate('home')}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-serif text-base font-bold text-[#4A154B]">
              Luxury Bag
            </h2>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[#B76E79] font-semibold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Formulations
              </span>
              <span className="text-[9px] text-gray-300">•</span>
              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-medium flex items-center space-x-0.5">
                <span>☁️ Firestore Synced</span>
              </span>
            </div>
          </div>
        </div>

        {cartItems.length > 0 && onClearCart && (
          <button
            id="btn-cart-clear-all"
            onClick={() => setShowClearConfirm(true)}
            className="text-[11px] font-semibold text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Bag
          </button>
        )}
      </div>

      {/* Clear Bag Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-[#E8D5C4] text-center space-y-3">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto" />
            <h4 className="font-serif text-base font-bold text-[#4A154B]">
              Clear Luxury Bag?
            </h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove all items from your bag? This will update your cloud storage.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearCart?.();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-4">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center p-8 text-center mt-12 space-y-4 bg-white rounded-3xl border border-[#E8D5C4]/60 shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] flex items-center justify-center text-[#4A154B]">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#2D0C34]">
                Your Bag is Empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our handcrafted 24K Gold Wedding Trousseau, Royal Groom Trunks, and Damask Rose skincare elixirs.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <button
                id="btn-cart-start-shopping"
                onClick={() => onNavigate('home')}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#67226B] text-white font-semibold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Creations</span>
              </button>
              <button
                onClick={() => onNavigate('wishlist')}
                className="py-3 px-6 rounded-xl bg-white border border-[#E8D5C4] text-[#4A154B] font-semibold text-xs hover:bg-[#FAF0F3] transition-all flex items-center space-x-1.5"
              >
                <Heart className="w-4 h-4 text-[#B76E79]" />
                <span>View Wishlist</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Cart: Responsive 2-Column Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column (Span 2 on desktop): Free Shipping Bar & Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4]/70 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Truck className="w-4 h-4 text-[#B76E79]" />
                    <span className="font-semibold text-gray-800">
                      {isFreeDelivery
                        ? '🎉 You unlocked FREE Luxury Pune Express Delivery!'
                        : `Add ₹${(freeDeliveryThreshold - itemsSubtotal).toLocaleString()} more for Free Express Delivery`}
                    </span>
                  </div>
                  <span className="font-bold text-[#B76E79]">
                    {isFreeDelivery ? 'FREE' : `₹${standardDeliveryFee}`}
                  </span>
                </div>
                <div className="w-full bg-[#FAF0F3] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#B76E79] to-[#4A154B] transition-all duration-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (itemsSubtotal / freeDeliveryThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const maxStock = item.product.stockQuantity || 99;
                  const itemMRP = (item.product.originalPrice || item.product.price) * item.quantity;
                  const itemTotal = item.product.price * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      id={`cart-item-${item.product.id}`}
                      className="bg-white rounded-2xl border border-[#E8D5C4]/70 p-3.5 shadow-2xs flex flex-col sm:flex-row gap-3 relative hover:shadow-xs transition-shadow"
                    >
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#FAF8F9] flex-shrink-0 border border-[#E8D5C4]/40">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[9px] font-bold text-[#B76E79] uppercase tracking-wider">
                                {item.product.brand}
                              </span>
                              {item.product.collection === 'wedding' && (
                                <span className="text-[8px] font-bold bg-[#FAF0F3] text-[#8C4A5A] px-1.5 py-0.2 rounded-sm uppercase">
                                  Wedding
                                </span>
                              )}
                              {item.product.collection === 'groom' && (
                                <span className="text-[8px] font-bold bg-[#FAF8FA] text-[#4A154B] px-1.5 py-0.2 rounded-sm uppercase">
                                  Groom
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-gray-500 line-clamp-1">
                              {item.product.subtitle}
                            </p>

                            {item.selectedShadeOrSize && (
                              <span className="inline-block mt-1 text-[10px] font-medium text-gray-600 bg-[#FAF8F9] px-2 py-0.5 rounded-md border border-[#E8D5C4]/50">
                                Shade: {item.selectedShadeOrSize}
                              </span>
                            )}
                          </div>

                          <div className="text-right flex-shrink-0">
                            <div className="text-xs sm:text-sm font-bold text-[#4A154B]">
                              ₹{itemTotal.toLocaleString()}
                            </div>
                            {itemMRP > itemTotal && (
                              <div className="text-[10px] text-gray-400 line-through">
                                ₹{itemMRP.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions Row: Move to Wishlist, Quantity, Trash */}
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#EFE8ED]">
                          <div className="flex items-center space-x-2">
                            {onMoveToWishlist && (
                              <button
                                id={`btn-move-wishlist-${item.product.id}`}
                                onClick={() => onMoveToWishlist(item.product)}
                                className="text-[11px] font-semibold text-[#8C4A5A] hover:text-[#4A154B] flex items-center space-x-1 py-1 px-2 rounded-lg hover:bg-[#FAF0F3] transition-colors"
                                title="Move to Wishlist"
                              >
                                <Heart className="w-3.5 h-3.5 text-[#B76E79]" />
                                <span>Save for Later</span>
                              </button>
                            )}

                            <button
                              id={`btn-remove-cart-${item.product.id}`}
                              onClick={() => onRemoveItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-[#E8D5C4] rounded-xl overflow-hidden bg-[#FAF8F9] shadow-2xs">
                            <button
                              id={`btn-qty-minus-${item.product.id}`}
                              onClick={() =>
                                onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                              }
                              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#4A154B]">
                              {item.quantity}
                            </span>
                            <button
                              id={`btn-qty-plus-${item.product.id}`}
                              onClick={() => {
                                if (item.quantity < maxStock) {
                                  onUpdateQuantity(item.product.id, item.quantity + 1);
                                }
                              }}
                              disabled={item.quantity >= maxStock}
                              className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-700 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                              title={item.quantity >= maxStock ? 'Max stock reached' : 'Add one more'}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Assurance Strip */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4]/60 flex items-center space-x-3 text-xs text-gray-600">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-800 block">
                    Sagunika Luxury Assurance
                  </span>
                  <span className="text-[11px] text-gray-500">
                    Insured discreet packaging, temperature-controlled delivery & 100% genuine formulations guaranteed.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (Span 1 on desktop): Vouchers & Order Summary */}
            <div className="space-y-4">
              {/* Coupon Section */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4]/70 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#B76E79]" />
                    <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                      Luxury Coupons
                    </h4>
                  </div>
                  {appliedCoupon && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-[11px] font-bold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-[#FAF0F3] border border-[#E8B4B8] flex items-start justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#4A154B] block">
                        Code: {appliedCoupon}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {couponMessage || `You saved ₹${couponDiscount.toLocaleString()}!`}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        id="input-cart-coupon"
                        type="text"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          setCouponError(null);
                        }}
                        placeholder="e.g. SAGUNIKA20"
                        className="flex-1 bg-[#FAF8F9] px-3 py-2 text-xs uppercase font-semibold text-gray-800 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#B76E79]"
                      />
                      <button
                        id="btn-apply-coupon"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] shadow-2xs"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-500 flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{couponError}</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Available Coupons Pills */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Available Offers:
                  </span>
                  <div className="space-y-1.5">
                    {availableCoupons.map((coupon) => {
                      const isCurrentlyApplied = appliedCoupon === coupon.code;
                      return (
                        <div
                          key={coupon.id}
                          onClick={() => !isCurrentlyApplied && handleApplyCoupon(coupon.code)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-[11px] ${
                            isCurrentlyApplied
                              ? 'bg-[#FAF0F3] border-[#B76E79] text-[#4A154B]'
                              : 'bg-white border-dashed border-[#E8D5C4] text-gray-700 hover:border-[#B76E79] hover:bg-[#FAF8F9]'
                          }`}
                        >
                          <div>
                            <span className="font-bold font-mono text-[#4A154B]">
                              {coupon.code}
                            </span>
                            <p className="text-[10px] text-gray-500">
                              {coupon.description} (Min ₹{coupon.minOrder})
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-[#B76E79]">
                            {isCurrentlyApplied ? 'Applied ✓' : 'Tap to Apply'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Bill Summary */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8D5C4]/70 shadow-2xs space-y-2.5">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B]">
                  Bill Breakdown
                </h4>

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Total MRP</span>
                  <span className="font-semibold text-gray-800">
                    ₹{totalMRP.toLocaleString()}
                  </span>
                </div>

                {productSavings > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700">
                    <span>Product Catalog Discount</span>
                    <span className="font-semibold">-₹{productSavings.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    ₹{itemsSubtotal.toLocaleString()}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-medium">
                    <span>Voucher ({appliedCoupon})</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-gray-600">
                  <span>Express Delivery Fee</span>
                  <span className="font-semibold text-gray-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Applicable GST & Luxury Cess</span>
                  <span>Included in MRP</span>
                </div>

                <div className="pt-2.5 border-t border-[#EFE8ED] flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-sm font-bold text-[#2D0C34] block">
                      Grand Total Payable
                    </span>
                    {(productSavings > 0 || couponDiscount > 0) && (
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        Total savings: ₹{(productSavings + couponDiscount).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-extrabold text-[#4A154B]">
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>

                {/* Checkout CTA for Desktop */}
                <button
                  id="btn-cart-checkout-desktop"
                  onClick={() => onProceedToCheckout(couponDiscount, appliedCoupon || '')}
                  className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Checkout Button Bar for Mobile Screens */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E8D5C4] px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(74,21,75,0.12)]">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-medium">
                Grand Total
              </span>
              <span className="text-base font-extrabold text-[#4A154B]">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            <button
              id="btn-proceed-checkout-mobile"
              onClick={() => onProceedToCheckout(couponDiscount, appliedCoupon || '')}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center space-x-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
