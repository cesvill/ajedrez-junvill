import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testLoggedInHeader() {
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
  await page.setViewport({ width: 1280, height: 750 });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
    localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311'); // César
  });

  console.log('1. Navegando con sesión activa de César en Desktop...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/48_desktop_top_bar_clean.png' });
  console.log('Captura 48: scratch/48_desktop_top_bar_clean.png');

  // Clic en Menú desplegable para verificar que Instalar App y Portal Familiar están adentro
  console.log('2. Abriendo menú desplegable...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/49_menu_dropdown_with_install_and_portal.png' });
  console.log('Captura 49: scratch/49_menu_dropdown_with_install_and_portal.png');

  // 3. Test Smartphone iPhone (390x844)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await mobilePage.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
    localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311');
  });

  console.log('3. Navegando en Smartphone...');
  await mobilePage.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await mobilePage.screenshot({ path: 'scratch/50_smartphone_screen_clean_header.png' });
  console.log('Captura 50: scratch/50_smartphone_screen_clean_header.png');

  await browser.close();
  console.log('=== TEST DE TOP BAR LIMPIO COMPLETADO ===');
}

testLoggedInHeader().catch(console.error);
