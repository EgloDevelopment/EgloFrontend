import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";
import { BiArrowBack } from "react-icons/bi";

import checkLoggedIn from "../../../functions/check-logged-in";

function App() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  let server_id = searchParams.get("id");

  const [serverName, setServerName] = useState("");
  const [serverID, setServerID] = useState("");

  const [newServerName, setNewServerName] = useState("");

  const [newChannelName, setNewChannelName] = useState("");

  const [channels, setChannels] = useState([]);
  const [users, setUsers] = useState([]);

  const [channelName, setChannelName] = useState("");

  const [allowNewUsers, setAllowNewUsers] = useState(true);

  useEffect(() => {
    if (server_id) {
      checkLoggedIn();
      getServerSettings(server_id);
    }
  }, [server_id]);

  async function getServerSettings() {
    const json = { server_id: server_id };

    await axios.post("/api/servers/get-settings", json).then((response) => {
      if (!response.data.error) {
        setServerName(response.data.name);
        setServerID(response.data.id);
        setChannels(response.data.channels);
        setUsers(response.data.users);
        setAllowNewUsers(response.data.allow_new_users);
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
      setError("Channel name can not be empty")
      return
    }

    if (validator.isAlphanumeric(newChannelName) === false) {
      setError("Channel name is invalid")
      return
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
    if (validator.isEmpty(newServerName) === true) {
      setError("Server name can not be empty")
      return;
    }

    if (validator.isAlphanumeric(newServerName) === false) {
      setError("Server name is invalid")
      return;
    }


    const json = { server_id: serverID, name: newServerName };

    await axios.post("/api/servers/change-name", json).then((response) => {
      if (!response.data.error) {
        setServerName(newServerName);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function modifyChannel(channel_id) {
    if (validator.isEmpty(channelName) === true) {
      setError("Channel name can not be empty")
      return;
    }

    if (validator.isAlphanumeric(channelName) === false) {
      setError("Channel name is invalid")
      return;
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
            value={newServerName}
            onChange={(e) => setNewServerName(e.target.value)}
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
                    className="capitalize w-full btn btn-outline"
                    onClick={() => removeUser(col.id, col.username)}
                  >
                    {col.username}
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>

      <div className="w-full p-10">
      <button
        className="capitalize w-full btn btn-error btn-outline mt-56"
        onClick={() => removeUser(col.id, col.username)}
      >
        DELETE SERVER (no-op)
      </button>
      </div>

      <div
        className="toast toast-bottom toast-end z-50"
        onClick={() => {
          setSuccess(null), setError(null);
        }}
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