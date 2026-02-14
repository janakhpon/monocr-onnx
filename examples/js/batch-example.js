import { read_images } from 'monocr';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('MonOCR Batch Processing Example\n');
    
    // Directory containing images
    const imagesDir = join(__dirname, '../../data/images');
    
    // Filter for image files
    const files = readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort()
        .map(f => join(imagesDir, f));

    console.log(`Processing ${files.length} images from ${basename(imagesDir)}...\n`);
    
    try {
        // Process images in batch
        const results = await read_images(files);
        
        for (let i = 0; i < files.length; i++) {
            console.log(`[${basename(files[i])}]`);
            console.log(results[i]);
            console.log('-'.repeat(50));
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
