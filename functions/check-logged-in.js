import axios from "axios";
import Cookies from "js-cookie";

export default async function Auth() {
  if (Cookies.get("token") && Cookies.get("username")) {
    if (window.sessionStorage.getItem("private_key")) {
      await axios.post("/api/auth/check-logged-in").then((response) => {
        if (response.data.status === true) {
          console.log("Authenticated");
        } else {
          window.location.href = "/login";
        }
      });
    } else {
      window.location.href = "/password-enter";
    }
  } else {
    window.location.href = "/login";
  }
}