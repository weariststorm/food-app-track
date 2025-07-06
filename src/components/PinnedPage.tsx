import React, { FC, useMemo } from 'react'
import { Item } from '../App'
import Card from './Card'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  items: Item[]
  onDelete(id: number): void
  onEdit(item: Item): void
  onTogglePin(id: number): void
}

const PinnedPage: FC<Props> = ({ items, onDelete, onEdit, onTogglePin }) => {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner'

  const pinnedItems = useMemo(() => items.filter(i => i.pinned), [items])

  return (
    <div className="p-4 max-w-screen overflow-x-hidden">
      <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center sm:text-left">
        📌 Pinned Items
      </h2>

      {pinnedItems.length === 0 ? (
        <p className="text-gray-400 text-center sm:text-left">No items pinned.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {pinnedItems.map(item => (
            <Card
              key={item.id}
              item={item}
              onDelete={isOwner ? () => onDelete(item.id) : undefined}
              onEdit={() => onEdit(item)}
              togglePin={() => onTogglePin(item.id)}
              onCompact={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PinnedPage