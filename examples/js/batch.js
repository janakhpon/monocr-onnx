import { MonOCR } from 'monocr';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const modelPath = path.join(__dirname, '../../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../../model/charset.txt');
    const imagesDir = path.join(__dirname, '../../data/images');

    console.log('MonOCR Batch Processing Example\n');
    
    const ocr = new MonOCR();
    await ocr.init();
    
    const files = fs.readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort();
    
    console.log(`Processing ${files.length} images...\n`);
    
    for (const file of files) {
        const filePath = path.join(imagesDir, file);
        
        try {
            const results = await ocr.predictPage(filePath);
            const text = results.map(r => r.text).join('\n');
            
            console.log(`[${file}]`);
            console.log(text);
            console.log('-'.repeat(50));
        } catch (err) {
            console.error(`Error processing ${file}:`, err.message);
        }
    }
}

main().catch(console.error);
