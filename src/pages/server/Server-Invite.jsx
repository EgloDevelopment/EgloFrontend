import { useState, useEffect } from "react";

import axios from "axios";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

import checkLoggedIn from "../../../functions/check-logged-in";

import addToKeychain from "../../../functions/add-to-keychain";

function App() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const code = window.location.href.split("#").pop();

  async function joinServer() {
    const json = { id: id };
    await axios.post("/api/servers/join-server", json).then((response) => {
      if (response.data.success) {
        addToKeychain(Cookies.get("username"), code, id);
        setSuccess("Joined server, you can close this window");
      } else {
        setError(response.data.error);
      }
    });
  }

  useEffect(() => {
    if (id && code) {
      checkLoggedIn();
      joinServer();
    }
  }, [id, code]);

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        Joining server
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success cursor-pointer border-0"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error cursor-pointer border-0"
            onClick={() => {
              setError(null);
            }}
          >
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
