import React from 'react';
import { Home, Swords, Bot, Puzzle, BookOpen, User, Trophy } from 'lucide-react';

export const Navbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'aprender', label: 'Aprender', icon: BookOpen },
    { id: 'problemas', label: 'Problemas', icon: Puzzle },
    { id: 'robots', label: 'Robots', icon: Bot },
    { id: 'jugar', label: 'Jugar', icon: Swords },
    { id: 'torneos', label: 'Torneos', icon: Trophy },
    { id: 'yo', label: 'Yo', icon: User },
  ];

  return (
    <nav className="bottom-nav" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {isActive && <div className="nav-active-dot" />}
            <Icon className="nav-tab-icon" />
            <span className="nav-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
