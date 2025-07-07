// src/components/ItemHistory.tsx
import React from 'react';
import { getHistory } from '../utils/history';

const ItemHistory: React.FC = () => {
  const logs = getHistory();

  if (logs.length === 0) {
    return <p className="text-gray-400 text-sm text-center mt-4">No history logged yet.</p>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-emerald-400 mb-2">📋 Item History</h3>
      <div className="space-y-1 text-sm">
        {logs.map(log => (
          <div
            key={`${log.id}-${log.timestamp}`}
            className="bg-slate-700 px-3 py-2 rounded"
          >
            {log.action === 'added' && '➕'}
            {log.action === 'edited' && '✏️'}
            {log.action === 'deleted' && '🗑️'}{' '}
            <span className="font-semibold">{log.name}</span>{' '}
            <span className="text-gray-300">({log.action})</span>
            <br />
            <span className="text-xs text-gray-400">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemHistory;