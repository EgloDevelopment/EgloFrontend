import JSEncrypt from "jsencrypt";

import makePostRequest from "../other/make-post-request";

export default async function addToKeychain(username, key, id) {
  try {
    await makePostRequest("/api/user-data/get-profile-from-username", {
      username: username,
    }).then((response) => {
      const crypt = new JSEncrypt();
      crypt.setPublicKey(response.public_key);
      let result = crypt.encrypt(key);
      makePostRequest("/api/user-data/add-to-keychain", {
        username: username,
        key: result,
        id: id,
      }).then(() => {
        console.log("Added to keychain");
      });
    });
  } catch (e) {
    console.log(e);
  }
}
