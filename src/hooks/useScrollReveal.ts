import { useEffect } from 'react'

/**
 * Attaches an IntersectionObserver to all `.reveal` elements.
 * When they enter the viewport they get the `.revealed` class.
 * Respects prefers-reduced-motion via CSS (the class still applies,
 * but the animation is disabled in globals.css).
 */
export function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
