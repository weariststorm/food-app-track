// src/components/CategoryManagement.tsx
import React, { FC } from 'react';
import { Category } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  categories: Category[];
  onAdd(): void;
  onEdit(cat: Category): void;
  onDelete(value: string): void;
}

const CategoryManagement: FC<Props> = ({
  categories,
  onAdd,
  onEdit,
  onDelete
}) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  return (
    <div className="p-4">
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

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="py-2">Emoji</th>
            <th className="py-2">Label</th>
            {isOwner && <th className="py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.value} className="border-b border-gray-700">
              <td className="py-2">{cat.emoji}</td>
              <td className="py-2">{cat.label}</td>
              {isOwner && (
                <td className="py-2 space-x-4">
                  <button
                    onClick={() => onEdit(cat)}
                    className="text-blue-400 hover:text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(cat.value)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManagement;