import { test, expect } from '@playwright/test';

test.describe('Troca de Idioma', () => {
  test.beforeEach(async ({ page }) => {
    // Limpar localStorage antes de cada teste
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      localStorage.removeItem('pass-language');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('deve mostrar Português como idioma padrão', async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    
    // Verificar se o botão existe (pode ter ícone de globo)
    const languageButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /Português|English|Español/ }).first();
    
    // Ou tentar encontrar pelo aria-label
    const buttonByAria = page.getByRole('button', { name: /Selecionar idioma/i });
    
    // Verificar se pelo menos um dos botões existe
    const buttonExists = await buttonByAria.count() > 0 || await languageButton.count() > 0;
    expect(buttonExists).toBeTruthy();
    
    // Verificar se o atributo lang do HTML é pt-BR
    await page.waitForTimeout(1000); // Aguardar hidratação
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('pt-BR');
  });

  test('deve trocar para English quando clicar em English', async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Encontrar o botão de idioma pelo aria-label ou pelo ícone de globo
    const languageButton = page.getByRole('button', { name: /Selecionar idioma/i }).first();
    await languageButton.waitFor({ state: 'visible' });
    await languageButton.click();
    
    // Aguardar o dropdown abrir
    await page.waitForTimeout(300);
    
    // Clicar em English
    const englishOption = page.getByRole('menuitem', { name: /English/i });
    await englishOption.waitFor({ state: 'visible' });
    await englishOption.click();
    
    // Aguardar um pouco para a atualização
    await page.waitForTimeout(1000);
    
    // Verificar se o atributo lang do HTML mudou para en-US
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en-US');
    
    // Verificar se foi salvo no localStorage
    const storedLanguage = await page.evaluate(() => {
      return localStorage.getItem('pass-language');
    });
    expect(storedLanguage).toBe('en');
  });

  test('deve trocar para Español quando clicar em Español', async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Encontrar o botão de idioma
    const languageButton = page.getByRole('button', { name: /Selecionar idioma/i }).first();
    await languageButton.waitFor({ state: 'visible' });
    await languageButton.click();
    
    // Aguardar o dropdown abrir
    await page.waitForTimeout(300);
    
    // Clicar em Español
    const spanishOption = page.getByRole('menuitem', { name: /Español/i });
    await spanishOption.waitFor({ state: 'visible' });
    await spanishOption.click();
    
    // Aguardar um pouco para a atualização
    await page.waitForTimeout(1000);
    
    // Verificar se o atributo lang do HTML mudou para es-ES
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('es-ES');
    
    // Verificar se foi salvo no localStorage
    const storedLanguage = await page.evaluate(() => {
      return localStorage.getItem('pass-language');
    });
    expect(storedLanguage).toBe('es');
  });

  test('deve manter o idioma após recarregar a página', async ({ page }) => {
    await page.goto('/veiculos');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Trocar para English
    const languageButton = page.getByRole('button', { name: /Selecionar idioma/i }).first();
    await languageButton.waitFor({ state: 'visible' });
    await languageButton.click();
    await page.waitForTimeout(300);
    
    const englishOption = page.getByRole('menuitem', { name: /English/i });
    await englishOption.waitFor({ state: 'visible' });
    await englishOption.click();
    await page.waitForTimeout(1000);
    
    // Recarregar a página
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Verificar se ainda está em English (atributo lang)
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en-US');
  });
});

