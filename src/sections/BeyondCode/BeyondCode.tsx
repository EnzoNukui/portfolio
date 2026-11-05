import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import firstWork from '../../assets/eventos/primeiro-trabalho/primeiro-trabalho-01.jpg'
import firstWorkTeam from '../../assets/eventos/primeiro-trabalho/primeiro-trabalho-02.jpg'
import hackathonOne from '../../assets/eventos/google-hackathon/google-hackathon-01.jpg'
import hackathonTwo from '../../assets/eventos/google-hackathon/google-hackathon-02.jpg'
import hackathonThree from '../../assets/eventos/google-hackathon/google-hackathon-03.jpg'
import summitGroup from '../../assets/eventos/talent-summit/talent-summit-grupo.jpeg'
import summitRobot from '../../assets/eventos/talent-summit/talent-summit-robo.jpeg'
import summitLembrancinhas from '../../assets/eventos/talent-summit/talent-summit-lembrancinhas.jpeg'
import summitCracha from '../../assets/eventos/talent-summit/talent-summit-cracha.jpeg'
import nextIndividual from '../../assets/eventos/next/next-individual.jpeg'
import nextGroup from '../../assets/eventos/next/next-grupo.jpeg'
import nextStage from '../../assets/eventos/next/next-palco.png'
import nextRobot from '../../assets/eventos/next/next-robo.jpeg'
import nextCar from '../../assets/eventos/next/next-carro.jpeg'
import nextGuanabara from '../../assets/eventos/next/next-guanabara.jpeg'
import styles from './BeyondCode.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type EventPhoto = {
  src: string
  alt: string
  aspectRatio: number
}

type EventChapter = {
  number: string
  title: string
  photos: EventPhoto[]
}

type DragPreview = {
  src: string
  alt: string
  width: number
  height: number
  x: number
  y: number
  offsetX: number
  offsetY: number
}

const eventChapters: EventChapter[] = [
  {
    number: '01',
    title: 'O primeiro trabalho',
    photos: [
      { src: firstWork, alt: 'Enzo e a equipe apresentando o primeiro trabalho na FIAP.', aspectRatio: 1 },
      { src: firstWorkTeam, alt: 'Enzo e colegas ao lado da apresentação do projeto de saúde animal.', aspectRatio: 1 },
    ],
  },
  {
    number: '02',
    title: 'Google Hackathon',
    photos: [
      { src: hackathonOne, alt: 'Enzo com colegas durante o Google Hackathon.', aspectRatio: 0.75 },
      { src: hackathonTwo, alt: 'Participantes acompanham uma apresentação durante o Google Hackathon.', aspectRatio: 0.75 },
      { src: hackathonThree, alt: 'Robô da FIAP em um corredor durante o Google Hackathon.', aspectRatio: 0.814 },
    ],
  },
  {
    number: '03',
    title: 'Talent Summit',
    photos: [
      { src: summitGroup, alt: 'Enzo com participantes no Talent Summit da FIAP.', aspectRatio: 1.333 },
      { src: summitRobot, alt: 'Enzo ao lado de um robô apresentado no Talent Summit.', aspectRatio: 0.75 },
      { src: summitLembrancinhas, alt: 'Lembrancinhas e materiais distribuídos no Talent Summit da FIAP.', aspectRatio: 0.751 },
      { src: summitCracha, alt: 'Crachá de participante do Talent Summit da FIAP.', aspectRatio: 0.75 },
    ],
  },
  {
    number: '04',
    title: 'Fiap Next',
    photos: [
      { src: nextCar, alt: 'Carro exposto durante o FIAP NEXT.', aspectRatio: 0.75 },
      { src: nextStage, alt: 'Palco do evento FIAP NEXT.', aspectRatio: 0.75 },
      { src: nextGroup, alt: 'Grupo de estudantes reunido durante o FIAP NEXT.', aspectRatio: 0.75 },
      { src: nextGuanabara, alt: 'Encontro com convidados durante o FIAP NEXT.', aspectRatio: 0.75 },
      { src: nextIndividual, alt: 'Enzo em um registro individual no FIAP NEXT.', aspectRatio: 0.75 },
      { src: nextRobot, alt: 'Robô em exposição durante o FIAP NEXT.', aspectRatio: 0.75 },
    ],
  },
]

function getFanPosition(index: number, photos: EventPhoto[]) {
  const count = photos.length
  const featuredIndex = Math.floor(count / 2)
  const balancedOffset = index - (count - 1) / 2
  const edgeWidthCorrection = count >= 4
    ? ((photos[0].aspectRatio - photos[count - 1].aspectRatio) * 46) / 4
    : 0

  return {
    featured: count > 2 && index === featuredIndex,
    style: {
      '--fan-x': `${balancedOffset * 13}%`,
      '--fan-center-correction': `${edgeWidthCorrection}svh`,
      '--fan-y': `${Math.abs(balancedOffset) * 2.5}%`,
      '--fan-rotation': `${balancedOffset * 5}deg`,
      '--fan-scale': count === 2 ? 0.94 : index === featuredIndex ? 1 : Math.max(0.78, 1 - Math.abs(balancedOffset) * 0.055),
      '--fan-depth': Math.ceil(count - Math.abs(balancedOffset)),
    } as CSSProperties,
  }
}

export function BeyondCode() {
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [photoOrder, setPhotoOrder] = useState<Record<string, EventPhoto[]>>(() =>
    Object.fromEntries(eventChapters.map((chapter) => [chapter.number, chapter.photos])),
  )
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [dropTargetPhoto, setDropTargetPhoto] = useState<string | null>(null)
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
  const dragPreviewRef = useRef<HTMLElement>(null)
  const dragListenersCleanupRef = useRef<(() => void) | null>(null)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const clearInterruptedDrag = () => {
      dragListenersCleanupRef.current?.()
      dragListenersCleanupRef.current = null
      setDraggedPhoto(null)
      setDropTargetPhoto(null)
      setDragPreview(null)
    }
    const clearWhenHidden = () => {
      if (document.visibilityState === 'hidden') clearInterruptedDrag()
    }

    window.addEventListener('blur', clearInterruptedDrag)
    document.addEventListener('visibilitychange', clearWhenHidden)
    return () => {
      window.removeEventListener('blur', clearInterruptedDrag)
      document.removeEventListener('visibilitychange', clearWhenHidden)
      dragListenersCleanupRef.current?.()
      dragListenersCleanupRef.current = null
    }
  }, [])

  const swapPhotos = (chapterNumber: string, fromSrc: string, toSrc: string) => {
    if (fromSrc === toSrc) return

    const photos = [...photoOrder[chapterNumber]]
    const fromIndex = photos.findIndex((photo) => photo.src === fromSrc)
    const toIndex = photos.findIndex((photo) => photo.src === toSrc)
    if (fromIndex < 0 || toIndex < 0) return

    ;[photos[fromIndex], photos[toIndex]] = [photos[toIndex], photos[fromIndex]]
    setPhotoOrder((current) => ({ ...current, [chapterNumber]: photos }))
    setAnnouncement(`Imagem movida para a posição ${toIndex + 1} de ${photos.length}.`)
  }

  const startPhotoDrag = (event: ReactPointerEvent<HTMLElement>, chapterNumber: string, src: string) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    event.preventDefault()

    const photo = photoOrder[chapterNumber].find((item) => item.src === src)
    if (!photo) return
    const rect = event.currentTarget.getBoundingClientRect()
    const preview = {
      src,
      alt: photo.alt,
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    }

    const drag = { chapterNumber, src, pointerId: event.pointerId, targetSrc: null as string | null }
    setDraggedPhoto(src)
    setDropTargetPhoto(null)
    setDragPreview(preview)

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return
      const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest<HTMLElement>('[data-photo-card]')
      drag.targetSrc = target?.dataset.chapterNumber === chapterNumber ? target.dataset.photoSrc ?? null : null
      setDropTargetPhoto(drag.targetSrc)

      const floatingPhoto = dragPreviewRef.current
      floatingPhoto?.style.setProperty('--drag-x', `${moveEvent.clientX - preview.offsetX}px`)
      floatingPhoto?.style.setProperty('--drag-y', `${moveEvent.clientY - preview.offsetY}px`)
    }

    const finishDrag = (finishEvent: PointerEvent) => {
      if (finishEvent.pointerId !== drag.pointerId) return

      if (finishEvent.type === 'pointerup' && drag.targetSrc) {
        swapPhotos(chapterNumber, src, drag.targetSrc)
      }
      dragListenersCleanupRef.current?.()
      dragListenersCleanupRef.current = null
      setDraggedPhoto(null)
      setDropTargetPhoto(null)
      setDragPreview(null)
    }

    dragListenersCleanupRef.current?.()
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', finishDrag)
    window.addEventListener('pointercancel', finishDrag)
    dragListenersCleanupRef.current = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', finishDrag)
      window.removeEventListener('pointercancel', finishDrag)
    }
  }

  const handlePhotoKeyDown = (event: KeyboardEvent<HTMLElement>, chapterNumber: string, src: string) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()

    const photos = photoOrder[chapterNumber]
    const currentIndex = photos.findIndex((photo) => photo.src === src)
    const nextIndex = Math.max(0, Math.min(photos.length - 1, currentIndex + (event.key === 'ArrowRight' ? 1 : -1)))
    const nextPhoto = photos[nextIndex]
    if (nextPhoto) swapPhotos(chapterNumber, src, nextPhoto.src)
  }

  useGSAP(() => {
    const section = sectionRef.current
    const stack = stackRef.current
    if (!section || reducedMotion) return

    const heading = section.querySelector<HTMLElement>(`.${styles.heading}`)
    const eyebrow = section.querySelector<HTMLElement>(`.${styles.eyebrow}`)
    const title = section.querySelector<HTMLElement>(`#alem-do-codigo-title`)
    const introCopy = section.querySelector<HTMLElement>(`.${styles.introCopy}`)

    if (heading && eyebrow && title && introCopy) {
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: 'top 91%',
          end: 'top 38%',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      entrance
        .fromTo(eyebrow,
          { y: 22, autoAlpha: 0, filter: 'blur(5px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.28, ease: 'none' },
        )
        .fromTo(title,
          { y: 64, scale: 0.965, autoAlpha: 0, filter: 'blur(10px)' },
          { y: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.62, ease: 'none' },
          '-=0.08',
        )
        .fromTo(introCopy,
          { y: 28, autoAlpha: 0, filter: 'blur(5px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.42, ease: 'none' },
          '-=0.2',
        )
    }

    if (!stack) return

    const media = gsap.matchMedia()
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = gsap.utils.toArray<HTMLElement>(`.${styles.eventPanel}`, stack)
      if (panels.length < 2) return

      const getStackHeight = () => stack.getBoundingClientRect().height || window.innerHeight
      const getPreviewHeight = () => Math.min(220, Math.max(160, getStackHeight() * 0.23))
      const getPanelStride = () => getStackHeight() - getPreviewHeight()

      gsap.set(panels, { y: (index) => index * getPanelStride() })
      panels.forEach((panel, index) => {
        panel.toggleAttribute('data-active', index === 0)
        gsap.set(panel, { filter: index === 0 ? 'brightness(1)' : 'brightness(.78)' })
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: 'top top',
          end: () => `+=${getPanelStride() * (panels.length - 1)}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          fastScrollEnd: 1800,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const activeIndex = Math.min(panels.length - 1, Math.floor(self.progress * (panels.length - 1) + 0.5))
            panels.forEach((panel, index) => panel.toggleAttribute('data-active', index === activeIndex))
          },
        },
      })

      panels.slice(0, -1).forEach((panel, index) => {
        timeline
          .to(panel, {
            y: () => -Math.min(72, getPreviewHeight() * 0.28),
            filter: 'brightness(.64)',
            duration: 1,
            ease: 'none',
          }, index)
          .fromTo(panels[index + 1], {
            y: () => getPanelStride(),
            filter: 'brightness(.78)',
          }, {
            y: 0,
            filter: 'brightness(1)',
            duration: 1,
            ease: 'none',
            immediateRender: false,
          }, '<')

        panels.slice(index + 2).forEach((futurePanel, futureIndex) => {
          timeline.to(futurePanel, {
            y: () => (futureIndex + 1) * getPanelStride(),
            filter: 'brightness(.78)',
            duration: 1,
            ease: 'none',
          }, '<')
        })
      })

      return () => timeline.scrollTrigger?.kill()
    })

    media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const revealSelector = [
        `.${styles.panelLabel}`,
        `.${styles.eventCopy} h3`,
        `.${styles.photoCard} img`,
      ].join(', ')
      const targets = Array.from(section.querySelectorAll<HTMLElement>(revealSelector))
      if (!targets.length) return

      targets.forEach((target, index) => {
        target.dataset.mobileReveal = target.matches(`.${styles.photoCard} img`) ? 'photo'
          : target.matches(`.${styles.panelLabel}`) ? 'side'
            : 'rise'
        target.style.setProperty('--mobile-reveal-delay', `${(index % 3) * 55}ms`)
      })

      section.dataset.mobileMotionReady = 'true'
      if (!('IntersectionObserver' in window)) {
        targets.forEach((target) => { target.dataset.mobileRevealed = 'true' })
        return () => { delete section.dataset.mobileMotionReady }
      }

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const target = entry.target as HTMLElement
          target.dataset.mobileRevealed = 'true'
          observer.unobserve(target)
        })
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 })
      targets.forEach((target) => revealObserver.observe(target))

      const fallbackTimer = window.setTimeout(() => {
        targets.forEach((target) => {
          const bounds = target.getBoundingClientRect()
          if (bounds.top < window.innerHeight * 1.15 && bounds.bottom > -24) {
            target.dataset.mobileRevealed = 'true'
            revealObserver.unobserve(target)
          }
        })
      }, 900)

      return () => {
        window.clearTimeout(fallbackTimer)
        revealObserver.disconnect()
        targets.forEach((target) => {
          delete target.dataset.mobileReveal
          delete target.dataset.mobileRevealed
          target.style.removeProperty('--mobile-reveal-delay')
        })
        delete section.dataset.mobileMotionReady
      }
    })

    return () => media.revert()
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section ref={sectionRef} id="alem-do-codigo" tabIndex={-1} className={styles.section} aria-labelledby="alem-do-codigo-title">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span>05</span> / Além do Código</p>
        <div className={styles.headingRow}>
          <h2 id="alem-do-codigo-title">Eventos que marcaram minha <em>trajetória.</em></h2>
          <p className={styles.introCopy}>Apresentações, encontros e desafios que me trouxeram aprendizados importantes e fazem parte da minha história na FIAP.</p>
        </div>
      </header>

      <div ref={stackRef} className={styles.stack} aria-label="Capítulos de experiências acadêmicas">
        {eventChapters.map((chapter) => (
          <section key={chapter.number} className={styles.eventPanel} aria-labelledby={`alem-event-${chapter.number}-title`}>
            <header className={styles.panelHeader}>
              <div className={styles.eventCopy}>
                <p className={styles.panelLabel}>{chapter.number} / 04</p>
                <h3 id={`alem-event-${chapter.number}-title`}>{chapter.title}</h3>
              </div>
            </header>

            <div className={styles.panelBody}>
              <div className={styles.photoFan} role="list" aria-label={`Fotografias: ${chapter.title}`}>
                {photoOrder[chapter.number].map((photo, index) => {
                  const position = getFanPosition(index, photoOrder[chapter.number])
                  const isDragging = draggedPhoto === photo.src
                  const isDropTarget = dropTargetPhoto === photo.src && !isDragging

                  return (
                    <figure
                      key={photo.src}
                      className={`${styles.photoCard} ${chapter.number === '01' ? styles.uniformPhoto : ''} ${position.featured ? styles.featuredCard : ''} ${isDragging ? styles.draggingPhoto : ''} ${isDropTarget ? styles.dropTargetPhoto : ''}`}
                      data-format={photo.aspectRatio > 1 ? 'wide' : 'portrait'}
                      data-photo-card
                      data-chapter-number={chapter.number}
                      data-photo-src={photo.src}
                      tabIndex={0}
                      role="listitem"
                      aria-roledescription="foto reordenável"
                      aria-label={`${photo.alt} Posição ${index + 1} de ${photoOrder[chapter.number].length}. Arraste para trocar de lugar ou use as setas esquerda e direita.`}
                      aria-keyshortcuts="ArrowLeft ArrowRight"
                      data-cursor-native
                      onPointerDown={(event) => startPhotoDrag(event, chapter.number, photo.src)}
                      onKeyDown={(event) => handlePhotoKeyDown(event, chapter.number, photo.src)}
                      style={{ ...position.style, '--photo-ratio': photo.aspectRatio } as CSSProperties}
                    >
                      <img src={photo.src} alt={photo.alt} draggable={false} loading={chapter.number === '01' ? 'eager' : 'lazy'} />
                    </figure>
                  )
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
      {dragPreview && (
        <figure
          ref={dragPreviewRef}
          className={styles.dragPreview}
          aria-hidden="true"
          style={{
            width: dragPreview.width,
            height: dragPreview.height,
            '--drag-x': `${dragPreview.x}px`,
            '--drag-y': `${dragPreview.y}px`,
          } as CSSProperties}
        >
          <img src={dragPreview.src} alt="" draggable={false} />
          <figcaption>{dropTargetPhoto ? 'solte para trocar' : 'arraste até outra imagem'}</figcaption>
        </figure>
      )}
      <span className={styles.visuallyHidden} aria-live="polite" aria-atomic="true">{announcement}</span>
    </section>
  )
}
