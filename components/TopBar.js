'use client';

import { useState, useRef, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'house', label: 'Plan Wagons' },
  { id: 'leaderboard', label: 'Town Board' },
  { id: 'atlas', label: 'Atlas Depot' },
  { id: 'trainer', label: 'Trainer Hall' },
  { id: 'share', label: 'Share Card' }
];

export default function BrandOverlay({ onOpenModal }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  return (
    <div className="brandOverlay" ref={drawerRef}>
      <div className="brandBadge">
        <span className="brandStar" aria-hidden="true" />
        <span className="brandTitle">Agent Town</span>
      </div>
      <button
        className="hamburgerBtn"
        type="button"
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span className="hamburgerLine" />
        <span className="hamburgerLine" />
        <span className="hamburgerLine" />
      </button>

      {menuOpen && (
        <nav className="navDrawer" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className="navDrawerItem"
              type="button"
              onClick={() => {
                onOpenModal?.(item.id);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
