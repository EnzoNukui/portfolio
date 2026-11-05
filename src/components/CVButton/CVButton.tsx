import { FiDownload } from 'react-icons/fi'
import { personal } from '../../data/personal'
import styles from './CVButton.module.css'

export function CVButton() {
  return (
    <a className={styles.button} href={personal.cvUrl} download={personal.cvFilename}
      aria-label="Baixar currículo em PDF" data-cursor-label="BAIXAR">
      <span>CV</span><FiDownload aria-hidden="true" />
    </a>
  )
}
