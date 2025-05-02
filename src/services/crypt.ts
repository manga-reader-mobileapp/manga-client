/* @ts-ignore */
import * as CryptoJS from "crypto-js";

const secretKeyCrypt = process.env.CRYPT_SECRET ?? "Manga123";

const crypt = (value: string) => {
  return CryptoJS.AES.encrypt(value, secretKeyCrypt).toString();
};

const decrypt = (cvalue: string) => {
  if (!cvalue) return;
  const bytes = CryptoJS.AES.decrypt(cvalue, secretKeyCrypt);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { crypt, decrypt, secretKeyCrypt };
