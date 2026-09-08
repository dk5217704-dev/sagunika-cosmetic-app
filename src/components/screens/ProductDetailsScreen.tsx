import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  Leaf,
  ChevronRight,
} from 'lucide-react';
import { Product, ScreenName } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductDetailsScreenProps {
  product: Product;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, selectedShade?: string) => void;
  onBuyNow: (product: Product, quantity: number, selectedShade?: string) => void;
  onNavigate: (screen: ScreenName) => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  product,
  onBack,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onNavigate,
}) => {
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState(product.shadesOrSizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'how_to_use'>('details');
  const [addedToast, setAddedToast] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedShade);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity, selectedShade);
  };

  return (
    <div id="screen-product-details" className="pb-28 bg-[#FAF8F9] min-h-screen">
      {/* Top Floating App Bar */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md z-30 px-4 py-3 border-b border-[#E8D5C4]/60 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 text-[#4A154B] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-serif text-xs font-bold tracking-wider text-[#4A154B] uppercase">
          {product.brand}
        </span>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-2 rounded-full hover:bg-[#FAF0F3] text-gray-500 transition-colors"
            title={t.wishlist}
          >
            <Heart
              className={`w-5 h-5 ${
                isWishlisted ? 'fill-[#B76E79] text-[#B76E79]' : 'text-[#4A154B]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="bg-white p-4">
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F9] border border-[#E8D5C4]/40 shadow-xs">
          <img
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {/* Badge */}
          {product.collection && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 rounded-md bg-[#4A154B] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                {product.collection === 'wedding'
                  ? (language === 'hi' ? 'दुल्हन संस्करण' : 'Bridal Edition')
                  : product.collection === 'groom'
                  ? (language === 'hi' ? 'ग्रूम संस्करण' : 'Groom Edition')
                  : 'Signature'}
              </span>
            </div>
          )}

          {/* 100% Genuine Tag */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 flex items-center space-x-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>{language === 'hi' ? '100% प्रामाणिक फॉर्मूला' : '100% Authentic Formula'}</span>
          </div>
        </div>

        {/* Thumbnail Selector */}
        {product.images.length > 1 && (
          <div className="flex space-x-2.5 mt-3 justify-center">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedImageIndex === idx
                    ? 'border-[#B76E79] ring-2 ring-[#B76E79]/30 scale-105'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Primary Info */}
      <div className="p-4 bg-white mt-2 border-y border-[#E8D5C4]/50">
        <div className="flex items-center space-x-1 mb-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-gray-800">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviewCount} {language === 'hi' ? 'समीक्षाएं' : 'Reviews'})</span>
          <span className="text-gray-300">•</span>
          <span className="text-[11px] font-semibold text-emerald-600">
            {t.inStockOnly} ({product.stockQuantity} {language === 'hi' ? 'शेष' : 'Left'})
          </span>
        </div>

        <h1 className="font-serif text-xl font-bold text-[#2D0C34] leading-tight">
          {product.name}
        </h1>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {product.subtitle}
        </p>

        {/* Pricing block */}
        <div className="mt-3.5 flex items-baseline space-x-2.5">
          <span className="text-2xl font-extrabold text-[#4A154B]">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8]/60 text-[#8C4A5A] text-xs font-bold">
                {product.discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">
          {language === 'hi' ? 'सभी कर शामिल • निःशुल्क त्वरित डिलीवरी' : 'Inclusive of all luxury taxes • Free express shipping on this item'}
        </p>
      </div>

      {/* Shade / Size Selector */}
      {product.shadesOrSizes.length > 0 && (
        <div className="p-4 bg-white mt-2 border-y border-[#E8D5C4]/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#4A154B] uppercase tracking-wider">
              {language === 'hi' ? 'शेड / साइज़ चुनें:' : 'Select Shade / Size Variant:'}
            </span>
            <span className="text-xs font-bold text-[#B76E79]">
              {selectedShade}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.shadesOrSizes.map((shade) => (
              <button
                key={shade}
                onClick={() => setSelectedShade(shade)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedShade === shade
                    ? 'border-[#4A154B] bg-[#F3EAF4] text-[#4A154B] ring-1 ring-[#4A154B]'
                    : 'border-[#E8D5C4] text-gray-700 bg-white hover:border-[#B76E79]'
                }`}
              >
                {shade}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accordion / Tabbed Info: Description, Key Ingredients, How to Use */}
      <div className="p-4 bg-white mt-2 border-y border-[#E8D5C4]/50">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'details', label: language === 'hi' ? 'विवरण' : 'Overview' },
            { id: 'ingredients', label: language === 'hi' ? 'प्रमुख सामग्री' : 'Key Ingredients' },
            { id: 'how_to_use', label: language === 'hi' ? 'उपयोग विधि' : 'How to Use' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#B76E79] text-[#4A154B]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-3.5 text-xs text-gray-600 leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-2">
              <p>{product.description}</p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center space-x-1.5 text-[11px] text-gray-700">
                  <Sparkles className="w-3.5 h-3.5 text-[#B76E79]" />
                  <span>{language === 'hi' ? 'त्वचा विशेषज्ञ अनुशंसित' : 'Dermatologist Approved'}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-gray-700">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'hi' ? '100% क्रूरता मुक्त' : '100% Cruelty Free'}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-gray-700">
                  <Truck className="w-3.5 h-3.5 text-[#4A154B]" />
                  <span>{language === 'hi' ? 'अगले दिन प्रेषण' : 'Next-Day Dispatch'}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-gray-700">
                  <RotateCcw className="w-3.5 h-3.5 text-[#8C4A5A]" />
                  <span>{language === 'hi' ? '7 दिन में वापसी' : '7 Days Return'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-800">{language === 'hi' ? 'सक्रिय तत्व व वानस्पतिक अर्क:' : 'Precious Actives & Botanical Extracts:'}</p>
              <div className="flex flex-wrap gap-1.5">
                {product.keyIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#FAF0F3] border border-[#E8B4B8]/40 text-[#4A154B] text-[11px] font-medium"
                  >
                    ✨ {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'how_to_use' && (
            <div className="space-y-1.5">
              <p className="font-semibold text-gray-800">{language === 'hi' ? 'उपयोग की विधि:' : 'Application Ritual:'}</p>
              <p>{product.howToUse}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-[#E8D5C4] px-4 py-3 z-40 shadow-[0_-4px_20px_rgba(74,21,75,0.12)]">
        {addedToast && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2E7D32] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center space-x-1 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'कार्ट में जोड़ा गया!' : 'Added to Cart!'}</span>
          </div>
        )}

        <div className="flex items-center space-x-2.5">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-[#E8D5C4] rounded-xl overflow-hidden bg-[#FAF8F9]">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-2.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              -
            </button>
            <span className="px-2 text-xs font-bold text-[#4A154B]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            id="btn-add-to-cart-details"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-3 rounded-xl border border-[#4A154B] text-[#4A154B] hover:bg-[#F3EAF4] font-bold text-xs flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.addToCart}</span>
          </button>

          {/* Buy Now */}
          <button
            id="btn-buy-now-details"
            onClick={handleBuyNow}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-[#4A154B] via-[#67226B] to-[#4A154B] text-white font-bold text-xs shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center space-x-1"
          >
            <span>{t.buyNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
