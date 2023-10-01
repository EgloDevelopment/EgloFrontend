import Cookies from "js-cookie";

import makePostRequest from "$lib/other/make-post-request";

export default async function Auth() {
  if (Cookies.get("token")) {
    if (window.sessionStorage.getItem("private_key")) {
      await makePostRequest("/api/auth/check-logged-in").then(
        (response) => {
          if (response.logged_in === true) {
            console.log("Authenticated");
          } else {
            window.location.href = "/login";
          }
        }
      );
    } else {
      window.location.href = "/password-enter";
    }
  } else {
    window.location.href = "/login";
  }
}
