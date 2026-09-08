import React, { useState } from 'react';
import { Crown, ArrowLeft, Heart, ShoppingBag, Star, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, ScreenName } from '../../types';

interface GroomCollectionScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigate: (screen: ScreenName) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  cartProductIds: string[];
}

export const GroomCollectionScreen: React.FC<GroomCollectionScreenProps> = ({
  products,
  onSelectProduct,
  onNavigate,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  cartProductIds,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'beard' | 'fragrance' | 'shave'>('all');

  // Filter products for the Groom collection
  const groomProducts = products.filter((p) => {
    const isGroom = p.collection === 'groom' || p.tags.includes('Groom') || p.category === 'groom';
    if (!isGroom) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'beard') return p.tags.includes('Beard');
    if (activeFilter === 'fragrance') return p.category === 'fragrance' || p.tags.includes('Oud');
    if (activeFilter === 'shave') return p.tags.includes('Shaving') || p.tags.includes('Aftershave');
    return true;
  });

  return (
    <div id="screen-groom-collection" className="pb-24 bg-[#FAF8FA] min-h-screen">
      {/* Top Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest text-[#B76E79] uppercase block">
            SAGUNIKA MEN
          </span>
          <h2 className="font-serif text-base font-bold text-[#2D0C34]">
            Groom Collection
          </h2>
        </div>
        <div className="w-8" />
      </div>

      {/* Hero Banner for Groom */}
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1A0720] via-[#2D0C34] to-[#4A154B] text-white p-5 shadow-[0_6px_20px_rgba(45,12,52,0.3)]">
          <div className="relative z-10 space-y-1.5">
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[#B76E79]/30 border border-[#B76E79]/50 text-[10px] font-bold text-[#E8D5C4] uppercase">
              <Crown className="w-3 h-3 text-[#B76E79]" />
              <span>Gentleman's Royal Suite</span>
            </div>
            <h3 className="font-serif text-xl font-bold">
              The Modern Royal Groom
            </h3>
            <p className="text-[11px] text-gray-300 max-w-[260px]">
              Formulated with Cambodian Oud, Mysore Sandalwood, and Volcanic Detox for the wedding spotlight.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Filter Tabs */}
      <div className="px-4 flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Grooming' },
          { id: 'beard', label: 'Beard Care' },
          { id: 'fragrance', label: 'Royal Oud & Scents' },
          { id: 'shave', label: 'Shaving & Balm' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'bg-white text-gray-600 border border-[#E8D5C4]/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Groom Products Grid */}
      <div className="mt-4 px-4">
        <div className="grid grid-cols-2 gap-3">
          {groomProducts.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isInCart = cartProductIds.includes(product.id);

            return (
              <div
                key={product.id}
                id={`groom-product-${product.id}`}
                className="group bg-white rounded-2xl border border-[#4A154B]/15 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image & Wishlist Button */}
                <div className="relative bg-[#F3EAF4]/30 aspect-square overflow-hidden cursor-pointer">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    onClick={() => onSelectProduct(product)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#2D0C34] text-white text-[8px] font-bold tracking-wider">
                      GROOM
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-gray-400 hover:text-[#B76E79] shadow-xs active:scale-90 transition-all"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted ? 'fill-[#B76E79] text-[#B76E79]' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div onClick={() => onSelectProduct(product)} className="cursor-pointer">
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-gray-700">
                        {product.rating}
                      </span>
                      <span className="text-[9px] text-gray-400">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#4A154B] transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#EFE8ED] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2D0C34]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onAddToCart(product)}
                      className={`p-2 rounded-xl transition-all active:scale-90 ${
                        isInCart ? 'bg-[#2E7D32] text-white' : 'bg-[#4A154B] text-white'
                      }`}
                      title={isInCart ? 'In Cart' : 'Add to Cart'}
                    >
                      {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
