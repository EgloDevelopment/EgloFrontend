import { showFileDownload, fileToDownload } from "../states.jsx";
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

import { BiDownload } from "react-icons/bi";

import downloadFile from "../functions/other/download-file.js";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [downloadLoading, setDownloadLoading] = useState(false);

  const [showFileDownloadModal, setShowFileDownloadModal] =
    useAtom(showFileDownload);
  const [file, setFile] = useAtom(fileToDownload);

  async function getFile() {
    setDownloadLoading(true);

    await downloadFile("/fs/download", file.id, file.name);

    setShowFileDownloadModal(false)
    setDownloadLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showFileDownloadModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {file.name}
              </ModalHeader>
              <ModalBody>
                Are you sure you want to download this file?
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => setShowFileDownloadModal(false)}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  startContent={downloadLoading ? null : <BiDownload />}
                  isLoading={downloadLoading}
                  onPress={() => getFile()}
                >
                  Download
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
