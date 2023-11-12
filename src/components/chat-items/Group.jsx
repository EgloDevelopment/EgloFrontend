import {
  chatData,
  showLeaveGroup,
  showDeleteGroup,
  showGroupSettings,
  groupID,
} from "../../states.jsx";
import { useAtom } from "jotai";

import React, { useState } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  User,
} from "@nextui-org/react";

import Cookies from "js-cookie";

import { BiSolidExit } from "react-icons/bi";
import { BiSolidTrash } from "react-icons/bi";
import { BiSolidCog } from "react-icons/bi";

function Component(props) {
  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [showLeaveGroupModal, setShowLeaveGroupModal] = useAtom(showLeaveGroup);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useAtom(showDeleteGroup)
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useAtom(showGroupSettings);
  const [groupSettingsID, setGroupSettingsID] = useAtom(groupID);

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              src: `https://api.dicebear.com/6.x/initials/svg?seed=${currentChatData.label.name}&backgroundType=gradientLinear`,
              size: "sm",
            }}
            className="transition-transform"
            description="Group chat"
            name={currentChatData.label.name}
          />
        </DropdownTrigger>

        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="add"
            startContent={<BiSolidCog className="opacity-50" />}
            onPress={() => {
              setGroupSettingsID(currentChatData.label.id),
                setShowGroupSettingsModal(true);
            }}
          >
            Group settings
          </DropdownItem>
          {Cookies.get("id") === currentChatData.label.owner ? (
            <DropdownItem
              key="create"
              className="text-danger"
              startContent={<BiSolidTrash className="opacity-50" />}
              onPress={() => {
                setGroupSettingsID(currentChatData.label.id),
                  setShowDeleteGroupModal(currentChatData.connection_data.id);
              }}
            >
              Delete group
            </DropdownItem>
          ) : (
            <DropdownItem
              key="create"
              className="text-danger"
              startContent={<BiSolidExit className="opacity-50" />}
              onPress={() => {
                setGroupSettingsID(currentChatData.label.id),
                  setShowLeaveGroupModal(currentChatData.connection_data.id);
              }}
            >
              Leave group
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default Component;
