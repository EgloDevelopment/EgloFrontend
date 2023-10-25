import {
  sidebarState,
  sidebarPage,
  chatData,
  showFileUpload,
  showError,
  error,
} from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import { BiSend } from "react-icons/bi";
import { BiUpload } from "react-icons/bi";

import checkLoggedIn from "../functions/other/check-logged-in";
import makePostRequest from "../functions/other/make-post-request";
import getPrivateKey from "../functions/encryption/get-private-key-from-keychain";
import decrypt from "../functions/encryption/decrypt";
import encrypt from "../functions/encryption/encrypt";

import FriendsAndGroupsSidebar from "../components/FriendsAndGroupsSidebar.jsx";
import ServerListSidebar from "../components/ServerListSidebar.jsx";
import ServerChannelsSidebar from "../components/ServerChannelsSidebar.jsx";
import Navbar from "../components/Navbar.jsx";

import AddFriend from "../modals/AddFriend.jsx";
import Logout from "../modals/Logout.jsx";
import FileUpload from "../modals/FileUpload.jsx";
import FileDownload from "../modals/FileDownload.jsx";
import UserProfile from "../modals/UserProfile.jsx";
import Error from "../modals/Error.jsx";
import Encrypted from "../modals/Encrypted.jsx"

import News from "../modals/News.jsx";

import ChatMessage from "../components/ChatMessage.jsx";

let ws;

function Page() {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [currentSidebarPage, setCurrentSidebarPage] = useAtom(sidebarPage);

  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const [showFileUploadModal, setShowFileUploadModal] = useAtom(showFileUpload);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const [messageInvalid, setMessageInvalid] = useState(false);

  const [message, setMessage] = useState("");

  const [showErrorModal, setShowErrorModal] = useAtom(showError);
  const [errorToShow, setErrorToShow] = useAtom(error);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [currentChatData]);

  async function refreshOnlineStatus() {
    await makePostRequest("/api/auth/refresh-online-status").then(
      (response) => {
        if (response.error === true) {
          console.log(response);
        }
      }
    );
  }

  setInterval(function () {
    refreshOnlineStatus();
  }, 180000);

  async function scrollToBottom() {
    await delay(200);
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    element.scroll({
      top: bottom,
      behavior: "smooth",
    });
  }

  async function loadMessages() {
    if (currentChatData.active === false) {
      return;
    }

    setMessagesLoading(true);

    if (ws) {
      ws.send(
        JSON.stringify({
          $websocket_data: {
            action: "unsubscribe",
            id: currentChatData.connection_data.id,
          },
        })
      );
      ws.close();
    }

    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }

    console.log(currentChatData);

    window.sessionStorage.setItem(
      "current_key",
      await getPrivateKey(currentChatData.connection_data.id)
    );

    await makePostRequest("/api/messages/get-messages?limit=50", {
      channel_id: currentChatData.connection_data.channel_id,
    }).then((response) => {
      for (const val of response) {
        decrypt(val.content).then((result) => {
          val.content = result;
        });
      }
      setMessages(response);
      scrollToBottom();
    });

    ws = new WebSocket(`wss://rts.eglo.pw`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          $websocket_data: {
            action: "subscribe",
            id: currentChatData.connection_data.channel_id,
          },
        })
      );
    };

    setMessagesLoading(false);

    ws.onmessage = async function (event) {
      const json = JSON.parse(event.data);

      await decrypt(json.content).then((result) => {
        setMessages((currentMsg) => [
          ...currentMsg,
          {
            sender_name: json.sender_name,
            time: json.time,
            content: result,
          },
        ]);
        scrollToBottom();
      });
    };
  }

  async function sendMessage() {
    if (message.length > 5000) {
      setMessageInvalid(true);
      return;
    } else {
      setMessageInvalid(false);
    }

    if (message.trim() === "") {
      return;
    }

    let encrypted_message = await encrypt(message);

    ws.send(
      JSON.stringify({
        $websocket_data: {
          action: "publish",
          id: currentChatData.connection_data.channel_id,
        },
        sender_name: Cookies.get("username"),
        time: Date.now(),
        content: encrypted_message,
      })
    );

    await makePostRequest("/api/messages/send-message", {
      channel_id: currentChatData.connection_data.channel_id,
      content: encrypted_message,
    }).then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setMessage("");
      }
    });
  }

  function handlePress(e) {
    if (message) {
      if (e.key === "Enter") {
        sendMessage();
      }
    }
  }

  return (
    <>
      <Navbar />

      <ServerListSidebar />
      {currentSidebarPage === "FriendsAndGroups" && <FriendsAndGroupsSidebar />}
      {currentSidebarPage === "ServerChannels" && <ServerChannelsSidebar />}

      <AddFriend />
      <Logout />

      <FileUpload />
      <FileDownload />

      <Error />
      <Encrypted />

      <UserProfile />

      <News />

      <div>
        {messagesLoading === true && (
          <>
            <div className="flex flex-col min-h-screen justify-center items-center lg:pl-72">
              <Spinner />
            </div>
          </>
        )}

        {currentChatData.active !== false && messagesLoading === false && (
          <>
            <div className="mt-32 lg:ml-72 mb-20">
              {messages.map((col) => (
                <>
                  <ChatMessage
                    username={col.sender_name}
                    message={col.content}
                    time={col.time}
                    showAvatar={true}
                  />
                </>
              ))}
            </div>

            <Input
              type="message"
              label={
                message !== ""
                  ? message.length + "/5000"
                  : "Send a message to " + currentChatData.label.name
              }
              variant="bordered"
              radius="none"
              className="fixed bg-background z-30 bottom-0 left-0 lg:pl-72 no-border-force"
              onKeyPress={handlePress}
              endContent={
                <>
                  <Button
                    color="primary"
                    variant="light"
                    isIconOnly
                    onPress={() => setShowFileUploadModal(true)}
                  >
                    <BiUpload />
                  </Button>
                  <Button
                    color="primary"
                    variant="light"
                    className="-mr-[0.65rem]"
                    isIconOnly
                    onPress={() => sendMessage()}
                  >
                    <BiSend />
                  </Button>
                </>
              }
              value={message}
              isInvalid={messageInvalid}
              onChange={(e) => setMessage(e.target.value)}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Page;
