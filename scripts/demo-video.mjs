import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Injecter un curseur visible
async function injectCursor(page) {
  await page.addStyleTag({
    content: `
      .custom-cursor {
        width: 24px;
        height: 24px;
        border: 3px solid #ff4444;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 999999;
        transition: transform 0.1s ease;
        box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
      }
      .custom-cursor::after {
        content: '';
        width: 8px;
        height: 8px;
        background: #ff4444;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .custom-cursor.clicking {
        transform: scale(0.8);
        background: rgba(255, 68, 68, 0.3);
      }
    `
  });

  await page.evaluate(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.id = 'demo-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = (e.clientX - 12) + 'px';
      cursor.style.top = (e.clientY - 12) + 'px';
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('clicking');
    });
  });
}

// Scroll partiel (500px) pour montrer du contenu
async function scrollDown(page) {
  await page.evaluate(() => window.scrollBy({ top: 500, behavior: 'smooth' }));
}

// Scroll vers le haut
async function scrollToTop(page) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Déplacer la souris vers un élément avant de cliquer
async function moveAndClick(page, locator, description) {
  const element = typeof locator === 'string' ? page.locator(locator).first() : locator;
  if (await element.isVisible({ timeout: 3000 })) {
    await element.hover();
    await sleep(300);
    await element.click();
    console.log(`  ✓ ${description}`);
    return true;
  }
  return false;
}

async function main() {
  console.log('🎬 Démarrage de la capture vidéo...');

  const browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized']
  });

  const context = await browser.newContext({
    viewport: null,
    recordVideo: {
      dir: './demo-videos/',
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(15000);

  // Gérer les dialogues automatiquement
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  try {
    // ═══════════════════════════════════════════════════════════════
    // 1. PAGE D'ACCUEIL
    // ═══════════════════════════════════════════════════════════════
    console.log('📍 Page d\'accueil...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await sleep(2000);

    // Scroll partiel pour montrer du contenu
    await scrollDown(page);
    await sleep(1500);

    // Revenir en haut
    await scrollToTop(page);
    await sleep(1000);

    // ═══════════════════════════════════════════════════════════════
    // 2. PAGE AGENTS - Via clic sur le menu
    // ═══════════════════════════════════════════════════════════════
    console.log('📍 Page Agents...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/agents"]', 'Clic menu Agents');
    await sleep(1800);
    await scrollDown(page);
    await sleep(1500);

    // ═══════════════════════════════════════════════════════════════
    // 3. PAGE TARIFS - Via clic sur le menu
    // ═══════════════════════════════════════════════════════════════
    console.log('📍 Page Tarifs...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/pricing"]', 'Clic menu Tarifs');
    await sleep(1800);
    await scrollDown(page);
    await sleep(1500);

    // ═══════════════════════════════════════════════════════════════
    // 4. PAGE BLOG - Via clic sur le menu + ouvrir un article
    // ═══════════════════════════════════════════════════════════════
    console.log('📍 Page Blog...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/blog"]', 'Clic menu Blog');
    await sleep(1800);

    // Cliquer sur le premier article
    console.log('📰 Ouverture d\'un article...');
    await injectCursor(page);
    const articleCard = page.locator('a[href^="/blog/"]').first();
    await articleCard.hover();
    await sleep(400);
    await articleCard.click();
    await sleep(2000);

    // Scroll partiel dans l'article
    await scrollDown(page);
    await sleep(1500);

    // Retour via bouton back ou lien
    console.log('↩️ Retour...');
    await page.goBack();
    await sleep(1500);

    // ═══════════════════════════════════════════════════════════════
    // 5. PAGE CONTACT - Via clic sur le menu
    // ═══════════════════════════════════════════════════════════════
    console.log('📍 Page Contact...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/contact"]', 'Clic menu Contact');
    await sleep(1800);
    await scrollDown(page);
    await sleep(1500);

    // ═══════════════════════════════════════════════════════════════
    // 6. INSCRIPTION - Via bouton header
    // ═══════════════════════════════════════════════════════════════
    console.log('📝 Page Inscription...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/auth/signup"]', 'Clic Essai gratuit');
    await sleep(2000);

    // Remplir le formulaire (effacer d'abord)
    const nameInput = page.locator('input[type="text"]').first();
    const emailInputSignup = page.locator('input[type="email"]').first();
    const passwordInputSignup = page.locator('input[type="password"]').first();

    if (await nameInput.isVisible({ timeout: 2000 })) {
      await nameInput.hover();
      await sleep(200);
      await nameInput.click();
      await nameInput.fill(''); // Effacer
      await nameInput.type('Nicolas Demo', { delay: 40 });
      await sleep(800);
    }
    if (await emailInputSignup.isVisible({ timeout: 2000 })) {
      await emailInputSignup.hover();
      await sleep(200);
      await emailInputSignup.click();
      await emailInputSignup.fill(''); // Effacer
      await emailInputSignup.type('demo@omnia.ai', { delay: 40 });
      await sleep(800);
    }
    if (await passwordInputSignup.isVisible({ timeout: 2000 })) {
      await passwordInputSignup.hover();
      await sleep(200);
      await passwordInputSignup.click();
      await passwordInputSignup.fill(''); // Effacer
      await passwordInputSignup.type('MonMotDePasse123', { delay: 40 });
      await sleep(800);
    }

    // ═══════════════════════════════════════════════════════════════
    // 7. CONNEXION - Via lien
    // ═══════════════════════════════════════════════════════════════
    console.log('🔐 Page Connexion...');
    await injectCursor(page);
    await moveAndClick(page, 'a[href="/auth/login"]', 'Clic Connexion');
    await sleep(2000);

    // Remplir le formulaire (effacer d'abord)
    const loginEmail = page.locator('input[type="email"]').first();
    const loginPassword = page.locator('input[type="password"]').first();

    if (await loginEmail.isVisible({ timeout: 2000 })) {
      await loginEmail.hover();
      await sleep(200);
      await loginEmail.click();
      await loginEmail.fill(''); // Effacer
      await loginEmail.type('demo@omnia.ai', { delay: 40 });
      await sleep(800);
    }
    if (await loginPassword.isVisible({ timeout: 2000 })) {
      await loginPassword.hover();
      await sleep(200);
      await loginPassword.click();
      await loginPassword.fill(''); // Effacer
      await loginPassword.type('MonMotDePasse123', { delay: 40 });
      await sleep(800);
    }

    // Cliquer sur le bouton de connexion
    const loginBtn = page.getByRole('button', { name: /connexion|se connecter|login/i }).first();
    if (await loginBtn.isVisible({ timeout: 2000 })) {
      await loginBtn.hover();
      await sleep(300);
      await loginBtn.click();
      await sleep(1500);
    }

    // ═══════════════════════════════════════════════════════════════
    // 8. DASHBOARD - Présentation
    // ═══════════════════════════════════════════════════════════════
    console.log('📊 Dashboard...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await sleep(2500);

    // Scroll partiel pour montrer le dashboard
    await scrollDown(page);
    await sleep(1500);
    await scrollToTop(page);
    await sleep(1000);

    // Aller sur la page Agents du dashboard
    console.log('👥 Dashboard Agents...');
    await moveAndClick(page, 'a[href="/dashboard/agents"]', 'Clic Agents');
    await sleep(2000);
    await scrollDown(page);
    await sleep(1500);

    // Aller sur la page Settings du dashboard
    console.log('⚙️ Dashboard Settings...');
    await moveAndClick(page, 'a[href="/dashboard/settings"]', 'Clic Settings');
    await sleep(2000);
    await scrollDown(page);
    await sleep(1500);

    // ═══════════════════════════════════════════════════════════════
    // 9. CHAT - Agent Réseaux Sociaux - Créer un post Twitter
    // ═══════════════════════════════════════════════════════════════
    console.log('💬 Chat Agent Réseaux Sociaux...');
    await page.goto(`${BASE_URL}/chat?agent=4`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await sleep(2500);

    // Taper un message pour générer un post Twitter avec image
    console.log('✍️ Génération d\'un post Twitter...');
    const chatInput = page.locator('textarea').first();
    if (await chatInput.isVisible({ timeout: 5000 })) {
      await chatInput.hover();
      await sleep(300);
      await chatInput.click();
      await chatInput.fill(''); // Effacer
      await sleep(300);
      await chatInput.type('Génère un post Twitter pour promouvoir notre plateforme IA', { delay: 35 });
      await sleep(800);
      await page.keyboard.press('Enter');
      console.log('⏳ Attente génération (14 sec)...');
      await sleep(14000); // Attendre la génération complète
    }

    // Scroll pour voir la réponse
    await page.evaluate(() => {
      const messages = document.querySelector('.messages-container, .chat-messages');
      if (messages) messages.scrollTop = messages.scrollHeight;
    });
    await sleep(2500);

    // ═══════════════════════════════════════════════════════════════
    // 10. CALENDRIER - Programmer la publication
    // ═══════════════════════════════════════════════════════════════
    console.log('📅 Calendrier de Publication...');
    await page.goto(`${BASE_URL}/chat/calendar`, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await sleep(2500);

    // Ouvrir le modal de programmation
    console.log('📅 Ouverture du modal...');
    const scheduleBtn = page.getByRole('button', { name: 'Programmer un post' }).first();
    await scheduleBtn.hover();
    await sleep(400);
    await scheduleBtn.click();
    await sleep(1500);

    // Étape 1: Sélectionner Twitter
    console.log('🐦 Sélection Twitter...');
    const twitterBtn = page.getByRole('button', { name: /Twitter/i }).first();
    await twitterBtn.hover();
    await sleep(400);
    await twitterBtn.click();
    await sleep(1500);

    // Étape 2: Sélectionner un brouillon
    console.log('📋 Sélection brouillon...');
    const draftsBtn = page.getByRole('button', { name: 'Voir les brouillons' });
    if (await draftsBtn.isVisible({ timeout: 3000 })) {
      await draftsBtn.hover();
      await sleep(400);
      await draftsBtn.click();
      await sleep(1500);

      // Sélectionner le DERNIER brouillon disponible (le plus récent)
      const allDrafts = page.locator('button').filter({ hasText: /test|Découvrez|événements|plateforme|IA|Twitter/i });
      const draftCount = await allDrafts.count();
      console.log(`  📝 ${draftCount} brouillons trouvés, sélection du dernier`);
      const lastDraft = allDrafts.nth(draftCount - 1);
      if (await lastDraft.isVisible({ timeout: 3000 })) {
        await lastDraft.hover();
        await sleep(400);
        await lastDraft.click();
        await sleep(2000);

        // Étape 3: Choisir "Publier maintenant"
        console.log('🚀 Option Publier maintenant...');
        const publishNowCard = page.getByText('Publier maintenant').first();
        if (await publishNowCard.isVisible({ timeout: 3000 })) {
          await publishNowCard.hover();
          await sleep(400);
          await publishNowCard.click();
          await sleep(2000);

          // Confirmer la publication
          console.log('✅ Confirmation publication...');
          const confirmBtn = page.getByRole('button', { name: /Publier maintenant/i });
          if (await confirmBtn.isVisible({ timeout: 3000 })) {
            await confirmBtn.hover();
            await sleep(400);
            await confirmBtn.click();
            await sleep(2500);
          }
        }
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // 11. RETOUR ACCUEIL - FIN
    // ═══════════════════════════════════════════════════════════════
    console.log('🏠 Retour à l\'accueil...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await injectCursor(page);
    await sleep(2500);

    console.log('✅ Démonstration terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('🎬 Vidéo sauvegardée dans ./demo-videos/');
}

main().catch(console.error);
