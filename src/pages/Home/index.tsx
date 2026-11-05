import { About } from '../../sections/About/About'
import { Hero } from '../../sections/Hero/Hero'
import { Technologies } from '../../sections/Technologies/Technologies'
import { Projects } from '../../sections/Projects/Projects'
import { MusicSection } from '../../sections/Music/MusicSection'
import { BeyondCode } from '../../sections/BeyondCode/BeyondCode'
import { FutureSection } from '../../sections/Future/FutureSection'
import { ContactSection } from '../../sections/Contact/ContactSection'
import styles from './Home.module.css'

export default function Home() {
  return (
    <main id="conteudo" tabIndex={-1} className={styles.page}>
      <Hero />
      <About />
      <Technologies />
      <Projects />
      <BeyondCode />
      <MusicSection />
      <FutureSection />
      <ContactSection />
    </main>
  )
}
