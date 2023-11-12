import {
  sidebarState,
  showAddFriend,
  showLogout,
  showEncrypted,
  showCreateGroup
} from "../states.jsx";
import { useAtom } from "jotai";

import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
} from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

import { BiSolidNavigation } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";
import { BiMenuAltLeft } from "react-icons/bi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BiSolidLockAlt } from "react-icons/bi";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

import Cookies from "js-cookie";

import redirect from "../functions/routing/redirect.js";

function Component(props) {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const [showAddFriendModal, setShowAddFriendModal] = useAtom(showAddFriend);

  const [showLogoutModal, setShowLogoutModal] = useAtom(showLogout);

  const [showEncryptedModal, setShowEncryptedModal] = useAtom(showEncrypted);

  const [showCreateGroupModal, setshowCreateGroupModal] = useAtom(showCreateGroup)

  return (
    <div className="z-50 w-full fixed top-0 left-0 bg-default-100 h-14">
      {props.topInteraction ? (
        props.topInteraction
      ) : (
        <div className="lg:hidden">
          <Button
            variant="light"
            isIconOnly
            className="fixed left-0 mt-[0.5rem] ml-3"
            onPress={() => setShowSidebar(!showSidebar)}
          >
            <BiMenuAltLeft />
          </Button>
        </div>
      )}

      <div className="fixed right-0 mt-[0.5rem] mr-16">{props.chatItems}</div>

      {props.showOptions !== false && (
        <>
        {/*
          <div className="fixed right-0 mt-[0.5rem] mr-16">
            <Button
              isIconOnly
              variant="light"
              onPress={() => setShowEncryptedModal(true)}
            >
              <BiSolidLockAlt />
            </Button>
          </div>
      */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                isIconOnly
                className="fixed right-0 mt-[0.5rem] mr-3"
              >
                <BiDotsHorizontalRounded />
              </Button>
            </DropdownTrigger>

            <DropdownMenu aria-label="Static Actions">
              <DropdownSection showDivider>
                <DropdownItem
                  key="add"
                  startContent={<BiSolidUser className="opacity-50" />}
                  onPress={() => setShowAddFriendModal(true)}
                >
                  Add friend
                </DropdownItem>
                <DropdownItem
                  key="new"
                  startContent={<BiSolidServer className="opacity-50" />}
                  onPress={() => props.setShowNewServer(true)}
                >
                  New server
                </DropdownItem>
                <DropdownItem
                  key="create"
                  startContent={<BiSolidGroup className="opacity-50" />}
                  onPress={() => setshowCreateGroupModal(true)}
                >
                  Create group chat
                </DropdownItem>
              </DropdownSection>

              <DropdownSection showDivider>
                <DropdownItem
                  key="settings"
                  startContent={
                    <Avatar
                      className="w-10 h-6"
                      src={
                        "https://api.dicebear.com/6.x/initials/svg?seed=" +
                        Cookies.get("username") +
                        "&backgroundType=gradientLinear"
                      }
                    />
                  }
                  endContent={
                    <Button
                      color="danger"
                      size="sm"
                      onPress={() => setShowLogoutModal(true)}
                      isIconOnly
                    >
                      <BiSolidLogOut />
                    </Button>
                  }
                  onPress={() => redirect("/settings")}
                  description={Cookies.get("username")}
                >
                  Settings
                </DropdownItem>
              </DropdownSection>

              <DropdownItem
                key="subscribe"
                className="text-primary"
                startContent={<BiSolidNavigation className="opacity-50" />}
                onPress={() => redirect("/subscribe")}
              >
                Subscribe to Eglo+
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </div>
  );
}

export default Component;
