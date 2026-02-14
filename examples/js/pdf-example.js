import { read_pdf } from 'monocr';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('MonOCR PDF Example (using published npm package)\n');
    
    // Test PDF (provide your own PDF path)
    const pdfPath = process.argv[2] || join(__dirname, '../../data/pdfs/party_mission.pdf');
    
    console.log('Reading PDF:', pdfPath);
    console.log('Model: Auto-downloading/cached');
    console.log();
    
    try {
        console.log('Processing PDF... (this may take a moment)\n');
        const pages = await read_pdf(pdfPath);
        
        pages.forEach((text, index) => {
            console.log(`Page ${index + 1}:`);
            console.log('='.repeat(50));
            console.log(text);
            console.log('='.repeat(50));
            console.log();
        });
        
        console.log(`Total pages: ${pages.length}`);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('\nMake sure:');
        console.error('1. PDF file exists');
        console.error('2. GraphicsMagick or ImageMagick is installed for PDF processing');
    }
}

main();
