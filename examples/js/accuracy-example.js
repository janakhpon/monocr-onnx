import { read_image_with_accuracy } from 'monocr';
import { fileURLToPath } from 'url';
import { dirname, join, basename } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
    console.log('MonOCR Accuracy Measurement Example\n');
    
    const imagePath = join(__dirname, '../../data/images/test_0005_h71.png');
    
    // Expected text
    const groundTruth = 'ဂကောံမန်နာနာတံထံက်ပၚ်သြန်ကုသ္ိကၟိန်ညးဒးဒုၚ်ပန်ပ္ဍဲကွာန်ပါၚ်မၚ်ဂၠန်(၂)တၠ';
    
    console.log('Reading image:', basename(imagePath));
    console.log('Ground Truth :', groundTruth);
    console.log('---');
    
    try {
        const result = await read_image_with_accuracy(imagePath, groundTruth);
        
        console.log('Recognized   :', result.text);
        console.log('Accuracy     :', result.accuracy.toFixed(2) + '%');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
