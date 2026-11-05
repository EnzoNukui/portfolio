# Enzo Nukui — Portfólio

Portfólio pessoal de **Enzo Nukui**, estudante de Análise e Desenvolvimento de Sistemas na FIAP. Uma experiência visual e interativa para apresentar sua trajetória, tecnologias, projetos, eventos e próximos passos em desenvolvimento de software.

**Repositório:** [EnzoNukui/portfolio](https://github.com/EnzoNukui/portfolio)  
**Domínio:** [enzonukui.com.br](https://enzonukui.com.br) — registrado; publicação na Vercel pendente.

## Sobre o projeto

O site foi pensado como uma narrativa contínua, com dois temas visuais, animações guiadas pela rolagem e layouts adaptados para celular, tablet e desktop. As interações mantêm alternativas por toque e teclado e respeitam a preferência do sistema por movimento reduzido.

### Seções

- **Início:** apresentação pessoal com tipografia em movimento e localização.
- **Sobre:** capítulos da trajetória escolar, experiências e formação.
- **Tecnologias:** ferramentas agrupadas por front-end, back-end e banco de dados, relacionadas a projetos.
- **Projetos:** PayLeech, Sudoku, HTTPmon, Soulie e LocalLead, com capturas de tela, detalhes e links.
- **Além do Código:** registros fotográficos de trabalhos e eventos, incluindo Google Hackathon, Talent Summit e FIAP Next.
- **Música:** playlist incorporada pelo player oficial do Spotify.
- **Futuro:** interesses, objetivos e próximos passos profissionais.
- **Contato:** canais para conversar e acompanhar o trabalho.

## Tecnologias

- React e TypeScript
- Vite
- CSS Modules e CSS custom properties para estilos, temas e responsividade
- GSAP e ScrollTrigger para animações ligadas à rolagem
- Motion para interações de interface
- React Icons
- Instrument Sans e Syne servidas pelo projeto; La Belle Aurore usada como fonte de destaque
- Spotify Embed oficial para a playlist

## Executar localmente

Requisitos: Node.js e npm.

```bash
git clone https://github.com/EnzoNukui/portfolio.git
cd portfolio
npm ci
npm run dev
```

Abra o endereço local informado pelo Vite no terminal.

## Comandos disponíveis

| Comando | Ação |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Verifica os tipos TypeScript |
| `npm run test:e2e` | Executa os testes de navegador com Playwright |

Para preparar o navegador usado pelos testes E2E, execute uma vez:

```bash
npx playwright install chromium
```

## Publicação na Vercel

O projeto está preparado para ser importado da raiz do repositório:

| Configuração | Valor |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `/` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Depois do primeiro deploy, adicione `enzonukui.com.br` em **Project Settings → Domains**. Configure no Registro.br os registros DNS exatos informados pela Vercel e aguarde a validação do domínio e do certificado HTTPS. A branch de produção conectada ao GitHub será publicada automaticamente a cada atualização.

O projeto não precisa de variáveis de ambiente para o build atual. O currículo fica em `public/cv/enzo-nukui-cv.pdf`; o player de música usa a playlist definida em `src/data/music.ts`.

## Organização do código

```text
public/                 Arquivos servidos diretamente, como currículo e favicon
src/assets/             Retrato, imagens pessoais, eventos e capturas dos projetos
src/components/         Menu, controle de tema, currículo e cursor contextual
src/data/               Conteúdo da navegação, tecnologias, projetos e playlist
src/hooks/              Hooks de seção ativa, mídia, cursor e movimento reduzido
src/pages/Home/         Composição e ordem das seções da página
src/providers/          Estado e persistência do tema
src/sections/           Início, Sobre, Tecnologias, Projetos, eventos, música, futuro e contato
src/styles/             Estilos globais, tipografia, temas e variáveis
tests/                  Testes de integração no navegador
```

## Acessibilidade e movimento

- Navegação por teclado e links para saltar ao conteúdo.
- Menu móvel com suporte a foco, Escape e toque.
- Estados de foco visíveis, nomes acessíveis e descrições para imagens.
- Alternância de tema persistida entre visitas.
- Animações reduzidas quando `prefers-reduced-motion` está ativo.
- Player do Spotify com controles nativos e link para abrir a playlist diretamente.

As fotografias e capturas retratam a trajetória e os projetos apresentados no portfólio. As fontes de terceiros incluem suas licenças em `public/licenses/`.
