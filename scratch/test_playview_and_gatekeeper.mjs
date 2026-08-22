import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testPlayViewAndGatekeeper() {
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

  console.log('1. Cargando inicio...');
  await page.goto('http://localhost:3000/?view=inicio', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  console.log('2. Clic en pestaña Jugar...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.desktop-nav-tab, button'));
    const jugarTab = tabs.find(t => t.textContent && t.textContent.includes('Jugar'));
    if (jugarTab) jugarTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/55_playview_active_with_invitation_and_switches.png' });
  console.log('Captura 55: scratch/55_playview_active_with_invitation_and_switches.png');

  // Mover e2 a e4, luego bot mueve e7 a e5 o c7 a c5
  console.log('3. Realizando jugadas para probar capturas...');
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

  await page.screenshot({ path: 'scratch/56_playview_gameplay.png' });
  console.log('Captura 56: scratch/56_playview_gameplay.png');

  // 4. Abrir Portal Familiar (Gatekeeper) para verificar invitaciones familiares adentro
  console.log('4. Abriendo Portal Familiar...');
  await page.goto('http://localhost:3000/?view=inicio&modal=familia', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: 'scratch/57_family_portal_with_invitations.png' });
  console.log('Captura 57: scratch/57_family_portal_with_invitations.png');

  await browser.close();
  console.log('=== TEST COMPLETADO CON ÉXITO ===');
}

testPlayViewAndGatekeeper().catch(console.error);
