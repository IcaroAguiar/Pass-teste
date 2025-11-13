# Testes Automatizados

Este diretório contém os testes end-to-end (E2E) da aplicação usando Playwright.

## Estrutura dos Testes

### `language-switch.spec.ts`
Testes relacionados à funcionalidade de troca de idiomas:
- ✅ Verificação do idioma padrão (Português)
- ✅ Troca para English
- ✅ Troca para Español
- ✅ Persistência do idioma após recarregar a página
- ✅ Atualização do atributo `lang` do HTML
- ✅ Salvamento no localStorage

### `navigation.spec.ts`
Testes relacionados à navegação da aplicação:
- ✅ Navegação para página de veículos
- ✅ Exibição da sidebar
- ✅ Exibição do breadcrumb
- ✅ Expansão e recolhimento da sidebar

### `veiculos-table.spec.ts`
Testes relacionados à tabela de veículos:
- ✅ Exibição da tabela
- ✅ Exibição dos cabeçalhos
- ✅ Exibição dos dados
- ✅ Ordenação por coluna
- ✅ Busca na tabela
- ✅ Botão de adicionar veículo
- ✅ Seleção de linhas

### `ui-components.spec.ts`
Testes relacionados aos componentes de UI:
- ✅ Botão de busca global
- ✅ Diálogo de busca (Ctrl+K)
- ✅ Seletor de idioma
- ✅ Botão de alternar tema
- ✅ Avatar do usuário
- ✅ Toolbar de veículos
- ✅ Controles de paginação

### `accessibility.spec.ts`
Testes relacionados à acessibilidade:
- ✅ Atributo `lang` correto no HTML
- ✅ Labels acessíveis nos botões
- ✅ Estrutura semântica correta
- ✅ Contraste adequado
- ✅ Navegação por teclado
- ✅ Títulos de página descritivos

### `theme.spec.ts`
Testes relacionados ao sistema de temas:
- ✅ Aplicação do tema dark por padrão
- ✅ Alternância entre temas

## Como Executar os Testes

### Executar todos os testes
```bash
npm run test
```

### Executar testes com interface gráfica
```bash
npm run test:ui
```

### Executar testes em modo headed (com navegador visível)
```bash
npm run test:headed
```

### Ver relatório dos testes
```bash
npm run test:report
```

### Executar um arquivo específico
```bash
npx playwright test tests/language-switch.spec.ts
```

### Executar testes em modo debug
```bash
npx playwright test --debug
```

## Configuração

Os testes estão configurados em `playwright.config.ts`:
- **Base URL**: `http://localhost:3001`
- **Navegador**: Chromium (Desktop Chrome)
- **Timeout**: 30 segundos por padrão
- **Web Server**: Inicia automaticamente o servidor de desenvolvimento

## Requisitos

- Node.js instalado
- Dependências instaladas (`npm install`)
- Servidor de desenvolvimento rodando na porta 3001 (ou configurar a porta no `playwright.config.ts`)

## Estrutura de Testes

Cada arquivo de teste segue a estrutura:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Nome do Grupo de Testes', () => {
  test.beforeEach(async ({ page }) => {
    // Setup comum para cada teste
  });

  test('descrição do teste', async ({ page }) => {
    // Implementação do teste
  });
});
```

## Boas Práticas

1. **Isolamento**: Cada teste é independente e não depende de outros
2. **Setup/Teardown**: Use `beforeEach` para configuração comum
3. **Aguardar**: Sempre aguarde elementos aparecerem antes de interagir
4. **Seletores**: Prefira seletores semânticos (role, text) sobre seletores CSS
5. **Timeouts**: Use `waitForTimeout` apenas quando necessário, prefira `waitFor`

## Cobertura de Testes

### Funcionalidades Testadas:
- ✅ Troca de idiomas (Português, English, Español)
- ✅ Navegação entre páginas
- ✅ Tabela de veículos (exibição, ordenação, busca)
- ✅ Componentes de UI (busca, tema, idioma)
- ✅ Acessibilidade básica
- ✅ Sistema de temas

### Funcionalidades Não Testadas (Futuras):
- ⏳ Formulários de criação/edição
- ⏳ Filtros avançados
- ⏳ Exportação de dados
- ⏳ Autenticação (quando implementada)
- ⏳ Validações de formulário

## Manutenção

Ao adicionar novas funcionalidades:
1. Crie testes correspondentes
2. Execute os testes antes de fazer commit
3. Mantenha os testes atualizados quando a UI mudar
4. Documente novos testes neste arquivo

