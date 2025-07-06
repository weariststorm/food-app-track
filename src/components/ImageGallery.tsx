import React, { useState } from 'react'
import { getImageEntries } from '../utils/imageUtils'

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState(() => getImageEntries())
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...images].sort((a, b) =>
    sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  )

  const removeImage = (name: string) => {
    setImages(prev => prev.filter(img => img.name !== name))
  }

  return (
    <div className="p-4 max-w-screen overflow-x-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-emerald-400">🖼 Image Gallery</h2>
        <button
          onClick={() => setSortAsc(p => !p)}
          className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-sm"
        >
          Sort: {sortAsc ? 'A→Z' : 'Z→A'}
        </button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-gray-400">No images found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {sorted.map(img => (
            <div
              key={img.name}
              className="bg-slate-800 rounded p-2 flex flex-col items-center shadow"
            >
              <img
                src={img.path}
                alt={img.name}
                className="w-full h-24 object-contain mb-2 bg-slate-700 rounded"
              />
              <p className="text-xs text-gray-300 text-center break-words">{img.name}</p>
              <button
                onClick={() => removeImage(img.name)}
                className="mt-2 bg-red-600 hover:bg-red-500 px-3 py-1 text-xs rounded"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery