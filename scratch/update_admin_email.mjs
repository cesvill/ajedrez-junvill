import fs from 'fs';

const files = ['database/users_db.json', 'database/users_db_backup.json'];

for (const file of files) {
  if (fs.existsSync(file)) {
    try {
      const groups = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(groups)) {
        groups.forEach(g => {
          if (g.id === 'group_junvill') {
            g.adminEmail = 'junvill13@gmail.com';
          }
        });
        fs.writeFileSync(file, JSON.stringify(groups, null, 2), 'utf8');
        console.log(`Actualizado ${file} con adminEmail: junvill13@gmail.com.`);
      }
    } catch (e) {
      console.error(`Error en ${file}:`, e);
    }
  }
}
