import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import decryptPersonalPrivateKey from "../../../functions/decrypt-personal-private-key";

import { BiLockOpenAlt } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

function App() {
  const [loginLoading, setLoginLoading] = useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    setLoginLoading(true);

    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      setLoginLoading(false);
      return;
    }

    if (validator.isEmpty(password) === true) {
      setError("Password can not be empty");
      setLoginLoading(false);
      return;
    }

    const json = { username: username, password: password };
    await axios.post("/api/auth/login", json).then((response) => {
      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          expires: 180,
          sameSite: "strict",
        });
        Cookies.set("theme", "dark", {
          expires: 180,
          sameSite: "strict",
        });
        Cookies.set("username", response.data.username, {
          expires: 180,
          sameSite: "strict",
        });
        Cookies.set("id", response.data.id, {
          expires: 180,
          sameSite: "strict",
        });
        Cookies.set("ens_subscriber_id", response.data.ens_subscriber_id, {
          expires: 180,
          sameSite: "strict",
        });
        decryptPersonalPrivateKey(response.data.private_key, password).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );
        window.location.href = "/";
      } else {
        setError(response.data.error);
        setLoginLoading(false);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <p className="text-2xl">Login</p>
          <Input
            type="username"
            label="Username"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-5"
            validationState={error.includes("Username") && "invalid"}
            errorMessage={error.includes("Username") && error}
          />

          <Input
            type="password"
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-5"
            validationState={error.includes("Password") && "invalid"}
            errorMessage={error.includes("Password") && error}
            endContent={
              <>
                <a
                  href="/recover-send"
                  className="text-xs text-default-400 transition hover:text-default-600"
                >
                  Forgot?
                </a>
              </>
            }
          />

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={loginLoading ? null : <BiLockOpenAlt />}
            isLoading={loginLoading}
            onPress={() => login()}
          >
            Login to Eglo
          </Button>

          <Button
            color="primary"
            className="mt-5"
            variant="light"
            startContent={<BiUserPlus />}
            onPress={() => (window.location.href = "/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
