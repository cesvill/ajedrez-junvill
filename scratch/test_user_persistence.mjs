import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testUserPersistence() {
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

  console.log('1. Cargando aplicación en estado limpio...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Abrir Portal Familiar
  console.log('2. Abriendo Portal Familiar...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const portalBtn = buttons.find(b => b.textContent && b.textContent.includes('Portal Familiar'));
    if (portalBtn) portalBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura de usuarios en Familia Junvill
  await page.screenshot({ path: 'scratch/43_usuarios_familia_junvill.png' });
  console.log('Captura 43: scratch/43_usuarios_familia_junvill.png');

  // Clic en + Agregar Jugador
  console.log('3. Creando nuevo jugador "Sofia Villamil"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const addBtn = buttons.find(b => b.textContent && b.textContent.includes('Agregar Jugador'));
    if (addBtn) addBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Escribir nombre
  await page.type('input[placeholder*="Sofía"]', 'Sofia Villamil');
  await new Promise(r => setTimeout(r, 300));

  // Enviar formulario
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 1000));

  // Recargar la página completa para verificar persistencia en almacenamiento
  console.log('4. RECARGANDO LA PÁGINA (F5) para verificar persistencia...');
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Volver a abrir Portal Familiar tras el reload
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const menuBtn = buttons.find(b => b.textContent && b.textContent.includes('Menú'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const portalBtn = buttons.find(b => b.textContent && b.textContent.includes('Portal Familiar'));
    if (portalBtn) portalBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Captura 44: Verificando que Sofia Villamil sigue existiendo tras F5
  await page.screenshot({ path: 'scratch/44_usuarios_persistidos_tras_reload.png' });
  console.log('Captura 44: scratch/44_usuarios_persistidos_tras_reload.png');

  const textContent = await page.evaluate(() => document.body.innerText);
  const hasCesar = textContent.includes('César') || textContent.includes('Cesar');
  const hasEstudiante = textContent.includes('Estudiante Junvill');
  const hasSofia = textContent.includes('Sofia Villamil');

  console.log('Verificación de usuarios en Familia Junvill tras reload:');
  console.log(' - César presente:', hasCesar);
  console.log(' - Estudiante Junvill presente:', hasEstudiante);
  console.log(' - Sofia Villamil persistida:', hasSofia);

  await browser.close();
  console.log('=== TEST DE PERSISTENCIA COMPLETADO ===');
}

testUserPersistence().catch(console.error);
