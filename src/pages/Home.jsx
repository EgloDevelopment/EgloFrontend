import { useState, useEffect } from "react";

import axios from "axios";
import validator from "validator";
import Cookies from "js-cookie";

import { Button, ButtonGroup, toggle } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import { BiUpload } from "react-icons/bi";

import Error from "../../components/Error";

import Sidebar from "../../components/Sidebar";
import AddFriend from "../../components/Add-Friend";
import Navbar from "../../components/Navbar";
import Logout from "../../components/Logout";
import NewGroupChat from "../../components/New-Group-Chat";
import NewServer from "../../components/New-Server";
import Message from "../../components/Message";
import UserProfile from "../../components/User-Profile";
import ChatComponent from "../../components/Chat-Component";

import decrypt from "../../functions/decrypt";
import encrypt from "../../functions/encrypt";
import getPrivateKey from "../../functions/get-private-key-from-keychain";
import checkLoggedIn from "../../functions/check-logged-in";

let ws;

function App() {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const [showAddFriend, setShowAddFriend] = useState(false);

  const [showNewGroupChat, setShowNewGroupChat] = useState(false);

  const [showLogout, setShowLogout] = useState(false);

  const [showNewServer, setShowNewServer] = useState(false);

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userToView, setUserToView] = useState([]);

  const [chatName, setChatName] = useState("");
  const [chatType, setChatType] = useState("");
  const [parentID, setParentID] = useState("");

  const [channelID, setChannelID] = useState("");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [sidebarState, setSidebarState] = useState("shown");

  useEffect(() => {
    checkLoggedIn();
  }, []);

  async function scrollToBottom() {
    await delay(200);
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    element.scroll({
      top: bottom,
      behavior: "smooth",
    });
  }

  async function loadMessages(data) {
    console.log(data);

    socketDisconnect();
    setMessages([]);

    let chat_type = "";

    if (data.friend_id) {
      setChatName(data.username);
      setChatType("direct");
      setChannelID(data.channel_id);
      setParentID(data.id);
      chat_type = "direct";
    }

    if (data.group_owner) {
      setChatName(data.name);
      setChatType("group");
      setChannelID(data.channel_id);
      setParentID(data.id);
      chat_type = "group";
    }

    if (data.server_owner) {
      setChatName(data.name);
      setChatType("server");
      setChannelID("");
      setParentID(data.id);
      chat_type = "server";
    }

    window.sessionStorage.setItem("current_key", await getPrivateKey(data.id));

    if (chat_type === "direct" || chat_type === "group") {
      const json = { channel_id: data.channel_id };

      await axios.post("/api/messages/get?limit=50", json).then((response) => {
        for (const val of response.data) {
          decrypt(val.content).then((result) => {
            val.content = result;
          });
        }
        setMessages(response.data);
        socketInitializer(data.channel_id);
        scrollToBottom();
      });
    }

    if (chat_type === "server") {
      const json = { server_id: data.id };

      await axios.post("/api/servers/get-channels", json).then((response) => {
        console.log(response);
      });
    }
  }

  async function toggleSidebarState() {
    if (sidebarState === "hidden") {
      setSidebarState("shown");
    } else {
      setSidebarState("hidden");
    }
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

  async function sendMessage() {
    if (validator.isEmpty(message) === true || channelID === "") {
      return;
    }

    let encrypted_message = await encrypt(message);

    try {
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
    } catch {
      setShowError(true);
      setError(
        "Message was sent, but will not show up in realtime, to reconnect to the realtime server please reload the chat"
      );
    }

    setMessage("");

    const json = { channel_id: channelID, content: encrypted_message };

    await axios.post("/api/messages/send", json).then((response) => {
      if (response.data.error) {
        console.log(response);
      }
    });
  }

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

  function handlePress(e) {
    if (message) {
      if (e.key === "Enter") {
        sendMessage();
      }
    }
  }

  async function clear() {
    socketDisconnect();
    setMessages([]);
    setChannelID("");
    setChatName("");
    setChatType("");
    setParentID("");
  }

  return (
    <>
      <Error showError={showError} setShowError={setShowError} text={error} />

      <Logout showLogout={showLogout} setShowLogout={setShowLogout} />

      <UserProfile
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        setUserToView={setUserToView}
        userToView={userToView}
      />

      <Navbar
        setShowAddFriend={setShowAddFriend}
        setShowNewGroupChat={setShowNewGroupChat}
        setShowLogout={setShowLogout}
        setShowNewServer={setShowNewServer}
        toggleSidebarState={toggleSidebarState}
        chatComponent={
          <ChatComponent
            chatType={chatType}
            chatName={chatName}
            loadProfile={loadProfile}
            parentID={parentID}
            clear={clear}
          />
        }
      />

      <NewGroupChat
        showNewGroupChat={showNewGroupChat}
        setShowNewGroupChat={setShowNewGroupChat}
      />

      <AddFriend
        showAddFriend={showAddFriend}
        setShowAddFriend={setShowAddFriend}
      />

      <NewServer
        showNewServer={showNewServer}
        setShowNewServer={setShowNewServer}
      />

      <Sidebar loadMessages={loadMessages} state={sidebarState} />

      <div className="mt-32 lg:ml-72 mb-20">
        {messages.map((col) => (
          <>
            <Message
              username={col.sender_name}
              message={col.content}
              time={col.time}
              showAvatar={true}
              loadProfile={loadProfile}
            />
          </>
        ))}
      </div>

      {channelID && (
        <>
          <Input
            type="message"
            label={chatName !== "" ? "Send a message to " + chatName : " "}
            variant="bordered"
            radius="none"
            className="fixed bg-background z-30 bottom-0 left-0 lg:pl-72"
            onKeyPress={handlePress}
            endContent={
              <ButtonGroup>
                <Button
                  color="primary"
                  variant="bordered"
                  isIconOnly
                  onPress={() => sendMessage()}
                >
                  <BiUpload />
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  className="-mr-[0.65rem]"
                  onPress={() => sendMessage()}
                >
                  Send
                </Button>
              </ButtonGroup>
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </>
      )}
    </>
  );
}

export default App;
