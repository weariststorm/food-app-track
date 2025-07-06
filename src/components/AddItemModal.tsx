import React, { FC } from 'react'
import { Category } from '../App'

interface Props {
  name: string
  setName(val: string): void
  quantity: number
  setQuantity(val: number): void
  expiry: string
  setExpiry(val: string): void
  imageSearchTerm: string
  setImageSearchTerm(val: string): void
  filteredImages: string[]
  selectedImage: string
  setSelectedImage(val: string): void
  threshold: number
  setThreshold(val: number): void
  caseCost: number
  setCaseCost(val: number): void
  caseSize: number
  setCaseSize(val: number): void
  category: string
  setCategory(val: string): void
  categories: Category[]
  onCancel(): void
  onAdd(): void
}

const AddItemModal: FC<Props> = ({
  name, setName,
  quantity, setQuantity,
  expiry, setExpiry,
  imageSearchTerm, setImageSearchTerm,
  filteredImages, selectedImage, setSelectedImage,
  threshold, setThreshold,
  caseCost, setCaseCost,
  caseSize, setCaseSize,
  category, setCategory,
  categories, onCancel, onAdd
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-3 z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="add-item-title"
  >
    <div className="bg-slate-900 text-white rounded-md shadow-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
      <h3 id="add-item-title" className="text-xl font-semibold mb-4 text-emerald-400">
        ➕ Add Item
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            value={imageSearchTerm}
            onChange={e => setImageSearchTerm(e.target.value)}
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
            {filteredImages.map(img => (
              <option key={img} value={img}>{img}</option>
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

      <div className="mt-5 flex flex-col sm:flex-row justify-end gap-2">
        <button
          onClick={onCancel}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded focus:ring-2 focus:ring-red-400"
        >
          Cancel
        </button>
        <button
          onClick={onAdd}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded focus:ring-2 focus:ring-emerald-400"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)

export default AddItemModal