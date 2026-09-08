import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Trash2,
  Sparkles,
  Check,
  Search,
  ArrowUpDown,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { Product, ScreenName } from '../../types';

interface WishlistScreenProps {
  wishlistProducts: Product[];
  onRemoveWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onAddAllToCart?: () => void;
  onClearWishlist?: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenName) => void;
  cartProductIds: string[];
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistProducts,
  onRemoveWishlist,
  onMoveToCart,
  onAddAllToCart,
  onClearWishlist,
  onSelectProduct,
  onNavigate,
  cartProductIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [showClearModal, setShowClearModal] = useState(false);

  // Filter & Sort inside wishlist
  const filteredWishlist = wishlistProducts
    .filter((product) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.subtitle.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.tags.some((t) => t.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div id="screen-wishlist" className="pb-28 bg-[#FAF8F9] min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            id="btn-wishlist-back"
            onClick={() => onNavigate('home')}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-serif text-base font-bold text-[#4A154B]">
              My Wishlist
            </h2>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-[#B76E79] font-semibold">
                {wishlistProducts.length} Saved {wishlistProducts.length === 1 ? 'Creation' : 'Creations'}
              </span>
              <span className="text-[9px] text-gray-300">•</span>
              <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-medium">
                ☁️ Firestore Synced
              </span>
            </div>
          </div>
        </div>

        {wishlistProducts.length > 0 && onClearWishlist && (
          <button
            id="btn-wishlist-clear-all"
            onClick={() => setShowClearModal(true)}
            className="text-[11px] font-semibold text-gray-500 hover:text-red-600 transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-xl border border-[#E8D5C4] text-center space-y-3">
            <Trash2 className="w-8 h-8 text-red-500 mx-auto" />
            <h4 className="font-serif text-base font-bold text-[#4A154B]">
              Clear Wishlist?
            </h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to remove all saved creations? This will update your Firestore database.
            </p>
            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearWishlist?.();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {wishlistProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center p-8 text-center mt-12 space-y-4 bg-white rounded-3xl border border-[#E8D5C4]/60 shadow-xs max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] flex items-center justify-center text-[#B76E79]">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-[#2D0C34]">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Save your cherished bridal trousseau sets, groom trunks, and 24K gold serums to easily purchase them anytime.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full">
              <button
                id="btn-wishlist-explore-wedding"
                onClick={() => onNavigate('wedding')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#B76E79] text-white font-semibold text-xs shadow-xs hover:bg-[#8C4A5A] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Shop Wedding Vault</span>
              </button>
              <button
                id="btn-wishlist-explore-groom"
                onClick={() => onNavigate('groom')}
                className="flex-1 py-3 px-4 rounded-xl bg-[#4A154B] text-white font-semibold text-xs shadow-xs hover:bg-[#67226B] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Shop Groom Trunk</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Top Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-[#E8D5C4]/60 shadow-2xs">
              {/* Internal Wishlist Search */}
              <div className="relative flex-1 min-w-[180px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter saved items..."
                  className="w-full bg-[#FAF8F9] pl-8 pr-3 py-1.5 text-xs text-gray-800 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#B76E79]"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
              </div>

              {/* Sort selector */}
              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF8F9] px-2.5 py-1.5 text-xs font-semibold text-gray-700 rounded-xl border border-[#E8D5C4] focus:outline-none focus:border-[#B76E79]"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>

                {/* Bulk "Add All to Bag" button */}
                {onAddAllToCart && (
                  <button
                    id="btn-wishlist-add-all"
                    onClick={onAddAllToCart}
                    className="px-3.5 py-1.5 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center space-x-1 shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add All to Bag</span>
                  </button>
                )}
              </div>
            </div>

            {/* Wishlist Items Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {filteredWishlist.map((product) => {
                const isInCart = cartProductIds.includes(product.id);

                return (
                  <div
                    key={product.id}
                    id={`wishlist-item-${product.id}`}
                    className="bg-white rounded-2xl border border-[#E8D5C4]/70 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                  >
                    {/* Thumbnail & Image */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="relative bg-[#FAF8F9] aspect-square overflow-hidden cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Collection Badge */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.collection === 'wedding' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#B76E79] text-white text-[8px] font-bold uppercase tracking-wider">
                            Wedding
                          </span>
                        )}
                        {product.collection === 'groom' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#4A154B] text-white text-[8px] font-bold uppercase tracking-wider">
                            Groom
                          </span>
                        )}
                      </div>

                      {/* Remove Trash Button */}
                      <button
                        id={`btn-remove-wishlist-${product.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveWishlist(product.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 shadow-xs transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                        <span className="text-[9px] font-bold text-[#B76E79] uppercase tracking-wider block">
                          {product.brand}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4A154B] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                          {product.subtitle}
                        </p>

                        <div className="mt-1.5 flex items-baseline space-x-1.5">
                          <span className="text-xs font-bold text-[#4A154B]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[9px] text-gray-400 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                          {product.discountPercentage > 0 && (
                            <span className="text-[9px] font-bold text-emerald-700">
                              ({product.discountPercentage}% off)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action: Move to Cart */}
                      <div className="mt-3 pt-2.5 border-t border-[#EFE8ED]">
                        <button
                          id={`btn-wishlist-cart-${product.id}`}
                          onClick={() => onMoveToCart(product)}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active:scale-95 ${
                            isInCart
                              ? 'bg-[#2E7D32] text-white shadow-2xs'
                              : 'bg-[#4A154B] text-white hover:bg-[#67226B] shadow-2xs'
                          }`}
                        >
                          {isInCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Move to Bag</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
