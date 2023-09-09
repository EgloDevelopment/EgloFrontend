import React from "react";
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

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal
        isOpen={props.showServerInvite}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Invite</ModalHeader>
              <ModalBody>
                <Input
                  type="url"
                  label="Invite link"
                  variant="bordered"
                  value={
                    "https://app.eglo.pw/server-invite?id=" +
                    props.parentID +
                    "#" + window.sessionStorage.getItem("current_key")
                  }
                  disabled
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => props.setsShowServerInvite(false)}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    navigator.clipboard.writeText(
                      "https://app.eglo.pw/server-invite?id=" +
                        props.parentID +
                        "#" +
                        window.sessionStorage.getItem("current_key")
                    ),
                      props.setsShowServerInvite(false);
                  }}
                >
                  Copy
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
