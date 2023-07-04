import { useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import decryptPersonalPrivateKey from "../../../functions/decrypt-personal-private-key";

function App() {
  const [error, setError] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      return;
    }

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

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <label className="label">
            <span className="label-text">What is your username?</span>
          </label>
          <input
            type="username"
            placeholder="cool_eglo_platypus_442"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs mt-5">
          <label className="label">
            <span className="label-text">Now enter your password</span>
            <span className="label-text-alt">
              <a href="/recover-send">Forgot?</a>
            </span>
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
        </div>
        <div className="form-control w-full max-w-xs mt-4">
          <a href="/register" className="capitalize btn btn-ghost w-full">
            register
          </a>
        </div>
      </div>

      <div
        className="toast toast-bottom toast-end z-50"
        onClick={() => setError(null)}
      >
        {error && (
          <div className="alert alert-error hover:bg-red-900 cursor-pointer border-0">
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
