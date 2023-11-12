import { showCreateGroup, refreshFriends } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import { Input } from "@nextui-org/react";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

//import { Select, SelectItem, Avatar, Chip } from "@nextui-org/react";

import { BiGroup } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";

import generateString from "../functions/encryption/generate-string";
import addToKeychain from "../functions/encryption/add-to-keychain";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [createGroupLoading, setCreateGroupLoading] = useState(false);

  const [error, setError] = useState([]);

  const [usernames, setUsernames] = useState("");

  const [showCreateGroupModal, setshowCreateGroupModal] =
    useAtom(showCreateGroup);

  const [refreshFriendsState, setRefreshFriendsState] = useAtom(refreshFriends);

  async function createGroup() {
    setCreateGroupLoading(true);

    let key = generateString(50);

    let usernames_split = usernames.trim().split(",");

    await makePostRequest("/api/groups/create-chat", {
      users: usernames_split,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        setUsernames("");
        setshowCreateGroupModal(false);
        for (const val of response.users) {
          addToKeychain(val, key, response.id);
        }
        setRefreshFriendsState(true);
      }
    });

    setCreateGroupLoading(false);
  }

  async function toggleUserSelected(username) {
    if (selectedUsers.includes(username)) {
      updated = selectedUsers.filter((item) => item !== username);
      setSelectedUsers(updated);
    } else {
      updated = selectedUsers.push(username);
      setSelectedUsers(updated);
    }
  }

  return (
    <>
      <Modal
        isOpen={showCreateGroupModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create group
              </ModalHeader>
              <ModalBody>
                {/*
                <Select
                  items={cachedFriendsList}
                  variant="bordered"
                  isMultiline={true}
                  selectionMode="multiple"
                  placeholder="Select some friends"
                  isInvalid={error.field === "usernames" && true}
                  errorMessage={error.field === "usernames" && error.message}
                  classNames={{
                    base: "max-w-xs",
                    trigger: "min-h-unit-12 py-2",
                  }}
                  renderValue={
                    <div className="flex flex-wrap gap-2 mt-1 mb-1">
                      {selectedUsers.map((item) => ({ item }))}
                    </div>
                  }
                >
                  {cachedFriendsList.map((col) => (
                    <SelectItem
                      key={col.friend_id}
                      textValue={col.username}
                      onPress={() => toggleUserSelected(col.username)}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={col.username}
                          className="flex-shrink-0"
                          size="sm"
                          src={
                            "https://api.dicebear.com/6.x/initials/svg?seed=" +
                            col.username +
                            "&backgroundType=gradientLinear"
                          }
                        />
                        <div className="flex flex-col">
                          {col.preferred_name ? (
                            <>
                              <span className="text-small">
                                {col.preferred_name}
                              </span>
                              <span className="text-tiny text-default-400">
                                {col.username}
                              </span>
                            </>
                          ) : (
                            <span className="text-small">{col.username}</span>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
                          */}

                <Input
                  type="username"
                  label="Usernames"
                  variant="bordered"
                  description="Seperated by commas (,)"
                  value={usernames}
                  onChange={(e) => setUsernames(e.target.value)}
                  className="max-w-[20rem]"
                  isInvalid={error.field === "usernames" && true}
                  errorMessage={error.field === "usernames" && error.message}
                />

                <div className="mt-5">
                  {usernames.split(",").map((user, index) => {
                    const trimmedUser = user.trim();
                    if (trimmedUser !== "") {
                      return (
                        <div className="avatar ml-3">
                          <div className="rounded-full">
                            <Avatar
                              className="w-8 h-8"
                              src={
                                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                                trimmedUser +
                                "&backgroundType=gradientLinear"
                              }
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </ModalBody>
              <ModalFooter className="">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setshowCreateGroupModal(false),
                      setUsernames(""),
                      setError([]);
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={createGroupLoading ? null : <BiGroup />}
                  isLoading={createGroupLoading}
                  onPress={() => createGroup()}
                >
                  Create group
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DisplayModal;
