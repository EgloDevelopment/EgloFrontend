import axios from "axios";

export default async function sendPostRequest(url, json) {
  try {
    let response = await axios({
      method: "POST",
      url: url,
      data: json,
      validateStatus: () => true,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return { error: true };
  }
}
