// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BannerType = 'success' | 'error' | 'info' | 'confirm';

export interface Banner {
  id: number;
  type: BannerType;
  message: string;
  actions?: {
    label: string;
    callback: () => void;
  }[];
}

interface NotificationContextValue {
  notify: (type: BannerType, message: string) => void;
  confirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [banners, setBanners] = useState<Banner[]>([]);

  const remove = (id: number) => {
    setBanners(bs => bs.filter(b => b.id !== id));
  };

  const notify = (type: BannerType, message: string) => {
    const id = Date.now();
    setBanners(bs => [...bs, { id, type, message }]);
    setTimeout(() => remove(id), 3000);
  };

  const confirm = (message: string) => {
    return new Promise<boolean>(resolve => {
      const id = Date.now();
      const yes = () => { resolve(true); remove(id); };
      const no = () => { resolve(false); remove(id); };
      setBanners(bs => [
        ...bs,
        {
          id,
          type: 'confirm',
          message,
          actions: [
            { label: 'Yes', callback: yes },
            { label: 'No', callback: no }
          ]
        }
      ]);
    });
  };

  return (
    <NotificationContext.Provider value={{ notify, confirm }}>
      {children}
      <div className="fixed top-0 inset-x-0 flex flex-col items-center z-50 space-y-2 p-4">
        {banners.map(b => (
          <div
            key={b.id}
            className={`w-full max-w-md px-4 py-2 rounded shadow text-white ${
              b.type === 'success' ? 'bg-green-600'
              : b.type === 'error'   ? 'bg-red-600'
              : b.type === 'confirm' ? 'bg-blue-600'
              : 'bg-gray-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{b.message}</span>
              {b.actions && (
                <div className="flex space-x-2">
                  {b.actions.map(a => (
                    <button
                      key={a.label}
                      onClick={a.callback}
                      className="bg-white text-black px-2 py-1 rounded"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextValue => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be inside NotificationProvider');
  return ctx;
};