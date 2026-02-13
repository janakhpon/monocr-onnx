const MonOCR = require('./index');
const path = require('path');
const fs = require('fs');

async function runExample() {
    const modelPath = path.join(__dirname, '../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../model/charset.txt');
    const imagesDir = path.join(__dirname, '../../preview_monocr/data/images');

    console.log('--- MonOCR JavaScript Example ---');
    console.log(`Loading model: ${modelPath}`);
    
    const monocr = new MonOCR(modelPath, charsetPath);
    await monocr.init();

    if (!fs.existsSync(imagesDir)) {
        console.error(`Images directory not found: ${imagesDir}`);
        return;
    }

    const files = fs.readdirSync(imagesDir)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .sort();

    console.log(`Found ${files.length} images.\n`);

    for (const file of files) {
        const filePath = path.join(imagesDir, file);
        console.log(`Processing: ${file}...`);
        
        try {
            // For general images, we use predictPage which handles multiple lines
            const results = await monocr.predictPage(filePath);
            
            if (results.length === 0) {
                console.log('  [No text detected]');
            } else {
                results.forEach((res, i) => {
                    console.log(`  Line ${i + 1}: "${res.text}"`);
                });
            }
        } catch (err) {
            console.error(`  Error processing ${file}:`, err.message);
        }
        console.log('-'.repeat(40));
    }
}

runExample().catch(err => {
    console.error('Fatal Error:', err);
});
