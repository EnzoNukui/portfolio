import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowDownRight, FiArrowUpRight, FiGithub } from 'react-icons/fi'
import { projects, type PortfolioProject } from '../../data/projects'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './Projects.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A navegação é editorial: cada tecnologia leva ao projeto onde ela ganha contexto.
const projectStops = [
  { technology: 'Java', technologyId: 'java', projectId: 'soulie' },
  { technology: 'Spring Boot', technologyId: 'spring-boot', projectId: 'payleech' },
  { technology: 'Python', technologyId: 'python', projectId: 'sudoku' },
  { technology: 'React', technologyId: 'react', projectId: 'httpmon' },
  { technology: 'Node.js', technologyId: 'node', projectId: 'locallead' },
] as const

const projectOrder = projectStops.map(({ projectId }) => projects.find((project) => project.id === projectId))
  .filter((project): project is PortfolioProject => Boolean(project))

function projectIndexForTechnology(technologyId: string) {
  const explicitStop = projectStops.find(({ technologyId: id }) => id === technologyId)
  if (explicitStop) return projectOrder.findIndex(({ id }) => id === explicitStop.projectId)

  return projectOrder.findIndex((project) => project.technologies.some(({ id }) => id === technologyId))
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const technologyNavRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const [activeProjectId, setActiveProjectId] = useState(projectOrder[0]?.id ?? '')
  const [mediaIndexes, setMediaIndexes] = useState<Record<string, number>>({})

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const scenes = gsap.utils.toArray<HTMLElement>(`.${styles.projectScene}`, section)
    const intro = section.querySelector<HTMLElement>(`.${styles.intro}`)
    const navigation = section.querySelector<HTMLElement>(`.${styles.technologyNav}`)
    const transitionLine = section.querySelector<HTMLElement>(`.${styles.sectionTransition} i`)

    if (!reducedMotion && transitionLine) {
      gsap.fromTo(transitionLine,
        { scaleX: 0.08 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top 48%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        },
      )
    }

    if (!reducedMotion && intro) {
      gsap.fromTo(intro,
        { y: 42, scale: 0.985, opacity: 0.78, filter: 'blur(4px)' },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: intro,
            start: 'top 94%',
            end: 'top 46%',
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        },
      )
    }

    if (!reducedMotion && navigation) {
      gsap.fromTo(navigation,
        { autoAlpha: 0, x: -18 },
        { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: navigation, start: 'top 88%', once: true } },
      )
    }

    scenes.forEach((scene, sceneIndex) => {
      const projectId = scene.dataset.projectId
      const media = scene.querySelector<HTMLElement>(`.${styles.mediaReveal}`)
      const heading = scene.querySelector<HTMLElement>(`.${styles.projectHeading}`)
      const copy = scene.querySelector<HTMLElement>(`.${styles.projectCopy}`)

      ScrollTrigger.create({
        trigger: scene,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => projectId && setActiveProjectId(projectId),
        onEnterBack: () => projectId && setActiveProjectId(projectId),
        onLeave: () => {
          if (sceneIndex === scenes.length - 1) setActiveProjectId('')
        },
        onLeaveBack: () => {
          if (sceneIndex === 0) setActiveProjectId('')
        },
        onRefresh: (trigger) => {
          if (trigger.isActive && projectId) setActiveProjectId(projectId)
        },
      })

      if (reducedMotion) {
        gsap.set(media, { clearProps: 'all' })
        gsap.set(heading, { clearProps: 'all' })
        gsap.set(copy, { clearProps: 'all' })
        return
      }

      if (heading) {
        gsap.fromTo(heading,
          { y: 18 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top 76%',
              end: 'top 35%',
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (media) {
        gsap.fromTo(media,
          {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            scale: 1.035,
          },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top 82%',
              end: 'top 24%',
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      if (copy) {
        gsap.fromTo(copy,
          { y: 24 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: scene,
              start: 'top 72%',
              end: 'top 28%',
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    })
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  useEffect(() => {
    const section = sectionRef.current
    const layout = section?.querySelector<HTMLElement>(`.${styles.projectLayout}`)
    if (!layout) return

    let frame = 0
    const clearOutsideProjectLayout = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const bounds = layout.getBoundingClientRect()
        const stickyTop = window.matchMedia('(max-width: 720px)').matches ? 120 : 112
        const layoutIsVisible = bounds.bottom > stickyTop && bounds.top < window.innerHeight

        if (!layoutIsVisible) setActiveProjectId('')
      })
    }

    clearOutsideProjectLayout()
    window.addEventListener('scroll', clearOutsideProjectLayout, { passive: true })
    window.addEventListener('resize', clearOutsideProjectLayout)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', clearOutsideProjectLayout)
      window.removeEventListener('resize', clearOutsideProjectLayout)
    }
  }, [])

  useEffect(() => {
    const nav = technologyNavRef.current
    const activeLink = nav?.querySelector<HTMLElement>(`a[aria-current='location']`)
    if (!nav || !activeLink || nav.scrollWidth <= nav.clientWidth + 1) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const linkLeft = linkRect.left - navRect.left + nav.scrollLeft
    const centeredLeft = linkLeft - (nav.clientWidth - activeLink.offsetWidth) / 2
    const maxScroll = nav.scrollWidth - nav.clientWidth

    nav.scrollTo({
      left: Math.max(0, Math.min(centeredLeft, maxScroll)),
      behavior: reducedMotion ? 'instant' : 'smooth',
    })
  }, [activeProjectId, reducedMotion])

  useEffect(() => {
    const onProjectRequest = (event: Event) => {
      const technologyId = (event as CustomEvent<string>).detail
      if (!technologyId) return

      const index = projectIndexForTechnology(technologyId)
      const project = projectOrder[index]
      if (!project) return

      document.getElementById(`projeto-${project.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('portfolio-project-filter', onProjectRequest)
    return () => window.removeEventListener('portfolio-project-filter', onProjectRequest)
  }, [])

  const scrollToFirstProject = () => {
    document.getElementById(`projeto-${projectOrder[0]?.id}`)?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' })
  }

  const activeIndex = projectOrder.findIndex(({ id }) => id === activeProjectId)
  const progressIndex = activeIndex < 0 ? projectOrder.length - 1 : activeIndex

  return (
    <section ref={sectionRef} id="projetos" className={styles.section} aria-labelledby="projetos-title">
      <div className={styles.inner}>
        <div className={styles.sectionTransition} aria-hidden="true">
          <span>FERRAMENTAS</span>
          <i />
          <span>PROJETOS</span>
        </div>
        <div className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>04 / PROJETOS <span>DO CONCEITO À INTERFACE</span></p>
            <h2 id="projetos-title">Ideias em movimento<span>.</span></h2>
          </div>
          <div className={styles.introAside}>
            <p>Uma seleção de problemas que investiguei e experiências que construí pelo caminho.</p>
            <button type="button" className={styles.allProjectsLink} onClick={scrollToFirstProject}>
              Ver todos <FiArrowDownRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.projectLayout}>
          <aside className={styles.technologyNav} aria-label="Explore os projetos por tecnologia">
            <p className={styles.navHeading}>EXPLORAR TECNOLOGIAS</p>
            <nav ref={technologyNavRef}>
              {projectStops.map(({ technology, projectId }) => {
                const project = projectOrder.find(({ id }) => id === projectId)
                if (!project) return null
                const isActive = activeProjectId === projectId

                return (
                  <a
                    key={technology}
                    href={`#projeto-${projectId}`}
                    className={styles.technologyLink}
                    aria-current={isActive ? 'location' : undefined}
                  >
                    <span>{technology}</span>
                  </a>
                )
              })}
            </nav>
            <p className={styles.navHint}>Selecione uma tecnologia para ir ao projeto.</p>
          </aside>

          <div className={styles.projectSequence}>
            {projectOrder.map((project, index) => {
              const mediaIndex = mediaIndexes[project.id] ?? 0
              const media = project.media[mediaIndex] ?? project.media[0]
              const isActive = activeProjectId === project.id

              return (
                <article
                  id={`projeto-${project.id}`}
                  key={project.id}
                  data-project-id={project.id}
                  className={styles.projectScene}
                  aria-labelledby={`project-title-${project.id}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div className={styles.projectHeading}>
                    <p className={styles.projectMeta}><span>{project.category}</span><span>{project.period}</span></p>
                    <h3 id={`project-title-${project.id}`}>{project.name}</h3>
                  </div>

                  <div className={styles.mediaColumn}>
                    <div className={styles.mediaFrame}>
                      <div className={styles.mediaReveal}>
                        <img src={media.src} alt={media.alt} loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
                      </div>
                      <p className={styles.mediaLabel}>{media.label}</p>
                    </div>
                    {project.media.length > 1 && (
                      <div className={styles.mediaGallery}>
                        <div className={styles.mediaGalleryHeader}>
                          <span>TELAS DO PROJETO</span>
                          <span>{String(mediaIndex + 1).padStart(2, '0')} / {String(project.media.length).padStart(2, '0')}</span>
                        </div>
                        <div className={styles.mediaChoices} role="group" aria-label={`Escolha uma tela do projeto ${project.name}`}>
                          {project.media.map((item, itemIndex) => (
                            <button
                              type="button"
                              key={item.src}
                              aria-label={`Mostrar tela: ${item.label}`}
                              aria-pressed={mediaIndex === itemIndex}
                              onClick={() => setMediaIndexes((current) => ({ ...current, [project.id]: itemIndex }))}
                            >
                              <span className={styles.mediaChoiceThumb}>
                                <img src={item.src} alt="" loading="lazy" decoding="async" />
                                <span className={styles.mediaChoiceIndex}>{String(itemIndex + 1).padStart(2, '0')}</span>
                              </span>
                              <span className={styles.mediaChoiceLabel}>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.projectCopy}>
                    <p className={styles.summary}>{project.summary}</p>

                    <div className={styles.projectStory}>
                      <div><h4>O desafio</h4><p>{project.challenge}</p></div>
                      <div><h4>O que construí</h4><p>{project.solution}</p></div>
                    </div>

                    <ul className={styles.highlights} aria-label="Principais entregas">
                      {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>

                    {project.technologies.length > 0 && (
                      <div className={styles.stackBlock}>
                        <h4>TECNOLOGIAS PRINCIPAIS</h4>
                        <ul className={styles.stackList}>
                          {project.technologies.map(({ id, name }) => <li key={id}>{name}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className={styles.projectLinks}>
                      {project.demo && <a className={styles.primaryLink} href={project.demo} target="_blank" rel="noopener noreferrer">Ver projeto <FiArrowUpRight aria-hidden="true" /><span className={styles.srOnly}> abre em nova aba</span></a>}
                      {project.repository && <a className={styles.secondaryLink} href={project.repository} target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" /> Repositório <FiArrowUpRight aria-hidden="true" /><span className={styles.srOnly}> abre em nova aba</span></a>}
                    </div>
                  </div>

                  <span className={styles.sceneProgress} aria-hidden="true">{String(index + 1).padStart(2, '0')} <i /> {String(projectOrder.length).padStart(2, '0')}</span>
                </article>
              )
            })}
          </div>
        </div>

        <p className={styles.scrollNote} aria-live="polite"><span>{String(progressIndex + 1).padStart(2, '0')} / {String(projectOrder.length).padStart(2, '0')}</span> Continue rolando para conhecer os projetos <span aria-hidden="true">↓</span></p>
      </div>
    </section>
  )
}
