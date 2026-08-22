import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';
const files = [
  '33_pantalla_inicio_laptop_1280x720.png',
  '34_menu_desplegable_anclado_sin_overflow.png'
];

for (const file of files) {
  const src = path.join('scratch', file);
  const dest = path.join(brainDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> ${dest}`);
  }
}
