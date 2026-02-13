const { MonOCR } = require('../src/index');
const path = require('path');
const fs = require('fs');

async function main() {
    const modelPath = path.join(__dirname, '../../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../../model/charset.txt');
    const imagesDir = path.join(__dirname, '../../../preview_monocr/data/images');

    
    console.log('MonOCR Batch Processing Example\n');
    
    const ocr = new MonOCR(modelPath, charsetPath);
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
