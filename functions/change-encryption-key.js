import CryptoJS from "crypto-js";

export default async function changePassword(password) {

  let new_password = CryptoJS.AES.encrypt(
    window.sessionStorage.getItem("private_key"),
    password
  ).toString();

  console.log(new_password)

  return new_password;
}