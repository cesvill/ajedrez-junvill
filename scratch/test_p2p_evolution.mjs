import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testP2PEvolution() {
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
  });

  console.log('1. Abriendo P2P Modal...');
  await page.goto('http://localhost:3000/?view=p2p', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Captura 1: Tab 1 Reto Familiar (1 Clic)
  await page.screenshot({ path: 'scratch/35_p2p_lobby_retos_familiares.png' });
  console.log('Captura 35: scratch/35_p2p_lobby_retos_familiares.png');

  // Clic en Tab 2: Código de Sala (Sin Guión)
  console.log('2. Cambiando a Tab Código de Sala...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const codeTab = buttons.find(b => b.textContent && b.textContent.includes('Código de Sala'));
    if (codeTab) codeTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Captura 2: Código de Sala sin guiones
  await page.screenshot({ path: 'scratch/36_p2p_codigo_sin_guiones.png' });
  console.log('Captura 36: scratch/36_p2p_codigo_sin_guiones.png');

  // Clic en Tab 3: Modo Espectador
  console.log('3. Cambiando a Tab Modo Espectador...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const specTab = buttons.find(b => b.textContent && b.textContent.includes('Modo Espectador'));
    if (specTab) specTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Captura 3: Modo Espectador
  await page.screenshot({ path: 'scratch/37_p2p_modo_espectador.png' });
  console.log('Captura 37: scratch/37_p2p_modo_espectador.png');

  await browser.close();
  console.log('=== TEST DE EVOLUCIÓN P2P COMPLETADO CON ÉXITO ===');
}

testP2PEvolution().catch(console.error);
