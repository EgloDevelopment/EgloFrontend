import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

import UserProfile from "../../../components/User-Profile";

import checkLoggedIn from "../../../functions/check-logged-in";
import getPrivateKey from "../../../functions/get-private-key-from-keychain";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  let server_id = searchParams.get("id");

  const [error, setError] = useState("");

  const [serverOwner, setServerOwner] = useState("");

  const [newChannelName, setNewChannelName] = useState("");

  const [serverName, setServerName] = useState("");
  const [serverID, setServerID] = useState("");

  const [deleteServerName, setDeleteServerName] = useState("");

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userToView, setUserToView] = useState("");

  const [users, setUsers] = useState([]);
  const [channels, setChannels] = useState([]);

  const [allowNewUsers, setAllowNewUsers] = useState(true);

  async function getServerSettings() {
    const json = { server_id: server_id };

    window.sessionStorage.setItem(
      "current_key",
      await getPrivateKey(server_id)
    );

    await axios.post("/api/servers/get-settings", json).then((response) => {
      if (!response.data.error) {
        setServerID(response.data.id);
        setServerName(response.data.name);
        setUsers(response.data.users);
        setChannels(response.data.channels);
        setServerOwner(response.data.server_owner);
        setAllowNewUsers(response.data.allow_new_users);
      } else {
        console.log(response);
      }
    });
  }

  async function changeAllowNewUsers() {
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

  async function loadProfile(username) {
    setShowUserProfile(true);

    const json = { username: username };

    await axios
      .post("/api/user/get-user-from-username", json)
      .then((response) => {
        setUserToView(response.data);
      });
  }

  async function changeServerName() {
    if (validator.isEmpty(serverName) === true) {
      setError("Name can not be empty");
      return;
    }

    if (serverName.length > 25) {
      setError("Name can not be over 25 characters");
      return;
    }

    const json = { server_id: serverID, name: serverName };

    await axios.post("/api/servers/change-name", json).then((response) => {
      if (!response.data.error) {
        setError("");
      } else {
        console.log(response);
      }
    });
  }

  async function deleteServer() {
    if (deleteServerName !== serverName) {
      setError("Server names do not match");
      return;
    }

    const json = { server_id: serverID };

    await axios.post("/api/servers/delete-server", json).then((response) => {
      if (!response.data.error) {
        window.location.href = "/";
      } else {
        console.log(response);
      }
    });
  }

  async function createChannel() {
    const json = { server_id: serverID, channel_name: "New channel" };

    await axios.post("/api/servers/create-channel", json).then((response) => {
      if (!response.data.error) {
        getServerSettings();
      } else {
        console.log(response);
      }
    });
  }

  async function modifyChannel(channel_id) {
    if (newChannelName.length > 25) {
      setError("Channel name must be under 25 characters");
    }

    const json = {
      server_id: serverID,
      channel_id: channel_id,
      name: newChannelName,
    };

    await axios.post("/api/servers/modify-channel", json).then((response) => {
      if (!response.data.error) {
        setNewChannelName("");
        getServerSettings();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  useEffect(() => {
    if (server_id) {
      checkLoggedIn();
      getServerSettings();
    }
  }, [server_id]);

  return (
    <>
      <UserProfile
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        setUserToView={setUserToView}
        userToView={userToView}
      />

      <div className="z-50 w-full fixed top-0 left-0 bg-default-100 h-14">
        <Button
          color="primary"
          className="fixed right-left mt-[0.4rem] ml-3"
          onPress={() => (window.location.href = "/")}
        >
          Back
        </Button>
      </div>

      <div className="mt-32 ml-10">
        <Avatar
          src={
            "https://api.dicebear.com/6.x/initials/svg?seed=" +
            serverName +
            "&backgroundType=gradientLinear"
          }
          size="lg"
          className="cursor-pointer"
        />

        <p className="text-2xl font-bold mt-3">{serverName}</p>
        <p className="text-xs text-default-400">{serverID}</p>
      </div>

      <div className="mt-10 ml-10 mb-10 form-control w-full max-w-xs">
        <Input
          type="name"
          label="Server name"
          variant="bordered"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="mt-5"
          endContent={
            <>
              <Button color="primary" onPress={() => changeServerName()}>
                Save
              </Button>
            </>
          }
          validationState={error.includes("Name") && "invalid"}
          errorMessage={error.includes("Name") && error}
        />

        <div className="mt-20">
          <p className="font-bold text-lg">Users:</p>
          <div className="ml-3 mt-4">
            {users.map((col) => (
              <>
                <div className="mt-5">
                  <button
                    className="capitalize w-full btn "
                    onClick={() => loadProfile(col.username)}
                  >
                    {col.username}
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <p className="font-bold text-lg">Security:</p>
          <Switch
            isSelected={allowNewUsers}
            onChange={() => changeAllowNewUsers(event.target.checked)}
            size="sm"
            className="mt-5 ml-3"
          >
            Allow new users
          </Switch>
        </div>

        <div className="mt-20">
          <Button
            color="primary"
            variant="bordered"
            className="mt-3 font-bold"
            onPress={() => createChannel()}
          >
            Channels (Create channel)
          </Button>
          <div className="ml-3 mt-7">
            {channels.map((col) => (
              <>
                <div className="mt-5">
                  <Input
                    type="name"
                    label={col.name}
                    variant="bordered"
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="mt-5"
                    endContent={
                      <>
                        <Button
                          color="primary"
                          onPress={() => modifyChannel(col.channel_id)}
                        >
                          Save
                        </Button>
                      </>
                    }
                    validationState={error.includes("Channel") && "invalid"}
                    errorMessage={error.includes("Channel") && error}
                  />
                </div>
              </>
            ))}
          </div>
        </div>

        <Input
          type="name"
          label="Server name"
          variant="bordered"
          onChange={(e) => setDeleteServerName(e.target.value)}
          className="mt-20"
          endContent={
            <>
              <Button color="danger" onPress={() => deleteServer()}>
                Delete
              </Button>
            </>
          }
          validationState={error.includes("Server") && "invalid"}
          errorMessage={error.includes("Server") && error}
        />
      </div>
    </>
  );
}

export default App;
