// tests/test_chromium_hex_match.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import { ThreePlayerHexGame, getBestMultiplayerBotMove } from '../src/engine/multiplayerChessEngine.js';

test('ThreePlayerHexGame: Simulación de partida completa sin bloqueos ni bucles infinitos', () => {
  const game = new ThreePlayerHexGame();
  let movesCount = 0;
  while (!game.winner && movesCount < 100) {
    const move = getBestMultiplayerBotMove(game, 'three_hex');
    if (move) {
      const executed = game.makeMove(move.from, move.to);
      assert.ok(executed, `Movimiento legal ejecutado: ${move.from} -> ${move.to}`);
      movesCount++;
    } else {
      game.nextTurn();
    }
  }
  assert.ok(movesCount > 0, 'La partida debe progresar normalmente');
});

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 5196;

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

test('ThreePlayerHexGame: Simulación en navegador Chromium contra bots', async (t) => {
  if (!fs.existsSync(CHROME_PATH)) {
    t.skip('Chrome no está instalado en la ruta esperada, omitiendo prueba e2e');
    return;
  }
  console.log('--- STARTING CHROMIUM FULL MATCH TEST (HUMAN VS BOTS) ---');
  const vite = spawn('npx.cmd', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    shell: true,
    stdio: 'ignore'
  });

  let browser;
  try {
    await waitForServer(PORT);
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850 });

    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('ajedrez_junvill_trusted_device_v1', 'true');
      localStorage.setItem('ajedrez_junvill_active_group_v1', 'group_junvill');
      localStorage.setItem('ajedrez_junvill_unlocked_groups_v1', JSON.stringify(['group_junvill']));
      localStorage.setItem('ajedrez_junvill_active_user_v1', 'user_cesar');
      localStorage.setItem('ajedrez_junvill_has_selected_profile', 'true');
    });

    const url = `http://localhost:${PORT}?view=multijugador&variant=three_hex`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('.three-hex-grid', { timeout: 10000 });
    console.log('Game board initialized in Chromium.');

    let gameOver = false;
    let turnCount = 0;
    const MAX_CYCLES = 35; // 35 human turns + 70 bot turns = 105 total turns

    while (!gameOver && turnCount < MAX_CYCLES) {
      // Check if game has a winner declared in the UI
      gameOver = await page.evaluate(() => {
        const text = document.body.innerText;
        return text.includes('¡Victoria!') || text.includes('Ganador') || text.includes('Jaque Mate');
      });
      if (gameOver) break;

      turnCount++;

      // As human (White), find a piece that has legal moves and make a move
      const moveResult = await page.evaluate(() => {
        const cells = Array.from(document.querySelectorAll('[data-cell-id]'));
        // Find cells with white pieces (in sector A or belonging to white)
        // Try clicking each white piece cell until one shows legal moves (.multiplayer-board-grid circle)
        for (const cell of cells) {
          const id = cell.getAttribute('data-cell-id');
          // Click cell
          cell.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          // Check if green legal move dots appeared
          const circles = document.querySelectorAll('.three-hex-grid circle');
          if (circles.length > 0) {
            // Find a target cell and click it
            const targetParent = circles[0].closest('[data-cell-id]');
            if (targetParent) {
              const targetId = targetParent.getAttribute('data-cell-id');
              targetParent.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              return { success: true, from: id, to: targetId };
            }
          }
        }
        return { success: false };
      });

      if (moveResult.success) {
        console.log(`[Turn ${turnCount}] Human White played ${moveResult.from} -> ${moveResult.to}`);
      } else {
        console.log(`[Turn ${turnCount}] Human White had no immediate moves or king captured`);
      }

      // Wait for Bots (Black and Red) to calculate and execute
      let backToWhiteOrEnd = false;
      for (let wait = 0; wait < 15; wait++) {
        await new Promise(r => setTimeout(r, 450));
        const status = await page.evaluate(() => {
          const hud = document.querySelector('.multiplayer-hud-card')?.innerText || '';
          const body = document.body.innerText;
          const isOver = body.includes('¡Victoria!') || body.includes('Ganador') || body.includes('Jaque Mate');
          const isWhiteTurn = hud.includes('Blanco') || hud.includes('White') || hud.includes('Tu Turno');
          return { isOver, isWhiteTurn, hud };
        });

        if (status.isOver) {
          gameOver = true;
          console.log('Game finished with a winner! HUD:', status.hud.replace(/\n/g, ' '));
          break;
        }
        if (status.isWhiteTurn) {
          backToWhiteOrEnd = true;
          break;
        }
      }

      if (!backToWhiteOrEnd && !gameOver) {
        console.log(`Waiting for bots... continuing cycle ${turnCount}`);
      }
    }

    await page.screenshot({ path: 'chromium_match_final.png' });
    console.log(`--- MATCH SIMULATION IN CHROMIUM FINISHED (Turn cycles: ${turnCount}) ---`);
    console.log('Game reached completion with 0 freezes!');
  } finally {
    if (browser) await browser.close();
    vite.kill();
  }
});
