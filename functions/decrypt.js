import CryptoJS from "crypto-js";

export default async function decrypt(text) {
  let result = CryptoJS.AES.decrypt(
    text,
    window.sessionStorage.getItem("current_key")
  ).toString(CryptoJS.enc.Utf8);

  return result;
}