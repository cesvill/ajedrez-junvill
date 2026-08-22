import fs from 'fs';
import path from 'path';

const artifactDir = 'C:\\Users\\Cesar Villamil\\.gemini\\antigravity\\brain\\d28adc4a-2e80-4ac3-8724-f297dbd3a4e3';

const filesToCopy = [
  { src: 'scratch/51_homeview_family_invitation_first.png', dest: '51_homeview_family_invitation_first.png' },
  { src: 'scratch/57_family_portal_with_invitations.png', dest: '57_family_portal_with_invitations.png' },
  { src: 'scratch/58_gamemodemodal_with_family_invitation.png', dest: '58_gamemodemodal_with_family_invitation.png' },
  { src: 'scratch/70_playview_in_game_live.png', dest: '70_playview_in_game_live.png' },
  { src: 'scratch/72_playview_pure_mode_activated.png', dest: '72_playview_pure_mode_activated.png' },
  { src: 'scratch/80_captured_pawn_and_advantage_badge.png', dest: '80_captured_pawn_and_advantage_badge.png' }
];

for (const { src, dest } of filesToCopy) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(artifactDir, dest));
    console.log(`Copiado: ${dest}`);
  }
}
