import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testAuth() {
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

  // Resetear localStorage para simular apertura de bienvenida
  await page.evaluateOnNewDocument(() => {
    localStorage.removeItem('ajedrez_junvill_has_selected_profile');
  });

  console.log('1. Cargando app...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 900));

  // 1. Capturar pantalla de selección de usuario
  await page.screenshot({ path: 'scratch/16_seleccion_perfil_con_candado.png' });
  console.log('Captura 16: scratch/16_seleccion_perfil_con_candado.png');

  // 2. Hacer clic en el primer usuario para solicitar contraseña
  console.log('2. Seleccionando perfil Estudiante Junvill...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const userBtn = buttons.find(b => b.textContent && b.textContent.includes('Ingresar con Clave'));
    if (userBtn) userBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/17_formulario_ingreso_password.png' });
  console.log('Captura 17: scratch/17_formulario_ingreso_password.png');

  // 3. Probar contraseña incorrecta (ej. 9999)
  console.log('3. Probando contraseña errónea (9999)...');
  await page.type('input[type="password"]', '9999');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/18_error_password_incorrecta.png' });
  console.log('Captura 18: scratch/18_error_password_incorrecta.png');

  // 4. Probar contraseña genérica correcta (JunV1ll123)
  console.log('4. Probando contraseña correcta (JunV1ll123)...');
  await page.evaluate(() => {
    const input = document.querySelector('input[type="password"]') || document.querySelector('input[type="text"]');
    if (input) input.value = '';
  });
  await page.type('input[type="password"]', 'JunV1ll123');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/19_login_exitoso_en_inicio.png' });
  console.log('Captura 19: scratch/19_login_exitoso_en_inicio.png');

  await browser.close();
  console.log('=== TEST DE AUTENTICACIÓN POR CONTRASEÑA COMPLETADO CON ÉXITO ===');
}

testAuth().catch(err => {
  console.error('Error en testAuth:', err);
  process.exit(1);
});
