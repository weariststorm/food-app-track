import React, { FC, useMemo } from 'react';
import { Item, Category } from '../App';

interface Props {
  items: Item[];
  categories: Category[];
}

const DashboardPage: FC<Props> = ({ items, categories }) => {
  const todayStart = useMemo(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  }, []);

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
    <div className="p-5 space-y-8">
      <h2 className="text-2xl font-bold tracking-tight text-mint">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card text-center p-4">
          <div className="text-haze text-sm mb-1">Total Items</div>
          <div className="text-2xl font-bold text-white">{stats.totalItems}</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-haze text-sm mb-1">Total Stock Cost</div>
          <div className="text-2xl font-bold text-mint">£{stats.totalStockCost.toFixed(2)}</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-haze text-sm mb-1">Out of Stock</div>
          <div className="text-2xl font-bold text-plasma">{stats.outOfStock}</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-haze text-sm mb-1">Expiring Today</div>
          <div className="text-2xl font-bold text-white">{stats.expiringToday}</div>
        </div>
      </div>

      <h3 className="text-xl font-semibold tracking-wide text-white">🔖 Category Breakdown</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {breakdown.map(cat => (
          <div
            key={cat.value}
            className="glass-card p-4 text-sm text-white flex flex-col items-center justify-center text-center"
          >
            <div className="text-lg font-medium">
              {cat.emoji} {cat.label}
            </div>
            <div className="mt-1 text-haze">Items: {cat.itemCount}</div>
            <div className="mt-1 font-semibold text-mint">
              £{cat.categoryCost.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;