import JSEncrypt from "jsencrypt";

import makePostRequest from "../other/make-post-request";

export default function getPrivateKey(id) {
  return new Promise((resolve, reject) => {
    makePostRequest("/api/user-data/get-decryption-key", { id: id })
      .then((response) => {
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(window.sessionStorage.getItem("private_key"));
        let result = crypt.decrypt(response[0].key);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
