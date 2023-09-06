import React, { useState } from "react";
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

import { BiPlus } from "react-icons/bi";

import axios from "axios";
import validator from "validator";
import Cookies from "js-cookie";

import generateString from "../functions/generate-string";
import addToKeychain from "../functions/add-to-keychain";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [newGroupChatLoading, setNewGroupChatLoading] = useState(false);

  const [error, setError] = useState("");

  const [users, setUsers] = useState("");

  async function newGroupChat() {
    setNewGroupChatLoading(true)

    if (validator.isEmpty(users) === true) {
      setError("Must provide usernames");
      setNewGroupChatLoading(false)
      return;
    }

    if (users.split(",").length <= 1) {
      setError("You must have more than one person in a group");
      setNewGroupChatLoading(false)
      return;
    }

    let usernames = users.split(",");

    for (const val of usernames) {
      if (
        validator.isEmpty(val.trim()) === true ||
        validator.isAlphanumeric(val.trim()) === false
      ) {
        setError("Username(s) invalid");
        setNewGroupChatLoading(false)
        return;
      }
    }

    const json = { users: usernames };

    let key = generateString(50);

    await axios.post("/api/groups/create", json).then((response) => {
      if (!response.data.error) {
        for (const val of response.data.users) {
          addToKeychain(val, key, response.data.id);
        }
        setNewGroupChatLoading(false)
        props.setShowNewGroupChat(false);
        setUsers("");
      } else {
        setError(response.data.error);
        setNewGroupChatLoading(false)
        console.log(response);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={props.showNewGroupChat}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New group
              </ModalHeader>
              <ModalBody>
                <Input
                  type="username"
                  label="Usernames"
                  variant="bordered"
                  value={users}
                  onChange={(e) => setUsers(e.target.value)}
                  className="mt-5 max-w-[20rem]"
                  validationState={error !== "" && "invalid"}
                  errorMessage={error !== "" && error}
                />

                <p className="text-xs text-default-500">
                  {users === "" ? 0 : users.split(",").length}/50 users
                </p>

                <p className="text-xs text-default-500">
                  Seperated by commas (,)
                </p>

                <div className="mt-5">
                  {users.split(",").map((user, index) => {
                    const trimmedUser = user.trim();
                    if (trimmedUser !== "") {
                      return (
                        <div className="avatar ml-3">
                          <div className="w-7 rounded-full">
                            <img
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
              <ModalFooter className="mt-7">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    props.setShowNewGroupChat(false),
                      setUsers(""),
                      setError("");
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={newGroupChatLoading ? null : <BiPlus />}
                  isLoading={newGroupChatLoading}
                  onPress={() => newGroupChat()}
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

export default Component;
