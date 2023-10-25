import { useState } from "react";

import Cookies from "js-cookie";

import { BiLockOpenAlt } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

import makePostRequest from "../../functions/other/make-post-request";
import decryptPersonalPrivateKey from "../../functions/encryption/decrypt-personal-private-key";

import redirect from "../../functions/routing/redirect";

function Page() {
  const [loginLoading, setLoginLoading] = useState(false);

  const [error, setError] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    setLoginLoading(true);

    await makePostRequest("/api/auth/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        setError([]);

        Cookies.set("token", response.token, {
          expires: 180,
          sameSite: "strict",
        });

        Cookies.set("username", username.toLowerCase(), {
          expires: 180,
          sameSite: "strict",
        });

        Cookies.set("theme", "dark", {
          expires: 180,
          sameSite: "strict",
        });

        decryptPersonalPrivateKey(response.private_key, password).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );

        redirect("/");
      }
    });

    setLoginLoading(false);
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <Input
            type="username"
            label="Username"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "username" && true}
            errorMessage={error.field === "username" && error.message}
          />

          <Input
            type="password"
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "password" && true}
            errorMessage={error.field === "password" && error.message}
            endContent={
              <>
                <p
                  className="text-xs text-grey underline cursor-pointer text-default-500 hover:text-foreground transition"
                  onClick={() => redirect("/forgot-password")}
                >
                  Forgot?
                </p>
              </>
            }
          />

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={loginLoading ? null : <BiLockOpenAlt />}
            isLoading={loginLoading}
            fullWidth={true}
            onPress={() => login()}
          >
            Login to Eglo
          </Button>

          <Button
            color="primary"
            className="mt-5"
            variant="light"
            startContent={<BiUserPlus />}
            fullWidth={true}
            onPress={() => redirect("/register")}
          >
            Register
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
