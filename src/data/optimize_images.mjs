import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const IMAGES_DIR = path.join(__dirname, '../../public/images');
const TARGET_WIDTH = 400; // Optimal for gallery cards
const QUALITY = 80;

// Helper to recursively find files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function main() {
  console.log('🖼️  Starting image optimization...');
  console.log(`📂 Scanning directory: ${IMAGES_DIR}`);

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error('❌ Images directory not found!');
    process.exit(1);
  }

  const allFiles = getAllFiles(IMAGES_DIR);
  
  // Filter for images that are NOT already small versions
  const imageFiles = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const isImage = ['.webp', '.jpg', '.jpeg', '.png'].includes(ext);
    const isAlreadyOptimized = file.includes('_sm.');
    return isImage && !isAlreadyOptimized;
  });

  console.log(`Found ${imageFiles.length} candidate images.`);

  let processedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const file of imageFiles) {
    const ext = path.extname(file);
    // Construct new filename: image.webp -> image_sm.webp
    const newFile = file.replace(ext, `_sm${ext}`);

    if (fs.existsSync(newFile)) {
      skippedCount++;
      continue;
    }

    try {
      await sharp(file)
        .resize(TARGET_WIDTH)
        .webp({ quality: QUALITY }) // Convert everything to optimized WebP
        .toFile(newFile.replace(ext, '_sm.webp')); // Force .webp extension for consistency

      console.log(`✅ Generated: ${path.basename(newFile)}`);
      processedCount++;
    } catch (err) {
      console.error(`❌ Error processing ${path.basename(file)}:`, err.message);
      errorCount++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`✨ Processed: ${processedCount}`);
  console.log(`⏭️  Skipped (already exists): ${skippedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

main();
