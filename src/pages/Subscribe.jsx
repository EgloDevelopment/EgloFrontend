import { showPurchase } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { BiArrowBack } from "react-icons/bi";
import { BiCreditCardFront } from "react-icons/bi";

import checkLoggedIn from "../functions/other/check-logged-in";
import redirect from "../functions/routing/redirect.js";

import Navbar from "../components/Navbar.jsx";
import Purchase from "../modals/Purchase.jsx";

function Page() {
  const [showPurchaseModal, setShowPurchaseModal] = useAtom(showPurchase);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <>
      <Navbar
        topInteraction={
          <Button
            variant="light"
            isIconOnly
            className="fixed left-0 mt-[0.4rem] ml-3"
            onPress={() => redirect("/")}
          >
            <BiArrowBack />
          </Button>
        }
        showOptions={false}
      />

      <Purchase />

      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="form-control w-full max-w-xs mt-8">
          <Card className="py-4 h-[32rem]">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Basic</p>
              <small className="text-default-500">$7 per-month (Does not auto-renew)</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2 mt-5">
              <Accordion>
                <AccordionItem key="1" aria-label="Files" title="Files">
                  <ul>
                    <li className="text-sm text-default-500">
                      • Up to 200MB file size
                    </li>
                    <li className="text-sm text-default-500">
                      • Faster file uploading
                    </li>
                    <li className="text-sm text-default-500">
                      • Priority file servers
                    </li>
                  </ul>
                </AccordionItem>
                <AccordionItem key="2" aria-label="Servers" title="Servers">
                  <ul>
                    <li className="text-sm text-default-500">
                      • Increase server user limit to 10,000 users
                    </li>
                  </ul>
                </AccordionItem>
                <AccordionItem key="3" aria-label="Support" title="Support">
                  <ul>
                    <li className="text-sm text-default-500">
                      • Faster response time
                    </li>
                  </ul>
                </AccordionItem>
                <AccordionItem key="4" aria-label="Profile" title="Profile">
                  <ul>
                    <li className="text-sm text-default-500">
                      • Choose your own profile photo
                    </li>
                    <li className="text-sm text-default-500">
                      • Get a customizable link for your profile
                    </li>
                  </ul>
                </AccordionItem>
              </Accordion>

              <div className="absolute bottom-0 min-w-[17.4rem] mb-2">
                <Button
                  color="primary"
                  className="mt-5"
                  variant="shadow"
                  startContent={<BiCreditCardFront />}
                  fullWidth={true}
                  onPress={() => setShowPurchaseModal(true)}
                >
                  Purchase Eglo+
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Page;
