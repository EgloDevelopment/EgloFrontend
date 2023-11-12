import {
  sidebarState,
  sidebarPage,
  showAddFriend,
  showCreateGroup,
  chatData,
} from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";

import Cookies from "js-cookie";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

import { BiHash } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";

function Component(props) {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const [showAddFriendModal, setShowAddFriendModal] = useAtom(showAddFriend);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [currentSidebarPage, setCurrentSidebarPage] = useAtom(sidebarPage);

  const [showCreateGroupModal, setshowCreateGroupModal] = useAtom(showCreateGroup)

  useEffect(() => {}, []);

  return (
    <>
      <div className={showSidebar ? "show" : "hidden"}>
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col shadow-lg overflow-y-scroll hide-scrollbars bg-default-100 z-50 mt-14">
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Direct Messages" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => {
                    setCurrentSidebarPage("FriendsAndGroups");
                  }}
                  fallback={<BiHomeAlt2 className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <hr className="mt-3 w-[3rem] ml-[0.5rem] border-default-400" />
          <div className="rounded-lg cursor-pointer mt-3">
            <div className="ml-[0.7rem]">
              <Tooltip content="server name" placement="right">
                <Avatar
                  className="w-10 h-10"
                  onClick={() => {
                    setCurrentChatData({ active: false }),
                      setCurrentSidebarPage("ServerChannels");
                  }}
                  src={
                    "https://api.dicebear.com/6.x/initials/svg?seed=" +
                    "te" +
                    "&backgroundType=gradientLinear"
                  }
                />
              </Tooltip>
            </div>
          </div>

          <hr className="mt-3 w-[3rem] ml-[0.5rem] border-default-400" />

          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Add friend" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => setShowAddFriendModal(true)}
                  fallback={<BiSolidUser className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Create server" placement="right">
                <Avatar
                  className=""
                  showFallback
                  //onClick={() => setshowCreateGroupModal(true)}
                  fallback={<BiSolidServer className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Create group chat" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => setshowCreateGroupModal(true)}
                  fallback={<BiSolidGroup className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;
