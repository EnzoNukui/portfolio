import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import { spotifyEmbedUrl, spotifyPlaylistUrl } from '../../data/music'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './MusicSection.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface SpotifyEmbedController {
  resume: () => void
  togglePlay: () => void
  addListener: (
    event: 'playback_update',
    callback: (event: { data: { isPaused: boolean; isBuffering: boolean } }) => void,
  ) => void
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { url: string; width: string; height: number },
    callback: (controller: SpotifyEmbedController) => void,
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void
    portfolioSpotifyIframeApi?: SpotifyIframeApi
  }
}

export function MusicSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const playerFrameRef = useRef<HTMLDivElement>(null)
  const embedRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyEmbedController | null>(null)
  const pendingPlaybackRef = useRef<boolean | null>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const target = embedRef.current
    if (!target) return

    let cancelled = false
    let fallbackTimer: number | undefined
    const showNativeEmbedFallback = () => {
      const currentIframe = playerFrameRef.current?.querySelector('iframe')
      if (cancelled || currentIframe?.src) return
      const iframe = document.createElement('iframe')
      iframe.src = spotifyEmbedUrl
      iframe.title = 'Playlist de Enzo Nukui no Spotify'
      iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
      iframe.allowFullscreen = true
      iframe.loading = 'eager'
      target.replaceWith(iframe)
      document.documentElement.dataset.spotifyEmbedFallback = 'true'
    }

    const initializeEmbed = (api: SpotifyIframeApi) => {
      if (cancelled || target.dataset.spotifyInitialized) return
      target.dataset.spotifyInitialized = 'true'
      try {
        api.createController(target, {
          url: spotifyPlaylistUrl,
          width: '100%',
          height: 626,
        }, (controller) => {
          if (cancelled) return
          window.clearTimeout(fallbackTimer)
          controllerRef.current = controller
          const iframe = playerFrameRef.current?.querySelector('iframe')
          if (iframe) {
            iframe.title = 'Playlist de Enzo Nukui no Spotify'
            iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            iframe.allowFullscreen = true
            iframe.loading = 'eager'
          }
          controller.addListener('playback_update', ({ data }) => {
            const isPlaying = !data.isPaused && !data.isBuffering
            document.documentElement.dataset.spotifyIsPlaying = String(isPlaying)
            window.dispatchEvent(new CustomEvent('portfolio:spotify-playback-state', { detail: { isPlaying } }))
          })
          document.documentElement.dataset.spotifyEmbedReady = 'true'
          window.dispatchEvent(new Event('portfolio:spotify-ready'))
          if (pendingPlaybackRef.current !== null) {
            const shouldPlay = pendingPlaybackRef.current
            pendingPlaybackRef.current = null
            if (shouldPlay) controller.resume()
            else controller.togglePlay()
          }
        })
        fallbackTimer = window.setTimeout(showNativeEmbedFallback, 12000)
      } catch {
        showNativeEmbedFallback()
      }
    }

    const previousReadyHandler = window.onSpotifyIframeApiReady
    window.onSpotifyIframeApiReady = (api) => {
      window.portfolioSpotifyIframeApi = api
      previousReadyHandler?.(api)
      initializeEmbed(api)
    }

    if (window.portfolioSpotifyIframeApi) {
      initializeEmbed(window.portfolioSpotifyIframeApi)
    } else if (!document.querySelector('script[data-spotify-iframe-api]')) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      script.dataset.spotifyIframeApi = 'true'
      script.onerror = showNativeEmbedFallback
      document.body.append(script)
    }

    const onToggleRequest = (event: Event) => {
      const { shouldPlay } = (event as CustomEvent<{ shouldPlay?: boolean }>).detail ?? {}
      const requestedPlayback = shouldPlay ?? document.documentElement.dataset.spotifyIsPlaying !== 'true'
      const controller = controllerRef.current
      if (controller) {
        if (requestedPlayback) controller.resume()
        else controller.togglePlay()
      } else {
        pendingPlaybackRef.current = requestedPlayback
      }
    }
    window.addEventListener('portfolio:spotify-toggle', onToggleRequest)

    return () => {
      cancelled = true
      window.clearTimeout(fallbackTimer)
      window.removeEventListener('portfolio:spotify-toggle', onToggleRequest)
      if (window.onSpotifyIframeApiReady) window.onSpotifyIframeApiReady = previousReadyHandler
    }
  }, [])

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return

    const section = sectionRef.current
    const eyebrow = section.querySelector<HTMLElement>(`.${styles.eyebrow}`)
    const intro = section.querySelector<HTMLElement>(`.${styles.intro}`)
    const player = section.querySelector<HTMLElement>(`.${styles.player}`)
    const spotifyLink = section.querySelector<HTMLElement>(`.${styles.spotifyLink}`)

    const entrance = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 92%',
        end: 'top 32%',
        scrub: 0.45,
        invalidateOnRefresh: true,
      },
    })

    if (eyebrow) entrance.fromTo(eyebrow,
      { autoAlpha: 0.72, y: 14, filter: 'blur(3px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.28, ease: 'none' },
    )
    if (intro) entrance.fromTo(intro,
      { autoAlpha: 0.84, y: 32, scale: 0.99, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.58, ease: 'none' },
      '-=0.08',
    )
    if (player) entrance.fromTo(player,
      { autoAlpha: 0.86, y: 42, scale: 0.985, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.66, ease: 'none' },
      '-=0.22',
    )
    if (spotifyLink) entrance.fromTo(spotifyLink,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.28, ease: 'none' },
      '-=0.18',
    )
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return (
    <section ref={sectionRef} id="musica" tabIndex={-1} className={styles.section} aria-labelledby="musica-title">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>06 / PLAYLIST PESSOAL <span>ENTRE ESTUDOS E PROJETOS</span></p>

        <div className={styles.intro}>
          <h2 id="musica-title">Uma trilha para cada <span>momento.</span></h2>
          <p>Músicas que me acompanham entre estudos, projetos e pausas — um pouco do que também faz parte da minha rotina.</p>
        </div>

        <div ref={playerFrameRef} className={styles.player}>
          <div className={styles.embed} aria-label="Player da playlist de Enzo Nukui no Spotify">
            <div ref={embedRef} className={styles.embedMount} />
          </div>
        </div>

        <a className={styles.spotifyLink} href={spotifyPlaylistUrl} target="_blank" rel="noopener noreferrer">
          Abrir playlist no Spotify <FiArrowUpRight aria-hidden="true" />
          <span className={styles.srOnly}> (abre em nova aba)</span>
        </a>
      </div>
    </section>
  )
}
