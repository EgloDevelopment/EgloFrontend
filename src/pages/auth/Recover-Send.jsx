import { useState } from "react";

import validator from "validator";
import axios from "axios";

function App() {
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [username, setUsername] = useState("");

  async function recover() {
    if (validator.isEmpty(username) === true) {
      setError("Username can not be empty");
      return;
    }

    setError(null);

    const json = { username: username };
    await axios.post("/api/auth/recover-send", json).then((response) => {
      if (response.data.success) {
        setSuccess("Check your recovery email");
      } else {
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <div className="toast toast-top toast-start">
        {success && (
          <div className="alert alert-success">
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <label className="label">
            <span className="label-text">Enter your username</span>
          </label>
          <input
            type="username"
            placeholder="rad_eglo_cat_420"
            className="input input-bordered input-secondary w-full max-w-xs"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-control w-full max-w-xs mt-9">
          <button
            className="capitalize btn btn-outline w-full"
            onClick={() => recover()}
          >
            Recover
          </button>
        </div>

        <div className="form-control w-full max-w-xs mt-4">
          <a href="/login" className="capitalize btn btn-ghost w-full">
            back
          </a>
        </div>
      </div>

      <div
        className="toast toast-bottom toast-end z-50"
        onClick={() => {setSuccess(null), setError(null)}}
      >
        {success && (
          <div className="alert alert-success hover:bg-green-900 cursor-pointer border-0">
            <span>{success}</span>
          </div>
        )}
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
