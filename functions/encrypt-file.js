import CryptoJS from "crypto-js";

export default async function encryptFile(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => {
      var key = window.sessionStorage.getItem("current_key");
      var wordArray = CryptoJS.lib.WordArray.create(reader.result);
      var encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

      var fileEnc = new File([encrypted], file.name);

      resolve(fileEnc);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}
