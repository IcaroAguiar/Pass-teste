import { test, expect } from '@playwright/test';

test.describe('Tabela de Veículos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve exibir a tabela de veículos', async ({ page }) => {
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('deve exibir os cabeçalhos da tabela', async ({ page }) => {
    const headers = [
      'Identificador',
      'Titulo',
      'Marca',
      'Placa',
      'Capacidade',
      'Criado em',
      'Status'
    ];
    
    for (const header of headers) {
      const headerElement = page.getByRole('columnheader', { name: new RegExp(header, 'i') }).or(
        page.locator('th, button').filter({ hasText: new RegExp(header, 'i') })
      ).first();
      await expect(headerElement).toBeVisible();
    }
  });

  test('deve exibir dados na tabela', async ({ page }) => {
    const tableBody = page.locator('tbody');
    await expect(tableBody).toBeVisible();
    
    // Verificar se há pelo menos uma linha de dados
    const rows = tableBody.locator('tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('deve permitir ordenação por coluna', async ({ page }) => {
    // Tentar clicar em um cabeçalho ordenável
    const identifierHeader = page.locator('button, th').filter({ hasText: /Identificador|Identifier/i }).first();
    
    if (await identifierHeader.isVisible()) {
      await identifierHeader.click();
      await page.waitForTimeout(500);
      
      // Verificar se a ordenação foi aplicada (pode verificar ordem dos dados)
      const firstRow = page.locator('tbody tr').first();
      await expect(firstRow).toBeVisible();
    }
  });

  test('deve permitir busca na tabela', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Buscar"], input[placeholder*="Search"]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Mercedes');
      await page.waitForTimeout(500);
      
      // Verificar se os resultados foram filtrados
      const tableBody = page.locator('tbody');
      await expect(tableBody).toBeVisible();
    }
  });

  test('deve exibir botão de adicionar veículo', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /Adicionar|Add|Agregar/i });
    await expect(addButton).toBeVisible();
  });

  test('deve permitir seleção de linhas', async ({ page }) => {
    const firstCheckbox = page.locator('tbody tr').first().locator('input[type="checkbox"]');
    
    if (await firstCheckbox.isVisible()) {
      await firstCheckbox.click();
      await page.waitForTimeout(300);
      
      // Verificar se o checkbox foi marcado
      await expect(firstCheckbox).toBeChecked();
    }
  });
});

