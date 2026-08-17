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

  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });

  // 1. Clic en pestaña Jugar
  console.log('1. Navegando a Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Abrir selector de modalidades
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

  // 3. Clic en Elegir Variante vs Robot
  console.log('3. Clic en Elegir Variante vs Robot...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // 4. Clic en botón "Reglas" de la tarjeta Rey de la Colina
  console.log('4. Abriendo modal de reglas de Rey de la Colina...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rulesBtn = buttons.find(b => b.title && b.title.includes('Rey de la Colina'));
    if (rulesBtn) rulesBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/05_modal_reglas_rey_colina.png' });
  console.log('Captura 5: scratch/05_modal_reglas_rey_colina.png');

  // 5. Cerrar modal de reglas haciendo clic en "¡Entendido, a jugar!"
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const okBtn = buttons.find(b => b.textContent && b.textContent.includes('Entendido'));
    if (okBtn) okBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 6. Iniciar partida de Guerra de Peones
  console.log('6. Iniciando partida de Guerra de Peones...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Practicar Guerra de Peones'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 7. En plena partida, hacer clic en "Ver Reglas de Guerra de Peones" en el bocadillo del tutor
  console.log('7. Abriendo reglas en plena partida desde el bocadillo del tutor...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rulesInGameBtn = buttons.find(b => b.textContent && b.textContent.includes('Ver Reglas de Guerra de Peones'));
    if (rulesInGameBtn) rulesInGameBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/06_modal_reglas_en_plena_partida.png' });
  console.log('Captura 6: scratch/06_modal_reglas_en_plena_partida.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
