// src/components/EditCategoryModal.tsx
import React, { FC, useEffect, useState } from 'react';
import { Category } from '../App';

interface Props {
  category: Category;
  onCancel(): void;
  onSave(updated: Category): void;
}

const EditCategoryModal: FC<Props> = ({ category, onCancel, onSave }) => {
  const [label, setLabel] = useState(category.label);
  const [emoji, setEmoji] = useState(category.emoji);

  useEffect(() => {
    setLabel(category.label);
    setEmoji(category.emoji);
  }, [category]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-cat-title"
    >
      <div className="bg-slate-900 text-white rounded-lg p-4 w-full max-w-sm max-h-[90vh] overflow-auto text-sm">
        <h3 id="edit-cat-title" className="text-xl font-semibold mb-4">
          ✏️ Edit Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            Label
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
            />
          </label>
          <label className="block sm:col-span-2">
            Emoji
            <input
              type="text"
              value={emoji}
              onChange={e => setEmoji(e.target.value)}
              className="w-full mt-1 p-2 bg-gray-700 rounded focus:ring-2 focus:ring-emerald-400"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 bg-gray-600 rounded focus:ring-2 focus:ring-red-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...category, label: label.trim(), emoji })}
            className="px-3 py-1 bg-emerald-600 rounded focus:ring-2 focus:ring-emerald-400"
            disabled={!label.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;