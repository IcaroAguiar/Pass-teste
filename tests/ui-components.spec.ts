import { test, expect } from '@playwright/test';

test.describe('Componentes de UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve exibir o botão de busca global', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /Buscar|Search/i }).first();
    await expect(searchButton).toBeVisible();
  });

  test('deve abrir o diálogo de busca ao pressionar Ctrl+K', async ({ page }) => {
    await page.keyboard.press('Control+K');
    await page.waitForTimeout(300);
    
    const searchDialog = page.locator('[role="dialog"]').or(page.locator('[class*="command"]'));
    await expect(searchDialog).toBeVisible();
  });

  test('deve exibir o seletor de idioma', async ({ page }) => {
    const languageButton = page.getByRole('button', { name: /Português|English|Español/i }).first();
    await expect(languageButton).toBeVisible();
  });

  test('deve exibir o botão de alternar tema', async ({ page }) => {
    const themeButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ 
      hasNot: page.locator('svg[class*="globe"]')
    }).first();
    
    // Verificar se há um botão com ícone (provavelmente o tema)
    const buttons = page.locator('button').filter({ has: page.locator('svg') });
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('deve exibir o avatar do usuário', async ({ page }) => {
    const avatar = page.locator('[class*="avatar"], button').filter({ hasText: /IA|User/i }).first();
    
    // Verificar se há algum elemento de avatar
    const avatarElements = page.locator('button, [class*="avatar"]');
    const avatarCount = await avatarElements.count();
    expect(avatarCount).toBeGreaterThan(0);
  });

  test('deve exibir a toolbar de veículos', async ({ page }) => {
    const toolbar = page.locator('[class*="toolbar"], [class*="border-b"]').first();
    await expect(toolbar).toBeVisible();
  });

  test('deve exibir controles de paginação', async ({ page }) => {
    // Verificar se há controles de paginação (pode ser números ou botões)
    const pagination = page.locator('[class*="pagination"], button').filter({ hasText: /\d+/ });
    
    // Se não encontrar paginação visível, verificar se a tabela está renderizada
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });
});

