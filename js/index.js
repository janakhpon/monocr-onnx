const ort = require('onnxruntime-node');
const sharp = require('sharp');
const fs = require('fs');

class MonOCR {
    constructor(modelPath, charsetPath) {
        this.modelPath = modelPath;
        this.charsetPath = charsetPath;
        this.session = null;
        this.charset = "";
    }

    async init() {
        this.session = await ort.InferenceSession.create(this.modelPath);
        if (this.charsetPath) {
            this.charset = fs.readFileSync(this.charsetPath, 'utf-8').trim();
        }
    }

    async preprocess(imagePath) {
        // Load image, convert to grayscale, resize height to 64
        const metadata = await sharp(imagePath).metadata();
        const targetHeight = 64;
        const targetWidth = Math.round(targetHeight * (metadata.width / metadata.height));

        const buffer = await sharp(imagePath)
            .grayscale()
            .resize(targetWidth, targetHeight)
            .raw()
            .toBuffer();

        const float32Data = new Float32Array(buffer.length);
        for (let i = 0; i < buffer.length; i++) {
            float32Data[i] = buffer[i] / 255.0;
        }
        
        // Return tensor as [1, 1, 64, W]
        // Note: Check if dims should be [batch, channel, height, width]
        return new ort.Tensor('float32', float32Data, [1, 1, targetHeight, targetWidth]); 
    }

    decode(preds) {
        const idx2char = {};
        for (let i = 0; i < this.charset.length; i++) {
            idx2char[i + 1] = this.charset[i];
        }

        let decodedText = "";
        let prevIdx = -1;

        // Preds is flat array? Need to argmax along last dim (num_classes)
        // Output shape: [1, sequence_length, num_classes]
        // We'll simplisticly argmax here assuming standard ONNX output structure
        
        // This part requires careful handling of tensor output shape.
        // Assuming preds is the raw logits tensor data
        
        // Implementing argmax logic on the flattened data
        const numClasses = this.charset.length + 1; // +1 for blank
        const sequenceLength = preds.data.length / numClasses;

        for (let t = 0; t < sequenceLength; t++) {
             let maxVal = -Infinity;
             let maxIdx = 0;
             for (let c = 0; c < numClasses; c++) {
                 const val = preds.data[t * numClasses + c];
                 if (val > maxVal) {
                     maxVal = val;
                     maxIdx = c;
                 }
             }
             
             if (maxIdx !== 0 && maxIdx !== prevIdx) {
                 decodedText += idx2char[maxIdx] || "";
             }
             prevIdx = maxIdx;
        }

        return decodedText;
    }

    async predict(imagePath) {
        if (!this.session) await this.init();
        
        const inputTensor = await this.preprocess(imagePath);
        
        const feeds = {};
        feeds[this.session.inputNames[0]] = inputTensor;
        
        const results = await this.session.run(feeds);
        const outputTensor = results[this.session.outputNames[0]];
        
        return this.decode(outputTensor);
    }
}

module.exports = MonOCR;
