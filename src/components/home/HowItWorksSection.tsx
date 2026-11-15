import React from 'react';
import { HOME_SECTIONS_CONFIG, HowItWorksStep } from '../../data/homeSectionsConfig';

export const HowItWorksSection: React.FC = () => {
  const steps: HowItWorksStep[] = HOME_SECTIONS_CONFIG.howItWorks;

  return (
    <section
      id="cs-home-how-it-works"
      aria-labelledby="cs-how-it-works-heading"
      className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-8 sm:p-12 shadow-xs transition-colors"
    >
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--cherry-pink)] block mb-2">
          FROM LOGIN TO DOWNLOAD
        </span>
        <h2
          id="cs-how-it-works-heading"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]"
        >
          Your next resource is four steps away.
        </h2>
      </div>

      <div className="pt-6 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map(step => (
          <div key={step.number} className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)] mb-2 font-mono">
              {String(step.number).padStart(2, '0')}
            </span>
            <h3 className="text-base font-bold text-[var(--text)] mb-1.5">
              {step.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
