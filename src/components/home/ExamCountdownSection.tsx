import React, { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { HOME_SECTIONS_CONFIG, ExamCountdownItem } from '../../data/homeSectionsConfig';

interface ParsedExamItem {
  id: string;
  name: string;
  rawDate: string;
  daysLeft: number;
  displayText: string;
}

/**
 * Strictly parses YYYY-MM-DD into year, month, day parts without using new Date(string).
 * Uses Date.UTC on year, month-1, day vs local today's year, month, day to compute day difference.
 */
function parseAndCalculateDays(item: ExamCountdownItem): ParsedExamItem | null {
  if (!item || !item.date || typeof item.date !== 'string') {
    return null;
  }

  const parts = item.date.trim().split('-');
  if (parts.length !== 3) {
    return null;
  }

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    year < 1900 ||
    year > 2200 ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  // Validate real calendar day (e.g. leap year check, 30 days in April)
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  const now = new Date();
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const examUTC = Date.UTC(year, month - 1, day);

  const diffMs = examUTC - todayUTC;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Past dates are hidden
  if (diffDays < 0) {
    return null;
  }

  return {
    id: item.id,
    name: item.name,
    rawDate: item.date,
    daysLeft: diffDays,
    displayText: diffDays === 0 ? 'Today' : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`,
  };
}

export const ExamCountdownSection: React.FC = () => {
  const upcomingExams = useMemo(() => {
    const rawList = HOME_SECTIONS_CONFIG.examCountdown || [];
    const validItems: ParsedExamItem[] = [];

    for (const item of rawList) {
      const parsed = parseAndCalculateDays(item);
      if (parsed) {
        validItems.push(parsed);
      }
    }

    // Sort by nearest date ascending
    return validItems.sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  return (
    <section
      id="cs-home-countdown"
      aria-labelledby="cs-countdown-heading"
      className="cs-home-countdown cs-glass-panel rounded-2xl p-6 sm:p-8 shadow-xs transition-colors"
    >
      <div className="mb-6">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] border border-[var(--cherry-pink-border)] mb-2">
          Examination Schedule
        </span>
        <h2
          id="cs-countdown-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
        >
          Exam Countdown
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Stay synchronized with institutional assessments, practical vivas, and end-term exams.
        </p>
      </div>

      {upcomingExams.length === 0 ? (
        <div className="p-8 text-center bg-transparent border border-[var(--border)] rounded-xl">
          <Calendar className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-60" />
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            No upcoming exams added yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {upcomingExams.map(exam => {
            const isToday = exam.daysLeft === 0;
            const isImminent = exam.daysLeft > 0 && exam.daysLeft <= 14;

            return (
              <div
                key={exam.id}
                className="flex flex-col justify-between bg-transparent border border-[var(--border)] rounded-xl p-5 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[var(--link)]" />
                      <span>{exam.rawDate}</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isToday
                          ? 'bg-[var(--accent)] text-[var(--on-accent)] border-[var(--accent)] animate-pulse'
                          : isImminent
                          ? 'bg-[var(--tint)] text-[var(--primary)] border-[var(--border)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]'
                      }`}
                    >
                      {exam.displayText}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[var(--text)] leading-snug">
                    {exam.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-4 pt-3 border-t border-[var(--border)]">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <span>
                    {isToday
                      ? 'Assessment starts today — best of luck!'
                      : `Preparation window: ${exam.daysLeft} days`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
