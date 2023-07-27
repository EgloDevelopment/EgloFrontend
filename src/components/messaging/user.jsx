import { useState } from "react";

import { BiDotsVerticalRounded } from "react-icons/bi";

function Component(props) {
  return (
    <>
      <li className="">
        <div className="text-left text-lg mt-2">
          <div className="mt-6">
            {props.loggedIn ? (
              <>
                <span class="relative flex h-3 w-3 -mb-8 ml-6 z-30">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-1"></span>
                </span>
              </>
            ) : (
              <>
                <span class="relative flex h-3 w-3 -mb-8 ml-6 z-30">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-1"></span>
                </span>
              </>
            )}
            <img
              className="avatar w-8 rounded-full"
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                props.username +
                "&backgroundType=gradientLinear"
              }
            />
          </div>
          <div>
            {props.preferredName ? (
              <>
                <p>{props.preferredName}</p>
                <p className="text-zinc-600 text-sm">{props.username}</p>
              </>
            ) : (
              <>{props.username}</>
            )}
          </div>
        </div>
      </li>
    </>
  );
}

export default Component;