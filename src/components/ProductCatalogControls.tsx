import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Sparkles,
  Crown,
  Tag,
  Check,
  RotateCcw,
  Star,
  ChevronDown
} from 'lucide-react';
import { CategoryType, OccasionOption, PriceRangeOption, SortOption } from '../types';
import { useLanguage } from '../context/LanguageContext';

export interface FilterState {
  searchQuery: string;
  category: 'all' | CategoryType;
  brand?: string;
  priceRange: PriceRangeOption;
  minCustomPrice?: number;
  maxCustomPrice?: number;
  occasion: OccasionOption;
  sortBy: SortOption;
  inStockOnly: boolean;
  minRating?: number;
}

interface ProductCatalogControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalProductsCount: number;
  filteredCount: number;
}

const AVAILABLE_BRANDS = [
  'All Brands',
  'Sagunika Luxury',
  'Sagunika Heritage',
  'Sagunika Couture',
  'Sagunika Haircare',
  'Sagunika Fragrance',
  'Sagunika Tools',
  'Sagunika Bath & Body',
];

const QUICK_SEARCH_CHIPS = [
  'Bridal Vanity',
  'Herbal Sindoor',
  '24K Gold Strobe',
  'Royal Groom Trunk',
  'Imperial Oud',
  'Kumkumadi Oil',
  'Damask Rose',
  'Hair Spa',
  'Gua Sha',
  'Body Soufflé'
];

export const ProductCatalogControls: React.FC<ProductCatalogControlsProps> = ({
  filters,
  onFilterChange,
  totalProductsCount,
  filteredCount,
}) => {
  const { t, language } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Compute active filters count (excluding default 'all' / 'featured')
  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.brand && filters.brand !== 'all' ? 1 : 0) +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.occasion !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      searchQuery: '',
      category: 'all',
      brand: 'all',
      priceRange: 'all',
      occasion: 'all',
      sortBy: 'featured',
      inStockOnly: false,
      minRating: undefined,
    });
  };

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'featured':
        return t.sortFeatured;
      case 'price-asc':
        return t.sortPriceAsc;
      case 'price-desc':
        return t.sortPriceDesc;
      case 'rating-desc':
        return language === 'hi' ? 'उच्चतम रेटिंग ★' : 'Highest Rated ★';
      case 'bestseller':
        return t.sortPopularity;
      case 'newest':
        return t.sortNewest;
      default:
        return t.sortBy;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'all': return t.catAll;
      case 'makeup': return t.catMakeup;
      case 'skincare': return t.catSkincare;
      case 'haircare': return t.catHaircare;
      case 'fragrance': return t.catFragrance;
      case 'beauty_tools': return t.catBeautyTools;
      case 'personal_care': return t.catPersonalCare;
      case 'wedding': return t.catWedding;
      case 'groom': return t.catGroom;
      default: return cat;
    }
  };

  const getPriceLabel = (range: PriceRangeOption) => {
    switch (range) {
      case 'under-1500':
        return language === 'hi' ? '₹1,500 से कम' : 'Under ₹1,500';
      case '1500-3000':
        return '₹1,500 – ₹3,000';
      case '3000-5000':
        return '₹3,000 – ₹5,000';
      case 'above-5000':
        return language === 'hi' ? '₹5,000 से अधिक' : 'Above ₹5,000';
      default:
        return language === 'hi' ? 'सभी मूल्य' : 'All Prices';
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <input
          id="catalog-search-input"
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          placeholder={t.searchPlaceholder}
          className="w-full bg-white pl-10 pr-10 py-2.5 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-[#E8D5C4] focus:outline-none focus:border-[#B76E79] focus:ring-1 focus:ring-[#B76E79]/40 shadow-xs transition-all"
        />
        <Search className="w-4 h-4 text-[#B76E79] absolute left-3.5 top-3 pointer-events-none" />
        {filters.searchQuery && (
          <button
            onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap pl-0.5">
          {language === 'hi' ? 'त्वरित:' : 'Quick:'}
        </span>
        {QUICK_SEARCH_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => onFilterChange({ ...filters, searchQuery: chip })}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
              filters.searchQuery.toLowerCase() === chip.toLowerCase()
                ? 'bg-[#4A154B] text-white border-[#4A154B] shadow-2xs font-semibold'
                : 'bg-white text-gray-600 border-[#E8D5C4]/70 hover:border-[#B76E79] hover:bg-[#FAF0F3]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Main Filter & Sort Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E8D5C4]/40">
        {/* Category Filter Horizontal Pills */}
        <div className="flex-1 flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar min-w-[200px]">
          {[
            { id: 'all', label: t.catAll },
            { id: 'makeup', label: `💄 ${t.catMakeup}` },
            { id: 'skincare', label: `🌹 ${t.catSkincare}` },
            { id: 'haircare', label: `🌿 ${t.catHaircare}` },
            { id: 'fragrance', label: `🌸 ${t.catFragrance}` },
            { id: 'beauty_tools', label: `👑 ${t.catBeautyTools}` },
            { id: 'personal_care', label: `🍃 ${t.catPersonalCare}` },
            { id: 'wedding', label: `✨ ${t.catWedding}` },
            { id: 'groom', label: `🤵 ${t.catGroom}` },
          ].map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ ...filters, category: cat.id as any })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1 border ${
                  isSelected
                    ? 'bg-[#4A154B] text-white border-[#4A154B] shadow-xs'
                    : 'bg-white text-gray-700 border-[#E8D5C4]/80 hover:border-[#B76E79] hover:bg-[#FAF8F9]'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Filter Modal + Sort Dropdown */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Filter Drawer Trigger Button */}
          <button
            id="btn-open-catalog-filters"
            onClick={() => setIsModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
              activeFilterCount > 0
                ? 'bg-[#FAF0F3] text-[#8C4A5A] border-[#B76E79] shadow-2xs'
                : 'bg-white text-gray-700 border-[#E8D5C4] hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B76E79]" />
            <span>{language === 'hi' ? 'फ़िल्टर' : 'Filters'}</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B76E79] text-white text-[9px] font-extrabold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              id="btn-catalog-sort-dropdown"
              onClick={() => setIsSortDropdownOpen((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#E8D5C4] text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center space-x-1.5 transition-all shadow-2xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#4A154B]" />
              <span className="hidden sm:inline text-gray-500 text-[11px]">{t.sortBy}:</span>
              <span className="font-bold text-[#4A154B] truncate max-w-[110px] sm:max-w-[140px]">
                {getSortLabel(filters.sortBy)}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-[#E8D5C4] py-1 z-40">
                {[
                  { id: 'newest', label: t.sortNewest },
                  { id: 'price-asc', label: t.sortPriceAsc },
                  { id: 'price-desc', label: t.sortPriceDesc },
                  { id: 'bestseller', label: t.sortPopularity },
                  { id: 'rating-desc', label: language === 'hi' ? 'उच्चतम रेटिंग ★' : 'Highest Rated ★' },
                  { id: 'featured', label: t.sortFeatured },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onFilterChange({ ...filters, sortBy: item.id as SortOption });
                      setIsSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FAF0F3] transition-colors ${
                      filters.sortBy === item.id ? 'font-bold text-[#4A154B] bg-[#FAF0F3]/60' : 'text-gray-700'
                    }`}
                  >
                    <span>{item.label}</span>
                    {filters.sortBy === item.id && <Check className="w-3.5 h-3.5 text-[#B76E79]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges Strip */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {language === 'hi' ? 'सक्रिय फ़िल्टर:' : 'Active:'}
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#8C4A5A]">
              <span>"{filters.searchQuery}"</span>
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.category !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#4A154B] capitalize">
              <span>{getCategoryLabel(filters.category)}</span>
              <button
                onClick={() => onFilterChange({ ...filters, category: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.brand && filters.brand !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#4A154B]">
              <span>{filters.brand}</span>
              <button
                onClick={() => onFilterChange({ ...filters, brand: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priceRange !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#4A154B]">
              <span>{getPriceLabel(filters.priceRange)}</span>
              <button
                onClick={() => onFilterChange({ ...filters, priceRange: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
              <span>{t.inStockOnly}</span>
              <button
                onClick={() => onFilterChange({ ...filters, inStockOnly: false })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-[10px] font-bold text-[#B76E79] hover:underline flex items-center space-x-1 ml-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      )}

      {/* Live Result Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-0.5">
        <span>
          <strong className="text-[#4A154B]">{filteredCount}</strong> {t.resultsCount} ({totalProductsCount} {language === 'hi' ? 'कुल' : 'total'})
        </span>
        {filteredCount === 0 && (
          <span className="text-amber-600 font-medium">
            {language === 'hi' ? 'कोई उत्पाद नहीं मिला। फ़िल्टर बदलें।' : 'No direct matches. Try loosening filters!'}
          </span>
        )}
      </div>

      {/* FILTER MODAL / DRAWER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8D5C4] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#E8D5C4] flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-[#B76E79]" />
                <h3 className="font-serif text-base font-bold text-[#4A154B]">
                  {t.filterTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 flex-1">
              {/* 1. Category Filter */}
              <div>
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-2.5">
                  {t.filterCategory}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: t.catAll },
                    { id: 'makeup', label: t.catMakeup },
                    { id: 'skincare', label: t.catSkincare },
                    { id: 'haircare', label: t.catHaircare },
                    { id: 'fragrance', label: t.catFragrance },
                    { id: 'beauty_tools', label: t.catBeautyTools },
                    { id: 'personal_care', label: t.catPersonalCare },
                    { id: 'wedding', label: t.catWedding },
                    { id: 'groom', label: t.catGroom },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onFilterChange({ ...filters, category: cat.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                        filters.category === cat.id
                          ? 'bg-[#FAF0F3] border-[#B76E79] text-[#4A154B] font-bold shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-[#E8D5C4]'
                      }`}
                    >
                      <span className="truncate">{cat.label}</span>
                      {filters.category === cat.id && (
                        <Check className="w-3.5 h-3.5 text-[#B76E79] flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div>
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-2.5">
                  {t.filterBrand}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_BRANDS.map((brandName) => {
                    const isSelected =
                      brandName === 'All Brands'
                        ? !filters.brand || filters.brand === 'all'
                        : filters.brand === brandName;
                    return (
                      <button
                        key={brandName}
                        onClick={() =>
                          onFilterChange({
                            ...filters,
                            brand: brandName === 'All Brands' ? 'all' : brandName,
                          })
                        }
                        className={`p-2 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FAF0F3] border-[#B76E79] text-[#4A154B] font-bold shadow-2xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#E8D5C4]'
                        }`}
                      >
                        <span className="truncate">
                          {brandName === 'All Brands' && language === 'hi' ? 'सभी ब्रांड' : brandName}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#B76E79] flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div>
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-2.5">
                  {t.filterPrice}
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: language === 'hi' ? 'सभी मूल्य दायरे' : 'All Price Bands' },
                    { id: 'under-1500', label: language === 'hi' ? '₹1,500 से कम' : 'Under ₹1,500' },
                    { id: '1500-3000', label: '₹1,500 – ₹3,000' },
                    { id: '3000-5000', label: '₹3,000 – ₹5,000' },
                    { id: 'above-5000', label: language === 'hi' ? '₹5,000 से अधिक (रॉयल वॉल्ट)' : 'Above ₹5,000 (Royal Vault)' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onFilterChange({ ...filters, priceRange: p.id as any })}
                      className={`w-full p-2.5 rounded-xl text-xs text-left transition-all border flex items-center justify-between ${
                        filters.priceRange === p.id
                          ? 'bg-[#FAF0F3] border-[#B76E79] text-[#4A154B] font-bold shadow-2xs'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-[#E8D5C4]'
                      }`}
                    >
                      <span>{p.label}</span>
                      {filters.priceRange === p.id && (
                        <Check className="w-3.5 h-3.5 text-[#B76E79]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Stock Availability Filter */}
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-1.5">
                  {language === 'hi' ? 'स्टॉक उपलब्धता' : 'Stock Availability'}
                </label>
                <button
                  onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                    filters.inStockOnly
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span>{t.inStockOnly}</span>
                  {filters.inStockOnly && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-[#E8D5C4] flex items-center justify-between gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.resetFilters}</span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#67226B] text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                {t.applyFilters} ({filteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
