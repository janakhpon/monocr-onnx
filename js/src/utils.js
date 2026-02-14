/**
 * Calculate character error rate between predicted and ground truth text
 * @param {string} predicted - Predicted text
 * @param {string} groundTruth - Ground truth text
 * @returns {number} Accuracy percentage (0-100)
 */
function calculateAccuracy(predicted, groundTruth) {
    if (!groundTruth) return 0;
    if (!predicted) return 0;
    
    const s1 = predicted;
    const s2 = groundTruth;
    
    const track = Array(s2.length + 1).fill(null).map(() =>
        Array(s1.length + 1).fill(null));

    for (let i = 0; i <= s1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= s2.length; j += 1) {
        track[j][0] = j;
    }

    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator, // substitution
            );
        }
    }
    
    const distance = track[s2.length][s1.length];
    const maxLen = Math.max(s1.length, s2.length);
    
    if (maxLen === 0) return 100;
    
    return ((1 - distance / maxLen) * 100).toFixed(2);
}

module.exports = {
    calculateAccuracy
};
