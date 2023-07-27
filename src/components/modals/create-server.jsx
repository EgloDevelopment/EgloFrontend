import { useState } from "react";

import Cookies from "js-cookie";
import validator from "validator";
import axios from "axios";

import addToKeychain from "../../../functions/add-to-keychain";
import generateString from "../../../functions/generate-string";

function Component(props) {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [newServerName, setNewServerName] = useState("");

  async function createServer() {
    if (validator.isEmpty(newServerName) === true) {
      setError("Name can not be empty");
      return;
    }

    if (validator.isAlphanumeric(newServerName) === false) {
      setError("Name is not valid");
      return;
    }

    let key = generateString(50);

    const json = { name: newServerName };
    await axios.post("/api/servers/create-server", json).then((response) => {
      if (response.data.success) {
        setNewServerName("");
        setError(null);
        addToKeychain(Cookies.get("username"), key, response.data.id);
        setSuccess("Created server " + newServerName);
        props.getServersList();
      } else {
        setNewServerName("");
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  return (
    <>
      <dialog
        id="create_server_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-white">Create Server</h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Server name</span>
            </label>
            <input
              type="username"
              placeholder="cool_cat_hangout"
              className="input input-bordered input-secondary w-full max-w-full text-white"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary capitalize"
              onClick={() => createServer()}
            >
              Create
            </button>
            <button className="btn capitalize">Cancel</button>
          </div>
        </form>
      </dialog>

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success hover:bg-green-900 cursor-pointer border-0 z-50"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error hover:bg-red-900 cursor-pointer border-0 z-50"
            onClick={() => {
              setError(null);
            }}
          >
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Component;
