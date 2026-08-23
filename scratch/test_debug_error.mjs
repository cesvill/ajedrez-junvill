import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const executablePath = chromePaths.find(p => fs.existsSync(p));

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    await page.goto('http://localhost:4173/?view=inicio', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311');
      localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
      sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));

      const p2pGame = {
        type: 'p2p',
        roomId: 'JUN9988',
        opponent: { name: 'Leti', avatar: 'girl_coder', elo: 620 },
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        assignedColor: 'white',
        timeControl: 300,
        whiteTime: 295,
        blackTime: 290,
        lastMove: { san: 'e5', from: 'e7', to: 'e5' },
        turn: 'w',
        updatedAt: Date.now()
      };
      localStorage.setItem('junvill_ongoing_p2p_game_v1_user_1786849943311', JSON.stringify(p2pGame));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Hacer clic en "Reanudar Partida"
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Reanudar Partida')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1500));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
