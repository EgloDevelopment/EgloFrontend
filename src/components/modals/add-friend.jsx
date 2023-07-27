import { useState } from "react";

import Cookies from "js-cookie";
import validator from "validator";
import axios from "axios";

import addToKeychain from "../../../functions/add-to-keychain";
import generateString from "../../../functions/generate-string";

function Component(props) {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [addFriendUsername, setAddFriendUsername] = useState("");

  async function addFriend(username) {
    let friend_username;

    if (username) {
      friend_username = username;
    } else {
      friend_username = addFriendUsername;
    }

    if (validator.isEmpty(friend_username) === true) {
      setError("Username can not be empty");
      return;
    }

    if (validator.isAlphanumeric(friend_username) === false) {
      setError("Username is not valid");
      return;
    }

    let key = generateString(50);

    const json = { username: friend_username };
    await axios.post("/api/friends/add", json).then((response) => {
      if (response.data.success) {
        setAddFriendUsername("");
        setError(null);
        addToKeychain(Cookies.get("username"), key, response.data.channel_id);
        addToKeychain(friend_username, key, response.data.channel_id);
        setSuccess("Added " + friend_username + " as friend");
        props.getFriendsList();
      } else {
        setAddFriendUsername("");
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  return (
    <>
      <dialog
        id="add_friend_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-white">Add Friend</h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Enter your friends username</span>
            </label>
            <input
              type="username"
              placeholder="cool_eglo_computer_753"
              className="input input-bordered input-secondary w-full max-w-full text-white"
              value={addFriendUsername}
              onChange={(e) => setAddFriendUsername(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary capitalize"
              onClick={() => addFriend()}
            >
              Add
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
