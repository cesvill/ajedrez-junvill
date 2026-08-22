import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testCaptureBarVisual() {
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
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
    localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311'); // César
  });

  await page.goto('http://localhost:3000/?view=jugar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  // Iniciar partida
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante'));
    if (startBtn) startBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tradBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar Ajedrez Tradicional'));
    if (tradBtn) tradBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar con Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // 1. e4 (Qwerty responde e5)
  console.log('Jugada 1: e2 -> e4');
  await page.evaluate(() => {
    const e2 = document.querySelector('[data-square="e2"]');
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const e4 = document.querySelector('[data-square="e4"]');
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 1800));

  // 2. d4 (Centro. Qwerty capturará exd4)
  console.log('Jugada 2: d2 -> d4');
  await page.evaluate(() => {
    const d2 = document.querySelector('[data-square="d2"]');
    if (d2) d2.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const d4 = document.querySelector('[data-square="d4"]');
    if (d4) d4.click();
  });
  await new Promise(r => setTimeout(r, 2000)); // Esperar respuesta de Qwerty

  await page.screenshot({ path: 'scratch/78_qwerty_captured_pawn_plus_one.png' });
  console.log('Captura 78: scratch/78_qwerty_captured_pawn_plus_one.png');

  // 3. Qxd4 (d1 -> d4 captura peón negro)
  console.log('Jugada 3: d1 -> d4 (Qxd4)');
  await page.evaluate(() => {
    const d1 = document.querySelector('[data-square="d1"]');
    if (d1) d1.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const d4 = document.querySelector('[data-square="d4"]');
    if (d4) d4.click();
  });
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'scratch/79_both_players_captured_pawns.png' });
  console.log('Captura 79: scratch/79_both_players_captured_pawns.png');

  await browser.close();
}

testCaptureBarVisual().catch(console.error);
