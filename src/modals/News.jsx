import { showNews } from "../states.jsx";
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

  const [showNewsModal, setShowNewsModal] = useAtom(showNews);

  const [news, setNews] = useState([]);

  useEffect(() => {
    getNews();
  }, []);

  async function getNews() {
    await makePostRequest("/api/eglo/get-news").then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setNews(response);
      }
    });
  }

  return (
    <>
      <Modal
        isOpen={showNewsModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {news.title}
              </ModalHeader>
              <ModalBody>
                <p>{news.content}</p>
              </ModalBody>
              <ModalFooter>
                <p className="text-xs absolute left-0 mt-3 ml-6 text-content4">
                  {news.updated}
                </p>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => setShowNewsModal(false)}
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
