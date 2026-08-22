import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testP2PAllFlows() {
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

  console.log('1. Cargando app...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Abrir Menú desplegable y hacer clic en ⚔️ Retos & Juego en Línea
  console.log('2. Abriendo menú desplegable y seleccionando Retos & Juego en Línea...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const p2pBtn = buttons.find(b => b.textContent && b.textContent.includes('Retos & Juego en Línea'));
    if (p2pBtn) p2pBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura 38: Modal P2P - Tab Reto Familiar (1 Clic)
  await page.screenshot({ path: 'scratch/38_modal_p2p_reto_familiar.png' });
  console.log('Captura 38: scratch/38_modal_p2p_reto_familiar.png');

  // Cambiar a Tab Código de Sala (Sin Guión)
  console.log('3. Cambiando a Tab Código de Sala...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const codeTab = buttons.find(b => b.textContent && b.textContent.includes('Código de Sala'));
    if (codeTab) codeTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Captura 39: Código de sala sin guión (ej: JUN8K2)
  await page.screenshot({ path: 'scratch/39_modal_p2p_codigo_sin_guiones.png' });
  console.log('Captura 39: scratch/39_modal_p2p_codigo_sin_guiones.png');

  // Cambiar a Tab Modo Espectador
  console.log('4. Cambiando a Tab Modo Espectador...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const specTab = buttons.find(b => b.textContent && b.textContent.includes('Modo Espectador'));
    if (specTab) specTab.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Captura 40: Modo Espectador en Vivo
  await page.screenshot({ path: 'scratch/40_modal_p2p_modo_espectador.png' });
  console.log('Captura 40: scratch/40_modal_p2p_modo_espectador.png');

  await browser.close();
  console.log('=== TEST DE FLUJOS P2P COMPLETADO CON ÉXITO ===');
}

testP2PAllFlows().catch(console.error);
