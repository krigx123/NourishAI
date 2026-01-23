
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'images');

console.log(`Renaming files in: ${IMAGES_DIR}`);

if (!fs.existsSync(IMAGES_DIR)) {
  console.error('Images directory not found!');
  process.exit(1);
}

const foodFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let renameCount = 0;
let skippedCount = 0;

foodFolders.forEach(folderName => {
  const folderPath = path.join(IMAGES_DIR, folderName);
  const files = fs.readdirSync(folderPath);

  // Sanitize prefix: "Vada Pav" -> "Vada_Pav"
  const prefix = folderName.replace(/ /g, '_') + '_';

  files.forEach(file => {
    // Check if identifying prefix is already present to prevent double-renaming
    // We check if it starts with "Vada_Pav_"
    if (file.startsWith(prefix)) {
      skippedCount++;
      return;
    }

    const oldPath = path.join(folderPath, file);
    const newFilename = prefix + file;
    const newPath = path.join(folderPath, newFilename);

    try {
      fs.renameSync(oldPath, newPath);
      renameCount++;
      // console.log(`Renamed: ${file} -> ${newFilename}`);
    } catch (err) {
      console.error(`Error renaming ${file}:`, err);
    }
  });
});

console.log('-----------------------------------');
console.log(`Renaming Complete.`);
console.log(`Renamed: ${renameCount} files.`);
console.log(`Skipped: ${skippedCount} files (already renamed).`);
