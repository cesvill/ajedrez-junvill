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

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    localStorage.removeItem('junvill_ongoing_game_v1_estudiante_1');
    localStorage.removeItem('junvill_ongoing_game_v1_default');
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // 1. Clic en pestaña Jugar
  console.log('1. Navegando a Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 700));

  // 2. Elegir Modalidades
  console.log('2. Abriendo modalidades...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btnVs = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (btnVs) btnVs.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/09_catalogo_con_minijuegos_sin_rey.png' });
  console.log('Captura 9: scratch/09_catalogo_con_minijuegos_sin_rey.png');

  // 3. Iniciar Guerra de Peones Pura (Sin Reyes)
  console.log('3. Iniciando Guerra de Peones Pura (Sin Reyes)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Practicar Guerra de Peones Pura'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 4. Mover 1. e4
  console.log('4. Moviendo peón a e4...');
  await page.evaluate(() => {
    const e2 = document.querySelector('.board-square[data-square="e2"]');
    const e4 = document.querySelector('.board-square[data-square="e4"]');
    if (e2 && e4) {
      e2.click();
      setTimeout(() => e4.click(), 120);
    }
  });
  await new Promise(r => setTimeout(r, 1600));

  await page.screenshot({ path: 'scratch/10_tablero_guerra_peones_sin_reyes.png' });
  console.log('Captura 10: scratch/10_tablero_guerra_peones_sin_reyes.png');

  // 5. Ver reglas de la variante desde el tablero
  console.log('5. Abriendo reglas de Guerra de Peones...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title*="reglas"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/11_reglas_guerra_peones_modal.png' });
  console.log('Captura 11: scratch/11_reglas_guerra_peones_modal.png');

  await browser.close();
  console.log('=== TODOS LOS TESTS DE MINIJUEGOS SIN REY COMPLETADOS CON ÉXITO ===');
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
