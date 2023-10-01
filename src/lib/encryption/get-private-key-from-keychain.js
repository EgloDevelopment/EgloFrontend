import axios from "axios";
import JSEncrypt from "jsencrypt";

export default function getPrivateKey(id) {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/user/get-key", { id: id })
      .then((response) => {
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(window.sessionStorage.getItem("private_key"));
        let result = crypt.decrypt(response.data[0].key);
        resolve(result);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
