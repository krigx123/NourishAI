
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'images');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'datasetMapping.json');

console.log(`Scanning images from: ${IMAGES_DIR}`);

const mapping = {};
let count = 0;

try {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`Error: Images directory not found at ${IMAGES_DIR}`);
    process.exit(1);
  }

  const foodFolders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // 1. First pass: Count occurrences
  const fileCounts = {};
  
  foodFolders.forEach(foodName => {
    const folderPath = path.join(IMAGES_DIR, foodName);
    const files = fs.readdirSync(folderPath);
    files.forEach(file => {
      fileCounts[file] = (fileCounts[file] || 0) + 1;
    });
  });

  // 2. Second pass: Map only unique files
  foodFolders.forEach(foodName => {
    const folderPath = path.join(IMAGES_DIR, foodName);
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
      // ONLY map if file is unique to this folder
      if (fileCounts[file] === 1) {
        mapping[file] = foodName;
        count++;
      } else {
        // console.log(`Skipping duplicate: ${file}`);
      }
    });
  });

  console.log(`Skipped ${Object.keys(fileCounts).length - count} duplicate filenames.`);

  // Ensure output dir exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));
  console.log(`Success! Generated mapping for ${count} images.`);
  console.log(`Saved to: ${OUTPUT_FILE}`);

} catch (err) {
  console.error('Error generating mapping:', err);
}
