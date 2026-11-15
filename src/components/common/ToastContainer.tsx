import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map(toast => {
        const icon = {
          success: <CheckCircle2 className="w-5 h-5 text-[var(--link)] shrink-0" />,
          error: <XCircle className="w-5 h-5 text-[var(--primary)] shrink-0" />,
          warning: <AlertCircle className="w-5 h-5 text-[var(--accent)] shrink-0" />,
          info: <Info className="w-5 h-5 text-[var(--link)] shrink-0" />,
        }[toast.type];

        const borderAccent = {
          success: 'border-l-4 border-l-[var(--link)]',
          error: 'border-l-4 border-l-[var(--primary)]',
          warning: 'border-l-4 border-l-[var(--accent)]',
          info: 'border-l-4 border-l-[var(--link)]',
        }[toast.type];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-[var(--surface)] rounded-xl shadow-lg border border-[var(--border)] ${borderAccent} transition-all duration-200 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text)] leading-snug">
                {toast.title}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text)] rounded-md hover:bg-[var(--tint)] transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
