import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';

const filesToCopy = [
  { src: 'scratch/81_home_outgoing_challenge_banner.png', dest: '81_home_outgoing_challenge_banner.png' },
  { src: 'scratch/84_home_with_outgoing_and_ongoing_p2p.png', dest: '84_home_with_outgoing_and_ongoing_p2p.png' },
  { src: 'scratch/85_p2p_modal_reconnected_and_active.png', dest: '85_p2p_modal_reconnected_and_active.png' }
];

for (const { src, dest } of filesToCopy) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(artifactDir, dest));
    console.log(`Copiado: ${dest}`);
  }
}
