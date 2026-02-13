/**
 * Calculate character error rate between predicted and ground truth text
 * @param {string} predicted - Predicted text
 * @param {string} groundTruth - Ground truth text
 * @returns {number} Accuracy percentage (0-100)
 */
function calculateAccuracy(predicted, groundTruth) {
    if (!groundTruth) return 0;
    
    const len = Math.max(predicted.length, groundTruth.length);
    if (len === 0) return 100;
    
    let errors = 0;
    for (let i = 0; i < len; i++) {
        if (predicted[i] !== groundTruth[i]) {
            errors++;
        }
    }
    
    return ((1 - errors / len) * 100).toFixed(2);
}

module.exports = {
    calculateAccuracy
};
