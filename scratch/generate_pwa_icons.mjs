import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
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

  const svgContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            width: 512px;
            height: 512px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0a0f1d 0%, #1e1b4b 50%, #0f172a 100%);
            border-radius: 96px;
            overflow: hidden;
            box-shadow: inset 0 0 60px rgba(234, 179, 8, 0.25);
          }
          .emblem {
            width: 360px;
            height: 360px;
            filter: drop-shadow(0 12px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.5));
          }
        </style>
      </head>
      <body>
        <svg class="emblem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="30%" stop-color="#facc15" />
              <stop offset="70%" stop-color="#ca8a04" />
              <stop offset="100%" stop-color="#854d0e" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#eab308" stop-opacity="0" />
            </linearGradient>
          </defs>
          <!-- Base Baseboard -->
          <path d="M19 22H5v-2h14v2z" fill="url(#goldGrad)" />
          <path d="M18 19.5H6v-1.5h12v1.5z" fill="url(#goldGrad)" opacity="0.9" />
          <!-- King Silhouette with Jewels -->
          <path d="M17.6 7.2c-.3-.8-.9-1.4-1.7-1.8L16 2h-2l-.5 2.5c-.3.1-.7.2-1 .4L12 3l-.5 1.9c-.3-.2-.7-.3-1-.4L10 2H8l.1 3.4c-.8.4-1.4 1-1.7 1.8-.7 1.6-.2 3.5 1.1 4.5l-.5 5.3h10.2l-.5-5.3c1.3-1 1.8-2.9 1.1-4.5z" fill="url(#goldGrad)" />
          <!-- Cross & Star Sparkle -->
          <path d="M12 1.5v3M10.5 3h3" stroke="#fef08a" stroke-width="0.8" stroke-linecap="round" />
          <circle cx="12" cy="8.5" r="1.2" fill="#ffffff" opacity="0.9" />
          <circle cx="9.5" cy="11.5" r="0.8" fill="#fde047" />
          <circle cx="14.5" cy="11.5" r="0.8" fill="#fde047" />
        </svg>
      </body>
    </html>
  `;

  await page.setContent(svgContent);
  await page.setViewport({ width: 512, height: 512 });

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Icon 512x512
  await page.screenshot({ path: path.join(publicDir, 'icon-512.png'), clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('Generado: public/icon-512.png');

  // 2. Icon 192x192
  await page.setViewport({ width: 192, height: 192 });
  await page.evaluate(() => {
    document.body.style.width = '192px';
    document.body.style.height = '192px';
    document.body.style.borderRadius = '36px';
    document.querySelector('.emblem').style.width = '135px';
    document.querySelector('.emblem').style.height = '135px';
  });
  await page.screenshot({ path: path.join(publicDir, 'icon-192.png'), clip: { x: 0, y: 0, width: 192, height: 192 } });
  console.log('Generado: public/icon-192.png');

  // 3. Apple Touch Icon 180x180
  await page.setViewport({ width: 180, height: 180 });
  await page.evaluate(() => {
    document.body.style.width = '180px';
    document.body.style.height = '180px';
    document.body.style.borderRadius = '0px'; // iOS clips icons automatically
    document.querySelector('.emblem').style.width = '130px';
    document.querySelector('.emblem').style.height = '130px';
  });
  await page.screenshot({ path: path.join(publicDir, 'apple-touch-icon.png'), clip: { x: 0, y: 0, width: 180, height: 180 } });
  console.log('Generado: public/apple-touch-icon.png');

  // 4. Maskable icon 512x512
  await page.setViewport({ width: 512, height: 512 });
  await page.evaluate(() => {
    document.body.style.width = '512px';
    document.body.style.height = '512px';
    document.body.style.borderRadius = '0px'; // maskable needs solid canvas
    document.querySelector('.emblem').style.width = '300px'; // safe zone padding
    document.querySelector('.emblem').style.height = '300px';
  });
  await page.screenshot({ path: path.join(publicDir, 'icon-maskable.png'), clip: { x: 0, y: 0, width: 512, height: 512 } });
  console.log('Generado: public/icon-maskable.png');

  await browser.close();
  console.log('=== TODOS LOS ICONOS PWA GENERADOS EXITOSAMENTE ===');
}

generateIcons().catch(err => {
  console.error('Error generando iconos:', err);
  process.exit(1);
});
