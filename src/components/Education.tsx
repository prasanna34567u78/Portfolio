import { EDUCATION, ACHIEVEMENTS } from '../data/content'

export default function Education() {
  return (
    <section id="education" className="py-24 bg-slate-100/70 dark:bg-slate-900/40 transition-colors duration-200" aria-labelledby="edu-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal">
          <p className="section-label">Background</p>
          <h2 id="edu-heading" className="section-heading">Education & Achievements</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mt-12">
          {/* Education */}
          <div className="reveal">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
              Education
            </h3>
            {EDUCATION.map((edu, i) => (
              <div key={i} className="card hover:border-indigo-500/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className="mt-1 w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{edu.degree}</h4>
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-0.5 font-medium">{edu.institution}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{edu.affiliation}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{edu.period}</span>
                      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-500/20">
                        CGPA {edu.cgpa}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="reveal">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
              Achievements
            </h3>
            <ul className="space-y-4" role="list">
              {ACHIEVEMENTS.map((achievement, i) => (
                <li key={i} className="card flex items-start gap-4 hover:border-indigo-500/50 transition-colors">
                  <div
                    className="mt-0.5 w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">{achievement}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
