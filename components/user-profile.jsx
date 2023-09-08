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

import convertLanguageToEnglish from "../functions/convert-language-to-english";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Modal
        isOpen={props.showUserProfile}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Profile</ModalHeader>
              <ModalBody>
                {props.userToView.preferred_name ? (
                  <>
                    <p className="text-lg font-bold">
                      {props.userToView.preferred_name}
                    </p>
                    <p className="-mt-4 text-default-400">
                      {props.userToView.username}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold">
                      {props.userToView.username}
                    </p>
                  </>
                )}
                <p className="text-lg font-bold">About me:</p>
                <p className="-mt-3 text-default-400">
                  {props.userToView.about_me}
                </p>

                <p className="text-lg font-bold">Account info:</p>
                <p className="-mt-3 text-default-400">
                  I{" "}
                  {props.userToView.accepting_friend_requests ? (
                    <>am</>
                  ) : (
                    <>am not</>
                  )}{" "}
                  accepting friend requests
                </p>
                <p className="-mt-3 text-default-400">
                  My language is{" "}
                  {convertLanguageToEnglish(props.userToView.language)}
                </p>
              </ModalBody>
              <ModalFooter className="mt-5">
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    props.setShowUserProfile(false), props.setUserToView([]);
                  }}
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

export default Component;
