import React, { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Trash2,
  Edit3,
  Search,
  Check,
  X,
  Sparkles,
  Layers,
  AlertTriangle,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Star,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Product, CategoryType } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface AdminProductsTabProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&auto=format&fit=crop&q=80',
];

const CATEGORY_OPTIONS: { id: CategoryType; label: string }[] = [
  { id: 'makeup', label: 'Makeup' },
  { id: 'skincare', label: 'Skincare' },
  { id: 'haircare', label: 'Hair Care' },
  { id: 'fragrance', label: 'Fragrance' },
  { id: 'beauty_tools', label: 'Beauty Tools' },
  { id: 'personal_care', label: 'Personal Care' },
  { id: 'wedding', label: 'Bridal Vault' },
  { id: 'groom', label: 'Royal Groom' },
  { id: 'ayurvedic', label: 'Ayurvedic' },
];

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields as explicitly requested:
  // Name, Brand, Category, Price, Discount, Description, Stock, Images
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Sagunika Luxury');
  const [formCategory, setFormCategory] = useState<CategoryType>('makeup');
  const [formPrice, setFormPrice] = useState('1499');
  const [formDiscount, setFormDiscount] = useState('20');
  const [formOrigPrice, setFormOrigPrice] = useState('1875');
  const [formDescription, setFormDescription] = useState('Handcrafted ceremonial formulation with noble botanicals.');
  const [formStock, setFormStock] = useState('50');
  const [formImages, setFormImages] = useState<string[]>([SAMPLE_IMAGES[0]]);

  // Additional detail fields
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCollection, setFormCollection] = useState<'wedding' | 'groom' | 'general'>('general');
  const [formIngredients, setFormIngredients] = useState('24K Gold Dust, Damask Rose Hydrosol, Kashmiri Kesar');
  const [formHowToUse, setFormHowToUse] = useState('Gently apply onto clean skin before ceremonial rituals.');
  const [formShades, setFormShades] = useState('Universal, Rose Glow, Royal Gold');
  const [urlInput, setUrlInput] = useState('');

  // Refs for camera and gallery file inputs
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Deletion confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Synchronize discount % and original price
  const handlePriceChange = (newPriceStr: string) => {
    setFormPrice(newPriceStr);
    const p = parseFloat(newPriceStr) || 0;
    const d = parseFloat(formDiscount) || 0;
    if (d > 0 && d < 100) {
      const orig = Math.round(p / (1 - d / 100));
      setFormOrigPrice(orig.toString());
    } else {
      setFormOrigPrice(newPriceStr);
    }
  };

  const handleDiscountChange = (newDiscountStr: string) => {
    setFormDiscount(newDiscountStr);
    const d = parseFloat(newDiscountStr) || 0;
    const p = parseFloat(formPrice) || 0;
    if (d > 0 && d < 100) {
      const orig = Math.round(p / (1 - d / 100));
      setFormOrigPrice(orig.toString());
    } else {
      setFormOrigPrice(formPrice);
    }
  };

  const handleOrigPriceChange = (newOrigStr: string) => {
    setFormOrigPrice(newOrigStr);
    const orig = parseFloat(newOrigStr) || 0;
    const p = parseFloat(formPrice) || 0;
    if (orig > p && orig > 0) {
      const d = Math.round(((orig - p) / orig) * 100);
      setFormDiscount(d.toString());
    } else {
      setFormDiscount('0');
    }
  };

  // Process image files from device gallery or camera
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setFormImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Add image by URL
  const handleAddUrlImage = () => {
    if (urlInput.trim()) {
      setFormImages((prev) => [...prev, urlInput.trim()]);
      setUrlInput('');
    }
  };

  // Remove an image from the list
  const handleRemoveImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Set an image as primary (moves it to index 0)
  const handleSetPrimaryImage = (index: number) => {
    setFormImages((prev) => {
      const target = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [target, ...rest];
    });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Sagunika Luxury');
    setFormCategory('makeup');
    setFormCollection('general');
    setFormPrice('1499');
    setFormDiscount('20');
    setFormOrigPrice('1875');
    setFormStock('50');
    setFormDescription('Pure handcrafted ceremonial formulation enriched with noble botanicals and genuine extracts.');
    setFormSubtitle('Ceremonial Velvet Radiance');
    setFormIngredients('24K Gold Flakes, Damask Rose Hydrosol, Kashmiri Kesar');
    setFormHowToUse('Gently apply onto skin with soft circular motions.');
    setFormShades('Universal, Rose Glow, Royal Gold');
    setFormImages([SAMPLE_IMAGES[0]]);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormBrand(prod.brand || 'Sagunika Luxury');
    setFormCategory(prod.category);
    setFormCollection(prod.collection || 'general');
    setFormPrice(prod.price.toString());
    setFormOrigPrice((prod.originalPrice || prod.price).toString());
    setFormDiscount(prod.discountPercentage ? prod.discountPercentage.toString() : '0');
    setFormStock(prod.stockQuantity.toString());
    setFormDescription(prod.description || '');
    setFormSubtitle(prod.subtitle || '');
    setFormIngredients((prod.keyIngredients || []).join(', '));
    setFormHowToUse(prod.howToUse || '');
    setFormShades((prod.shadesOrSizes || []).join(', '));
    setFormImages(prod.images && prod.images.length > 0 ? [...prod.images] : [SAMPLE_IMAGES[0]]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseInt(formPrice) || 999;
    const parsedOrig = parseInt(formOrigPrice) || parsedPrice;
    const parsedDiscount = parseInt(formDiscount) || (parsedOrig > parsedPrice ? Math.round(((parsedOrig - parsedPrice) / parsedOrig) * 100) : 0);
    const finalImages = formImages.length > 0 ? formImages : [SAMPLE_IMAGES[0]];

    if (editingProduct) {
      // Update existing product
      const updatedList = firestoreRepo.updateProduct(editingProduct.id, {
        name: formName.trim(),
        subtitle: formSubtitle.trim() || 'Signature Formulation',
        brand: formBrand.trim() || 'Sagunika Luxury',
        category: formCategory,
        collection: formCollection,
        price: parsedPrice,
        originalPrice: parsedOrig,
        discountPercentage: parsedDiscount,
        stockQuantity: parseInt(formStock) || 0,
        images: finalImages,
        description: formDescription.trim(),
        keyIngredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
        howToUse: formHowToUse.trim(),
        shadesOrSizes: formShades.split(',').map((s) => s.trim()).filter(Boolean),
      });
      onUpdateProducts(updatedList);
    } else {
      // Add new product
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        subtitle: formSubtitle.trim() || 'Signature Formulation',
        brand: formBrand.trim() || 'Sagunika Luxury',
        category: formCategory,
        collection: formCollection,
        price: parsedPrice,
        originalPrice: parsedOrig,
        discountPercentage: parsedDiscount,
        rating: 5.0,
        reviewCount: 1,
        images: finalImages,
        description: formDescription.trim(),
        keyIngredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
        howToUse: formHowToUse.trim(),
        shadesOrSizes: formShades.split(',').map((s) => s.trim()).filter(Boolean),
        stockQuantity: parseInt(formStock) || 30,
        tags: ['Sagunika', formCategory, formBrand]
      };
      const updatedList = firestoreRepo.addProduct(newProd);
      onUpdateProducts(updatedList);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const updatedList = firestoreRepo.deleteProduct(productToDelete.id);
    onUpdateProducts(updatedList);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="admin-products-tab" className="space-y-4">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8D5C4] shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <Package className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Product Management & Catalog ({products.length} Items)
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Admin multi-image upload, live inventory tracking & instant catalog synchronization
          </p>
        </div>

        <button
          id="btn-admin-add-product"
          onClick={openAddModal}
          className="py-2.5 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by Name, Brand, SKU or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
        >
          <option value="all">All Categories ({products.length})</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs">
        <div className="divide-y divide-gray-100">
          {filteredProducts.map((p) => {
            const isLowStock = p.stockQuantity < 15;
            return (
              <div
                key={p.id}
                id={`admin-product-row-${p.id}`}
                className="p-3.5 flex items-center justify-between hover:bg-[#FAF8F9] transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 relative">
                    <img
                      src={p.images[0] || SAMPLE_IMAGES[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {p.images.length > 1 && (
                      <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[8px] font-bold px-1 rounded-tl-md">
                        +{p.images.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-serif text-xs font-bold text-gray-900 truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#4A154B] border border-purple-100">
                        {p.category.replace('_', ' ')}
                      </span>
                      {p.brand && (
                        <span className="text-[9px] font-semibold text-[#B76E79]">
                          • {p.brand}
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-500 truncate max-w-sm">
                      {p.subtitle || p.description}
                    </p>

                    <div className="flex items-center space-x-3 mt-1 text-[11px] flex-wrap">
                      <span className="font-bold text-gray-900 font-mono">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[10px] text-gray-400 line-through font-mono">
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      {p.discountPercentage > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700">
                          {p.discountPercentage}% OFF
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          isLowStock
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stockQuantity} in stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center space-x-1.5 ml-2 flex-shrink-0">
                  <button
                    id={`btn-edit-prod-${p.id}`}
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-[#FAF0F3] text-gray-700 hover:text-[#4A154B] border border-gray-200 transition-colors cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    id={`btn-delete-prod-${p.id}`}
                    onClick={() => setProductToDelete(p)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-xs">
              No products found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingProduct ? 'Edit Product Formulations' : 'Add New Product Formulation'}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Fields: Name, Brand, Category, Price, Discount, Description, Stock & Multi-Images
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Product Name */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 24K Saffron Radiance Ceremonial Alta"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              {/* Brand & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Sagunika Luxury, Sagunika Herbal"
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                  <div className="flex items-center space-x-1.5 mt-1 overflow-x-auto py-0.5">
                    {['Sagunika Luxury', 'Sagunika Herbal', 'Sagunika Men', 'Sagunika Gold'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormBrand(b)}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-[#FAF0F3] hover:text-[#4A154B]"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white font-medium"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price, Discount and Stock */}
              <div className="grid grid-cols-3 gap-2.5 bg-[#FAF8F9] p-3 rounded-xl border border-[#E8D5C4]/60">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={formDiscount}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white font-mono"
                  />
                  <span className="text-[9px] text-gray-400 mt-0.5 block">
                    MRP: ₹{formOrigPrice}
                  </span>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Product Images (Direct gallery/camera upload + multiple images support) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 block">
                    Product Images ({formImages.length} attached) *
                  </label>
                  <span className="text-[10px] text-[#B76E79]">
                    First image is Primary cover
                  </span>
                </div>

                {/* Upload Buttons: Mobile Gallery & Camera */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Gallery Input */}
                  <input
                    type="file"
                    ref={galleryInputRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl border border-dashed border-[#B76E79] bg-[#FAF0F3] text-[#4A154B] font-bold flex items-center justify-center space-x-2 hover:bg-[#F3EAF4] transition-colors active:scale-95"
                  >
                    <UploadCloud className="w-4 h-4 text-[#B76E79]" />
                    <span>Upload from Gallery</span>
                  </button>

                  {/* Camera Input */}
                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="py-2.5 px-3 rounded-xl border border-dashed border-[#4A154B] bg-[#F3EAF4] text-[#4A154B] font-bold flex items-center justify-center space-x-2 hover:bg-[#E8D5C4]/30 transition-colors active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-[#4A154B]" />
                    <span>Capture with Camera</span>
                  </button>
                </div>

                {/* Or paste image URL */}
                <div className="flex space-x-2">
                  <input
                    type="url"
                    placeholder="Or paste an Image URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    Add URL
                  </button>
                </div>

                {/* Sample Presets Quick Pick */}
                <div className="flex items-center space-x-2 overflow-x-auto py-1">
                  <span className="text-[10px] text-gray-500 flex-shrink-0">Presets:</span>
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImages((prev) => [...prev, img])}
                      className="w-8 h-8 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0 hover:border-[#4A154B] active:scale-90"
                      title="Add sample image"
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Thumbnails of All Uploaded Images */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
                    {formImages.map((img, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                          index === 0 ? 'border-[#B76E79] ring-2 ring-[#B76E79]/30' : 'border-gray-200'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />

                        {/* Primary Badge */}
                        {index === 0 && (
                          <span className="absolute top-1 left-1 bg-[#B76E79] text-white text-[8px] font-bold px-1 rounded-sm shadow-xs">
                            Primary
                          </span>
                        )}

                        {/* Action Overlays */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity p-1">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(index)}
                              className="text-[8px] px-1.5 py-0.5 rounded bg-white text-gray-800 font-bold hover:bg-gray-100"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-gray-800 block mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ceremonial details, benefits, texture, fragrance..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              {/* Additional optional fields in collapsible or compact format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Key Ingredients
                  </label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    placeholder="e.g. 24K Gold Flakes, Damask Rose Hydrosol"
                    className="w-full p-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    Shades / Sizes
                  </label>
                  <input
                    type="text"
                    value={formShades}
                    onChange={(e) => setFormShades(e.target.value)}
                    placeholder="e.g. Royal Gold, Rose Petal, Ivory"
                    className="w-full p-2 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-admin-product"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs cursor-pointer active:scale-95"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-rose-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">Delete Product SKU</h4>
                <p className="text-[10px] text-gray-500">Action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to permanently remove{' '}
              <strong className="text-gray-900">"{productToDelete.name}"</strong> from Cloud Firestore?
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Keep Product
              </button>
              <button
                type="button"
                id="btn-confirm-delete-product"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
              >
                Delete SKU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
