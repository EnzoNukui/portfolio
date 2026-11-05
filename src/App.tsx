import { MotionConfig } from 'motion/react'
import { Header } from './components/Header/Header'
import { CustomCursor } from './components/CustomCursor/CustomCursor'
import { useReducedMotion } from './hooks/useReducedMotion'
import Home from './pages/Home'
import { ThemeProvider } from './providers/ThemeProvider'

export default function App() {
  const reducedMotion = useReducedMotion()
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
        <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
        <Header />
        <Home />
        <CustomCursor />
      </MotionConfig>
    </ThemeProvider>
  )
}
