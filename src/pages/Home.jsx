import { useState, useEffect } from "react";

import axios from "axios";

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

  const [chatName, setChatName] = useState("");
  const [chatType, setChatType] = useState("");

  const [messages, setMessages] = useState([]);

  const [sidebarState, setSidebarState] = useState("shown")

  useEffect(() => {
    checkLoggedIn();
  }, []);

  async function loadMessages(data) {
    setChatName("");

    console.log(data);

    let chat_type = "";

    if (data.friend_id) {
      setChatName(data.username);
      setChatType("direct");
      chat_type = "direct";
    }

    if (data.group_owner) {
      setChatName(data.name);
      setChatType("group");
      chat_type = "group";
    }

    if (data.server_owner) {
      setChatName(data.name);
      setChatType("server");
      chat_type = "server";
    }

    console.log(chat_type);

    window.sessionStorage.setItem("current_key", await getPrivateKey(data.id));

    if (chat_type === "direct") {
      const json = { channel_id: data.channel_id };

      await axios.post("/api/messages/get?limit=50", json).then((response) => {
        console.log(response);
      });
    }

    if (chat_type === "group") {
      const json = { channel_id: data.channel_id };

      await axios.post("/api/messages/get?limit=50", json).then((response) => {
        console.log(response);
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
      setSidebarState("shown")
    } else {
      setSidebarState("hidden")
    }
  }

  return (
    <>
      <Error showError={showError} setShowError={setShowError} text={error} />

      <Logout showLogout={showLogout} setShowLogout={setShowLogout} />

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
    </>
  );
}

export default App;
