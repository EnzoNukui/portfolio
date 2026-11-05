import { FiMoon, FiSun } from 'react-icons/fi'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '../../providers/themeContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const reducedMotion = useReducedMotion()
  return (
    <button className={styles.toggle} type="button" onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'} aria-pressed={theme === 'light'}
      title={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          className={styles.iconStage}
          initial={reducedMotion ? false : { opacity: 0, y: 4, scale: 0.94, filter: 'blur(1px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={reducedMotion ? undefined : {
            opacity: 0,
            y: -3,
            scale: 0.96,
            filter: 'blur(1px)',
            transition: { duration: 0.07, ease: 'easeIn' },
          }}
          transition={{ duration: reducedMotion ? 0 : .17, ease: [.22, 1, .36, 1] }}
          aria-hidden="true"
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
