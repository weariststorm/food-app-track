// src/components/StockPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import { Item, Category } from '../App'
import Card from './Card'

interface Props {
  items: Item[]
  categories: Category[]
  onDelete(id: number): void
  onEdit(item: Item): void
  onTogglePin(id: number): void
  onImport(json: Item[]): void
}

const StockPage: React.FC<Props> = ({
  items,
  categories,
  onDelete,
  onEdit,
  onTogglePin,
  onImport
}) => {
  const [selectedCat, setSelectedCat] = useState<'all' | string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<'name' | 'quantity' | 'expiry'>('name')
  const [sortAsc, setSortAsc] = useState(true)
  const [compactMode, setCompactMode] = useState(false)
  const [expiringSoonCount, setExpiringSoonCount] = useState(0)

  // cutoff for “soon”
  const soonCutoff = new Date()
  soonCutoff.setDate(soonCutoff.getDate() + 3)

  useEffect(() => {
    const count = items.filter(i => new Date(i.expiry) <= soonCutoff).length
    setExpiringSoonCount(count)
  }, [items])

  const catList = [{ label: 'All', value: 'all', emoji: '📦' }, ...categories]

  // filter out def/prep first, then category & search
  const filtered = items
    .filter(i => i.category !== 'def/prep')
    .filter(i => selectedCat === 'all' || i.category === selectedCat)
    .filter(i =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    )

  // sort & pin-first
  const visibleItems = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      let cmp = 0
      if (sortField === 'name') cmp = a.name.localeCompare(b.name)
      if (sortField === 'quantity') cmp = a.quantity - b.quantity
      if (sortField === 'expiry') cmp = a.expiry.localeCompare(b.expiry)

      return sortAsc ? cmp : -cmp
    })
  }, [filtered, sortField, sortAsc])

  // total stock cost (excluding def/prep)
  const totalStockCost = useMemo(() => {
    return filtered.reduce((sum, i) => {
      const cost =
        i.unitType === 'portion'
          ? i.caseSize > 0
            ? (i.caseCost / i.caseSize) * i.quantity
            : 0
          : i.caseCost * i.quantity
      return sum + cost
    }, 0)
  }, [filtered])

  // download JSON backup
  function handleSaveData() {
    const blob = new Blob([JSON.stringify(items, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stock-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  // import JSON
  function handleLoadData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string)
        if (Array.isArray(json)) onImport(json)
      } catch {
        alert('Invalid file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="p-4">
      {/* warning banner */}
      {expiringSoonCount > 0 && (
        <div className="bg-amber-700 text-white rounded p-3 mb-4 flex justify-between items-center text-sm">
          ⚠️ {expiringSoonCount} item
          {expiringSoonCount !== 1 && 's'} expiring within 3 days
        </div>
      )}

      {/* save / load buttons */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <button
          onClick={handleSaveData}
          className="flex-1 px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded text-sm text-center"
        >
          💾 Save Data
        </button>
        <label className="flex-1 px-4 py-2 bg-teal-700 hover:bg-teal-600 rounded text-sm text-center cursor-pointer">
          🔄 Load Data
          <input
            type="file"
            accept=".json"
            onChange={handleLoadData}
            className="hidden"
          />
        </label>
      </div>

      {/* categories scroll */}
      <div className="flex space-x-2 overflow-x-auto mb-4 text-xs">
        {catList.map(c => (
          <button
            key={c.value}
            onClick={() => setSelectedCat(c.value)}
            className={`flex-none p-2 rounded whitespace-nowrap ${
              selectedCat === c.value
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-gray-300'
            }`}
          >
            {c.emoji} {c.label}
            {c.value !== 'all' && (
              <span className="ml-1 text-gray-200">
                ({items.filter(i => i.category === c.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* search + sort + modes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 bg-gray-700 text-white rounded text-sm"
        />

        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as any)}
            className="p-2 bg-gray-700 text-white rounded text-sm"
          >
            <option value="name">Name</option>
            <option value="quantity">Quantity</option>
            <option value="expiry">Expiry</option>
          </select>
          <button
            onClick={() => setSortAsc(p => !p)}
            className="px-2 py-2 bg-gray-700 text-white rounded text-sm"
          >
            {sortAsc ? '↑' : '↓'}
          </button>
          <button
            onClick={() => setCompactMode(p => !p)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            {compactMode ? '🧺 Full' : '📘 Compact'}
          </button>
        </div>
      </div>

      {/* total stock cost */}
      <div className="text-right mb-4 text-lg font-semibold text-emerald-400">
        Total Stock Cost: £{totalStockCost.toFixed(2)}
      </div>

      {/* item grid */}
      {visibleItems.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">No items match.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {visibleItems.map(item => (
            <Card
              key={item.id}
              item={item}
              onDelete={onDelete}
              onEdit={() => onEdit(item)}
              onCompact={compactMode}
              togglePin={() => onTogglePin(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default StockPage