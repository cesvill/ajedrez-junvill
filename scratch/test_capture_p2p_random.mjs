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

    await page.goto('http://localhost:4173/?view=jugar', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311');
      localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
      sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // 1. Clic en "Elegir Variante vs Qwerty" o "Partida Online"
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Abrir Sala Online')) {
        await btn.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 800));

    // 2. Cambiar a la pestaña "Código de Sala"
    const tabButtons = await page.$$('button');
    for (const btn of tabButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Código de Sala')) {
        await btn.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'scratch/89_p2p_modal_random_color_active.png' });
    console.log('Captura 89: scratch/89_p2p_modal_random_color_active.png');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
