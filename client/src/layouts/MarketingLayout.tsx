import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/marketing/Navbar';

/**
 * Shell layout for all public marketing pages.
 * Renders the sticky Navbar, the page content via <Outlet />, and a footer.
 * The main content area has top padding to compensate for the fixed header.
 */
const MarketingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950">
        <div className="section-container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center shadow-[0_0_8px_rgba(56,85,255,0.4)]">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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
              <span
                className="text-sm font-semibold text-slate-400"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                GradPilot AI
              </span>
            </div>

            {/* Footer links */}
            <nav
              aria-label="Footer navigation"
              className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2"
            >
              {[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Contact', href: '#' },
                { label: 'GitHub', href: 'https://github.com', external: true },
              ].map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  onClick={!external ? (e) => e.preventDefault() : undefined}
                  className="text-sm text-slate-600 hover:text-slate-400 transition-colors duration-150"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Copyright */}
            <p className="text-xs text-slate-700">© {new Date().getFullYear()} GradPilot AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
