import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  X, 
  FileText, 
  HelpCircle, 
  FlaskConical, 
  FolderGit2, 
  ArrowRight, 
  BookOpen, 
  Eye, 
  Download,
  Filter
} from 'lucide-react';
import { Resource, ResourceType } from '../../types';
import { mapLegacyToPath } from '../../data/navigationConfig';

export const SearchModal: React.FC = () => {
  const { 
    searchOpen, 
    setSearchOpen, 
    resources, 
    subjects, 
    courses, 
    goToSubject, 
    goToHome,
    setPreviewResource, 
    downloadResource 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (searchOpen) {
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [searchOpen]);

  // Handle escape & backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setSearchOpen(false);
    }
  };

  // Filtered resources
  const filteredResources = resources.filter(res => {
    if (selectedType !== 'all' && res.type !== selectedType) return false;
    if (selectedCourse !== 'all' && res.courseId !== selectedCourse) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const sub = subjects.find(s => s.id === res.subjectId);
    const crs = courses.find(c => c.id === res.courseId);

    return (
      res.title.toLowerCase().includes(query) ||
      res.unitOrTopic.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query) ||
      res.tags.some(t => t.toLowerCase().includes(query)) ||
      sub?.name.toLowerCase().includes(query) ||
      sub?.code.toLowerCase().includes(query) ||
      crs?.name.toLowerCase().includes(query)
    );
  });

  // Filtered matching subjects for quick navigation
  const matchingSubjects = searchQuery.trim()
    ? subjects.filter(
        s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.shortName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const typeIcon = (type: ResourceType) => {
    switch (type) {
      case 'notes':
        return <FileText className="w-4 h-4 text-[var(--link)]" />;
      case 'importantQuestions':
        return <HelpCircle className="w-4 h-4 text-[var(--accent)]" />;
      case 'labManuals':
        return <FlaskConical className="w-4 h-4 text-[var(--link)]" />;
      case 'projects':
        return <FolderGit2 className="w-4 h-4 text-[var(--accent)]" />;
      case 'syllabus':
        return <BookOpen className="w-4 h-4 text-[var(--link)]" />;
      default:
        return <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />;
    }
  };

  const typeLabel = (type: ResourceType) => {
    switch (type) {
      case 'notes':
        return 'Notes';
      case 'importantQuestions':
        return 'Important questions';
      case 'labManuals':
        return 'Lab manuals';
      case 'projects':
        return 'Projects';
      case 'syllabus':
        return 'Syllabus';
      default:
        return 'Resource';
    }
  };

  if (!searchOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={() => {
        inputRef.current?.blur();
        setSearchOpen(false);
      }}
      aria-labelledby="search-modal-title"
      className="p-0 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl w-full max-w-2xl text-[var(--color-text)] overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-xs m-auto"
    >
      <div className="flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-3">
          <Search className="w-5 h-5 text-[var(--link)] shrink-0" />
          <h2 id="search-modal-title" className="sr-only">Global Resource Search</h2>
          <input
            ref={inputRef}
            type="search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                inputRef.current?.blur();
                setSearchOpen(false);
              }
            }}
            placeholder="Search subjects, notes, important questions..."
            className="flex-1 bg-transparent border-0 text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm sm:text-base focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-md cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-[var(--color-bg)] border-b border-[var(--color-border)] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[var(--color-text-muted)] font-bold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'all'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setSelectedType('notes')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'notes'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setSelectedType('importantQuestions')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'importantQuestions'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            Important questions
          </button>
          <button
            onClick={() => setSelectedType('labManuals')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'labManuals'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            Lab manuals
          </button>
          <button
            onClick={() => setSelectedType('projects')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'projects'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setSelectedType('syllabus')}
            className={`px-2.5 py-1 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
              selectedType === 'syllabus'
                ? 'btn-primary shadow-xs'
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
            }`}
          >
            Syllabus
          </button>

          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="ml-auto bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl px-2.5 py-1 text-xs focus:outline-none"
            aria-label="Filter by department"
          >
            <option value="all">All Departments</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.shortName}
              </option>
            ))}
          </select>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Quick jump to matching subjects */}
          {matchingSubjects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
                Subject Hubs ({matchingSubjects.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchingSubjects.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      const mapped = mapLegacyToPath(undefined, sub.id);
                      window.location.hash = `#/explore/${mapped.fieldId}/${mapped.specializationId}/notes/${mapped.subjectId}`;
                      setSearchOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-bg)] hover:border-[var(--focus)] border border-[var(--color-border)] text-left transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-[var(--link)] bg-[var(--color-surface)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">
                          {sub.code}
                        </span>
                        <p className="text-xs font-semibold text-[var(--color-text)] truncate">
                          {sub.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        {sub.credits} Credits • {sub.facultyCoordinator}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--link)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                Matching PDF Resources ({filteredResources.length})
              </p>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Max 3 clicks to open
              </span>
            </div>

            {filteredResources.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-[var(--color-border)]">
                <FileText className="w-10 h-10 text-[var(--color-text-muted)] opacity-40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-[var(--color-text-muted)]">
                  No results found. Try a different keyword.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredResources.map(res => {
                  const subject = subjects.find(s => s.id === res.subjectId);
                  return (
                    <div
                      key={res.id}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-bg)] border border-[var(--color-border)] transition-all hover:shadow-xs gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5">
                          {typeIcon(res.type)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                              {typeLabel(res.type)}
                            </span>
                            {subject && (
                              <span className="text-[10px] font-medium text-[var(--color-text-muted)]">
                                {subject.code} • {subject.shortName}
                              </span>
                            )}
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              {res.fileSize}
                            </span>
                          </div>

                          <h3 
                            onClick={() => {
                              const mapped = mapLegacyToPath(res.courseId, res.subjectId);
                              window.location.hash = `#/explore/${mapped.fieldId}/${mapped.specializationId}/${res.type}/${res.subjectId}`;
                              setPreviewResource(res);
                              setSearchOpen(false);
                            }}
                            title={res.title}
                            className="text-xs sm:text-sm font-bold text-[var(--color-text)] truncate hover:text-[var(--cherry-pink)] cursor-pointer mt-0.5"
                          >
                            {res.title}
                          </h3>

                          <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                            {res.unitOrTopic}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            const mapped = mapLegacyToPath(res.courseId, res.subjectId);
                            window.location.hash = `#/explore/${mapped.fieldId}/${mapped.specializationId}/${res.type}/${res.subjectId}`;
                            setPreviewResource(res);
                            setSearchOpen(false);
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold btn-secondary transition-colors flex items-center gap-1 cursor-pointer"
                          title="Preview PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        <button
                          onClick={() => {
                            downloadResource(res.id);
                            setSearchOpen(false);
                          }}
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                          title="Download PDF"
                          aria-label="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[var(--bg)] border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono text-[10px] text-[var(--text)]">Enter</kbd> to open</span>
            <span>•</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] font-mono text-[10px] text-[var(--text)]">ESC</kbd> to dismiss</span>
          </div>

          <button
            onClick={() => {
              setSearchOpen(false);
              goToHome();
            }}
            className="font-medium text-[var(--link)] hover:underline cursor-pointer"
          >
            Explore All Courses
          </button>
        </div>
      </div>
    </dialog>
  );
};
