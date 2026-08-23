import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  console.log('Iniciando prueba de opciones P2P (Azar 50/50) y auto-scroll de chat...');
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

    await page.goto('http://localhost:4173/?view=jugar', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311');
      localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
      sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    // Hacer clic en "Jugar contra un Amigo / Familiar" o abrir modal P2P
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && (text.includes('Familiar') || text.includes('Amigo') || text.includes('P2P') || text.includes('En Línea'))) {
        await btn.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 1000));

    // Cambiar a la pestaña "Código de Sala"
    const tabButtons = await page.$$('button');
    for (const btn of tabButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('Código de Sala')) {
        await btn.click();
        break;
      }
    }

    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: 'scratch/88_p2p_color_selector_random.png' });
    console.log('Captura 88: scratch/88_p2p_color_selector_random.png');

    console.log('¡Prueba completada con éxito!');
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    await browser.close();
  }
})();
