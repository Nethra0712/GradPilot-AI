import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const LINKS: SidebarLink[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
          />
        </svg>
      ),
    },
    {
      label: 'My Documents',
      path: '/documents',
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      label: 'Academic Profile',
      path: '/profile',
      icon: (
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
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: (
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between py-4 select-none">
      {/* Upper Brand Section */}
      <div>
        <div className="px-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_12px_rgba(56,85,255,0.4)] shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5.5L11 7.25V10.75L8 12.5L5 10.75V7.25L8 5.5Z"
                  fill="white"
                  fillOpacity="0.4"
                />
              </svg>
            </div>
            {!collapsed && (
              <span className="text-[15px] font-bold tracking-tight text-white font-display">
                GradPilot <span className="text-brand-400">AI</span>
              </span>
            )}
          </div>
        </div>

        {/* Workspace Quick-Select Indicator */}
        <div className="px-3 mb-6">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/40 ${collapsed ? 'justify-center' : ''}`}
          >
            <div className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300 uppercase shrink-0">
              {currentUser?.email ? currentUser.email.charAt(0) : 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate leading-none">
                  {currentUser?.fullName || 'Active User'}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">Personal Workspace</span>
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation */}
        <nav className="px-2 space-y-1.5" aria-label="Main Sidebar Navigation">
          {LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.label}
                to={link.path}
                className={() =>
                  [
                    'flex items-center gap-3 h-10 px-3 rounded-lg text-sm transition-all duration-150 relative group',
                    isActive
                      ? 'bg-slate-800 text-white font-medium shadow-inner'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60',
                    collapsed ? 'justify-center' : '',
                  ].join(' ')
                }
              >
                <div className="shrink-0">{link.icon}</div>
                {!collapsed && <span>{link.label}</span>}

                {/* Tooltip on Collapsed Desktop View */}
                {collapsed && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 px-2 py-1.5 rounded-md pointer-events-none transition-all duration-200 shadow-xl whitespace-nowrap z-50">
                    {link.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Indicator / Collapse Button */}
      <div className="px-3">
        <button
          onClick={onToggle}
          type="button"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex w-full items-center justify-center h-10 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900/60 border border-transparent hover:border-slate-900 transition-all duration-150"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR VIEW */}
      <aside
        className={[
          'hidden md:block h-screen bg-slate-950 border-r border-slate-900/60 shrink-0 transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-60',
        ].join(' ')}
      >
        {content}
      </aside>

      {/* MOBILE DRAWER VIEW OVERLAYS */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={[
          'md:hidden fixed top-0 bottom-0 left-0 z-50 w-60 bg-slate-950 border-r border-slate-900/60 transform transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        {content}
      </aside>
    </>
  );
};

export default Sidebar;
