import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import { useScrollReveal } from './hooks/useScrollReveal'

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center bg-white dark:bg-slate-950 transition-colors duration-200" role="contentinfo">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Prasanna Kumar · Built with React, Vite & Tailwind CSS
      </p>
    </footer>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  // Toggle dark class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Initialise scroll-reveal after mount
  useScrollReveal()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Nav darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
