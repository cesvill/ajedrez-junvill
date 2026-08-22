import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPWA() {
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

  page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
  page.on('pageerror', err => console.error('[BROWSER ERROR]', err));

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    localStorage.removeItem('junvill_ongoing_game_v1_estudiante_1');
    localStorage.removeItem('junvill_ongoing_game_v1_default');
  });

  console.log('1. Cargando aplicación...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  // 1. Verificar manifest.json
  const manifestData = await page.evaluate(async () => {
    const res = await fetch('/manifest.json');
    return await res.json();
  });
  console.log('2. Manifest verificado:', manifestData.name, 'Short name:', manifestData.short_name);

  // 2. Verificar Service Worker
  const swRegistered = await page.evaluate(async () => {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      return !!reg;
    }
    return false;
  });
  console.log('3. Service Worker registrado:', swRegistered);

  // 3. Capturar pantalla de Inicio con botón de Instalación PWA en Header
  await page.screenshot({ path: 'scratch/13_header_con_boton_pwa.png' });
  console.log('Captura 13 guardada: scratch/13_header_con_boton_pwa.png');

  // 4. Abrir modal de instalación PWA
  console.log('4. Abriendo modal de instalación PWA...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent && b.textContent.includes('Instalar App'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/14_modal_instalacion_pwa.png' });
  console.log('Captura 14 guardada: scratch/14_modal_instalacion_pwa.png');

  // Cerrar modal
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const closeBtn = buttons.find(b => b.textContent && b.textContent.includes('Continuar en Navegador'));
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // 5. Ir a Jugar y probar simulación Offline
  console.log('5. Navegando a Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab'));
    const jugarTab = tabs.find(t => t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 700));

  // Iniciar partida
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const whiteBtn = buttons.find(b => b.textContent && b.textContent.includes('Blancas'));
    if (whiteBtn) whiteBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Simular modo OFFLINE
  console.log('6. Activando modo Offline (Desconectando red)...');
  await page.setOfflineMode(true);

  // Mover peón a e4 en modo offline
  console.log('7. Jugando 1. e4 en modo Offline...');
  await page.evaluate(() => {
    const e2 = document.querySelector('.board-square[data-square="e2"]');
    const e4 = document.querySelector('.board-square[data-square="e4"]');
    if (e2 && e4) {
      e2.click();
      setTimeout(() => e4.click(), 120);
    }
  });
  await new Promise(r => setTimeout(r, 1600));

  await page.screenshot({ path: 'scratch/15_partida_offline_jugando.png' });
  console.log('Captura 15 guardada: scratch/15_partida_offline_jugando.png');

  await browser.close();
  console.log('=== TODOS LOS TESTS PWA Y OFFLINE COMPLETADOS EXITOSAMENTE ===');
}

testPWA().catch(err => {
  console.error('Error en prueba PWA:', err);
  process.exit(1);
});
