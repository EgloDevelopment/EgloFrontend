import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import decryptPersonalPrivateKey from "../../../functions/decrypt-personal-private-key";

import { BiLockOpenAlt } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

function App() {
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLoadoutLoading] = useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState(Cookies.get("username"));
  const [password, setPassword] = useState("");

  async function login() {
    setLoginLoading(true);

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

  async function logout() {
    setLoadoutLoading(true);
    await axios.post("/api/auth/logout").then((response) => {
      if (!response.data.error) {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        window.sessionStorage.removeItem("private_key");
        window.location.href = "/login";
      } else {
        setLoadoutLoading(false);
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <div className="avatar">
            <Avatar
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                username +
                "&backgroundType=gradientLinear"
              }
            />
            <p className="font-bold text-xl ml-2 mt-1">{username}</p>
          </div>

          <Input
            type="password"
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-5"
            validationState={error.includes("Password") && "invalid"}
            errorMessage={error.includes("Password") && error}
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
            startContent={logoutLoading ? null : <BiLogOut />}
            isLoading={logoutLoading}
            onPress={() => logout()}
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;
