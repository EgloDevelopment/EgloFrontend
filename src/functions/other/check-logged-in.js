import makePostRequest from "../other/make-post-request"
import Cookies from "js-cookie";

import redirect from "../routing/redirect";

export default async function Auth() {
  if (Cookies.get("token") && Cookies.get("username")) {
    if (window.sessionStorage.getItem("private_key")) {
      await makePostRequest("/api/auth/check-logged-in").then((response) => {
        if (response.error === true) {
          redirect("/login");
        } else {
          console.log("Authenticated")
        }
      });
    } else {
      redirect("/password-enter");
    }
  } else {
    redirect("/login");
  }
}
