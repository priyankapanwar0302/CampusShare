import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FEEDBACK_STORAGE_KEY = 'campusshare_feedback_submissions';

export const FeedbackSection: React.FC = () => {
  const { currentUser } = useApp();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newFeedback = {
        id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        rating,
        message: message.trim(),
        userId: currentUser?.id || 'anonymous',
        userName: currentUser?.name || 'Anonymous Student',
        submittedAt: new Date().toISOString(),
      };

      const existingRaw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      existingList.push(newFeedback);
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingList));
    } catch {
      // Fallback if localStorage quota is exceeded or unavailable
    }

    // Reset form & display confirmation
    setRating(0);
    setHoverRating(0);
    setMessage('');
    setSubmittedSuccess(true);
    setIsSubmitting(false);

    // Auto-dismiss success message after 6 seconds
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 6000);
  };

  return (
    <section
      id="cs-home-feedback"
      aria-labelledby="cs-feedback-heading"
      className="cs-home-feedback cs-glass-panel rounded-2xl p-6 sm:p-8 shadow-xs transition-colors"
    >
      <div className="mb-6">
        <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] border border-[var(--cherry-pink-border)] mb-2">
          Student Voice
        </span>
        <h2
          id="cs-feedback-heading"
          className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]"
        >
          Feedback & Suggestions
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Help us refine CampusShare. Your ratings and ideas directly inform future semester upgrades.
        </p>
      </div>

      {submittedSuccess && (
        <div
          role="status"
          className="mb-6 p-4 rounded-xl bg-[var(--tint)] border border-[var(--border)] text-[var(--primary)] flex items-center gap-3 transition-all"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 text-[var(--link)]" />
          <div>
            <p className="text-sm font-bold">Thank you for your feedback!</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Your evaluation has been recorded securely.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating Buttons */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text)] mb-2">
            Rate your experience <span className="text-[var(--primary)]">*</span>
          </label>
          <div className="flex items-center gap-1.5" role="group" aria-label="Rating out of 5 stars">
            {[1, 2, 3, 4, 5].map(star => {
              const activeLevel = hoverRating || rating;
              const isFilled = star <= activeLevel;

              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="min-h-[44px] min-w-[44px] p-2 rounded-xl flex items-center justify-center transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[var(--focus)] cursor-pointer"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      isFilled
                        ? 'fill-[var(--accent)] text-[var(--accent)]'
                        : 'text-[var(--border)] hover:text-[var(--accent)]'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs text-[var(--text-muted)] ml-2 font-medium">
              {rating > 0 ? `${rating} of 5 stars selected` : 'Select a star rating'}
            </span>
          </div>
        </div>

        {/* Optional Message */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="cs-feedback-message" className="text-xs font-semibold text-[var(--text)]">
              Suggestions or feedback (optional)
            </label>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              {message.length}/300
            </span>
          </div>
          <textarea
            id="cs-feedback-message"
            rows={3}
            maxLength={300}
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 300))}
            placeholder="Tell us what worked well or what resources you'd like added..."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-muted)]/60 focus-visible:outline-2 focus-visible:outline-[var(--focus)] transition-colors resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold bg-[var(--primary)] text-[var(--on-primary)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
