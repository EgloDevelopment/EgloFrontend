import { showFileUpload, fileToUpload, chatData } from "../states.jsx";
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

import { BiUpload } from "react-icons/bi";

import Cookies from "js-cookie";

import makePostRequest from "../functions/other/make-post-request";
import uploadFile from "../functions/other/upload-file";
import encrypt from "../functions/encryption/encrypt";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showFileUploadModal, setShowFileUploadModal] = useAtom(showFileUpload);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [uploadLoading, setUploadLoading] = useState(false);

  const [error, setError] = useState([]);

  const [file, setFile] = useAtom(fileToUpload);

  async function upload() {
    setUploadLoading(true);

    let encrypted_file_data = await uploadFile("/fs/upload", file);

    if (encrypted_file_data.error === true) {
      setUploadLoading(false);
      return;
    }

    let encrypted_message = await encrypt(
      `https://app.eglo.pw/file/${encrypted_file_data.id}?name=${encrypted_file_data.original_name}&embed=true`
    );

    await makePostRequest("/api/messages/send-message", {
      channel_id: currentChatData.connection_data.channel_id,
      content: encrypted_message,
    }).then((response) => {
      if (response.error === true) {
        console.log(response);
      }
    });

    let ws = new WebSocket(`wss://rts.eglo.pw`);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          $websocket_data: {
            action: "publish",
            id: currentChatData.connection_data.channel_id,
          },
          sender_name: Cookies.get("username"),
          time: Date.now(),
          content: encrypted_message,
        })
      );
    };

    setShowFileUploadModal(false);
    setUploadLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showFileUploadModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload file
              </ModalHeader>
              <ModalBody>
                {/*
                <div className="flex items-center justify-center w-full">
                  <label for="dropzone-file">
                    <div className="flex flex-col items-center justify-center h-[12rem] w-[22rem] border border-default-400 rounded-xl text-center">
                      <div className="mb-2 text-sm">
                        <div className="flex flex-col items-center justify-center">
                          <BiUpload className="w-8 h-8 text-default-500" />
                        </div>
                        <p className="font-semibold text-default-500">
                          Click to upload
                        </p>
                        <p className="text-xs text-default-400">Max of 20MB</p>
                      </div>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={(e) => console.log(e.target.files[0])} />
                  </label>
                </div>
          */}

                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </ModalBody>
              <ModalFooter className="mt-7">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setShowFileUploadModal(false), setError([]);
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={uploadLoading ? null : <BiUpload />}
                  isLoading={uploadLoading}
                  onPress={() => upload()}
                >
                  Upload
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
