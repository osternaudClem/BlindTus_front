/**
 * @name addLeadingZeros
 * @param {number} num
 * @param {number} totalLength
 * @returns {string}
 */
export function addLeadingZeros(num, totalLength) {
  return String(num).padStart(totalLength, '0');
}
