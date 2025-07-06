// src/App.tsx
import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { NotificationProvider, useNotification } from './contexts/NotificationContext'
import { useAuth } from './contexts/AuthContext'

import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import StockPage from './components/StockPage'
import ExpiryPage from './components/ExpiryPage'
import ShoppingList from './components/ShoppingList'
import PinnedPage from './components/PinnedPage'
import CategoryManagement from './components/CategoryManagement'
import HistoryPage from './components/HistoryPage'
import AddItemModal from './components/AddItemModal'
import EditItemModal from './components/EditItemModal'
import AddCategoryModal from './components/AddCategoryModal'
import EditCategoryModal from './components/EditCategoryModal'

import { logItem } from './utils/history'

// dynamic image imports
export const imageModules = import.meta.glob('./assets/images/*.{png,jpg,jpeg}')
export const presetImages = Object.keys(imageModules).map(path =>
  path.replace('./assets/images/', '')
)

export function getImagePath(fn: string): string {
  return new URL(`./assets/images/${fn}`, import.meta.url).href
}

export function getStockLevel(q: number): 'Full' | 'Med' | 'Low' | 'OOS' {
  if (q >= 10) return 'Full'
  if (q >= 5) return 'Med'
  if (q >= 1) return 'Low'
  return 'OOS'
}

export interface Item {
  id: number
  name: string
  quantity: number
  image: string
  level: 'Full' | 'Med' | 'Low' | 'OOS'
  expiry: string
  threshold: number
  caseCost: number
  caseSize: number
  category: string
  pinned?: boolean
}

export interface Category {
  label: string
  value: string
  emoji: string
}

export default function App(): JSX.Element {
  return (
    <NotificationProvider>
      <InnerApp />
    </NotificationProvider>
  )
}

function InnerApp(): JSX.Element {
  const { user, logout } = useAuth()
  const { notify, confirm } = useNotification()
  const isOwner = user?.role === 'owner'
  const location = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)

  const defaultCategories: Category[] = [
    { label: 'Dry', value: 'dry', emoji: '🟤' },
    { label: 'Fresh', value: 'fresh', emoji: '🟢' },
    { label: 'Frozen', value: 'frozen', emoji: '🧊' },
    { label: 'Desserts', value: 'desserts', emoji: '🍰' },
    { label: 'Def/Prep', value: 'def/prep', emoji: '🚫' }
  ]

  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)

  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showAddCat, setShowAddCat] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [expiry, setExpiry] = useState('')
  const [imageSearchTerm, setImageSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [threshold, setThreshold] = useState(0)
  const [caseCost, setCaseCost] = useState(0)
  const [caseSize, setCaseSize] = useState(0)
  const [categoryVal, setCategoryVal] = useState(defaultCategories[0].value)

  useEffect(() => {
    const si = localStorage.getItem('stockItems')
    if (si) setItems(JSON.parse(si))
    const sc = localStorage.getItem('stockCategories')
    if (sc) setCategories(JSON.parse(sc))
  }, [])

  useEffect(() => {
    localStorage.setItem('stockItems', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('stockCategories', JSON.stringify(categories))
  }, [categories])

  function resetItemForm() {
    setShowAddItem(false)
    setName('')
    setQuantity(0)
    setExpiry('')
    setImageSearchTerm('')
    setSelectedImage('')
    setThreshold(0)
    setCaseCost(0)
    setCaseSize(0)
    setCategoryVal(defaultCategories[0].value)
  }

  function handleAddItem() {
    if (!name || !selectedImage || !expiry) return
    const newItem: Item = {
      id: Date.now(),
      name,
      quantity,
      image: getImagePath(selectedImage),
      level: getStockLevel(quantity),
      expiry,
      threshold,
      caseCost,
      caseSize,
      category: categoryVal,
      pinned: false
    }
    setItems(prev => [...prev, newItem])
    logItem(newItem.id, newItem.name, 'added')
    notify('success', 'Item added')
    resetItemForm()
  }

  async function handleDeleteItem(id: number) {
    if (!(await confirm('Delete this item?'))) return
    const it = items.find(i => i.id === id)
    if (it) logItem(id, it.name, 'deleted')
    setItems(prev => prev.filter(i => i.id !== id))
    notify('success', 'Item deleted')
  }

  function handleSaveEditItem(updated: Item) {
    setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)))
    if (editingItem) logItem(updated.id, updated.name, 'edited')
    setEditingItem(null)
    notify('success', 'Item updated')
  }

  function handleTogglePin(id: number) {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, pinned: !i.pinned } : i))
    )
    notify('info', 'Pin toggled')
  }

  async function handleImportItems(newItems: Item[]) {
    if (!(await confirm('Replace current stock with imported data?'))) return
    setItems(newItems)
    notify('success', 'Data imported')
  }

  function handleAddCategory(cat: Category) {
    setCategories(prev => [...prev, cat])
    setShowAddCat(false)
    notify('success', 'Category added')
  }

  function handleEditCategory(updated: Category) {
    setCategories(prev =>
      prev.map(c => (c.value === updated.value ? updated : c))
    )
    setEditingCat(null)
    notify('success', 'Category updated')
  }

  async function handleDeleteCategory(val: string) {
    if (!(await confirm('Delete this category?'))) return
    setCategories(prev => prev.filter(c => c.value !== val))
    setItems(prev =>
      prev.map(i =>
        i.category === val ? { ...i, category: defaultCategories[0].value } : i
      )
    )
    notify('success', 'Category deleted')
  }
    if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* header */}
      <header className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between p-4 border-b border-slate-700 gap-y-3">
        <h1 className="text-2xl font-bold text-emerald-400">📦 Food Stock Take</h1>

        {/* mobile toggle */}
        <button
          className="sm:hidden text-gray-300 ml-auto"
          onClick={() => setMobileOpen(o => !o)}
        >
          {mobileOpen ? '✖️' : '☰'}
        </button>

        {/* navigation */}
        <nav
          className={`w-full sm:w-auto ${
            mobileOpen ? 'block' : 'hidden'
          } sm:flex flex-wrap gap-4 text-sm mt-2 sm:mt-0`}
        >
          <Link to="/">Dashboard</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/expiry">Expiry</Link>
          {isOwner && <Link to="/shopping">Shopping</Link>}
          {isOwner && <Link to="/pinned">Pinned</Link>}
          {isOwner && <Link to="/categories">Categories</Link>}
          <Link to="/history">History</Link>
        </nav>

        {/* action buttons */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          {isOwner && (
            <button
              onClick={() => setShowAddItem(true)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-sm"
            >
              ➕ Add Item
            </button>
          )}
          <button
            onClick={logout}
            className="w-full sm:w-auto text-red-400 hover:text-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* page transitions */}
      <div className="relative flex-grow overflow-hidden">
        <TransitionGroup component={null}>
          <CSSTransition key={location.pathname} classNames="fade" timeout={200}>
            <div className="absolute inset-0 p-4 overflow-auto">
              <Routes location={location}>
                <Route
                  path="/"
                  element={
                    <DashboardPage
                      items={items}
                      categories={categories}
                      onDelete={handleDeleteItem}
                      onEdit={setEditingItem}
                      onTogglePin={handleTogglePin}
                    />
                  }
                />
                <Route
                  path="/stock"
                  element={
                    <StockPage
                      items={items}
                      categories={categories}
                      onDelete={handleDeleteItem}
                      onEdit={setEditingItem}
                      onTogglePin={handleTogglePin}
                      onImport={handleImportItems}
                    />
                  }
                />
                <Route
                  path="/expiry"
                  element={
                    <ExpiryPage
                      items={items}
                      onDelete={handleDeleteItem}
                      onEdit={setEditingItem}
                      onTogglePin={handleTogglePin}
                    />
                  }
                />
                <Route
                  path="/shopping"
                  element={
                    <ShoppingList
                      items={items}
                      onEdit={setEditingItem}
                      onTogglePin={handleTogglePin}
                    />
                  }
                />
                <Route
                  path="/pinned"
                  element={
                    <PinnedPage
                      items={items}
                      onDelete={handleDeleteItem}
                      onEdit={setEditingItem}
                      onTogglePin={handleTogglePin}
                    />
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <CategoryManagement
                      categories={categories}
                      onAdd={() => setShowAddCat(true)}
                      onEdit={setEditingCat}
                      onDelete={handleDeleteCategory}
                    />
                  }
                />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>

      {/* modals */}
      {showAddItem && isOwner && (
        <AddItemModal
          name={name}
          setName={setName}
          quantity={quantity}
          setQuantity={setQuantity}
          expiry={expiry}
          setExpiry={setExpiry}
          imageSearchTerm={imageSearchTerm}
          setImageSearchTerm={setImageSearchTerm}
          filteredImages={presetImages.filter(fn =>
            fn.includes(imageSearchTerm)
          )}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          threshold={threshold}
          setThreshold={setThreshold}
          caseCost={caseCost}
          setCaseCost={setCaseCost}
          caseSize={caseSize}
          setCaseSize={setCaseSize}
          category={categoryVal}
          setCategory={setCategoryVal}
          categories={categories}
          onCancel={resetItemForm}
          onAdd={handleAddItem}
        />
      )}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          categories={categories}
          onCancel={() => setEditingItem(null)}
          onSave={handleSaveEditItem}
        />
      )}
      {showAddCat && (
        <AddCategoryModal
          onCancel={() => setShowAddCat(false)}
          onAdd={handleAddCategory}
        />
      )}
      {editingCat && (
        <EditCategoryModal
          category={editingCat}
          onCancel={() => setEditingCat(null)}
          onSave={handleEditCategory}
        />
      )}
    </div>
  )
}