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

import { Input } from "@nextui-org/react";

import { BiPlus } from "react-icons/bi";

import axios from "axios";
import validator from "validator";
import Cookies from "js-cookie";

import generateString from "../functions/generate-string";
import addToKeychain from "../functions/add-to-keychain";

function Component(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [newServerLoading, setNewServerLoading] = useState(false);

  const [error, setError] = useState("");

  const [name, setName] = useState("");

  async function createServer() {
    setNewServerLoading(true);

    if (validator.isEmpty(name) === true) {
      setError("Name can not be empty");
      setNewServerLoading(false);
      return;
    }

    let key = generateString(50);

    const json = { name: name };
    await axios.post("/api/servers/create-server", json).then((response) => {
      if (response.data.success) {
        setName("");
        addToKeychain(Cookies.get("username"), key, response.data.id);
        setNewServerLoading(false);
        props.setShowNewServer(false);
        setName("");
      } else {
        setError(response.data.error);
        setNewServerLoading(false);
        console.log(response);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={props.showNewServer}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                New server
              </ModalHeader>
              <ModalBody>
                <Input
                  type="name"
                  label="Server name"
                  variant="bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-5 max-w-[20rem]"
                  validationState={error !== "" && "invalid"}
                  errorMessage={error !== "" && error}
                />
              </ModalBody>
              <ModalFooter className="mt-7">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    props.setShowNewServer(false), setName(""), setError("");
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={newServerLoading ? null : <BiPlus />}
                  isLoading={newServerLoading}
                  onPress={() => createServer()}
                >
                  Create server
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
