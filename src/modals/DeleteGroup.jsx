import {
  showDeleteGroup,
  groupID,
  refreshFriends,
  chatData,
} from "../states.jsx";
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

import { BiSolidTrash } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showDeleteGroupModal, setShowDeleteGroupModal] = useAtom(showDeleteGroup);
  const [groupSettingsID, setGroupSettingsID] = useAtom(groupID);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [refreshFriendsState, setRefreshFriendsState] = useAtom(refreshFriends);

  async function deleteGroup() {
    setDeleteLoading(true);

    await makePostRequest("/api/groups/delete-group", {
      id: groupSettingsID,
    }).then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setShowDeleteGroupModal(false)
        setCurrentChatData({ active: false });
        setRefreshFriendsState(true);
      }
    });

    setDeleteLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showDeleteGroupModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this group?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    setShowDeleteGroupModal(false),
                      setGroupSettingsID({ active: false });
                  }}
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  startContent={deleteLoading ? null : <BiSolidTrash />}
                  isLoading={deleteLoading}
                  onPress={() => deleteGroup()}
                >
                  Delete
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
