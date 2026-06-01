'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light');
  const [isOpen, setIsOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Parcours', path: '/parcours' },
    { name: 'Compétences', path: '/competences' },
    { name: 'Projets', path: '/projets' }
  ];

  return (
    <nav className={`navbar ${isOpen ? 'mobile-nav-active' : ''}`}>
      <div className="container navbar-container">
        <Link href="/" className="logo" onClick={() => setIsOpen(false)}>
          <span>Portfolio</span>
          <span style={{ fontWeight: 400, fontSize: '1rem', opacity: 0.8 }}>| BUT GEII</span>
        </Link>

        {/* Desktop & Mobile Links */}
        <ul className="nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Changer le thème"
            title="Changer le thème"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Admin Quick Access */}
          <Link
            href="/admin"
            className={`theme-toggle-btn ${pathname.startsWith('/admin') ? 'active' : ''}`}
            style={{
              backgroundColor: pathname.startsWith('/admin') ? 'var(--primary-light)' : 'transparent',
              borderColor: pathname.startsWith('/admin') ? 'var(--primary)' : 'var(--border)'
            }}
            title="Espace Administration"
            onClick={() => setIsOpen(false)}
          >
            <User size={20} style={{ color: pathname.startsWith('/admin') ? 'var(--primary)' : 'inherit' }} />
          </Link>

          {/* Mobile Menu Toggler */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="menu-btn theme-toggle-btn"
            aria-label="Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
