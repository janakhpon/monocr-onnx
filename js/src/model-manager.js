const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { pipeline } = require('stream/promises');

class ModelManager {
    constructor() {
        // Default cache directory in user's home
        this.cacheDir = path.join(os.homedir(), '.monocr', 'models');
        
        // HuggingFace model URL
        this.baseUrl = 'https://huggingface.co/janakhpon/monocr/resolve/main';
        this.modelFileName = 'monocr.onnx';
        this.hfModelPath = 'onnx/monocr.onnx';
    }

    /**
     * Ensure cache directory exists
     */
    ensureCacheDir() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }

    /**
     * Get local path for the model
     */
    getModelPath() {
        return path.join(this.cacheDir, this.modelFileName);
    }

    /**
     * Check if model exists locally
     */
    hasModel() {
        return fs.existsSync(this.getModelPath());
    }

    /**
     * Download a file from HuggingFace
     */
    async downloadFile(url, destPath) {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(destPath);
            
            const request = (requestUrl) => {
                https.get(requestUrl, { headers: { 'User-Agent': 'monocr-npm' } }, (response) => {
                    if ([301, 302, 307, 308].includes(response.statusCode)) {
                        let redirectUrl = response.headers.location;
                        if (!redirectUrl.startsWith('http')) {
                            const originalUrl = new URL(requestUrl);
                            redirectUrl = `${originalUrl.protocol}//${originalUrl.host}${redirectUrl}`;
                        }
                        request(redirectUrl);
                    } else if (response.statusCode === 200) {
                        const totalSize = parseInt(response.headers['content-length'], 10);
                        let downloadedSize = 0;
                        
                        response.on('data', (chunk) => {
                            downloadedSize += chunk.length;
                            if (totalSize) {
                                const progress = ((downloadedSize / totalSize) * 100).toFixed(1);
                                process.stdout.write(`\r  Downloading model: ${progress}% (${(downloadedSize / 1024 / 1024).toFixed(2)} MB)`);
                            }
                        });

                        response.pipe(file);
                        
                        file.on('finish', () => {
                            file.close();
                            process.stdout.write('\n');
                            resolve();
                        });
                    } else {
                        reject(new Error(`Failed to download: ${response.statusCode}`));
                    }
                }).on('error', (err) => {
                    fs.unlink(destPath, () => {});
                    reject(err);
                });
            };

            request(url);
            
            file.on('error', (err) => {
                fs.unlink(destPath, () => {});
                reject(err);
            });
        });
    }

    /**
     * Download model file
     */
    async downloadModel() {
        this.ensureCacheDir();
        
        console.log('Downloading monocr model from HuggingFace...');
        console.log(`Cache directory: ${this.cacheDir}`);
        
        const modelUrl = `${this.baseUrl}/${this.hfModelPath}`;
        const destPath = this.getModelPath();
        
        await this.downloadFile(modelUrl, destPath);
        console.log('✓ Model downloaded successfully!');
    }

    /**
     * Get model path, downloading if needed
     */
    async ensureModel() {
        if (!this.hasModel()) {
            await this.downloadModel();
        }
        return this.getModelPath();
    }
}

module.exports = ModelManager;

module.exports = ModelManager;
