import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testHeaderAndUsers() {
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

  // 1. TEST DESKTOP VIEWPORT
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 750 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

  console.log('1. Cargando desktop 1280x750...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Captura del header limpio en desktop
  await page.screenshot({ path: 'scratch/45_desktop_header_clean.png' });
  console.log('Captura 45: scratch/45_desktop_header_clean.png');

  // Abrir ProfileModal para ver la lista de usuarios y el banner de Familia Junvill
  console.log('2. Abriendo ProfileModal...');
  await page.evaluate(() => {
    const profileBtn = document.querySelector('.profile-button');
    if (profileBtn) profileBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/46_profile_modal_with_family_banner.png' });
  console.log('Captura 46: scratch/46_profile_modal_with_family_banner.png');

  // Verificar presencia de César, Estudiante, Leti y Martin
  const profileText = await page.evaluate(() => document.body.innerText);
  console.log('Verificación en ProfileModal:');
  console.log(' - César presente:', profileText.includes('César') || profileText.includes('Cesar'));
  console.log(' - Estudiante Junvill presente:', profileText.includes('Estudiante Junvill'));
  console.log(' - Leti presente:', profileText.includes('Leti'));
  console.log(' - Martin presente:', profileText.includes('Martin'));
  console.log(' - Banner Familia Junvill presente:', profileText.includes('Familia Junvill'));

  // 2. TEST MOBILE VIEWPORT (iPhone 390x844)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  console.log('\n3. Cargando mobile 390x844 (iPhone)...');
  await mobilePage.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await mobilePage.screenshot({ path: 'scratch/47_mobile_smartphone_header_clean.png' });
  console.log('Captura 47: scratch/47_mobile_smartphone_header_clean.png');

  await browser.close();
  console.log('=== TEST DE HEADER Y USUARIOS COMPLETADO ===');
}

testHeaderAndUsers().catch(console.error);
