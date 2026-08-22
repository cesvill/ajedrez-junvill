import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';
const files = [
  '45_desktop_header_clean.png',
  '46_profile_modal_with_family_banner.png',
  '47_mobile_smartphone_header_clean.png',
  '48_desktop_top_bar_clean.png',
  '49_menu_dropdown_with_install_and_portal.png',
  '50_smartphone_screen_clean_header.png'
];

for (const file of files) {
  const src = path.join('scratch', file);
  const dest = path.join(brainDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copiado: ${file} -> ${dest}`);
  }
}
