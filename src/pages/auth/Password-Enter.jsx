import { useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import decryptPersonalPrivateKey from "../../../functions/decrypt-personal-private-key";

function App() {
  const [error, setError] = useState(false);

  const [username] = useState(Cookies.get("username"));
  const [password, setPassword] = useState("");

  async function login() {
    if (validator.isEmpty(password) === true) {
      setError("Password can not be empty");
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
        decryptPersonalPrivateKey(response.data.private_key, password).then(
          (result) => {
            window.sessionStorage.setItem("private_key", result);
          }
        );
        window.location.href = "/";
      } else {
        setError(response.data.error);
      }
    });
  }

  async function logout() {
    await axios.post("/api/auth/logout").then((response) => {
      if (!response.data.error) {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        window.sessionStorage.removeItem("private_key");
        window.location.href = "/login";
      } else {
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="avatar">
          <div className="w-14 rounded-full">
            <img
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                Cookies.get("username") +
                "&backgroundType=gradientLinear"
              }
            />
          </div>
        </div>

        <b className="text-lg mt-2">{username}</b>

        <div className="form-control w-full max-w-xs mt-5">
          <label className="label">
            <span className="label-text">Enter your account password</span>
          </label>
          <input
            type="password"
            placeholder="Your password"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs mt-9">
          <button
            className="capitalize btn btn-outline w-full"
            onClick={() => login()}
          >
            login
          </button>
          <div className="form-control w-full max-w-xs mt-4">
            <button
              className="capitalize btn btn-ghost w-full"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {error && (
          <div
            className="alert alert-error cursor-pointer border-0"
            onClick={() => setError(null)}
          >
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
