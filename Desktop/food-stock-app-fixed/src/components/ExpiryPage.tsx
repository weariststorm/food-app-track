// src/components/ExpiryPage.tsx
import React, { FC, useState, useMemo } from 'react';
import { Item } from '../App';
import Card from './Card';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  items: Item[];
  onDelete(id: number): void;
  onEdit(item: Item): void;
  onTogglePin(id: number): void;
}

type TabKey = 'today' | 'tomorrow' | 'later';

const tabLabels: Record<TabKey, string> = {
  today: 'Today',
  tomorrow: 'Tomorrow',
  later: '3+ Days'
};

const ExpiryPage: FC<Props> = ({ items, onDelete, onEdit, onTogglePin }) => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [activeTab, setActiveTab] = useState<TabKey>('today');

  // boundaries
  const now = Date.now();
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
  const startOfTomorrow = startOfToday + 24 * 60 * 60 * 1000;
  const startOfDayAfter = startOfTomorrow + 24 * 60 * 60 * 1000;

  const filtered = useMemo(() => {
    return items.filter(item => {
      const expTs = new Date(item.expiry).getTime();
      if (activeTab === 'today') {
        return expTs >= startOfToday && expTs < startOfTomorrow;
      }
      if (activeTab === 'tomorrow') {
        return expTs >= startOfTomorrow && expTs < startOfDayAfter;
      }
      return expTs >= startOfDayAfter;
    });
  }, [items, activeTab, startOfToday, startOfTomorrow, startOfDayAfter]);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-emerald-400 mb-4">
        📅 Expiry
      </h2>

      {/* Tabs */}
      <div className="overflow-x-auto mb-6">
        <div className="flex space-x-2 min-w-max">
          {(['today', 'tomorrow', 'later'] as TabKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                activeTab === key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tabLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">
          No items expiring {tabLabels[activeTab].toLowerCase()}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(item => (
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
  );
};

export default ExpiryPage;