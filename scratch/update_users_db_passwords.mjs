import fs from 'fs';

const files = ['database/users_db.json', 'database/users_db_backup.json'];

for (const file of files) {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data)) {
        data.forEach(u => {
          u.password = 'JunV1ll123';
        });
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Actualizado ${file} con contraseña JunV1ll123.`);
      }
    } catch (e) {
      console.error(`Error actualizando ${file}:`, e);
    }
  }
}
