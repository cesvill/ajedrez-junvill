import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  console.log('Iniciando prueba de reto mutuo, auto-scroll en chat y asignación al azar...');
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

      // Simular reto previo de Leti hacia César
      const invFromLeti = {
        id: 'inv_leti_to_cesar',
        roomId: 'JUNLETI7',
        groupId: 'group_junvill',
        fromUser: { id: 'user_leti_123', name: 'Leti', avatar: 'girl_coder', elo: 620 },
        toUserId: 'user_1786849943311',
        toUserName: 'César',
        timeControl: 300,
        withAssistance: true,
        createdAt: Date.now(),
        status: 'pending'
      };
      localStorage.setItem('ajedrez_junvill_family_invitations_v1', JSON.stringify([invFromLeti]));
    });

    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Abrir modal P2P
    await page.evaluate(() => {
      const btn = document.querySelector('button[title*="En Línea"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Retos de Familia') || b.textContent.includes('En Línea'));
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scratch/87_mutual_matching_p2p_modal.png' });
    console.log('Captura 87: scratch/87_mutual_matching_p2p_modal.png');

    console.log('¡Prueba completada con éxito!');
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    await browser.close();
  }
})();
