import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPlayViewFeatures() {
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

  console.log('1. Cargando PlayView vs Qwerty...');
  await page.goto('http://localhost:3000/?view=jugar&botId=qwerty', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/61_playview_game_screen.png' });
  console.log('Captura 61: scratch/61_playview_game_screen.png');

  // Mover e2 a e4, y luego bot responderá
  console.log('2. Realizando jugada e2-e4...');
  await page.evaluate(() => {
    const e2 = document.querySelector('[data-square="e2"]');
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const e4 = document.querySelector('[data-square="e4"]');
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: 'scratch/62_playview_after_moves_and_captures.png' });
  console.log('Captura 62: scratch/62_playview_after_moves_and_captures.png');

  // Probar botón rápido de desactivar ayudas
  console.log('3. Activando Modo Clásico (desactivar ayudas)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const switchBtn = buttons.find(b => b.textContent && b.textContent.includes('Ayudas'));
    if (switchBtn) switchBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/63_playview_pure_mode_active.png' });
  console.log('Captura 63: scratch/63_playview_pure_mode_active.png');

  await browser.close();
  console.log('=== TEST VISUAL DE PLAYVIEW COMPLETADO ===');
}

testPlayViewFeatures().catch(console.error);
