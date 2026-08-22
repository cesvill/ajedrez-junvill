import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testRecovery() {
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

  // Resetear sesión
  await page.evaluateOnNewDocument(() => {
    localStorage.removeItem('ajedrez_junvill_has_selected_profile');
    sessionStorage.removeItem('ajedrez_junvill_unlocked_groups_v5');
    localStorage.removeItem('ajedrez_junvill_active_group_id_v5');
  });

  console.log('1. Cargando app...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Clic en Familia Junvill
  console.log('2. Clic en grupo Familia Junvill...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[data-group-id="group_junvill"]');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/28_desbloqueo_sin_revelar_clave.png' });
  console.log('Captura 28: scratch/28_desbloqueo_sin_revelar_clave.png');

  // 2. Clic en ¿Olvidaste la contraseña del grupo?
  console.log('3. Clic en ¿Olvidaste la contraseña del grupo?...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const forgotBtn = buttons.find(b => b.textContent && b.textContent.includes('Olvidaste la contraseña'));
    if (forgotBtn) forgotBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/29_pantalla_recuperar_contrasena.png' });
  console.log('Captura 29: scratch/29_pantalla_recuperar_contrasena.png');

  // 3. Probar correo incorrecto
  console.log('4. Probando correo incorrecto (desconocido@gmail.com)...');
  await page.type('input[type="email"]', 'desconocido@gmail.com');
  await page.type('input[type="password"]', 'ClaveNueva123');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/30_error_correo_recuperacion_no_coincide.png' });
  console.log('Captura 30: scratch/30_error_correo_recuperacion_no_coincide.png');

  // 4. Ingresar correo correcto junvill13@gmail.com y nueva contraseña
  console.log('5. Ingresando correo correcto (junvill13@gmail.com) y restableciendo contraseña...');
  await page.evaluate(() => {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) emailInput.value = '';
    const pwdInput = document.querySelector('input[type="password"]');
    if (pwdInput) pwdInput.value = '';
  });
  await page.type('input[type="email"]', 'junvill13@gmail.com');
  await page.type('input[type="password"]', 'JunV1ll123');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 900));

  await page.screenshot({ path: 'scratch/31_exito_restablecer_contrasena.png' });
  console.log('Captura 31: scratch/31_exito_restablecer_contrasena.png');

  await new Promise(r => setTimeout(r, 1600));

  // 5. Desbloquear el grupo con la contraseña
  console.log('6. Desbloqueando grupo con la contraseña...');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 900));

  await page.screenshot({ path: 'scratch/32_grupo_desbloqueado_exitosamente.png' });
  console.log('Captura 32: scratch/32_grupo_desbloqueado_exitosamente.png');

  await browser.close();
  console.log('=== TEST DE RECUPERACIÓN DE CONTRASEÑA COMPLETADO CON ÉXITO ===');
}

testRecovery().catch(err => {
  console.error('Error en testRecovery:', err);
  process.exit(1);
});
