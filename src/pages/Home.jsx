import { useState, useEffect } from "react";

import axios from "axios";
import validator from "validator";

import { Button, ButtonGroup, toggle } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import Error from "../../components/Error";

import Sidebar from "../../components/Sidebar";
import AddFriend from "../../components/Add-Friend";
import Navbar from "../../components/Navbar";
import Logout from "../../components/Logout";
import NewGroupChat from "../../components/New-Group-Chat";
import NewServer from "../../components/New-Server";
import Message from "../../components/Message";
import UserProfile from "../../components/user-profile";

import decrypt from "../../functions/decrypt";
import encrypt from "../../functions/encrypt";
import getPrivateKey from "../../functions/get-private-key-from-keychain";
import checkLoggedIn from "../../functions/check-logged-in";

function App() {
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

  const [channelID, setChannelID] = useState("");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [sidebarState, setSidebarState] = useState("shown");

  useEffect(() => {
    checkLoggedIn();
  }, []);

  async function loadMessages(data) {
    console.log(data);

    let chat_type = "";

    if (data.friend_id) {
      setChatName(data.username);
      setChatType("direct");
      setChannelID(data.channel_id);
      chat_type = "direct";
    }

    if (data.group_owner) {
      setChatName(data.name);
      setChatType("group");
      setChannelID(data.channel_id);
      chat_type = "group";
    }

    if (data.server_owner) {
      setChatName(data.name);
      setChatType("server");
      setChannelID("");
      chat_type = "server";
    }

    window.sessionStorage.setItem("current_key", await getPrivateKey(data.id));

    if (chat_type === "direct") {
      const json = { channel_id: data.channel_id };

      await axios.post("/api/messages/get?limit=50", json).then((response) => {
        for (const val of response.data) {
          decrypt(val.content).then((result) => {
            val.content = result;
          });
        }
        setMessages(response.data);
      });
    }

    if (chat_type === "group") {
      const json = { channel_id: data.channel_id };

      await axios.post("/api/messages/get?limit=50", json).then((response) => {
        for (const val of response.data) {
          decrypt(val.content).then((result) => {
            val.content = result;
          });
        }
        setMessages(response.data);
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

    setMessage("");

    let encrypted_message = await encrypt(message);

    const json = { channel_id: channelID, content: encrypted_message };

    await axios.post("/api/messages/send", json).then((response) => {
      if (response.data.error) {
        console.log(response);
      }
    });
  }

  const handlePress = (e) => {
    if (message) {
      if (e.key === "Enter") {
        sendMessage();
      }
    }
  };

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
        header={chatName}
        setShowAddFriend={setShowAddFriend}
        setShowNewGroupChat={setShowNewGroupChat}
        setShowLogout={setShowLogout}
        setShowNewServer={setShowNewServer}
        toggleSidebarState={toggleSidebarState}
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

      <Input
        type="message"
        variant="bordered"
        className="fixed bg-background z-30 bottom-0 left-0 lg:pl-72"
        radius="none"
        onKeyPress={handlePress}
        endContent={
          <Button
            color="primary"
            className=" hover:bg-purple-500 transition -mr-[0.65rem]"
            onPress={() => sendMessage()}
            size="sm"
            radius="none"
          >
            Send
          </Button>
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </>
  );
}

export default App;
