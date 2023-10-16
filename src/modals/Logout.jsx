import { showLogout } from "../states.jsx";
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

import { BiLogOut } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";
import redirect from "../functions/routing/redirect.js";

import Cookies from "js-cookie";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showLogoutModal, setShowLogoutModal] = useAtom(showLogout);

  const [logoutLoading, setLogoutLoading] = useState(false);

  async function logout() {
    setLogoutLoading(true);

    await makePostRequest("/api/auth/logout").then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        Cookies.remove("theme");
        Cookies.remove("ens_subscriber_id");
        window.sessionStorage.removeItem("private_key");
        redirect("/login");
      }
    });

    setLogoutLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showLogoutModal}
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
                  onPress={() => setShowLogoutModal(false)}
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  startContent={logoutLoading ? null : <BiLogOut />}
                  isLoading={logoutLoading}
                  onPress={() => logout()}
                >
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

export default DisplayModal;
