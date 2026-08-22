import fs from 'fs';

const files = ['database/users_db.json', 'database/users_db_backup.json'];

for (const file of files) {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      let usersArray = [];
      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].users && Array.isArray(data[0].users)) {
          // Ya está en formato de grupos
          console.log(`${file} ya está en formato de grupos.`);
          continue;
        }
        usersArray = data;
      }

      usersArray.forEach(u => {
        if (!u.password) u.password = 'JunV1ll123';
      });

      const groups = [
        {
          id: 'group_junvill',
          name: 'Familia Junvill',
          password: 'JunV1ll123',
          adminName: 'César Villamil',
          emblem: '👑',
          themeColor: '#ca8a04',
          isDefault: true,
          isProtected: true,
          createdAt: '2026-08-18',
          users: usersArray
        }
      ];

      fs.writeFileSync(file, JSON.stringify(groups, null, 2), 'utf8');
      console.log(`Migrado exitosamente ${file} a estructura de grupos.`);
    } catch (e) {
      console.error(`Error migrando ${file}:`, e);
    }
  }
}
