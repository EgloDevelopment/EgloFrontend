import axios from "axios";
import Cookies from "js-cookie";

import redirect from "../routing/redirect";

export default async function Auth() {
  if (Cookies.get("token") && Cookies.get("username")) {
    if (window.sessionStorage.getItem("private_key")) {
      await axios.post("/api/auth/check-logged-in").then((response) => {
        if (response.data.logged_in === true) {
          console.log("Authenticated");
        } else {
          redirect("/login");
        }
      });
    } else {
      redirect("/password-enter");
    }
  } else {
    redirect("/login");
  }
}
