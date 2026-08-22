import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';
const files = [
  '20_portal_grupos_familiares.png',
  '21_desbloqueo_password_grupo_junvill.png',
  '22_error_clave_grupo_incorrecta.png',
  '23_seleccion_jugador_familia_junvill.png',
  '24_pantalla_principal_con_badge_familia.png',
  '25_modal_crear_nuevo_grupo_familiar.png',
  '26_creacion_primer_jugador_familia_gomez.png',
  '27_jugador_lucas_gomez_activo_en_grupo_gomez.png'
];

for (const file of files) {
  const src = path.join('scratch', file);
  const dest = path.join(brainDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> ${dest}`);
  }
}
