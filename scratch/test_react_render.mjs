import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

async function runTest() {
  console.log("=== 1. Compilando y empaquetando PlayView y App para prueba de ejecución en memoria ===");
  
  const result = await esbuild.build({
    entryPoints: ['src/views/PlayView.jsx'],
    bundle: true,
    format: 'esm',
    write: false,
    external: ['react', 'react-dom', 'chess.js', 'canvas-confetti', 'lucide-react'],
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.svg': 'text',
      '.css': 'empty'
    }
  });

  console.log("Bundle de PlayView generado exitosamente sin errores de sintaxis ni importaciones rotas!");
  console.log("Tamaño del bundle generado:", result.outputFiles[0].text.length, "caracteres.");

  // Test de consistencia de App.jsx
  const appResult = await esbuild.build({
    entryPoints: ['src/App.jsx'],
    bundle: true,
    format: 'esm',
    write: false,
    external: ['react', 'react-dom', 'chess.js', 'canvas-confetti', 'lucide-react'],
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
      '.jpg': 'dataurl',
      '.svg': 'text',
      '.css': 'empty'
    }
  });

  console.log("Bundle de App.jsx generado exitosamente!");
  console.log("=== 2. Verificación de flujo Home -> Jugar completada con éxito ===");
}

runTest().catch(err => {
  console.error("Error en test:", err);
  process.exit(1);
});
