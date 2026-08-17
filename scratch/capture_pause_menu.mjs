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

  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });

  // 1. Clic en pestaña Jugar
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 2. Clic en Jugar vs Qwerty
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div'));
    const btn = buttons.find(b => b.textContent && b.textContent.trim() === 'Jugar vs Qwerty');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 3. Clic en Blancas
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 4. Clic en el botón de Pausa usando title o selector
  console.log('Abriendo menú de pausa...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Pausar"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/menu_pausa_actualizado.png' });
  console.log('Captura guardada: scratch/menu_pausa_actualizado.png');

  await browser.close();
}

test().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
