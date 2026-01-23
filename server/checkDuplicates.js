
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'images');

const fileCounts = {};
const collisions = [];

const foodFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

foodFolders.forEach(foodName => {
  const folderPath = path.join(IMAGES_DIR, foodName);
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    if (fileCounts[file]) {
      collisions.push({ file, existing: fileCounts[file], new: foodName });
    }
    fileCounts[file] = foodName;
  });
});

console.log(`Total Files: ${Object.keys(fileCounts).length}`);
console.log(`Total Collisions: ${collisions.length}`);

if (collisions.length > 0) {
  console.log('Sample Collisions:');
  collisions.slice(0, 10).forEach(c => {
    console.log(`${c.file}: ${c.existing} vs ${c.new}`);
  });
}
