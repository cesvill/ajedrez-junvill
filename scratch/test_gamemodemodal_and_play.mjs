import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testGameModeAndPlay() {
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

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err));

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

  console.log('1. Navegando a Jugar...');
  await page.goto('http://localhost:3000/?view=jugar', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await browser.close();
}

testGameModeAndPlay().catch(console.error);
