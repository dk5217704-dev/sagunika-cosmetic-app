import React, { useState } from 'react';
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
];

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBrand, setFormBrand] = useState('Sagunika Luxury');
  const [formCategory, setFormCategory] = useState<CategoryType>('wedding');
  const [formCollection, setFormCollection] = useState<'wedding' | 'groom' | 'general'>('wedding');
  const [formPrice, setFormPrice] = useState('2499');
  const [formOrigPrice, setFormOrigPrice] = useState('3499');
  const [formStock, setFormStock] = useState('40');
  const [formImage, setFormImage] = useState(SAMPLE_IMAGES[0]);
  const [formIngredients, setFormIngredients] = useState('24K Gold Flakes, Damask Rose Hydrosol, Kashmiri Kesar');
  const [formDescription, setFormDescription] = useState('Handcrafted ceremonial formulation for royal radiance.');
  const [formHowToUse, setFormHowToUse] = useState('Gently massage onto clean skin before ceremonial rituals.');
  const [formShades, setFormShades] = useState('Royal Gold, Rose Petal, Ivory');

  // Deletion confirmation state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormSubtitle('');
    setFormBrand('Sagunika Luxury');
    setFormCategory('wedding');
    setFormCollection('wedding');
    setFormPrice('2499');
    setFormOrigPrice('3499');
    setFormStock('40');
    setFormImage(SAMPLE_IMAGES[0]);
    setFormIngredients('24K Gold Flakes, Damask Rose Hydrosol, Kashmiri Kesar');
    setFormDescription('Handcrafted ceremonial formulation for royal radiance.');
    setFormHowToUse('Gently massage onto clean skin before ceremonial rituals.');
    setFormShades('Royal Gold, Rose Petal, Ivory');
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle || '');
    setFormBrand(prod.brand || 'Sagunika Luxury');
    setFormCategory(prod.category);
    setFormCollection(prod.collection || 'wedding');
    setFormPrice(prod.price.toString());
    setFormOrigPrice((prod.originalPrice || prod.price).toString());
    setFormStock(prod.stockQuantity.toString());
    setFormImage(prod.images[0] || SAMPLE_IMAGES[0]);
    setFormIngredients((prod.keyIngredients || []).join(', '));
    setFormDescription(prod.description || '');
    setFormHowToUse(prod.howToUse || '');
    setFormShades((prod.shadesOrSizes || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const parsedPrice = parseInt(formPrice) || 999;
    const parsedOrig = parseInt(formOrigPrice) || parsedPrice;
    const discount = Math.max(0, Math.round(((parsedOrig - parsedPrice) / parsedOrig) * 100));

    if (editingProduct) {
      // Update existing
      const updatedList = firestoreRepo.updateProduct(editingProduct.id, {
        name: formName.trim(),
        subtitle: formSubtitle.trim(),
        brand: formBrand.trim(),
        category: formCategory,
        collection: formCollection,
        price: parsedPrice,
        originalPrice: parsedOrig,
        discountPercentage: discount,
        stockQuantity: parseInt(formStock) || 0,
        images: [formImage],
        keyIngredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
        description: formDescription.trim(),
        howToUse: formHowToUse.trim(),
        shadesOrSizes: formShades.split(',').map((s) => s.trim()).filter(Boolean),
      });
      onUpdateProducts(updatedList);
    } else {
      // Add new
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: formName.trim(),
        subtitle: formSubtitle.trim() || 'Signature Formulation',
        brand: formBrand.trim() || 'Sagunika Luxury',
        category: formCategory,
        collection: formCollection,
        price: parsedPrice,
        originalPrice: parsedOrig,
        discountPercentage: discount,
        rating: 5.0,
        reviewCount: 1,
        images: [formImage],
        description: formDescription.trim(),
        keyIngredients: formIngredients.split(',').map((s) => s.trim()).filter(Boolean),
        howToUse: formHowToUse.trim(),
        shadesOrSizes: formShades.split(',').map((s) => s.trim()).filter(Boolean),
        stockQuantity: parseInt(formStock) || 30,
        tags: ['Sagunika', formCategory, formCollection === 'wedding' ? 'Bridal' : 'Groom']
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
              Product Inventory & Catalog ({products.length} SKUs)
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore synchronizer • Live stock & variant management
          </p>
        </div>

        <button
          id="btn-admin-add-product"
          onClick={openAddModal}
          className="py-2 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
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
            placeholder="Search by title, SKU, formulation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-white text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
        >
          <option value="all">All Categories ({products.length})</option>
          <option value="wedding">Bridal Vault</option>
          <option value="groom">Royal Groom</option>
          <option value="skincare">Skincare</option>
          <option value="makeup">Luxe Makeup</option>
          <option value="fragrance">Attars & Fragrance</option>
          <option value="ayurvedic">Ayurvedic</option>
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
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-xs font-bold text-gray-900 truncate">
                        {p.name}
                      </span>
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-50 text-[#4A154B] border border-purple-100">
                        {p.category}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 truncate max-w-xs">
                      {p.subtitle || p.brand}
                    </p>

                    <div className="flex items-center space-x-3 mt-1 text-[11px]">
                      <span className="font-bold text-gray-900 font-mono">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[10px] text-gray-400 line-through font-mono">
                          ₹{p.originalPrice}
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
                <div className="flex items-center space-x-1.5 ml-2">
                  <button
                    id={`btn-edit-prod-${p.id}`}
                    onClick={() => openEditModal(p)}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-[#FAF0F3] text-gray-700 hover:text-[#4A154B] border border-gray-200 transition-colors cursor-pointer"
                    title="Edit Product Details"
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
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingProduct ? 'Edit Cosmetic Product' : 'Add New Cosmetic Product'}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Cloud Firestore Schema Synchronization
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

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. 24K Saffron Radiance Ceremonial Alta"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Subtitle / Key Claim</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. Handcrafted Botanical Smudge-Proof Formulation"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryType)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
                  >
                    <option value="wedding">Bridal Vault</option>
                    <option value="groom">Royal Groom</option>
                    <option value="skincare">Skincare</option>
                    <option value="makeup">Luxe Makeup</option>
                    <option value="fragrance">Imperial Attars</option>
                    <option value="ayurvedic">Ayurvedic</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Collection</label>
                  <select
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
                  >
                    <option value="wedding">Wedding Vault</option>
                    <option value="groom">Groom Chest</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formOrigPrice}
                    onChange={(e) => setFormOrigPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
                <div className="flex items-center space-x-2 mt-1.5 overflow-x-auto py-1">
                  <span className="text-[10px] text-gray-500 flex-shrink-0">Presets:</span>
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormImage(img)}
                      className="w-7 h-7 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0 hover:border-[#4A154B]"
                    >
                      <img src={img} alt="sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Key Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  placeholder="e.g. 24K Gold Dust, Kashmiri Saffron, Damask Rose"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Available Shades / Sizes</label>
                <input
                  type="text"
                  value={formShades}
                  onChange={(e) => setFormShades(e.target.value)}
                  placeholder="e.g. Royal Gold, Rose Petal, Ivory"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
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
                  id="btn-save-admin-product"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs"
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
