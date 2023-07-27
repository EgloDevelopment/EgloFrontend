import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";
import {
  BiSend,
  BiUser,
  BiGridVertical,
  BiMenuAltLeft,
  BiUserPlus,
  BiServer,
  BiArrowBack,
  BiHash
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

  const [serverChannels, setServerChannels] = useState([]);
  const [serverOwner, setServerOwner] = useState("");

  const [otherUserID, setOtherUserID] = useState("");

  const [userData, setUserData] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(true);

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
    getServersList();
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
        setError(null);
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
              <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content text-md">
                <div onClick={() => window.add_friend_modal.show()}>
                  <SidebarOption
                    icon={<BiUserPlus className="h-6 w-6" />}
                    text="Add friend"
                  />
                </div>

                <div onClick={() => window.new_server_modal.show()}>
                  <SidebarOption
                    icon={<BiServer className="h-6 w-6" />}
                    text="Create server"
                  />
                </div>

                <hr className="mt-2" />
                <p className="font-bold text-lg ml-3 mt-3">Direct Messages</p>

                {friendsList.map((col) => (
                  <div
                    onClick={() => {
                      setMessages([]);
                      setChannelID(null),
                        setDirectMessage(true),
                        setServer(false);
                      loadMessages(col.channel_id, col.channel_id),
                        setChatName(col.username),
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

                <p className="font-bold text-lg ml-3 mt-3">Servers</p>
                {serversList.map((col) => (
                  <div
                    onClick={() => {
                      setMessages([]);
                      setChannelID(null),
                        setDirectMessage(false),
                        setServer(true);
                      setServerName(col.name);
                      getChannels(col.id);
                      setServerID(col.id);
                      setServerOwner(col.server_owner);
                    }}
                  >
                    <Server name={col.name} />
                  </div>
                ))}
              </ul>
            </>
          ) : (
            <>
              <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content text-md">
                <div
                  onClick={() => {
                    setServerID(""),
                    setMessages([]),
                    setChannelID(null),
                    setDirectMessage(false),
                    setServer(false),
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
        </div>
      </div>

      {channelID && directMessage && (
        <div className="absolute dropdown dropdown-end mt-2 z-50 right-0 mr-16">
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
        <div className="absolute dropdown dropdown-end mt-2 z-50 right-0 mr-16">
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

      <div className="dropdown dropdown-end">
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

      <dialog
        id="invite_to_server_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-white">Invite To Server</h3>
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
                    <h3 className="font-bold text-lg text-white">
                      {userData.preferred_name}
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-white">
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

      <div className="break-words">
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
                <div className="">
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

      {channelID && (
        <>
          <button
            className="fixed btn btn-ghost bottom-0 right-0 z-50 capitalize"
            onClick={() => sendMessage()}
          >
            <BiSend />
          </button>
          <input
            type="text"
            onKeyPress={handlePress}
            placeholder={"Send a message to " + chatName}
            className="fixed input input-bordered input-secondary w-full bottom-0 left-0 lg:pl-[330px]"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </>
      )}

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success hover:bg-green-900 cursor-pointer border-0"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error hover:bg-red-900 cursor-pointer border-0"
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
