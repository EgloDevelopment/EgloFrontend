import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";

import { Spinner } from "@nextui-org/react";

//import checkLoggedIn from "../../functions/check-logged-in";
import addToKeychain from "../../functions/add-to-keychain";

function App() {
  const [response, setResponse] = useState("");

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const code = window.location.href.split("#").pop();

  async function joinServer() {
    const json = { id: id };
    await axios.post("/api/servers/join-server", json).then((response) => {
      if (response.data.success) {
        addToKeychain(Cookies.get("username"), code, id);
        setResponse("Joined server, you can close this window");
      } else {
        setResponse(response.data.error);
      }
    });
  }

  useEffect(() => {
    if (
      id &&
      code &&
      Cookies.get("id") &&
      Cookies.get("token") &&
      Cookies.get("username")
    ) {
      //checkLoggedIn();
      joinServer();
    }
  }, [id, code]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        {response !== "" ? response : <Spinner />}
      </div>
    </>
  );
}

export default App;
