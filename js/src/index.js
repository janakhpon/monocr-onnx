const MonOCR = require('./monocr');
const { calculateAccuracy } = require('./utils');

module.exports = {
    MonOCR,
    calculateAccuracy,
    read_image,
    read_pdf,
    read_image_with_accuracy
};

/**
 * Read text from an image file
 * @param {string} imagePath - Path to image file
 * @param {string} modelPath - Path to ONNX model (optional, auto-downloads if not provided)
 * @param {string} charsetPath - Path to charset file (optional, auto-downloads if not provided)
 * @returns {Promise<string>} Recognized text
 */
async function read_image(imagePath, modelPath = null, charsetPath = null) {
    const ocr = new MonOCR(modelPath, charsetPath);
    await ocr.init();
    const results = await ocr.predictPage(imagePath);
    return results.map(r => r.text).join('\n');
}

/**
 * Read text from a PDF file
 * @param {string} pdfPath - Path to PDF file
 * @param {string} modelPath - Path to ONNX model (optional, auto-downloads if not provided)
 * @param {string} charsetPath - Path to charset file (optional, auto-downloads if not provided)
 * @returns {Promise<string[]>} Array of text per page
 */
async function read_pdf(pdfPath, modelPath = null, charsetPath = null) {
    const { fromPath } = require('pdf2pic');
    const path = require('path');
    const fs = require('fs');
    const os = require('os');
    
    const ocr = new MonOCR(modelPath, charsetPath);
    await ocr.init();
    
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'monocr-'));
    
    const converter = fromPath(pdfPath, {
        density: 300,
        format: 'png',
        width: 2480,
        height: 3508,
        saveFilename: 'page',
        savePath: tempDir
    });
    
    const pages = [];
    let pageNum = 1;
    
    while (true) {
        try {
            const result = await converter(pageNum, { responseType: 'image' });
            const imagePath = result.path;
            const results = await ocr.predictPage(imagePath);
            const pageText = results.map(r => r.text).join('\n');
            pages.push(pageText);
            pageNum++;
        } catch (err) {
            break;
        }
    }
    
    // Cleanup temp directory
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    return pages;
}

/**
 * Read text from an image with accuracy measurement
 * @param {string} imagePath - Path to image file
 * @param {string} groundTruth - Expected text for accuracy calculation
 * @param {string} modelPath - Path to ONNX model (optional, auto-downloads if not provided)
 * @param {string} charsetPath - Path to charset file (optional, auto-downloads if not provided)
 * @returns {Promise<{text: string, accuracy: number}>}
 */
async function read_image_with_accuracy(imagePath, groundTruth, modelPath = null, charsetPath = null) {
    const text = await read_image(imagePath, modelPath, charsetPath);
    const accuracy = calculateAccuracy(text, groundTruth);
    return { text, accuracy: parseFloat(accuracy) };
}
