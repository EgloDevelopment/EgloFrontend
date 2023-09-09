import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";
import { BiMenuAltLeft } from "react-icons/bi";

function Component(props) {
  return (
    <div className="z-50 w-full fixed top-0 left-0 bg-default-100 h-14">
      <div className="lg:hidden">
        <Button
          variant="light"
          isIconOnly
          className="fixed left-0 mt-[0.4rem] ml-3"
          onPress={() => props.toggleSidebarState()}
        >
          <BiMenuAltLeft />
        </Button>
      </div>

      <div className="fixed right-0 mt-[0.4rem] mr-[12.5rem]">
        {props.chatComponent}
      </div>

      <Button
        color="primary"
        className="fixed right-0 mt-[0.4rem] mr-3"
        onPress={() => (window.location.href = "/settings")}
      >
        Settings
      </Button>

      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="bordered"
            className="fixed right-0 mt-[0.4rem] mr-[6.5rem]"
          >
            Options
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="add"
            startContent={<BiSolidUser className="opacity-50" />}
            onPress={() => props.setShowAddFriend(true)}
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
            onPress={() => props.setShowNewGroupChat(true)}
          >
            Create group chat
          </DropdownItem>
          <DropdownItem
            key="logout"
            startContent={<BiSolidLogOut className="opacity-50" />}
            className="text-danger"
            color="danger"
            onPress={() => props.setShowLogout(true)}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}

export default Component;
