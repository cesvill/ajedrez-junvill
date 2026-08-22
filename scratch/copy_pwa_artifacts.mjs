import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';
const files = [
  '13_header_con_boton_pwa.png',
  '14_modal_instalacion_pwa.png',
  '15_partida_offline_jugando.png'
];

for (const file of files) {
  const src = path.join('scratch', file);
  const dest = path.join(brainDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> ${dest}`);
  }
}
