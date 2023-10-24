import { showUserProfile, userToView } from "../states.jsx";
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
import { Textarea } from "@nextui-org/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Input } from "@nextui-org/react";

import makePostRequest from "../functions/other/make-post-request.js";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showUserProfileModal, setShowUserProfileModal] =
    useAtom(showUserProfile);
  const [userProfileToView, setUserProfileToView] = useAtom(userToView);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getProfile();
  }, [userProfileToView]);

  async function getProfile() {
    if (userProfileToView.active === false) {
      return;
    }

    await makePostRequest("/api/user-data/get-profile-from-username", {
      username: userProfileToView,
    }).then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setUserData(response);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={showUserProfileModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex">
                  <Avatar
                    src={
                      "https://api.dicebear.com/6.x/initials/svg?seed=" +
                      userData.username +
                      "&backgroundType=gradientLinear"
                    }
                    size="sm"
                  />
                  {userData.last_online + 5 * 60 * 1000 > Date.now() ? (
                    <>
                      <span className="relative flex h-3 w-3 z-30 mt-5 -ml-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-1"></span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="relative flex h-3 w-3 z-30 mt-5 -ml-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-1"></span>
                      </span>
                    </>
                  )}
                  <div className="ml-3">
                    {userData.preferred_name !== "" ? (
                      <>
                        <div className="-mt-2">
                          <p className="text-xl font-bold">
                            {userData.preferred_name}
                          </p>
                          <p className="text-default-400 text-sm -mt-1">
                            {userData.username}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <p className="text-xl font-bold">
                            {userData.username}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="mt-7">
                <Input
                  type="eglonumber"
                  label="Eglo Number"
                  labelPlacement="outside"
                  variant="bordered"
                  value={userData.eglo_number}
                  className="max-w-xs"
                  disabled
                />

                {userData.about_me !== "" && (
                  <div className="form-control w-full max-w-xs">
                    <Textarea
                      label="About Me:"
                      variant="bordered"
                      labelPlacement="outside"
                      value={userData.about_me}
                      disabled
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <p className="text-xs absolute left-0 mt-3 ml-6 text-content4"></p>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    setShowUserProfileModal(false),
                      setUserProfileToView({ active: false });
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

export default DisplayModal;
