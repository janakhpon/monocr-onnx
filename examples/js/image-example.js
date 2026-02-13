import { read_image } from 'monocr';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('MonOCR Image Example (using published npm package)\n');
    
    // Test image
    const imagePath = join(__dirname, '../../data/images/test_0005_h71.png');
    
    console.log('Reading image:', imagePath);
    console.log('Model: Auto-downloading/cached');
    console.log();
    
    try {
        const text = await read_image(imagePath);
        
        console.log('Recognized Text:');
        console.log('================');
        console.log(text);
        console.log('================');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
