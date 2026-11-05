import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FiMenu, FiPlay, FiX } from 'react-icons/fi'
import { navigation, type SectionId } from '../../data/navigation'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { CVButton } from '../CVButton/CVButton'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'
import styles from './Header.module.css'

export function Header() {
  const { activeId, scrolled } = useActiveSection()
  const reducedMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const [spotifyReady, setSpotifyReady] = useState(() => document.documentElement.dataset.spotifyEmbedReady === 'true')
  const [spotifyPlaying, setSpotifyPlaying] = useState(() => document.documentElement.dataset.spotifyIsPlaying === 'true')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pendingSection = useRef<SectionId | null>(null)

  useEffect(() => {
    const onSpotifyReady = () => setSpotifyReady(true)
    const onPlaybackState = (event: Event) => {
      const { isPlaying } = (event as CustomEvent<{ isPlaying: boolean }>).detail
      setSpotifyPlaying(isPlaying)
    }
    window.addEventListener('portfolio:spotify-ready', onSpotifyReady)
    window.addEventListener('portfolio:spotify-playback-state', onPlaybackState)
    return () => {
      window.removeEventListener('portfolio:spotify-ready', onSpotifyReady)
      window.removeEventListener('portfolio:spotify-playback-state', onPlaybackState)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onResize = () => { if (window.innerWidth >= 1100) dialogRef.current?.close() }
    window.addEventListener('resize', onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const openMenu = () => {
    pendingSection.current = null
    setClosing(false)
    dialogRef.current?.showModal()
    setMenuOpen(true)
  }
  const closeMenu = (id?: SectionId) => {
    pendingSection.current = id ?? null
    setClosing(true)
  }
  const onClosed = () => {
    setMenuOpen(false)
    setClosing(false)
    const id = pendingSection.current
    pendingSection.current = null
    if (id) {
      requestAnimationFrame(() => navigateToSection(id))
    } else triggerRef.current?.focus()
  }

  const navigateToSection = (id: SectionId) => {
    const target = document.getElementById(id)
    if (!target) return

    if (id === 'tecnologias') {
      if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
      const destination = target.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: destination, behavior: reducedMotion ? 'auto' : 'smooth' })
      target.focus({ preventScroll: true })
      return
    }

    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    const destination = target.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: destination, behavior: reducedMotion ? 'auto' : 'smooth' })
    target.focus({ preventScroll: true })
  }

  const toggleSpotifyPlaylist = () => {
    window.dispatchEvent(new CustomEvent('portfolio:spotify-toggle', {
      detail: { shouldPlay: !spotifyPlaying },
    }))
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.bar}>
          <div className={styles.capsule}>
            <nav className={styles.desktopNav} aria-label="Navegação principal">
              {navigation.map(({ id, label }) => (
                <a key={id} href={`#${id}`} aria-current={activeId === id ? 'location' : undefined} className={styles.navLink}
                  onClick={(event) => {
                    if (id !== 'tecnologias') return
                    event.preventDefault()
                    navigateToSection(id)
                  }}>
                  {activeId === id && <motion.span className={styles.active}
                    layoutId={reducedMotion ? undefined : 'active-section'}
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                  <span className={styles.label}>{label}</span>
                </a>
              ))}
            </nav>
            <button className={styles.menuTrigger} ref={triggerRef} type="button"
              aria-label="Abrir navegação" aria-haspopup="dialog" aria-expanded={menuOpen}
              aria-controls="menu-mobile" onClick={openMenu}>
              <FiMenu aria-hidden="true" /><span>Menu</span>
            </button>
            <span className={styles.separator} aria-hidden="true" />
            <button className={styles.playButton} type="button" onClick={toggleSpotifyPlaylist}
              aria-label={spotifyPlaying ? 'Pausar playlist do Spotify' : 'Reproduzir playlist do Spotify'}
              title={spotifyPlaying ? 'Pausar playlist do Spotify' : 'Reproduzir playlist do Spotify'} aria-busy={!spotifyReady}>
              <AnimatePresence mode="wait" initial={false}>
                {spotifyPlaying
                  ? <motion.span key="equalizer" className={styles.equalizer} aria-hidden="true"
                    initial={reducedMotion ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -5 }}
                    transition={{ duration: reducedMotion ? 0 : .24, ease: [.22, 1, .36, 1] }}>
                    <span /><span /><span /><span />
                  </motion.span>
                  : <motion.span key="play" className={styles.playIcon} aria-hidden="true"
                    initial={reducedMotion ? false : { opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, x: 5 }}
                    transition={{ duration: reducedMotion ? 0 : .24, ease: [.22, 1, .36, 1] }}>
                    <FiPlay />
                  </motion.span>}
              </AnimatePresence>
            </button>
            <ThemeToggle />
          </div>
          <div className={styles.cvSlot}><CVButton /></div>
        </div>
      </header>
      <dialog id="menu-mobile" className={styles.dialog} ref={dialogRef}
        aria-labelledby="menu-title" onClose={onClosed}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
          }
        }}
        onCancel={(event) => { event.preventDefault(); closeMenu() }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}>
        <motion.div className={styles.menuPanel} initial={false}
          animate={{ opacity: menuOpen && !closing ? 1 : 0, y: menuOpen && !closing ? 0 : -12 }}
          transition={{ duration: reducedMotion ? 0 : 0.18 }}
          onAnimationComplete={() => { if (closing) dialogRef.current?.close() }}>
          <div className={styles.menuHeading}>
            <span id="menu-title">Explore o portfólio</span>
            <button className={styles.close} type="button" aria-label="Fechar navegação"
              onClick={() => closeMenu()}><FiX aria-hidden="true" /></button>
          </div>
          <nav className={styles.mobileNav} aria-label="Navegação mobile">
            {navigation.map(({ id, label, number }) => (
              <a key={id} href={`#${id}`} aria-current={activeId === id ? 'location' : undefined}
                onClick={(event) => { event.preventDefault(); closeMenu(id) }}>
                <span className={styles.number}>{number}</span><span>{label}</span>
                <span className={styles.dot} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </motion.div>
      </dialog>
    </>
  )
}
