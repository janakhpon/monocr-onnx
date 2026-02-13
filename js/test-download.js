const { MonOCR } = require('./src/index');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function testDownload() {
    console.log('Testing Model Auto-Download...');
    
    // Clear cache for testing
    const cacheDir = path.join(os.homedir(), '.monocr', 'models');
    if (fs.existsSync(cacheDir)) {
        console.log(`Cleaning cache: ${cacheDir}`);
        fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    
    const ocr = new MonOCR();
    
    try {
        console.log('Triggering download via init()...');
        await ocr.init();
        
        // Verify files exist
        const modelPath = path.join(cacheDir, 'monocr.onnx');
        
        if (fs.existsSync(modelPath)) {
            console.log('✓ Model downloaded successfully!');
            console.log(`Model size: ${(fs.statSync(modelPath).size / 1024 / 1024).toFixed(2)} MB`);
        } else {
            console.error('✗ Download failed: Files missing');
            process.exit(1);
        }
        
    } catch (err) {
        console.error('Error during test:', err);
        process.exit(1);
    }
}

testDownload();
