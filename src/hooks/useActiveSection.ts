import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in the viewport.
 * Returns the id string of the active section.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [sectionIds])

  return active
}
