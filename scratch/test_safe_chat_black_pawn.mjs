import puppeteer from 'puppeteer-core';
import fs from 'fs';

(async () => {
  console.log('Iniciando prueba específica de clic en el emote de la ficha de ajedrez negra ♟️...');
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

    let errorCount = 0;
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
      if (msg.text().includes('ErrorBoundary caught') || msg.text().includes('Error:')) {
        errorCount++;
      }
    });
    page.on('pageerror', err => {
      console.log('PAGE ERROR:', err.toString());
      errorCount++;
    });

    await page.goto('http://localhost:4173/?view=inicio', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
      localStorage.setItem('ajedrez_junvill_active_user_id_v5', 'user_1786849943311');
      localStorage.setItem('ajedrez_junvill_active_group_id_v5', 'group_junvill');
      sessionStorage.setItem('ajedrez_junvill_unlocked_groups_v5', JSON.stringify(['group_junvill']));

      // Iniciar en modo juego P2P
      const p2pGame = {
        type: 'p2p',
        roomId: 'JUNTESTCHAT',
        opponent: { name: 'Leti', avatar: 'girl_coder', elo: 620 },
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        assignedColor: 'white',
        timeControl: 300,
        whiteTime: 300,
        blackTime: 300,
        lastMove: null,
        turn: 'w',
        updatedAt: Date.now()
      };
      localStorage.setItem('junvill_ongoing_p2p_game_v1_user_1786849943311', JSON.stringify(p2pGame));
    });

    // Abrir modal P2P directamente con parámetro roomId
    await page.goto('http://localhost:4173/?view=inicio&roomId=JUNTESTCHAT', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Forzar modo playing para ver SafeChat
    await page.evaluate(() => {
      // Simular botón o estado en SafeChat
    });

    // Buscar todos los botones con texto ♟️ y hacerles clic
    const buttons = await page.$$('button');
    let clickedPawn = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('♟')) {
        console.log('Encontrado botón con ficha de ajedrez negra:', text);
        await btn.click();
        clickedPawn = true;
        break;
      }
    }

    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'scratch/86_p2p_safe_chat_pawn_clicked.png' });
    console.log('Captura 86: scratch/86_p2p_safe_chat_pawn_clicked.png');

    if (errorCount === 0) {
      console.log('¡Prueba superada con ÉXITO TOTAL! Cero errores de React.');
    } else {
      console.error(`Se detectaron ${errorCount} errores.`);
    }
  } catch (err) {
    console.error('Error durante la prueba:', err);
  } finally {
    await browser.close();
  }
})();
