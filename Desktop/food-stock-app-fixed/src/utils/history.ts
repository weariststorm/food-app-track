// src/utils/history.ts

export interface LogEntry {
  id: number
  name: string
  action: string
  time: number
}

const STORAGE_KEY = 'stockHistory'

/**
 * Retrieve the full history array from localStorage.
 * Returns an empty array if none is found or parse fails.
 */
export function getHistory(): LogEntry[] {
  const json = localStorage.getItem(STORAGE_KEY)
  if (!json) return []
  try {
    return JSON.parse(json) as LogEntry[]
  } catch {
    return []
  }
}

/**
 * Add a new entry to history.
 * Prepends to the array, then truncates to last 100 entries.
 */
export function logItem(
  id: number,
  name: string,
  action: 'added' | 'edited' | 'deleted'
): void {
  const history = getHistory()
  const entry: LogEntry = {
    id,
    name,
    action,
    time: Date.now()
  }
  history.unshift(entry)
  if (history.length > 100) history.splice(100)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}