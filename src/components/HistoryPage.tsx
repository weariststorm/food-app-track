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
    <div className="p-4 max-w-screen overflow-x-hidden">
      <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center sm:text-left">
        📜 History
      </h2>

      <button
        onClick={handleExportCsv}
        className="mb-6 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm block mx-auto sm:mx-0"
      >
        📥 Export CSV
      </button>

      {logs.length === 0 ? (
        <p className="text-gray-400 text-center">No history recorded.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-slate-700">
          <table className="w-full text-left text-sm min-w-[320px] border-collapse">
            <thead>
              <tr className="border-b border-slate-600 bg-slate-800">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Item</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b border-slate-700">
                  <td className="py-2 px-3 text-xs text-gray-300">
                    {new Date(log.time).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">{log.name}</td>
                  <td className="py-2 px-3 capitalize">{log.action}</td>
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