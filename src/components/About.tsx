import { SUMMARY } from '../data/content'

export default function About() {
  return (
    <section id="about" className="py-24 bg-slate-900/50" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="section-label">Who I am</p>
          <h2 id="about-heading" className="section-heading">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 mt-10">
          {/* Summary */}
          <div className="lg:col-span-3 reveal">
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              {SUMMARY}
            </p>
            <p className="text-slate-400 leading-relaxed">
              I care about systems that are observable, fault-tolerant, and easy for the
              next engineer to reason about. Outside of distributed systems I enjoy
              competitive programming — including finishing{' '}
              <strong className="text-slate-200">All India Rank 2</strong> at IIT Dharwad's
              Algostrike contest — and working through problems on LeetCode.
            </p>
          </div>

          {/* Sidebar stats */}
          <div className="lg:col-span-2 reveal grid grid-cols-2 gap-4 content-start">
            {[
              { label: 'Years of experience', value: '~3' },
              { label: 'Microservices built', value: '10+' },
              { label: 'LeetCode problems', value: '250+' },
              { label: 'HackerRank rating', value: '5 ★' },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="card flex flex-col gap-1 hover:border-indigo-500/50 transition-colors"
              >
                <span className="text-3xl font-bold text-indigo-400">{value}</span>
                <span className="text-xs text-slate-400 leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
