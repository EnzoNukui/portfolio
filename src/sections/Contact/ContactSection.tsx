import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUp, FiArrowUpRight, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi'
import { personal } from '../../data/personal'
import { socialLinks } from '../../data/socialLinks'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './ContactSection.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type FillDirection = 'left' | 'right' | 'top' | 'bottom'

function getEntryDirection(event: ReactPointerEvent<HTMLAnchorElement>): FillDirection {
  const bounds = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top
  const edges: Array<{ direction: FillDirection; distance: number }> = [
    { direction: 'left', distance: x },
    { direction: 'right', distance: bounds.width - x },
    { direction: 'top', distance: y },
    { direction: 'bottom', distance: bounds.height - y },
  ]
  return edges.reduce((nearest, edge) => edge.distance < nearest.distance ? edge : nearest).direction
}

type DirectionalLinkProps = {
  href: string
  className: string
  label: string
  download?: string
  target?: '_blank'
  rel?: string
  children: ReactNode
}

function DirectionalLink({ href, className, label, download, target, rel, children }: DirectionalLinkProps) {
  const [fillDirection, setFillDirection] = useState<FillDirection>('left')
  const [filled, setFilled] = useState(false)
  const updateDirection = (event: ReactPointerEvent<HTMLAnchorElement>) => setFillDirection(getEntryDirection(event))
  const directionClass = {
    left: styles.fillFromLeft,
    right: styles.fillFromRight,
    top: styles.fillFromTop,
    bottom: styles.fillFromBottom,
  }[fillDirection]

  return (
    <a
      className={`${styles.directionalLink} ${className} ${directionClass} ${filled ? styles.filled : ''}`}
      href={href}
      download={download}
      target={target}
      rel={rel}
      data-cursor-label={label}
      style={{ '--fill-origin': fillDirection } as CSSProperties}
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return
        updateDirection(event)
        setFilled(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return
        updateDirection(event)
        setFilled(false)
      }}
      onFocus={() => setFilled(true)}
      onBlur={() => setFilled(false)}
    >
      <span className={styles.directionFill} aria-hidden="true" />
      <span className={styles.directionalContent}>{children}</span>
    </a>
  )
}

const contactTitleLines = ['VAMOS', 'CONVERSAR?']

function AnimatedTitleLayer({ className }: { className: string }) {
  return (
    <span className={className} aria-hidden="true">
      {contactTitleLines.map((word, lineIndex) => (
        <span className={styles.titleLine} key={word}>
          {Array.from(word).map((letter, letterIndex) => (
            <span
              className={styles.titleLetter}
              key={`${word}-${letterIndex}`}
              style={{ '--letter-index': letterIndex + lineIndex * 5 } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </span>
      ))}
    </span>
  )
}

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return

    const surface = section.querySelector<HTMLElement>(`.${styles.surface}`)
    const meta = section.querySelector<HTMLElement>(`.${styles.meta}`)
    const title = section.querySelector<HTMLElement>(`.${styles.titleLink}`)
    const note = section.querySelector<HTMLElement>(`.${styles.note}`)
    const links = section.querySelectorAll<HTMLElement>(`.${styles.contactAction}`)
    const backToTop = section.querySelector<HTMLElement>(`.${styles.backToTop}`)
    const futureTitle = document.getElementById('futuro-title')
    if (!surface || !meta || !title || !note || links.length === 0 || !backToTop) return

    const reveal = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    })

    reveal.fromTo(surface,
      { clipPath: 'inset(0 50% 0 50% round 34px)' },
      { clipPath: 'inset(0 0% 0 0% round 0px)', duration: 0.62, ease: 'power3.inOut' },
      0,
    )
    if (futureTitle) {
      reveal.to(futureTitle,
        { y: -54, scale: 0.94, autoAlpha: 0.5, duration: 0.48, ease: 'power2.inOut' },
        0,
      )
    }
    reveal.fromTo(meta,
      { y: 18, autoAlpha: 0, clipPath: 'inset(0 100% 0 0)' },
      { y: 0, autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.24, ease: 'power2.out' },
      0.3,
    )
    reveal.fromTo(title,
      { y: 46, autoAlpha: 0, clipPath: 'inset(0 50% 0 50%)', letterSpacing: '-0.02em' },
      { y: 0, autoAlpha: 1, clipPath: 'inset(0 0% 0 0%)', letterSpacing: '-0.085em', duration: 0.52, ease: 'power3.out' },
      0.24,
    )
    reveal.fromTo(note,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.28, ease: 'power2.out' },
      0.55,
    )
    reveal.fromTo(links,
      { y: 44, autoAlpha: 0, scale: 0.96 },
      { y: 0, autoAlpha: 1, scale: 1, duration: 0.38, stagger: 0.09, ease: 'power3.out' },
      0.62,
    )
    reveal.fromTo(backToTop,
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.2, ease: 'power2.out' },
      0.88,
    )
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section
      ref={sectionRef}
      id="contato"
      tabIndex={-1}
      className={styles.section}
      aria-labelledby="contato-title"
    >
      <div className={styles.surface}>
        <div className={styles.meta}>
          <span>08 / Contato</span>
          <span>ENZO NUKUI</span>
        </div>

        <div className={styles.content}>
          <h2 id="contato-title" className={styles.title}>
            <a
              className={styles.titleLink}
              href={`mailto:${socialLinks.email}`}
              aria-label={`Abrir e-mail para ${socialLinks.email}`}
              data-cursor-label="ENVIAR"
            >
              <AnimatedTitleLayer className={styles.titleBase} />
              <AnimatedTitleLayer className={styles.titleReveal} />
            </a>
          </h2>

          <p className={styles.note}>Clique no título para abrir um e-mail.</p>

          <div className={styles.actions}>
            <DirectionalLink
              className={`${styles.contactAction} ${styles.linkedin}`}
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              label="ABRIR"
            >
              <span className={styles.linkedinIcon}><FiLinkedin aria-hidden="true" /></span>
              <span className={styles.linkedinLabel}>Vamos nos conectar.</span>
              <span className={styles.arrowBubble}><FiArrowUpRight aria-hidden="true" /></span>
            </DirectionalLink>

            <div className={styles.secondaryActions}>
              <DirectionalLink
                className={`${styles.contactAction} ${styles.secondaryLink}`}
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                label="ABRIR"
              >
                <FiGithub aria-hidden="true" />
                <span>GitHub</span>
                <FiArrowUpRight className={styles.smallArrow} aria-hidden="true" />
              </DirectionalLink>

              <DirectionalLink
                className={`${styles.contactAction} ${styles.secondaryLink} ${styles.cvLink}`}
                href={personal.cvUrl}
                download={personal.cvFilename}
                label="BAIXAR"
              >
                <span>CV</span>
                <FiDownload aria-hidden="true" />
              </DirectionalLink>
            </div>
          </div>
        </div>

        <a className={styles.backToTop} href="#inicio" aria-label="Voltar ao início">
          <FiArrowUp aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
