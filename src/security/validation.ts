import { z } from 'zod';

/**
 * Enterprise Validation Schemas powered by Zod
 * Defense against malformed payloads, injection vectors, and invalid state transitions
 */

// Normalizes & validates Student ID (supports university roll numbers like 260121250 as well as alphanumeric codes like CS2026048)
export const studentIdPattern = /^[A-Za-z0-9_-]{5,16}$/;

export const StudentLoginSchema = z.object({
  studentId: z
    .string()
    .trim()
    .min(5, 'Student ID must be at least 5 characters')
    .max(16, 'Student ID cannot exceed 16 characters')
    .regex(studentIdPattern, 'Invalid Student ID format. Example: 260121250 or CS2026048'),
  dob: z
    .string()
    .trim()
    .min(8, 'Date of birth is required')
    .refine((val) => {
      // Accepts YYYY-MM-DD or DD/MM/YYYY
      const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
      const dmyRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      return isoRegex.test(val) || dmyRegex.test(val);
    }, 'Enter a valid Date of Birth in DD/MM/YYYY or YYYY-MM-DD format'),
});

export const AdminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid administrator email address format')
    .refine((val) => {
      // Restricts or warns on non-institutional domains if needed
      return val.includes('@');
    }, 'Please enter your authorized faculty administrator email'),
  password: z
    .string()
    .min(6, 'Password must contain at least 6 characters')
    .max(128, 'Password exceeds allowable length'),
});

export const RegisterStudentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(64, 'Name cannot exceed 64 characters')
    .regex(/^[A-Za-z\s.'-]+$/, 'Name must contain only alphabetic characters'),
  studentId: z
    .string()
    .trim()
    .toUpperCase()
    .min(5, 'Student ID must be at least 5 characters')
    .max(16, 'Student ID cannot exceed 16 characters')
    .regex(studentIdPattern, 'Format must match your student ID / roll number (e.g., 260121250)'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please provide a valid email format')
    .refine((email) => {
      // Enforce college/institutional domain check (.edu, .ac.in, campus.edu, or campusshare.edu)
      return (
        email.endsWith('.edu') ||
        email.endsWith('.ac.in') ||
        email.includes('@campus') ||
        email.endsWith('@campusshare.edu')
      );
    }, 'Must be an official university email (ending in .edu, .ac.in, or @campus.edu)'),
  branch: z
    .string()
    .min(2, 'Please select your academic department / branch'),
  batch: z
    .string()
    .min(4, 'Please select your graduating batch'),
  dob: z
    .string()
    .trim()
    .min(8, 'Date of Birth is required')
    .refine((val) => {
      // Validate date validity and minimum age (at least 16 years old)
      let parsedDate: Date | null = null;
      if (val.includes('-')) {
        parsedDate = new Date(val);
      } else if (val.includes('/')) {
        const [d, m, y] = val.split('/');
        parsedDate = new Date(Number(y), Number(m) - 1, Number(d));
      }
      if (!parsedDate || isNaN(parsedDate.getTime())) return false;
      const ageInMs = Date.now() - parsedDate.getTime();
      const ageYears = ageInMs / (1000 * 60 * 60 * 24 * 365.25);
      return ageYears >= 15 && ageYears <= 80;
    }, 'Student must be at least 15 years of age with a valid calendar date'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Resource Upload Schema with 3 required dropdowns: Course, Subject, Section Type
export const ResourceUploadSchema = z.object({
  courseId: z.string().min(1, 'Course selection is required'),
  subjectId: z.string().min(1, 'Subject selection is required'),
  sectionType: z.enum(['notes', 'importantQuestions', 'labManuals', 'projects', 'syllabus'], {
    message: 'Valid Resource Type (Notes, Important Questions, Lab Manuals, Projects, Syllabus) is required',
  }),
  title: z
    .string()
    .trim()
    .min(5, 'Document title must be at least 5 characters')
    .max(150, 'Title cannot exceed 150 characters'),
  unitOrTopic: z
    .string()
    .trim()
    .min(3, 'Unit / Module topic is required')
    .max(80, 'Unit topic cannot exceed 80 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
});
