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
  });

  // 1. Cargar la app en Inicio
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });

  // 2. Ir a Jugar
  console.log('Navegando a Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Clic exacto en el botón "Jugar Dados Mágicos"
  console.log('Clic en "Jugar Dados Mágicos"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const diceBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar Dados Mágicos'));
    if (diceBtn) diceBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 4. Elegir Blancas
  console.log('Seleccionando Blancas...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 5. Tirar el dado mágico
  console.log('Lanzando el dado mágico...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const rollBtn = buttons.find(b => b.textContent && (b.textContent.includes('Lanzar') || b.textContent.includes('Relanzar')));
    if (rollBtn) rollBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/dados_magicos_jugada_legal.png' });
  console.log('Captura guardada: scratch/dados_magicos_jugada_legal.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
