import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Sun, 
  Moon, 
  Bookmark, 
  LogOut, 
  LogIn,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isDark, 
    toggleTheme, 
    viewState, 
    goToHome, 
    goToAdmin, 
    goToBookmarks, 
    setSearchOpen,
    setAuthModalOpen,
    loginAs,
    logout 
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const isAdmin = currentUser?.role === 'admin';
  const bookmarkCount = currentUser?.bookmarkedResourceIds?.length || 0;

  React.useEffect(() => {
    const isMac = typeof navigator !== 'undefined' && (
      /Mac|iPod|iPhone|iPad/.test(navigator.platform || '') ||
      /Macintosh|Mac OS X/.test(navigator.userAgent || '')
    );
    setShortcutLabel(isMac ? '⌘K' : 'Ctrl K');
  }, []);

  const scrollToSection = (id: string) => {
    if (viewState.type !== 'home') {
      goToHome();
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--surface)] text-[var(--text)] border-b border-[var(--border)] shadow-xs transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Mark */}
        <div className="flex items-center gap-6 shrink-0">
          <button 
            onClick={() => {
              goToHome();
              window.location.hash = '#/explore';
            }}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2 rounded-lg cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-[var(--text)]">
              Campus<span className="text-[var(--primary)]">Share</span>
            </span>
          </button>

          {/* Editorial Nav Links (Access, Backpack, How it works) */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-[var(--text-muted)]">
            <button
              onClick={() => scrollToSection('cs-academic-explore')}
              className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer py-1"
            >
              Access
            </button>
            <button
              onClick={() => {
                if (currentUser) {
                  goToBookmarks();
                } else {
                  scrollToSection('cs-backpack-shelf');
                }
              }}
              className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer py-1"
            >
              Backpack
            </button>
            <button
              onClick={() => scrollToSection('cs-home-how-it-works')}
              className="hover:text-[var(--cherry-pink)] transition-colors cursor-pointer py-1"
            >
              How it works
            </button>
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xs mx-2">
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search resources"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)] focus-visible:outline-offset-2 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] text-xs transition-colors duration-150 cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              <span className="truncate">Search notes, modules...</span>
            </div>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded whitespace-nowrap shrink-0 select-none">
              {shortcutLabel}
            </kbd>
          </button>
        </div>

        {/* Right: User Controls & Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Saved Bookmarks Pill */}
          {currentUser && (
            <button
              onClick={() => goToBookmarks()}
              aria-label="View saved bookmarks"
              className={`p-2 text-xs rounded-xl border border-[var(--border)] transition-colors duration-150 flex items-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus)] ${
                viewState.type === 'bookmarks'
                  ? 'bg-[var(--primary)] text-white font-bold'
                  : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--primary)]'
              }`}
              title="Saved in Backpack"
            >
              <Bookmark className={`w-3.5 h-3.5 ${viewState.type === 'bookmarks' ? 'fill-white text-white' : 'text-[var(--cherry-pink)]'}`} />
              {bookmarkCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[var(--cherry-pink)] text-white">{bookmarkCount}</span>
              )}
            </button>
          )}

          {/* Admin Hub Shortcut */}
          {isAdmin && (
            <button
              onClick={goToAdmin}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus)] ${
                viewState.type === 'admin'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--surface-alt)] text-[var(--text)] hover:border-[var(--primary)] border border-[var(--border)]'
              }`}
            >
              Admin Hub
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--primary)] rounded-xl transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-[var(--accent)]" /> : <Moon className="w-4 h-4 text-[var(--text)]" />}
          </button>

          {/* User Status / Role Pill & Switcher */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(prev => !prev)}
                aria-label="User account menu"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-alt)] hover:border-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)] border border-[var(--border)] text-xs text-[var(--text)] transition-colors duration-150 cursor-pointer font-semibold"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--sage)]"></div>
                <span className="truncate max-w-[100px] sm:max-w-[120px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
                  ({isAdmin ? 'Admin' : currentUser.studentId})
                </span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {/* Dropdown Menu */}
              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl py-2 z-50 text-xs text-[var(--text)] animate-in fade-in duration-100">
                    <div className="px-3.5 py-2.5 border-b border-[var(--border)]">
                      <p className="font-bold text-[var(--text)] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{currentUser.email}</p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--text-muted)] border border-[var(--border)]">
                          {currentUser.role}
                        </span>
                        {!isAdmin && (
                          <span className="text-[10px] text-[var(--text-muted)]">
                            Sem {currentUser.semester} • {currentUser.studentId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-1.5 space-y-1">
                      {isAdmin ? (
                        <button
                          onClick={() => {
                            loginAs('student');
                            setRoleMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
                        >
                          Switch to Student (Ayush)
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            loginAs('admin');
                            setRoleMenuOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)] transition-colors cursor-pointer"
                        >
                          Switch to Admin (Prof. Jenkins)
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Open portal</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
