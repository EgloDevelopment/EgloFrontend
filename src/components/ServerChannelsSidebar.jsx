import { sidebarState, sidebarPage } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";

import axios from "axios";
import Cookies from "js-cookie";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

import { BiHash } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";

function Component(props) {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  useEffect(() => {}, []);

  return (
    <>
      <div className={showSidebar ? "show" : "hidden"}>
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col shadow-lg overflow-y-scroll bg-default-100 z-40 mt-14">
          <div className="fixed top-0 left-0 overflow-y-scroll bg-default-50 z-40 w-72 h-full mt-14">
            <div className="ml-16 mt-2">
              <>
                <div
                  className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-2.5"
                  onClick={() => {
                    console.log("test");
                  }}
                >
                  <div className="ml-3 mt-2 mb-2">
                    <div>
                      <BiHash />
                      <p className="font-bold -mt-[1.25rem] ml-4">test</p>
                    </div>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;
