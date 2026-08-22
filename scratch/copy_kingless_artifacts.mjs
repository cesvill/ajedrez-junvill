import fs from 'fs';

const copyImg = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${src} -> ${dest}`);
  }
};

const artifactDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';

copyImg('scratch/09_catalogo_con_minijuegos_sin_rey.png', `${artifactDir}/catalogo_minijuegos_sin_rey.png`);
copyImg('scratch/10_tablero_guerra_peones_sin_reyes.png', `${artifactDir}/tablero_guerra_peones_sin_reyes.png`);
copyImg('scratch/11_reglas_guerra_peones_modal.png', `${artifactDir}/modal_reglas_guerra_peones.png`);
