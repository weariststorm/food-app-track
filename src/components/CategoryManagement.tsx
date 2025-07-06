import React, { FC } from 'react'
import { Category } from '../App'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  categories: Category[]
  onAdd(): void
  onEdit(cat: Category): void
  onDelete(value: string): void
}

const CategoryManagement: FC<Props> = ({
  categories,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner'

  return (
    <div className="p-4 max-w-screen overflow-x-hidden">
      <h2 className="text-3xl font-bold text-emerald-400 mb-4">
        🗂 Categories
      </h2>

      {isOwner && (
        <button
          onClick={onAdd}
          className="mb-4 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm"
        >
          ➕ Add Category
        </button>
      )}

      <div className="overflow-x-auto rounded border border-slate-700">
        <table className="w-full text-left border-collapse text-sm min-w-[320px]">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-800">
              <th className="py-2 px-3">Emoji</th>
              <th className="py-2 px-3">Label</th>
              {isOwner && <th className="py-2 px-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.value} className="border-b border-slate-700">
                <td className="py-2 px-3">{cat.emoji}</td>
                <td className="py-2 px-3">{cat.label}</td>
                {isOwner && (
                  <td className="py-2 px-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => onEdit(cat)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(cat.value)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CategoryManagement