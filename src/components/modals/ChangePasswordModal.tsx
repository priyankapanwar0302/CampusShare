import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { KeyRound, Check, X, ShieldAlert, Lock } from 'lucide-react';

export const ChangePasswordModal: React.FC = () => {
  const { changePasswordModalOpen, setChangePasswordModalOpen, updatePassword } = useApp();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (changePasswordModalOpen) {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [changePasswordModalOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setChangePasswordModalOpen(false);
    }
  };

  const hasLength = newPass.length >= 6;
  const passwordsMatch = newPass === confirmPass && confirmPass.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasLength) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    const success = updatePassword(newPass);
    if (success) {
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      setErrorMsg('');
    }
  };

  if (!changePasswordModalOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={() => setChangePasswordModalOpen(false)}
      aria-labelledby="change-password-title"
      className="p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl w-full max-w-md text-[var(--text)] overflow-hidden m-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--tint)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 id="change-password-title" className="text-base font-bold text-[var(--text)]">
                Update Student Password
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Mandatory account security update
              </p>
            </div>
          </div>
          <button
            onClick={() => setChangePasswordModalOpen(false)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-[var(--tint)] border border-[var(--border)] flex items-center gap-2 text-xs text-[var(--primary)]">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Current / Default Temporary Password
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={e => setCurrentPass(e.target.value)}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-sm bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Create strong new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-sm bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
              required
            />
          </div>

          {/* Password complexity checklist */}
          <div className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl space-y-1.5 text-xs text-[var(--text-muted)]">
            <p className="font-semibold text-[var(--text)] text-[11px] uppercase tracking-wider">
              Security Checklist:
            </p>
            <div className="flex items-center gap-2">
              {hasLength ? (
                <Check className="w-3.5 h-3.5 text-[var(--link)]" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-[var(--border)] inline-block"></span>
              )}
              <span className={hasLength ? 'text-[var(--text)] font-medium' : ''}>
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[var(--link)]" />
              <span className="text-[var(--text)] font-medium">
                Numbers, letters, symbols, or combinations
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-sm bg-[var(--bg)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
              required
            />
            {confirmPass && (
              <p className={`text-[11px] mt-1 ${passwordsMatch ? 'text-[var(--link)] font-semibold' : 'text-[var(--primary)] font-semibold'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setChangePasswordModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold btn-primary transition-colors shadow-sm cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
