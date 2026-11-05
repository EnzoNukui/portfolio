import payleech01 from '../assets/projetos/payleech/payleech-captura-01.png'
import payleech02 from '../assets/projetos/payleech/payleech-captura-02.png'
import payleech03 from '../assets/projetos/payleech/payleech-captura-03.png'
import sudoku01 from '../assets/projetos/sudoku/sudoku-captura-01-tabuleiro.png'
import sudoku02 from '../assets/projetos/sudoku/sudoku-captura-02-ranking.png'
import httpmon01 from '../assets/projetos/httpmon/httpmon-captura-01.png'
import httpmon02 from '../assets/projetos/httpmon/httpmon-captura-02.png'
import soulieHome from '../assets/projetos/soulie/soulie-home-nova.png'
import soulieAbout from '../assets/projetos/soulie/soulie-sobre-nova.png'
import locallead01 from '../assets/projetos/locallead/locallead-captura-01.png'
import locallead02 from '../assets/projetos/locallead/locallead-captura-02.png'
import locallead03 from '../assets/projetos/locallead/locallead-captura-03.png'

export type ProjectTechnology = {
  id: string
  name: string
}

export type ProjectMedia = {
  src: string
  alt: string
  label: string
}

export type PortfolioProject = {
  id: string
  name: string
  category: 'Individual' | 'Acadêmico' | 'Colaborativo'
  period: string
  summary: string
  challenge: string
  solution: string
  highlights: string[]
  technologies: ProjectTechnology[]
  media: ProjectMedia[]
  repository?: string
  demo?: string
  technicalNote?: string
}

export const projects: PortfolioProject[] = [
  {
    id: 'payleech',
    name: 'PayLeech',
    category: 'Individual',
    period: 'Projeto pessoal',
    summary: 'Um lugar para acompanhar assinaturas, cobranças recorrentes e o impacto delas no orçamento.',
    challenge: 'Entender quanto os serviços recorrentes representam no mês e antecipar cobranças que poderiam passar despercebidas.',
    solution: 'Um painel que organiza serviços por categoria e reúne valores mensais, projeções anuais, histórico e próximos vencimentos.',
    highlights: ['Resumo mensal e projeção anual', 'Categorias e filtros para assinaturas', 'Histórico e acompanhamento de cobranças'],
    technologies: [
      { id: 'java', name: 'Java' }, { id: 'spring-boot', name: 'Spring Boot' },
      { id: 'react', name: 'React' }, { id: 'typescript', name: 'TypeScript' }, { id: 'mysql', name: 'MySQL' },
    ],
    media: [
      { src: payleech01, alt: 'Painel do PayLeech com resumo de gastos, projeção anual e cobranças próximas', label: 'Visão geral' },
      { src: payleech02, alt: 'Tela de assinaturas do PayLeech', label: 'Assinaturas' },
      { src: payleech03, alt: 'Tela de análise de gastos do PayLeech', label: 'Análise' },
    ],
    repository: 'https://github.com/EnzoNukui/PayLeech',
    demo: 'https://pay-leech.vercel.app/',
    technicalNote: 'Aplicação full stack: API em Java com Spring Boot, interface em React e TypeScript e persistência em MySQL.',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    category: 'Individual',
    period: 'Projeto pessoal',
    summary: 'Um Sudoku web com diferentes tamanhos de tabuleiro, níveis de dificuldade e acompanhamento de partidas.',
    challenge: 'Levar a lógica do Sudoku para uma experiência que permita escolher o desafio e acompanhar o próprio desempenho.',
    solution: 'Uma aplicação com geração de tabuleiros, validação das jogadas, dicas e ranking associado às partidas.',
    highlights: ['Tabuleiros 4×4, 6×6 e 9×9', 'Dificuldade, dicas e validação de jogadas', 'Ranking por tamanho e dificuldade'],
    technologies: [
      { id: 'react', name: 'React' }, { id: 'typescript', name: 'TypeScript' },
      { id: 'python', name: 'Python' }, { id: 'fastapi', name: 'FastAPI' }, { id: 'oracle-sql', name: 'Oracle SQL' },
    ],
    media: [
      { src: sudoku01, alt: 'Tabuleiro de Sudoku 9 por 9 com controles da partida ao lado', label: 'Tabuleiro 9×9' },
      { src: sudoku02, alt: 'Ranking de partidas de Sudoku com filtros por tamanho e dificuldade', label: 'Ranking' },
    ],
    repository: 'https://github.com/EnzoNukui/sudoku',
    demo: 'https://ende-sudoku.vercel.app/',
    technicalNote: 'A interface em React e TypeScript conversa com uma API em Python e FastAPI; os dados do projeto usam Oracle Database.',
  },
  {
    id: 'httpmon',
    name: 'HTTPmon',
    category: 'Individual',
    period: 'Projeto pessoal',
    summary: 'Uma forma visual de explorar códigos de status HTTP, explicados com cenas de Pokémon.',
    challenge: 'Códigos de resposta HTTP podem parecer abstratos quando apresentados apenas como números e definições.',
    solution: 'O projeto associa códigos e categorias HTTP a explicações, exemplos de requisição e resposta e imagens temáticas.',
    highlights: ['Categorias de 1xx a 5xx', 'Página explicativa para cada status', 'Busca por código e exemplos práticos'],
    technologies: [
      { id: 'react', name: 'React' }, { id: 'typescript', name: 'TypeScript' },
    ],
    media: [
      { src: httpmon01, alt: 'Página inicial do HTTPmon com busca e explicações de status HTTP', label: 'Explorar status' },
      { src: httpmon02, alt: 'Página do HTTPmon com detalhes de um código de status HTTP', label: 'Detalhe do código' },
    ],
    repository: 'https://github.com/EnzoNukui/HTTPmon',
    demo: 'https://httpmon.vercel.app/',
    technicalNote: 'A stack identificada no repositório inclui React e TypeScript.',
  },
  {
    id: 'soulie',
    name: 'Soulie',
    category: 'Acadêmico',
    period: 'Projeto acadêmico · FIAP',
    summary: 'Uma proposta gamificada que transforma hábitos sustentáveis em missões, progresso e recompensas.',
    challenge: 'Ajudar a tornar ações sustentáveis do cotidiano mais fáceis de acompanhar e manter.',
    solution: 'Uma experiência acadêmica que organiza a proposta em missões, evolução do usuário e recursos de comunidade.',
    highlights: ['Missões ligadas a hábitos sustentáveis', 'Progresso e conquistas', 'Proposta de comunidade'],
    technologies: [],
    media: [
      { src: soulieHome, alt: 'Página inicial da Soulie apresentando a proposta de hábitos sustentáveis gamificados', label: 'Página inicial' },
      { src: soulieAbout, alt: 'Página sobre a proposta e os objetivos da Soulie', label: 'Sobre a Soulie' },
    ],
    repository: 'https://github.com/EnzoNukui/soulie-sprint4',
    demo: 'https://soulie-sprint4.vercel.app/',
    technicalNote: 'A stack e o escopo individual de contribuição ainda precisam ser confirmados no repositório.',
  },
  {
    id: 'locallead',
    name: 'LocalLead',
    category: 'Acadêmico',
    period: 'Projeto acadêmico',
    summary: 'Um MVP de mobilidade urbana para apoiar deslocamentos nas linhas 11 e 12 da CPTM.',
    challenge: 'Reunir informações úteis para a viagem, como situação da linha, estação próxima, previsão de chegada e clima.',
    solution: 'Uma interface que reúne essas informações em um fluxo único de consulta. Previsões e lotação são estimativas do MVP, não medições em tempo real.',
    highlights: ['Informações das linhas 11 e 12', 'Consulta de estação e previsão de chegada', 'Clima e estimativa de lotação'],
    technologies: [
      { id: 'html', name: 'HTML' }, { id: 'css', name: 'CSS' }, { id: 'javascript', name: 'JavaScript' },
      { id: 'node', name: 'Node.js' }, { id: 'express', name: 'Express' },
    ],
    media: [
      { src: locallead01, alt: 'Página inicial do LocalLead com informações de viagem e linhas da CPTM', label: 'Página inicial' },
      { src: locallead02, alt: 'Detalhes da linha no MVP LocalLead', label: 'Detalhes da linha' },
      { src: locallead03, alt: 'Tela de vagão no MVP LocalLead', label: 'Vagão' },
    ],
    repository: 'https://github.com/EnzoNukui/LocalLead',
    demo: 'https://locallead.vercel.app/',
    technicalNote: 'Interface em HTML, CSS e JavaScript, com API em Node.js e Express. Dados de ocupação e chegada são estimativas.',
  },
]
