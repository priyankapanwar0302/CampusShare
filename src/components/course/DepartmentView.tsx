import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ChevronRight, 
  ArrowRight, 
  Code2, 
  Cog, 
  Cpu, 
  Building2, 
  BookOpen, 
  GraduationCap, 
  Layers 
} from 'lucide-react';

interface DepartmentViewProps {
  categoryId: string;
}

export const DepartmentView: React.FC<DepartmentViewProps> = ({ categoryId }) => {
  const { categories, courses, goToHome, goToCourse } = useApp();

  const category = categories.find(c => c.id === categoryId);
  const deptCourses = courses.filter(c => c.categoryId === categoryId);

  if (!category) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <p className="text-[var(--color-text-muted)]">Academic category not found.</p>
        <button
          onClick={goToHome}
          className="mt-4 px-4 py-2 rounded-lg btn-secondary text-xs font-semibold cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[var(--link)]" />;
      case 'Cog':
        return <Cog className="w-5 h-5 text-[var(--link)]" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-[var(--link)]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[var(--link)]" />;
      default:
        return <Layers className="w-5 h-5 text-[var(--link)]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-7 animate-in fade-in duration-200">
      
      {/* Breadcrumb Navigation: Home > Category */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
        <button
          onClick={goToHome}
          className="hover:text-[var(--link)] font-medium transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] opacity-60" />
        <span className="font-semibold text-[var(--color-text)]">
          {category.name} ({category.shortName})
        </span>
      </nav>

      {/* Category Header */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--link)] border border-[var(--color-border)]">
            {category.badge}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">•</span>
          <span className="text-xs text-[var(--color-text-muted)] font-medium">
            Step 2: Department & Specialization
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--color-text)]">
          {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-2 max-w-2xl leading-relaxed">
          {category.description} Choose your specialized academic branch below to access semester-wise curriculums, faculty notes, solved papers, and lab manuals.
        </p>
      </div>

      {/* Departments Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[var(--link)]" />
            Specialized Departments ({deptCourses.length})
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">Click to explore semesters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deptCourses.map(dept => (
            <div
              key={dept.id}
              onClick={() => goToCourse(dept.id, 4)}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 hover-lift cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getDepartmentIcon(dept.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[var(--color-text)] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                      {dept.code}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] font-medium">
                      {dept.semestersCount} Semesters
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-[var(--color-text)] group-hover:text-[var(--link)] transition-colors">
                  {dept.name}
                </h3>

                <p className="text-xs text-[var(--color-text-muted)] mt-1.5 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                    {dept.totalSubjects} Subjects
                  </span>
                  <span>•</span>
                  <span>{dept.totalResources} Materials</span>
                </div>
                <span className="inline-flex items-center gap-1 font-semibold text-[var(--link)] group-hover:translate-x-1 transition-transform">
                  Explore
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
