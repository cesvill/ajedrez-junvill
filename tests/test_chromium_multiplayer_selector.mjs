// tests/test_chromium_multiplayer_selector.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5197;

async function waitForServer(port, maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:${port}`, res => {
          if (res.statusCode >= 200 && res.statusCode < 400) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
      });
      return true;
    } catch (e) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  throw new Error(`Server did not start on port ${port}`);
}

test('Multiplayer Landscape: Selector de Modalidades y conmutación fluida', async (t) => {
  if (!fs.existsSync(CHROME_PATH)) {
    t.skip('Chrome no está instalado en la ruta esperada');
    return;
  }

  const vite = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  let browser;
  try {
    await waitForServer(PORT);
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', async msg => {
      try {
        const args = await Promise.all(msg.args().map(a => a.jsonValue().catch(() => a.toString())));
        console.log('PAGE CONSOLE:', msg.type(), JSON.stringify(args));
      } catch (e) {
        console.log('PAGE CONSOLE:', msg.text());
      }
    });
    page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

    // Configurar viewport en orientación horizontal (Landscape)
    await page.setViewport({ width: 960, height: 480, isLandscape: true });

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('ajedrez_junvill_trusted_device_v1', 'true');
      localStorage.setItem('ajedrez_junvill_active_group_v1', 'group_junvill');
      localStorage.setItem('ajedrez_junvill_unlocked_groups_v1', JSON.stringify(['group_junvill']));
      localStorage.setItem('ajedrez_junvill_active_user_v1', 'user_cesar');
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    });

    // 1. Cargar directamente ?view=multijugador
    await page.goto(`http://localhost:${PORT}/?view=multijugador`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // 2. Tomar captura de pantalla de inmediato
    await page.screenshot({ path: 'tests/hub_landscape_screenshot.png' });

    const debugInfo = await page.evaluate(() => {
      return {
        url: window.location.href,
        htmlSnippet: document.body.innerText.slice(0, 500),
        hasHub: Boolean(document.querySelector('.multiplayer-hub-screen')),
        classes: document.body.className
      };
    });
    console.log('DEBUG INFO:', debugInfo);

    // 3. Verificar que se muestre el Hub selector de modalidades
    const hubExists = await page.evaluate(() => {
      const hub = document.querySelector('.multiplayer-hub-screen');
      if (!hub) return false;
      const text = hub.innerText;
      return (
        text.includes('Chaturaji') &&
        text.includes('4 en Cruz') &&
        text.includes('Hexagonal') &&
        text.includes('Circular')
      );
    });
    assert.ok(hubExists, 'El Hub selector de modalidades debe mostrar las 4 opciones en horizontal');

    // 4. Hacer clic en "Jugar 4 en Cruz"
    const clickedFourPlayer = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Jugar 4 en Cruz'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert.ok(clickedFourPlayer, 'Debe existir el botón Jugar 4 en Cruz');

    await new Promise(r => setTimeout(r, 1000));

    // 5. Verificar que ahora estamos en la partida de 4 en Cruz
    const inFourPlayerGame = await page.evaluate(() => {
      const board = document.querySelector('.four-player-board-container, .multiplayer-board-area');
      const sidebar = document.querySelector('.multiplayer-sidebar-area');
      const hasFourPlayerText = sidebar ? sidebar.innerText.includes('4 en Cruz') : false;
      return Boolean(board) && hasFourPlayerText;
    });
    assert.ok(inFourPlayerGame, 'Debe haber entrado a la partida de Ajedrez 4 en Cruz');

    // 6. Probar botón "Cambiar" para volver al Hub selector
    const clickedCambiar = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Cambiar'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert.ok(clickedCambiar, 'Debe existir el botón Cambiar en el sidebar');

    await new Promise(r => setTimeout(r, 1000));

    // 7. Verificar que regresó al Hub selector
    const backInHub = await page.evaluate(() => {
      return Boolean(document.querySelector('.multiplayer-hub-screen'));
    });
    assert.ok(backInHub, 'Al pulsar Cambiar debe regresar al Hub selector de modalidades');

    // 8. Hacer clic en "Jugar Tres Hexagonal"
    const clickedHex = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.innerText.includes('Jugar 3 Hexagonal'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    assert.ok(clickedHex, 'Debe existir el botón Jugar 3 Hexagonal');

    await new Promise(r => setTimeout(r, 1000));

    // 9. Verificar que cargó el tablero hexagonal
    const inHexGame = await page.evaluate(() => {
      const svgHex = document.querySelector('svg polygon, .three-hex-grid, .multiplayer-board-area');
      const sidebar = document.querySelector('.multiplayer-sidebar-area');
      const hasHexText = sidebar ? sidebar.innerText.includes('Hexagonal') : false;
      return Boolean(svgHex) && hasHexText;
    });
    assert.ok(inHexGame, 'Debe haber entrado a la partida de Ajedrez Tres Hexagonal');

  } finally {
    if (browser) await browser.close();
    vite.kill();
  }
});
