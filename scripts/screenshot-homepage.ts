import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Attendre que le serveur soit prêt
  const maxAttempts = 10;
  let loaded = false;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 10000 });
      loaded = true;
      break;
    } catch (e) {
      console.log(`Tentative ${i + 1}/${maxAttempts} - Serveur pas encore prêt...`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!loaded) {
    console.error('❌ Impossible de se connecter à localhost:3000');
    await browser.close();
    process.exit(1);
  }

  console.log('✅ Page chargée avec succès');

  // Créer le dossier s'il n'existe pas
  const screenshotDir = path.join(process.cwd(), '.playwright-mcp');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  // Screenshot 1: Page complète (full page)
  const fullPagePath = path.join(screenshotDir, '01-homepage-fullpage.png');
  await page.screenshot({ path: fullPagePath, fullPage: true });
  console.log(`✅ Screenshot full page sauvegardé: ${fullPagePath}`);

  // Screenshot 2: Header et Hero Section (viewport)
  const headerHeroPath = path.join(screenshotDir, '02-homepage-header-hero.png');
  await page.screenshot({ path: headerHeroPath, fullPage: false });
  console.log(`✅ Screenshot header/hero sauvegardé: ${headerHeroPath}`);

  await browser.close();
  console.log('✅ Tous les screenshots sont prêts!');
}

takeScreenshots().catch(console.error);
