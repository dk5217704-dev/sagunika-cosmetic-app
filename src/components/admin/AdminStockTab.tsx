import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  PackageCheck,
  DollarSign
} from 'lucide-react';
import { Product } from '../../types';
import { firestoreRepo } from '../../services/firebase';

interface AdminStockTabProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

export const AdminStockTab: React.FC<AdminStockTabProps> = ({
  products,
  onUpdateProducts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick edit inline
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickAdd = (productId: string, currentStock: number, delta: number) => {
    const newStock = Math.max(0, currentStock + delta);
    const updated = firestoreRepo.updateStock(productId, newStock);
    onUpdateProducts(updated);
    showToast(`Restocked +${delta} units.`);
  };

  const handleSaveInlineStock = (productId: string) => {
    const val = parseInt(tempStockValue);
    if (isNaN(val) || val < 0) return;
    const updated = firestoreRepo.updateStock(productId, val);
    onUpdateProducts(updated);
    setEditingStockId(null);
    showToast(`Stock count updated to ${val} units.`);
  };

  const lowStockThreshold = 15;
  const lowStockCount = products.filter((p) => p.stockQuantity <= lowStockThreshold && p.stockQuantity > 0).length;
  const outOfStockCount = products.filter((p) => p.stockQuantity === 0).length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stockQuantity * p.price, 0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (stockFilter === 'low') return matchesSearch && p.stockQuantity <= lowStockThreshold && p.stockQuantity > 0;
    if (stockFilter === 'out') return matchesSearch && p.stockQuantity === 0;
    return matchesSearch;
  });

  return (
    <div id="admin-stock-tab" className="space-y-4">
      {toastMessage && (
        <div className="p-3 rounded-xl bg-[#4A154B] text-white text-xs font-semibold flex items-center space-x-2 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Inventory</span>
          <span className="text-xl font-extrabold text-[#4A154B] font-mono">
            {totalStockUnits} Units
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Across {products.length} catalog SKUs
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Inventory Valuation</span>
          <span className="text-xl font-extrabold text-emerald-700 font-mono">
            ₹{totalValuation.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">
            At retail selling price
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-600 block">Low Stock Alert</span>
          <span className="text-xl font-extrabold text-amber-600 font-mono">
            {lowStockCount} SKUs
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            &le; {lowStockThreshold} units remaining
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E8D5C4] shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-rose-600 block">Out of Stock</span>
          <span className="text-xl font-extrabold text-rose-600 font-mono">
            {outOfStockCount} SKUs
          </span>
          <span className="text-[10px] text-rose-500 block mt-0.5">
            Requires studio restock
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search SKUs to restock..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#4A154B]"
          />
        </div>

        <div className="flex rounded-xl bg-white border border-[#E8D5C4] p-1 shadow-2xs">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stockFilter === 'all'
                ? 'bg-[#4A154B] text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stockFilter === 'low'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setStockFilter('out')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              stockFilter === 'out'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Depleted ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="bg-white rounded-2xl border border-[#E8D5C4] overflow-hidden shadow-2xs">
        <div className="divide-y divide-gray-100">
          {filteredProducts.map((p) => {
            const isLow = p.stockQuantity <= lowStockThreshold && p.stockQuantity > 0;
            const isOut = p.stockQuantity === 0;

            return (
              <div
                key={p.id}
                id={`stock-row-${p.id}`}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F9] transition-colors"
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
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-purple-50 text-[#4A154B]">
                        {p.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mt-1 text-[11px]">
                      <span className="text-gray-500">
                        Price: <strong className="text-gray-800 font-mono">₹{p.price}</strong>
                      </span>
                      <span className="text-gray-500">
                        Valuation:{' '}
                        <strong className="text-emerald-700 font-mono">
                          ₹{(p.price * p.stockQuantity).toLocaleString('en-IN')}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stock Controls & Quick Restock */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {editingStockId === p.id ? (
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="0"
                        value={tempStockValue}
                        onChange={(e) => setTempStockValue(e.target.value)}
                        className="w-16 px-2 py-1 text-xs border border-gray-300 rounded-lg font-mono font-bold"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveInlineStock(p.id)}
                        className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingStockId(null)}
                        className="px-2 py-1 rounded-lg bg-gray-200 text-gray-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingStockId(p.id);
                        setTempStockValue(p.stockQuantity.toString());
                      }}
                      className={`px-3 py-1 rounded-xl font-mono font-bold text-xs border transition-colors cursor-pointer ${
                        isOut
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : isLow
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title="Click to edit stock manually"
                    >
                      {p.stockQuantity} in stock
                    </button>
                  )}

                  {/* Quick Restock Buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleQuickAdd(p.id, p.stockQuantity, 10)}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold cursor-pointer"
                      title="Add 10 units"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleQuickAdd(p.id, p.stockQuantity, 25)}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold cursor-pointer"
                      title="Add 25 units"
                    >
                      +25
                    </button>
                    <button
                      onClick={() => handleQuickAdd(p.id, p.stockQuantity, 50)}
                      className="px-2 py-1 rounded-lg bg-[#FAF0F3] hover:bg-[#F3E5EB] text-[#4A154B] text-[11px] font-bold border border-[#E8B4B8] cursor-pointer"
                      title="Add 50 units"
                    >
                      +50
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-xs">
              No products found matching current stock filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
