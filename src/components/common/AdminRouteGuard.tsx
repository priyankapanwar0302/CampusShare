import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, ArrowLeft, Lock, LogIn } from 'lucide-react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { currentUser, token, isTokenValid, goToHome, setAuthModalOpen, recordSecurityAudit } = useApp();
  const [countdown, setCountdown] = useState(5);

  const isAuthorized = currentUser?.role === 'admin' && isTokenValid();

  useEffect(() => {
    if (!isAuthorized) {
      recordSecurityAudit(
        'UNAUTHORIZED_ADMIN_ROUTE_ACCESS_ATTEMPT',
        'DENIED',
        `Access denied to administrative route for user ID: ${currentUser?.id || 'GUEST'}, role: ${currentUser?.role || 'UNAUTHENTICATED'}`
      );

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            goToHome();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isAuthorized, currentUser, goToHome, recordSecurityAudit]);

  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-6 sm:p-10 bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-[var(--tint)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[var(--tint)] text-[var(--primary)] border border-[var(--border)]">
            HTTP 403 • ACCESS FORBIDDEN
          </span>
          <h2 className="text-2xl font-extrabold text-[var(--text)] mt-2">
            Elevated Faculty Credentials Required
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto mt-1 leading-relaxed">
            You do not possess the required <strong>Administrator</strong> or <strong>Faculty Coordinator</strong> role claims. This security incident has been logged in the audit registry.
          </p>
        </div>

        <div className="p-3 bg-[var(--bg)] rounded-xl text-xs text-[var(--text-muted)] max-w-sm mx-auto font-mono border border-[var(--border)]">
          Redirecting to safe student catalog in <span className="text-[var(--link)] font-bold">{countdown}s</span>...
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={goToHome}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home Catalog</span>
          </button>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold btn-primary shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Switch to Admin Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
