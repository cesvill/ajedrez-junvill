import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';
const files = [
  '28_desbloqueo_sin_revelar_clave.png',
  '29_pantalla_recuperar_contrasena.png',
  '30_error_correo_recuperacion_no_coincide.png',
  '31_exito_restablecer_contrasena.png',
  '32_grupo_desbloqueado_exitosamente.png'
];

for (const file of files) {
  const src = path.join('scratch', file);
  const dest = path.join(brainDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> ${dest}`);
  }
}
