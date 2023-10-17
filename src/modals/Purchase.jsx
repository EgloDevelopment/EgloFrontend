import { showPurchase } from "../states.jsx";
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
import { Snippet } from "@nextui-org/react";

import { BiCreditCardFront } from "react-icons/bi";
import { BiRefresh } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";
import redirect from "../functions/routing/redirect.js";

import Cookies from "js-cookie";

function DisplayModal(props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showPurchaseModal, setShowPurchaseModal] = useAtom(showPurchase);

  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [amountNeeded, setAmountNeeded] = useState(0);
  const [transactionID, setTransactionID] = useState("");

  async function purchase() {
    setPurchaseLoading(true);

    await makePostRequest("/api/payment/get-wallet").then((response) => {
      setWalletAddress(response.wallet);
      setAmountNeeded(response.btc);
      setTransactionID(response.payment_id);
    });

    setPurchaseLoading(false);
  }

  return (
    <>
      <Modal
        isOpen={showPurchaseModal}
        onOpenChange={onOpenChange}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Purchase
              </ModalHeader>
              <ModalBody>
                {walletAddress !== "" && (
                  <div>
                    <div className="">
                      <p className="text-sm text-default-500">
                        Address to send Bitcoin to:
                      </p>
                      <Snippet symbol="" className="mt-1" variant="bordered">
                        {walletAddress}
                      </Snippet>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-default-500">
                        Amount of Bitcoin to send:
                      </p>
                      <Snippet symbol="" className="mt-1" variant="bordered">
                        {amountNeeded}
                      </Snippet>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm text-default-500">
                        Transaction ID:
                      </p>
                      <Snippet symbol="" className="mt-1" variant="bordered">
                        {transactionID}
                      </Snippet>
                    </div>

                    <div className="mt-10">
                      <p className="text-sm text-default-500">
                        It can take up to 2 hours for the transaction to fully
                        process, when it does your account will be upgraded
                        automatically, for support please{" "}
                        <a
                          className="underline"
                          href={`mailto:payments@eglo.pw?subject=Payment support [${transactionID}]`}
                        >
                          send us a email
                        </a>{" "}
                        with the Transaction ID.
                      </p>
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setShowPurchaseModal(false)}
                >
                  Close
                </Button>

                {walletAddress === "" && (
                  <Button
                    color="primary"
                    startContent={
                      purchaseLoading ? null : <BiCreditCardFront />
                    }
                    isLoading={purchaseLoading}
                    onPress={() => purchase()}
                  >
                    Load wallet data
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DisplayModal;
