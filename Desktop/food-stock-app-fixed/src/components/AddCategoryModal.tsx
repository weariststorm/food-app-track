// src/components/AddCategoryModal.tsx
import React, { FC } from 'react';
import { Category } from '../App';

interface Props {
  onCancel(): void;
  onAdd(cat: Category): void;
}

const AddCategoryModal: FC<Props> = ({ onCancel, onAdd }) => {
  const [label, setLabel] = React.useState('');
  const [value, setValue] = React.useState('');
  const [emoji, setEmoji] = React.useState('📦');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-cat-title"
    >
      <div className="bg-slate-900 text-white rounded-lg p-4 w-full max-w-sm max-h-[90vh] overflow-auto text-sm">
        <h3 id="add-cat-title" className="text-xl font-semibold mb-4">
          ➕ Add Category
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
          <label className="block">
            Value (slug)
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value)}
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
            onClick={() => onAdd({ label: label.trim(), value: value.trim(), emoji })}
            className="px-3 py-1 bg-emerald-600 rounded focus:ring-2 focus:ring-emerald-400"
            disabled={!label.trim() || !value.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;