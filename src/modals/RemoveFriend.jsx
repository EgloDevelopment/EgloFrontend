import { showRemoveFriend, friendToRemove, chatData } from "../states.jsx";
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

import { BiUserMinus } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showRemoveFriendModal, setShowRemoveFriendModal] = useAtom(showRemoveFriend);
  const [friendRelationIDToRemove, setFriendRelationIDToRemove] = useAtom(friendToRemove)

  const [removeFriendLoading, setRemoveFriendLoading] = useState(false);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [error, setError] = useState([]);


  async function removeFriend() {
    setRemoveFriendLoading(true);

    await makePostRequest("/api/friends/remove-friend", {
      id: friendRelationIDToRemove,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        setCurrentChatData({active: false})
        setShowRemoveFriendModal(false);
      }
    });

    setRemoveFriendLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showRemoveFriendModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Remove friend
              </ModalHeader>
              <ModalBody>
                Are you sure you want to remove this user?
              </ModalBody>
              <ModalFooter className="">
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    setShowRemoveFriendModal(false), setError([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  startContent={removeFriendLoading ? null : <BiUserMinus />}
                  isLoading={removeFriendLoading}
                  onPress={() => removeFriend()}
                >
                  Remove friend
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
