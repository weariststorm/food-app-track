// src/components/HistoryPage.tsx

import React, { FC, useState, useEffect } from 'react'
import { getHistory, LogEntry } from '../utils/history'

const HistoryPage: FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    setLogs(getHistory())
  }, [])

  function handleExportCsv() {
    const header = ['Time', 'Item', 'Action']
    const rows = logs.map(l => [
      new Date(l.time).toLocaleString(),
      l.name,
      l.action
    ])
    const csv = [header, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-emerald-400 mb-4">
        📜 History
      </h2>

      <button
        onClick={handleExportCsv}
        className="mb-4 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm"
      >
        📥 Export CSV
      </button>

      {logs.length === 0 ? (
        <p className="text-gray-400">No history recorded.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-2">Time</th>
                <th className="py-2">Item</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="py-2 text-xs">
                    {new Date(log.time).toLocaleString()}
                  </td>
                  <td className="py-2">{log.name}</td>
                  <td className="py-2 capitalize">{log.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default HistoryPage