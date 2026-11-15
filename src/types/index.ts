export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  studentId: string;
  email: string;
  role: UserRole;
  courseId: string;
  semester: number;
  avatar: string;
  bookmarkedResourceIds: string[];
  isDefaultPassword?: boolean;
  dob?: string; // Date of birth (DD/MM/YYYY or YYYY-MM-DD)
  branch?: string;
  batch?: string;
  passwordHash?: string;
}

export interface JWTPayload {
  sub: string;
  studentId: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'SUCCESS' | 'DENIED' | 'LOCKED' | 'WARNING';
  ip: string;
  details: string;
}

export interface StudentLoginCredentials {
  studentId: string;
  dob: string;
}

export interface AdminLoginCredentials {
  email: string;
  password: string;
}

export interface StudentRegisterData {
  fullName: string;
  studentId: string;
  email: string;
  branch: string;
  batch?: string;
  dob: string;
  password: string;
  confirmPassword?: string;
}

export type ResourceType = 'notes' | 'importantQuestions' | 'labManuals' | 'projects' | 'syllabus';

export const formatDisplayDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        const dayStr = String(day).padStart(2, '0');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${dayStr} ${months[month]} ${year}`;
      }
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const dayStr = String(d.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${dayStr} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch {}
  return dateStr;
};

export interface ResourcePreviewPage {
  pageNumber: number;
  title: string;
  content: string[];
  codeSnippet?: string;
  formulaSnippet?: string;
}

export interface Resource {
  id: string;
  courseId: string;
  subjectId: string;
  semester: number;
  type: ResourceType;
  title: string;
  description: string;
  unitOrTopic: string;
  fileFormat: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  pageCount: number;
  downloadCount: number;
  rating: number;
  uploadDate: string;
  uploaderName: string;
  isVerified: boolean;
  tags: string[];
  previewPages: ResourcePreviewPage[];
}

export interface Subject {
  id: string;
  courseId: string;
  semester: number;
  code: string;
  name: string;
  shortName: string;
  credits: number;
  facultyCoordinator: string;
  description: string;
  syllabusHighlights: string[];
  resourceCounts: {
    notes: number;
    importantQuestions: number;
    labManuals: number;
    projects: number;
    syllabus?: number;
  };
}

export interface CourseCategory {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  iconName: string;
  description: string;
  hasDepartments: boolean;
  departmentIds?: string[];
  directCourseId?: string;
}

export interface Course {
  id: string;
  categoryId?: string;
  code: string;
  name: string;
  shortName: string;
  department: string;
  semestersCount: number;
  totalSubjects: number;
  totalResources: number;
  iconName: string;
  description: string;
}

export interface ResourceRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  subjectId: string;
  subjectName: string;
  resourceType: ResourceType;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'fulfilled' | 'dismissed';
  createdAt: string;
  note?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'academic' | 'urgent' | 'materials';
  date: string;
  isNew: boolean;
  targetCourse?: string;
}

export interface NavigationPath {
  fieldId?: string;
  specializationId?: string;
  semester?: number;
  resourceType?: ResourceType;
  subjectId?: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'explore'; path?: NavigationPath }
  | { type: 'category'; categoryId: string }
  | { type: 'course'; courseId: string; semester?: number }
  | { type: 'subject'; subjectId: string; tab?: ResourceType }
  | { type: 'admin' }
  | { type: 'bookmarks'; initialAction?: 'new-folder' | 'upload'; initialFolderId?: string };

export interface BackpackFolder {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface UserBackpackUpload {
  id: string;
  title: string;
  folderId?: string;
  category: string;
  fileFormat: 'PDF' | 'DOCX';
  fileSize: string;
  pageCount: number;
  uploadDate: string;
  notes?: string;
  previewPages?: ResourcePreviewPage[];
}
