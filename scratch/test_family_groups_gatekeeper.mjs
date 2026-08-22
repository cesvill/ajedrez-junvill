import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testFamilyGroupsGatekeeper() {
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

  // Resetear sesión
  await page.evaluateOnNewDocument(() => {
    localStorage.removeItem('ajedrez_junvill_has_selected_profile');
    localStorage.removeItem('ajedrez_junvill_unlocked_groups_v5');
    localStorage.removeItem('ajedrez_junvill_active_group_id_v5');
  });

  console.log('1. Cargando app y abriendo Portal de Grupos Familiares...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Captura de la pantalla principal de grupos
  await page.screenshot({ path: 'scratch/20_portal_grupos_familiares.png' });
  console.log('Captura 20: scratch/20_portal_grupos_familiares.png');

  // 2. Seleccionar Grupo Familia Junvill
  console.log('2. Seleccionando Familia Junvill...');
  await page.evaluate(() => {
    const junvillBtn = document.querySelector('button[data-group-id="group_junvill"]');
    if (junvillBtn) junvillBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/21_desbloqueo_password_grupo_junvill.png' });
  console.log('Captura 21: scratch/21_desbloqueo_password_grupo_junvill.png');

  // 3. Probar clave incorrecta
  console.log('3. Probando clave incorrecta para grupo...');
  await page.type('input[type="password"]', 'ClaveErronea');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ path: 'scratch/22_error_clave_grupo_incorrecta.png' });
  console.log('Captura 22: scratch/22_error_clave_grupo_incorrecta.png');

  // 4. Probar clave correcta JunV1ll123
  console.log('4. Ingresando clave correcta JunV1ll123...');
  await page.evaluate(() => {
    const input = document.querySelector('input[type="password"]') || document.querySelector('input[type="text"]');
    if (input) input.value = '';
  });
  await page.type('input[type="password"]', 'JunV1ll123');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/23_seleccion_jugador_familia_junvill.png' });
  console.log('Captura 23: scratch/23_seleccion_jugador_familia_junvill.png');

  // 5. Entrar como Estudiante Junvill
  console.log('5. Entrando con Estudiante Junvill...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const studentBtn = buttons.find(b => b.textContent && b.textContent.includes('Estudiante Junvill'));
    if (studentBtn) studentBtn.click();
  });
  await new Promise(r => setTimeout(r, 900));

  await page.screenshot({ path: 'scratch/24_pantalla_principal_con_badge_familia.png' });
  console.log('Captura 24: scratch/24_pantalla_principal_con_badge_familia.png');

  // 6. Probar creación de un segundo grupo familiar (Familia Gómez)
  console.log('6. Abriendo portal para crear un segundo grupo familiar...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const groupBadge = buttons.find(b => b.textContent && b.textContent.includes('Familia Junvill'));
    if (groupBadge) groupBadge.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Clic en Cambiar Grupo
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const changeBtn = buttons.find(b => b.textContent && b.textContent.includes('Cambiar Grupo'));
    if (changeBtn) changeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // Clic en + Crear Nuevo Grupo Familiar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const createBtn = buttons.find(b => b.textContent && b.textContent.includes('Crear Nuevo Grupo Familiar'));
    if (createBtn) createBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'scratch/25_modal_crear_nuevo_grupo_familiar.png' });
  console.log('Captura 25: scratch/25_modal_crear_nuevo_grupo_familiar.png');

  // Llenar formulario de nuevo grupo
  console.log('7. Llenando datos de Familia Gómez (clave Gomez2026)...');
  await page.type('input[placeholder*="Familia Villamil"]', 'Familia Gómez');
  await page.type('input[placeholder*="Papá, Mamá"]', 'Papá Andrés');
  await page.type('input[placeholder*="mín. 4 caracteres"]', 'Gomez2026');

  // Clic en Crear Grupo y Entrar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.textContent && b.textContent.includes('Crear Grupo y Entrar'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/26_creacion_primer_jugador_familia_gomez.png' });
  console.log('Captura 26: scratch/26_creacion_primer_jugador_familia_gomez.png');

  // Crear jugador Lucas Gómez
  console.log('8. Creando jugador Lucas Gómez...');
  await page.type('input[placeholder*="Sofía, Santiago"]', 'Lucas Gómez');
  await page.evaluate(() => {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/27_jugador_lucas_gomez_activo_en_grupo_gomez.png' });
  console.log('Captura 27: scratch/27_jugador_lucas_gomez_activo_en_grupo_gomez.png');

  await browser.close();
  console.log('=== TEST DE PORTAL MULTI-GRUPO Y CAPACIDAD COMPLETADO CON ÉXITO ===');
}

testFamilyGroupsGatekeeper().catch(err => {
  console.error('Error en testFamilyGroupsGatekeeper:', err);
  process.exit(1);
});
