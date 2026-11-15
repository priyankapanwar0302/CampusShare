import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, BookOpen, Layers, Users } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  const { resources, subjects, categories, studentsCount } = useApp();

  const filesCount = resources ? resources.length : 0;
  const subjectsCount = subjects ? subjects.length : 0;
  const fieldsCount = categories ? categories.length : 0;
  const students = studentsCount || 0;

  const statItems = [
    {
      id: 'stat-files',
      label: 'Files',
      count: filesCount,
      icon: FileText,
      ariaLabel: `${filesCount.toLocaleString()} verified study files`,
    },
    {
      id: 'stat-subjects',
      label: 'Subjects',
      count: subjectsCount,
      icon: BookOpen,
      ariaLabel: `${subjectsCount.toLocaleString()} academic subjects`,
    },
    {
      id: 'stat-fields',
      label: 'Fields',
      count: fieldsCount,
      icon: Layers,
      ariaLabel: `${fieldsCount.toLocaleString()} study fields`,
    },
    {
      id: 'stat-students',
      label: 'Students',
      count: students,
      icon: Users,
      ariaLabel: `${students.toLocaleString()} enrolled student accounts`,
    },
  ];

  return (
    <section
      id="cs-home-stats-strip"
      aria-label="CampusShare Platform Metrics"
      className="cs-home-stats"
    >
      <h2 className="sr-only">Platform Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statItems.map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              aria-label={item.ariaLabel}
              className="cs-stat-card cs-glass-panel rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--tint)] text-[var(--link)] flex items-center justify-center mb-2.5">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
                {item.count.toLocaleString()}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--text-muted)] mt-0.5">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
