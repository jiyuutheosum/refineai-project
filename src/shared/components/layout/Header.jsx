import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';


const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Upload Resume', path: '/resume-upload', icon: 'Upload' },
    { label: 'View Analysis', path: '/resume-analysis', icon: 'FileSearch' },
    { label: 'Edit Resume', path: '/manual-resume-editor', icon: 'Edit' },
    { label: 'Summary Report', path: '/feedback-summary', icon: 'FileText' }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-[100] bg-card shadow-elevation-2 transition-smooth">
      <div className="flex items-center justify-between h-16 px-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Sparkles" size={24} color="var(--color-primary)" />
          </div>
          <h1 className="text-xl font-heading font-semibold text-foreground">RefineAI</h1>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navigationItems?.map((item) => (
            <button
              key={item?.path}
              onClick={() => handleNavigation(item?.path)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-smooth
                ${isActive(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-elevation-1'
                  : 'text-foreground hover:bg-muted hover-lift'
                }
              `}
            >
              <Icon name={item?.icon} size={18} />
              <span className="font-medium">{item?.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
          aria-label="Toggle menu"
        >
          <Icon name={mobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-2">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-left
                  ${isActive(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-elevation-1'
                    : 'text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;