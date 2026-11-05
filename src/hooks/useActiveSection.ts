import { useEffect, useState } from 'react'
import { navigation, type SectionId } from '../data/navigation'

export function useActiveSection() {
  const [position, setPosition] = useState<{ activeId: SectionId; scrolled: boolean }>({
    activeId: 'inicio', scrolled: false,
  })
  useEffect(() => {
    const sections = navigation.map(({ id }) => ({ id, element: document.getElementById(id) }))
    let frame = 0
    const measure = () => {
      frame = 0
      const readingLine = Math.max(220, window.innerHeight * 0.5)
      let activeId: SectionId = 'inicio'
      for (const section of sections) {
        if (section.element && section.element.getBoundingClientRect().top <= readingLine) activeId = section.id
      }
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll > 0 && window.scrollY >= maxScroll - 3) activeId = 'contato'
      const scrolled = window.scrollY > 40
      setPosition((previous) => previous.activeId === activeId && previous.scrolled === scrolled
        ? previous : { activeId, scrolled })
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    const observer = new ResizeObserver(schedule)
    for (const { element } of sections) if (element) observer.observe(element)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [])
  return position
}
