import CryptoJS from "crypto-js";

export default async function encrypt(text) {
  let result = CryptoJS.AES.encrypt(
    text,
    window.sessionStorage.getItem("current_key")
  ).toString();

  return result;
}
