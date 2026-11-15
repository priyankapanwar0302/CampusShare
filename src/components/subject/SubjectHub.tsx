import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceType, Resource, formatDisplayDate } from '../../types';
import { 
  ChevronRight, 
  FileText, 
  Download, 
  Eye, 
  Bookmark, 
  CheckCircle2, 
  Plus, 
  HelpCircle,
  Search,
  BookOpen,
  Sparkles,
  Layers
} from 'lucide-react';

interface SubjectHubProps {
  subjectId: string;
  initialTab?: ResourceType;
}

export const SubjectHub: React.FC<SubjectHubProps> = ({ subjectId, initialTab = 'notes' }) => {
  const { 
    categories,
    subjects, 
    courses, 
    resources, 
    goToHome, 
    goToCategory,
    goToCourse, 
    setPreviewResource, 
    downloadResource, 
    downloadingId,
    isBookmarked, 
    toggleBookmark,
    setRequestModal 
  } = useApp();

  const [activeTab, setActiveTab] = useState<ResourceType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const subject = subjects.find(s => s.id === subjectId);
  const course = courses.find(c => c.id === subject?.courseId);
  const category = categories.find(cat => cat.id === course?.categoryId);

  // Filter resources for this subject & active tab
  const tabResources = useMemo(() => {
    return resources.filter(
      r => r.subjectId === subjectId && r.type === activeTab
    );
  }, [resources, subjectId, activeTab]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      notes: resources.filter(r => r.subjectId === subjectId && r.type === 'notes').length,
      importantQuestions: resources.filter(r => r.subjectId === subjectId && r.type === 'importantQuestions').length,
      labManuals: resources.filter(r => r.subjectId === subjectId && r.type === 'labManuals').length,
      projects: resources.filter(r => r.subjectId === subjectId && r.type === 'projects').length,
      syllabus: resources.filter(r => r.subjectId === subjectId && r.type === 'syllabus').length,
    };
  }, [resources, subjectId]);

  // Search filter
  const filteredResources = useMemo(() => {
    if (!searchQuery.trim()) return tabResources;
    const q = searchQuery.toLowerCase();
    return tabResources.filter(
      r =>
        r.title.toLowerCase().includes(q) ||
        r.unitOrTopic.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [tabResources, searchQuery]);

  if (!subject || !course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-text-muted)]">Subject hub not found.</p>
        <button
          onClick={goToHome}
          className="mt-4 px-4 py-2 rounded-lg btn-secondary text-xs font-semibold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const tabs: Array<{ key: ResourceType; label: string }> = [
    { key: 'notes', label: 'Notes' },
    { key: 'importantQuestions', label: 'Important questions' },
    { key: 'labManuals', label: 'Lab manuals' },
    { key: 'projects', label: 'Projects' },
    { key: 'syllabus', label: 'Syllabus' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-7 animate-in fade-in duration-200">
      
      {/* Step 4 Hierarchical Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] flex-wrap">
        <button
          onClick={goToHome}
          className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60 shrink-0" />

        {category && category.hasDepartments ? (
          <>
            <button
              onClick={() => goToCategory(category.id)}
              className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
            >
              {category.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60 shrink-0" />
          </>
        ) : category ? (
          <>
            <span className="text-[var(--color-text-muted)]">
              {category.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60 shrink-0" />
          </>
        ) : null}

        <button
          onClick={() => goToCourse(course.id, subject.semester)}
          className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
        >
          {course.shortName} (Sem {subject.semester})
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60 shrink-0" />

        <span className="font-semibold text-[var(--color-text)]">
          {subject.name}
        </span>
      </nav>

      {/* Subject Header */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-[var(--color-text)] px-2.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
              {subject.code}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">•</span>
            <span className="text-xs font-semibold text-[var(--link)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
              {subject.credits} Credits
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">•</span>
            <span className="text-xs text-[var(--color-text-muted)] font-medium">
              Faculty Coord: {subject.facultyCoordinator}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
            {subject.name}
          </h1>

          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
            {subject.description}
          </p>
        </div>

        <button
          onClick={() => setRequestModal({ isOpen: true, defaultSubjectId: subject.id, defaultType: activeTab })}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl border border-[var(--color-border)] hover:border-[var(--focus)] bg-[var(--color-surface)] text-xs font-bold text-[var(--link)] transition-all shrink-0 cursor-pointer shadow-xs"
        >
          + Request Missing Material
        </button>
      </div>

      {/* 5-Tab Resource Explorer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--color-border)] gap-4">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto pb-0.5">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            const count = counts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 border-b-2 text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[var(--cherry-pink)] text-[var(--cherry-pink)] font-bold'
                    : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-medium'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive 
                    ? 'bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] border border-[var(--cherry-pink-border)]' 
                    : 'bg-[var(--color-bg)] text-[var(--color-text-muted)]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search within Subject Hub */}
        <div className="relative mb-2 shrink-0">
          <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search in this tab..."
            className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] transition-colors w-full sm:w-48"
          />
        </div>
      </div>

      {/* Resource Items */}
      {filteredResources.length === 0 ? (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-xs text-[var(--color-text-muted)] space-y-3">
          <p className="text-sm font-semibold text-[var(--color-text)]">No files in this section yet.</p>
          <button
            onClick={() => setRequestModal({ isOpen: true, defaultSubjectId: subject.id, defaultType: activeTab })}
            className="text-[var(--link)] font-bold hover:underline block mx-auto text-xs cursor-pointer"
          >
            Notify Faculty Coordinator & Request Upload
          </button>
        </div>
      ) : (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden shadow-xs">
          {filteredResources.map(resource => {
            const isDownloading = downloadingId === resource.id;
            const bookmarked = isBookmarked(resource.id);

            return (
              <div
                key={resource.id}
                className="p-4 sm:px-5 flex items-center justify-between gap-4 hover:bg-[var(--color-bg)] transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-0.5 text-[var(--link)]">
                    <FileText className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] px-1.5 py-0.2 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                        {resource.unitOrTopic}
                      </span>
                      {resource.isVerified && (
                        <span className="text-[10px] text-[var(--link)] font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Admin uploaded
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

                    <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mt-1">
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

                {/* Quick View, Download & Bookmark */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      bookmarked 
                        ? 'text-[var(--accent)] bg-[var(--tint)]' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                    }`}
                    title={bookmarked ? 'Saved to bookmarks' : 'Save bookmark'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
                  </button>

                  <button
                    onClick={() => setPreviewResource(resource)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() => downloadResource(resource.id)}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
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

    </div>
  );
};
