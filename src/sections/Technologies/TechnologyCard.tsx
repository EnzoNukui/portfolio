import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { stackProjects, type Technology } from '../../data/technologies'
import styles from './TechnologyCard.module.css'

interface TechnologyCardProps {
  technology: Technology
}

export function TechnologyCard({ technology }: TechnologyCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const scrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)
  const [touchRevealed, setTouchRevealed] = useState(false)
  const [focused, setFocused] = useState(false)
  const revealed = hovered || touchRevealed || focused
  const project = stackProjects.find(({ id }) => id === technology.projectId)
  const Icon = technology.icon

  useEffect(() => {
    const rememberMousePosition = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'mouse') pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    }

    const clearHoverDuringScroll = () => {
      scrollingRef.current = true
      setHovered(false)

      if (scrollTimeoutRef.current !== null) window.clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = window.setTimeout(() => {
        scrollingRef.current = false
        scrollTimeoutRef.current = null
        const pointer = pointerPositionRef.current
        const card = cardRef.current
        if (!pointer || !card) return

        const bounds = card.getBoundingClientRect()
        setHovered(
          pointer.x >= bounds.left
          && pointer.x <= bounds.right
          && pointer.y >= bounds.top
          && pointer.y <= bounds.bottom,
        )
      }, 140)
    }

    window.addEventListener('pointermove', rememberMousePosition, { passive: true })
    window.addEventListener('scroll', clearHoverDuringScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', rememberMousePosition)
      window.removeEventListener('scroll', clearHoverDuringScroll)
      if (scrollTimeoutRef.current !== null) window.clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  const revealWithPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return
    pointerPositionRef.current = { x: event.clientX, y: event.clientY }
    if (!scrollingRef.current) setHovered(true)
  }

  const clearWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
  }

  return (
    <article
      ref={cardRef}
      className={styles.card}
      data-technology={technology.id}
      data-revealed={revealed}
      style={{ '--technology-color': technology.color } as CSSProperties}
      onPointerEnter={revealWithPointer}
      onPointerDown={(event) => { if (event.pointerType === 'touch') setTouchRevealed(true) }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setHovered(false) }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={clearWhenFocusLeaves}
      aria-label={`${technology.name}${project ? `, projeto ${project.name}` : ''}`}
    >
      {project && (
        <div className={styles.revealLayer} aria-hidden={!revealed}>
          <img className={styles.projectImage} src={project.image} alt="" loading="lazy" />
          <div className={styles.imageShade} />
        </div>
      )}

      <div className={styles.baseContent} aria-hidden="true">
        <Icon className={styles.logo} />
      </div>

      <div className={styles.cardTopline}>
        <span className={styles.technologyName}>{technology.name}</span>
      </div>

      {project && (
        <span className={styles.projectDate}>
          {project.completedAt.month}
          <span className={styles.projectDateYear}>{project.completedAt.year}</span>
        </span>
      )}

      {project && (
        <div className={styles.projectDetails}>
          <div>
            <span className={styles.projectLabel}>APLICADA EM</span>
            <p className={styles.projectName}>{project.name}</p>
          <a
            className={styles.portfolioLink}
            href="#projetos"
            onClick={() => window.dispatchEvent(new CustomEvent('portfolio-project-filter', { detail: technology.id }))}
          >
            Ver na seção Projetos <span aria-hidden="true">↓</span>
          </a>
          </div>
          <a className={styles.projectLink} href={project.href} target="_blank" rel="noopener noreferrer">
            Acessar projeto <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}

      <button
        type="button"
        className={styles.revealControl}
        aria-label={`${revealed ? 'Ocultar' : 'Revelar'} captura do projeto associado a ${technology.name}`}
        aria-pressed={revealed}
        onClick={() => setTouchRevealed(true)}
      >
        <span className={styles.srOnly}>{revealed ? 'Ocultar captura' : 'Revelar captura'}</span>
      </button>

      <svg className={styles.cardFrame} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M 9 1 H 91 Q 99 1 99 9 V 87 Q 99 89 97 89 H 64 Q 61 89 59 92 L 56 97 Q 54 99 52 99 H 9 Q 1 99 1 91 V 9 Q 1 1 9 1 Z" />
      </svg>
    </article>
  )
}
