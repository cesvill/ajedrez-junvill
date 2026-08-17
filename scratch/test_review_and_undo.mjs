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

  // 2. Elegir Tradicional vs Bot
  console.log('2. Iniciando partida...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btnVs = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (btnVs) btnVs.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const standardBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar Ajedrez Tradicional'));
    if (standardBtn) standardBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 3. Mover 1. e4
  console.log('3. Moviendo 1. e4...');
  await page.evaluate(() => {
    const e2 = document.querySelector('.board-square[data-square="e2"]');
    const e4 = document.querySelector('.board-square[data-square="e4"]');
    if (e2 && e4) {
      e2.click();
      setTimeout(() => e4.click(), 120);
    }
  });

  // Esperar a que el bot responda
  console.log('Esperando respuesta del bot...');
  await new Promise(r => setTimeout(r, 1600));

  // 4. Probar botón "Revisar Partida (Game Review)"
  console.log('4. Haciendo clic en Revisar Partida...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const reviewBtn = buttons.find(b => b.textContent && b.textContent.includes('Revisar Partida'));
    if (reviewBtn) reviewBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/07_game_review_abierto.png' });
  console.log('Captura 7: scratch/07_game_review_abierto.png');

  // 5. Cerrar Review Modal
  console.log('5. Cerrando Review Modal...');
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[title*="Cerrar"]') || document.querySelector('.modal-card button');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 6. Mover 2. Nf3 y esperar respuesta del bot (llegar a 4 jugadas totales)
  console.log('6. Moviendo 2. Nf3...');
  await page.evaluate(() => {
    const g1 = document.querySelector('.board-square[data-square="g1"]');
    const f3 = document.querySelector('.board-square[data-square="f3"]');
    if (g1 && f3) {
      g1.click();
      setTimeout(() => f3.click(), 120);
    }
  });
  await new Promise(r => setTimeout(r, 1600));

  // 7. Clic en "Deshacer"
  console.log('7. Clic en Deshacer...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const undoBtn = buttons.find(b => b.textContent && b.textContent.includes('Deshacer'));
    if (undoBtn) undoBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/08_deshacer_jugada_exacta.png' });
  console.log('Captura 8: scratch/08_deshacer_jugada_exacta.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
