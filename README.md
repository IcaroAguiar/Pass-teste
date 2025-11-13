# Pass Teste

Teste de seleção para desenvolvedor Full-stack na empresa Pass.

## 🚀 Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Playwright** - Testes E2E
- **date-fns** - Manipulação de datas

## 📋 Funcionalidades

### ✅ Implementadas

- **Sistema de Idiomas**: Suporte a Português, English e Español
  - Troca dinâmica de idioma
  - Persistência no localStorage
  - Tradução completa da interface
  - Atualização automática do atributo `lang` do HTML

- **Tabela de Veículos**
  - Exibição de dados
  - Ordenação por colunas
  - Busca e filtros
  - Seleção múltipla
  - Paginação

- **Navegação**
  - Sidebar colapsável
  - Breadcrumb
  - Menu de navegação

- **Temas**
  - Modo dark/light
  - Persistência de preferência

- **Busca Global**
  - Atalho Ctrl+K
  - Diálogo de busca

## 🧪 Testes

A aplicação possui testes automatizados usando Playwright. Veja [TESTING.md](./TESTING.md) para mais detalhes.

### Executar Testes

```bash
# Todos os testes
npm run test

# Com interface gráfica
npm run test:ui

# Modo headed (navegador visível)
npm run test:headed

# Ver relatório
npm run test:report
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Instalar navegadores do Playwright (se necessário)
npx playwright install

# Executar em desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000` (ou porta configurada).

## 📁 Estrutura do Projeto

```
├── app/                    # Rotas e páginas (Next.js App Router)
├── components/             # Componentes React
│   ├── app-bar/           # Componentes do header
│   ├── layout/            # Componentes de layout
│   ├── navigation/        # Componentes de navegação
│   ├── veiculos/         # Componentes da tabela de veículos
│   └── ui/               # Componentes UI reutilizáveis
├── lib/                   # Utilitários e helpers
│   ├── translations.ts   # Sistema de traduções
│   └── utils.ts         # Funções utilitárias
├── tests/                # Testes E2E (Playwright)
└── public/              # Arquivos estáticos
```

## 🌐 Sistema de Idiomas

O sistema de idiomas está implementado com:

- **LanguageProvider**: Context API para gerenciar idioma globalmente
- **Traduções**: Arquivo centralizado em `lib/translations.ts`
- **Persistência**: localStorage com chave `pass-language`
- **Atualização dinâmica**: Componentes reagem automaticamente à mudança de idioma

### Adicionar Novas Traduções

1. Adicione a chave em `lib/translations.ts` para todos os idiomas
2. Use `useTranslations()` nos componentes:

```typescript
import { useLanguage } from "@/components/language-provider";
import { useTranslations } from "@/lib/translations";

const { language } = useLanguage();
const t = useTranslations(language);

// Usar tradução
<span>{t("minhaChave")}</span>
```

## 🎨 Temas

O sistema de temas usa `next-themes`:

- Tema padrão: Dark
- Persistência: localStorage (`pass-theme`)
- Alternância: Botão no header

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
npm run typecheck    # Verificação de tipos TypeScript
npm run test         # Testes E2E
npm run test:ui      # Testes com interface gráfica
npm run test:headed  # Testes com navegador visível
npm run test:report  # Ver relatório de testes
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` se necessário:

```env
# Exemplo (se necessário)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Porta do Servidor

Por padrão, o Next.js usa a porta 3000. Para alterar:

```bash
npm run dev -- -p 3001
```

Ou configure no `package.json`.

## 📚 Documentação Adicional

- [TESTING.md](./TESTING.md) - Guia completo de testes
- [tests/README.md](./tests/README.md) - Documentação dos testes

## 🤝 Contribuindo

1. Faça suas alterações
2. Execute os testes: `npm run test`
3. Verifique tipos: `npm run typecheck`
4. Execute linter: `npm run lint`
5. Faça commit das alterações

## 📄 Licença

ISC
