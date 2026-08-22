import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testP2PDebug() {
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

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
  });

  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Abrir Menú
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Clic en Retos & Juego en Línea
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const p2pBtn = buttons.find(b => b.textContent && b.textContent.includes('Retos & Juego en Línea'));
    console.log('Encontrado boton P2P:', !!p2pBtn);
    if (p2pBtn) p2pBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/38_modal_p2p_debug.png' });
  console.log('Captura tomada');

  await browser.close();
}

testP2PDebug().catch(console.error);
