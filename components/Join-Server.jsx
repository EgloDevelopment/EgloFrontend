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
import Cookies from "js-cookie";

import addToKeychain from "../functions/add-to-keychain";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [error, setError] = useState("")

  async function joinServer() {
    const json = { id: props.serverToJoin.id };
    await axios.post("/api/servers/join-server", json).then((response) => {
      if (response.data.success) {
        addToKeychain(Cookies.get("username"), props.serverToJoin.key, props.serverToJoin.id);
        props.setServerToJoin([])
        setShowJoinServer(false)
        setError("")
      } else {
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={props.showJoinServer}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Join server</ModalHeader>
              <ModalBody>
                <p className="text-lg font-bold">{props.serverToJoin.name}</p>
                <p className="text-xs text-default-400 -mt-3">{props.serverToJoin.user_count} user(s)</p>
                {error !== "" && <p className="text-danger">{error}</p>}
              </ModalBody>
              <ModalFooter className="mt-5">
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {props.setShowJoinServer(false), props.setServerToJoin([]), setError("")}}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => joinServer()}
                >
                  Join
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
