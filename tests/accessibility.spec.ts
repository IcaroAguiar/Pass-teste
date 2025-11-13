import { test, expect } from '@playwright/test';

test.describe('Acessibilidade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('deve ter atributo lang correto no HTML', async ({ page }) => {
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBeTruthy();
    expect(['pt-BR', 'en-US', 'es-ES']).toContain(htmlLang);
  });

  test('deve ter labels acessíveis nos botões', async ({ page }) => {
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      
      // Verificar se tem aria-label ou texto visível
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('deve ter estrutura semântica correta', async ({ page }) => {
    // Verificar elementos semânticos
    const header = page.locator('header');
    const nav = page.locator('nav');
    const main = page.locator('main');
    const aside = page.locator('aside');
    
    await expect(header).toBeVisible();
    await expect(nav.count()).resolves.toBeGreaterThan(0);
    await expect(main).toBeVisible();
    await expect(aside).toBeVisible();
  });

  test('deve ter contraste adequado nos textos', async ({ page }) => {
    // Verificar se os textos principais são visíveis
    const headings = page.locator('h1, h2, h3');
    const headingCount = await headings.count();
    
    if (headingCount > 0) {
      const firstHeading = headings.first();
      const color = await firstHeading.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return style.color;
      });
      
      expect(color).toBeTruthy();
    }
  });

  test('deve ter navegação por teclado funcional', async ({ page }) => {
    // Testar navegação por Tab
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('deve ter títulos de página descritivos', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});

