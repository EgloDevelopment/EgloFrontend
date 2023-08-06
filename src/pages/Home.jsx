import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";
import {
  BiSend,
  BiUser,
  BiGridVertical,
  BiMenuAltLeft,
  BiServer,
  BiArrowBack,
  BiHash,
  BiGroup,
  BiCog
} from "react-icons/bi";

import checkLoggedIn from "../../functions/check-logged-in";

import getPrivateKey from "../../functions/get-private-key-from-keychain";
import addToKeychain from "../../functions/add-to-keychain";
import generateString from "../../functions/generate-string";
import decrypt from "../../functions/decrypt";
import encrypt from "../../functions/encrypt";

import SidebarOption from "../components/messaging/sidebar-option";
import Server from "../components/messaging/server";
import User from "../components/messaging/user";
import Group from "../components/messaging/group";

let ws;

function App() {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [addFriendUsername, setAddFriendUsername] = useState("");
  const [newServerName, setNewServerName] = useState("");

  const [friendsList, setFriendsList] = useState([]);
  const [serversList, setServersList] = useState([]);

  const [messages, setMessages] = useState([]);

  const [chatName, setChatName] = useState("");

  const [newMessage, setNewMessage] = useState("");

  const [serverName, setServerName] = useState("");

  const [channelID, setChannelID] = useState("");
  const [serverID, setServerID] = useState("");

  const [directMessage, setDirectMessage] = useState(false);
  const [server, setServer] = useState(false);
  const [group, setGroup] = useState(false);

  const [serverChannels, setServerChannels] = useState([]);
  const [serverOwner, setServerOwner] = useState("");

  const [otherUserID, setOtherUserID] = useState("");

  const [userData, setUserData] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);

  const [groupChatUsernames, setGroupChatUsernames] = useState("");
  const [groupsList, setGroupsList] = useState([]);
  const [groupID, setGroupID] = useState("")

  const DATE_OPTIONS = {
    minute: "numeric",
    hour: "numeric",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  };

  useEffect(() => {
    checkLoggedIn();
    getFriendsList();
    getGroupsList();
    getServersList();
    document.getElementById("primary-sidebar").checked = true;
  }, []);

  async function scrollToBottom() {
    await delay(200);
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    element.scroll({ top: bottom, behavior: "smooth" });
  }

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
        addToKeychain(Cookies.get("username"), key, response.data.channel_id);
        addToKeychain(friend_username, key, response.data.channel_id);
        setSuccess("Added " + friend_username + " as friend");
        getFriendsList();
      } else {
        setAddFriendUsername("");
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function createServer() {
    if (validator.isEmpty(newServerName) === true) {
      setError("Name can not be empty");
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
        getServersList();
      } else {
        setNewServerName("");
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function getFriendsList() {
    await axios.post("/api/friends/get").then((response) => {
      if (!response.data.error) {
        setFriendsList(response.data);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function getGroupsList() {
    await axios.post("/api/groups/get").then((response) => {
      if (!response.data.error) {
        setGroupsList(response.data);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function getServersList() {
    await axios.post("/api/servers/get").then((response) => {
      if (!response.data.error) {
        setServersList(response.data);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function getChannels(id) {
    const json = { server_id: id };
    await axios.post("/api/servers/get-channels", json).then((response) => {
      if (!response.data.error) {
        setServerChannels(response.data);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function showUserData(user_id) {
    const json = { id: user_id };

    window.user_data_modal.showModal();

    await axios.post("/api/user/get-user-from-id", json).then((response) => {
      if (!response.data.error) {
        setUserData(response.data);
        setUserDataLoading(false);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function removeFriend() {
    const json = { channel_id: channelID };

    await axios.post("/api/friends/remove-friend", json).then((response) => {
      if (!response.data.error) {
        setSuccess("Removed friend");
        setChannelID(null);
        setChatName("");
        setDirectMessage(false);
        setMessages([]);
        getFriendsList();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function leaveServer() {
    const json = { server_id: serverID };

    await axios.post("/api/servers/leave", json).then((response) => {
      if (!response.data.error) {
        setSuccess("Left server");
        setChannelID(null);
        setChatName("");
        setServer(false);
        setMessages([]);
        getFriendsList();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function loadMessages(channel_id, keychain_id) {
    socketDisconnect();

    const json = { channel_id: channel_id };

    window.sessionStorage.setItem(
      "current_key",
      await getPrivateKey(keychain_id)
    );

    await axios.post("/api/messages/get?limit=50", json).then((response) => {
      if (!response.data.error) {
        setMessages(response.data);

        setChannelID(channel_id);

        socketInitializer(channel_id);

        let temp_array = [];

        for (const val of response.data) {
          decrypt(val.content).then((result) => {
            val.content = result;
          });
          temp_array.push(val);
        }

        setNewMessage("");
        document.getElementById("primary-sidebar").checked = false;
        scrollToBottom();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function sendMessage() {
    if (validator.isEmpty(newMessage) === true) {
      return;
    }

    let encrypted_message = await encrypt(newMessage);

    ws.send(
      JSON.stringify({
        action: "publish",
        id: channelID,
        sender_name: Cookies.get("username"),
        sender_id: Cookies.get("id"),
        time: Date.now(),
        content: encrypted_message,
      })
    );

    setNewMessage("");

    const json = { channel_id: channelID, content: encrypted_message };

    await axios.post("/api/messages/send", json).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  const handlePress = (e) => {
    if (newMessage) {
      if (e.key === "Enter") {
        sendMessage();
      }
    }
  };

  async function socketInitializer(channel_id) {
    try {
      ws = new WebSocket("wss://backend.eglo.pw/data/realtime");

      ws.onopen = () => {
        ws.send(JSON.stringify({ action: "subscribe", id: channel_id }));
      };

      ws.onmessage = async function (event) {
        const json = JSON.parse(event.data);

        await decrypt(json.content).then((result) => {
          setMessages((currentMsg) => [
            ...currentMsg,
            {
              sender_name: json.sender_name,
              time: json.time,
              sender_id: json.sender_id,
              content: result,
            },
          ]);
          scrollToBottom();
        });
      };
    } catch (e) {
      console.log(e);
    }
  }

  async function socketDisconnect() {
    if (ws) {
      window.sessionStorage.removeItem("current_key");
      ws.send(JSON.stringify({ action: "unsubscribe", id: channelID }));
      ws.close();
    }
  }

  async function createGroupChat() {
    if (validator.isEmpty(groupChatUsernames) === true) {
      setError("Must provide usernames");
      return;
    }

    let usernames = groupChatUsernames.split(",");

    for (const val of usernames) {
      if (
        validator.isEmpty(val.trim()) === true ||
        validator.isAlphanumeric(val.trim()) === false
      ) {
        setError("Username(s) invalid");
        return;
      }
    }

    const json = { users: usernames };

    let key = generateString(50);

    await axios.post("/api/groups/create", json).then((response) => {
      if (!response.data.error) {
        for (const val of response.data.users) {
          addToKeychain(val, key, response.data.id);
        }
        setSuccess("Created group");
        setGroupChatUsernames("");
        getGroupsList();
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-40 min-w-full navbar bg-base-300 rounded-box">
        <div className="drawer-content">
          <label
            htmlFor="primary-sidebar"
            className="btn btn-primary bg-base-300 border-0 drawer-button lg:hidden capitalize"
          >
            <BiMenuAltLeft />
          </label>
          <div className="absolute dropdown dropdown-end right-0 mr-2">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <a href="/settings">
                  <img
                    src={
                      "https://api.dicebear.com/6.x/initials/svg?seed=" +
                      Cookies.get("username") +
                      "&backgroundType=gradientLinear"
                    }
                  />
                </a>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="drawer lg:drawer-open fixed top-0 left-0 z-40 w-80">
        <input id="primary-sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side mt-16">
          {!serverID ? (
            <>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content text-md">
                <div onClick={() => window.add_friend_modal.show()}>
                  <SidebarOption
                    icon={<BiUser className="h-6 w-6" />}
                    text="Add friend"
                  />
                </div>

                <div onClick={() => window.new_group_chat_modal.show()}>
                  <SidebarOption
                    icon={<BiGroup className="h-6 w-6" />}
                    text="New group chat"
                  />
                </div>

                <div onClick={() => window.new_server_modal.show()}>
                  <SidebarOption
                    icon={<BiServer className="h-6 w-6" />}
                    text="Create server"
                  />
                </div>

                <hr className="mt-2" />

                {friendsList.length > 0 && (
                  <p className="font-bold text-lg ml-3 mt-3">Direct Messages</p>
                )}

                {friendsList.map((col) => (
                  <div
                    onClick={() => {
                      setMessages([]);
                      setDirectMessage(true), setGroup(false), setServer(false);
                      loadMessages(col.channel_id, col.channel_id),
                        setChatName(col.username),
                        setGroupID(""),
                        setOtherUserID(col.id);
                    }}
                  >
                    <User
                      preferredName={col.preferred_name}
                      username={col.username}
                      loggedIn={col.logged_in}
                    />
                  </div>
                ))}

                {groupsList.length > 0 && (
                  <p className="font-bold text-lg ml-3 mt-3">Groups</p>
                )}

                {groupsList.map((col) => (
                  <div
                    onClick={() => {
                      setMessages([]);
                      setDirectMessage(false), setGroup(true), setServer(false);
                      loadMessages(col.channel_id, col.id),
                      setGroupID(col.id),
                        setChatName(col.name);
                    }}
                  >
                    <Group name={col.name} users={col.users} />
                  </div>
                ))}

                {serversList.length > 0 && (
                  <p className="font-bold text-lg ml-3 mt-3">Servers</p>
                )}

                {serversList.map((col) => (
                  <div
                    onClick={() => {
                      setMessages([]);
                      setDirectMessage(false), setGroup(false), setServer(true);
                      setServerName(col.name);
                      getChannels(col.id);
                      setServerID(col.id);
                      setGroupID("");
                      setServerOwner(col.server_owner);
                      setChatName("");
                    }}
                  >
                    <Server name={col.name} />
                  </div>
                ))}
              </ul>
            </>
          ) : (
            <>
              <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content text-md">
                <div
                  onClick={() => {
                    socketDisconnect(),
                      setServerID(""),
                      setMessages([]),
                      setChannelID(null),
                      setDirectMessage(false),
                      setGroup(false),
                      setServer(false),
                      setServerChannels([]),
                      setServerName("");
                    setChatName("");
                  }}
                >
                  <SidebarOption
                    icon={<BiArrowBack className="h-6 w-6" />}
                    text="Back"
                  />
                </div>
                <hr className="mt-2" />
                <p className="font-bold text-lg ml-3 mt-3">Channels</p>
                {serverChannels.map((col) => (
                  <>
                    <li
                      className=""
                      onClick={() => {
                        setMessages([]),
                          setChannelID(null),
                          setDirectMessage(false),
                          setGroup(false),
                          setServer(true),
                          loadMessages(col.channel_id, serverID),
                          setChatName(col.name),
                          (document.getElementById(
                            "primary-sidebar"
                          ).checked = false);
                      }}
                    >
                      <div className="text-left text-lg mt-0">
                        <BiHash className="opacity-75" />
                        <div>
                          <p className="-ml-2 font-semibold">{col.name}</p>
                        </div>
                      </div>
                    </li>
                  </>
                ))}
              </ul>
            </>
          )}
          <div className="mt-10" />
        </div>
      </div>

      {channelID && directMessage && (
        <div className="fixed dropdown dropdown-end mt-2 z-50 right-0 top-0 mr-16">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div>
              <BiUser />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-36 mt-4 border border-secondary"
          >
            <li className="cursor-pointer m-1">
              <button
                onClick={() => {
                  setUserDataLoading(true),
                    setUserData([]),
                    showUserData(otherUserID);
                }}
              >
                Profile
              </button>
            </li>
            <li className="cursor-pointer m-1">
              <button
                onClick={() => {
                  removeFriend(channelID);
                }}
              >
                Remove
              </button>
            </li>
          </ul>
        </div>
      )}

      {server && (
        <div className="fixed dropdown dropdown-end mt-2 z-50 right-0 top-0 mr-16">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div>
              <BiGridVertical />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-36 mt-4 border border-secondary"
          >
            {serverOwner === Cookies.get("id") && (
              <>
                <li className="cursor-pointer m-1">
                  <button
                    onClick={() => {
                      window.location.href = "/server-settings?id=" + serverID;
                    }}
                  >
                    Settings
                  </button>
                </li>
              </>
            )}
            <li className="cursor-pointer m-1">
              <button
                onClick={() => {
                  window.invite_to_server_modal.showModal();
                }}
              >
                Invite
              </button>
            </li>
            {serverOwner !== Cookies.get("id") && (
              <li className="cursor-pointer m-1">
                <button
                  onClick={() => {
                    leaveServer();
                  }}
                >
                  Leave
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {group && (
        <div className="fixed dropdown dropdown-end mt-2 z-50 right-0 top-0 mr-16" onClick={() => window.location.href = "/group-settings?id=" + groupID}>
          <label className="btn btn-ghost btn-circle avatar">
              <BiCog />
          </label>
        </div>
      )}

      <dialog
        id="add_friend_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-secondary-content">
            Add Friend
          </h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Enter your friends username</span>
            </label>
            <input
              type="username"
              placeholder="Your friend"
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

      <dialog
        id="new_group_chat_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-secondary-content">
            New Group Chat
          </h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Enter your friends usernames</span>
            </label>
            <input
              type="username"
              placeholder="Friends usernames"
              className="input input-bordered input-secondary w-full max-w-full text-white"
              value={groupChatUsernames}
              onChange={(e) => setGroupChatUsernames(e.target.value)}
            />
            <label className="label">
              <span className="label-text-alt">Separated by commas</span>
            </label>
          </div>
          {groupChatUsernames.split(",").map((user, index) => {
            const trimmedUser = user.trim();
            if (trimmedUser !== "") {
              return (
                <div className="avatar mt-3 ml-3" key={index}>
                  <div className="w-7 rounded-full">
                    <img
                      src={
                        "https://api.dicebear.com/6.x/initials/svg?seed=" +
                        trimmedUser +
                        "&backgroundType=gradientLinear"
                      }
                    />
                  </div>
                </div>
              );
            }
          })}

          <div className="modal-action">
            <button
              className="btn btn-primary capitalize"
              onClick={() => createGroupChat()}
            >
              Create
            </button>
            <button className="btn capitalize">Cancel</button>
          </div>
        </form>
      </dialog>

      <dialog
        id="invite_to_server_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-secondary-content">
            Invite To Server
          </h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Server code</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-secondary w-full max-w-full text-white"
              value={
                "https://app.eglo.pw/server-invite?id=" +
                serverID +
                "#KEY_REDACTED_FOR_SECURITY"
              }
              disabled
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary capitalize"
              onClick={() =>
                navigator.clipboard.writeText(
                  "https://app.eglo.pw/server-invite?id=" +
                    serverID +
                    "#" +
                    window.sessionStorage.getItem("current_key")
                )
              }
            >
              Copy
            </button>
            <button className="btn capitalize">Cancel</button>
          </div>
        </form>
      </dialog>

      <dialog
        id="new_server_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-secondary-content">
            Create Server
          </h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Enter your server name</span>
            </label>
            <input
              type="username"
              placeholder="Server name"
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

      <dialog
        id="user_data_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form
          method="dialog"
          className="modal-box border border-secondary h-[15rem]"
        >
          {!userDataLoading ? (
            <>
              <div
                className="tooltip tooltip-right -mt-5"
                data-tip={userData.id}
              >
                {userData.preferred_name ? (
                  <>
                    <h3 className="font-bold text-lg text-secondary-content">
                      {userData.preferred_name}
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-secondary-content">
                      {userData.username}
                    </h3>
                  </>
                )}
              </div>
              {userData.preferred_name && (
                <>
                  <p className="text-md mt-1 text-zinc-500 text-white break-all max-w-full mb-4">
                    {userData.username}
                  </p>
                </>
              )}
              <p className="text-sm mt-1 text-zinc-500 text-white break-all max-w-full">
                {userData.about_me}
              </p>
              {userData.username !== Cookies.get("username") ? (
                <>
                  <div className="fixed bottom-0 right-0 m-10 modal-action">
                    <button
                      className="btn capitalize"
                      onClick={() => addFriend(userData.username)}
                    >
                      Add as friend
                    </button>
                    <button className="btn btn-primary capitalize">
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fixed bottom-0 right-0 m-10 modal-action">
                    <button className="btn btn-primary capitalize">
                      Close
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mt-16">
                <span className="loading loading-spinner text-secondary" />
              </div>
              <div className="fixed bottom-0 right-0 m-10 modal-action">
                <button className="btn btn-primary capitalize">Close</button>
              </div>
            </>
          )}
        </form>
      </dialog>

      <div className="mt-20" />

      <div className="break-all">
        {messages.map((col) => (
          <>
            {col.sender_id === Cookies.get("id") ? (
              <>
                <div className="">
                  <div className="chat chat-end">
                    <div className="chat-image avatar mr-2">
                      <div
                        className="w-10 rounded-full cursor-pointer"
                        onClick={() => {
                          setUserDataLoading(true),
                            setUserData([]),
                            showUserData(col.sender_id);
                        }}
                      >
                        <img
                          src={
                            "https://api.dicebear.com/6.x/initials/svg?seed=" +
                            Cookies.get("username") +
                            "&backgroundType=gradientLinear"
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="chat-header cursor-pointer"
                      onClick={() => {
                        setUserDataLoading(true),
                          setUserData([]),
                          showUserData(col.sender_id);
                      }}
                    >
                      {Cookies.get("username")}
                    </div>
                    <div className="chat-bubble">{col.content}</div>
                    <div className="chat-footer opacity-50">
                      {new Date(col.time).toLocaleDateString(
                        "en-US",
                        DATE_OPTIONS
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="lg:ml-80">
                  <div className="chat chat-start">
                    <div className="chat-image avatar ml-2">
                      <div
                        className="w-10 rounded-full cursor-pointer"
                        onClick={() => {
                          setUserDataLoading(true),
                            setUserData([]),
                            showUserData(col.sender_id);
                        }}
                      >
                        <img
                          src={
                            "https://api.dicebear.com/6.x/initials/svg?seed=" +
                            col.sender_name +
                            "&backgroundType=gradientLinear"
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="chat-header cursor-pointer"
                      onClick={() => {
                        setUserDataLoading(true),
                          setUserData([]),
                          showUserData(col.sender_id);
                      }}
                    >
                      {col.sender_name}
                    </div>
                    <div className="chat-bubble">{col.content}</div>
                    <div className="chat-footer opacity-50">
                      {new Date(col.time).toLocaleDateString(
                        "en-US",
                        DATE_OPTIONS
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ))}
      </div>

      <div className="mt-20" />

      {chatName && (
        <>
          <button
            className="fixed btn btn-ghost bottom-0 right-0 z-50 capitalize"
            onClick={() => sendMessage()}
          >
            <BiSend />
          </button>
          {server ? (
            <>
              <input
                type="text"
                onKeyPress={handlePress}
                placeholder={"Send a message to #" + chatName}
                className="fixed input input-bordered border-l-0 border-r-0 border-b-0 input-secondary w-full bottom-0 left-0 lg:pl-[330px] pr-10"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                onKeyPress={handlePress}
                placeholder={"Send a message to " + chatName}
                className="message-input fixed input input-bordered border-l-0 border-r-0 border-b-0 input-secondary w-full bottom-0 left-0 lg:pl-[330px] pr-10"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </>
          )}
        </>
      )}

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
