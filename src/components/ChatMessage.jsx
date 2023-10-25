import { showFileDownload, fileToDownload, showUserProfile, userToView } from "../states.jsx";
import { useAtom } from "jotai";

import React, { useState } from "react";

import Cookies from "js-cookie";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";

import { BiDownload } from "react-icons/bi";

function Component(props) {
  const [showFileDownloadModal, setShowFileDownloadModal] =
    useAtom(showFileDownload);
  const [file, setFile] = useAtom(fileToDownload);

  const [showUserProfileModal, setShowUserProfileModal] = useAtom(showUserProfile);
  const [userProfileToView, setUserProfileToView] = useAtom(userToView);

  const [fromMe, setFromMe] = useState(
    props.username === Cookies.get("username") ? true : false
  );

  const DATE_OPTIONS = {
    minute: "numeric",
    hour: "numeric",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: false,
  };

  return (
    <>
      <div
        className={`chat break-all mt-5 ${
          fromMe ? "chat-end mr-3" : "chat-start ml-3"
        }`}
      >
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            {props.showAvatar && (
              <Avatar
                src={
                  "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  props.username +
                  "&backgroundType=gradientLinear"
                }
                size="sm"
                className="mt-1 cursor-pointer"
                onClick={() => {setUserProfileToView(props.username), setShowUserProfileModal(true)}}
              />
            )}
          </div>
        </div>
        <div className="chat-header -ml-1.5">{props.username}</div>
        <div className="chat-bubble bg-content1 -ml-1.5">
          {props.message.startsWith("https://app.eglo.pw/file/") ? (
            <>
              <div className="rounded-lg h-[3rem]">
                <Button
                  className="mt-1"
                  startContent={<BiDownload />}
                  onPress={() => {
                    setFile({
                      name: props.message.split("name=")[1]?.split("&")[0],
                      id: props.message.split(`/`).pop().split("?")[0],
                    }),
                      setShowFileDownloadModal(true);
                  }}
                >
                  {props.message.split("name=")[1]?.split("&")[0]}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white">{props.message}</p>
            </>
          )}
        </div>
        <div className="chat-footer opacity-50 text-xs -ml-1.5">
          {new Date(props.time).toLocaleDateString("en-US", DATE_OPTIONS)}
        </div>
      </div>
    </>
  );
}

export default Component;
