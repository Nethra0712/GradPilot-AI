import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface TopbarProps {
  onMobileMenuToggle: () => void;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onMobileMenuToggle,
  isSidebarCollapsed,
  onSidebarToggle,
}) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Map path location segment to readable breadcrumb labels
  const pathnames = location.pathname.split('/').filter((x) => x);
  const getBreadcrumbLabel = (segment: string) => {
    switch (segment.toLowerCase()) {
      case 'dashboard':
        return 'Dashboard';
      case 'documents':
        return 'Documents';
      case 'profile':
        return 'Academic Profile';
      case 'settings':
        return 'Settings';
      default:
        return segment;
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
  };

  return (
    <header className="h-16 border-b border-slate-900/60 bg-slate-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 select-none">
      {/* Left controls + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger menu toggle */}
        <button
          onClick={onMobileMenuToggle}
          type="button"
          aria-label="Open sidebar"
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 shrink-0"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Sidebar Collapse Toggle */}
        <button
          onClick={onSidebarToggle}
          type="button"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 shrink-0"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-slate-800 shrink-0">/</span>

        {/* Dynamic Breadcrumbs */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium min-w-0"
        >
          <Link
            to="/dashboard"
            className="text-slate-400 hover:text-slate-200 transition-colors truncate"
          >
            Home
          </Link>
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;

            return (
              <React.Fragment key={to}>
                <span className="text-slate-800 shrink-0">/</span>
                {last ? (
                  <span className="text-slate-200 font-semibold truncate" aria-current="page">
                    {getBreadcrumbLabel(value)}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-slate-200 transition-colors truncate"
                  >
                    {getBreadcrumbLabel(value)}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right controls + Profile drop-menu */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Search Input Placeholder */}
        <div className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg border border-slate-900 bg-slate-950/40 text-slate-500 text-xs w-48 hover:border-slate-800 transition-all duration-150 cursor-pointer">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search...</span>
          <span className="ml-auto text-[10px] bg-slate-900 border border-slate-800 px-1 rounded font-sans text-slate-600">
            ⌘K
          </span>
        </div>

        {/* Notifications Icon Placeholder */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border-2 border-slate-950" />
        </button>

        {/* User avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            className="w-8 h-8 rounded-full border border-slate-800 bg-slate-900 flex items-center justify-center text-xs font-semibold text-slate-300 hover:border-slate-700 hover:text-white transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-900 bg-slate-950 shadow-2xl p-1.5 z-50 text-slate-300">
              <div className="px-3 py-2 border-b border-slate-900 mb-1.5">
                <p className="text-xs font-semibold text-white leading-none truncate">
                  {currentUser?.fullName || 'Active User'}
                </p>
                <span className="text-[10px] text-slate-500 truncate block mt-1">
                  {currentUser?.email}
                </span>
                <span className="inline-block text-[9px] font-bold tracking-wider uppercase text-brand-400 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full mt-2">
                  {currentUser?.subscriptionPlan || 'FREE'} PLAN
                </span>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 h-9 px-3 text-xs rounded-lg hover:bg-slate-900/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 h-9 px-3 text-xs rounded-lg hover:bg-slate-900/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Settings
              </Link>

              <div className="border-t border-slate-900 my-1.5" />

              <button
                onClick={handleLogout}
                type="button"
                className="flex items-center gap-2.5 h-9 px-3 text-xs rounded-lg text-red-400 hover:bg-red-500/10 w-full text-left font-medium transition-all"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
