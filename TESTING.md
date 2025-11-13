# Guia de Testes - Pass Teste

Este documento descreve a estratégia de testes automatizados da aplicação.

## Visão Geral

A aplicação utiliza **Playwright** para testes end-to-end (E2E), garantindo que as funcionalidades principais funcionem corretamente em diferentes cenários.

## Estrutura de Testes

```
tests/
├── README.md                 # Documentação dos testes
├── language-switch.spec.ts   # Testes de troca de idiomas
├── navigation.spec.ts        # Testes de navegação
├── veiculos-table.spec.ts    # Testes da tabela de veículos
├── ui-components.spec.ts      # Testes de componentes UI
├── accessibility.spec.ts      # Testes de acessibilidade
└── theme.spec.ts             # Testes de temas
```

## Cobertura de Testes

### ✅ Funcionalidades Testadas

#### 1. Sistema de Idiomas
- Troca entre Português, English e Español
- Persistência no localStorage
- Atualização do atributo `lang` do HTML
- Tradução dinâmica de componentes

#### 2. Navegação
- Navegação entre páginas
- Sidebar e menu de navegação
- Breadcrumb
- Expansão/recolhimento da sidebar

#### 3. Tabela de Veículos
- Renderização da tabela
- Exibição de dados
- Ordenação por colunas
- Busca e filtros
- Seleção de linhas
- Paginação

#### 4. Componentes de UI
- Busca global (Ctrl+K)
- Seletor de idioma
- Alternador de tema
- Avatar do usuário
- Toolbar

#### 5. Acessibilidade
- Atributos semânticos
- Labels acessíveis
- Navegação por teclado
- Estrutura HTML correta

#### 6. Temas
- Aplicação de tema dark/light
- Alternância entre temas

## Executando os Testes

### Pré-requisitos
```bash
# Instalar dependências
npm install

# Instalar navegadores do Playwright (se necessário)
npx playwright install
```

### Comandos Disponíveis

```bash
# Executar todos os testes
npm run test

# Executar com interface gráfica
npm run test:ui

# Executar em modo headed (navegador visível)
npm run test:headed

# Ver relatório dos testes
npm run test:report

# Executar um arquivo específico
npx playwright test tests/language-switch.spec.ts

# Executar em modo debug
npx playwright test --debug
```

## Configuração

O arquivo `playwright.config.ts` contém a configuração dos testes:

- **Base URL**: `http://localhost:3001`
- **Navegador**: Chromium (Desktop Chrome)
- **Timeout padrão**: 30 segundos
- **Web Server**: Inicia automaticamente o servidor de desenvolvimento

## Estratégia de Testes

### Níveis de Teste

1. **Testes E2E**: Testam fluxos completos do usuário
2. **Testes de Componentes**: Verificam comportamento individual de componentes
3. **Testes de Acessibilidade**: Garantem que a aplicação é acessível

### Padrões de Teste

- **Isolamento**: Cada teste é independente
- **Setup/Teardown**: Configuração comum no `beforeEach`
- **Seletores**: Preferência por seletores semânticos (role, text)
- **Aguardar**: Sempre aguardar elementos antes de interagir

## Exemplo de Teste

```typescript
import { test, expect } from '@playwright/test';

test.describe('Funcionalidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
  });

  test('deve fazer algo', async ({ page }) => {
    // Arrange
    const button = page.getByRole('button', { name: 'Clique aqui' });
    
    // Act
    await button.click();
    
    // Assert
    await expect(page.locator('.resultado')).toBeVisible();
  });
});
```

## Manutenção

### Ao Adicionar Novas Funcionalidades

1. **Criar testes correspondentes**
   - Adicionar testes em arquivo existente ou criar novo
   - Seguir padrão de nomenclatura: `funcionalidade.spec.ts`

2. **Executar testes antes de commit**
   ```bash
   npm run test
   ```

3. **Atualizar documentação**
   - Atualizar `TESTING.md` com novas funcionalidades testadas
   - Atualizar `tests/README.md` se necessário

### Boas Práticas

- ✅ Testes devem ser rápidos e confiáveis
- ✅ Usar seletores estáveis (evitar classes CSS que mudam)
- ✅ Aguardar elementos aparecerem antes de interagir
- ✅ Limpar estado entre testes (localStorage, cookies)
- ✅ Testar comportamentos, não implementação

## CI/CD

Os testes podem ser integrados em pipelines CI/CD:

```yaml
# Exemplo GitHub Actions
- name: Run Playwright tests
  run: npm run test
```

## Relatórios

Após executar os testes, um relatório HTML é gerado em `playwright-report/`. Para visualizar:

```bash
npm run test:report
```

## Troubleshooting

### Testes falhando intermitentemente
- Aumentar timeouts se necessário
- Verificar se elementos estão realmente visíveis
- Adicionar `waitForLoadState('networkidle')`

### Elementos não encontrados
- Verificar seletor usado
- Adicionar espera explícita: `await page.waitForSelector()`
- Verificar se elemento está em iframe ou shadow DOM

### Timeout errors
- Verificar se servidor está rodando
- Aumentar timeout no `playwright.config.ts`
- Verificar performance da aplicação

## Próximos Passos

- [ ] Adicionar testes de formulários
- [ ] Adicionar testes de validação
- [ ] Adicionar testes de performance
- [ ] Integrar testes no CI/CD
- [ ] Adicionar testes de integração com API

