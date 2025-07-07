// src/types.ts (new file or extend existing)
export interface Item {
  id: number;
  name: string;
  quantity: number;
  image: string;
  level: 'Full' | 'Med' | 'Low' | 'OOS';
  expiry: string;
  threshold: number;
  caseCost: number;
  caseSize: number;
  category: 'dry' | 'fresh' | 'frozen' | 'desserts' | 'def/prep';
  pinned?: boolean; // ✅ new field
}