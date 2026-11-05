import type { IconType } from 'react-icons'
import { DiJava, DiMysql } from 'react-icons/di'
import { GrOracle } from 'react-icons/gr'
import {
  SiCss,
  SiExpress,
  SiFastapi,
  SiHtml5,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSpringboot,
  SiTypescript,
} from 'react-icons/si'
import payLeechImage from '../assets/projetos/payleech/payleech-captura-01.png'
import sudokuImage from '../assets/projetos/sudoku/sudoku-captura-01-tabuleiro.png'
import localLeadImage from '../assets/projetos/locallead/locallead-captura-01.png'

export interface StackProject {
  id: string
  name: string
  image: string
  imageAlt: string
  href: string
  completedAt: { month: string; year: string }
}

export interface Technology {
  id: string
  name: string
  color: string
  icon: IconType
  groupId: 'front-end' | 'back-end' | 'database'
  projectId: StackProject['id']
}

export interface TechnologyGroup {
  id: Technology['groupId']
  label: string
  eyebrow: string
  description: string
  technologies: string[]
}

export const stackProjects: StackProject[] = [
  {
    id: 'payleech',
    name: 'PayLeech',
    image: payLeechImage,
    imageAlt: 'Captura real do painel do projeto PayLeech',
    href: 'https://github.com/EnzoNukui/PayLeech',
    completedAt: { month: 'outubro', year: '2026' },
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    image: sudokuImage,
    imageAlt: 'Captura da partida de Sudoku com o tabuleiro 9 por 9',
    href: 'https://ende-sudoku.vercel.app/',
    completedAt: { month: 'setembro', year: '2026' },
  },
  {
    id: 'locallead',
    name: 'LocalLead',
    image: localLeadImage,
    imageAlt: 'Captura real da página inicial do LocalLead com linhas da CPTM e informações de viagem',
    href: 'https://locallead.vercel.app/',
    completedAt: { month: 'julho', year: '2026' },
  },
]

export const technologyGroups: TechnologyGroup[] = [
  {
    id: 'front-end',
    label: 'Front-end',
    eyebrow: '01 / INTERFACE',
    description: 'Onde a experiência ganha forma.',
    technologies: ['html', 'css', 'javascript', 'react', 'typescript'],
  },
  {
    id: 'back-end',
    label: 'Back-end',
    eyebrow: '02 / APLICAÇÃO',
    description: 'Lógica, regras e comunicação.',
    technologies: ['java', 'spring-boot', 'python', 'fastapi', 'node', 'express'],
  },
  {
    id: 'database',
    label: 'Banco de dados',
    eyebrow: '03 / PERSISTÊNCIA',
    description: 'Dados organizados e acessíveis.',
    technologies: ['oracle-sql', 'mysql'],
  },
]

export const technologies: Technology[] = [
  { id: 'html', name: 'HTML', color: '#e34f26', icon: SiHtml5, groupId: 'front-end', projectId: 'locallead' },
  { id: 'css', name: 'CSS', color: '#1572b6', icon: SiCss, groupId: 'front-end', projectId: 'locallead' },
  { id: 'javascript', name: 'JavaScript', color: '#f7df1e', icon: SiJavascript, groupId: 'front-end', projectId: 'locallead' },
  { id: 'react', name: 'React', color: '#61dafb', icon: SiReact, groupId: 'front-end', projectId: 'payleech' },
  { id: 'typescript', name: 'TypeScript', color: '#3178c6', icon: SiTypescript, groupId: 'front-end', projectId: 'payleech' },
  { id: 'java', name: 'Java', color: '#f0931c', icon: DiJava, groupId: 'back-end', projectId: 'payleech' },
  { id: 'spring-boot', name: 'Spring Boot', color: '#6db33f', icon: SiSpringboot, groupId: 'back-end', projectId: 'payleech' },
  { id: 'python', name: 'Python', color: '#3776ab', icon: SiPython, groupId: 'back-end', projectId: 'sudoku' },
  { id: 'fastapi', name: 'FastAPI', color: '#009688', icon: SiFastapi, groupId: 'back-end', projectId: 'sudoku' },
  { id: 'node', name: 'Node.js', color: '#83cd29', icon: SiNodedotjs, groupId: 'back-end', projectId: 'locallead' },
  { id: 'express', name: 'Express', color: '#f3f3f1', icon: SiExpress, groupId: 'back-end', projectId: 'locallead' },
  { id: 'oracle-sql', name: 'Oracle SQL', color: '#f80000', icon: GrOracle, groupId: 'database', projectId: 'sudoku' },
  { id: 'mysql', name: 'MySQL', color: '#00758f', icon: DiMysql, groupId: 'database', projectId: 'payleech' },
]
