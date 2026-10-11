import { EXPERIENCES } from '../data/content'

export default function Experience() {
  return (
    <section id="experience" className="py-24" aria-labelledby="exp-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <p className="section-label">Where I've worked</p>
          <h2 id="exp-heading" className="section-heading">Experience</h2>
        </div>

        {/* Timeline */}
        <ol className="relative mt-12 border-l border-slate-800 ml-4 sm:ml-8" aria-label="Work history">
          {EXPERIENCES.map((exp, i) => (
            <li key={i} className="mb-12 ml-6 sm:ml-10 reveal">
              {/* Timeline dot */}
              <span
                className="absolute -left-3 mt-1.5 w-6 h-6 rounded-full border-2 border-indigo-500 bg-slate-950 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              </span>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                  <p className="text-indigo-400 font-medium">{exp.company}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{exp.domain}</p>
                </div>
                <div className="text-right shrink-0">
                  <time className="text-sm font-mono text-slate-400">{exp.period}</time>
                  <p className="text-xs text-slate-600">{exp.location}</p>
                </div>
              </div>

              {/* Bullets */}
              <ul className="space-y-2 text-sm text-slate-400" role="list">
                {exp.bullets.map((b, j) => {
                  // Filter out comment-only lines (TODO comments become notes)
                  if (b.startsWith('// TODO:')) {
                    return (
                      <li key={j} className="text-xs text-slate-600 italic pl-4 border-l border-slate-800">
                        {/* TODO: add verified metric — fill in when you have numbers */}
                        Metric placeholder — to be filled in
                      </li>
                    )
                  }
                  return (
                    <li key={j} className="flex gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" aria-hidden="true" />
                      {b}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
