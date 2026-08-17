import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function capture() {
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

  // Pre-configurar localStorage para simular usuario logueado
  await page.goto('http://localhost:3000/?view=inicio');
  await page.evaluate(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
  });

  console.log('1. Cargando Inicio con sesión activa...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'scratch/01_inicio_real.png' });

  console.log('2. Clic en pestaña Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'scratch/02_modalidades_real.png' });

  console.log('3. Clic en botón "Jugar vs Qwerty"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, div'));
    const btn = buttons.find(b => b.textContent && b.textContent.trim() === 'Jugar vs Qwerty');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  console.log('4. Clic en "Jugar con Blancas"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Jugar con Blancas'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 900));
  await page.screenshot({ path: 'scratch/03_tablero_partida_en_vivo.png' });

  console.log('5. Haciendo primer movimiento e4 en el tablero...');
  await page.evaluate(() => {
    // Simular clic en casilla e2 luego e4
    const squares = Array.from(document.querySelectorAll('.board-square'));
    const e2 = squares.find(s => s.getAttribute('data-square') === 'e2' || s.textContent.includes('e2'));
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const squares = Array.from(document.querySelectorAll('.board-square'));
    const e4 = squares.find(s => s.getAttribute('data-square') === 'e4' || s.textContent.includes('e4'));
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'scratch/04_tablero_jugada_hecha.png' });

  console.log('Capturas completadas con 0 errores!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
