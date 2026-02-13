const { read_image } = require('../src/index');
const path = require('path');

async function main() {
    const modelPath = path.join(__dirname, '../../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../../model/charset.txt');
    const imagePath = path.join(__dirname, '../../../preview_monocr/data/images/test_0005_h71.png');

    
    console.log('MonOCR Simple Example\n');
    console.log('Reading image:', path.basename(imagePath));
    
    const text = await read_image(imagePath, modelPath, charsetPath);
    console.log('\nRecognized text:');
    console.log(text);
}

main().catch(console.error);
