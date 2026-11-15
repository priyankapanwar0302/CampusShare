/**
 * Master Content Configuration for CampusShare Home Sections
 * Centralized config object holding all text content for:
 * - How It Works steps
 * - Exam Countdown dates
 * - Footer metadata & links
 */

export interface HowItWorksStep {
  number: number;
  iconName?: 'LogIn' | 'Compass' | 'Download' | 'FileText';
  title: string;
  description: string;
}

export interface ExamCountdownItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD format strictly parsed via [year, month, day]
}

export interface FooterLink {
  label: string;
  href: string;
  title: string;
  content: string;
}

export interface HomeSectionsConfig {
  howItWorks: HowItWorksStep[];
  examCountdown: ExamCountdownItem[];
  footer: {
    brandName: string;
    brandTagline: string;
    description: string;
    madeBy: string;
    links: FooterLink[];
  };
}

export const HOME_SECTIONS_CONFIG: HomeSectionsConfig = {
  howItWorks: [
    {
      number: 1,
      iconName: 'LogIn',
      title: 'Enter your Student ID',
      description: 'Use the account details provided by your college.',
    },
    {
      number: 2,
      iconName: 'Compass',
      title: 'Choose your course',
      description: 'Select your branch and the semester you need.',
    },
    {
      number: 3,
      iconName: 'FileText',
      title: 'Open a section',
      description: 'Move between documents, notes, assignments and materials.',
    },
    {
      number: 4,
      iconName: 'Download',
      title: 'Download your PDF',
      description: 'Save the resource and get back to your work.',
    },
  ],

  examCountdown: [
    {
      id: 'exam-1',
      name: 'Mid-Term Assessment & Viva (sample)',
      date: '2026-11-15',
    },
    {
      id: 'exam-2',
      name: 'End-Semester Theory Examinations (sample)',
      date: '2026-12-08',
    },
  ],

  footer: {
    brandName: 'CampusShare',
    brandTagline: 'Academic Resource Network',
    description: 'An open academic resource-sharing network for college students to exchange verified lecture notes, laboratory manuals, and examination materials.',
    madeBy: 'Made by Team CampusShare for University Students',
    links: [
      {
        label: 'About',
        href: '#about',
        title: 'About CampusShare',
        content: 'CampusShare is an academic collaborative repository engineered to eliminate resource fragmentation across university departments. All course materials are faculty-curated, peer-reviewed, and organized by semester.',
      },
      {
        label: 'Contact',
        href: '#contact',
        title: 'Institutional Contact',
        content: 'For curriculum inquiries, faculty partnerships, or account verification assistance, reach out to your university department coordinator or email support@campusshare.edu.',
      },
      {
        label: 'Terms',
        href: '#terms',
        title: 'Terms of Service',
        content: 'Materials shared on CampusShare are strictly intended for academic non-commercial use by enrolled university students. Redistribution of copyrighted institutional assessments without authorization is prohibited.',
      },
      {
        label: 'Privacy',
        href: '#privacy',
        title: 'Privacy Policy',
        content: 'CampusShare respects student privacy. Student IDs and dates of birth are verified against institutional records with salted cryptographic protection. We do not sell or track personal student activity.',
      },
    ],
  },
};
