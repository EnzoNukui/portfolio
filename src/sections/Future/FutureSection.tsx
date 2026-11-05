import { Fragment, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { futureSection } from '../../data/foundation'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import corinthiansWhite from '../../assets/futuro/simbolo-corinthians-cp.png'
import corinthiansBlue from '../../assets/futuro/simbolo-corinthians-cp-azul.png'
import styles from './FutureSection.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const guidingIdeas = [
  {
    title: 'Curiosidade',
    description: 'Gosto de entender como as coisas funcionam e de aprender algo novo em cada desafio.',
  },
  {
    title: 'Aprendizado',
    description: 'Continuo aprofundando meus conhecimentos enquanto coloco em prática o que estudo.',
  },
  {
    title: 'Construção',
    description: 'Transformo ideias em projetos e sigo construindo minha trajetória em tecnologia.',
  },
]

const nextSteps = [
  {
    title: 'Primeira oportunidade',
    description: 'Quero aprender na prática e contribuir com uma equipe de tecnologia.',
  },
  {
    title: 'Desafios reais',
    description: 'Busco desafios que me ajudem a crescer e a construir soluções melhores.',
  },
  {
    title: 'Crescer em equipe',
    description: 'Quero evoluir compartilhando conhecimento e trabalhando em conjunto.',
  },
]

type SideListProps = {
  className: string
  heading: string
  items: typeof guidingIdeas
  activeIndex: number | null
  onActivate: (index: number | null) => void
}

function SideList({ className, heading, items, activeIndex, onActivate }: SideListProps) {
  return (
    <div className={`${styles.sideList} ${className}`}>
      <div className={styles.sideHeader}>
        <h3 className={styles.sideHeading}>{heading}</h3>
        <span className={styles.interactionHint} aria-hidden="true">
          <span className={styles.desktopHint}>Clique para ver</span>
          <span className={styles.mobileHint}>Toque para ver</span>
        </span>
      </div>
      <div className={styles.itemList}>
        {items.map((item, index) => (
          <div className={styles.itemEntry} key={item.title}>
            <button
              className={`${styles.item} ${index === activeIndex ? styles.itemActive : ''}`}
              type="button"
              data-cursor-label="VER"
              data-cursor-compact
              aria-label={`${item.title}: ${index === activeIndex ? 'ocultar detalhes' : 'ver detalhes'}`}
              aria-pressed={index === activeIndex}
              aria-expanded={index === activeIndex}
              onClick={() => onActivate(index === activeIndex ? null : index)}
            >
              <span>{item.title}</span>
            </button>
            {index === activeIndex && (
              <p className={styles.itemDetail} aria-live="polite" key={item.title}>
                {item.description.split(' ').map((word, wordIndex, words) => (
                  <Fragment key={`${item.title}-${wordIndex}`}>
                    <span
                      className={styles.itemDetailWord}
                      style={{ animationDelay: `${wordIndex * 28}ms` }}
                    >
                      {word}
                    </span>
                    {wordIndex < words.length - 1 ? ' ' : ''}
                  </Fragment>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function FutureSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [activeGuidingIdea, setActiveGuidingIdea] = useState<number | null>(null)
  const [activeNextStep, setActiveNextStep] = useState<number | null>(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return

    const meta = section.querySelector<HTMLElement>(`.${styles.meta}`)
    const headline = section.querySelector<HTMLElement>(`.${styles.headline}`)
    const supporting = section.querySelector<HTMLElement>(`.${styles.supporting}`)
    const emblemArtwork = section.querySelector<HTMLElement>(`.${styles.emblemArtwork}`)
    const headlineLines = section.querySelectorAll<HTMLElement>(`.${styles.headline} span`)
    const sideLists = section.querySelectorAll<HTMLElement>(`.${styles.sideList}`)
    const sideHeadings = section.querySelectorAll<HTMLElement>(`.${styles.sideHeading}`)
    const guidingEntries = section.querySelectorAll<HTMLElement>(`.${styles.guidingList} .${styles.itemEntry}`)
    const nextEntries = section.querySelectorAll<HTMLElement>(`.${styles.nextList} .${styles.itemEntry}`)
    if (!meta || !headline || headlineLines.length === 0 || !supporting || !emblemArtwork || sideLists.length === 0) return

    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 94%',
        end: 'top 8%',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    })

    entrance.fromTo(meta,
      { autoAlpha: 0, y: 22, letterSpacing: '0.3em', clipPath: 'inset(0 100% 0 0)' },
      { autoAlpha: 1, y: 0, letterSpacing: '0.14em', clipPath: 'inset(0 0% 0 0)', duration: 0.3, ease: 'power3.out' },
      0,
    )
    headlineLines.forEach((line, index) => {
      entrance.fromTo(line,
        {
          autoAlpha: 0,
          x: index === 0 ? -120 : 120,
          y: 70,
          rotate: index === 0 ? -3 : 3,
          scale: 0.92,
          clipPath: index === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          clipPath: 'inset(0 0 0 0)',
          duration: 0.58,
          ease: 'power4.out',
        },
        0.12 + index * 0.16,
      )
    })
    entrance.fromTo(supporting,
      { autoAlpha: 0, y: 48, clipPath: 'inset(0 0 100% 0)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.42, ease: 'power3.out' },
      0.42,
    )
    entrance.fromTo(emblemArtwork,
      { autoAlpha: 0, yPercent: 58, scale: 0.66, rotate: -12 },
      { autoAlpha: 0.13, yPercent: 0, scale: 1, rotate: 0, duration: 0.9, ease: 'power3.out' },
      0.08,
    )
    sideHeadings.forEach((heading, index) => {
      entrance.fromTo(heading,
        { autoAlpha: 0, y: 30, clipPath: 'inset(0 0 100% 0)' },
        { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.34, ease: 'power3.out' },
        0.48 + index * 0.06,
      )
    })
    entrance.fromTo(guidingEntries,
      { autoAlpha: 0, x: -120, y: 34, scale: 0.92, clipPath: 'inset(0 100% 0 0)' },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0% 0 0)', duration: 0.46, stagger: 0.11, ease: 'power4.out' },
      0.58,
    )
    entrance.fromTo(nextEntries,
      { autoAlpha: 0, x: 120, y: 34, scale: 0.92, clipPath: 'inset(0 0 0 100%)' },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0 0 0%)', duration: 0.46, stagger: 0.11, ease: 'power4.out' },
      0.66,
    )
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section
      ref={sectionRef}
      id={futureSection.id}
      tabIndex={-1}
      className={styles.section}
      aria-labelledby="futuro-title"
    >
      <div className={styles.stage}>
        <div className={styles.meta}>
          <span>{futureSection.number} / {futureSection.label}</span>
          <span>ENZO NUKUI</span>
        </div>

        <h2 id="futuro-title" className={styles.headline}>
          <span>Ainda tenho muito</span>
          <span>para construir.</span>
        </h2>

        <p className={styles.supporting}>
          Sigo aprendendo, transformando ideias em projetos e me preparando para os próximos desafios em tecnologia.
        </p>

        <div className={styles.emblem} aria-hidden="true">
          <div className={styles.emblemArtwork}>
            <img className={styles.emblemDark} src={corinthiansWhite} alt="" />
            <img className={styles.emblemLight} src={corinthiansBlue} alt="" />
          </div>
        </div>

        <SideList
          className={styles.guidingList}
          heading="O que me guia"
          items={guidingIdeas}
          activeIndex={activeGuidingIdea}
          onActivate={setActiveGuidingIdea}
        />
        <SideList
          className={styles.nextList}
          heading="O que busco"
          items={nextSteps}
          activeIndex={activeNextStep}
          onActivate={setActiveNextStep}
        />
      </div>
    </section>
  )
}
