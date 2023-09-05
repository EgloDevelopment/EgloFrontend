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

import { BiUserPlus } from "react-icons/bi"

import axios from "axios";
import validator from "validator";
import Cookies from "js-cookie";

import generateString from "../functions/generate-string"
import addToKeychain from "../functions/add-to-keychain"

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [addFriendLoading, setAddFriendLoading] = useState(false);

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");

  async function addFriend() {
    setAddFriendLoading(true)

    if (validator.isEmpty(username) === true) {
        setError("Username can not be empty")
        setAddFriendLoading(false)
        return
    }

    let key = generateString(50);

    const json = { username: username };
    await axios.post("/api/friends/add", json).then((response) => {
      if (response.data.success) {
        addToKeychain(Cookies.get("username"), key, response.data.id);
        addToKeychain(username, key, response.data.id);
        setError("Added " + username + " as friend");
        setUsername("")
        props.setShowAddFriend(false)
        setAddFriendLoading(false)
      } else {
        setAddFriendLoading(false)
        setError(response.data.error)
        console.log(response);
      }
    });

  }

  return (
    <>
      <Modal
        isOpen={props.showAddFriend}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add friend
              </ModalHeader>
              <ModalBody>
                <Input
                  type="username"
                  label="Username"
                  variant="bordered"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-5 max-w-[20rem]"
                  validationState={error !== "" && "invalid"}
                  errorMessage={error !== "" && error}
                />
              </ModalBody>
              <ModalFooter className="mt-7">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {props.setShowAddFriend(false), setError("")}}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={addFriendLoading ? null : <BiUserPlus />}
                  isLoading={addFriendLoading}
                  onPress={() => addFriend()}
                >
                  Add friend
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
