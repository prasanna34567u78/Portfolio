import { useState, useEffect } from 'react'
import { useActiveSection } from '../hooks/useActiveSection'
import { SITE } from '../data/content'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'education', 'contact']

interface NavProps {
  darkMode: boolean
  onToggleDark: () => void
}

export default function Nav({ darkMode, onToggleDark }: NavProps) {
  const active = useActiveSection(SECTION_IDS)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on any scroll
  useEffect(() => {
    const close = () => setMenuOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [])

  return (
    <header
      role="banner"
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm dark:shadow-md dark:shadow-black/20'
          : 'bg-transparent',
      )}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <a
          href="#hero"
          className="text-lg font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          aria-label="Back to top"
        >
          {SITE.name.split(' ')[0]}<span className="text-slate-900 dark:text-white">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ label, href }) => {
            const sectionId = href.replace('#', '')
            const isActive = active === sectionId
            return (
              <li key={label}>
                <a
                  href={href}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Dark/Light toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              /* Sun icon */
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              /* Moon icon */
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Resume download */}
          <a
            href="/resume.pdf"
            download
            className="hidden sm:inline-flex btn-primary text-sm py-1.5 px-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Resume
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-4 pt-2 shadow-lg"
          role="menu"
        >
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label} role="none">
                <a
                  href={href}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li role="none" className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <a href="/resume.pdf" download className="btn-primary text-sm w-full justify-center">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
