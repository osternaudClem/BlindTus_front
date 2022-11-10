/**
 * @name addLeadingZeros
 * @param {number} num
 * @param {number} totalLength
 * @returns {string}
 */
export function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}

/**
 * @name calculScore
 * @param {number} timeLeft
 * @param {number} timeLimit
 * @returns {number}
 */
export function calculScore(timeLeft, timeLimit) {
  return Math.round((timeLeft * 100) / timeLimit / 10);
}
