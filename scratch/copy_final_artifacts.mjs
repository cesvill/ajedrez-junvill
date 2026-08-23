import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';

const filesToCopy = [
  { src: 'scratch/89_p2p_modal_random_color_active.png', dest: '89_p2p_modal_random_color_active.png' }
];

for (const { src, dest } of filesToCopy) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(artifactDir, dest));
    console.log(`Copiado: ${dest}`);
  }
}
