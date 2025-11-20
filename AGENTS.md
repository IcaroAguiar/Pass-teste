# Guia rápido para agentes – Pass-Teste

## Propósito
Centralizar regras e contexto do projeto para qualquer agente trabalhar com segurança, mantendo identidade visual e fluxos obrigatórios.

## Stack e entradas
- Next.js 15 (App Router) + TypeScript + Tailwind CSS + Radix UI.
- Fonte principal: `Geist` carregada em `app/layout.tsx`; fallback `Geist Fallback` → use sempre `font-sans`.
- Tema: `next-themes` com `defaultTheme="dark"`; tokens de cor via CSS vars em `app/globals.css` (primário hsl(240 5.9% 10%), fundo claro hsl(0 0% 100%), fundo escuro hsl(0 0% 0%)).
- Animações e view-transitions definidas em `app/globals.css` (origem topo-esquerda, easing `--expo-out`).
- Internacionalização: `LanguageProvider` (`components/language-provider.tsx`) persiste idioma em `localStorage` (`pass-language`) e atualiza `lang` do `<html>`. Traduções em `lib/translations.ts` via `useTranslations`.
- Rota principal: `app/veiculos/page.tsx` renderiza a tabela via `VeiculosProvider` + `VeiculosTable` dentro de `AppShell`. A home redireciona para `/veiculos`.

## Fluxo obrigatório de trabalho
1) Antes de mudar código: verifique arquivos afetados e leia `README.md`/`TESTING.md` se relevante.
2) A cada alteração de código ou documentação no repositório: **rodar `npm run lint` e `npm run typecheck`**.
3) Rodar `npm run build` **apenas quando o usuário solicitar**.
4) Testes E2E (Playwright) quando mexer em UI/fluxos: `npm run test` (instale navegadores com `npx playwright install` se necessário).
5) Não reverta alterações pré-existentes do usuário sem pedido explícito.

## Referências rápidas de scripts
- `npm run dev` – servidor local.
- `npm run lint` – ESLint (Next config).
- `npm run typecheck` – TypeScript `--noEmit`.
- `npm run build` – build de produção.
- `npm run test` / `test:ui` / `test:headed` / `test:report` – suite Playwright.

## Identidade visual mínima
- Paleta via tokens: `--background`/`--foreground`, `--primary` (texto claro no primário escuro), `--secondary` e `--muted` para superfícies; `--border`/`--input` para contornos; `--chart-1..5` para gráficos. Preserve proporções e contraste; modo dark usa mesmos tokens já invertidos.
- Raio padrão `--radius` (0.5rem) com derivados `lg/md/sm` em Tailwind.
- Scrollbar custom preto (#0A0A0A trilha, #1A1A1A polegar) – não remover sem motivo.

## Estrutura de pastas
- `app/` – rotas, layout, estilos globais, fontes locais.
- `components/` – UI e domínio (layout, navegação, tabela de veículos, etc.).
- `lib/` – utilidades e traduções.
- `tests/` e `specs/` – suites Playwright.
- `public/` – assets estáticos.

## Convenções rápidas de código
- Usar componentes e hooks existentes (`useLanguage`, `useTranslations`, `ThemeProvider`) em vez de duplicar lógica.
- Priorizar classes Tailwind com tokens de cor (e.g. `bg-background`, `text-foreground`); evitar cores hardcoded.
- Comentários apenas para blocos não triviais.

## Checklists de PR/Tarefa
- [ ] Atualizei ou consultei traduções quando adicionei textos.
- [ ] Mantive padrões de tema, animações e view-transition (origem top-left).
- [ ] Rodei `npm run lint` e `npm run typecheck` após as mudanças.
- [ ] Rodei `npm run build` (apenas se solicitado).
- [ ] (Se alterei fluxo/UI) Rodei Playwright (`npm run test`).
