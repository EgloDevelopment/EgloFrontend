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

  let server_id = searchParams.get("id");

  const [serverName, setServerName] = useState("");
  const [serverID, setServerID] = useState("");

  const [newChannelName, setNewChannelName] = useState("");

  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);

  const [channelName, setChannelName] = useState("");

  const [allowNewUsers, setAllowNewUsers] = useState(true);

  const [deleteServerConfirm, setDeleteServerConfirm] = useState("");

  useEffect(() => {
    if (server_id) {
      checkLoggedIn();
      getServerSettings(server_id);
    }
  }, [server_id]);

  async function getServerSettings() {
    const json = { server_id: server_id };

    window.sessionStorage.setItem(
      "current_key",
      await getPrivateKey(server_id)
    );

    await axios.post("/api/servers/get-settings", json).then((response) => {
      if (!response.data.error) {
        setServerName(response.data.name);
        setServerID(response.data.id);
        setChannels(response.data.channels);
        setUsers(response.data.users);
        setAllowNewUsers(response.data.allow_new_users);
        setServerName(response.data.name);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeNewUsers() {
    const json = { server_id: serverID };

    setAllowNewUsers(!allowNewUsers);

    await axios.post("/api/servers/allow-new-users", json).then((response) => {
      if (!response.data.error) {
        setSuccess("Changed new users setting");
        getServerSettings();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function createChannel() {
    if (validator.isEmpty(newChannelName) === true) {
      setError("Channel name can not be empty");
      return;
    }

    const json = { server_id: serverID, channel_name: newChannelName };

    await axios.post("/api/servers/create-channel", json).then((response) => {
      if (!response.data.error) {
        setNewChannelName("");
        getServerSettings();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function removeUser(user_id, user_name) {
    const json = { server_id: serverID, user_id: user_id };

    await axios.post("/api/servers/remove-user", json).then((response) => {
      if (!response.data.error) {
        setSuccess("Removed " + user_name + " successfully");
        getServerSettings();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeServerName() {
    if (validator.isEmpty(serverName) === true) {
      setError("Server name can not be empty");
      return;
    }

    const json = { server_id: serverID, name: serverName };

    await axios.post("/api/servers/change-name", json).then((response) => {
      if (!response.data.error) {
        setServerName(serverName);
        setSuccess("Changed server name")
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function deleteServer() {
    if (deleteServerConfirm !== serverName) {
      setError("Server names do not match");
      return;
    }

    const json = { server_id: serverID };

    await axios.post("/api/servers/delete-server", json).then((response) => {
      if (!response.data.error) {
        window.history.back();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function modifyChannel(channel_id) {
    if (channelName.length > 25) {
      setError("Channel name must be under 25 characters");
    }

    const json = {
      server_id: serverID,
      channel_id: channel_id,
      name: channelName,
    };

    await axios.post("/api/servers/modify-channel", json).then((response) => {
      if (!response.data.error) {
        setSuccess(response.data.success);
        getServerSettings();
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
        <p className="text-4xl bold mt-5">{serverName}</p>
        <p className="text-sm mt-2 text-zinc-500">{serverID}</p>

        <div className="form-control w-full max-w-xs mt-24 mb-24">
          <p className="text-lg mb-3">Change server name</p>
          <hr className="mb-5" />
          <input
            type="name"
            placeholder="toasters_hangout"
            className="input input-bordered input-secondary w-full max-w-xs "
            value={serverName}
            onChange={(e) => setServerName(e.target.value)}
          />
          <button
            className="capitalize mt-5 btn btn-outline"
            onClick={() => changeServerName()}
          >
            Change name
          </button>
        </div>

        <div className="form-control mt-24 max-w-[16rem]">
          <p className="text-lg mb-3">Security settings</p>
          <hr className="mb-5" />
          <label className="label cursor-pointer">
            <span className="label-text">Allow people to join server</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={() => changeNewUsers()}
              checked={allowNewUsers}
            />
          </label>
        </div>

        <div className="form-control mt-24 max-w-xs mb-24">
          <p className="text-lg mb-3">Channels</p>
          <hr className="mb-5" />
          <button
            className="capitalize btn btn-outline w-full"
            onClick={() => window.new_channel_modal.showModal()}
          >
            New channel
          </button>
          <div className="mt-5"></div>
          {channels.map((col) => (
            <>
              <div className="join mt-5">
                <input
                  className="input input-bordered border border-primary join-item"
                  placeholder={"#" + col.name}
                  onChange={(e) => setChannelName(e.target.value)}
                />
                <button
                  className="btn btn-primary capitalize join-item ml-4"
                  onClick={() => modifyChannel(col.channel_id)}
                >
                  Save
                </button>
              </div>
            </>
          ))}
        </div>

        <div className="form-control mt-24 max-w-xs mb-24">
          <p className="text-lg mb-3">Users</p>
          <hr className="mb-5" />
          <button
            className="capitalize btn btn-outline w-full"
            onClick={() => {
              navigator.clipboard.writeText(
                "https://app.eglo.pw/server-invite?id=" +
                  serverID +
                  "#" +
                  window.sessionStorage.getItem("current_key"),
                setSuccess("Copied invite URL")
              );
            }}
          >
            Copy invite URL
          </button>
          <div className="mt-5"></div>
          {users
            .filter((user) => user.id !== Cookies.get("id"))
            .map((col) => (
              <>
                <div className="mt-5">
                  <button
                    className="capitalize w-full btn "
                    onClick={() => removeUser(col.id, col.username)}
                  >
                    {col.username}
                  </button>
                </div>
              </>
            ))}
        </div>

        <dialog
          id="delete_server_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <form method="dialog" className="modal-box border border-secondary">
            <h3 className="font-bold text-lg text-white">Are you sure?</h3>
            <div className="form-control w-full max-w-xs mt-5">
              <label className="label">
                <span className="label-text">Enter server name to confirm</span>
              </label>
              <input
                type="username"
                placeholder={serverName}
                className="input input-bordered input-secondary w-full max-w-full text-white"
                value={deleteServerConfirm}
                onChange={(e) => setDeleteServerConfirm(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-error btn-outline capitalize"
                onClick={() => deleteServer()}
              >
                Delete
              </button>
              <button className="btn capitalize">Cancel</button>
            </div>
          </form>
        </dialog>

        <dialog
          id="new_channel_modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <form method="dialog" className="modal-box border border-secondary">
            <h3 className="font-bold text-lg text-white">Create channel</h3>
            <div className="form-control w-full max-w-xs mt-5">
              <label className="label">
                <span className="label-text">Channel name</span>
              </label>
              <input
                type="username"
                placeholder="#weird-eglo-channel"
                className="input input-bordered input-secondary w-full max-w-full text-white"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary capitalize"
                onClick={() => createChannel()}
              >
                Create
              </button>
              <button className="btn capitalize">Cancel</button>
            </div>
          </form>
        </dialog>
      </div>

      <div className="w-full p-10">
        <button
          className="capitalize w-full btn btn-error btn-outline mt-56"
          onClick={() => window.delete_server_modal.showModal()}
        >
          DELETE SERVER
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
