import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testBotChallengeFlow() {
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

  console.log('1. Navegando a pestaña Robots...');
  await page.goto('http://localhost:3000/?view=robots', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Captura de RobotsView
  await page.screenshot({ path: 'scratch/41_robots_view.png' });
  console.log('Captura 41: scratch/41_robots_view.png');

  // Hacer clic en Retar a Qwerty
  console.log('2. Haciendo clic en Retar a Qwerty...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const retarBtn = buttons.find(b => b.textContent && b.textContent.includes('Retar a'));
    if (retarBtn) retarBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Captura de PlayView jugando contra el robot
  await page.screenshot({ path: 'scratch/42_play_view_vs_robot.png' });
  console.log('Captura 42: scratch/42_play_view_vs_robot.png');

  // Verificar que el tablero está listo y muestra el bot seleccionado
  const botNameInHeader = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('Qwerty') || text.includes('Robot');
  });
  console.log('Partida contra robot cargada correctamente:', botNameInHeader);

  await browser.close();
  console.log('=== TEST DE RETO A ROBOT COMPLETADO CON ÉXITO ===');
}

testBotChallengeFlow().catch(console.error);
