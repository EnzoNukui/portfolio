import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArchive, FiCheckCircle, FiClock, FiFileText, FiGitBranch, FiGrid, FiMessageCircle, FiPause, FiPlay, FiUsers } from 'react-icons/fi'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import schoolExterior from '../../assets/sobre-mim/01-primeiro-colegio/estrutura_visao_criativa.jpeg'
import schoolTableGroup from '../../assets/sobre-mim/01-primeiro-colegio/foto_9_ano_turma_mesa.jpeg'
import schoolClassPhoto from '../../assets/sobre-mim/01-primeiro-colegio/foto_9_ano_turma_profissional.jpeg'
import schoolClassroom from '../../assets/sobre-mim/01-primeiro-colegio/foto_9_ano_turma_sala.jpeg'
import childhoodFriends from '../../assets/sobre-mim/01-primeiro-colegio/foto_pequeno_com_amigos.jpeg'
import highSchoolExterior from '../../assets/sobre-mim/02-ensino-medio/estrutura_pop.jpeg'
import highSchoolFriends from '../../assets/sobre-mim/02-ensino-medio/foto_3_amigos-web.jpg'
import highSchoolFamily from '../../assets/sobre-mim/02-ensino-medio/foto_3_eu_mae.jpeg'
import highSchoolGroup from '../../assets/sobre-mim/02-ensino-medio/foto_3_me_segurando.jpeg'
import highSchoolLastDay from '../../assets/sobre-mim/02-ensino-medio/foto_terceiro_ultimo_dia_sozinho.jpeg'
import biologyProject from '../../assets/sobre-mim/01-primeiro-colegio/trabalho_biologia.jpeg'
import biologyPresentation from '../../assets/sobre-mim/01-primeiro-colegio/trabalho_biologia_pequeno.jpeg'
import ifspExterior from '../../assets/sobre-mim/03-ifsp/estrutura_ifsp.jpeg'
import ifspClass from '../../assets/sobre-mim/03-ifsp/imagem_ifsp_turma-web.jpg'
import ifspVeterans from '../../assets/sobre-mim/03-ifsp/imagem_ifsp_veteranos.jpeg'
import firstProjectTeam from '../../assets/eventos/primeiro-trabalho/primeiro-trabalho-01.jpg'
import googleHackathonTeam from '../../assets/eventos/google-hackathon/google-hackathon-01.jpg'
import talentSummitGroup from '../../assets/eventos/talent-summit/talent-summit-grupo.jpeg'
import talentSummitRobot from '../../assets/eventos/optimized/talent-summit-robo.jpg'
import fiapNextIndividual from '../../assets/eventos/optimized/next-individual.jpg'
import styles from './About.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type StoryPhoto = {
  src: string
  alt: string
  caption: string
  note: string
}

type StoryChapter = {
  number: string
  label: string
  period: string
  title: string
  copy: string
  photos: StoryPhoto[]
  highlights?: string[]
  workInterlude?: boolean
}

const workMoments = [
  {
    title: 'ORGANIZAÇÃO',
    headline: 'Organizei informações.',
    copy: 'Na rotina do Colégio Visão Criativa, organizei documentos, planilhas e sistemas internos. Esse cuidado ajudava a manter informações acessíveis, acompanhar tarefas e dar mais clareza ao trabalho administrativo do dia a dia.',
    highlights: [
      { label: 'Documentos', icon: FiFileText },
      { label: 'Arquivos', icon: FiArchive },
      { label: 'Sistemas internos', icon: FiGrid },
    ],
  },
  {
    title: 'RESPONSABILIDADE',
    headline: 'Atendi com atenção.',
    copy: 'Também atendia pais, alunos e responsáveis, lidando com diferentes solicitações ao longo do expediente. Mantinha uma comunicação clara, acompanhava cada demanda com atenção e cuidava dos prazos envolvidos.',
    highlights: [
      { label: 'Pais e alunos', icon: FiUsers },
      { label: 'Comunicação', icon: FiMessageCircle },
      { label: 'Atenção aos prazos', icon: FiClock },
    ],
  },
  {
    title: 'MELHORIA',
    headline: 'Melhorei o fluxo.',
    copy: 'Ao perceber gargalos no controle de uniformes, contribuí para organizar melhor as informações e o fluxo desse processo. O ajuste ajudou a reduzir inconsistências e deixou o acompanhamento das solicitações mais claro.',
    highlights: [
      { label: 'Controle de uniformes', icon: FiArchive },
      { label: 'Fluxo organizado', icon: FiGitBranch },
      { label: 'Menos inconsistências', icon: FiCheckCircle },
    ],
  },
]

type ChapterMotion = {
  preludeExit: 'up' | 'left' | 'down' | 'scale' | 'focus' | 'dissolve'
  imageClip: string
  imageScale: number
  imageBlur?: number
  focusTransition?: boolean
  exposureTransition?: boolean
  imageXPercent?: number
  imageYPercent?: number
  imageDuration: number
  imageEase: string
  captionIn: string
  captionOut: string
  captionDelay: number
  panelFade: number
}

const chapterMotion: Record<string, ChapterMotion> = {
  '01': {
    preludeExit: 'dissolve',
    imageClip: 'inset(0% 0% 0% 0% round 0px)',
    imageScale: 1,
    exposureTransition: true,
    imageDuration: 1.18,
    imageEase: 'power2.out',
    captionIn: 'inset(0% 0% 100% 0%)',
    captionOut: 'inset(0% 0% 0% 100%)',
    captionDelay: 0.2,
    panelFade: 0.68,
  },
  '02': {
    preludeExit: 'focus',
    imageClip: 'inset(0% 48% 0% 48% round 24px)',
    imageScale: 1.055,
    imageBlur: 12,
    focusTransition: true,
    imageDuration: 1.12,
    imageEase: 'power3.out',
    captionIn: 'inset(0% 0% 0% 0%)',
    captionOut: 'inset(0% 0% 0% 0%)',
    captionDelay: 0.12,
    panelFade: 0.5,
  },
  '03': {
    preludeExit: 'scale',
    imageClip: 'inset(0% 0% 0% 0% round 0px)',
    imageScale: 1,
    imageDuration: 0.9,
    imageEase: 'power2.out',
    captionIn: 'inset(0% 0% 0% 0%)',
    captionOut: 'inset(0% 0% 0% 0%)',
    captionDelay: 0,
    panelFade: 0.68,
  },
  '04': {
    preludeExit: 'dissolve',
    imageClip: 'inset(0% 0% 0% 0% round 0px)',
    imageScale: 1,
    exposureTransition: true,
    imageDuration: 1.12,
    imageEase: 'power2.out',
    captionIn: 'inset(0% 0% 100% 0%)',
    captionOut: 'inset(0% 0% 0% 100%)',
    captionDelay: 0.2,
    panelFade: 0.68,
  },
  '05': {
    preludeExit: 'focus',
    imageClip: 'inset(0% 46% 0% 46% round 28px)',
    imageScale: 1.045,
    imageBlur: 10,
    focusTransition: true,
    imageDuration: 1.04,
    imageEase: 'power3.out',
    captionIn: 'inset(0% 0% 0% 0%)',
    captionOut: 'inset(0% 0% 0% 0%)',
    captionDelay: 0.18,
    panelFade: 0.54,
  },
}

const chapters: StoryChapter[] = [
  {
    number: '01', label: 'AS ORIGENS', period: 'INFÂNCIA — 9º ANO',
    title: 'Foi aqui que tudo começou.',
    copy: 'O Colégio Visão Criativa acompanhou minha infância e a conclusão do ensino fundamental. Aqui vieram amizades, descobertas e lembranças que fazem parte de quem sou.',
    photos: [
      { src: schoolExterior, alt: 'Fachada do Colégio Visão Criativa.', caption: 'Colégio Visão Criativa', note: 'O lugar que acompanhou minha infância e a conclusão do ensino fundamental.' },
      { src: childhoodFriends, alt: 'Enzo criança com amigos no primeiro colégio.', caption: 'As primeiras lembranças', note: 'Amizades que transformaram os dias de escola em boas lembranças.' },
      { src: biologyProject, alt: 'Enzo e colegas apresentando um projeto de biologia.', caption: 'Projeto de biologia', note: 'Uma das primeiras experiências de pesquisa e apresentação em grupo.' },
      { src: biologyPresentation, alt: 'Enzo apresentando um trabalho escolar de biologia.', caption: 'Aprender fazendo', note: 'A curiosidade também aparecia nos trabalhos feitos com a turma.' },
      { src: schoolClassroom, alt: 'Enzo com colegas em uma sala de aula do 9º ano.', caption: 'Um dia com a turma', note: 'A rotina da sala de aula, compartilhada com quem cresceu ao meu lado.' },
      { src: schoolTableGroup, alt: 'Enzo e colegas reunidos em uma mesa no 9º ano.', caption: 'Amizades que ficaram', note: 'Entre conversas e trabalhos, a turma virou parte da história.' },
      { src: schoolClassPhoto, alt: 'Enzo com a turma do 9º ano em uma fotografia de formatura.', caption: 'A turma do 9º ano', note: 'Um registro coletivo de uma etapa que estava chegando ao fim.' },
    ],
  },
  {
    number: '02', label: 'NOVOS CAMINHOS', period: '2023 — 2025',
    title: 'Um ciclo de novas descobertas.',
    copy: 'No ensino médio, vivi novas experiências, trabalhos em grupo e o amadurecimento que acompanhou o fim de uma etapa. Cada momento abriu espaço para aprender algo diferente.',
    photos: [
      { src: highSchoolExterior, alt: 'Fachada da escola onde Enzo cursou o ensino médio.', caption: 'Uma nova escola', note: 'Um novo espaço abriu uma etapa diferente da minha formação.' },
      { src: highSchoolFriends, alt: 'Enzo com os amigos durante o ensino médio.', caption: 'Novas amizades', note: 'Conheci pessoas que fizeram parte dos dias e das descobertas dessa fase.' },
      { src: highSchoolFamily, alt: 'Enzo com sua mãe em uma celebração do ensino médio.', caption: 'Minha família por perto', note: 'O apoio da minha família também esteve presente nesse caminho.' },
      { src: highSchoolGroup, alt: 'Enzo com colegas em um encontro durante o ensino médio.', caption: 'O caminho em grupo', note: 'As experiências compartilhadas deram forma a muitas lembranças.' },
      { src: highSchoolLastDay, alt: 'Enzo com amigos no último dia do ensino médio.', caption: 'O último dia dessa etapa', note: 'Uma despedida que marcou o encerramento de um ciclo importante.' },
    ],
  },
  {
    number: '03', label: 'EXPERIÊNCIA PROFISSIONAL', period: 'COLÉGIO VISÃO CRIATIVA · AUXILIAR ADMINISTRATIVO · FEV/2025 — MAR/2026 · 1 ANO E 1 MÊS',
    title: 'Responsabilidade também ensina.',
    copy: 'Minha experiência como auxiliar administrativo foi meu primeiro contato com uma rotina profissional. Aprendi a lidar com responsabilidades, manter a organização e entender como cada tarefa contribui para o todo. Mesmo fora da tecnologia, essa etapa ampliou minha maturidade e me ensinou a levar dedicação e atenção para os próximos desafios.',
    photos: [],
    workInterlude: true,
  },
  {
    number: '04', label: 'EXPLORANDO POSSIBILIDADES', period: 'IFSP',
    title: 'Uma nova perspectiva.',
    copy: 'Minha passagem pelo IFSP foi uma etapa de formação e exploração de caminhos. Um período que ampliou meu olhar sobre o futuro e também faz parte da minha trajetória.',
    photos: [
      { src: ifspExterior, alt: 'Entrada do campus do IFSP em Suzano.', caption: 'IFSP Suzano', note: 'Foi um novo ambiente para ampliar meu olhar sobre os caminhos possíveis.' },
      { src: ifspClass, alt: 'Turma do IFSP reunida no campus.', caption: 'Construindo conhecimento', note: 'A formação também acontece nas trocas com colegas e professores.' },
      { src: ifspVeterans, alt: 'Enzo e colegas em um encontro de estudantes veteranos do IFSP.', caption: 'Encontros que marcam', note: 'Uma etapa feita de encontros, aprendizados e novas perspectivas.' },
    ],
  },
  {
    number: '05', label: 'UM NOVO CAPÍTULO', period: 'FIAP · ANÁLISE E DESENVOLVIMENTO DE SISTEMAS',
    title: 'Aprender fazendo.',
    copy: 'Na FIAP, sigo transformando curiosidade em prática. Do primeiro trabalho ao Google Hackathon e ao Talent Summit, cada experiência amplia meu aprendizado e me aproxima da criação em equipe.',
    photos: [
      { src: firstProjectTeam, alt: 'Enzo e colegas apresentando o primeiro projeto na FIAP.', caption: 'O primeiro trabalho', note: 'Na FIAP, transformei uma ideia de saúde animal em uma solução apresentada em equipe.' },
      { src: googleHackathonTeam, alt: 'Enzo com participantes do Google Hackathon.', caption: 'Google Hackathon', note: 'Um encontro para colaborar, experimentar e construir junto de outras pessoas.' },
      { src: talentSummitGroup, alt: 'Enzo com participantes no Talent Summit da FIAP.', caption: 'Talent Summit', note: 'Um momento de troca e conexão com a comunidade da FIAP.' },
      { src: talentSummitRobot, alt: 'Robô apresentado durante o Talent Summit da FIAP.', caption: 'Ideias que ganham forma', note: 'A tecnologia também aparece nos projetos e experiências compartilhados no evento.' },
      { src: fiapNextIndividual, alt: 'Enzo em uma foto individual durante o FIAP NEXT.', caption: 'FIAP NEXT', note: 'Um registro individual de mais uma etapa da minha formação na FIAP.' },
    ],
  },
]

function ChapterIntro({ chapter, titleId, setRef }: {
  chapter: StoryChapter
  titleId: string
  setRef: (element: HTMLDivElement | null) => void
}) {
  return (
    <div ref={setRef} className={styles.chapterIntro}>
      <p className={styles.chapterLabel}>{chapter.number} / {chapter.label}</p>
      {chapter.workInterlude ? (
        <>
          <div className={styles.workTitleTrack}>
            {workMoments.map((moment, index) => (
              <h2 key={moment.title} id={index === 0 ? titleId : undefined} className={styles.workHeading}>
                {moment.headline}
              </h2>
            ))}
          </div>
          <div className={styles.workCopyTrack}>
            {workMoments.map((moment) => (
              <div key={moment.title} className={styles.workNarrative}>
                <p className={styles.workCopyHeading}>{moment.title}</p>
                <h3 className={styles.workMobileHeading}>{moment.headline}</h3>
                <p className={styles.chapterCopy}>{moment.copy}</p>
                <ul className={styles.workHighlights} aria-label={`Destaques: ${moment.title.toLocaleLowerCase('pt-BR')}`}>
                  {moment.highlights.map(({ label, icon: Icon }) => (
                    <li key={label}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 id={titleId}>{chapter.title}</h2>
          <p className={styles.chapterCopy}>{chapter.copy}</p>
        </>
      )}
      <p className={styles.chapterPeriod}>{chapter.period}</p>
      {chapter.highlights && (
        <ul className={styles.chapterHighlights} aria-label="Aprendizados desta etapa">
          {chapter.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
        </ul>
      )}
    </div>
  )
}

function StoryMusicButton() {
  const [isPlaying, setIsPlaying] = useState(() => document.documentElement.dataset.spotifyIsPlaying === 'true')

  useEffect(() => {
    const onPlaybackState = (event: Event) => {
      const { isPlaying: playbackActive } = (event as CustomEvent<{ isPlaying?: boolean }>).detail ?? {}
      setIsPlaying(Boolean(playbackActive))
    }

    window.addEventListener('portfolio:spotify-playback-state', onPlaybackState)
    return () => window.removeEventListener('portfolio:spotify-playback-state', onPlaybackState)
  }, [])

  const togglePlayback = () => {
    window.dispatchEvent(new CustomEvent('portfolio:spotify-toggle', {
      detail: { shouldPlay: !isPlaying },
    }))
  }

  return (
    <button
      className={styles.storyMusicButton}
      type="button"
      onClick={togglePlayback}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? 'Pausar a trilha da minha história' : 'Reproduzir a trilha da minha história'}
    >
      <span className={styles.storyMusicIcon} aria-hidden="true">
        {isPlaying ? <FiPause /> : <FiPlay />}
      </span>
      <span className={styles.storyMusicLabel}>
        <strong>{isPlaying ? 'Pausar trilha' : 'Dê o play'}</strong>
      </span>
    </button>
  )
}

function PhotoPanel({ chapter, photo, index, setPanelRef, setImageRef, setSweepRef }: {
  chapter: StoryChapter
  photo: StoryPhoto
  index: number
  setPanelRef: (element: HTMLElement | null) => void
  setImageRef: (element: HTMLImageElement | null) => void
  setSweepRef: (element: HTMLSpanElement | null) => void
}) {
  const sequence = String(index + 1).padStart(2, '0')
  const total = String(chapter.photos.length).padStart(2, '0')
  const exposureTransition = chapterMotion[chapter.number].exposureTransition

  return (
    <figure
      ref={setPanelRef}
      className={`${styles.photoPanel} ${exposureTransition ? styles.exposurePhotoPanel : ''}`}
      aria-hidden={index !== 0}
    >
      <img ref={setImageRef} className={styles.photo} src={photo.src} alt={photo.alt} loading={index === 0 ? 'eager' : 'lazy'} />
      <span ref={setSweepRef} className={styles.photoExposureSweep} aria-hidden="true" />
      <figcaption className={styles.photoCaption}>
        <p className={styles.photoCaptionEyebrow}>MEMÓRIA {sequence} <i>/</i> {total}</p>
        <h3>{photo.caption}</h3>
        <p className={styles.photoCaptionNote}>{photo.note}</p>
      </figcaption>
    </figure>
  )
}

export function About() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const stageRefs = useRef<Array<HTMLDivElement | null>>([])
  const trackRefs = useRef<Array<HTMLDivElement | null>>([])
  const introRefs = useRef<Array<HTMLDivElement | null>>([])
  const chapterPreludeRefs = useRef<Array<HTMLDivElement | null>>([])
  const closingScreenRefs = useRef<Array<HTMLDivElement | null>>([])
  const panelRefs = useRef<Array<Array<HTMLElement | null>>>([])
  const imageRefs = useRef<Array<Array<HTMLImageElement | null>>>([])
  const sweepRefs = useRef<Array<Array<HTMLSpanElement | null>>>([])

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return

    const media = gsap.matchMedia()
    media.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
      chapters.forEach((chapter, chapterIndex) => {
        const chapterElement = chapterRefs.current[chapterIndex]
        const stage = stageRefs.current[chapterIndex]
        const track = trackRefs.current[chapterIndex]
        const intro = introRefs.current[chapterIndex]
        const prelude = chapterPreludeRefs.current[chapterIndex]
        const closingScreen = closingScreenRefs.current[chapterIndex]
        if (!chapterElement || !stage || !intro || !prelude) return

        const panels = (panelRefs.current[chapterIndex] ?? []).filter((panel): panel is HTMLElement => panel !== null)
        const images = (imageRefs.current[chapterIndex] ?? []).filter((image): image is HTMLImageElement => image !== null)
        const sweeps = (sweepRefs.current[chapterIndex] ?? []).filter((sweep): sweep is HTMLSpanElement => sweep !== null)
        const captions = panels
          .map((panel) => panel.querySelector<HTMLElement>(`.${styles.photoCaption}`))
          .filter((caption): caption is HTMLElement => caption !== null)
        const photoCount = chapter.photos.length
        const motion = chapterMotion[chapter.number]
        const preludeExitStart = 0.8
        const entryDuration = 2.2
        const firstPhotoHold = 0.34
        const photoStep = 1.08
        const baseScrollScreens = (photoCount > 0 ? 2.55 + photoCount * photoStep : chapter.workInterlude ? 4.5 : 3.8) * 0.93
        const isFinalPhotoChapter = chapterIndex === chapters.length - 1 && photoCount > 0
        const captionDuration = motion.focusTransition ? 0.46 : 0.52
        const lastPhotoStart = photoCount === 1
          ? preludeExitStart
          : entryDuration + firstPhotoHold + (photoCount - 2) * photoStep
        const lastPhotoEnd = lastPhotoStart + Math.max(
          motion.imageDuration,
          motion.panelFade,
          motion.captionDelay + captionDuration,
          motion.exposureTransition ? 1 : 0,
        )
        const finalPhotoReveal = Math.max(motion.panelFade, 0.48 + motion.captionDelay) + 0.08
        const finalScreenEnd = isFinalPhotoChapter ? lastPhotoStart + finalPhotoReveal + 0.78 : 0
        const requiredTimelineEnd = Math.max(
          entryDuration - motion.captionDelay + captionDuration,
          lastPhotoEnd,
          finalScreenEnd,
        )
        const scrollScreens = isFinalPhotoChapter
          ? Math.max(baseScrollScreens - 0.8, requiredTimelineEnd + 0.12)
          : photoCount > 0
            ? Math.max(Math.min(baseScrollScreens, lastPhotoEnd + 0.35), requiredTimelineEnd + 0.12)
            : baseScrollScreens

        gsap.set(prelude, { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 1, filter: 'blur(0px)', transformOrigin: 'center center' })
        if (closingScreen) gsap.set(closingScreen, { yPercent: 100 })
        gsap.set(intro, chapter.workInterlude
          ? { autoAlpha: 0, x: -54, y: 0 }
          : motion.focusTransition
            ? { autoAlpha: 0, x: 0, y: 0, filter: 'blur(10px)' }
            : motion.preludeExit === 'dissolve'
              ? { autoAlpha: 0, x: 0, y: 0, filter: 'blur(10px)' }
            : { autoAlpha: 0, y: 58 })
        if (track) gsap.set(track, { x: 0 })
        if (panels.length > 0) {
          gsap.set(panels, { autoAlpha: 0 })
          gsap.set(panels[0], { autoAlpha: 1 })
        }
        if (captions.length > 0) {
          gsap.set(captions, {
            autoAlpha: 0,
            clipPath: motion.focusTransition ? motion.captionIn : 'inset(0% 100% 0% 0%)',
            filter: motion.focusTransition ? 'blur(8px)' : 'blur(0px)',
            y: motion.focusTransition ? 12 : 0,
          })
        }
        if (images.length > 0) {
          gsap.set(images, {
            scale: motion.imageScale,
            xPercent: motion.imageXPercent ?? 0,
            yPercent: motion.imageYPercent ?? 0,
            clipPath: motion.imageClip,
            filter: motion.exposureTransition
              ? 'grayscale(1) brightness(.62) saturate(.72)'
              : motion.imageBlur ? `blur(${motion.imageBlur}px)` : 'blur(0px)',
          })
        }
        if (sweeps.length > 0) gsap.set(sweeps, { xPercent: -125, autoAlpha: 0 })

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: chapterElement,
            start: 'top top',
            end: () => `+=${Math.round(window.innerHeight * scrollScreens)}`,
            pin: stage,
            pinSpacing: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (trigger) => {
              if (!photoCount) return
              const storyTime = trigger.progress * scrollScreens
              const passedTransitions = Math.floor(
                (storyTime - entryDuration - firstPhotoHold - motion.panelFade / 2) / photoStep,
              ) + 1
              const activePhoto = gsap.utils.clamp(0, photoCount - 1, passedTransitions)
              panels.forEach((panel, index) => panel.setAttribute('aria-hidden', String(index !== activePhoto)))
            },
          },
        })

        const preludeExit = motion.preludeExit === 'focus'
          ? { autoAlpha: 0, filter: 'blur(14px)', scale: 0.985, duration: 0.78, ease: 'power2.inOut' }
          : motion.preludeExit === 'dissolve'
            ? { autoAlpha: 0, filter: 'blur(12px)', scale: 1.015, duration: 0.82, ease: 'power2.inOut' }
          : motion.preludeExit === 'left'
            ? { xPercent: -100, duration: 0.76, ease: 'power3.inOut' }
          : motion.preludeExit === 'down'
            ? { yPercent: 100, duration: 0.78, ease: 'power3.inOut' }
            : motion.preludeExit === 'scale'
              ? { autoAlpha: 0, scale: 1.045, duration: 0.7, ease: 'power2.inOut' }
              : { yPercent: -100, duration: 0.72, ease: 'power3.inOut' }
        timeline.to(prelude, preludeExit, preludeExitStart)

        timeline.fromTo(intro,
          chapter.workInterlude
            ? { autoAlpha: 0, x: -54, y: 0 }
            : motion.focusTransition
              ? { autoAlpha: 0, x: 0, y: 0, filter: 'blur(10px)' }
              : motion.preludeExit === 'dissolve'
                ? { autoAlpha: 0, x: 0, y: 0, filter: 'blur(10px)' }
              : { autoAlpha: 0, y: 58 },
          chapter.workInterlude
            ? { autoAlpha: 1, x: 0, y: 0, duration: 0.68, ease: 'power3.out', immediateRender: false }
            : motion.focusTransition
              ? { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.52, ease: 'power2.out', immediateRender: false }
              : motion.preludeExit === 'dissolve'
                ? { autoAlpha: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 0.56, ease: 'power2.out', immediateRender: false }
              : { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power3.out', immediateRender: false },
          preludeExitStart + 0.12,
        )

        if (photoCount > 0 && track) {
          timeline.to(intro, motion.focusTransition || motion.preludeExit === 'dissolve'
            ? { autoAlpha: 0, filter: 'blur(8px)', duration: 0.36, ease: 'power2.in' }
            : { autoAlpha: 0, y: -38, duration: 0.34, ease: 'power2.in' }, 1.62)
          if (captions[0]) {
            timeline.fromTo(captions[0], {
              autoAlpha: 0,
              clipPath: motion.captionIn,
              filter: motion.focusTransition ? 'blur(8px)' : 'blur(0px)',
              y: motion.focusTransition ? 12 : 0,
            }, {
              autoAlpha: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              filter: 'blur(0px)',
              y: 0,
              duration: motion.focusTransition ? 0.46 : 0.52,
              ease: motion.focusTransition ? 'power3.out' : 'power2.out',
              immediateRender: false,
            }, entryDuration - motion.captionDelay)
          }

          panels.slice(1).forEach((panel, panelIndex) => {
            const transitionStart = entryDuration + firstPhotoHold + panelIndex * photoStep
            const caption = captions[panelIndex + 1]
            timeline.to(panels[panelIndex], {
              autoAlpha: 0, duration: motion.panelFade, ease: 'power1.inOut',
            }, transitionStart)
            timeline.fromTo(panel, { autoAlpha: 0 }, {
              autoAlpha: 1, duration: motion.panelFade, ease: 'power2.out', immediateRender: false,
            }, transitionStart)
            if (captions[panelIndex]) {
              timeline.to(captions[panelIndex], motion.focusTransition
                ? { autoAlpha: 0, filter: 'blur(8px)', y: -5, duration: 0.3, ease: 'power1.in' }
                : { autoAlpha: 0, clipPath: motion.captionOut, duration: 0.3, ease: 'power1.in' }, transitionStart)
            }
            if (caption) {
              timeline.fromTo(caption, {
                autoAlpha: 0,
                clipPath: motion.captionIn,
                filter: motion.focusTransition ? 'blur(8px)' : 'blur(0px)',
                y: motion.focusTransition ? 12 : 0,
              }, {
                autoAlpha: 1,
                clipPath: 'inset(0% 0% 0% 0%)',
                filter: 'blur(0px)',
                y: 0,
                duration: motion.focusTransition ? 0.46 : 0.48,
                ease: motion.focusTransition ? 'power3.out' : 'power2.out',
                immediateRender: false,
              }, transitionStart + motion.captionDelay)
            }
          })

          images.forEach((image, photoIndex) => {
            const imageStart = photoIndex === 0
              ? preludeExitStart
              : entryDuration + firstPhotoHold + (photoIndex - 1) * photoStep
            timeline.fromTo(image, {
              clipPath: motion.imageClip,
              scale: motion.imageScale,
              xPercent: motion.imageXPercent ?? 0,
              yPercent: motion.imageYPercent ?? 0,
              filter: motion.exposureTransition
                ? 'grayscale(1) brightness(.62) saturate(.72)'
                : motion.imageBlur ? `blur(${motion.imageBlur}px)` : 'blur(0px)',
            }, {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              scale: 1,
              xPercent: 0,
              yPercent: 0,
              filter: motion.exposureTransition ? 'grayscale(0) brightness(1) saturate(1)' : 'blur(0px)',
              duration: motion.imageDuration,
              ease: motion.imageEase,
              immediateRender: false,
            }, imageStart)

            const sweep = sweeps[photoIndex]
            if (sweep && motion.exposureTransition) {
              timeline.fromTo(sweep, { xPercent: -125, autoAlpha: 0 }, {
                xPercent: -16,
                autoAlpha: 0.62,
                duration: 0.34,
                ease: 'power1.out',
                immediateRender: false,
              }, imageStart + 0.08)
              timeline.to(sweep, {
                xPercent: 125,
                autoAlpha: 0,
                duration: 0.66,
                ease: 'power1.in',
              }, imageStart + 0.42)
            }
          })

          if (closingScreen && chapterIndex === chapters.length - 1) {
            const closingStart = lastPhotoStart + finalPhotoReveal
            timeline.to(closingScreen, {
              yPercent: 0,
              duration: 0.78,
              ease: 'power3.inOut',
            }, closingStart)
          }

          const timelineEnd = timeline.duration()
          const remainingScroll = scrollScreens - timelineEnd
          if (remainingScroll > 0.01) {
            timeline.to(track, { x: 0, duration: remainingScroll, ease: 'none' }, timelineEnd)
          }
        } else {
          const words = Array.from(stage.querySelectorAll<HTMLElement>(`.${styles.workWord}`))
          const headings = Array.from(intro.querySelectorAll<HTMLElement>(`.${styles.workHeading}`))
          const narratives = Array.from(intro.querySelectorAll<HTMLElement>(`.${styles.workNarrative}`))
          if (words.length > 0 && headings.length > 0 && narratives.length > 0) {
            gsap.set(words, { autoAlpha: 0, xPercent: 12, scale: 0.97 })
            gsap.set(headings, { autoAlpha: 0, y: 28, clipPath: 'inset(0% 0% 100% 0%)' })
            gsap.set(narratives, { autoAlpha: 0, y: 18 })
            const storyStart = 1.45
            const storyStep = 0.92
            const storyRevealDuration = 0.58

            workMoments.forEach((_, index) => {
              const momentStart = storyStart + index * storyStep
              const word = words[index]
              const heading = headings[index]
              const narrative = narratives[index]
              const previousWord = words[index - 1]
              const previousHeading = headings[index - 1]
              const previousNarrative = narratives[index - 1]
              if (previousWord) {
                timeline.to(previousWord, {
                  autoAlpha: 0,
                  xPercent: -12,
                  scale: 1.025,
                  duration: 0.28,
                  ease: 'power2.in',
                }, momentStart)
              }
              if (previousHeading) {
                timeline.to(previousHeading, {
                  autoAlpha: 0,
                  y: -22,
                  clipPath: 'inset(0% 0% 100% 0%)',
                  duration: 0.3,
                  ease: 'power2.in',
                }, momentStart)
              }
              if (previousNarrative) {
                timeline.to(previousNarrative, {
                  autoAlpha: 0,
                  y: -12,
                  duration: 0.28,
                  ease: 'power2.in',
                }, momentStart)
              }
              if (word) {
                timeline.fromTo(word, {
                  autoAlpha: 0,
                  xPercent: 12,
                  scale: 0.97,
                }, {
                  autoAlpha: 0.16,
                  xPercent: -12,
                  scale: 1.025,
                  duration: storyStep,
                  ease: 'power1.inOut',
                  immediateRender: false,
                }, momentStart)
              }
              if (heading) timeline.fromTo(heading, {
                autoAlpha: 0,
                y: 28,
                clipPath: 'inset(0% 0% 100% 0%)',
              }, {
                autoAlpha: 1,
                y: 0,
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: storyRevealDuration,
                ease: 'power3.out',
                immediateRender: false,
              }, momentStart)
              if (narrative) timeline.fromTo(narrative, {
                autoAlpha: 0,
                y: 18,
              }, {
                autoAlpha: 1,
                y: 0,
                duration: storyRevealDuration,
                ease: 'power3.out',
                immediateRender: false,
              }, momentStart + 0.08)
            })

            const storyEnd = storyStart + (workMoments.length - 1) * storyStep + storyRevealDuration
            if (scrollScreens > storyEnd) {
              timeline.to({}, { duration: scrollScreens - storyEnd }, storyEnd)
            }
          }
        }
      })

      return () => { ScrollTrigger.refresh() }
    })

    media.add('(max-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current
      if (!section) return
      const revealSelector = [
        `.${styles.chapterPrelude} .${styles.preludeMeta} > span`,
        `.${styles.chapterPrelude} h2`,
        `.${styles.chapterPrelude} .${styles.preludeFooter} > *`,
        `.${styles.chapterNumber}`,
        `.${styles.chapterIntro} > .${styles.chapterLabel}`,
        `.${styles.chapterIntro} > h2`,
        `.${styles.chapterIntro} > .${styles.chapterCopy}`,
        `.${styles.chapterIntro} > .${styles.chapterPeriod}`,
        `.${styles.chapterHighlights} > li`,
        `.${styles.workNarrative}`,
        `.${styles.workHighlights} > li`,
        `.${styles.photo}`,
        `.${styles.photoCaption}`,
        `.${styles.bottomSignature} > span`,
      ].join(', ')
      const targets = Array.from(section.querySelectorAll<HTMLElement>(revealSelector))
      if (!targets.length) return

      targets.forEach((target, index) => {
        target.dataset.mobileReveal = target.matches(`.${styles.photo}`) ? 'photo'
          : target.matches(`.${styles.chapterLabel}, .${styles.preludeMeta} > span`) ? 'side'
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
    <section ref={sectionRef} id="sobre" tabIndex={-1} className={styles.about} aria-label="Sobre mim: uma história em construção">
      {chapters.map((chapter, chapterIndex) => (
        <article
          key={chapter.number}
          ref={(element) => { chapterRefs.current[chapterIndex] = element }}
          className={`${styles.chapter} ${chapter.workInterlude ? styles.workChapter : ''}`}
          aria-labelledby={`sobre-chapter-${chapter.number}`}
        >
          <div ref={(element) => { stageRefs.current[chapterIndex] = element }} className={styles.stage}>
            <div
              ref={(element) => { chapterPreludeRefs.current[chapterIndex] = element }}
              className={styles.chapterPrelude}
              aria-hidden={chapterIndex !== 0}
            >
              <div className={styles.preludeMeta} aria-hidden="true">
                <span>{chapter.number} <i>/</i> {String(chapters.length).padStart(2, '0')}</span>
                <span>ENZO NUKUI <i>·</i> MINHA TRAJETÓRIA</span>
              </div>
              {chapterIndex === 0 ? (
                <div className={styles.preludeTitleGroup}>
                  <h2 aria-hidden="true">{chapter.label}</h2>
                  <StoryMusicButton />
                </div>
              ) : (
                <h2>{chapter.label}</h2>
              )}
              <div className={styles.preludeFooter} aria-hidden="true">
                <span>{chapter.period}</span>
                <span className={styles.preludeRule} />
                <span>CAPÍTULO {chapter.number}</span>
              </div>
            </div>
            {chapter.photos.length > 0 ? (
              <div ref={(element) => { trackRefs.current[chapterIndex] = element }} className={styles.photoTrack}>
                {chapter.photos.map((photo, photoIndex) => (
                  <PhotoPanel
                    key={`${chapter.number}-${photo.caption}`}
                    chapter={chapter}
                    photo={photo}
                    index={photoIndex}
                    setPanelRef={(element) => {
                      panelRefs.current[chapterIndex] ??= []
                      panelRefs.current[chapterIndex][photoIndex] = element
                    }}
                    setImageRef={(element) => {
                      imageRefs.current[chapterIndex] ??= []
                      imageRefs.current[chapterIndex][photoIndex] = element
                    }}
                    setSweepRef={(element) => {
                      sweepRefs.current[chapterIndex] ??= []
                      sweepRefs.current[chapterIndex][photoIndex] = element
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.workBackdrop} aria-hidden="true">
                <div className={styles.workWordStage}>
                  {workMoments.map((moment) => (
                    <p key={moment.title} className={styles.workWord}>{moment.title}</p>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.sceneShade} aria-hidden="true" />
            <span className={styles.chapterNumber} aria-hidden="true">{chapter.number}</span>
            <ChapterIntro
              chapter={chapter}
              titleId={`sobre-chapter-${chapter.number}`}
              setRef={(element) => { introRefs.current[chapterIndex] = element }}
            />
            <div className={styles.bottomSignature} aria-hidden="true">
              <span>ENZO NUKUI</span><span>MINHA TRAJETÓRIA</span>
            </div>
            {chapterIndex === chapters.length - 1 && (
              <div
                ref={(element) => { closingScreenRefs.current[chapterIndex] = element }}
                className={`${styles.chapterPrelude} ${styles.closingScreen}`}
              >
                <div className={styles.preludeMeta}>
                  <span>{chapter.number} <i>/</i> {String(chapters.length).padStart(2, '0')}</span>
                  <span>ENZO NUKUI <i>·</i> MINHA TRAJETÓRIA</span>
                </div>
                <h2>Essa história ainda continua...</h2>
                <div className={styles.preludeFooter}>
                  <span>FIAP · ADS</span>
                  <span className={styles.preludeRule} />
                  <span>CONTINUA</span>
                </div>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}
