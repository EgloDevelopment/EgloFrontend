import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import { BiHash } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";
import { BiSolidFoodMenu } from "react-icons/bi"

function Component(props) {
  return (
    <div className="z-50 w-full fixed top-0 left-0 bg-default-100 h-14">
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
            key="new"
            startContent={<BiSolidFoodMenu className="opacity-50" />}
            className="lg:hidden"
            onPress={() => props.toggleSidebarState()}
          >
            Toggle sidebar
          </DropdownItem>
          <DropdownItem
            key="new"
            startContent={<BiSolidUser className="opacity-50" />}
            onPress={() => props.setShowAddFriend(true)}
          >
            Add friend
          </DropdownItem>
          <DropdownItem
            key="edit"
            startContent={<BiSolidServer className="opacity-50" />}
            onPress={() => props.setShowNewServer(true)}
          >
            New server
          </DropdownItem>
          <DropdownItem
            key="copy"
            startContent={<BiSolidGroup className="opacity-50" />}
            onPress={() => props.setShowNewGroupChat(true)}
          >
            Create group chat
          </DropdownItem>
          <DropdownItem
            key="delete"
            startContent={<BiSolidLogOut className="opacity-50" />}
            className="text-danger"
            color="danger"
            onPress={() => props.setShowLogout(true)}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {props.header && (
        <>
          <div className="text-left text-lg mt-[1.1rem] ml-5">
            <BiHash className="opacity-75" />
            <div>
              <p className="-mt-6 ml-5 font-semibold">{props.header}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Component;
