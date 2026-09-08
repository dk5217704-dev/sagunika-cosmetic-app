import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Sparkles,
  AlertTriangle,
  FolderPlus,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { CategoryRecord, CategoryType } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface AdminCategoriesTabProps {
  onSelectCategory?: (slug: CategoryType) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = () => {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryRecord | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState<CategoryType>('wedding');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80');
  const [badge, setBadge] = useState('New Drop');

  // Deletion Confirmation
  const [catToDelete, setCatToDelete] = useState<CategoryRecord | null>(null);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  useEffect(() => {
    setCategories(firestoreRepo.getCategories());
  }, []);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(null), 3000);
  };

  const openAddModal = () => {
    setEditingCat(null);
    setName('');
    setSlug('wedding');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80');
    setBadge('Bespoke');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryRecord) => {
    setEditingCat(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image);
    setBadge(cat.badge || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCat) {
      const updated = firestoreRepo.updateCategory(editingCat.id, {
        name: name.trim(),
        slug,
        description: description.trim(),
        image,
        badge: badge.trim() || undefined
      });
      setCategories(updated);
      showToast(`Category "${name}" updated successfully.`);
    } else {
      const newCat: CategoryRecord = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug,
        description: description.trim() || 'Signature cosmetic line',
        image,
        itemCount: 0,
        badge: badge.trim() || undefined
      };
      const updated = firestoreRepo.addCategory(newCat);
      setCategories(updated);
      showToast(`Category "${name}" added to Firestore.`);
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!catToDelete) return;
    const updated = firestoreRepo.deleteCategory(catToDelete.id);
    setCategories(updated);
    showToast(`Category "${catToDelete.name}" deleted.`);
    setCatToDelete(null);
  };

  return (
    <div id="admin-categories-tab" className="space-y-4">
      {statusToast && (
        <div className="p-3 rounded-xl bg-[#4A154B] text-white text-xs font-semibold flex items-center space-x-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E8D5C4] shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[#4A154B] text-white">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Cosmetic Category Taxonomy ({categories.length} Categories)
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore collection: <code className="text-gray-700">categories</code>
          </p>
        </div>

        <button
          id="btn-add-category"
          onClick={openAddModal}
          className="py-2 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            id={`category-card-${cat.id}`}
            className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div className="relative h-28 overflow-hidden bg-gray-100">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                <span className="font-serif text-sm font-bold truncate">{cat.name}</span>
                {cat.badge && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#B76E79] text-white uppercase tracking-wider">
                    {cat.badge}
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-mono bg-purple-50 text-[#4A154B] px-2 py-0.5 rounded-md font-bold">
                    slug: {cat.slug}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {cat.itemCount || 12} Products Linked
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openEditModal(cat)}
                  className="py-1 px-2.5 rounded-lg border border-gray-200 text-gray-700 hover:text-[#4A154B] hover:bg-[#FAF0F3] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setCatToDelete(cat)}
                  className="py-1 px-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
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
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingCat ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <span className="text-[10px] text-gray-500">Firestore Schema Taxonomy</span>
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
                <label className="font-bold text-gray-800 block mb-1">Category Display Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Imperial Fragrance & Attars"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Category Slug *</label>
                <select
                  value={slug}
                  onChange={(e) => setSlug(e.target.value as CategoryType)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
                >
                  <option value="wedding">wedding (Bridal Vault)</option>
                  <option value="groom">groom (Royal Groom)</option>
                  <option value="skincare">skincare (Skin & Toners)</option>
                  <option value="makeup">makeup (Luxe Cosmetics)</option>
                  <option value="fragrance">fragrance (Imperial Attars)</option>
                  <option value="ayurvedic">ayurvedic (Ceremonial Herbs)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Badge / Tag (Optional)</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Royal Wedding, 24K Gold, Trending"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description for category banner..."
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-category"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-rose-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">Delete Category</h4>
                <p className="text-[10px] text-gray-500">Firestore record will be removed.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to remove the category <strong className="text-gray-900">"{catToDelete.name}"</strong>?
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setCatToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Keep
              </button>
              <button
                type="button"
                id="btn-confirm-delete-category"
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
