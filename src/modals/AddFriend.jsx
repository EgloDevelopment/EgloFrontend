import { showAddFriend } from "../states.jsx";
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

import { BiUserPlus } from "react-icons/bi";

import Cookies from "js-cookie";

import makePostRequest from "../functions/other/make-post-request";

import generateString from "../functions/encryption/generate-string";
import addToKeychain from "../functions/encryption/add-to-keychain";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showAddFriendModal, setShowAddFriendModal] = useAtom(showAddFriend);

  const [addFriendLoading, setAddFriendLoading] = useState(false);

  const [error, setError] = useState([]);

  const [username, setUsername] = useState("");

  async function addFriend() {
    setAddFriendLoading(true);

    let key = generateString(50);

    await makePostRequest("/api/friends/add-friend", {
      username: username,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        addToKeychain(Cookies.get("username"), key, response.id);
        addToKeychain(username, key, response.id);
        setUsername("");
        setShowAddFriendModal(false);
      }
    });

    setAddFriendLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showAddFriendModal}
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
                  className="max-w-[20rem]"
                  isInvalid={error.field === "username" && true}
                  errorMessage={error.field === "username" && error.message}
                />
              </ModalBody>
              <ModalFooter className="">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setShowAddFriendModal(false), setError([]);
                  }}
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

export default DisplayModal;
