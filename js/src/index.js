const MonOCR = require('./monocr');
const { calculateAccuracy } = require('./utils');

module.exports = {
    MonOCR,
    calculateAccuracy,
    read_image,
    read_images,
    read_pdf,
    read_pdfs,
    read_image_with_accuracy
};

/**
 * Read text from an image file
 * @param {string} imagePath - Path to image file
 * @param {string} modelPath - Path to ONNX model (optional)
 * @param {string} charsetPath - Path to charset file (optional)
 * @returns {Promise<string>} Recognized text
 */
async function read_image(imagePath, modelPath = null, charsetPath = null) {
    const ocr = new MonOCR(modelPath, charsetPath);
    await ocr.init();
    const results = await ocr.predictPage(imagePath);
    return results.map(r => r.text).join('\n');
}

/**
 * Read text from multiple image files
 * @param {string[]} imagePaths - Array of paths to image files
 * @param {string} modelPath - Path to ONNX model (optional)
 * @param {string} charsetPath - Path to charset file (optional)
 * @returns {Promise<string[]>} Array of recognized text
 */
async function read_images(imagePaths, modelPath = null, charsetPath = null) {
    const ocr = new MonOCR(modelPath, charsetPath);
    await ocr.init();
    
    const results = [];
    for (const path of imagePaths) {
        const pageResults = await ocr.predictPage(path);
        results.push(pageResults.map(r => r.text).join('\n'));
    }
    return results;
}

/**
 * Read text from a PDF file
 * @param {string} pdfPath - Path to PDF file
 * @param {string} modelPath - Path to ONNX model (optional, auto-downloads if not provided)
 * @param {string} charsetPath - Path to charset file (optional, auto-downloads if not provided)
 * @returns {Promise<string[]>} Array of text per page
 */
async function read_pdf(pdfPath, modelPath = null, charsetPath = null) {
    const pdfImgConvert = require('pdf-img-convert');
    const path = require('path');
    const fs = require('fs');
    
    // Initialize OCR
    const ocr = new MonOCR(modelPath, charsetPath);
    await ocr.init();
    
    try {
        // Convert PDF to image buffers (returns Uint8Array[])
        // pdf-img-convert handles parsing internally using pdf.js
        const imageBuffers = await pdfImgConvert.convert(pdfPath, {
            width: 2480,  // High resolution for OCR
            height: 3508,
            page_numbers: [] // All pages
        });

        if (!imageBuffers || imageBuffers.length === 0) {
            throw new Error("Failed to convert PDF: No images generated");
        }

        const pages = [];
        
        for (let i = 0; i < imageBuffers.length; i++) {
            // pdf-img-convert returns Uint8Array (buffer-like)
            // MonOCR's predictPage expects a file path or sharp-compatible input
            // sharp can take a Buffer.
            const buffer = Buffer.from(imageBuffers[i]);
            
            const results = await ocr.predictPage(buffer);
            const pageText = results.map(r => r.text).join('\n');
            pages.push(pageText);
        }
        
        return pages;
    } catch (err) {
        throw new Error(`Failed to process PDF: ${err.message}`);
    }
}

/**
 * Read text from multiple PDF files
 * @param {string[]} pdfPaths - Array of paths to PDF files
 * @param {string} modelPath - Path to ONNX model (optional)
 * @param {string} charsetPath - Path to charset file (optional)
 * @returns {Promise<string[][]>} Array of arrays of text per page
 */
async function read_pdfs(pdfPaths, modelPath = null, charsetPath = null) {
    const results = [];
    for (const path of pdfPaths) {
        const pages = await read_pdf(path, modelPath, charsetPath);
        results.push(pages);
    }
    return results;
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
