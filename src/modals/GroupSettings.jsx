import { showGroupSettings, groupID } from "../states.jsx";
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

import makePostRequest from "../functions/other/make-post-request.js";
import { BiSave } from "react-icons/bi";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showGroupSettingsModal, setShowGroupSettingsModal] = useAtom(showGroupSettings);
  const [groupSettingsID, setGroupSettingsID] = useAtom(groupID);

  const [saveLoading, setSaveLoading] = useState(false);

  const [error, setError] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getGroup();
  }, [groupSettingsID]);

  async function getGroup() {
    if (groupSettingsID.active === false) {
      return;
    }

    await makePostRequest("/api/groups/get-settings", {
      id: groupSettingsID,
    }).then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setGroupName(response.name);
        setUsers(response.users);
      }
    });
  }

  async function saveSettings() {
    setSaveLoading(true)

    await makePostRequest("/api/groups/update-settings", {
      id: groupSettingsID,
      name: groupName
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        setError([]);
      }
    });

    setSaveLoading(false)
  }

  return (
    <>
      <Modal
        isOpen={showGroupSettingsModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Group settings
              </ModalHeader>
              <ModalBody>
                <div className="form-control w-full max-w-xs">
                  <Input
                    type="name"
                    label="Name"
                    variant="bordered"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    isInvalid={error.field === "name" && true}
                    errorMessage={error.field === "name" && error.message}
                  />

                  <div className="mt-5 ml-1">
                    <p className="font-bold">Users:</p>
                    <div className="ml-3">
                      {users.map((user) => (
                        <p className="text-default-400">{user.username}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    setShowGroupSettingsModal(false),
                      setGroupSettingsID({ active: false });
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => saveSettings()}
                  startContent={saveLoading ? null : <BiSave />}
                  isLoading={saveLoading}
                >
                  Save
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
