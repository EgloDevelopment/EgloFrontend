import CryptoJS from "crypto-js";

export default async function decryptFile(file, name) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = () => {
      var key = window.sessionStorage.getItem("current_key");

      var decrypted = CryptoJS.AES.decrypt(reader.result, key);
      var typedArray = convertWordArrayToUint8Array(decrypted);

      var fileDec = new File([typedArray], name);

      resolve(fileDec);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

function convertWordArrayToUint8Array(wordArray) {
  var arrayOfWords = wordArray.hasOwnProperty("words") ? wordArray.words : [];
  var length = wordArray.hasOwnProperty("sigBytes")
    ? wordArray.sigBytes
    : arrayOfWords.length * 4;
  var uInt8Array = new Uint8Array(length),
    index = 0,
    word,
    i;
  for (i = 0; i < length; i++) {
    word = arrayOfWords[i];
    uInt8Array[index++] = word >> 24;
    uInt8Array[index++] = (word >> 16) & 0xff;
    uInt8Array[index++] = (word >> 8) & 0xff;
    uInt8Array[index++] = word & 0xff;
  }
  return uInt8Array;
}
