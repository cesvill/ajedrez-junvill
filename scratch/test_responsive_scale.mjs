import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testResponsive() {
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
  
  // Set storage for logged-in user
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
  });

  // Test en resolución típica de Laptop / Windows con escala (1280 x 720)
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/33_pantalla_inicio_laptop_1280x720.png' });
  console.log('Captura 33: scratch/33_pantalla_inicio_laptop_1280x720.png');

  // Test abriendo el menú desplegable en 1280x720
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'scratch/34_menu_desplegable_anclado_sin_overflow.png' });
  console.log('Captura 34: scratch/34_menu_desplegable_anclado_sin_overflow.png');

  await browser.close();
  console.log('=== TEST RESPONSIVE Y ESCALA COMPLETADO ===');
}

testResponsive().catch(console.error);
