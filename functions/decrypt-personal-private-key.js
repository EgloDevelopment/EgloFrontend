import CryptoJS from "crypto-js";

export default async function decryptPrivateKey(
  privateKey_encrypted,
  password
) {
  let privateKey = CryptoJS.AES.decrypt(
    privateKey_encrypted,
    password
  ).toString(CryptoJS.enc.Utf8);

  return privateKey;
}
