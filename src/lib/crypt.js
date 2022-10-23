import CryptoJS from 'crypto-js';

const secret = process.env.REACT_APP_CRYPT_SECRET;

/**
 * @name encrypt
 * @param {string|Object} content
 * @returns {string}
 */
export function encrypt(content) {
  return CryptoJS.AES.encrypt(JSON.stringify(content), secret).toString();
}

/**
 * @name decrypt
 * @param {string} content
 * @returns {string|Object}
 */
export function decrypt(content) {
  const bytes = CryptoJS.AES.decrypt(content, secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
