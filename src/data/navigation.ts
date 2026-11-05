export const navigation = [
  { id: 'inicio', label: 'Início', number: '01' },
  { id: 'sobre', label: 'Sobre', number: '02' },
  { id: 'tecnologias', label: 'Tecnologias', number: '03' },
  { id: 'projetos', label: 'Projetos', number: '04' },
  { id: 'alem-do-codigo', label: 'Além do Código', number: '05' },
  { id: 'musica', label: 'Música', number: '06' },
  { id: 'futuro', label: 'Futuro', number: '07' },
  { id: 'contato', label: 'Contato', number: '08' },
] as const

export type SectionId = (typeof navigation)[number]['id']
