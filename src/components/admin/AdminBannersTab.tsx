import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  X,
  Sparkles,
  ExternalLink,
  Eye,
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { BannerRecord, ScreenName } from '../../types';
import { firestoreRepo } from '../../services/firebase';

const SAMPLE_BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&auto=format&fit=crop&q=80',
];

export const AdminBannersTab: React.FC = () => {
  const [banners, setBanners] = useState<BannerRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerRecord | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState(SAMPLE_BANNER_IMAGES[0]);
  const [tag, setTag] = useState('Festive Luxe');
  const [actionScreen, setActionScreen] = useState<ScreenName>('wedding');
  const [active, setActive] = useState(true);

  // Delete State
  const [bannerToDelete, setBannerToDelete] = useState<BannerRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setBanners(firestoreRepo.getBanners());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setImageUrl(SAMPLE_BANNER_IMAGES[0]);
    setTag('Limited Drop');
    setActionScreen('wedding');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerRecord) => {
    setEditingBanner(b);
    setTitle(b.title);
    setSubtitle(b.subtitle);
    setImageUrl(b.imageUrl);
    setTag(b.tag);
    setActionScreen(b.actionScreen);
    setActive(b.active);
    setIsModalOpen(true);
  };

  const handleToggleActive = (banner: BannerRecord) => {
    const updated = firestoreRepo.updateBanner(banner.id, { active: !banner.active });
    setBanners(updated);
    showToast(`Banner visibility toggled to ${!banner.active ? 'Active' : 'Hidden'}.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBanner) {
      const updated = firestoreRepo.updateBanner(editingBanner.id, {
        title: title.trim(),
        subtitle: subtitle.trim(),
        imageUrl,
        tag: tag.trim() || 'Signature',
        actionScreen,
        active
      });
      setBanners(updated);
      showToast('Banner updated in Firestore.');
    } else {
      const newBanner: BannerRecord = {
        id: `banner-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim() || 'Handcrafted Luxury Collection',
        imageUrl,
        tag: tag.trim() || 'Signature',
        actionScreen,
        active
      };
      const updated = firestoreRepo.addBanner(newBanner);
      setBanners(updated);
      showToast('New promotional banner created.');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!bannerToDelete) return;
    const updated = firestoreRepo.deleteBanner(bannerToDelete.id);
    setBanners(updated);
    showToast('Banner removed.');
    setBannerToDelete(null);
  };

  return (
    <div id="admin-banners-tab" className="space-y-4">
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
              <ImageIcon className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-sm font-bold text-[#4A154B]">
              Hero Banners & Promotional Sliders ({banners.length})
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">
            Cloud Firestore collection: <code className="text-gray-700">banners</code>
          </p>
        </div>

        <button
          id="btn-add-banner"
          onClick={openAddModal}
          className="py-2 px-4 rounded-xl bg-[#4A154B] text-white text-xs font-bold hover:bg-[#67226B] transition-colors flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-3">
        {banners.map((b) => (
          <div
            key={b.id}
            id={`banner-card-${b.id}`}
            className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs flex flex-col md:flex-row"
          >
            <div className="relative w-full md:w-56 h-36 bg-gray-100 flex-shrink-0">
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[#4A154B] text-white uppercase tracking-wider">
                  {b.tag}
                </span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-serif text-sm font-bold text-[#4A154B]">
                    {b.title}
                  </h4>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      b.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {b.active ? 'Live' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{b.subtitle}</p>

                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-[10px] font-mono bg-purple-50 text-[#4A154B] px-2 py-0.5 rounded">
                    Action: Navigate to <strong>{b.actionScreen}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleToggleActive(b)}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center space-x-1 cursor-pointer"
                >
                  <span>{b.active ? 'Hide Banner' : 'Publish Banner'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="py-1 px-3 rounded-lg border border-gray-200 text-gray-700 hover:text-[#4A154B] hover:bg-[#FAF0F3] text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setBannerToDelete(b)}
                    className="py-1 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT BANNER */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md border border-[#E8D5C4] shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-[#4A154B] text-white">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#4A154B]">
                    {editingBanner ? 'Edit Banner' : 'Create Promotional Banner'}
                  </h3>
                  <span className="text-[10px] text-gray-500">
                    Live Carousel Presentation
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
                <label className="font-bold text-gray-800 block mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Imperial Bridal Vault Drop"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Subtitle / Promo Pitch</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Pure 24K Gold Alta & Saffron Hydrosol formulation"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Royal Wedding, Flash Drop, 20% Off"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Target Screen on Tap</label>
                <select
                  value={actionScreen}
                  onChange={(e) => setActionScreen(e.target.value as ScreenName)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B] bg-white"
                >
                  <option value="wedding">Bridal Vault (wedding)</option>
                  <option value="groom">Royal Groom (groom)</option>
                  <option value="catalog">Full Catalog (catalog)</option>
                  <option value="store_pickup">Store Pickup & Map (store_pickup)</option>
                  <option value="cart">Shopping Bag (cart)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:outline-hidden focus:border-[#4A154B]"
                />
                <div className="flex items-center space-x-2 mt-1.5 overflow-x-auto py-1">
                  <span className="text-[10px] text-gray-500 flex-shrink-0">Presets:</span>
                  {SAMPLE_BANNER_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(img)}
                      className="w-8 h-8 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0 hover:border-[#4A154B]"
                    >
                      <img src={img} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-banner-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-[#4A154B] rounded border-gray-300 focus:ring-[#4A154B]"
                />
                <label htmlFor="chk-banner-active" className="font-bold text-gray-700 cursor-pointer">
                  Publish Banner as Active Immediately
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
                  id="btn-save-banner"
                  className="flex-1 py-2.5 rounded-xl bg-[#4A154B] text-white font-bold hover:bg-[#67226B] shadow-xs"
                >
                  {editingBanner ? 'Save Banner' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================================= */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm border border-rose-200 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-gray-900">Delete Banner</h4>
                <p className="text-[10px] text-gray-500">Hero slide will be removed.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Are you sure you want to delete <strong className="text-gray-900">"{bannerToDelete.title}"</strong>?
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-delete-banner"
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
