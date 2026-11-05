import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { createPortal } from 'react-dom'
import { FiArrowDown } from 'react-icons/fi'
import portrait from '../../assets/enzo/enzo-nukui.png'
import { personal } from '../../data/personal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './Hero.module.css'

gsap.registerPlugin(useGSAP)

const introStorageKey = 'enzo-nukui:home-intro:v3'
const marqueeLines: { text: string; direction: 'left' | 'right' }[] = [
  { text: 'SÃO PAULO · BRASIL', direction: 'left' },
  { text: 'ENZO NUKUI', direction: 'right' },
  { text: 'ADS · FIAP', direction: 'left' },
  { text: 'APRENDER · PRATICAR · CONSTRUIR', direction: 'right' },
]

function SaoPauloFlag() {
  return (
    <svg viewBox="0 0 39 26" aria-hidden="true" focusable="false">
      <rect width="39" height="26" fill="#F3F3F1" />
      {[0, 4, 8, 12, 16, 20, 24].map((y) => <rect key={y} y={y} width="39" height="2" fill="#1D1D1B" />)}
      <rect width="14" height="14" fill="#E30613" />
      <circle cx="7" cy="7" r="4.15" fill="#F3F3F1" />
      <path d="M7 3.8 8.1 5.4 8 7.1 9.1 8.1 8.2 9.8 7 10.2 6.4 9 5.4 8.8 5.8 7.2 5.1 6 6.2 5.2Z" fill="#034EA2" />
      <path d="m2.2 2 .65 1.15 1.3.12-.95.9.25 1.3-1.25-.65-1.1.65.2-1.3-.9-.9 1.3-.12Z" fill="#FFD500" />
      <path d="m11.7 2 .65 1.15 1.3.12-.95.9.25 1.3-1.25-.65-1.1.65.2-1.3-.9-.9 1.3-.12Z" fill="#FFD500" />
      <path d="m2.2 10 .65 1.15 1.3.12-.95.9.25 1.3-1.25-.65-1.1.65.2-1.3-.9-.9 1.3-.12Z" fill="#FFD500" />
      <path d="m11.7 10 .65 1.15 1.3.12-.95.9.25 1.3-1.25-.65-1.1.65.2-1.3-.9-.9 1.3-.12Z" fill="#FFD500" />
    </svg>
  )
}

function BrazilFlag() {
  return (
    <svg viewBox="0 0 39 26" aria-hidden="true" focusable="false">
      <rect width="39" height="26" rx="1.5" fill="#009739" />
      <path d="M19.5 2.4 36 13 19.5 23.6 3 13Z" fill="#FFDF00" />
      <circle cx="19.5" cy="13" r="6.15" fill="#002776" />
      <path d="M14 11.3c3.2-1.05 7.4-.95 10.9.35" fill="none" stroke="#fff" strokeWidth=".75" />
      <circle cx="17.3" cy="13.35" r=".42" fill="#fff" />
      <circle cx="19.9" cy="15.15" r=".36" fill="#fff" />
      <circle cx="22.2" cy="12.4" r=".34" fill="#fff" />
    </svg>
  )
}

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(introStorageKey) === 'complete'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(introStorageKey, 'complete')
  } catch {
    // A indisponibilidade do armazenamento não deve impedir a abertura.
  }
}

function buildEvenOddPath(width: number, height: number, openingWidth: number, openingHeight: number) {
  const outer = `M0 0H${width}V${height}H0Z`
  if (!(openingWidth > 0 && openingHeight > 0)) return outer

  const x = (width - openingWidth) * 0.5
  const y = (height - openingHeight) * 0.5
  const inner = `M${x} ${y}H${x + openingWidth}V${y + openingHeight}H${x}Z`
  return `${outer}${inner}`
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const introDebug = new URLSearchParams(window.location.search).get('introDebug') === '1'
  const [portraitLoaded, setPortraitLoaded] = useState(false)
  const [portraitFailed, setPortraitFailed] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(() => document.fonts?.status === 'loaded')
  const [introDone, setIntroDone] = useState(() => !introDebug && (
    hasSeenIntro()
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || (Boolean(window.location.hash) && window.location.hash !== '#inicio')
    || window.scrollY > 24
  ))
  const [debugProgress, setDebugProgress] = useState(0)
  const containerRef = useRef<HTMLElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const maskRef = useRef<SVGPathElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const debugProgressRef = useRef(0)
  const restorePageRef = useRef<(() => void) | null>(null)
  const introTitleRef = useRef<HTMLDivElement>(null)
  const introLeftWordRef = useRef<HTMLSpanElement>(null)
  const introRightWordRef = useRef<HTMLSpanElement>(null)
  const portraitImageRef = useRef<HTMLImageElement>(null)
  const portraitCutoutRef = useRef<HTMLDivElement>(null)
  const toplineRef = useRef<HTMLDivElement>(null)
  const bottomlineRef = useRef<HTMLDivElement>(null)
  const parallaxX = useSpring(useMotionValue(0), { stiffness: 72, damping: 24, mass: 0.7 })
  const parallaxY = useSpring(useMotionValue(0), { stiffness: 72, damping: 24, mass: 0.7 })

  useEffect(() => {
    let active = true
    document.fonts?.ready.then(() => { if (active) setFontsLoaded(true) })
    return () => { active = false }
  }, [])

  const restorePage = () => {
    restorePageRef.current?.()
    restorePageRef.current = null
  }

  const completeIntro = () => {
    const timeline = timelineRef.current
    if (timeline && timeline.progress() < 1) timeline.progress(1).pause()
    restorePage()
    markIntroSeen()
    document.documentElement.removeAttribute('data-home-intro')
    setIntroDone(true)
  }

  useGSAP(() => {
    if (introDone || (reducedMotion && !introDebug) || portraitFailed) {
      document.documentElement.removeAttribute('data-home-intro')
      setIntroDone(true)
      return
    }
    if (!portraitLoaded || !fontsLoaded || !maskRef.current || !svgRef.current) return

    const svg = svgRef.current
    const mask = maskRef.current
    const aperture = { width: 0, height: 0, split: 0 }
    let viewportWidth = window.innerWidth
    let viewportHeight = window.innerHeight
    let initialSplit = 0
    let finalSplit = viewportWidth * 0.7
    let titleScale = 1

    const updateMask = () => {
      mask.setAttribute('d', buildEvenOddPath(
        viewportWidth,
        viewportHeight,
        viewportWidth * aperture.width,
        viewportHeight * aperture.height,
      ))
      const shift = gsap.utils.interpolate(initialSplit, finalSplit, aperture.split) / titleScale
      if (introLeftWordRef.current) gsap.set(introLeftWordRef.current, { x: -shift })
      if (introRightWordRef.current) gsap.set(introRightWordRef.current, { x: shift })
    }

    const updateMeasurements = () => {
      const { width, height } = svg.getBoundingClientRect()
      if (!(width > 0 && height > 0)) return
      viewportWidth = width
      viewportHeight = height
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      const title = introTitleRef.current
      const leftWord = introLeftWordRef.current
      const rightWord = introRightWordRef.current
      if (title && leftWord && rightWord) {
        const titleWidth = Math.max(title.scrollWidth, 1)
        titleScale = Math.min(1, (width - 32) / titleWidth)
        gsap.set(title, { scale: titleScale })
        const existingGap = Number.parseFloat(getComputedStyle(title).gap) * titleScale
        initialSplit = Math.max(0, (width * 0.12 - existingGap) / 2)
        const largestWord = Math.max(leftWord.offsetWidth, rightWord.offsetWidth) * titleScale
        finalSplit = width / 2 + largestWord / 2 + Math.max(24, width * 0.035)
      }
      updateMask()
    }

    const previousOverflow = document.body.style.overflow
    const header = document.querySelector<HTMLElement>('header')
    const previousHeaderInert = header?.inert ?? false
    const bottomline = bottomlineRef.current
    const previousBottomlineInert = bottomline?.inert ?? false
    const otherSections = Array.from(document.querySelectorAll<HTMLElement>('#conteudo > :not(#inicio)'))
    const previousSectionInert = otherSections.map((section) => section.inert)
    document.documentElement.dataset.homeIntro = 'playing'
    document.body.style.overflow = 'hidden'
    if (header) header.inert = true
    if (bottomline) bottomline.inert = true
    otherSections.forEach((section) => { section.inert = true })
    restorePageRef.current = () => {
      document.body.style.overflow = previousOverflow
      if (header) header.inert = previousHeaderInert
      if (bottomline) bottomline.inert = previousBottomlineInert
      otherSections.forEach((section, index) => { section.inert = previousSectionInert[index] })
    }

    updateMeasurements()
    const resizeObserver = new ResizeObserver(updateMeasurements)
    resizeObserver.observe(svg)
    if (introLeftWordRef.current) resizeObserver.observe(introLeftWordRef.current)
    if (introRightWordRef.current) resizeObserver.observe(introRightWordRef.current)

    const timeline = gsap.timeline({
      paused: introDebug,
      defaults: { ease: 'power3.inOut' },
      onUpdate: updateMask,
      onComplete: () => { if (!introDebug) completeIntro() },
    })
    timeline.timeScale(0.68)
    timelineRef.current = timeline

    const nameRows = containerRef.current?.querySelectorAll<HTMLElement>(`.${styles.nameRow}`)
    const revealDetails = [toplineRef.current, bottomlineRef.current].filter((element): element is HTMLDivElement => Boolean(element))
    const letters = document.querySelectorAll<HTMLElement>(`.${styles.introLetter}`)
    gsap.set(nameRows ?? [], { autoAlpha: 0, y: 22, filter: 'blur(7px)' })
    gsap.set(revealDetails, { autoAlpha: 0, y: 14, filter: 'blur(5px)' })
    gsap.set(letters, { autoAlpha: 0, yPercent: 112 })
    if (header) gsap.set(header, { autoAlpha: 0, y: -18 })
    const portraitLayers = [portraitImageRef.current, portraitCutoutRef.current].filter(
      (element): element is HTMLImageElement | HTMLDivElement => Boolean(element),
    )
    gsap.set(portraitLayers, { scale: 1.055, transformOrigin: '50% 78%' })

    timeline.addLabel('identity', 0)
      .to(letters, { autoAlpha: 1, yPercent: 0, duration: 0.58, stagger: 0.032, ease: 'power3.out' }, 'identity')
      .addLabel('separate', 'identity+=0.64')
      .to(aperture, { split: 0.16, duration: 0.62, ease: 'expo.inOut' }, 'separate')
      .to(aperture, { width: 0.12, height: 0.15, duration: 0.34, ease: 'power2.inOut' }, 'separate+=0.31')
      .addLabel('window', 'separate+=0.61')
      .to(aperture, { width: 0.26, height: 0.32, duration: 0.36, ease: 'power2.inOut' }, 'window')
      .addLabel('expand', 'window+=0.24')
      .to(aperture, { width: 1.62, height: 1.62, split: 1, duration: 0.96, ease: 'expo.inOut' }, 'expand')
      .to(introTitleRef.current, { autoAlpha: 0, duration: 0.28, ease: 'power1.out' }, 'expand+=0.02')
      .to(nameRows ?? [], {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.56,
        stagger: 0.055,
        ease: 'power2.out',
      }, 'expand+=0.36')
    if (portraitLayers.length > 0) timeline.to(portraitLayers, { scale: 1, duration: 0.96, ease: 'power2.out' }, 'expand')
    if (toplineRef.current) {
      timeline.to(toplineRef.current, {
        autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.48, ease: 'power2.out',
      }, 'expand+=0.34')
    }
    if (bottomlineRef.current) {
      timeline.to(bottomlineRef.current, {
        autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out',
      }, 'expand+=0.48')
    }
    if (header) timeline.to(header, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 'expand+=0.48')
    if (introDebug) timeline.progress(debugProgressRef.current / 100).pause()

    return () => {
      resizeObserver.disconnect()
      timeline.kill()
      timelineRef.current = null
      restorePage()
      document.documentElement.removeAttribute('data-home-intro')
    }
  }, { scope: containerRef, dependencies: [introDone, portraitLoaded, fontsLoaded, portraitFailed, reducedMotion], revertOnUpdate: true })

  const updateDebugProgress = (value: number) => {
    debugProgressRef.current = value
    setDebugProgress(value)
    timelineRef.current?.progress(value / 100).pause()
  }

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reducedMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    parallaxX.set(gsap.utils.clamp(-9, 9, (event.clientX - bounds.left - bounds.width / 2) * 0.012))
    parallaxY.set(gsap.utils.clamp(-6, 6, (event.clientY - bounds.top - bounds.height / 2) * 0.008))
  }

  return (
    <>
    <section id="inicio" tabIndex={-1} ref={containerRef} className={styles.hero} aria-labelledby="inicio-title" onPointerMove={handlePointerMove} onPointerLeave={() => { parallaxX.set(0); parallaxY.set(0) }}>
      <div ref={toplineRef} className={styles.topline}>
        <p className={styles.eyebrow}>Desenvolvimento de software</p>
        <div className={styles.locationGroup}>
          <p className={styles.location}>São Paulo, Brasil <span aria-hidden="true">·</span> FIAP</p>
          <span className={styles.locationFlags} role="img" aria-label="Bandeiras do Estado de São Paulo e do Brasil">
            <SaoPauloFlag />
            <BrazilFlag />
          </span>
        </div>
      </div>

      <h1 id="inicio-title" className={styles.name} aria-label={personal.name}>
        {marqueeLines.map(({ text, direction }) => (
          <span key={text} className={`${styles.nameRow} ${direction === 'left' ? styles.movesLeft : styles.movesRight}`} aria-hidden="true">
            <span className={styles.marqueeTrack}>
              {[0, 1].map((group) => (
                <span key={group} className={styles.marqueeGroup}>
                  {[0, 1].map((word) => (
                    <span key={word} className={styles.marqueeWord}>
                      {text}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <div className={styles.portraitAnchor}>
        <motion.div className={styles.portrait} style={{ x: parallaxX, y: parallaxY }}>
          <div
            ref={portraitCutoutRef}
            className={styles.portraitCutout}
            style={{ WebkitMaskImage: `url("${portrait}")`, maskImage: `url("${portrait}")` }}
            aria-hidden="true"
          />
          {!portraitFailed && <img ref={portraitImageRef} src={portrait} alt="Enzo Nukui" fetchPriority="high" decoding="async"
            onLoad={() => setPortraitLoaded(true)} onError={() => { setPortraitFailed(true); setIntroDone(true) }} />}
        </motion.div>
      </div>

      <div ref={bottomlineRef} className={styles.bottomline}>
        <p className={styles.introduction}>Curiosidade para aprender.<br />Iniciativa para construir.</p>
        <a className={styles.explore} href="#sobre">Conheça minha trajetória <FiArrowDown aria-hidden="true" /></a>
      </div>

    </section>
    {!introDone && (!reducedMotion || introDebug) && !portraitFailed && createPortal(
      <>
        <svg ref={svgRef} className={styles.introMask} aria-hidden="true" focusable="false" preserveAspectRatio="none"
          viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
          <defs>
            <clipPath id="home-opening" clipPathUnits="userSpaceOnUse">
              <path
                ref={maskRef}
                d={buildEvenOddPath(window.innerWidth, window.innerHeight, 0, 0)}
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </clipPath>
          </defs>
          <rect width="100%" height="100%" fill="var(--color-background)" clipPath="url(#home-opening)" />
        </svg>
        <div ref={introTitleRef} className={styles.introTitle} aria-hidden="true">
          <span ref={introLeftWordRef} className={styles.introWord}>
            {'ENZO'.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} className={styles.introLetterMask}>
                <span className={styles.introLetter}>{letter}</span>
              </span>
            ))}
          </span>
          <span ref={introRightWordRef} className={styles.introWord}>
            {'NUKUI'.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} className={styles.introLetterMask}>
                <span className={styles.introLetter}>{letter}</span>
              </span>
            ))}
          </span>
        </div>
        {!introDebug && <button className={styles.skipIntro} type="button" onClick={completeIntro}>Pular abertura</button>}
        {introDebug && (
          <label className={styles.introDebug}>
            <span>Intro · {debugProgress}%</span>
            <input aria-label="Progresso da introdução" type="range" min="0" max="100" value={debugProgress}
              onChange={(event) => updateDebugProgress(Number(event.currentTarget.value))} />
          </label>
        )}
      </>,
      document.body,
    )}
    </>
  )
}
