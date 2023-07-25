import JSEncrypt from "jsencrypt";
import axios from "axios";

export default async function addToKeychain(username, key, id) {
  try {
    const json_1 = { username: username };
    await axios
      .post("/api/user/get-user-from-username", json_1)
      .then((response) => {
        const crypt = new JSEncrypt();
        crypt.setPublicKey(response.data.public_key);
        let result = crypt.encrypt(key);
        const json_2 = { username: username, key: result, id: id };
        axios.post("/api/user/add-to-keychain", json_2).then(() => {
          console.log("Added to keychain");
        });
      });
  } catch (e) {
    console.log(e);
  }
}
