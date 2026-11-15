import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ArrowRight, BookOpen, Layers, UserCheck } from 'lucide-react';

interface CourseViewProps {
  courseId: string;
  initialSemester?: number;
}

export const CourseView: React.FC<CourseViewProps> = ({ courseId, initialSemester = 4 }) => {
  const { categories, courses, subjects, resources, goToHome, goToCategory, goToSubject } = useApp();
  const [selectedSemester, setSelectedSemester] = useState<number>(initialSemester);

  const course = courses.find(c => c.id === courseId);
  const category = categories.find(cat => cat.id === course?.categoryId);

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-text-muted)]">Course curriculum not found.</p>
        <button
          onClick={goToHome}
          className="mt-4 px-4 py-2 rounded-lg btn-secondary text-xs font-semibold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Filter subjects for the selected semester
  const semesterSubjects = subjects.filter(
    s => s.courseId === courseId && s.semester === selectedSemester
  );

  const semestersList = Array.from({ length: course.semestersCount || 8 }, (_, i) => i + 1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-7 animate-in fade-in duration-200">
      
      {/* Step-by-Step Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <button
          onClick={goToHome}
          className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60" />
        {category && category.hasDepartments ? (
          <>
            <button
              onClick={() => goToCategory(category.id)}
              className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
            >
              {category.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60" />
          </>
        ) : category ? (
          <>
            <span className="text-[var(--color-text-muted)]">
              {category.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60" />
          </>
        ) : null}
        <span className="font-semibold text-[var(--color-text)]">
          {course.shortName}
        </span>
      </nav>

      {/* Course Header */}
      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-bold text-[var(--color-text)] px-2.5 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
            {course.code}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            {course.department}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            {course.semestersCount} Semesters
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
          {course.name}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Semester Selector Pills */}
      <div>
        <label className="block text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5">
          Select Semester
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
          {semestersList.map(sem => {
            const isSelected = selectedSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'btn-primary shadow-xs scale-102'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--focus)]'
                }`}
              >
                Semester {sem}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--link)]" />
            Semester {selectedSemester} Subjects ({semesterSubjects.length})
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">Step 3: Choose a subject to view resources</span>
        </div>

        {semesterSubjects.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-xs text-[var(--color-text-muted)]">
            No subjects listed for Semester {selectedSemester} yet. Please check Semester 4 or notify faculty.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {semesterSubjects.map(sub => {
              const subResources = resources.filter(r => r.subjectId === sub.id);
              return (
                <div
                  key={sub.id}
                  onClick={() => goToSubject(sub.id)}
                  className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover-lift cursor-pointer flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-[var(--color-text)] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                        {sub.code}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--link)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full border border-[var(--color-border)]">
                        {sub.credits} Credits
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                      {sub.name}
                    </h3>

                    <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>

                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)]">
                      <UserCheck className="w-3 h-3 text-[var(--color-text-muted)]" />
                      <span className="truncate">Coord: {sub.facultyCoordinator}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span className="font-medium text-[var(--color-text)]">
                      {subResources.length} Materials
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[var(--link)] group-hover:translate-x-1 transition-transform text-xs">
                      Open Hub
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
