import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const WALLPAPER_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4';

/* ---------------- WordsPullUp ---------------- */
export interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
  style?: React.CSSProperties;
}

export const WordsPullUp: React.FC<WordsPullUpProps> = ({
  text,
  className = '',
  showAsterisk = false,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            animate={isInView || prefersReducedMotion ? { y: 0, opacity: 1 } : {}}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
            }
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : '0.25em' }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
export interface Segment {
  text: string;
  className?: string;
}

export interface WordsPullUpMultiStyleProps {
  segments: Segment[];
  className?: string;
  style?: React.CSSProperties;
}

export const WordsPullUpMultiStyle: React.FC<WordsPullUpMultiStyleProps> = ({
  segments,
  className = '',
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const words: { word: string; className?: string }[] = [];
  segments.forEach(seg => {
    seg.text.split(' ').forEach(w => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={prefersReducedMotion ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          animate={isInView || prefersReducedMotion ? { y: 0, opacity: 1 } : {}}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }
          }
          className={`inline-block ${w.className ?? ''}`}
          style={{ marginRight: '0.25em' }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- PrismaHero (Reference Component with Known Issues Fixed) ---------------- */
const navItems = ['Our story', 'Collective', 'Workshops', 'Programs', 'Inquiries'];

export const PrismaHero: React.FC = () => {
  const [videoAllowed, setVideoAllowed] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Fallback checks: reduced motion & data saver
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nav = typeof navigator !== 'undefined' ? (navigator as unknown as { connection?: { saveData?: boolean } }) : null;
    const isSaveData = nav?.connection?.saveData === true;

    if (prefersReducedMotion || isSaveData) {
      setVideoAllowed(false);
      return;
    }

    // 4-second timeout fallback
    const timer = setTimeout(() => {
      if (!hasStartedRef.current) {
        setVideoAllowed(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-[100svh] w-full relative">
      <div className="relative h-full w-full overflow-hidden rounded-2xl md:rounded-[2rem]">
        {/* Background video with error & fallback handling and vibrancy filter */}
        {videoAllowed && (
          <video
            autoPlay
            loop
            muted
            playsInline
            onPlaying={() => {
              hasStartedRef.current = true;
              setVideoLoaded(true);
            }}
            onError={() => setVideoAllowed(false)}
            style={{
              filter: 'brightness(1.25) saturate(1.35) contrast(1.10)',
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            src={WALLPAPER_VIDEO_URL}
          />
        )}

        {/* Static decorative vibrant glow layer */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 100% 0%, var(--wall-glow-gold) 0%, transparent 60%), radial-gradient(circle at 0% 100%, var(--wall-glow-pink) 0%, transparent 65%)',
            mixBlendMode: 'screen',
          }}
          aria-hidden="true"
        />

        {/* Grain overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay" />

        {/* Uniform scrim & vertical gradient overlays using shared variables */}
        <div className="pointer-events-none absolute inset-0 bg-[var(--wall-scrim)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--wall-grad-top)] via-[var(--wall-grad-mid)] to-[var(--wall-grad-bottom)]" />

        {/* Navbar */}
        <nav className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-b-2xl bg-[var(--wall-ink)] px-4 py-2 sm:gap-6 md:gap-12 md:rounded-b-3xl md:px-8 lg:gap-14">
            {navItems.map(item => (
              <button
                key={item}
                type="button"
                className="text-[10px] sm:text-xs md:text-sm text-[var(--wall-cream-soft)] hover:text-[var(--wall-cream)] focus-visible:text-[var(--wall-cream)] focus-visible:outline-2 focus-visible:outline-[var(--accent)] transition-colors duration-150 cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-2 sm:px-6 md:px-10">
          <div className="grid grid-cols-12 items-end gap-4">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="font-medium text-4xl sm:text-6xl md:text-7xl text-[var(--wall-cream)]">
                <WordsPullUp text="Prisma" showAsterisk />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-5 pb-6 lg:col-span-4 lg:pb-10">
              <p className="text-xs sm:text-sm md:text-base text-[var(--wall-cream-soft)] leading-snug">
                Prisma is a worldwide network of visual artists, filmmakers and storytellers bound not by place, status or labels but by passion and hunger to unlock potential through our unique perspectives.
              </p>

              <button
                type="button"
                className="group inline-flex items-center gap-2 self-start rounded-full bg-[var(--accent)] py-1 pl-5 pr-1 text-sm font-medium text-[var(--on-accent)] transition-all hover:gap-3 sm:text-base cursor-pointer"
              >
                Join the lab
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--wall-ink)] transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                  <ArrowRight className="h-4 w-4 text-[var(--wall-cream)]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
