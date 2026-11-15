import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, IdCard, GraduationCap, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    currentUser,
    authModalOpen, 
    setAuthModalOpen, 
    studentLogin, 
    adminLogin, 
    registerStudent,
    getLockoutStatus,
    loginAs,
    goToHome
  } = useApp();

  // 3-tab design: [Student Login] | [Admin Login] | [New Account]
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'register'>('student');

  // Student inputs
  const [studentId, setStudentId] = useState('CS2026048');
  const [studentDob, setStudentDob] = useState('15/08/2004');
  const [studentIdError, setStudentIdError] = useState<string | null>(null);
  const [studentDobError, setStudentDobError] = useState<string | null>(null);

  // Admin inputs
  const [adminEmail, setAdminEmail] = useState('admin@campusshare.edu');
  const [adminPassword, setAdminPassword] = useState('Admin@Demo2026');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState<string | null>(null);
  const [adminPasswordError, setAdminPasswordError] = useState<string | null>(null);

  // Registration inputs
  const [regFullName, setRegFullName] = useState('');
  const [regStudentId, setRegStudentId] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBranch, setRegBranch] = useState('Computer Science & Engineering');
  const [regBatch, setRegBatch] = useState('Batch 2026-30');
  const [regDob, setRegDob] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // General inline form error & submit state
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Dialog open state is controlled by authModalOpen
  const isEnforced = false;

  // Move focus to first field when dialog opens
  useEffect(() => {
    if (authModalOpen) {
      setFormError(null);
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [authModalOpen, activeTab]);

  // Focus trap inside dialog
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Tab') {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // If unauthenticated, prevent outside dismissal
    if (isEnforced) return;
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setAuthModalOpen(false);
    }
  };

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    if (isEnforced) {
      e.preventDefault(); // Trap Escape key when unauthenticated
    } else {
      setAuthModalOpen(false);
    }
  };

  // Demo autofill triggers
  const handleFillDemoStudent = () => {
    setStudentId('CS2026048');
    setStudentDob('15/08/2004');
    setFormError(null);
    setStudentIdError(null);
    setStudentDobError(null);
    loginAs('student');
    goToHome();
  };

  const handleFillDemoAdmin = () => {
    setAdminEmail('admin@campusshare.edu');
    setAdminPassword('Admin@Demo2026');
    setFormError(null);
    setAdminEmailError(null);
    setAdminPasswordError(null);
    loginAs('admin');
    goToHome();
  };

  // Submit student login
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setStudentIdError(null);
    setStudentDobError(null);

    if (!studentId.trim()) {
      setStudentIdError('Please enter your Student ID.');
      return;
    }
    if (!studentDob.trim()) {
      setStudentDobError('Please enter your Date of Birth.');
      return;
    }

    const lock = getLockoutStatus(studentId.toUpperCase());
    if (lock.isLocked) {
      setFormError(`Account temporarily locked. Please retry in ${lock.retryAfterSec}s.`);
      return;
    }

    setIsSubmitting(true);
    const res = await studentLogin({ studentId, dob: studentDob });
    setIsSubmitting(false);

    if (!res.success) {
      setFormError(res.error || 'Invalid credentials. Please verify your Student ID and Date of Birth.');
    } else {
      goToHome();
    }
  };

  // Submit admin login
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setAdminEmailError(null);
    setAdminPasswordError(null);

    if (!adminEmail.trim()) {
      setAdminEmailError('Please enter your administrative email.');
      return;
    }
    if (!adminPassword) {
      setAdminPasswordError('Please enter your password.');
      return;
    }

    const lock = getLockoutStatus(adminEmail.toLowerCase());
    if (lock.isLocked) {
      setFormError(`Administrative access locked. Retry in ${lock.retryAfterSec}s.`);
      return;
    }

    setIsSubmitting(true);
    const res = await adminLogin({ email: adminEmail, password: adminPassword });
    setIsSubmitting(false);

    if (!res.success) {
      setFormError(res.error || 'Invalid email or password.');
    } else {
      goToHome();
    }
  };

  // Submit registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (regPassword !== regConfirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const res = await registerStudent({
      fullName: regFullName,
      studentId: regStudentId,
      email: regEmail,
      branch: regBranch,
      batch: regBatch,
      dob: regDob,
      password: regPassword,
    });
    setIsSubmitting(false);

    if (!res.success) {
      setFormError(res.error || 'Failed to create account.');
    } else {
      goToHome();
    }
  };

  if (!authModalOpen && !isEnforced) return null;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onClick={handleBackdropClick}
      onCancel={handleCancel}
      onKeyDown={handleKeyDown}
      className="p-0 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl w-full max-w-md text-[var(--color-text)] overflow-hidden m-auto backdrop:bg-[var(--color-bg)]/80 backdrop:backdrop-blur-md"
    >
      <div className="p-6 sm:p-7">
        
        {/* Header with Title */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--color-border)]">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-extrabold text-sm tracking-tight text-[var(--color-text)]">
                Campus<span className="text-[var(--color-accent)]">Share</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--link)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                Institutional Access
              </span>
            </div>
            <h2 id="auth-dialog-title" className="text-lg font-bold text-[var(--color-text)]">
              Academic Resource Portal
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              Sign in with your university credentials to unlock verified materials
            </p>
          </div>

          {!isEnforced && (
            <button
              onClick={() => setAuthModalOpen(false)}
              aria-label="Close authentication modal"
              className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3-Tab Selector: [Student Login] | [Admin Login] | [New Account] */}
        <div className="flex border-b border-[var(--color-border)] mt-4 mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setFormError(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'student'
                ? 'border-[var(--cherry-pink)] text-[var(--cherry-pink)] font-bold'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Student Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setFormError(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'border-[var(--cherry-pink)] text-[var(--cherry-pink)] font-bold'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Admin Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setFormError(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'border-[var(--cherry-pink)] text-[var(--cherry-pink)] font-bold'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Top Form Error Alert */}
        {formError && (
          <div className="text-xs text-[var(--color-accent)] mb-4 bg-[var(--color-bg)] p-2.5 rounded-xl border border-[var(--color-border)] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[var(--color-accent)]" />
            <span>{formError}</span>
          </div>
        )}

        {/* TAB 1: Student Login */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="student-id-input" className="text-xs font-bold text-[var(--color-text)]">
                  Student ID
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoStudent}
                  className="text-[11px] font-bold text-[var(--link)] hover:underline cursor-pointer"
                >
                  ⚡ Fill Demo Student
                </button>
              </div>
              <input
                id="student-id-input"
                ref={firstInputRef}
                type="text"
                value={studentId}
                onChange={e => {
                  setStudentId(e.target.value.toUpperCase());
                  setStudentIdError(null);
                }}
                placeholder="e.g. CS2026048"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] font-mono transition-colors"
                required
              />
              {studentIdError && (
                <p className="text-[11px] text-[var(--color-accent)] mt-1 font-medium">{studentIdError}</p>
              )}
            </div>

            <div>
              <label htmlFor="student-dob-input" className="block text-xs font-bold text-[var(--color-text)] mb-1.5">
                Date of Birth (DOB)
              </label>
              <input
                id="student-dob-input"
                type="text"
                value={studentDob}
                onChange={e => {
                  setStudentDob(e.target.value);
                  setStudentDobError(null);
                }}
                placeholder="DD/MM/YYYY"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] font-mono transition-colors"
                required
              />
              {studentDobError ? (
                <p className="text-[11px] text-[var(--color-accent)] mt-1 font-medium">{studentDobError}</p>
              ) : (
                <span className="text-[11px] text-[var(--color-text-muted)] block mt-1">
                  Format: DD/MM/YYYY (Demo credential: 15/08/2004)
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs mt-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying Student Record...' : 'Sign In as Student'}
            </button>
          </form>
        )}

        {/* TAB 2: Admin Login */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-email-input" className="text-xs font-bold text-[var(--color-text)]">
                  Admin Email
                </label>
                <button
                  type="button"
                  onClick={handleFillDemoAdmin}
                  className="text-[11px] font-bold text-[var(--link)] hover:underline cursor-pointer"
                >
                  ⚡ Fill Demo Admin
                </button>
              </div>
              <input
                id="admin-email-input"
                ref={firstInputRef}
                type="email"
                value={adminEmail}
                onChange={e => {
                  setAdminEmail(e.target.value);
                  setAdminEmailError(null);
                }}
                placeholder="admin@campusshare.edu"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                required
              />
              {adminEmailError && (
                <p className="text-[11px] text-[var(--color-accent)] mt-1 font-medium">{adminEmailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password-input" className="block text-xs font-bold text-[var(--color-text)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={e => {
                    setAdminPassword(e.target.value);
                    setAdminPasswordError(null);
                  }}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-10 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(prev => !prev)}
                  aria-label={showAdminPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {adminPasswordError ? (
                <p className="text-[11px] text-[var(--color-accent)] mt-1 font-medium">{adminPasswordError}</p>
              ) : (
                <span className="text-[11px] text-[var(--color-text-muted)] block mt-1">
                  Faculty Admin Password (Demo: Admin@Demo2026)
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs mt-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating Faculty Claims...' : 'Sign In as Faculty Admin'}
            </button>
          </form>
        )}

        {/* TAB 3: Create New Account */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Full Name
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={regFullName}
                  onChange={e => setRegFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={regStudentId}
                  onChange={e => setRegStudentId(e.target.value.toUpperCase())}
                  placeholder="e.g. CS2026099"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                College Email (.edu / .ac.in / @campus.edu)
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="priya.sharma@campus.edu"
                className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Program / Branch
                </label>
                <select
                  value={regBranch}
                  onChange={e => setRegBranch(e.target.value)}
                  className="w-full px-2 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                >
                  <option value="Computer Science & Engineering">B.Tech CSE</option>
                  <option value="Mechanical Engineering">B.Tech ME</option>
                  <option value="Electrical Engineering">B.Tech EE</option>
                  <option value="Electronics & Communication">B.Tech ECE</option>
                  <option value="Civil Engineering">B.Tech CE</option>
                  <option value="Bachelor of Computer Applications">BCA</option>
                  <option value="Master of Computer Applications">MCA</option>
                  <option value="Bachelor of Science">B.Sc</option>
                  <option value="Bachelor of Business Admin">BBA</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  value={regDob}
                  onChange={e => setRegDob(e.target.value)}
                  placeholder="DD/MM/YYYY"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full pl-2.5 pr-8 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(prev => !prev)}
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Confirm Password
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-2.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs mt-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Student Profile...' : 'Complete Registration'}
            </button>
          </form>
        )}

      </div>
    </dialog>
  );
};
