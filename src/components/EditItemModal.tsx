import React, { FC, useState, useEffect, useMemo } from 'react'
import { Item, Category, presetImages, getImagePath } from '../App'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  item: Item
  categories: Category[]
  onCancel(): void
  onSave(updated: Item): void
}

const EditItemModal: FC<Props> = ({ item, categories, onCancel, onSave }) => {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner'

  const [quantity, setQuantity] = useState(item.quantity)
  const [expiry, setExpiry] = useState(item.expiry)
  const [name, setName] = useState(item.name)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState(
    presetImages.find(fn => getImagePath(fn) === item.image) || ''
  )
  const [threshold, setThreshold] = useState(item.threshold)
  const [caseCost, setCaseCost] = useState(item.caseCost)
  const [caseSize, setCaseSize] = useState(item.caseSize)
  const [category, setCategory] = useState(item.category)

  useEffect(() => {
    setQuantity(item.quantity)
    setExpiry(item.expiry)
    setName(item.name)
    setSearchTerm('')
    setSelectedImage(
      presetImages.find(fn => getImagePath(fn) === item.image) || ''
    )
    setThreshold(item.threshold)
    setCaseCost(item.caseCost)
    setCaseSize(item.caseSize)
    setCategory(item.category)
  }, [item])

  const filteredImages = useMemo(
    () => presetImages.filter(fn =>
      fn.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [searchTerm]
  )

  const handleSave = () => {
    if (isOwner) {
      onSave({
        ...item,
        name,
        quantity,
        expiry,
        image: selectedImage ? getImagePath(selectedImage) : item.image,
        threshold,
        caseCost,
        caseSize,
        category
      })
    } else {
      onSave({ ...item, quantity, expiry })
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-item-title"
    >
      <div className="bg-slate-900 text-white rounded-md shadow-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto text-sm">
        <h3 id="edit-item-title" className="text-xl font-semibold mb-4 text-emerald-400">
          ✏️ Edit Item
        </h3>

        {isOwner ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Name
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Quantity
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(+e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Expiry
              <input
                type="date"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Filter Images
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Choose Image
              <select
                value={selectedImage}
                onChange={e => setSelectedImage(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">— select —</option>
                {filteredImages.map(fn => (
                  <option key={fn} value={fn}>{fn}</option>
                ))}
              </select>
            </label>

            <label className="block">
              Threshold
              <input
                type="number"
                value={threshold}
                onChange={e => setThreshold(+e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Case Cost
              <input
                type="number"
                value={caseCost}
                onChange={e => setCaseCost(+e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Case Size
              <input
                type="number"
                value={caseSize}
                onChange={e => setCaseSize(+e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block sm:col-span-2">
              Category
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">— select —</option>
                {categories.map(c => (
                  <option key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block">
              Quantity
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(+e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>

            <label className="block">
              Expiry
              <input
                type="date"
                value={expiry}
                onChange={e => setExpiry(e.target.value)}
                className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
              />
            </label>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditItemModal