import crypto from "crypto"
import { KEY, IV } from './config';

export const encrypt = ((val) => {
 let cipher = crypto.createCipheriv('aes-256-cbc', KEY, IV);
 let encrypted = cipher.update(val, 'utf8', 'base64');
 encrypted += cipher.final('base64');
 return encrypted;
});

export const decrypt = ((encrypted) => {
 let decipher = crypto.createDecipheriv('aes-256-cbc', KEY, IV);
 let decrypted = decipher.update(encrypted, 'base64', 'utf8');
 return (decrypted + decipher.final('utf8'));
});

// export const encrypt = (data) => {
//     let encrypted = CryptoJS.AES.encrypt(data, KEY, { mode: CryptoJS.mode.CBC, iv: IV}).toString();
//     return encrypted;
// }
// export const decrypt = (data) => {
//     let bytes = CryptoJS.AES.decrypt(data, KEY, { mode: CryptoJS.mode.CBC, iv:IV });
//     let decrypted= bytes.toString(CryptoJS.enc.Utf8)
//     return decrypted;
// }
// import CryptoJS from 'crypto-js'
// aesEncrypt(data) {
//     let key = '6fa979f20126cb08aa645a8f495f6d85';
//     let iv = 'I8zyA4lVhMCaJ5Kg';
//     let cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Utf8.parse(iv),
//         padding: CryptoJS.pad.Pkcs7,
//         mode: CryptoJS.mode.CBC
//     });
//     console.log(cipher.toString(),"--------------------------------------------"); 
// }