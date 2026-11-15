import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell } from 'lucide-react';

export const AnnouncementStrip: React.FC = () => {
  const { announcements } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [fade, setFade] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Filter announcements with non-empty string content (title or content)
  const validAnnouncements = (announcements || []).filter(a => {
    if (!a) return false;
    const title = typeof a.title === 'string' ? a.title.trim() : '';
    const content = typeof a.content === 'string' ? a.content.trim() : '';
    return title.length > 0 || content.length > 0;
  });

  const count = validAnnouncements.length;
  const hasMultiple = count > 1;

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasMultiple || isPaused || prefersReducedMotion) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % count);
        setFade(true);
      }, 200);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMultiple, isPaused, count]);

  // If there are no valid announcements, render nothing (no empty box)
  if (count === 0) {
    return null;
  }

  const activeAnnouncement = validAnnouncements[currentIndex] || validAnnouncements[0];
  const displayText = activeAnnouncement
    ? activeAnnouncement.title?.trim() || activeAnnouncement.content?.trim() || ''
    : '';

  return (
    <section
      id="cs-home-announcement-strip"
      aria-label="Institutional Announcements"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      className="cs-home-announcement cs-glass-panel rounded-2xl p-3.5 sm:px-5 shadow-xs transition-colors"
    >
      <h2 className="sr-only">Campus Announcements</h2>
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>

          <div
            className={`min-w-0 flex-1 transition-opacity duration-200 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="cs-announcement-tag text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] border border-[var(--cherry-pink-border)]">
                Announcement {hasMultiple ? `${currentIndex + 1}/${count}` : 'Notice'}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-medium">
                {activeAnnouncement.date}
              </span>
            </div>
            <p
              className="text-xs sm:text-sm font-semibold text-[var(--text)] truncate mt-0.5"
              title={displayText}
            >
              {displayText}
            </p>
          </div>
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-1 shrink-0 text-[11px] text-[var(--text-muted)] font-medium">
            <span className="hidden sm:inline">Auto-rotates</span>
            <div className="flex items-center gap-1 ml-1">
              {validAnnouncements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setFade(true);
                  }}
                  aria-label={`Go to announcement ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? 'bg-[var(--cherry-pink)] w-4'
                      : 'bg-[var(--border)] hover:bg-[var(--taupe)]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
