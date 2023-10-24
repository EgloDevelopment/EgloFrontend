import axios from "axios";

import encryptFile from "../encryption/encrypt-file";

export default async function uploadFile(url, file) {
  try {
    const formData = new FormData();
    formData.append("file", await encryptFile(file));

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (e) {
    console.log(e);
    return { error: true };
  }
}
