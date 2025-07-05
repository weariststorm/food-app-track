// src/components/ShoppingList.tsx
import React, { FC, useMemo } from 'react';
import { Item } from '../App';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  items: Item[];
  onEdit(item: Item): void;
  onTogglePin(id: number): void;
}

const ShoppingList: FC<Props> = ({ items, onEdit, onTogglePin }) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  // items at or below threshold
  const shoppingItems = useMemo(
    () => items.filter(i => i.quantity <= i.threshold),
    [items]
  );

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-emerald-400 mb-4">
        🛒 Shopping List
      </h2>

      {shoppingItems.length === 0 ? (
        <p className="text-gray-400">No items need buying.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {shoppingItems.map(item => (
            <Card
              key={item.id}
              item={item}
              onDelete={undefined}
              onEdit={() => onEdit(item)}
              togglePin={() => onTogglePin(item.id)}
              onCompact={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingList;