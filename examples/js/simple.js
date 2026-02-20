import { read_image } from 'monocr';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const modelPath = path.join(__dirname, '../../model/monocr.onnx');
    const charsetPath = path.join(__dirname, '../../model/charset.txt');
    const imagePath = path.join(__dirname, '../../data/images/test_0005_h71.png');

    console.log('MonOCR Simple Example\n');
    console.log('Reading image:', path.basename(imagePath));
    
    const text = await read_image(imagePath);
    console.log('\nRecognized text:');
    console.log(text);
}

main().catch(console.error);
