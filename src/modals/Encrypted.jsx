import { showEncrypted } from "../states.jsx";
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

import makePostRequest from "../functions/other/make-post-request.js";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showEncryptedModal, setShowEncryptedModal] = useAtom(showEncrypted);

  return (
    <>
      <Modal
        isOpen={showEncryptedModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                End-to-End encryption
              </ModalHeader>
              <ModalBody>
                <p>
                  Your messages are triple encrypted for top-notch security with
                  Eglo's protocol, Asymmetric and Symetric Encryption, and TLS, a trusted system in use for over a
                  decade. Eglo cannot access or decode any of your
                  communications or files. Our open-source platform invites code
                  auditing on{" "}
                  <a
                    target="_blank"
                    className="text-grey underline"
                    href="https://github.com/EgloDevelopment"
                  >
                    GitHub
                  </a>
                  , ensuring transparency and quick resolution of any concerns.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => setShowEncryptedModal(false)}
                >
                  Close
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
