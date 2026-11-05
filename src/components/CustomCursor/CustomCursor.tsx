import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { usePointerType } from '../../hooks/usePointerType'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './CustomCursor.module.css'

const nativeSelector = 'input,textarea,select,[contenteditable="true"],[data-cursor-native],dialog'

export function CustomCursor() {
  const precisePointer = usePointerType()
  const reducedMotion = useReducedMotion()
  const enabled = precisePointer && !reducedMotion
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 900, damping: 55, mass: 0.2 })
  const springY = useSpring(y, { stiffness: 900, damping: 55, mass: 0.2 })
  const [appearance, setAppearance] = useState({ visible: false, interactive: false, label: '', compactLabel: false })
  const visibleRef = useRef(false)
  const pointerPositionRef = useRef<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (!enabled) return
    const hide = () => {
      visibleRef.current = false
      delete document.documentElement.dataset.customCursor
      setAppearance((previous) => previous.visible ? { ...previous, visible: false } : previous)
    }
    const updateTargetAppearance = (target: Element | null) => {
      const interactiveTarget = target?.closest('a,button,[role="button"]') ?? null
      if (target?.closest(nativeSelector)) {
        setAppearance((previous) => previous.label || previous.interactive
          ? { ...previous, label: '', interactive: false, compactLabel: false }
          : previous)
        return
      }
      const label = interactiveTarget?.getAttribute('data-cursor-label') ?? ''
      const interactive = Boolean(interactiveTarget)
      const compactLabel = interactiveTarget?.hasAttribute('data-cursor-compact') ?? false
      setAppearance((previous) => previous.visible
        && previous.interactive === interactive
        && previous.label === label
        && previous.compactLabel === compactLabel
        ? previous : { ...previous, visible: true, interactive, label, compactLabel })
    }
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const interactiveTarget = target?.closest('a,button,[role="button"]') ?? null
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)
        || event.target.closest(nativeSelector) || (!interactiveTarget && event.target.closest('p,h1,h2,h3'))
        || window.getSelection()?.toString()) { hide(); return }
      pointerPositionRef.current = { x: event.clientX, y: event.clientY }
      if (!visibleRef.current) { springX.jump(event.clientX); springY.jump(event.clientY) }
      x.set(event.clientX)
      y.set(event.clientY)
      visibleRef.current = true
      document.documentElement.dataset.customCursor = 'true'
      updateTargetAppearance(target)
    }
    const refreshTargetOnScroll = () => {
      const position = pointerPositionRef.current
      if (!visibleRef.current || !position) return
      updateTargetAppearance(document.elementFromPoint(position.x, position.y))
    }
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Tab') hide() }
    const visibilityChange = () => { if (document.hidden) hide() }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('scroll', refreshTargetOnScroll, { passive: true, capture: true })
    document.documentElement.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    window.addEventListener('keydown', keydown)
    document.addEventListener('visibilitychange', visibilityChange)
    return () => {
      delete document.documentElement.dataset.customCursor
      visibleRef.current = false
      pointerPositionRef.current = null
      window.removeEventListener('pointermove', move)
      window.removeEventListener('scroll', refreshTargetOnScroll, true)
      document.documentElement.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      window.removeEventListener('keydown', keydown)
      document.removeEventListener('visibilitychange', visibilityChange)
    }
  }, [enabled, x, y, springX, springY])
  if (!enabled) return null
  return (
    <motion.div className={styles.cursor} style={{ x: springX, y: springY }} aria-hidden="true">
      <motion.div className={`${styles.dot} ${appearance.label ? styles.withLabel : ''} ${appearance.compactLabel ? styles.compactLabel : ''}`}
        animate={{ opacity: appearance.visible ? 1 : 0,
          width: appearance.label ? appearance.compactLabel ? 34 : 62 : appearance.interactive ? 28 : 9,
          height: appearance.label ? appearance.compactLabel ? 34 : 62 : appearance.interactive ? 28 : 9 }}
        transition={{ duration: 0.14 }}>{appearance.label}</motion.div>
    </motion.div>
  )
}
