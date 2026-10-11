import { PROJECTS } from '../data/content'

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-slate-100/70 dark:bg-slate-900/40 transition-colors duration-200" aria-labelledby="proj-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <p className="section-label">Things I've built</p>
          <h2 id="proj-heading" className="section-heading">Projects</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {PROJECTS.map((proj, i) => (
            <article
              key={i}
              className="card flex flex-col gap-4 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 reveal"
              aria-label={proj.title}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div aria-hidden="true" className="mb-3 text-indigo-600 dark:text-indigo-400">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug">{proj.title}</h3>
                </div>
                <a
                  href={proj.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors"
                  aria-label={`GitHub repository for ${proj.title} (placeholder link — update in content.ts)`}
                  title="GitHub — placeholder link"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">{proj.description}</p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* TODO: add verified metric placeholder */}
              <p className="text-[10px] text-slate-500 dark:text-slate-600 italic border-t border-slate-200 dark:border-slate-800 pt-2">
                {/* TODO: add verified metric — e.g. throughput, uptime, latency */}
                Metric placeholder — update when verified numbers are available
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
