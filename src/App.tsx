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
    <footer className="border-t border-slate-800 py-8 text-center" role="contentinfo">
      <p className="text-xs text-slate-500">
        © {new Date().getFullYear()} Prasanna Kumar · Built with React, Vite & Tailwind CSS
      </p>
    </footer>
  )
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  // Apply dark/light class to <body>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    document.body.classList.toggle('light', !darkMode)
  }, [darkMode])

  // Initialise scroll-reveal after mount
  useScrollReveal()

  return (
    <div className="min-h-screen">
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
