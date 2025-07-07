// src/components/DashboardPage.tsx
import React, { FC, useMemo } from 'react';
import { Item, Category } from '../App';

interface Props {
  items: Item[];
  categories: Category[];
}

const DashboardPage: FC<Props> = ({ items, categories }) => {
  // start-of-today timestamp
  const todayStart = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }, []);

  // overall summary stats
  const stats = useMemo(() => {
    const totalItems = items.length;
    const totalStockCost = items.reduce((sum, it) => {
      const unitCost = it.caseSize > 0 ? it.caseCost / it.caseSize : 0;
      return sum + unitCost * it.quantity;
    }, 0);
    const outOfStock = items.filter(it => it.level === 'OOS').length;
    const expiringToday = items.filter(it => {
      const ts = new Date(it.expiry).getTime();
      return ts >= todayStart && ts < todayStart + 86_400_000;
    }).length;

    return { totalItems, totalStockCost, outOfStock, expiringToday };
  }, [items, todayStart]);

  // per‐category breakdown
  const breakdown = useMemo(() => {
    return categories.map(cat => {
      const catItems = items.filter(i => i.category === cat.value);
      const itemCount = catItems.length;
      const categoryCost = catItems.reduce((sum, it) => {
        const unitCost = it.caseSize > 0 ? it.caseCost / it.caseSize : 0;
        return sum + unitCost * it.quantity;
      }, 0);
      return {
        ...cat,
        itemCount,
        categoryCost
      };
    });
  }, [items, categories]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">
        📊 Dashboard
      </h2>

      {/* overall summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded text-center">
          <div className="text-gray-400">Total Items</div>
          <div className="text-2xl font-semibold">{stats.totalItems}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <div className="text-gray-400">Total Stock Cost</div>
          <div className="text-2xl font-semibold">
            £{stats.totalStockCost.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <div className="text-gray-400">Out of Stock</div>
          <div className="text-2xl font-semibold">{stats.outOfStock}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded text-center">
          <div className="text-gray-400">Expiring Today</div>
          <div className="text-2xl font-semibold">{stats.expiringToday}</div>
        </div>
      </div>

      {/* category breakdown cards */}
      <h3 className="text-2xl font-semibold mb-4">🔖 Category Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {breakdown.map(cat => (
          <div
            key={cat.value}
            className="bg-slate-800 p-4 rounded text-center"
          >
            <div className="text-xl">
              {cat.emoji} {cat.label}
            </div>
            <div className="mt-2 text-gray-400">Items: {cat.itemCount}</div>
            <div className="mt-1 text-emerald-300 font-semibold">
              £{cat.categoryCost.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;