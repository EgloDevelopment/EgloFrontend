import React from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import axios from "axios";

import { BiSolidMessageAlt } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidCog } from "react-icons/bi";
import { BiSolidLogOut } from "react-icons/bi";

function Component(props) {
  async function removeFriend() {
    const json = { id: props.parentID, channel_id: props.channelID };

    await axios.post("/api/friends/remove-friend", json).then((response) => {
      if (!response.data.error) {
        props.clear();
      } else {
        console.log(response);
      }
    });
  }

  return (
    <>
      {props.chatType === "direct" && (
        <>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{props.chatName}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="copy"
                startContent={<BiSolidMessageAlt className="opacity-50" />}
                onPress={() => props.loadProfile(props.chatName)}
              >
                View profile
              </DropdownItem>
              <DropdownItem
                key="delete"
                startContent={<BiSolidUser className="opacity-50" />}
                className="text-danger"
                color="danger"
                onPress={() => removeFriend()}
              >
                Remove friend
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}

      {props.chatType === "group" && (
        <>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{props.chatName}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="copy"
                startContent={<BiSolidCog className="opacity-50" />}
                onPress={() =>
                  (window.location.href =
                    "/group-settings?id=" + props.parentID)
                }
              >
                Settings
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}

      {props.chatType === "server" && (
        <>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">{props.chatName}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="settings"
                startContent={<BiSolidCog className="opacity-50" />}
                onPress={() =>
                  (window.location.href =
                    "/server-settings?id=" + props.parentID)
                }
              >
                Settings
              </DropdownItem>
              <DropdownItem
                key="leave"
                startContent={<BiSolidLogOut className="opacity-50" />}
                className="text-danger"
                color="danger"
                onPress={() => {
                  props.setServerToLeave({
                    id: props.parentID,
                    name: props.parentName,
                  }),
                    props.setShowLeaveServer(true);
                }}
              >
                Leave server
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
    </>
  );
}

export default Component;
