// src/components/Card.tsx
import React, { FC } from 'react';
import { Item } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  item: Item;
  onDelete(id: number): void;
  onEdit(): void;
  onCompact: boolean;
  togglePin(): void;
}

const Card: FC<Props> = ({
  item,
  onDelete,
  onEdit,
  onCompact,
  togglePin
}) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  // unit cost and total value logic
  const unitCost = item.caseSize > 0
    ? item.caseCost / item.caseSize
    : item.caseCost;

  const totalCost = unitCost * item.quantity;

  return (
    <div
      className={`
        bg-slate-800 rounded-lg overflow-hidden shadow
        transform transition duration-200 hover:shadow-lg hover:scale-105
        flex flex-col p-2 text-xs
        w-full
        sm:max-w-[10rem]
        md:max-w-[12rem]
      `}
    >
      <div className="flex justify-between mb-1">
        <button
          onClick={togglePin}
          className={
            item.pinned
              ? 'text-amber-300'
              : 'text-gray-500'
          }
          title={
            item.pinned ? 'Unpin item' : 'Pin item'
          }
        >
          📌
        </button>
        {isOwner && (
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-400 hover:text-red-600"
            title="Delete item"
          >
            🗑️
          </button>
        )}
      </div>

      <img
        src={item.image}
        alt={item.name}
        className={`
          w-full object-contain mb-1 rounded
          h-16      /* mobile */
          sm:h-20   /* ≥640px */
          md:h-24   /* ≥768px */
        `}
      />

      <h4 className="font-medium truncate">
        {item.name}
      </h4>
      <p className="text-gray-400">
        Qty: <span className="font-semibold">
          {item.quantity}
        </span>
      </p>
      <p className="text-gray-400">
        Exp: <span className="font-semibold">
          {item.expiry}
        </span>
      </p>
      <p className="text-gray-400">
        Unit: <span className="font-semibold">
          £{unitCost.toFixed(2)}
        </span>
      </p>
      <p className="text-gray-400">
        Left: <span className="font-semibold">
          £{totalCost.toFixed(2)}
        </span>
      </p>

      <div className="mt-auto flex justify-between items-center pt-1">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-500 rounded px-2 py-1"
        >
          ✏️
        </button>
        {!isOwner && (
          <span
            className={`
              px-1 py-0.5 rounded text-[0.6rem]
              ${
                ['Low','OOS'].includes(item.level)
                  ? 'bg-rose-600'
                  : 'bg-green-600'
              }
            `}
          >
            {item.level === 'OOS' ? 'Out' : 'OK'}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;