import React from "react";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";

function Component(props) {
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
      <div className="mt-12">
        <div>
          {props.showAvatar && (
            <Avatar
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                props.username +
                "&backgroundType=gradientLinear"
              }
              size="sm"
              className="mt-3 ml-3 cursor-pointer"
              onClick={() => props.loadProfile(props.username)}
            />
          )}
          <div>
            <p className="text-default-500 -mt-[3.8rem] ml-14 text-sm">
              {props.username}
            </p>
          </div>
          <div className="ml-14 mt-1 inline-block bg-content2 rounded-lg max-w-full mr-5 break-all">
            <p className="ml-2 py-2 mr-2 px-2">
              {props.message.startsWith("https://app.eglo.pw/server-invite") ? (
                <>
                  <div className=" rounded-lg w-[7rem] h-[3rem]">
                    server
                  </div>
                </>
              ) : (
                <>{props.message}</>
              )}
            </p>
          </div>
          <div>
            <p className="text-default-400 text-xs ml-14">
              {new Date(props.time).toLocaleDateString("en-US", DATE_OPTIONS)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;