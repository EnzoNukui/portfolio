# Portfólio de Enzo Nukui

Portfólio pessoal em português brasileiro. A implementação segue o [briefing aprovado](../docs/briefing-original.md) e a [estrutura documentada](../docs/estrutura-do-projeto.md).

## Estado atual

Etapa 1: fundação visual implementada. Inclui Instrument Sans e Syne locais, tokens CSS, temas escuro/claro, header flutuante com seção ativa, CV em cápsula independente, menu mobile acessível e cursor contextual para mouse.

A página atual tem conteúdo provisório identificado como portfólio em construção e sete destinos reais para testar a navegação. As seções finais, fotografias, preloader, notebook 3D, Connected Stack, galeria de projetos e motion cinematográfico serão implementados nas próximas etapas. O conteúdo provisório está isolado em `src/data/foundation.ts` e será removido conforme as seções forem concluídas.

## Executar

Ambiente utilizado: Node.js 24.15 e npm 11.12. Execute os comandos nesta pasta (`enzo_nukui`).

```sh
npm ci
npm run dev
```

Use a URL impressa pelo Vite no terminal. Para gerar e conferir a versão de produção:

```sh
npm run build
npm run preview
```

## Verificar

```sh
npm run lint
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

O Playwright inicia um servidor Vite local automaticamente; fora de CI, também pode reutilizar o servidor existente na porta 5173. Os testes verificam tema, persistência, armazenamento bloqueado, navegação, download real, responsividade, menu, teclado, movimento reduzido, touch e carregamento das fontes. Traces de falhas ficam em `test-results/`, ignorado pelo Git.

## Organização

- `App.tsx`: composição global; `pages/Home`: ordem narrativa da página.
- `components`: Header, ThemeToggle, CVButton e CustomCursor, cada um com CSS Module.
- `providers`: contexto do tema e persistência. Tema escuro padrão; armazenamento na chave `enzo-nukui:theme:v1`.
- `hooks`: assinatura de media queries, movimento reduzido, mouse e seção ativa.
- `data`: navegação, identidade, contatos e conteúdo provisório.
- `styles`: tokens, temas, tipografia e regras globais.
- `assets`: imagens pessoais, eventos e cinco projetos selecionados.
- `public/cv/enzo-nukui-cv.pdf`: currículo real para download direto.
- `tests`: testes de navegador; `docs` no diretório superior: decisões e progresso.

As pastas de seções e seus subcomponentes serão adicionados conforme forem implementados, evitando arquivos vazios. Header e seção ativa usam Motion. O movimento do cursor usa motion values e springs; sua posição não passa pelo estado React. CSS cuida de respostas simples. GSAP e WebGL serão adicionados quando as etapas que precisam deles começarem.

## Tema e acessibilidade

O script no `index.html` aplica a preferência antes da primeira pintura. A chave deve permanecer sincronizada com `providers/themeContext.ts`. Valores inválidos e armazenamento indisponível usam o tema escuro; a alternância continua funcionando na sessão. Abas abertas sincronizam alterações via evento `storage`.

O menu usa `<dialog>` modal com conteúdo externo inerte, ciclo de Tab/Shift+Tab, Escape, retorno de foco e restauração da rolagem. Selecionar um link transfere foco à seção correspondente. As âncoras compensam o header fixo. Há um link para pular ao conteúdo e foco visível.

O cursor exige mouse com hover preciso, respeita movimento reduzido e cores forçadas, desaparece ao usar Tab e devolve o cursor nativo em textos, formulários, seleção e diálogo mobile. `data-cursor-label` comunica ações reais, como baixar o CV e enviar e-mail; `data-cursor-native` preserva controles que precisem do cursor padrão.

## Conteúdo e recursos

Contatos ficam em `data/socialLinks.ts`; identidade e URL do CV em `data/personal.ts`; âncoras em `data/navigation.ts`. As 31 imagens tiveram apenas os nomes padronizados; seus formatos e conteúdos foram preservados. O mapeamento está em `../docs/renomeacao-imagens.json`.

Somente PayLeech, Sudoku, HTTPmon, Soulie e LocalLead estão previstos no escopo atual. Não há links de demonstração ou descrições técnicas definitivas até a verificação dos projetos.

As fontes são servidas pelo próprio build via pacotes Fontsource, com licenças OFL-1.1 incluídas nos pacotes. Os ícones de interface são do conjunto Feather via React Icons. Não foi criado logotipo ou favicon provisório.

TypeScript 6.0 foi escolhido para manter compatibilidade declarada com `typescript-eslint`; o scaffold inicial usava TypeScript 7. Oxlint foi substituído por ESLint. Não foram usadas opções para ignorar incompatibilidades de dependências.

Não há publicação automática. Deploy exige autorização de Enzo.

## Próxima etapa

Home fotográfica com silhueta, nome em camadas, abertura integrada e parallax discreto. Ainda precisam de definição os relatos dos eventos, o trecho real para a tela do notebook e a avaliação visual das mídias. Ver [mapa de implementação](../docs/mapa-de-implementacao.md).
