import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceType, formatDisplayDate } from '../../types';
import { 
  NAVIGATION_CONFIG, 
  RESOURCE_TYPES, 
  FieldConfig, 
  SpecializationConfig, 
  SubjectConfig, 
  NavigationPath, 
  getFieldConfig, 
  getSpecializationConfig, 
  countFilesForPath,
  getSemesterAcademicTag
} from '../../data/navigationConfig';
import { AnnouncementStrip } from './AnnouncementStrip';
import { StatsStrip } from './StatsStrip';
import { HowItWorksSection } from './HowItWorksSection';
import { ExamCountdownSection } from './ExamCountdownSection';
import { FeedbackSection } from './FeedbackSection';
import { 
  ArrowRight, 
  FileText, 
  Download, 
  Eye, 
  Cpu, 
  Terminal, 
  FlaskConical, 
  Briefcase,
  Layers,
  CheckCircle2,
  HelpCircle,
  FolderGit2,
  BookOpen,
  Bookmark,
  ChevronRight,
  Search,
  ArrowUpDown,
  RotateCcw,
  Compass,
  GraduationCap,
  Wrench,
  Zap,
  Radio,
  Building2,
  Code,
  Server,
  Atom,
  TestTube2,
  Sigma,
  Megaphone,
  Coins,
  Users2,
  AlertCircle,
  Calendar,
  Upload
} from 'lucide-react';

const LAST_PATH_STORAGE_KEY = 'campusshare_last_visited_path';

export const HomeDashboard: React.FC = () => {
  const { 
    currentUser, 
    resources, 
    setPreviewResource, 
    downloadResource, 
    downloadingId, 
    toggleBookmark, 
    isBookmarked, 
    setRequestModal,
    setStudentUploadModal,
    setAuthModalOpen,
    goToBookmarks
  } = useApp();

  // Navigation State (6 Steps: Field > Degree > Semester > Category > Subject > Files)
  const [navPath, setNavPath] = useState<NavigationPath>({});
  const [lastSavedPath, setLastSavedPath] = useState<{ path: NavigationPath; title: string; timestamp: number } | null>(null);

  // Files Step (Step 6) Filter & Sort State
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<ResourceType | 'all'>('all');
  const [fileSortBy, setFileSortBy] = useState<'downloads' | 'date' | 'title'>('downloads');

  // Load last saved path from localStorage with defensive validation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAST_PATH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.path && typeof parsed.path === 'object') {
          if (parsed.path.semester !== undefined && (typeof parsed.path.semester !== 'number' || parsed.path.semester < 1)) {
            delete parsed.path.semester;
          }
          setLastSavedPath(parsed);
        }
      }
    } catch {}
  }, []);

  // Save last visited path when at step >= 2
  const persistLastPath = useCallback((path: NavigationPath, title: string) => {
    if (path.fieldId) {
      try {
        const entry = { path, title, timestamp: Date.now() };
        localStorage.setItem(LAST_PATH_STORAGE_KEY, JSON.stringify(entry));
        setLastSavedPath(entry);
      } catch {}
    }
  }, []);

  // Helper to construct hash from path (supporting semester segment)
  const buildHash = useCallback((path: NavigationPath): string => {
    if (!path.fieldId) return '#/explore';
    if (!path.specializationId) return `#/explore/${path.fieldId}`;
    if (!path.semester) return `#/explore/${path.fieldId}/${path.specializationId}`;
    if (!path.resourceType) return `#/explore/${path.fieldId}/${path.specializationId}/${path.semester}`;
    if (!path.subjectId) return `#/explore/${path.fieldId}/${path.specializationId}/${path.semester}/${path.resourceType}`;
    return `#/explore/${path.fieldId}/${path.specializationId}/${path.semester}/${path.resourceType}/${path.subjectId}`;
  }, []);

  // Helper to parse and validate hash with fallback to nearest valid level
  const parseHash = useCallback((hash: string): NavigationPath => {
    if (!hash || !hash.startsWith('#/explore')) {
      return {};
    }

    const segments = hash.replace(/^#\/explore\/?/, '').split('/').filter(Boolean);
    if (segments.length === 0) {
      return {};
    }

    const [fieldId, specId, thirdSegment, fourthSegment, fifthSegment] = segments;

    // Validate Field
    const field = getFieldConfig(fieldId);
    if (!field) {
      return {};
    }

    // Skip rule forward handling: if field has only 1 specialization
    const hasSingleSpec = field.specializations.length === 1;
    const effectiveSpecId = specId || (hasSingleSpec ? field.specializations[0].id : undefined);

    if (!effectiveSpecId) {
      return { fieldId: field.id };
    }

    // Validate Specialization
    const spec = getSpecializationConfig(field.id, effectiveSpecId);
    if (!spec) {
      return { fieldId: field.id };
    }

    if (!thirdSegment) {
      return { fieldId: field.id, specializationId: spec.id };
    }

    // Determine if thirdSegment is a semester integer or legacy resourceType
    const parsedSem = parseInt(thirdSegment, 10);
    const maxSem = spec.totalSemesters || 8;
    const isSemesterNumber = !isNaN(parsedSem) && parsedSem >= 1 && parsedSem <= maxSem;

    let semester: number | undefined;
    let typeId: string | undefined;
    let subjectId: string | undefined;

    if (isSemesterNumber) {
      semester = parsedSem;
      typeId = fourthSegment;
      subjectId = fifthSegment;
    } else {
      // Legacy hash support: #/explore/:fieldId/:specId/:resourceType/:subjectId
      typeId = thirdSegment;
      subjectId = fourthSegment;
      if (subjectId) {
        const sub = spec.subjects.find(s => s.id === subjectId);
        if (sub && sub.semester) {
          semester = sub.semester;
        }
      }
      if (!semester) {
        semester = 1;
      }
    }

    if (!semester) {
      return { fieldId: field.id, specializationId: spec.id };
    }

    if (!typeId) {
      return { fieldId: field.id, specializationId: spec.id, semester };
    }

    // Validate Resource Type
    const isValidType = RESOURCE_TYPES.some(t => t.id === typeId);
    if (!isValidType) {
      return { fieldId: field.id, specializationId: spec.id, semester };
    }

    const resourceType = typeId as ResourceType;

    if (!subjectId) {
      return { fieldId: field.id, specializationId: spec.id, semester, resourceType };
    }

    // Validate Subject
    const subject = spec.subjects.find(s => s.id === subjectId);
    if (!subject) {
      return { fieldId: field.id, specializationId: spec.id, semester, resourceType };
    }

    return {
      fieldId: field.id,
      specializationId: spec.id,
      semester,
      resourceType,
      subjectId: subject.id,
    };
  }, []);

  // Hash listener: Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseHash(window.location.hash);
      setNavPath(parsed);

      const normalized = buildHash(parsed);
      if (window.location.hash !== normalized && (window.location.hash.startsWith('#/explore') || window.location.hash === '')) {
        window.history.replaceState(null, '', normalized);
      }
    };

    if (!window.location.hash || window.location.hash === '#' || window.location.hash === '#/') {
      window.history.replaceState(null, '', '#/explore');
    }
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [parseHash, buildHash]);

  // Navigate to path updating URL hash
  const navigateTo = useCallback((nextPath: NavigationPath) => {
    const hash = buildHash(nextPath);
    window.location.hash = hash;
  }, [buildHash]);

  // Determine current active step (1 to 6)
  const currentStep = useMemo(() => {
    if (!navPath.fieldId) return 1;
    if (!navPath.specializationId) return 2;
    if (!navPath.semester) return 3;
    if (!navPath.resourceType) return 4;
    if (!navPath.subjectId) return 5;
    return 6;
  }, [navPath]);

  // Synchronize fileTypeFilter with navPath.resourceType when entering step 6
  useEffect(() => {
    if (navPath.resourceType) {
      setFileTypeFilter(navPath.resourceType);
    }
  }, [navPath.resourceType]);

  // Current entity resolutions
  const selectedField = useMemo(() => getFieldConfig(navPath.fieldId), [navPath.fieldId]);
  const selectedSpecialization = useMemo(
    () => getSpecializationConfig(navPath.fieldId, navPath.specializationId),
    [navPath.fieldId, navPath.specializationId]
  );
  const selectedResourceType = useMemo(
    () => RESOURCE_TYPES.find(t => t.id === navPath.resourceType),
    [navPath.resourceType]
  );
  const selectedSubject = useMemo(() => {
    if (!selectedSpecialization || !navPath.subjectId) return undefined;
    return selectedSpecialization.subjects.find(s => s.id === navPath.subjectId);
  }, [selectedSpecialization, navPath.subjectId]);

  // Save to "Continue where you left off"
  useEffect(() => {
    if (selectedSubject && selectedSpecialization && selectedField && navPath.semester) {
      persistLastPath(
        navPath,
        `${selectedField.name} › ${selectedSpecialization.name} › Sem ${navPath.semester} › ${selectedSubject.name}`
      );
    } else if (selectedSpecialization && selectedField && navPath.semester) {
      persistLastPath(
        navPath,
        `${selectedField.name} › ${selectedSpecialization.name} › Semester ${navPath.semester}`
      );
    } else if (selectedSpecialization && selectedField) {
      persistLastPath(
        navPath,
        `${selectedField.name} › ${selectedSpecialization.name}`
      );
    }
  }, [navPath, selectedField, selectedSpecialization, selectedSubject, persistLastPath]);

  // Handlers for step selections
  const handleSelectField = (field: FieldConfig) => {
    // Skip rule: if field has only 1 specialization, skip Step 2 in forward navigation
    if (field.specializations.length === 1) {
      navigateTo({ fieldId: field.id, specializationId: field.specializations[0].id });
    } else {
      navigateTo({ fieldId: field.id });
    }
  };

  const handleSelectSpecialization = (spec: SpecializationConfig) => {
    navigateTo({ fieldId: navPath.fieldId, specializationId: spec.id });
  };

  const handleSelectSemester = (sem: number) => {
    navigateTo({
      fieldId: navPath.fieldId,
      specializationId: navPath.specializationId,
      semester: sem,
    });
  };

  const handleSelectResourceType = (type: ResourceType) => {
    navigateTo({
      fieldId: navPath.fieldId,
      specializationId: navPath.specializationId,
      semester: navPath.semester,
      resourceType: type,
    });
  };

  const handleSelectSubject = (subject: SubjectConfig) => {
    navigateTo({
      fieldId: navPath.fieldId,
      specializationId: navPath.specializationId,
      semester: navPath.semester || subject.semester,
      resourceType: navPath.resourceType,
      subjectId: subject.id,
    });
  };

  // Back Navigation with Skip Rule handling
  const handleStepBack = () => {
    if (currentStep === 6) {
      navigateTo({
        fieldId: navPath.fieldId,
        specializationId: navPath.specializationId,
        semester: navPath.semester,
        resourceType: navPath.resourceType,
      });
    } else if (currentStep === 5) {
      navigateTo({
        fieldId: navPath.fieldId,
        specializationId: navPath.specializationId,
        semester: navPath.semester,
      });
    } else if (currentStep === 4) {
      navigateTo({
        fieldId: navPath.fieldId,
        specializationId: navPath.specializationId,
      });
    } else if (currentStep === 3) {
      if (selectedField?.specializations.length === 1) {
        navigateTo({});
      } else {
        navigateTo({ fieldId: navPath.fieldId });
      }
    } else if (currentStep === 2) {
      navigateTo({});
    }
  };



  // Step 6: Filtered and Sorted Files
  const subjectFiles = useMemo(() => {
    if (!navPath.subjectId) return [];

    let list = resources.filter(r => r.subjectId === navPath.subjectId);

    // If semester is specified in navPath, ensure resource matches or has no constraint
    if (navPath.semester !== undefined) {
      list = list.filter(r => r.semester === navPath.semester || !r.semester);
    }

    // Filter by type if not 'all'
    if (fileTypeFilter !== 'all') {
      list = list.filter(r => r.type === fileTypeFilter);
    }

    // Filter by search query
    if (fileSearchQuery.trim()) {
      const q = fileSearchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.unitOrTopic.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Sort files
    list = [...list].sort((a, b) => {
      if (fileSortBy === 'downloads') return b.downloadCount - a.downloadCount;
      if (fileSortBy === 'date') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (fileSortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

    return list;
  }, [resources, navPath.subjectId, navPath.semester, fileTypeFilter, fileSearchQuery, fileSortBy]);

  // Icon render helpers
  const renderFieldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-[var(--link)]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[var(--link)]" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-[var(--link)]" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[var(--link)]" />;
      default: return <BookOpen className="w-5 h-5 text-[var(--link)]" />;
    }
  };

  const renderSpecIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[var(--link)]" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-[var(--link)]" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-[var(--link)]" />;
      case 'Zap': return <Zap className="w-5 h-5 text-[var(--link)]" />;
      case 'Radio': return <Radio className="w-5 h-5 text-[var(--link)]" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-[var(--link)]" />;
      case 'Code': return <Code className="w-5 h-5 text-[var(--link)]" />;
      case 'Server': return <Server className="w-5 h-5 text-[var(--link)]" />;
      case 'Atom': return <Atom className="w-5 h-5 text-[var(--link)]" />;
      case 'TestTube2': return <TestTube2 className="w-5 h-5 text-[var(--link)]" />;
      case 'Sigma': return <Sigma className="w-5 h-5 text-[var(--link)]" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-[var(--link)]" />;
      case 'Coins': return <Coins className="w-5 h-5 text-[var(--link)]" />;
      case 'Users2': return <Users2 className="w-5 h-5 text-[var(--link)]" />;
      default: return <BookOpen className="w-5 h-5 text-[var(--link)]" />;
    }
  };

  const renderTypeIcon = (typeId: ResourceType) => {
    switch (typeId) {
      case 'notes': return <FileText className="w-5 h-5 text-[var(--link)]" />;
      case 'importantQuestions': return <HelpCircle className="w-5 h-5 text-[var(--accent)]" />;
      case 'labManuals': return <FlaskConical className="w-5 h-5 text-[var(--link)]" />;
      case 'projects': return <FolderGit2 className="w-5 h-5 text-[var(--accent)]" />;
      case 'syllabus': return <BookOpen className="w-5 h-5 text-[var(--link)]" />;
      default: return <FileText className="w-5 h-5 text-[var(--link)]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Announcement Strip: directly under the header */}
      <AnnouncementStrip />

      {/* Editorial Academic Workspace Hero (Screenshot 1) */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-14 text-center shadow-xs transition-colors">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--cherry-pink)] block mb-3">
          YOUR ACADEMIC WORKSPACE
        </span>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text)] max-w-3xl mx-auto leading-tight">
          Everything for your semester, in one place.
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-4 max-w-xl mx-auto leading-relaxed">
          Log in with your Student ID, choose your course and branch, then find the files you need without searching through scattered chats.
        </p>

        {currentUser && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--border)] text-xs text-[var(--text)] mt-4">
            <span className="w-2 h-2 rounded-full bg-[var(--sage)]"></span>
            <span>Welcome back, <strong className="font-bold">{currentUser.name}</strong> • {currentUser.studentId} (Semester {currentUser.semester})</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {!currentUser ? (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-6 py-2.5 rounded-xl font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Open student login
            </button>
          ) : (
            <button
              onClick={() => {
                const el = document.getElementById('cs-academic-explore');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-2.5 rounded-xl font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              Explore Curriculum
            </button>
          )}

          <button
            onClick={() => {
              const el = document.getElementById('cs-home-how-it-works');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl font-semibold bg-[var(--surface)] hover:bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] text-xs sm:text-sm transition-colors cursor-pointer"
          >
            See how it works
          </button>
        </div>

        <p className="text-xs font-medium text-[var(--text-muted)] mt-6">
          Documents • Notes • Assignments • Study materials
        </p>
      </section>

      {/* 2. Stats Strip */}
      <StatsStrip />

      {/* STEP TRACKER: Field > Degree > Semester > Category > Subject > Files */}
      <nav id="cs-academic-explore" aria-label="Exploration Progress" className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs pb-1 sm:pb-0">
          
          {/* Step 1: Field */}
          <button
            onClick={() => navigateTo({})}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]'
            }`}
          >
            <span>01. Field</span>
            {selectedField && (
              <span className="font-semibold opacity-90 truncate max-w-[120px]">
                ({selectedField.shortName})
              </span>
            )}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 shrink-0" />

          {/* Step 2: Degree / Specialization */}
          <button
            onClick={() => {
              if (selectedField) {
                navigateTo({ fieldId: selectedField.id });
              }
            }}
            disabled={!selectedField}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 2
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : selectedSpecialization
                ? 'bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer'
                : 'opacity-40 text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            <span>02. Degree</span>
            {selectedSpecialization && (
              <span className="font-semibold opacity-90 truncate max-w-[120px]">
                ({selectedSpecialization.shortName})
              </span>
            )}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 shrink-0" />

          {/* Step 3: Semester (NEW) */}
          <button
            onClick={() => {
              if (selectedField && selectedSpecialization) {
                navigateTo({
                  fieldId: selectedField.id,
                  specializationId: selectedSpecialization.id,
                });
              }
            }}
            disabled={!selectedSpecialization}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 3
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : navPath.semester
                ? 'bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer'
                : 'opacity-40 text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            <span>03. Semester</span>
            {navPath.semester && (
              <span className="font-semibold opacity-90 truncate max-w-[90px]">
                (Sem {navPath.semester})
              </span>
            )}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 shrink-0" />

          {/* Step 4: Resource Category */}
          <button
            onClick={() => {
              if (selectedField && selectedSpecialization && navPath.semester) {
                navigateTo({
                  fieldId: selectedField.id,
                  specializationId: selectedSpecialization.id,
                  semester: navPath.semester,
                });
              }
            }}
            disabled={!navPath.semester}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 4
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : selectedResourceType
                ? 'bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer'
                : 'opacity-40 text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            <span>04. Category</span>
            {selectedResourceType && (
              <span className="font-semibold opacity-90 truncate max-w-[110px]">
                ({selectedResourceType.label})
              </span>
            )}
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 shrink-0" />

          {/* Step 5: Subject */}
          <button
            onClick={() => {
              if (selectedField && selectedSpecialization && navPath.semester && navPath.resourceType) {
                navigateTo({
                  fieldId: selectedField.id,
                  specializationId: selectedSpecialization.id,
                  semester: navPath.semester,
                  resourceType: navPath.resourceType,
                });
              }
            }}
            disabled={!navPath.resourceType}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 5
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : selectedSubject
                ? 'bg-[var(--surface-alt)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)] cursor-pointer'
                : 'opacity-40 text-[var(--text-muted)] cursor-not-allowed'
            }`}
          >
            <span>05. Subject</span>
            {selectedSubject && (
              <span className="font-semibold opacity-90 truncate max-w-[110px]">
                ({selectedSubject.code})
              </span>
            )}
          </button>

          {currentStep === 6 && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60 shrink-0" />
              <span className="px-3 py-1.5 rounded-xl font-bold bg-[var(--primary)] text-white shadow-xs shrink-0">
                06. Files ({subjectFiles.length})
              </span>
            </>
          )}

          {/* Reset / Return to start button */}
          {currentStep > 1 && (
            <button
              onClick={() => navigateTo({})}
              title="Return to field selection"
              className="ml-auto px-2.5 py-1 text-xs bg-[var(--surface-alt)] hover:border-[var(--primary)] border border-[var(--border)] rounded-lg font-semibold flex items-center gap-1 cursor-pointer shrink-0 text-[var(--text)]"
            >
              <RotateCcw className="w-3 h-3 text-[var(--primary)]" />
              <span>Start over</span>
            </button>
          )}
        </div>
      </nav>

      {/* =========================================================================
          STEP 1: FIELD SELECTION
          ========================================================================= */}
      {currentStep === 1 && (
        <section className="space-y-6 step-transition">
          
          {/* "Continue where you left off" Card */}
          {lastSavedPath && (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-nav">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 text-[var(--color-accent)]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)]">
                      Recent Workspace
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">• Continue where you left off</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--color-text)] mt-0.5">
                    {lastSavedPath.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Jump right back to your last browsed curriculum assets
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateTo(lastSavedPath.path)}
                className="px-4 py-2 rounded-xl text-xs font-bold btn-accent transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Resume Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Step 1 of 6
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text)] mt-0.5">
                Select Your Academic Field
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs text-[var(--color-text-muted)]">
              4 University Disciplines
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {NAVIGATION_CONFIG.map(field => {
              const fileCount = countFilesForPath(resources, { fieldId: field.id });
              return (
                <div
                  key={field.id}
                  onClick={() => handleSelectField(field)}
                  className="card-nav p-5 cursor-pointer flex flex-col justify-between group min-h-[180px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {renderFieldIcon(field.icon)}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--link)] border border-[var(--color-border)]">
                        {field.specializations.length} {field.specializations.length === 1 ? 'Spec' : 'Specs'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                      {field.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-[var(--color-text-muted)] mt-0.5">
                      {field.shortName}
                    </p>

                    <p className="text-xs text-[var(--color-text-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {field.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-text)]">
                      {fileCount > 0 ? `${fileCount} files` : 'Curriculum ready'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          STEP 2: DEGREE PROGRAM / SPECIALIZATION SELECTION
          ========================================================================= */}
      {currentStep === 2 && selectedField && (
        <section className="space-y-6 step-transition">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Step 2 of 6 • {selectedField.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text)] mt-0.5">
                Choose Degree Program
              </h2>
            </div>

            <button
              onClick={handleStepBack}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              ← Back to Fields
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {selectedField.specializations.map(spec => {
              const fileCount = countFilesForPath(resources, {
                fieldId: selectedField.id,
                specializationId: spec.id,
              });

              return (
                <div
                  key={spec.id}
                  onClick={() => handleSelectSpecialization(spec)}
                  className="card-nav p-5 cursor-pointer flex flex-col justify-between group min-h-[170px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {renderSpecIcon(spec.icon)}
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)]">
                        {spec.shortName}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                      {spec.name}
                    </h3>

                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-text)]">
                      {spec.totalSemesters || 8} Semesters • {fileCount > 0 ? `${fileCount} files` : 'Syllabus ready'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                      Select
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          STEP 3: SEMESTER SELECTION (NEW STEP)
          ========================================================================= */}
      {currentStep === 3 && selectedField && selectedSpecialization && (
        <section className="space-y-6 step-transition">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Step 3 of 6 • {selectedSpecialization.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text)] mt-0.5">
                Choose Academic Semester
              </h2>
            </div>

            <button
              onClick={handleStepBack}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              ← Back to {selectedField.specializations.length === 1 ? 'Fields' : 'Degree Programs'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4.5">
            {Array.from({ length: selectedSpecialization.totalSemesters || 8 }, (_, i) => i + 1).map(semNum => {
              const fileCount = countFilesForPath(resources, {
                fieldId: selectedField.id,
                specializationId: selectedSpecialization.id,
                semester: semNum,
              });

              const semesterSubjects = selectedSpecialization.subjects.filter(s => s.semester === semNum);
              const academicTag = getSemesterAcademicTag(semNum);

              return (
                <div
                  key={semNum}
                  onClick={() => handleSelectSemester(semNum)}
                  className="card-nav p-5 cursor-pointer flex flex-col justify-between group min-h-[170px] hover:border-[var(--color-primary)] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-[var(--color-primary)] font-extrabold text-sm font-mono">
                        S{semNum}
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--color-accent-text)] border border-[var(--color-border)]">
                        {academicTag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                      Semester {semNum}
                    </h3>

                    <p className="text-xs text-[var(--color-text-muted)] mt-1 font-medium">
                      {semesterSubjects.length} {semesterSubjects.length === 1 ? 'Subject' : 'Subjects'} in curriculum
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-text)]">
                      {fileCount > 0 ? `${fileCount} ${fileCount === 1 ? 'file' : 'files'}` : 'Curriculum ready'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                      Select
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          STEP 4: RESOURCE CATEGORY SELECTION
          ========================================================================= */}
      {currentStep === 4 && selectedField && selectedSpecialization && navPath.semester && (
        <section className="space-y-6 step-transition">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Step 4 of 6 • {selectedSpecialization.name} • Semester {navPath.semester}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text)] mt-0.5">
                Choose Resource Category
              </h2>
            </div>

            <button
              onClick={handleStepBack}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              ← Back to Semesters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {RESOURCE_TYPES.map(type => {
              const fileCount = countFilesForPath(resources, {
                fieldId: selectedField.id,
                specializationId: selectedSpecialization.id,
                semester: navPath.semester,
                resourceType: type.id,
              });

              return (
                <div
                  key={type.id}
                  onClick={() => handleSelectResourceType(type.id)}
                  className="card-nav p-5 cursor-pointer flex flex-col justify-between group min-h-[170px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {renderTypeIcon(type.id)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--link)] border border-[var(--color-border)]">
                        Curriculum
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                      {type.label}
                    </h3>

                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="font-semibold text-[var(--color-text)]">
                      {fileCount > 0 ? `${fileCount} ${fileCount === 1 ? 'file' : 'files'}` : 'Cataloged'}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                      Select
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          STEP 5: SUBJECT SELECTION (Filtered by Specialization & Semester)
          ========================================================================= */}
      {currentStep === 5 && selectedField && selectedSpecialization && navPath.semester && navPath.resourceType && (
        <section className="space-y-6 step-transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                Step 5 of 6 • {selectedResourceType?.label} • Semester {navPath.semester}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text)] mt-0.5">
                Select Course Subject
              </h2>
            </div>

            <button
              onClick={handleStepBack}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              ← Back to Categories
            </button>
          </div>

          {/* Inline Quick Semester Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[var(--color-text-muted)] mr-1 shrink-0 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[var(--color-primary)]" />
              Switch Semester:
            </span>
            {Array.from({ length: selectedSpecialization.totalSemesters || 8 }, (_, i) => i + 1).map(semNum => (
              <button
                key={semNum}
                onClick={() => handleSelectSemester(semNum)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  navPath.semester === semNum
                    ? 'btn-primary shadow-xs'
                    : 'btn-secondary text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                Sem {semNum}
              </button>
            ))}
          </div>

          {/* Subjects Grid */}
          {(() => {
            const semesterSubjects = selectedSpecialization.subjects.filter(s => s.semester === navPath.semester);

            if (semesterSubjects.length === 0) {
              return (
                <div className="bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-xs text-[var(--color-text-muted)] space-y-3">
                  <BookOpen className="w-10 h-10 text-[var(--color-text-muted)] opacity-50 mx-auto" />
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    No subjects cataloged for Semester {navPath.semester} yet.
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
                    Request syllabus and notes addition from your department coordinator.
                  </p>
                  <button
                    onClick={() => setRequestModal({ isOpen: true })}
                    className="text-[var(--link)] font-bold hover:underline block mx-auto text-xs cursor-pointer"
                  >
                    + Request Curriculum Addition
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {semesterSubjects.map(subject => {
                  const fileCount = countFilesForPath(resources, {
                    fieldId: selectedField.id,
                    specializationId: selectedSpecialization.id,
                    semester: navPath.semester,
                    resourceType: navPath.resourceType,
                    subjectId: subject.id,
                  });

                  return (
                    <div
                      key={subject.id}
                      onClick={() => handleSelectSubject(subject)}
                      className="card-nav p-5 cursor-pointer flex flex-col justify-between group min-h-[180px]"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="font-mono text-xs font-bold text-[var(--color-text)] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                            {subject.code}
                          </span>
                          {subject.credits && (
                            <span className="text-[11px] font-semibold text-[var(--link)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                              {subject.credits} Credits
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                          {subject.name}
                        </h3>

                        <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                          {subject.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                        <span className="font-semibold text-[var(--color-text)]">
                          {fileCount > 0 ? `${fileCount} ${fileCount === 1 ? 'file' : 'files'}` : 'Cataloged'}
                        </span>
                        <span className="inline-flex items-center gap-1 font-bold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                          Open Repository
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </section>
      )}

      {/* =========================================================================
          STEP 6: FILES LIST (FINAL STEP)
          ========================================================================= */}
      {currentStep === 6 && selectedField && selectedSpecialization && selectedSubject && (
        <section className="space-y-6 step-transition">
          
          {/* Subject Overview Banner */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-[var(--color-text)] px-2.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                  {selectedSubject.code}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">•</span>
                <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                  {selectedSpecialization.name}
                </span>
                {navPath.semester && (
                  <>
                    <span className="text-xs text-[var(--color-text-muted)]">•</span>
                    <span className="text-xs font-bold text-[var(--color-accent-text)] bg-[var(--tint)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                      Semester {navPath.semester}
                    </span>
                  </>
                )}
                {selectedSubject.credits && (
                  <>
                    <span className="text-xs text-[var(--color-text-muted)]">•</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-medium">
                      {selectedSubject.credits} Credits
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
                {selectedSubject.name}
              </h1>

              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
                {selectedSubject.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setAuthModalOpen(true);
                  } else {
                    setStudentUploadModal({
                      isOpen: true,
                      defaultCourseId: selectedSpecialization.id,
                      defaultSubjectId: selectedSubject.id,
                      defaultSemester: navPath.semester || selectedSubject.semester,
                      defaultType: fileTypeFilter !== 'all' ? fileTypeFilter : 'notes'
                    });
                  }
                }}
                className="px-3.5 py-2 rounded-xl btn-secondary text-xs font-bold text-[var(--link)] hover:border-[var(--link)] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 text-center"
              >
                <Upload className="w-3.5 h-3.5 text-[var(--link)]" />
                <span>Upload Material</span>
              </button>

              <button
                onClick={() => setRequestModal({ isOpen: true, defaultSubjectId: selectedSubject.id })}
                className="px-3.5 py-2 rounded-xl btn-secondary text-xs font-bold text-[var(--link)] hover:border-[var(--link)] transition-all cursor-pointer shadow-xs text-center"
              >
                + Request Missing Material
              </button>

              <button
                onClick={handleStepBack}
                className="px-3.5 py-2 rounded-xl btn-secondary text-xs font-semibold cursor-pointer text-center"
              >
                ← Back to Subjects
              </button>
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Resource Type Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setFileTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  fileTypeFilter === 'all'
                    ? 'btn-primary shadow-xs'
                    : 'btn-secondary'
                }`}
              >
                All Materials
              </button>

              {RESOURCE_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFileTypeFilter(type.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    fileTypeFilter === type.id
                      ? 'btn-primary shadow-xs'
                      : 'btn-secondary'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search & Sort inside Subject Files */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={fileSearchQuery}
                  onChange={e => setFileSearchQuery(e.target.value)}
                  placeholder="Search in files..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] w-full"
                />
              </div>

              <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] font-semibold shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={fileSortBy}
                  onChange={e => setFileSortBy(e.target.value as 'downloads' | 'date' | 'title')}
                  className="bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] rounded-xl px-2.5 py-1.5 text-xs focus:outline-none"
                  aria-label="Sort resources"
                >
                  <option value="downloads">Most Downloaded</option>
                  <option value="date">Newest Uploads</option>
                  <option value="title">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Files List */}
          {subjectFiles.length === 0 ? (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-xs text-[var(--color-text-muted)] space-y-3">
              <AlertCircle className="w-10 h-10 text-[var(--color-text-muted)] opacity-50 mx-auto" />
              <p className="text-sm font-semibold text-[var(--color-text)]">
                No files found for this section.
              </p>
              <p className="text-xs text-[var(--color-text-muted)] max-w-sm mx-auto">
                Be the first to request verified notes or upload faculty approved material.
              </p>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => setRequestModal({ isOpen: true, defaultSubjectId: selectedSubject.id })}
                  className="text-[var(--link)] font-bold hover:underline text-xs cursor-pointer"
                >
                  Request Material from Department Coordinator
                </button>
                <span className="text-[var(--color-text-muted)] text-xs">•</span>
                <button
                  onClick={() => {
                    if (!currentUser) {
                      setAuthModalOpen(true);
                    } else {
                      setStudentUploadModal({
                        isOpen: true,
                        defaultCourseId: selectedSpecialization.id,
                        defaultSubjectId: selectedSubject.id,
                        defaultSemester: navPath.semester || selectedSubject.semester,
                        defaultType: fileTypeFilter !== 'all' ? fileTypeFilter : 'notes'
                      });
                    }
                  }}
                  className="text-[var(--link)] font-bold hover:underline text-xs cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload Material</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="cs-content-card cs-glass-panel rounded-2xl divide-y divide-[var(--glass-border)] overflow-hidden shadow-xs">
              {subjectFiles.map(resource => {
                const isDownloading = downloadingId === resource.id;
                const bookmarked = isBookmarked(resource.id);

                return (
                  <div
                    key={resource.id}
                    className="cs-file-row p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-white/10 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5">
                        {renderTypeIcon(resource.type)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-1.5 py-0.2 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                            {resource.unitOrTopic}
                          </span>
                          {resource.isVerified && (
                            <span className="text-[10px] text-[var(--sage)] font-semibold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-[var(--sage)]" />
                              Faculty verified
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => setPreviewResource(resource)}
                          title={resource.title}
                          className="text-xs sm:text-sm font-bold text-[var(--color-text)] hover:text-[var(--link)] cursor-pointer truncate mt-1 transition-colors"
                        >
                          {resource.title}
                        </h3>

                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
                          {resource.description}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mt-1 flex-wrap">
                          <span className="font-semibold text-[var(--color-text)]">{resource.fileFormat}</span>
                          <span>•</span>
                          <span>{resource.fileSize}</span>
                          <span>•</span>
                          <span>{resource.pageCount} Pages</span>
                          <span>•</span>
                          <span>{formatDisplayDate(resource.uploadDate)}</span>
                          <span>•</span>
                          <span className="font-semibold text-[var(--color-text)]">
                            {resource.downloadCount.toLocaleString()} downloads
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: View, Download, Save */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Save / Bookmark Button */}
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          bookmarked 
                            ? 'text-[var(--cherry-pink)] bg-[var(--surface-alt)]' 
                            : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-alt)]'
                        }`}
                        title={bookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[var(--cherry-pink)] text-[var(--cherry-pink)]' : ''}`} />
                      </button>

                      {/* View Action */}
                      <button
                        onClick={() => setPreviewResource(resource)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      {/* Download Action */}
                      <button
                        onClick={() => downloadResource(resource.id)}
                        disabled={isDownloading}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                        <span>{isDownloading ? 'Saving...' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 3. How It Works (Screenshot 4) */}
      <HowItWorksSection />

      {/* 3B. "YOUR PRIVATE SHELF" / Backpack Section */}
      <section
        id="cs-backpack-shelf"
        className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden transition-colors"
      >
        {/* Giant outline text watermark "BACKPACK" */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 left-0 select-none pointer-events-none text-7xl sm:text-9xl font-black text-transparent opacity-10 tracking-widest uppercase font-mono"
          style={{ WebkitTextStroke: '1.5px var(--border)' }}
        >
          BACKPACK
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column: Heading & Description */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--cherry-pink)] block">
              YOUR PRIVATE SHELF
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
              Pack the files you want to keep.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed max-w-md pt-1">
              Use Backpack to create folders and upload your own notes, revision guides and study materials alongside the official resources.
            </p>

            <div className="pt-2">
              <button
                onClick={() => goToBookmarks()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface-alt)] hover:border-[var(--primary)] text-[var(--text)] border border-[var(--border)] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Bookmark className="w-3.5 h-3.5 text-[var(--cherry-pink)]" />
                <span>Open my Backpack ({currentUser?.bookmarkedResourceIds?.length || 0} saved)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Deep Tactile Espresso Card with Cherry Pink & Sage Micro-Accents */}
          <div className="bg-[var(--surface-dark)] text-[#F4F0EA] rounded-2xl p-6 shadow-xl border border-[var(--taupe)]/25 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#443B33]">
              <span className="font-bold text-sm tracking-tight text-[#F4F0EA] flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[var(--cherry-pink)]" />
                My Backpack
              </span>
              <button
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else goToBookmarks('new-folder');
                }}
                className="text-xs font-semibold text-[var(--cherry-pink)] hover:opacity-85 transition-opacity cursor-pointer"
              >
                + New folder
              </button>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else goToBookmarks(undefined, 'folder-exam-rev');
                }}
                className="p-3 rounded-xl bg-[#231E19] hover:bg-[#1C1814] border border-[#3E342B] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-[#E8E2D8]">Exam revision notes</span>
                <span className="text-[10px] font-bold text-[var(--cherry-pink)] bg-[var(--cherry-pink)]/15 px-2 py-0.5 rounded border border-[var(--cherry-pink)]/30">
                  PDF
                </span>
              </div>

              <div
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else goToBookmarks(undefined, 'folder-reading-list');
                }}
                className="p-3 rounded-xl bg-[#231E19] hover:bg-[#1C1814] border border-[#3E342B] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-[#E8E2D8]">Week 06 reading list</span>
                <span className="text-[10px] font-bold text-[var(--cherry-pink)] bg-[var(--cherry-pink)]/15 px-2 py-0.5 rounded border border-[var(--cherry-pink)]/30">
                  PDF
                </span>
              </div>

              <div
                onClick={() => {
                  if (!currentUser) setAuthModalOpen(true);
                  else goToBookmarks('upload');
                }}
                className="p-3 rounded-xl bg-[#231E19] hover:bg-[#1C1814] border border-[#3E342B] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-[#E8E2D8]">Upload material</span>
                <span className="text-[10px] font-bold text-[var(--sage)] bg-[var(--sage)]/15 px-2 py-0.5 rounded border border-[var(--sage)]/30">
                  ADD
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3C. Tactile Earthy Taupe Call-to-Action Banner with Strategic Indigo Button */}
      <section className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)] tracking-tight leading-tight max-w-md">
          Put your semester within reach.
        </h2>

        <button
          onClick={() => {
            if (!currentUser) {
              setAuthModalOpen(true);
            } else {
              const el = document.getElementById('cs-academic-explore');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="px-6 py-3 rounded-xl font-bold bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm shadow-xs transition-colors cursor-pointer shrink-0"
        >
          {!currentUser ? 'Open student login' : 'Explore all resources'}
        </button>
      </section>

      {/* 4. Exam Countdown */}
      <ExamCountdownSection />

      {/* 5. Feedback & Suggestions */}
      <FeedbackSection />

    </div>
  );
};
