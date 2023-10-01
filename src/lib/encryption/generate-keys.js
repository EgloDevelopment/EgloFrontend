import JSEncrypt from "jsencrypt";
import CryptoJS from "crypto-js";

export default async function generateKeys(password) {
  const crypt = new JSEncrypt();

  let publicKey = crypt.getPublicKey();
  let privateKey = CryptoJS.AES.encrypt(
    crypt.getPrivateKey(),
    password
  ).toString();

  return { publicKey, privateKey };
}
