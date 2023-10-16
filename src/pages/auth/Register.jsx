import { useState } from "react";

import { BiLockOpenAlt, BiUser } from "react-icons/bi";
import { BiUserPlus } from "react-icons/bi";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

import Cookies from "js-cookie";

import makePostRequest from "../../functions/other/make-post-request";
import generateKeys from "../../functions/encryption/generate-keys";
import decryptPersonalPrivateKey from "../../functions/encryption/decrypt-personal-private-key";

import redirect from "../../functions/routing/redirect";

function Page() {
  const [registerLoading, setRegisterLoading] = useState(false);

  const [error, setError] = useState([]);

  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  async function register() {
    setRegisterLoading(true);

    let { publicKey, privateKey } = await generateKeys(password1);

    await makePostRequest("/api/auth/register", {
      username: username,
      password1: password1,
      password2: password2,
      public_key: publicKey,
      private_key: privateKey,
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

        Cookies.set("username", username, {
          expires: 180,
          sameSite: "strict",
        });

        decryptPersonalPrivateKey(response.private_key, password1).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );

        redirect("/");
      }
    });

    setRegisterLoading(false);
  }

  return (
    <>
      <p className="text-center text-xs text-default-500 mt-1">
        By registering you agree to the Terms of Use and Privacy Policy
      </p>
      <div className="flex flex-col min-h-screen justify-center items-center -mt-5">
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
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "password1" && true}
            errorMessage={error.field === "password1" && error.message}
          />

          <Input
            type="password"
            label="Password again"
            variant="bordered"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "password2" && true}
            errorMessage={error.field === "password2" && error.message}
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
            fullWidth={true}
            onPress={() => register()}
          >
            Register for Eglo
          </Button>

          <Button
            color="primary"
            className="mt-5"
            variant="light"
            startContent={<BiLockOpenAlt />}
            fullWidth={true}
            onPress={() => redirect("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </>
  );
}

export default Page;
