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

import Cookies from "js-cookie";
import axios from "axios";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function logout() {
    await axios.post("/api/auth/logout").then((response) => {
      if (!response.data.error) {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        Cookies.remove("theme");
        Cookies.remove("ens_subscriber_id");
        window.sessionStorage.removeItem("private_key");
        window.location.href = "/login";
      } else {
        console.log(response.data.error);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={props.showLogout}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirm</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to logout?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => props.setShowLogout(false)}
                >
                  Close
                </Button>
                <Button color="danger" onPress={() => logout()}>
                  Logout
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
