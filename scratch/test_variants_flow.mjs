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

  // 1. Clic en pestaña Jugar
  console.log('1. Navegando a Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Abrir Modal de Modalidades si no está abierto
  await page.evaluate(() => {
    const pauseBtn = document.querySelector('button[title*="Pausar"]');
    if (pauseBtn) {
      pauseBtn.click();
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const modBtn = buttons.find(b => b.textContent && b.textContent.includes('Cambiar Modalidad'));
        if (modBtn) modBtn.click();
      }, 200);
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura Paso 1: Elegir Oponente
  await page.screenshot({ path: 'scratch/01_paso1_elegir_oponente.png' });
  console.log('Captura 1: scratch/01_paso1_elegir_oponente.png');

  // 2. Clic en Contra Robots & IA para ir a Paso 2
  console.log('2. Seleccionando Robot para ir a Paso 2...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Captura Paso 2: Elegir Variante
  await page.screenshot({ path: 'scratch/02_paso2_elegir_variante.png' });
  console.log('Captura 2: scratch/02_paso2_elegir_variante.png');

  // 3. Clic en Guerra de Peones
  console.log('3. Clic en Guerra de Peones...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Practicar Guerra de Peones'));
    if (btn) {
      btn.scrollIntoView();
      btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Elegir Blancas en el modal de color
  console.log('4. Clic en Blancas...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura 3: Tablero en Vivo de Guerra de Peones
  await page.screenshot({ path: 'scratch/03_partida_guerra_peones.png' });
  console.log('Captura 3: scratch/03_partida_guerra_peones.png');

  // 5. Probar también Caballería e Infantería para verificar FEN
  console.log('5. Probando Caballería e Infantería...');
  await page.evaluate(() => {
    const pauseBtn = document.querySelector('button[title*="Pausar"]');
    if (pauseBtn) {
      pauseBtn.click();
      setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const modBtn = buttons.find(b => b.textContent && b.textContent.includes('Cambiar Modalidad'));
        if (modBtn) modBtn.click();
      }, 200);
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const botBtn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante vs'));
    if (botBtn) botBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const knightBtn = buttons.find(b => b.textContent && b.textContent.includes('Practicar Caballería'));
    if (knightBtn) {
      knightBtn.scrollIntoView();
      knightBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/04_partida_caballeria.png' });
  console.log('Captura 4: scratch/04_partida_caballeria.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
