import { lazy, Suspense } from 'react'
import { SITE } from '../data/content'

// Avatar is lazy-loaded — never blocks first paint
const Avatar = lazy(() => import('./Avatar'))

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-label="Introduction"
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-4rem)] py-16">
          {/* Text column */}
          <div className="order-2 lg:order-1 animate-fade-in-up">
            <p className="section-label">Hello, I'm</p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4">
              <span className="text-gradient">{SITE.name}</span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-slate-200 mb-2">
              {SITE.headline}
            </p>
            <p className="text-base text-slate-400 mb-8 max-w-lg leading-relaxed">
              {SITE.subheadline}
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <a href="#experience" className="btn-primary">
                View My Work
              </a>
              <a href="/resume.pdf" download className="btn-ghost">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </a>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href={SITE.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="LinkedIn profile"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href={SITE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="GitHub profile"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                aria-label="Send email"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <span className="text-slate-600">·</span>
              <span className="text-sm text-slate-500">{SITE.location}</span>
            </div>
          </div>

          {/* Avatar column */}
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <Suspense
              fallback={
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center animate-pulse">
                  <span className="text-slate-500 text-sm">Loading avatar…</span>
                </div>
              }
            >
              <Avatar />
            </Suspense>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500" aria-hidden="true">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </div>
    </section>
  )
}
