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

export interface FilterState {
  searchQuery: string;
  category: 'all' | CategoryType;
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

const QUICK_SEARCH_CHIPS = [
  'Bridal Vanity',
  'Herbal Sindoor',
  '24K Gold Strobe',
  'Royal Groom Trunk',
  'Imperial Oud',
  'Kumkumadi Oil',
  'Damask Rose',
  'Hair Spa'
];

export const ProductCatalogControls: React.FC<ProductCatalogControlsProps> = ({
  filters,
  onFilterChange,
  totalProductsCount,
  filteredCount,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // Compute active filters count (excluding default 'all' / 'featured')
  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.category !== 'all' ? 1 : 0) +
    (filters.priceRange !== 'all' ? 1 : 0) +
    (filters.occasion !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const handleResetFilters = () => {
    onFilterChange({
      searchQuery: '',
      category: 'all',
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
        return 'Featured & Best Picks';
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'rating-desc':
        return 'Highest Rated ★';
      case 'bestseller':
        return 'Best Sellers';
      case 'newest':
        return 'Newest Arrivals';
      default:
        return 'Sort';
    }
  };

  const getOccasionLabel = (occ: OccasionOption) => {
    switch (occ) {
      case 'wedding':
        return 'Wedding & Pheras';
      case 'reception':
        return 'Reception & Gala';
      case 'sangeet':
        return 'Sangeet & Mehendi';
      case 'haldi':
        return 'Haldi Ceremony';
      case 'festive':
        return 'Festive & Puja';
      case 'daily':
        return 'Daily Radiance';
      default:
        return 'All Occasions';
    }
  };

  const getPriceLabel = (range: PriceRangeOption) => {
    switch (range) {
      case 'under-1500':
        return 'Under ₹1,500';
      case '1500-3000':
        return '₹1,500 – ₹3,000';
      case '3000-5000':
        return '₹3,000 – ₹5,000';
      case 'above-5000':
        return 'Above ₹5,000 (Royal Vault)';
      default:
        return 'All Prices';
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
          placeholder="Search bridal trousseau, groom care, 24K gold, saffron, oud..."
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
          Quick:
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
            { id: 'all', label: 'All Catalog' },
            { id: 'wedding', label: '✨ Wedding' },
            { id: 'groom', label: '👑 Groom' },
            { id: 'skincare', label: '🌹 Skincare' },
            { id: 'makeup', label: '💄 Makeup' },
            { id: 'fragrance', label: '🌸 Fragrance' },
            { id: 'haircare', label: '🌿 Haircare' },
            { id: 'ayurvedic', label: '🍃 Ayurvedic' },
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
            <span>Filters</span>
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
              <span className="hidden sm:inline text-gray-500 text-[11px]">Sort:</span>
              <span className="font-bold text-[#4A154B] truncate max-w-[110px] sm:max-w-[140px]">
                {getSortLabel(filters.sortBy)}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-[#E8D5C4] py-1 z-40">
                {[
                  { id: 'featured', label: 'Featured & Best Picks' },
                  { id: 'price-asc', label: 'Price: Low to High' },
                  { id: 'price-desc', label: 'Price: High to Low' },
                  { id: 'rating-desc', label: 'Highest Rated ★' },
                  { id: 'bestseller', label: 'Best Sellers' },
                  { id: 'newest', label: 'Newest Arrivals' },
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
            Active:
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
              <span>Category: {filters.category}</span>
              <button
                onClick={() => onFilterChange({ ...filters, category: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priceRange !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#4A154B]">
              <span>Price: {getPriceLabel(filters.priceRange)}</span>
              <button
                onClick={() => onFilterChange({ ...filters, priceRange: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.occasion !== 'all' && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#FAF0F3] border border-[#E8B4B8] text-[11px] font-medium text-[#8C4A5A]">
              <span>Occasion: {getOccasionLabel(filters.occasion)}</span>
              <button
                onClick={() => onFilterChange({ ...filters, occasion: 'all' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-700">
              <span>In Stock Only</span>
              <button
                onClick={() => onFilterChange({ ...filters, inStockOnly: false })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minRating && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-medium text-amber-700">
              <span>{filters.minRating}+ Stars</span>
              <button
                onClick={() => onFilterChange({ ...filters, minRating: undefined })}
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
            <span>Reset All</span>
          </button>
        </div>
      )}

      {/* Live Result Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-0.5">
        <span>
          Showing <strong className="text-[#4A154B]">{filteredCount}</strong> of{' '}
          {totalProductsCount} Luxury Formulations
        </span>
        {filteredCount === 0 && (
          <span className="text-amber-600 font-medium">No direct matches. Try loosening filters!</span>
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
                  Filter Catalog
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
                  Category / Department
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All Collections' },
                    { id: 'wedding', label: 'Wedding Collection' },
                    { id: 'groom', label: 'Groom Collection' },
                    { id: 'skincare', label: 'Luxury Skincare' },
                    { id: 'makeup', label: 'Bridal Makeup' },
                    { id: 'fragrance', label: 'Royal Fragrance' },
                    { id: 'haircare', label: 'Hair Spa & Oils' },
                    { id: 'ayurvedic', label: 'Ayurvedic Elixirs' },
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

              {/* 2. Occasion Filter */}
              <div>
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-2.5">
                  Ceremony & Occasion
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All Occasions' },
                    { id: 'wedding', label: '💒 Wedding & Pheras' },
                    { id: 'reception', label: '🍸 Reception & Gala' },
                    { id: 'sangeet', label: '🎶 Sangeet & Mehendi' },
                    { id: 'haldi', label: '🌼 Haldi Ceremony' },
                    { id: 'festive', label: '🪔 Festive & Puja' },
                    { id: 'daily', label: '✨ Daily Radiance' },
                  ].map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => onFilterChange({ ...filters, occasion: occ.id as any })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                        filters.occasion === occ.id
                          ? 'bg-[#4A154B] text-white border-[#4A154B] shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-[#B76E79]'
                      }`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div>
                <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-2.5">
                  Price Range
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Price Bands' },
                    { id: 'under-1500', label: 'Under ₹1,500 (Accessible Radiance)' },
                    { id: '1500-3000', label: '₹1,500 – ₹3,000 (Signature Formulations)' },
                    { id: '3000-5000', label: '₹3,000 – ₹5,000 (Luxury Ceremonial Sets)' },
                    { id: 'above-5000', label: 'Above ₹5,000 (Royal Vault Trousseau)' },
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

              {/* 4. Minimum Rating & Stock Filter */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-1.5">
                    Customer Rating
                  </label>
                  <div className="flex gap-1.5">
                    {[undefined, 4.0, 4.5].map((rate) => (
                      <button
                        key={rate || 'any'}
                        onClick={() => onFilterChange({ ...filters, minRating: rate })}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                          filters.minRating === rate
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {rate ? (
                          <>
                            <span>{rate}</span>
                            <Star className="w-3 h-3 fill-current" />
                          </>
                        ) : (
                          <span>Any</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#4A154B] uppercase tracking-wider block mb-1.5">
                    Stock Availability
                  </label>
                  <button
                    onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-center space-x-1.5 ${
                      filters.inStockOnly
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>In-Stock Only</span>
                    {filters.inStockOnly && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-3.5 border-t border-[#E8D5C4] flex items-center justify-between gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4A154B] to-[#67226B] text-white text-xs font-bold shadow-md hover:opacity-95"
              >
                Show {filteredCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
