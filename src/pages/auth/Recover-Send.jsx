import { useState, useEffect } from "react";

import axios from "axios";
import validator from "validator";

import { BiSend } from "react-icons/bi";
import { BiArrowBack } from "react-icons/bi";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

import Success from "../../../components/Success.jsx"

function App() {
  const [recoverLoading, setRecoverLoading] = useState(false);

  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false)

  const [username, setUsername] = useState("");

  async function recover() {
    setRecoverLoading(true)

    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      setRecoverLoading(false)
      return;
    }

    const json = { username: username };
    await axios.post("/api/auth/recover-send", json).then((response) => {
      if (response.data.success) {
        setShowSuccess(true);
        setRecoverLoading(false)
      } else {
        setError(response.data.error);
        setRecoverLoading(false)
      }
    });
  }
  return (
    <>
    <Success showSuccess={showSuccess} setShowSuccess={setShowSuccess} text={"Check your recovery email"} />

      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <p className="text-2xl">Forgot password</p>
          <Input
            type="username"
            label="Username"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-5"
            validationState={error !== "" && "invalid"}
            errorMessage={error !== "" && error}
          />

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={recoverLoading ? null : <BiSend />}
            isLoading={recoverLoading}
            onPress={() => recover()}
          >
            Send email
          </Button>

          <Button
            color="primary"
            className="mt-5"
            variant="light"
            startContent={<BiArrowBack />}
            onPress={() => (window.location.href = "/login")}
          >
            Back
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
