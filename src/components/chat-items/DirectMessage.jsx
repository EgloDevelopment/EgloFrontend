import {
  chatData,
  showUserProfile,
  showRemoveFriend,
  friendToRemove,
  userToView,
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

import { BiSolidUserMinus } from "react-icons/bi";
import { BiSolidIdCard } from "react-icons/bi";

function Component(props) {
  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [showRemoveFriendModal, setShowRemoveFriendModal] =
    useAtom(showRemoveFriend);
  const [friendRelationIDToRemove, setFriendRelationIDToRemove] =
    useAtom(friendToRemove);

  const [showUserProfileModal, setShowUserProfileModal] =
    useAtom(showUserProfile);
  const [userProfileToView, setUserProfileToView] = useAtom(userToView);

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
            description="Direct message"
            name={currentChatData.label.name}
          />
        </DropdownTrigger>

        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            key="add"
            startContent={<BiSolidIdCard className="opacity-50" />}
            onPress={() => {
              setUserProfileToView(currentChatData.label.name),
                setShowUserProfileModal(true);
            }}
          >
            View profile
          </DropdownItem>
          <DropdownItem
            key="create"
            className="text-danger"
            startContent={<BiSolidUserMinus className="opacity-50" />}
            onPress={() => {
              setShowRemoveFriendModal(true),
                setFriendRelationIDToRemove(currentChatData.connection_data.id);
            }}
          >
            Remove friend
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

export default Component;
