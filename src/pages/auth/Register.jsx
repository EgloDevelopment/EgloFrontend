import { useState } from "react";

import axios from "axios";
import validator from "validator";

import generateKeys from "../../../functions/generate-keys";

function App() {
  const [error, setError] = useState(false);

  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  async function register() {
    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      return;
    }

    if (username.length > 20) {
      setError("Username must be below 20 characters");
      return;
    }

    if (validator.isAlphanumeric(username) === false) {
      setError("Username can be only letters or numbers");
      return;
    }

    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      return;
    }

    if (
      validator.isEmpty(password1) === true ||
      validator.isEmpty(password2) === true
    ) {
      setError("Password can not be empty");
      return;
    }

    if (password1 !== password2) {
      setError("Passwords must match");
      return;
    }

    if (validator.isStrongPassword(password1) === false) {
      setError("Password does not meet the requirements");
      return;
    }

    setError(null);

    let { publicKey, privateKey } = await generateKeys(password1);

    const json = {
      username: username,
      password1: password1,
      password2: password2,
      public_key: publicKey,
      private_key: privateKey,
    };

    await axios.post("/api/auth/register", json).then((response) => {
      if (response.data.success) {
        window.location.href = "/login";
      } else {
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="absolute top-0 text-xs mt-1">
          By registering you agree to the Terms of Service and Privacy Policy
        </p>

        <div className="form-control w-full max-w-xs mt-8">
          <label className="label">
            <span className="label-text">What username do you want?</span>
            <span className="label-text-alt">{username.length}/20</span>
          </label>
          <input
            type="username"
            placeholder="Choose your username"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs mt-5">
          <label className="label">
            <span className="label-text">Now enter your secure password</span>
          </label>
          <input
            type="password"
            placeholder="Your password"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <label className="label">
            <span className="label-text-alt">
              8+ Characters, Symbols & Numbers with Capitals
            </span>
          </label>
        </div>

        <div className="form-control w-full max-w-xs mt-4">
          <label className="label">
            <span className="label-text">Make sure its correct...</span>
          </label>
          <input
            type="password"
            placeholder="Your password again"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs mt-9">
          <button
            className="capitalize btn btn-outline w-full"
            onClick={() => register()}
          >
            register
          </button>
        </div>

        <div className="form-control w-full max-w-xs mt-4">
          <a href="/login" className="capitalize btn btn-ghost w-full">
            login
          </a>
        </div>
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {error && (
          <div
            className="alert alert-error hover:bg-red-900 cursor-pointer border-0"
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
