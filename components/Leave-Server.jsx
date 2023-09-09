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

import axios from "axios";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [serverID, setServerID] = useState("");

  const [error, setError] = useState("");

  async function leaveServer() {
    const json = { server_id: props.serverToLeave.id };

    await axios.post("/api/servers/leave", json).then((response) => {
      if (!response.data.error) {
        props.setShowLeaveServer(false);
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={props.showLeaveServer}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to leave the server{" "}
                  {props.serverToLeave.name}?
                </p>

                {error !== "" && <p className="text-danger">{error}</p>}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    setError(""), props.setShowLeaveServer(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => leaveServer()}
                >
                  Confirm
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
