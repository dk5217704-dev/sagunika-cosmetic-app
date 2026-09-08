import React, { useState } from 'react';
import {
  Heart,
  Bell,
  Sparkles,
  Crown,
  ShoppingBag,
  Star,
  Flame,
  ArrowRight,
  ShieldCheck,
  Award,
  Check,
  SlidersHorizontal,
  PackageCheck
} from 'lucide-react';
import { Product, ScreenName } from '../../types';
import { ProductCatalogControls, FilterState } from '../ProductCatalogControls';
import { filterAndSortProducts } from '../../utils/productFilters';

interface HomeScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenName) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onSelectProduct,
  onNavigate,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  cartProductIds,
  unreadNotificationCount,
  onOpenNotifications,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    priceRange: 'all',
    occasion: 'all',
    sortBy: 'featured',
    inStockOnly: false,
  });

  // Filter and sort products based on comprehensive controls
  const filteredProducts = filterAndSortProducts(products, filters);

  return (
    <div id="screen-home" className="pb-28 bg-[#FAF8F9] min-h-screen">
      {/* Top Luxury App Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#B76E79] to-[#4A154B] p-[2px] shadow-xs">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-serif font-bold text-xs text-[#4A154B]">
                SC
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-serif text-base font-extrabold tracking-wider text-[#4A154B]">
                  SAGUNIKA
                </span>
                <span className="text-[10px] font-bold text-[#B76E79] tracking-widest uppercase">
                  COSMETIC
                </span>
              </div>
              <p className="text-[9px] text-gray-500 font-medium tracking-tight">
                Beauty That Inspires Confidence • Pure Gold & Rose
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              id="btn-nav-wishlist-header"
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 rounded-full hover:bg-[#FAF0F3] text-[#4A154B] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 text-[#8C4A5A]" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B76E79] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            <button
              id="btn-nav-notifications"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-[#FAF0F3] text-[#4A154B] transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-[#4A154B]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#4A154B] rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Promotional Banner */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2D0C34] via-[#4A154B] to-[#7B287D] text-white p-5 shadow-[0_8px_25px_rgba(74,21,75,0.22)]">
          {/* Subtle gold floral glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#E8D5C4]/20 to-transparent rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-sm space-y-2">
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#B76E79]/80 backdrop-blur-xs text-[10px] font-bold tracking-wider uppercase text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>Wedding Edition 2026</span>
            </div>
            <h3 className="font-serif text-xl font-bold leading-tight">
              The Royal Bridal Trousseau Vault
            </h3>
            <p className="text-[11px] text-[#E8D5C4] line-clamp-2">
              Complete 24K Gold & Rose Velvet Ceremonial essentials for bridal radiance and royal groom confidence.
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <button
                id="btn-hero-explore-wedding"
                onClick={() => onNavigate('wedding')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white text-[#4A154B] text-xs font-bold shadow-xs hover:bg-[#FAF0F3] active:scale-95 transition-all"
              >
                <span>Shop Bridal Edit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-hero-explore-groom"
                onClick={() => onNavigate('groom')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white/15 border border-white/30 text-white text-xs font-bold hover:bg-white/25 active:scale-95 transition-all"
              >
                <span>Groom Trunk</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Collections Shortcut Duo */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {/* Wedding Collection Shortcut */}
        <div
          id="card-nav-wedding"
          onClick={() => onNavigate('wedding')}
          className="cursor-pointer relative overflow-hidden rounded-xl border border-[#E8B4B8]/70 bg-gradient-to-br from-[#FDF7F8] to-[#FAF0F3] p-3.5 shadow-2xs hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#B76E79] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#B76E79] block">
            Exclusive
          </span>
          <h4 className="font-serif text-sm font-bold text-[#4A154B] leading-tight">
            Wedding Collection
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Bridal Trousseau & Sindoor Sets
          </p>
          <div className="mt-2 text-[10px] font-bold text-[#8C4A5A] flex items-center space-x-1">
            <span>Explore Bridal Vault</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Groom Collection Shortcut */}
        <div
          id="card-nav-groom"
          onClick={() => onNavigate('groom')}
          className="cursor-pointer relative overflow-hidden rounded-xl border border-[#4A154B]/20 bg-gradient-to-br from-[#FAF8FA] to-[#F3EAF4] p-3.5 shadow-2xs hover:shadow-md transition-all active:scale-[0.98] group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#4A154B] text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-110 transition-transform">
            <Crown className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#67226B] block">
            Gentleman's Edit
          </span>
          <h4 className="font-serif text-sm font-bold text-[#2D0C34] leading-tight">
            Groom Collection
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Beard Elixirs, Oud & Aftershaves
          </p>
          <div className="mt-2 text-[10px] font-bold text-[#4A154B] flex items-center space-x-1">
            <span>Explore Groom Trunk</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Flash Sale Banner Strip */}
      <div className="mt-4 mx-4 p-2.5 rounded-xl bg-gradient-to-r from-[#FAF0F3] to-[#FDF7F8] border border-[#E8B4B8]/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-[#B76E79] text-white">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#4A154B] block">
              Sagunika Flash Sale
            </span>
            <span className="text-[10px] text-gray-500">
              Extra 20% off with code <strong className="text-[#B76E79]">SAGUNIKA20</strong>
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-white border border-[#E8B4B8] text-[#8C4A5A]">
          Ends in 06:45:12
        </span>
      </div>

      {/* PRODUCT CATALOG SEARCH, FILTER, AND SORT CONTROLS */}
      <div className="mt-5 px-4">
        <ProductCatalogControls
          filters={filters}
          onFilterChange={setFilters}
          totalProductsCount={products.length}
          filteredCount={filteredProducts.length}
        />
      </div>

      {/* PRODUCT CARDS RESPONSIVE GRID */}
      <div className="mt-4 px-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8D5C4]/60 p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF0F3] flex items-center justify-center text-[#B76E79]">
              <PackageCheck className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-base font-bold text-[#4A154B]">
              No Formulations Match Your Filter
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              We couldn't find products matching the selected category, price band, or occasion. Try adjusting your search or clearing active filters.
            </p>
            <button
              onClick={() =>
                setFilters({
                  searchQuery: '',
                  category: 'all',
                  priceRange: 'all',
                  occasion: 'all',
                  sortBy: 'featured',
                  inStockOnly: false,
                })
              }
              className="px-4 py-2 rounded-xl bg-[#4A154B] text-white text-xs font-bold shadow-xs hover:bg-[#67226B]"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const isInCart = cartProductIds.includes(product.id);

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group bg-white rounded-2xl border border-[#E8D5C4]/70 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative"
                >
                  {/* Image & Wishlist Button */}
                  <div className="relative bg-[#FAF8F9] aspect-square overflow-hidden cursor-pointer">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {product.collection === 'wedding' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#B76E79] text-white text-[8px] font-bold uppercase tracking-wider shadow-2xs">
                          Wedding
                        </span>
                      )}
                      {product.collection === 'groom' && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#4A154B] text-white text-[8px] font-bold uppercase tracking-wider shadow-2xs">
                          Groom
                        </span>
                      )}
                      {product.discountPercentage > 0 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/95 text-[#8C4A5A] text-[9px] font-bold shadow-2xs">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>

                    {/* Wishlist Heart */}
                    <button
                      id={`btn-wishlist-toggle-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-[#B76E79] shadow-xs active:scale-90 transition-all z-10"
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isWishlisted ? 'fill-[#B76E79] text-[#B76E79]' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center text-amber-400">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-700">
                            {product.rating}
                          </span>
                          <span className="text-[9px] text-gray-400">
                            ({product.reviewCount})
                          </span>
                        </div>

                        {product.stockQuantity < 20 && (
                          <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-sm">
                            {product.stockQuantity} left
                          </span>
                        )}
                      </div>

                      <span className="text-[9px] font-bold text-[#B76E79] uppercase tracking-wider block truncate">
                        {product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4A154B] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Pricing and Add to Cart */}
                    <div className="mt-2.5 pt-2 border-t border-[#EFE8ED] flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xs font-bold text-[#4A154B]">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[9px] text-gray-400 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        id={`btn-add-cart-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        className={`p-2 rounded-xl transition-all active:scale-90 flex items-center space-x-1 ${
                          isInCart
                            ? 'bg-[#2E7D32] text-white shadow-2xs'
                            : 'bg-[#4A154B] text-white hover:bg-[#67226B] shadow-2xs'
                        }`}
                        title={isInCart ? 'Already in Bag' : 'Add to Bag'}
                      >
                        {isInCart ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Trust Assurances */}
      <div className="mt-8 mx-4 p-4 rounded-2xl bg-white border border-[#E8D5C4]/70 space-y-3">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#4A154B] text-center">
          Sagunika Beauty Standard
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#FAF8F9]">
            <Award className="w-4 h-4 text-[#B76E79] mb-1" />
            <span className="text-[10px] font-bold text-gray-800">100% Genuine</span>
            <span className="text-[8px] text-gray-400">Authentic Batch</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#FAF8F9]">
            <Sparkles className="w-4 h-4 text-[#4A154B] mb-1" />
            <span className="text-[10px] font-bold text-gray-800">24K Radiance</span>
            <span className="text-[8px] text-gray-400">Noble Extracts</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-[#FAF8F9]">
            <ShieldCheck className="w-4 h-4 text-[#B76E79] mb-1" />
            <span className="text-[10px] font-bold text-gray-800">Safe Formula</span>
            <span className="text-[8px] text-gray-400">Derm Tested</span>
          </div>
        </div>
      </div>
    </div>
  );
};
