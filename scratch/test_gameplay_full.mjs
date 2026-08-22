import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testGameplayFull() {
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

  console.log('1. Cargando Jugar...');
  await page.goto('http://localhost:3000/?view=jugar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));

  console.log('2. Clic en Elegir Variante...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const startBtn = buttons.find(b => b.textContent && b.textContent.includes('Elegir Variante'));
    if (startBtn) startBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('3. Clic en Jugar Ajedrez Tradicional...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const tradBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar Ajedrez Tradicional'));
    if (tradBtn) tradBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  console.log('4. Clic en Jugar con Blancas...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Jugar con Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/70_playview_in_game_live.png' });
  console.log('Captura 70: scratch/70_playview_in_game_live.png');

  // Mover e2 a e4
  console.log('5. Moviendo peón de e2 a e4...');
  await page.evaluate(() => {
    const e2 = document.querySelector('[data-square="e2"]');
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 250));
  await page.evaluate(() => {
    const e4 = document.querySelector('[data-square="e4"]');
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 1800)); // Esperar respuesta de Qwerty

  await page.screenshot({ path: 'scratch/71_playview_after_robot_move.png' });
  console.log('Captura 71: scratch/71_playview_after_robot_move.png');

  // Probar botón rápido de desactivar todas las ayudas
  console.log('6. Clic en botón rápido de desactivar ayudas...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const assistBtn = buttons.find(b => b.textContent && b.textContent.includes('Ayudas y Pistas'));
    if (assistBtn) assistBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.screenshot({ path: 'scratch/72_playview_pure_mode_activated.png' });
  console.log('Captura 72: scratch/72_playview_pure_mode_activated.png');

  await browser.close();
  console.log('=== TEST COMPLETADO CON ÉXITO ===');
}

testGameplayFull().catch(console.error);
