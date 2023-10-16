import { sidebarPage } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import { Button, ButtonGroup } from "@nextui-org/react";

import checkLoggedIn from "../functions/other/check-logged-in";

import FriendsAndGroupsSidebar from "../components/FriendsAndGroupsSidebar.jsx";
import ServerListSidebar from "../components/ServerListSidebar.jsx";
import ServerChannelsSidebar from "../components/ServerChannelsSidebar.jsx"
import Navbar from "../components/Navbar.jsx";

import AddFriend from "../modals/AddFriend.jsx"
import Logout from "../modals/Logout.jsx"

import News from "../modals/News.jsx"

function Page() {
  const [currentSidebarPage, setCurrentSidebarPage] = useAtom(sidebarPage);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <>
      <Navbar />

      <ServerListSidebar />
      {currentSidebarPage === "FriendsAndGroups" && <FriendsAndGroupsSidebar />}
      {currentSidebarPage === "ServerChannels" && <ServerChannelsSidebar />}

      <AddFriend />
      <Logout />

      <News />
    </>
  );
}

export default Page;
