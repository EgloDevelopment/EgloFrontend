import { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";

import axios from "axios";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [message, setMessage] = useState("");

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
          setMessage("Account deleted successfully");
        } else {
          setMessage(response.data.error);
        }
      });
    }

    if (action === "cancel") {
      await axios.post("/api/auth/recover-cancel", json).then((response) => {
        if (response.data.success) {
          setMessage("Account deletion cancelled");
        } else {
          setMessage(response.data.error);
        }
      });
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        {message}
      </div>
    </>
  );
}

export default App;
