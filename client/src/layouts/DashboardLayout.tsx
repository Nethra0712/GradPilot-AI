import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Shell layout for all authenticated pages.
 * Handles collapsible sidebar toggle (desktop) and drawer slide-out (mobile).
 * Layout persists sidebar state in localStorage.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar Component */}
      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        mobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Topbar Component */}
        <Topbar
          onMobileMenuToggle={toggleMobile}
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarToggle={toggleSidebar}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto flex flex-col justify-between">
          <div className="w-full flex-grow">{children}</div>

          {/* Minimal authenticated footer */}
          <footer className="w-full mt-12 py-4 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <p>© {new Date().getFullYear()} GradPilot AI. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-slate-400 transition-colors">
                Docs
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
