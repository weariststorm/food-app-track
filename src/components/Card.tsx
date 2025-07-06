import React, { FC } from 'react'
import { Item } from '../App'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  item: Item
  onDelete(id: number): void
  onEdit(): void
  onCompact: boolean
  togglePin(): void
}

const Card: FC<Props> = ({
  item,
  onDelete,
  onEdit,
  onCompact,
  togglePin
}) => {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner'
  const unitCost = item.caseSize > 0 ? item.caseCost / item.caseSize : 0

  return (
    <div
      className="bg-slate-800 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] flex flex-col p-3 text-sm w-full"
    >
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={togglePin}
          className={item.pinned ? 'text-amber-300' : 'text-gray-500'}
          title={item.pinned ? 'Unpin item' : 'Pin item'}
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
        className="w-full h-20 sm:h-24 object-contain mb-2 rounded bg-slate-700"
      />

      <h4 className="font-semibold truncate">{item.name}</h4>
      <p className="text-gray-400">Qty: <span className="font-semibold">{item.quantity}</span></p>
      <p className="text-gray-400">Exp: <span className="font-semibold">{item.expiry}</span></p>
      <p className="text-gray-400">Cost: <span className="font-semibold">£{unitCost.toFixed(2)}</span></p>

      <div className="mt-auto flex justify-between items-center pt-2">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-1 text-white text-xs"
        >
          ✏️ Edit
        </button>
        {!isOwner && (
          <span
            className={`px-2 py-0.5 rounded text-[0.65rem] text-white ${
              ['Low', 'OOS'].includes(item.level)
                ? 'bg-rose-600'
                : 'bg-green-600'
            }`}
          >
            {item.level === 'OOS' ? 'Out' : 'OK'}
          </span>
        )}
      </div>
    </div>
  )
}

export default Cardimport React, { FC } from 'react'
import { Item } from '../App'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  item: Item
  onDelete(id: number): void
  onEdit(): void
  onCompact: boolean
  togglePin(): void
}

const Card: FC<Props> = ({
  item,
  onDelete,
  onEdit,
  onCompact,
  togglePin
}) => {
  const { user } = useAuth()
  const isOwner = user?.role === 'owner'
  const unitCost = item.caseSize > 0 ? item.caseCost / item.caseSize : 0

  return (
    <div
      className="bg-slate-800 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:shadow-lg hover:scale-[1.02] flex flex-col p-3 text-sm w-full"
    >
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={togglePin}
          className={item.pinned ? 'text-amber-300' : 'text-gray-500'}
          title={item.pinned ? 'Unpin item' : 'Pin item'}
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
        className="w-full h-20 sm:h-24 object-contain mb-2 rounded bg-slate-700"
      />

      <h4 className="font-semibold truncate">{item.name}</h4>
      <p className="text-gray-400">Qty: <span className="font-semibold">{item.quantity}</span></p>
      <p className="text-gray-400">Exp: <span className="font-semibold">{item.expiry}</span></p>
      <p className="text-gray-400">Cost: <span className="font-semibold">£{unitCost.toFixed(2)}</span></p>

      <div className="mt-auto flex justify-between items-center pt-2">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-1 text-white text-xs"
        >
          ✏️ Edit
        </button>
        {!isOwner && (
          <span
            className={`px-2 py-0.5 rounded text-[0.65rem] text-white ${
              ['Low', 'OOS'].includes(item.level)
                ? 'bg-rose-600'
                : 'bg-green-600'
            }`}
          >
            {item.level === 'OOS' ? 'Out' : 'OK'}
          </span>
        )}
      </div>
    </div>
  )
}

export default Card