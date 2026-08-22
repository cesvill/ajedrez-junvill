import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testAllRequests() {
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
  await page.setViewport({ width: 1280, height: 800 });

  // Inyectar usuario César y una invitación activa de Leti dirigida a César
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
    localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311'); // César

    const fakeInvitations = [
      {
        id: 'inv_test_leti',
        roomId: 'JUN77A',
        groupId: 'group_junvill',
        fromUser: {
          id: 'user_leti',
          name: 'Leti',
          avatar: 'teen_girl',
          elo: 550
        },
        toUserId: 'user_1786849943311',
        toUserName: 'César',
        timeControl: 300,
        withAssistance: false,
        createdAt: Date.now(),
        status: 'pending'
      }
    ];
    localStorage.setItem('ajedrez_junvill_family_invitations_v1', JSON.stringify(fakeInvitations));
  });

  console.log('1. Cargando HomeView con invitación de Leti...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/51_homeview_family_invitation_first.png' });
  console.log('Captura 51: scratch/51_homeview_family_invitation_first.png');

  // Verificar presencia en Home
  const homeText = await page.evaluate(() => document.body.innerText);
  console.log(' - Invitación visible en Home:', homeText.includes('Leti') && homeText.includes('Aceptar y Jugar Ahora'));

  // 2. Navegar a PlayView ("Jugar")
  console.log('\n2. Navegando a Jugar (PlayView)...');
  await page.goto('http://localhost:3000/?view=jugar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/52_playview_invitation_and_captured_pieces.png' });
  console.log('Captura 52: scratch/52_playview_invitation_and_captured_pieces.png');

  const playText = await page.evaluate(() => document.body.innerText);
  console.log(' - Invitación visible en Jugar:', playText.includes('Aceptar Reto Familiar'));
  console.log(' - Switch de ayudas visible en Jugar:', playText.includes('Ayudas'));

  // 3. Hacer una jugada y captura en PlayView para verificar CapturedPiecesBar
  console.log('\n3. Realizando jugadas para probar captura de piezas...');
  // Mover e2 a e4
  await page.evaluate(() => {
    const e2 = document.querySelector('[data-square="e2"]');
    if (e2) e2.click();
  });
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => {
    const e4 = document.querySelector('[data-square="e4"]');
    if (e4) e4.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: 'scratch/53_playview_after_moves_and_captured_bar.png' });
  console.log('Captura 53: scratch/53_playview_after_moves_and_captured_bar.png');

  // 4. Probar P2PPlayModal
  console.log('\n4. Abriendo P2P Modal...');
  await page.goto('http://localhost:3000/?view=inicio&modal=p2p', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'scratch/54_p2p_modal_lobby_family_challenges.png' });
  console.log('Captura 54: scratch/54_p2p_modal_lobby_family_challenges.png');

  await browser.close();
  console.log('=== TODOS LOS TESTS COMPLETADOS ===');
}

testAllRequests().catch(console.error);
