import React, { useState } from 'react';
import { X, Plus, Sparkles, UploadCloud, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CategoryType, Product } from '../types';

interface AdminAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
];

export const AdminAddProductModal: React.FC<AdminAddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [brand, setBrand] = useState('Sagunika Luxury');
  const [category, setCategory] = useState<CategoryType>('wedding');
  const [collection, setCollection] = useState<'wedding' | 'groom' | 'general'>('wedding');
  const [price, setPrice] = useState('2499');
  const [originalPrice, setOriginalPrice] = useState('3299');
  const [stockQuantity, setStockQuantity] = useState('50');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES[0]);
  const [ingredients, setIngredients] = useState('24K Gold Flakes, Damask Rose Hydrosol, Hyaluronic Acid');
  const [description, setDescription] = useState(
    'Handcrafted ceremonial formulation for unmatched luminescence and long-lasting elegance.'
  );
  const [howToUse, setHowToUse] = useState('Massage gently onto cleansed skin or apply in single swipe.');
  const [shades, setShades] = useState('Royal Gold, Rose Petal');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedPrice = parseInt(price) || 999;
    const parsedOriginalPrice = parseInt(originalPrice) || parsedPrice;
    const discount = Math.round(((parsedOriginalPrice - parsedPrice) / parsedOriginalPrice) * 100);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Exclusive Sagunika Formulation',
      brand: brand.trim() || 'Sagunika Cosmetic',
      category,
      collection,
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      discountPercentage: Math.max(0, discount),
      rating: 5.0,
      reviewCount: 1,
      stockQuantity: parseInt(stockQuantity) || 20,
      images: [imageUrl],
      description: description.trim(),
      keyIngredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      howToUse: howToUse.trim(),
      shadesOrSizes: shades.split(',').map((s) => s.trim()).filter(Boolean),
      tags: [category, collection === 'wedding' ? 'Wedding' : collection === 'groom' ? 'Groom' : 'General', 'AdminUpload'],
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs p-4 border-b border-[#EFE8ED] flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#4A154B] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                Publish New Cosmetic Product
              </h3>
              <span className="text-[10px] text-gray-500 font-medium">
                Admin Panel • Cloud Firestore Direct Upload
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          {/* Product Name */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 24K Gold Radiant Bridal Strobe"
              className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Subtitle / Highlight</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. 16-Hour Ceremonial Waterproof Formula"
              className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          {/* Category & Collection Tag */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl bg-white outline-none focus:border-[#4A154B]"
              >
                <option value="wedding">Wedding</option>
                <option value="groom">Groom</option>
                <option value="skincare">Skincare</option>
                <option value="makeup">Makeup</option>
                <option value="fragrance">Fragrance</option>
                <option value="ayurvedic">Ayurvedic</option>
                <option value="haircare">Haircare</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Special Collection</label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl bg-white outline-none focus:border-[#4A154B]"
              >
                <option value="wedding">✨ Wedding Collection</option>
                <option value="groom">👑 Groom Collection</option>
                <option value="general">Regular Store Catalog</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Offer Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">MRP Price (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Initial Stock</label>
              <input
                type="number"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
              />
            </div>
          </div>

          {/* Image Presets */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Cosmetic Photography Preset</label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SAMPLE_IMAGES.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setImageUrl(img)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                    imageUrl === img ? 'border-[#4A154B] ring-2 ring-[#B76E79]/40' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Ingredients */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Key Ingredients (comma separated)</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          {/* Shades / Variants */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Shades or Sizes (comma separated)</label>
            <input
              type="text"
              value={shades}
              onChange={(e) => setShades(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Product Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-[#E8D5C4] rounded-xl outline-none focus:border-[#4A154B]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              id="btn-admin-submit-product"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#67226B] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish to Sagunika Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
