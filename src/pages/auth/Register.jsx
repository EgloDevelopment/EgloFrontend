import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import generateKeys from "../../../functions/generate-keys";
import decryptPersonalPrivateKey from "../../../functions/decrypt-personal-private-key";

import { BiLockOpenAlt, BiUser } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

function App() {
  const [registerLoading, setRegisterLoading] = useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  async function register() {
    setRegisterLoading(true);

    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      setRegisterLoading(false);
      return;
    }

    if (username.length > 20) {
      setError("Username must be below 20 characters");
      setRegisterLoading(false);
      return;
    }

    if (validator.isAlphanumeric(username) === false) {
      setError("Username can be only letters or numbers");
      setRegisterLoading(false);
      return;
    }

    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      setRegisterLoading(false);
      return;
    }

    if (
      validator.isEmpty(password1) === true ||
      validator.isEmpty(password2) === true
    ) {
      setError("Password can not be empty");
      setRegisterLoading(false);
      return;
    }

    if (password1 !== password2) {
      setError("Passwords must match");
      setRegisterLoading(false);
      return;
    }

    if (validator.isStrongPassword(password1) === false) {
      setError("Password does not meet the requirements");
      setRegisterLoading(false);
      return;
    }

    let { publicKey, privateKey } = await generateKeys(password1);

    const json = {
      username: username,
      password1: password1,
      password2: password2,
      public_key: publicKey,
      private_key: privateKey,
    };

    await axios.post("/api/auth/register", json).then((response) => {
      if (response.data.token) {
        Cookies.set("token", response.data.token, {
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
        decryptPersonalPrivateKey(response.data.private_key, password1).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );
        window.location.href = "/";
      } else {
        setError(response.data.error);
        setRegisterLoading(false);
      }
    });
  }

  return (
    <>
      <p className="text-center text-xs text-default-500 mt-1">
        By registering you agree to the Terms of Use and Privacy Policy
      </p>
      <div className="flex flex-col min-h-screen justify-center items-center -mt-5">
        <div className="form-control w-full max-w-xs mt-8">
          <p className="text-2xl">Register</p>
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

          <p className="text-xs mt-2 text-default-500">
            Must be unique to you.
          </p>

          <Input
            type="password"
            label="Password"
            variant="bordered"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="mt-5"
            validationState={error.includes("Password") && "invalid"}
            errorMessage={error.includes("Password") && error}
          />

          <p className="text-xs mt-2 text-default-500">
            8+ Characters with Symbols, Numbers, and Capitals.
          </p>

          <Input
            type="password"
            label="Password again"
            variant="bordered"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="mt-5"
            validationState={error.includes("Password") && "invalid"}
            errorMessage={error.includes("Password") && error}
          />

          <p className="text-xs mt-2 text-default-500">
            8+ Characters with Symbols, Numbers, and Capitals.
          </p>

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={registerLoading ? null : <BiUserPlus />}
            isLoading={registerLoading}
            onPress={() => register()}
          >
            Register for Eglo
          </Button>

          <Button
            color="primary"
            className="mt-5"
            variant="light"
            startContent={<BiLockOpenAlt />}
            onPress={() => (window.location.href = "/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
