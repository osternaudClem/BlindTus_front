import CryptoJS from 'crypto-js';
import { crypt } from '../config';

export function encrypt(content) {
  return CryptoJS.AES.encrypt(JSON.stringify(content), crypt.secret).toString();
}

export function decrypt(content) {
  const bytes = CryptoJS.AES.decrypt(content, crypt.secret);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}