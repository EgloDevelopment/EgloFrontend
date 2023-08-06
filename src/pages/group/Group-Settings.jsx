import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";
import { BiArrowBack } from "react-icons/bi";

import checkLoggedIn from "../../../functions/check-logged-in";
import getPrivateKey from "../../../functions/get-private-key-from-keychain";

function App() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  let group_id = searchParams.get("id");

  const [groupName, setGroupName] = useState("");
  const [groupID, setGroupID] = useState("");

  const [users, setUsers] = useState([]);

  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState("");

  useEffect(() => {
    if (group_id) {
      checkLoggedIn();
      getGroupSettings(group_id);
    }
  }, [group_id]);

  async function getGroupSettings() {
    const json = { group_id: group_id };

    window.sessionStorage.setItem("current_key", await getPrivateKey(group_id));

    await axios.post("/api/groups/get-settings", json).then((response) => {
      if (!response.data.error) {
        setGroupName(response.data.name);
        setGroupID(response.data.id);
        setUsers(response.data.users);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeGroupName() {
    if (validator.isEmpty(groupName) === true) {
      setError("Group name can not be empty");
      return;
    }

    const json = { group_id: groupID, name: groupName };

    await axios.post("/api/groups/change-name", json).then((response) => {
      if (!response.data.error) {
        setGroupName(groupName);
        setSuccess("Changed group name");
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function deleteGroup() {
    if (deleteGroupConfirm !== groupName) {
      setError("Group names do not match");
      return;
    }

    const json = { group_id: groupID };

    await axios.post("/api/groups/delete-group", json).then((response) => {
      if (!response.data.error) {
        window.history.back();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-50 min-w-full navbar bg-base-300 rounded-box">
        <div className="flex justify-start flex-1 px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-start">
              <button
                className="normal-case btn btn-ghost rounded-btn"
                onClick={() => window.history.back()}
              >
                <BiArrowBack className="mt-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 ml-5">
        <p className="text-4xl bold mt-5">{groupName}</p>
        <p className="text-sm mt-2 text-zinc-500">{groupID}</p>

        <div className="form-control w-full max-w-xs mt-24 mb-24">
          <p className="text-lg mb-3">Change group name</p>
          <hr className="mb-5" />
          <input
            type="name"
            placeholder="toasters_hangout"
            className="input input-bordered input-secondary w-full max-w-xs "
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="capitalize mt-5 btn btn-outline"
            onClick={() => changeGroupName()}
          >
            Change name
          </button>
        </div>

        <div className="form-control mt-24 max-w-xs mb-24">
          <p className="text-lg mb-3">Users</p>
          <hr className="mb-5" />
          {users.map((col) => (
            <>
              <div className="mt-5">
                <button
                  className="capitalize w-full btn "
                  onClick={() => {
                    navigator.clipboard.writeText(
                      col.id
                    ),
                    setSuccess("Copied user ID")}
                  }
                >
                  {col.username}
                </button>
              </div>
            </>
          ))}
        </div>

        <dialog
          id="delete_group_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <form method="dialog" className="modal-box border border-secondary">
            <h3 className="font-bold text-lg text-white">Are you sure?</h3>
            <div className="form-control w-full max-w-xs mt-5">
              <label className="label">
                <span className="label-text">Enter group name to confirm</span>
              </label>
              <input
                type="username"
                placeholder={groupName}
                className="input input-bordered input-secondary w-full max-w-full text-white"
                value={deleteGroupConfirm}
                onChange={(e) => setDeleteGroupConfirm(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-error btn-outline capitalize"
                onClick={() => deleteGroup()}
              >
                Delete
              </button>
              <button className="btn capitalize">Cancel</button>
            </div>
          </form>
        </dialog>
      </div>

      <div className="w-full p-10">
        <button
          className="capitalize w-full btn btn-error btn-outline mt-56"
          onClick={() => window.delete_group_modal.showModal()}
        >
          DELETE GROUP
        </button>
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success cursor-pointer border-0"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error cursor-pointer border-0"
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

export default App;
