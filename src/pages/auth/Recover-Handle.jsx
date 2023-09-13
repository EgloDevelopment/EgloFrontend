import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";

import { Spinner } from "@nextui-org/react";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [response, setResponse] = useState("");

  let action = searchParams.get("action");
  let id = searchParams.get("id");
  let code = searchParams.get("code");

  useEffect(() => {
    if (action === null || id === null || code === null) {
      return;
    } else {
      performRecoveryAction();
    }
  }, [action, id, code]);

  async function performRecoveryAction() {
    const json = { id: id, code: code };

    if (action === "confirm") {
      await axios.post("/api/auth/recover-confirm", json).then((response) => {
        if (response.data.success) {
          setResponse("Account deleted successfully");
        } else {
          setResponse(response.data.error);
        }
      });
    }

    if (action === "cancel") {
      await axios.post("/api/auth/recover-cancel", json).then((response) => {
        if (response.data.success) {
          setResponse("Account deletion cancelled");
        } else {
          setResponse(response.data.error);
        }
      });
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        {response !== "" ? response : <Spinner />}
      </div>
    </>
  );
}

export default App;
