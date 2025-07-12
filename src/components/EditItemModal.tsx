import React, { FC, useState, useEffect, useMemo } from 'react';
import { Item, Category, presetImages, getImagePath } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  item: Item;
  categories: Category[];
  onCancel(): void;
  onSave(updated: Item): void;
}

const EditItemModal: FC<Props> = ({ item, categories, onCancel, onSave }) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [quantity, setQuantity] = useState(item.quantity);
  const [expiry, setExpiry] = useState(item.expiry);
  const [name, setName] = useState(item.name);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(
    presetImages.find(fn => getImagePath(fn) === item.image) || ''
  );
  const [threshold, setThreshold] = useState(item.threshold);
  const [caseCost, setCaseCost] = useState(item.caseCost);
  const [caseSize, setCaseSize] = useState(item.caseSize);
  const [category, setCategory] = useState(item.category);
  const [unitType, setUnitType] = useState<'portion' | 'bag'>(item.unitType || 'portion');

  useEffect(() => {
    setQuantity(item.quantity);
    setExpiry(item.expiry);
    setName(item.name);
    setSearchTerm('');
    setSelectedImage(presetImages.find(fn => getImagePath(fn) === item.image) || '');
    setThreshold(item.threshold);
    setCaseCost(item.caseCost);
    setCaseSize(item.caseSize);
    setCategory(item.category);
    setUnitType(item.unitType || 'portion');
  }, [item]);

  const filteredImages = useMemo(
    () => presetImages.filter(fn => fn.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const previewCost =
    unitType === 'portion'
      ? caseSize > 0
        ? (caseCost / caseSize) * quantity
        : 0
      : caseCost * quantity;

  const handleSave = () => {
    const updated: Item = isOwner
      ? {
          ...item,
          name,
          quantity,
          expiry,
          image: selectedImage ? getImagePath(selectedImage) : item.image,
          threshold,
          caseCost,
          caseSize,
          category,
          unitType,
        }
      : { ...item, quantity, expiry };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-3">
      <div className="glass-card fade-in-up w-full max-w-md max-h-[90vh] overflow-y-auto p-5 text-sm">
        <h2 id="edit-item-title" className="section-title">✏️ Edit Item</h2>

        {isOwner ? (
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
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="input-field" />
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

            <div className="col-span-2 text-mint mt-1">
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
        ) : (
          <div className="space-y-4">
            <label className="block">
              Quantity
              <input type="number" value={quantity} onChange={e => setQuantity(+e.target.value)} className="input-field" />
            </label>

            <label className="block">
              Expiry
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} className="input-field" />
            </label>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          <button onClick={onCancel} className="btn-glow bg-haze hover:bg-haze/70 text-white">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-glow">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;