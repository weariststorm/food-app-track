import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/dashboard', emoji: '📊' },
  { label: 'Items', to: '/items', emoji: '📦' },
  { label: 'Add New', to: '/new', emoji: '➕' },
  { label: 'Categories', to: '/categories', emoji: '🗂️' },
  { label: 'Settings', to: '/settings', emoji: '⚙️' },
];

const NavBar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-void/80 backdrop-blur border-b border-haze/30">
      <div className="w-full overflow-x-auto whitespace-nowrap px-4 py-2 flex gap-3 sm:justify-center text-sm sm:text-base font-mono">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `transition px-3 py-1.5 rounded-full ${
                isActive
                  ? 'bg-plasma text-black font-semibold shadow shadow-plasma/50'
                  : 'text-white/80 hover:text-white hover:bg-haze/30'
              }`
            }
          >
            <span className="mr-1">{link.emoji}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;