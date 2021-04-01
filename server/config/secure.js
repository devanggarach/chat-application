const crypto = require("crypto");
var secure = {}

  // for encrypt any data we had created function named with encrypt()
  // we pass only one argument, in which we have to encrypt data
  secure.encrypt = ((val) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', process.env.KEY, process.env.IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  });
  
  // for decrypt any data we had created function named with decrypt()
  // we pass only one argument, in which we have to decrypt data
  secure.decrypt = ((encrypted) => {
    let decipher = crypto.createDecipheriv('aes-256-cbc', process.env.KEY, process.env.IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
  });

module.exports = secure;