import React, { FC, useMemo } from 'react'
import { Item, Category } from '../App'

interface Props {
  items: Item[]
  categories: Category[]
}

const DashboardPage: FC<Props> = ({ items, categories }) => {
  const todayStart = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  }, [])

  const stats = useMemo(() => {
    const totalItems = items.length
    const totalStockCost = items.reduce((sum, it) => {
      const unitCost = it.caseSize > 0 ? it.caseCost / it.caseSize : 0
      return sum + unitCost * it.quantity
    }, 0)
    const outOfStock = items.filter(it => it.level === 'OOS').length
    const expiringToday = items.filter(it => {
      const ts = new Date(it.expiry).getTime()
      return ts >= todayStart && ts < todayStart + 86_400_000
    }).length

    return { totalItems, totalStockCost, outOfStock, expiringToday }
  }, [items, todayStart])

  const breakdown = useMemo(() =>
    categories.map(cat => {
      const catItems = items.filter(i => i.category === cat.value)
      const itemCount = catItems.length
      const categoryCost = catItems.reduce((sum, it) => {
        const unitCost = it.caseSize > 0 ? it.caseCost / it.caseSize : 0
        return sum + unitCost * it.quantity
      }, 0)
      return { ...cat, itemCount, categoryCost }
    }), [items, categories]
  )

  return (
    <div className="p-4 max-w-screen overflow-x-hidden">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6">
        📊 Dashboard
      </h2>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-5 rounded-md text-center shadow">
          <div className="text-gray-400 text-sm mb-1">Total Items</div>
          <div className="text-2xl font-bold">{stats.totalItems}</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-md text-center shadow">
          <div className="text-gray-400 text-sm mb-1">Total Stock Cost</div>
          <div className="text-2xl font-bold text-emerald-300">
            £{stats.totalStockCost.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-800 p-5 rounded-md text-center shadow">
          <div className="text-gray-400 text-sm mb-1">Out of Stock</div>
          <div className="text-2xl font-bold">{stats.outOfStock}</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-md text-center shadow">
          <div className="text-gray-400 text-sm mb-1">Expiring Today</div>
          <div className="text-2xl font-bold">{stats.expiringToday}</div>
        </div>
      </div>

      {/* Category Breakdown */}
      <h3 className="text-2xl font-semibold mb-4">
        🔖 Category Breakdown
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {breakdown.map(cat => (
          <div key={cat.value} className="bg-slate-800 p-5 rounded-md text-center shadow">
            <div className="text-xl font-semibold text-white">
              {cat.emoji} {cat.label}
            </div>
            <div className="mt-2 text-gray-400 text-sm">Items: {cat.itemCount}</div>
            <div className="mt-1 text-emerald-300 font-bold text-lg">
              £{cat.categoryCost.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DashboardPage