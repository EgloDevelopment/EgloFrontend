import { useState, useEffect } from "react";

import axios from "axios";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import Error from "../../components/Error";

import Sidebar from "../../components/Sidebar"
import AddFriend from "../../components/Add-Friend"
import Navbar from "../../components/Navbar"
import Logout from "../../components/Logout"

import CheckLoggedIn from "../../functions/check-logged-in"

function App() {
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState("")

  const [showAddFriend, setShowAddFriend] = useState(false)

  const [showLogout, setShowLogout] = useState(false)

  const [chatName, setChatName] = useState("")
  const [chatType, setChatType] = useState("")

  useEffect(() => {
    CheckLoggedIn()
  }, []);

  async function loadMessages(data) {
    if (data.friend_id) {
      setChatName(data.username)
      setChatType("direct")
    }
  }

  return (
    <>
      <Error showError={showError} setShowError={setShowError} text={error} />

      <Logout showLogout={showLogout} setShowLogout={setShowLogout} />

      <Navbar header={chatName} setShowAddFriend={setShowAddFriend} setShowLogout={setShowLogout} />

      <AddFriend showAddFriend={showAddFriend} setShowAddFriend={setShowAddFriend} />

      <Sidebar loadMessages={loadMessages} />
    </>
  );
}

export default App;
