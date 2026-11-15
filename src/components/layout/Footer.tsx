import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HOME_SECTIONS_CONFIG, FooterLink } from '../../data/homeSectionsConfig';
import { X, Info, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { loginAs, currentUser, goToBookmarks, goToHome, setAuthModalOpen } = useApp();
  const footerConfig = HOME_SECTIONS_CONFIG.footer;
  const [activeModalLink, setActiveModalLink] = useState<FooterLink | null>(null);

  const handleLinkClick = (e: React.MouseEvent, link: FooterLink) => {
    e.preventDefault();
    setActiveModalLink(link);
  };

  const scrollTo = (id: string) => {
    goToHome();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer
      id="cs-site-footer"
      className="mt-20 border-t border-[var(--border)] bg-[var(--surface-alt)] text-[var(--text-muted)] py-14 text-xs transition-colors"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* 3-Column Layout from Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
                <GraduationCap className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <span className="font-extrabold text-base text-[var(--text)] tracking-tight">
                Campus<span className="text-[var(--primary)]">Share</span>
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-sm leading-relaxed">
              A clear digital home for your course resources and personal study files.
            </p>
            <p className="text-[11px] text-[var(--text-muted)] pt-2">
              © CampusShare • Built for focused study.
            </p>
          </div>

          {/* Column 2: NAVIGATE */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              NAVIGATE
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('cs-academic-explore')}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  Access
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (currentUser) {
                      goToBookmarks();
                    } else {
                      scrollTo('cs-backpack-shelf');
                    }
                  }}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  Backpack
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('cs-home-how-it-works')}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  How it works
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text)]">
              SUPPORT
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  Student ID login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('cs-academic-explore')}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  Course and semester access
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('cs-home-how-it-works')}
                  className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer text-left"
                >
                  PDF resource downloads
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip: Persona Quick Switcher & Policy Links */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {footerConfig.links.map(link => (
              <button
                key={link.label}
                type="button"
                onClick={e => handleLinkClick(e, link)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--cherry-pink)] hover:underline cursor-pointer transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] shrink-0">
            <span className="text-[var(--text-muted)]">Quick Switch:</span>
            <button
              type="button"
              onClick={() => loginAs('student')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentUser?.role === 'student'
                  ? 'bg-[var(--primary)] text-white font-bold'
                  : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--primary)] border border-[var(--border)]'
              }`}
            >
              Student (Ayush)
            </button>
            <button
              type="button"
              onClick={() => loginAs('admin')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                currentUser?.role === 'admin'
                  ? 'bg-[var(--primary)] text-white font-bold'
                  : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--primary)] border border-[var(--border)]'
              }`}
            >
              Admin (Prof. Jenkins)
            </button>
          </div>
        </div>

      </div>

      {/* Accessible Footer Content Modal for About, Contact, Terms, Privacy */}
      {activeModalLink && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cs-footer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setActiveModalLink(null)}
        >
          <div
            className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xl relative animate-in zoom-in-95 duration-150 text-[var(--text)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-alt)] text-[var(--primary)] flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <h3 id="cs-footer-modal-title" className="text-base font-bold text-[var(--text)]">
                  {activeModalLink.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalLink(null)}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {activeModalLink.content}
            </p>

            <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalLink(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] text-white hover:opacity-90 cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
