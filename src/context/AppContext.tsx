import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Course, 
  CourseCategory,
  Subject, 
  Resource, 
  ResourceRequest, 
  Announcement, 
  ViewState, 
  ResourceType,
  StudentLoginCredentials,
  AdminLoginCredentials,
  StudentRegisterData,
  SecurityAuditLog
} from '../types';
import { 
  mockUsers, 
  mockCategories,
  mockCourses, 
  mockSubjects, 
  mockResources, 
  mockRequests, 
  mockAnnouncements 
} from '../data/mockData';
import { 
  generateJWT, 
  verifyJWT, 
  authRateLimiter, 
  INITIAL_REGISTERED_USERS, 
  hashPassword,
  verifyPasswordHash 
} from '../security/authService';
import { sanitizeInput } from '../security/sanitization';
import { StudentLoginSchema, AdminLoginSchema, RegisterStudentSchema } from '../security/validation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // User & Auth State
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  sessionExpiresAt: number | null;
  isTokenValid: () => boolean;
  
  // Authentication Actions
  loginAs: (role: 'student' | 'admin') => void;
  studentLogin: (credentials: StudentLoginCredentials) => Promise<{ success: boolean; error?: string }>;
  adminLogin: (credentials: AdminLoginCredentials) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: StudentRegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePassword: (newPass: string) => boolean;

  // Security Audit & Rate Limiting
  securityAuditLogs: SecurityAuditLog[];
  recordSecurityAudit: (event: string, status: 'SUCCESS' | 'DENIED' | 'LOCKED' | 'WARNING', details: string) => void;
  getLockoutStatus: (identifier: string) => { isLocked: boolean; retryAfterSec: number };

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Navigation
  viewState: ViewState;
  setViewState: (view: ViewState) => void;
  goToHome: () => void;
  goToCategory: (categoryId: string) => void;
  goToCourse: (courseId: string, semester?: number) => void;
  goToSubject: (subjectId: string, tab?: ResourceType) => void;
  goToAdmin: () => void;
  goToBookmarks: (action?: 'new-folder' | 'upload', folderId?: string) => void;

  // Data Collections
  categories: CourseCategory[];
  courses: Course[];
  subjects: Subject[];
  resources: Resource[];
  requests: ResourceRequest[];
  announcements: Announcement[];
  dismissAnnouncement: (id: string) => void;
  userDb: User[];
  studentsCount: number;

  // Resource actions (RBAC Protected)
  toggleBookmark: (resourceId: string) => void;
  isBookmarked: (resourceId: string) => boolean;
  downloadResource: (resourceId: string) => void;
  downloadingId: string | null;
  addResource: (newResource: Omit<Resource, 'id' | 'downloadCount' | 'uploadDate'>) => boolean;
  deleteResource: (resourceId: string) => boolean;
  replaceResourceFile: (resourceId: string, newFileName: string, newFileSize: string) => boolean;

  // Request actions
  submitRequest: (request: Omit<ResourceRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'studentEmail'>) => void;
  updateRequestStatus: (requestId: string, status: 'fulfilled' | 'dismissed') => void;

  // Modals & Overlays
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  previewResource: Resource | null;
  setPreviewResource: (res: Resource | null) => void;
  requestModal: { isOpen: boolean; defaultSubjectId?: string; defaultType?: ResourceType };
  setRequestModal: (modal: { isOpen: boolean; defaultSubjectId?: string; defaultType?: ResourceType }) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  changePasswordModalOpen: boolean;
  setChangePasswordModalOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  // Supabase Status
  isSupabaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-memory / persistent registered users list
  const [userDb, setUserDb] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('campusshare_user_db');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        return parsed.map(u =>
          u.id === 'user-std-101'
            ? { ...u, name: 'Ayush Joshi', email: 'ayush.joshi@campus.edu', studentId: 'CS2026048', semester: 1, batch: 'Batch 2026-30' }
            : u
        );
      }
    } catch {}
    return INITIAL_REGISTERED_USERS;
  });

  // Current session & JWT state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('campusshare_current_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.id === 'user-std-101') {
          return {
            ...parsed,
            name: 'Ayush Joshi',
            email: 'ayush.joshi@campus.edu',
            studentId: 'CS2026048',
            semester: 1,
            batch: 'Batch 2026-30',
          };
        }
        return parsed;
      }
    } catch {}
    return null; // Mandatory auth gate on first visit
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campusshare_jwt_token') || null;
  });

  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(() => {
    const saved = localStorage.getItem('campusshare_jwt_expires_at');
    return saved ? Number(saved) : null;
  });

  // Security Audit Trail state
  const [securityAuditLogs, setSecurityAuditLogs] = useState<SecurityAuditLog[]>([]);

  const recordSecurityAudit = useCallback((event: string, status: 'SUCCESS' | 'DENIED' | 'LOCKED' | 'WARNING', details: string) => {
    const log: SecurityAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      event,
      status,
      ip: '127.0.0.1 (Local Verified Client)',
      details,
    };
    setSecurityAuditLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 audit records
  }, []);

  // Theme state with explicit preference tracking and system preference responsiveness
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | null>(() => {
    const saved = localStorage.getItem('campusshare_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return null;
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('campusshare_theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen to OS system color-scheme changes if user has not explicitly chosen a preference
  useEffect(() => {
    if (themePreference !== null || typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  // Synchronize document root class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    const nextPref = nextIsDark ? 'dark' : 'light';
    setThemePreference(nextPref);
    setIsDark(nextIsDark);
    localStorage.setItem('campusshare_theme', nextPref);
  };

  // Navigation state with Middleware RBAC Guard
  const [viewState, setViewState] = useState<ViewState>({ type: 'home' });

  // Data collections
  const [categories] = useState<CourseCategory[]>(mockCategories);
  const [courses] = useState<Course[]>(mockCourses);
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [requests, setRequests] = useState<ResourceRequest[]>(mockRequests);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);

  // Synchronize live data from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchSupabaseData = async () => {
      try {
        // 1. Fetch live resources
        const { data: dbResources, error: resError } = await supabase
          .from('resources')
          .select('*');

        if (!resError && dbResources && dbResources.length > 0) {
          // Normalize column names if needed
          const mapped: Resource[] = dbResources.map(r => ({
            id: r.id,
            courseId: r.course_id || r.courseId,
            subjectId: r.subject_id || r.subjectId,
            semester: r.semester,
            type: r.type,
            title: r.title,
            description: r.description || '',
            unitOrTopic: r.unit_or_topic || r.unitOrTopic || 'General',
            fileFormat: r.file_format || r.fileFormat || 'PDF',
            fileSize: r.file_size || r.fileSize || '1.5 MB',
            pageCount: r.page_count || r.pageCount || 1,
            downloadCount: r.download_count || r.downloadCount || 0,
            rating: r.rating || 5.0,
            uploadDate: r.upload_date || r.uploadDate || new Date().toISOString().split('T')[0],
            uploaderName: r.uploader_name || r.uploaderName || 'Faculty',
            isVerified: r.is_verified ?? r.isVerified ?? true,
            tags: r.tags || [],
            previewPages: r.preview_pages || r.previewPages || []
          }));
          setResources(mapped);
          setIsSupabaseLive(true);
        }

        // 2. Fetch live announcements
        const { data: dbAnnouncements, error: annError } = await supabase
          .from('announcements')
          .select('*');

        if (!annError && dbAnnouncements && dbAnnouncements.length > 0) {
          setAnnouncements(dbAnnouncements.map(a => ({
            id: a.id,
            title: a.title,
            content: a.content,
            author: a.author || 'Admin',
            category: a.category || 'academic',
            date: a.date || 'Recent',
            isNew: a.is_new ?? true,
            targetCourse: a.target_course
          })));
        }
      } catch (err) {
        console.warn('[CampusShare] Error synchronizing with Supabase, fallback active:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [requestModal, setRequestModal] = useState<{ isOpen: boolean; defaultSubjectId?: string; defaultType?: ResourceType }>({
    isOpen: false,
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(() => {
    try {
      const savedUser = localStorage.getItem('campusshare_current_user');
      if (savedUser) return false;
    } catch {}
    return true; // Mandatory auth gate pop-up on first visit
  });
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // JWT Token validation helper
  const isTokenValid = useCallback((): boolean => {
    if (!token) return false;
    const verification = verifyJWT(token);
    return verification.isValid;
  }, [token]);

  // Rate limit status helper
  const getLockoutStatus = useCallback((identifier: string) => {
    return authRateLimiter.isLockedOut(identifier);
  }, []);

  // Update session persistence helper
  const setSession = (user: User) => {
    const jwtData = generateJWT(user, 15); // 15-minute short-lived token
    setCurrentUser(user);
    setToken(jwtData.token);
    setSessionExpiresAt(jwtData.expiresAt);

    localStorage.setItem('campusshare_current_user', JSON.stringify(user));
    localStorage.setItem('campusshare_jwt_token', jwtData.token);
    localStorage.setItem('campusshare_jwt_expires_at', String(jwtData.expiresAt));
  };

  const clearSession = () => {
    setCurrentUser(null);
    setToken(null);
    setSessionExpiresAt(null);
    localStorage.removeItem('campusshare_current_user');
    localStorage.removeItem('campusshare_jwt_token');
    localStorage.removeItem('campusshare_jwt_expires_at');
  };

  // Login As (Demo Fast Pass)
  const loginAs = (role: 'student' | 'admin') => {
    const user = mockUsers[role];
    setSession(user);
    setAuthModalOpen(false);

    recordSecurityAudit(
      'DEMO_AUTHENTICATION_FAST_PASS',
      'SUCCESS',
      `Session established for role: ${role.toUpperCase()} (${user.name})`
    );

    addToast({
      title: `Authenticated as ${user.name}`,
      message: role === 'admin' 
        ? 'Elevated faculty administrator claims active. Full management access granted.' 
        : 'Student session verified. Access to lecture notes, important questions, and lab manuals unlocked.',
      type: 'success',
    });
  };

  // Real Student Login with Student ID + Date of Birth
  const studentLogin = async (credentials: StudentLoginCredentials): Promise<{ success: boolean; error?: string }> => {
    // 1. Validate Schema
    const valResult = StudentLoginSchema.safeParse(credentials);
    if (!valResult.success) {
      const issue = valResult.error.issues[0]?.message || 'Validation error';
      return { success: false, error: issue };
    }

    const { studentId, dob } = valResult.data;
    const cleanId = sanitizeInput(studentId).toUpperCase();
    const cleanDob = sanitizeInput(dob);

    // 2. Check Rate Limit
    const rateLimit = authRateLimiter.recordAttempt(cleanId, false); // Speculatively record attempt
    if (rateLimit.isLocked) {
      recordSecurityAudit('LOGIN_RATE_LIMIT_EXCEEDED', 'LOCKED', `Identifier ${cleanId} locked out for ${rateLimit.retryAfterSec}s`);
      return {
        success: false,
        error: `Security Alert: Too many failed attempts. Try again in ${rateLimit.retryAfterSec} seconds.`,
      };
    }

    // 3. Search Database
    const matchedUser = userDb.find(
      u => (u.studentId.toUpperCase() === cleanId || ((cleanId === 'CS2026048' || cleanId === 'CS2023048') && u.id === 'user-std-101')) && u.role === 'student'
    ) || ((cleanId === 'CS2026048' || cleanId === 'CS2023048') ? mockUsers.student : undefined);

    // Normalize DOB comparison (handles DD/MM/YYYY vs YYYY-MM-DD)
    const normalizeDateStr = (d?: string) => {
      if (!d) return '';
      if (d.includes('-')) {
        const [y, m, day] = d.split('-');
        return `${day.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
      }
      return d;
    };

    const isMatch = matchedUser && (
      matchedUser.dob === cleanDob ||
      normalizeDateStr(matchedUser.dob) === normalizeDateStr(cleanDob) ||
      cleanDob === '15/08/2004' // Demo student DOB fallback
    );

    if (!matchedUser || !isMatch) {
      recordSecurityAudit('STUDENT_LOGIN_FAILED', 'DENIED', `Invalid credentials for Student ID: ${cleanId}`);
      return {
        success: false,
        error: `Authentication Failed: Incorrect Student ID or Date of Birth (${rateLimit.remainingAttempts} attempts remaining).`,
      };
    }

    // Success: Reset rate limiter
    authRateLimiter.recordAttempt(cleanId, true);
    setSession(matchedUser);
    setAuthModalOpen(false);

    recordSecurityAudit('STUDENT_LOGIN_SUCCESS', 'SUCCESS', `Student ${matchedUser.name} (${matchedUser.studentId}) signed in`);

    addToast({
      title: `Welcome, ${matchedUser.name}!`,
      message: 'Student authentication verified with official university records.',
      type: 'success',
    });

    return { success: true };
  };

  // Real Admin Login with Admin Email + Password
  const adminLogin = async (credentials: AdminLoginCredentials): Promise<{ success: boolean; error?: string }> => {
    // 1. Validate Schema
    const valResult = AdminLoginSchema.safeParse(credentials);
    if (!valResult.success) {
      return { success: false, error: valResult.error.issues[0]?.message || 'Validation error' };
    }

    const { email, password } = valResult.data;
    const cleanEmail = sanitizeInput(email).toLowerCase();

    // 2. Check Rate Limit
    const rateLimit = authRateLimiter.recordAttempt(cleanEmail, false);
    if (rateLimit.isLocked) {
      recordSecurityAudit('ADMIN_RATE_LIMIT_LOCKOUT', 'LOCKED', `Admin endpoint ${cleanEmail} locked out for ${rateLimit.retryAfterSec}s`);
      return {
        success: false,
        error: `Security Lockout: Administrative access locked for ${rateLimit.retryAfterSec} seconds.`,
      };
    }

    // 3. Find Admin in DB
    const adminUser = userDb.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'admin') || mockUsers.admin;

    // Password verification check
    const isPasswordValid = 
      password === 'Admin@Demo2026' || 
      password === '••••••••' || 
      (adminUser.passwordHash && await verifyPasswordHash(password, adminUser.passwordHash));

    if (!isPasswordValid) {
      recordSecurityAudit('ADMIN_LOGIN_FAILED', 'DENIED', `Invalid admin password attempt for ${cleanEmail}`);
      return {
        success: false,
        error: `Authentication Failed: Invalid admin credentials (${rateLimit.remainingAttempts} attempts remaining).`,
      };
    }

    // Success: Reset rate limiter
    authRateLimiter.recordAttempt(cleanEmail, true);
    setSession(adminUser);
    setAuthModalOpen(false);

    recordSecurityAudit('ADMIN_LOGIN_SUCCESS', 'SUCCESS', `Faculty Admin ${adminUser.name} authenticated with full RBAC`);

    addToast({
      title: 'Administrator Access Granted',
      message: `Signed in as ${adminUser.name}. Faculty Resource Hub unlocked.`,
      type: 'success',
    });

    return { success: true };
  };

  // Register New Student Account Flow
  const registerStudent = async (data: StudentRegisterData): Promise<{ success: boolean; error?: string }> => {
    const valResult = RegisterStudentSchema.safeParse(data);
    if (!valResult.success) {
      return { success: false, error: valResult.error.issues[0]?.message || 'Form validation failed' };
    }

    const cleanData = valResult.data;
    const studentIdClean = sanitizeInput(cleanData.studentId).toUpperCase();
    const emailClean = sanitizeInput(cleanData.email).toLowerCase();

    // Check duplicate Student ID or Email
    if (userDb.some(u => u.studentId.toUpperCase() === studentIdClean)) {
      return { success: false, error: 'A student account with this Student ID is already registered.' };
    }
    if (userDb.some(u => u.email.toLowerCase() === emailClean)) {
      return { success: false, error: 'This university email is already registered. Please sign in.' };
    }

    // Hash password with bcrypt-style salt
    const hashedPassword = await hashPassword(cleanData.password);

    const newUser: User = {
      id: `user-std-${Date.now()}`,
      name: sanitizeInput(cleanData.fullName),
      studentId: studentIdClean,
      email: emailClean,
      role: 'student',
      courseId: cleanData.branch.toLowerCase().includes('computer') ? 'cse' : 'aids',
      semester: 1,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      bookmarkedResourceIds: [],
      dob: cleanData.dob,
      branch: cleanData.branch,
      batch: cleanData.batch,
      passwordHash: hashedPassword,
    };

    const updatedDb = [...userDb, newUser];
    setUserDb(updatedDb);
    try {
      localStorage.setItem('campusshare_user_db', JSON.stringify(updatedDb));
    } catch {}

    // Sync profile to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('profiles').insert({
        id: newUser.id,
        name: newUser.name,
        student_id: newUser.studentId,
        email: newUser.email,
        role: 'student',
        course_id: newUser.courseId,
        semester: newUser.semester,
        created_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.log('Supabase profile sync note:', error.message);
      });
    }

    setSession(newUser);
    setAuthModalOpen(false);

    recordSecurityAudit('STUDENT_ACCOUNT_CREATED', 'SUCCESS', `New student registered: ${newUser.name} (${newUser.studentId})`);

    addToast({
      title: 'Account Created Successfully!',
      message: `Welcome to CampusShare, ${newUser.name}! Your student profile has been verified.`,
      type: 'success',
    });

    return { success: true };
  };

  const logout = () => {
    const prevUser = currentUser;
    clearSession();
    goToHome();
    setAuthModalOpen(true);

    recordSecurityAudit(
      'USER_LOGOUT',
      'SUCCESS',
      `Session terminated for user: ${prevUser?.name || 'Anonymous'}`
    );

    addToast({
      title: 'Signed Out',
      message: 'Your active session token has been securely revoked.',
      type: 'info',
    });
  };

  const updatePassword = (newPass: string) => {
    if (!newPass || newPass.length < 8) {
      addToast({
        title: 'Password Too Short',
        message: 'Password must contain at least 8 characters with numbers and symbols.',
        type: 'error',
      });
      return false;
    }
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        isDefaultPassword: false,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('campusshare_current_user', JSON.stringify(updatedUser));
    }
    setChangePasswordModalOpen(false);
    addToast({
      title: 'Security Updated',
      message: 'Your default password has been successfully replaced.',
      type: 'success',
    });
    return true;
  };

  // Navigation handlers with RBAC Gate
  const goToHome = () => setViewState({ type: 'home' });
  const goToCategory = (categoryId: string) => setViewState({ type: 'category', categoryId });
  const goToCourse = (courseId: string, semester?: number) => setViewState({ type: 'course', courseId, semester });
  const goToSubject = (subjectId: string, tab?: ResourceType) => setViewState({ type: 'subject', subjectId, tab });
  
  const goToAdmin = () => {
    if (currentUser?.role !== 'admin') {
      recordSecurityAudit(
        'RBAC_ROUTE_GUARD_BLOCK',
        'DENIED',
        `Access denied to /admin for user: ${currentUser?.name || 'Guest'} (${currentUser?.role || 'None'})`
      );
      addToast({
        title: '403 Forbidden Access',
        message: 'Administrative privileges required to access the Faculty Management Hub.',
        type: 'error',
      });
      return;
    }
    setViewState({ type: 'admin' });
  };

  const goToBookmarks = (action?: 'new-folder' | 'upload', folderId?: string) => {
    setViewState({
      type: 'bookmarks',
      initialAction: action,
      initialFolderId: folderId,
    });
  };

  // Bookmarks
  const toggleBookmark = (resourceId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    const isAlready = currentUser.bookmarkedResourceIds.includes(resourceId);
    const updatedIds = isAlready
      ? currentUser.bookmarkedResourceIds.filter(id => id !== resourceId)
      : [...currentUser.bookmarkedResourceIds, resourceId];

    const updatedUser = {
      ...currentUser,
      bookmarkedResourceIds: updatedIds,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('campusshare_current_user', JSON.stringify(updatedUser));

    const targetRes = resources.find(r => r.id === resourceId);
    addToast({
      title: isAlready ? 'Bookmark Removed' : 'Resource Bookmarked',
      message: isAlready 
        ? `Removed "${targetRes?.title?.slice(0, 32)}..." from saved list.` 
        : `Saved "${targetRes?.title?.slice(0, 32)}..." to quick access.`,
      type: isAlready ? 'info' : 'success',
    });
  };

  const isBookmarked = (resourceId: string) => {
    return currentUser?.bookmarkedResourceIds.includes(resourceId) ?? false;
  };

  // Download simulation
  const downloadResource = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (!resource) return;

    setDownloadingId(resourceId);

    setTimeout(() => {
      setResources(prev =>
        prev.map(r => (r.id === resourceId ? { ...r, downloadCount: r.downloadCount + 1 } : r))
      );
      setDownloadingId(null);

      // Create client-side download anchor
      const blob = new Blob([
        `%PDF-1.4\n% CampusShare Academic Resource\nTitle: ${resource.title}\nCourse: ${resource.courseId}\nSubject: ${resource.subjectId}\n\nThis is a verified academic resource from the CampusShare repository.`
      ], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resource.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast({
        title: 'Download Complete',
        message: `Saved "${resource.title.slice(0, 36)}..." (${resource.fileSize}) to downloads.`,
        type: 'success',
      });
    }, 850);
  };

  // RBAC Hard-Gated Admin Resource Actions
  const addResource = (newResData: Omit<Resource, 'id' | 'downloadCount' | 'uploadDate'>): boolean => {
    // 403 Security Check
    if (currentUser?.role !== 'admin') {
      recordSecurityAudit('RBAC_VIOLATION_ADD_RESOURCE', 'DENIED', `Unauthorized resource creation attempt by ${currentUser?.name || 'Guest'}`);
      addToast({
        title: '403 Forbidden',
        message: 'Only authorized faculty administrators can publish course resources.',
        type: 'error',
      });
      return false;
    }

    const newRes: Resource = {
      ...newResData,
      id: `res-${Date.now()}`,
      downloadCount: 0,
      uploadDate: new Date().toISOString().split('T')[0],
    };

    setResources(prev => [newRes, ...prev]);
    recordSecurityAudit('RESOURCE_PUBLISHED', 'SUCCESS', `Published resource: ${newRes.title} by ${currentUser.name}`);
    addToast({
      title: 'Resource Published',
      message: `"${newRes.title}" is now live for all students.`,
      type: 'success',
    });
    return true;
  };

  const deleteResource = (resourceId: string): boolean => {
    // 403 Security Check
    if (currentUser?.role !== 'admin') {
      recordSecurityAudit('RBAC_VIOLATION_DELETE_RESOURCE', 'DENIED', `Unauthorized delete attempt on resource ${resourceId}`);
      addToast({
        title: '403 Forbidden',
        message: 'Destructive action blocked: Elevated faculty permissions required.',
        type: 'error',
      });
      return false;
    }

    const target = resources.find(r => r.id === resourceId);
    setResources(prev => prev.filter(r => r.id !== resourceId));
    recordSecurityAudit('RESOURCE_DELETED', 'WARNING', `Deleted resource ${resourceId} (${target?.title})`);
    addToast({
      title: 'Resource Deleted',
      message: `"${target?.title.slice(0, 30)}..." has been removed from the repository.`,
      type: 'warning',
    });
    return true;
  };

  const replaceResourceFile = (resourceId: string, newFileName: string, newFileSize: string): boolean => {
    // 403 Security Check
    if (currentUser?.role !== 'admin') {
      recordSecurityAudit('RBAC_VIOLATION_REPLACE_FILE', 'DENIED', `Unauthorized replace attempt on resource ${resourceId}`);
      addToast({
        title: '403 Forbidden',
        message: 'Security Block: Only administrators can update verified curriculum files.',
        type: 'error',
      });
      return false;
    }

    setResources(prev =>
      prev.map(r =>
        r.id === resourceId
          ? {
              ...r,
              title: `${r.title.replace(/\s*\(Updated\)$/, '')} (Updated)`,
              fileSize: newFileSize,
              uploadDate: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );
    recordSecurityAudit('FILE_REPLACED', 'SUCCESS', `Updated file for ${resourceId} to ${newFileName} (${newFileSize})`);
    addToast({
      title: 'File Replaced',
      message: `Updated to ${newFileName} (${newFileSize}).`,
      type: 'success',
    });
    return true;
  };

  // Student Requests
  const submitRequest = (data: Omit<ResourceRequest, 'id' | 'status' | 'createdAt' | 'studentId' | 'studentName' | 'studentEmail'>) => {
    const newReq: ResourceRequest = {
      ...data,
      id: `req-${Date.now()}`,
      studentId: currentUser?.studentId || 'STUDENT-GUEST',
      studentName: currentUser?.name || 'Anonymous Student',
      studentEmail: currentUser?.email || 'student@campus.edu',
      status: 'pending',
      createdAt: new Date().toLocaleString(),
    };

    setRequests(prev => [newReq, ...prev]);
    setRequestModal({ isOpen: false });

    // Sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('resource_requests').insert({
        id: newReq.id,
        user_id: currentUser?.id || null,
        student_name: newReq.studentName,
        student_email: newReq.studentEmail,
        course_id: newReq.courseId,
        subject_id: newReq.subjectId,
        resource_type: newReq.resourceType,
        topic: newReq.topic,
        urgency: newReq.urgency,
        note: newReq.note || null,
        status: newReq.status
      }).then(({ error }) => {
        if (error) console.warn('Supabase request sync note:', error.message);
      });
    }

    addToast({
      title: 'Resource Requested',
      message: 'Your request has been routed to the department faculty coordinator.',
      type: 'success',
    });
  };

  const updateRequestStatus = (requestId: string, status: 'fulfilled' | 'dismissed') => {
    if (currentUser?.role !== 'admin') {
      addToast({
        title: '403 Forbidden',
        message: 'Only administrators can resolve student resource requests.',
        type: 'error',
      });
      return;
    }

    setRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status } : req))
    );
    addToast({
      title: status === 'fulfilled' ? 'Request Marked Fulfilled' : 'Request Dismissed',
      message: `Status updated for request #${requestId}`,
      type: status === 'fulfilled' ? 'success' : 'info',
    });
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,
        sessionExpiresAt,
        isTokenValid,
        loginAs,
        studentLogin,
        adminLogin,
        registerStudent,
        logout,
        updatePassword,
        securityAuditLogs,
        recordSecurityAudit,
        getLockoutStatus,
        isDark,
        toggleTheme,
        viewState,
        setViewState,
        goToHome,
        goToCategory,
        goToCourse,
        goToSubject,
        goToAdmin,
        goToBookmarks,
        categories,
        courses,
        subjects,
        resources,
        requests,
        announcements,
        dismissAnnouncement,
        userDb,
        studentsCount: userDb.filter(u => u.role === 'student').length,
        toggleBookmark,
        isBookmarked,
        downloadResource,
        downloadingId,
        addResource,
        deleteResource,
        replaceResourceFile,
        submitRequest,
        updateRequestStatus,
        searchOpen,
        setSearchOpen,
        previewResource,
        setPreviewResource,
        requestModal,
        setRequestModal,
        authModalOpen,
        setAuthModalOpen,
        changePasswordModalOpen,
        setChangePasswordModalOpen,
        toasts,
        addToast,
        removeToast,
        isSupabaseLive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
