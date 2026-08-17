import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function test() {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  let executablePath = chromePaths.find(p => fs.existsSync(p));
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    localStorage.removeItem('junvill_ongoing_game_v1_estudiante_1');
    localStorage.removeItem('junvill_ongoing_game_v1_default');
  });

  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });

  // 1. Clic en pestaña Jugar del Header
  console.log('1. Clic en pestaña Jugar del Header...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Abrir Modal de Modalidades (Paso 1)
  console.log('2. Abriendo modalidades...');
  await page.evaluate(() => {
    const pauseBtn = document.querySelector('button[title*="Pausar"]');
    if (pauseBtn) {
      pauseBtn.click();
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const modBtn = buttons.find(b => b.textContent && b.textContent.includes('Cambiar Modalidad'));
        if (modBtn) modBtn.click();
      }, 150);
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. Clic en Elegir Variante vs Robot (Paso 2)
  console.log('3. Clic en Elegir Variante vs Robot...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 4. Clic en "Guerra de Peones"
  console.log('4. Clic en Guerra de Peones...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Practicar Guerra de Peones'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  // 5. Clic en Blancas
  console.log('5. Clic en Blancas...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura tablero Guerra de Peones
  await page.screenshot({ path: 'scratch/tablero_guerra_peones_en_vivo.png' });
  console.log('Captura: scratch/tablero_guerra_peones_en_vivo.png');

  // 6. Mover peón de e2 a e4
  console.log('6. Moviendo peón...');
  await page.evaluate(() => {
    const e2 = document.querySelector('[data-square="e2"]');
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    const e4 = document.querySelector('[data-square="e4"]');
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/tablero_guerra_peones_jugada.png' });
  console.log('Captura: scratch/tablero_guerra_peones_jugada.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
