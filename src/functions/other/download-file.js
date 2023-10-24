import axios from "axios";
import fileDownload from "js-file-download";

import decryptFile from "../encryption/decrypt-file";

export default async function downloadFile(url, file_id, file_name) {
  try {
    const response = await axios.get(`${url}?file_id=${file_id}`, {
      responseType: "blob",
    });

    if (response.data.error) {
      return { error: true };
    } else {
      decryptFile(response.data).then((decrypted_file) => {
        fileDownload(decrypted_file, file_name);
      });
    }
  } catch (e) {
    console.log(e);
    return { error: true };
  }
}
