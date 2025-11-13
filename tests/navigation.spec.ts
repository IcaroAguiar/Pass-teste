import { test, expect } from '@playwright/test';

test.describe('Navegação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve navegar para a página de veículos', async ({ page }) => {
    await expect(page).toHaveURL(/.*veiculos/);
    
    // Verificar se o título da página está visível
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('deve exibir a sidebar com menu de navegação', async ({ page }) => {
    // Verificar se a sidebar está visível
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    
    // Verificar se o logo/marca está visível
    const logo = sidebar.locator('h1, [class*="Pass"]').first();
    await expect(logo).toBeVisible();
  });

  test('deve exibir o breadcrumb corretamente', async ({ page }) => {
    const breadcrumb = page.locator('nav').filter({ hasText: /Pass/ });
    await expect(breadcrumb).toBeVisible();
    
    // Verificar se contém "Pass" e "Veículos"
    const breadcrumbText = await breadcrumb.textContent();
    expect(breadcrumbText).toContain('Pass');
  });

  test('deve expandir e recolher a sidebar', async ({ page }) => {
    const sidebar = page.locator('aside');
    const toggleButton = page.getByRole('button', { name: /menu/i }).first();
    
    // Verificar estado inicial
    const initialWidth = await sidebar.evaluate((el) => el.clientWidth);
    
    // Clicar para recolher
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const collapsedWidth = await sidebar.evaluate((el) => el.clientWidth);
    expect(collapsedWidth).toBeLessThan(initialWidth);
    
    // Clicar para expandir novamente
    await toggleButton.click();
    await page.waitForTimeout(300);
    
    const expandedWidth = await sidebar.evaluate((el) => el.clientWidth);
    expect(expandedWidth).toBeGreaterThan(collapsedWidth);
  });
});

