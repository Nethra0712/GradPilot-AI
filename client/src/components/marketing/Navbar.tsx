import React, { useState, useEffect } from 'react';

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

/**
 * Responsive sticky navigation bar.
 * Scrolled state adds a frosted-glass background. Mobile menu toggles via hamburger button.
 */
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when viewport resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 shadow-[0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            aria-label="GradPilot AI Home"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            {/* Icon mark */}
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(56,85,255,0.5)] group-hover:shadow-[0_0_20px_rgba(56,85,255,0.7)] transition-shadow duration-300">
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
            <span
              className="text-[15px] font-bold tracking-tight text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              GradPilot <span className="text-brand-400">AI</span>
            </span>
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                role="listitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3.5 py-2 text-sm text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-150 px-2 py-1"
              aria-label="Sign In (coming soon)"
            >
              Sign In
            </a>
            <a
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#waitlist');
              }}
              className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-all duration-200 shadow-[0_0_16px_rgba(56,85,255,0.35)] hover:shadow-[0_0_24px_rgba(56,85,255,0.5)] active:scale-95"
            >
              Get Started
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M1 6h10M7 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-all"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={[
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          ].join(' ')}
          aria-hidden={!isMobileOpen}
        >
          <div className="pb-4 pt-1 flex flex-col gap-1 border-t border-slate-800/50 mt-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="px-3 py-2.5 text-sm text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="divider my-2" />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="px-3 py-2.5 text-sm text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800/60 transition-all"
            >
              Sign In
            </a>
            <a
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#waitlist');
                setIsMobileOpen(false);
              }}
              className="mt-1 px-3 py-2.5 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-all text-center"
            >
              Get Started →
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
