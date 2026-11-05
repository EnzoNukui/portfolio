import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { technologies, technologyGroups } from '../../data/technologies'
import { TechnologyCard } from './TechnologyCard'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './Technologies.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type ScrollRevealOptions = {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  start?: string
  duration?: number
  delay?: number
  ease?: gsap.TweenVars['ease']
}

export function Technologies() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return

    const section = sectionRef.current
    const enter = (element: HTMLElement, options: ScrollRevealOptions = {}) => {
      gsap.fromTo(element,
        { autoAlpha: 0, y: 28, filter: 'blur(7px)', ...options.from },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          ...options.to,
          duration: options.duration ?? 0.82,
          delay: options.delay ?? 0,
          ease: options.ease ?? 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: options.start ?? 'top 88%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        },
      )
    }

    const eyebrow = section.querySelector<HTMLElement>(`.${styles.eyebrow}`)
    if (eyebrow) {
      gsap.fromTo(eyebrow,
        { autoAlpha: 0, x: -16, clipPath: 'inset(0 100% 0 0)' },
        {
          autoAlpha: 1,
          x: 0,
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.78,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        },
      )
    }

    const intro = section.querySelector<HTMLElement>(`.${styles.intro}`)
    const introTitle = intro?.querySelector<HTMLElement>('h2')
    const introDescription = intro?.querySelector<HTMLElement>(':scope > p')
    const titleLines = introTitle?.querySelectorAll<HTMLElement>(`.${styles.titleLine} > span`)
    if (titleLines?.length) {
      gsap.fromTo(titleLines,
        { autoAlpha: 0, yPercent: 112, rotateX: 9, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 1.05,
          stagger: 0.13,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        },
      )
    }
    if (introDescription) {
      gsap.fromTo(introDescription,
        { autoAlpha: 0, x: 42, clipPath: 'inset(0 0 0 100%)', filter: 'blur(7px)' },
        {
          autoAlpha: 1,
          x: 0,
          clipPath: 'inset(0 0 0 0%)',
          filter: 'blur(0px)',
          duration: 0.9,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        },
      )
    }

    section.querySelectorAll<HTMLElement>(`.${styles.group}`).forEach((group) => {
      const heading = group.querySelector<HTMLElement>(`.${styles.groupHeading}`)
      if (heading) enter(heading, {
        from: { y: 18, clipPath: 'inset(0 0 100% 0)', filter: 'blur(5px)' },
        to: { clipPath: 'inset(0 0 0% 0)' },
        start: 'top 89%',
        duration: 0.82,
      })

      group.querySelectorAll<HTMLElement>(`[data-technology]`).forEach((card, index) => {
        enter(card, {
          from: { y: 22, scale: 0.985, clipPath: 'inset(0 0 100% 0 round 16px)', filter: 'blur(5px)' },
          to: { clipPath: 'inset(0 0 0% 0 round 16px)' },
          start: 'top 91%',
          duration: 0.78,
          delay: (index % 4) * 0.065,
        })
      })
    })

    const instruction = section.querySelector<HTMLElement>(`.${styles.instruction}`)
    if (instruction) enter(instruction, { from: { y: 18, filter: 'blur(5px)' }, start: 'top 94%', duration: 0.65 })
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section ref={sectionRef} id="tecnologias" tabIndex={-1} className={styles.section} aria-labelledby="tecnologias-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>03 / TECNOLOGIAS <span>CONNECTED STACK</span></p>

        <div className={styles.intro}>
          <h2 id="tecnologias-title">
            <span className={styles.titleLine}><span>Ferramentas</span></span>
            <span className={styles.titleLine}><span>que utilizo.</span></span>
          </h2>
          <p>Da interface aos dados: passe por cada tecnologia e descubra onde ela entra em projetos reais.</p>
        </div>

        <div className={styles.composition}>
          {technologyGroups.map((group) => {
            const groupTechnologies = group.technologies
              .map((id) => technologies.find((technology) => technology.id === id))
              .filter((technology) => technology !== undefined)

            return (
              <section key={group.id} className={styles.group} aria-labelledby={`lane-${group.id}`}>
                <header className={styles.groupHeading}>
                  <div>
                    <span className={styles.groupEyebrow}>{group.eyebrow}</span>
                    <h3 id={`lane-${group.id}`}>{group.label}</h3>
                  </div>
                  <p>{group.description}</p>
                </header>

                <div className={styles.cards}>
                  {groupTechnologies.map((technology) => (
                    <TechnologyCard key={technology.id} technology={technology} />
                  ))}
                </div>
              </section>
            )
          })}
          <p className={styles.instruction}><span aria-hidden="true">↗</span> Passe o cursor, toque ou use Tab para revelar cada projeto.</p>
        </div>
      </div>
    </section>
  )
}
