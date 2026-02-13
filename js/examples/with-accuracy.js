const { read_image_with_accuracy } = require('../src/index');
const path = require('path');

async function main() {
    const modelPath = path.join(__dirname, '../../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../../model/charset.txt');
    const imagePath = path.join(__dirname, '../../../preview_monocr/data/images/test_0006_h61.png');

    
    // This is the expected text from the image
    const groundTruth = 'ဗီုအာစိုပ်ကဵုလဝ်ထံက်ပၚ်သြန်(မန်ထဝ်)';
    
    console.log('MonOCR Accuracy Measurement Example\n');
    console.log('Reading image:', path.basename(imagePath));
    console.log('Ground truth:', groundTruth);
    
    const result = await read_image_with_accuracy(imagePath, groundTruth, modelPath, charsetPath);
    
    console.log('\nRecognized text:', result.text);
    console.log('Accuracy:', result.accuracy + '%');
}

main().catch(console.error);
