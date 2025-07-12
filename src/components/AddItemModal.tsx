import React, { FC, useState } from 'react';
import { Category } from '../App';

interface Props {
  name: string;
  setName(val: string): void;
  quantity: number;
  setQuantity(val: number): void;
  expiry: string;
  setExpiry(val: string): void;
  imageSearchTerm: string;
  setImageSearchTerm(val: string): void;
  filteredImages: string[];
  selectedImage: string;
  setSelectedImage(val: string): void;
  threshold: number;
  setThreshold(val: number): void;
  caseCost: number;
  setCaseCost(val: number): void;
  caseSize: number;
  setCaseSize(val: number): void;
  category: string;
  setCategory(val: string): void;
  categories: Category[];
  onCancel(): void;
  onAdd(): void;
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
}) => {
  const [unitType, setUnitType] = useState<'portion' | 'bag'>('portion');

  const previewCost = unitType === 'portion'
    ? ((caseCost / caseSize) * quantity || 0)
    : (caseCost * quantity || 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
      <div className="glass-card fade-in-up w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-sm">
        <h3 id="add-item-title" className="section-title">➕ Add New Item</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            Name
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
          </label>

          <label className="block">
            Quantity
            <input type="number" value={quantity} onChange={e => setQuantity(+e.target.value)} className="input-field" />
          </label>

          <label className="block">
            Expiry
            <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="input-field" />
          </label>

          <label className="block col-span-2">
            Filter Images
            <input type="text" value={imageSearchTerm} onChange={e => setImageSearchTerm(e.target.value)} className="input-field" />
          </label>

          <label className="block col-span-2">
            Choose Image
            <select value={selectedImage} onChange={e => setSelectedImage(e.target.value)} className="input-field">
              <option value="">— select —</option>
              {filteredImages.map(img => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>
          </label>

          <label className="block">
            Threshold
            <input type="number" value={threshold} onChange={e => setThreshold(+e.target.value)} className="input-field" />
          </label>

          <label className="block">
            Case Cost
            <input type="number" value={caseCost} onChange={e => setCaseCost(+e.target.value)} className="input-field" />
          </label>

          <label className="block">
            Case Size
            <input type="number" value={caseSize} onChange={e => setCaseSize(+e.target.value)} className="input-field" />
          </label>

          <label className="block">
            Unit Type
            <select value={unitType} onChange={e => setUnitType(e.target.value as 'portion' | 'bag')} className="input-field">
              <option value="portion">Per Portion</option>
              <option value="bag">Whole Bag</option>
            </select>
          </label>

          <div className="col-span-2 text-mint">
            💰 Estimated Cost: <strong>£{previewCost.toFixed(2)}</strong>
          </div>

          <label className="block col-span-2">
            Category
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field">
              <option value="">— select —</option>
              {categories.map(c => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onCancel} className="btn-glow bg-haze text-white hover:bg-haze/70">
            Cancel
          </button>
          <button onClick={onAdd} className="btn-glow">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;