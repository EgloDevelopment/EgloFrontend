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
import LeaveServer from "../../components/Leave-Server";
import ServerInvite from "../../components/Server-Invite";
import JoinServer from "../../components/Join-Server";

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

  const [showLeaveServer, setShowLeaveServer] = useState(false);
  const [serverToLeave, setServerToLeave] = useState("");

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userToView, setUserToView] = useState([]);

  const [showServerInvite, setsShowServerInvite] = useState(false);

  const [chatName, setChatName] = useState("");
  const [chatType, setChatType] = useState("");
  const [parentID, setParentID] = useState("");
  const [parentName, setParentName] = useState("");
  const [serverOwner, setServerOwner] = useState("")

  const [channelID, setChannelID] = useState("");

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [showJoinServer, setShowJoinServer] = useState(false);
  const [serverToJoin, setServerToJoin] = useState([]);

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

    if (data.friend_id || data.group_owner) {
      clear();
    }

    let chat_type = "";
    let parent_id = "";

    if (data.friend_id) {
      setChatName(data.username);
      setParentName(data.username);
      setChatType("direct");
      setChannelID(data.channel_id);
      setParentID(data.id);
      parent_id = data.id;
      chat_type = "direct";

      window.sessionStorage.setItem(
        "current_key",
        await getPrivateKey(parent_id)
      );
    } else if (data.group_owner) {
      setChatName(data.name);
      setParentName(data.name);
      setChatType("group");
      setChannelID(data.channel_id);
      setParentID(data.id);
      parent_id = data.id;
      chat_type = "group";

      window.sessionStorage.setItem(
        "current_key",
        await getPrivateKey(parent_id)
      );
    } else {
      setChatName(data.name);
      setChatType("server");
      setChannelID(data.channel_id);
      chat_type = "server";
      parent_id = parentID;
    }

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

  async function loadJoinServer(data) {
    setShowJoinServer(true);

    let extract_first_pass = data.split("?id=")[1];
    let extract_second_pass = extract_first_pass.split("#")[0];
    let extract_third_pass = extract_first_pass.split("#")[1].slice(0, 50);

    console.log(extract_first_pass);
    console.log(extract_second_pass);
    console.log(extract_third_pass);

    const json = { id: extract_second_pass };

    await axios.post("/api/servers/get-server", json).then((response) => {
      setServerToJoin({
        name: response.data.name,
        id: response.data.id,
        user_count: response.data.users.length,
        key: extract_third_pass,
      });
    });
  }

  async function clear() {
    socketDisconnect();
    setMessages([]);
    window.sessionStorage.removeItem("current_key");
    setChannelID("");
    setChatName("");
    setChatType("");
    setParentID("");
    setParentName("");
    setServerOwner("")
    setMessage("");
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

      <LeaveServer
        showLeaveServer={showLeaveServer}
        setShowLeaveServer={setShowLeaveServer}
        serverToLeave={serverToLeave}
        setServerToLeave={setServerToLeave}
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
            chatName={parentName}
            loadProfile={loadProfile}
            parentID={parentID}
            parentName={parentName}
            clear={clear}
            setShowLeaveServer={setShowLeaveServer}
            setServerToLeave={setServerToLeave}
            setShowServerInvite={setsShowServerInvite}
            serverOwner={serverOwner}
          />
        }
      />

      <ServerInvite
        showServerInvite={showServerInvite}
        setsShowServerInvite={setsShowServerInvite}
        parentID={parentID}
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

      <JoinServer
        setShowJoinServer={setShowJoinServer}
        showJoinServer={showJoinServer}
        serverToJoin={serverToJoin}
        setServerToJoin={setServerToJoin}
      />

      <Sidebar
        loadMessages={loadMessages}
        state={sidebarState}
        parentName={parentName}
        clear={clear}
        setParentID={setParentID}
        setParentName={setParentName}
        setChatType={setChatType}
        setShowAddFriend={setShowAddFriend}
        setShowNewServer={setShowNewServer}
        setShowNewGroupChat={setShowNewGroupChat}
        socketDisconnect={socketDisconnect}
        setServerOwner={setServerOwner}
      />

      <div className="mt-32 lg:ml-72 mb-20">
        {messages.map((col) => (
          <>
            <Message
              username={col.sender_name}
              message={col.content}
              time={col.time}
              showAvatar={true}
              loadProfile={loadProfile}
              loadJoinServer={loadJoinServer}
            />
          </>
        ))}
      </div>

      {channelID && (
        <>
          <Input
            type="message"
            label={
              message !== ""
                ? message.length + "/5000"
                : "Send a message to " + chatName
            }
            variant="bordered"
            radius="none"
            className="fixed bg-background z-30 bottom-0 left-0 lg:pl-72"
            onKeyPress={handlePress}
            endContent={
              <ButtonGroup>
                {/*
                <Button
                  color="primary"
                  variant="bordered"
                  isIconOnly
                  onPress={() => sendMessage()}
                >
                  <BiUpload />
                </Button>
            */}
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
