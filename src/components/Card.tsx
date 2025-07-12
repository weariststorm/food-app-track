import React from 'react';
import { Item, Category, getImagePath } from '../App';

interface Props {
  item: Item;
  category: Category | undefined;
  onEdit(): void;
  onDelete(): void;
}

const Card: React.FC<Props> = ({ item, category, onEdit, onDelete }) => {
  const imageSrc = item.image || '';
  const costPerUnit =
    item.unitType === 'portion'
      ? item.caseSize > 0
        ? item.caseCost / item.caseSize
        : 0
      : item.caseCost;

  return (
    <div className="glass-card relative hover:ring-2 hover:ring-plasma transition-all overflow-hidden p-4 rounded-xl shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase tracking-wide text-mint bg-haze/50 px-2 py-0.5 rounded-full">
          {category?.emoji} {category?.label}
        </span>
        <span className="text-xs text-white/60">
          {item.expiry ? `⏳ ${item.expiry}` : 'No expiry'}
        </span>
      </div>

      <img
        src={imageSrc}
        alt={item.name}
        className="w-full h-32 object-cover rounded-md grayscale hover:grayscale-0 transition"
      />

      <h3 className="font-bold tracking-tight text-white">{item.name}</h3>

      <div className="flex justify-between text-sm text-haze">
        <span>Qty: <strong className="text-white">{item.quantity}</strong></span>
        <span>Thres: <strong className="text-white">{item.threshold}</strong></span>
        <span>£{costPerUnit.toFixed(2)}</span>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={onEdit}
          className="btn-glow bg-haze/60 text-white hover:bg-plasma hover:text-black"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="btn-glow bg-red-600 hover:bg-red-400 text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;