import { useState } from "react";

import { BiDotsVerticalRounded } from "react-icons/bi";

function Component(props) {
  return (
    <>
      <li className="">
        <div className="text-left text-lg mt-2">
          <div className="mt-1">
            <img
              className="avatar w-8 rounded-full mb-2"
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                props.name +
                "&backgroundType=gradientLinear"
              }
            />
          </div>
          <div>
            
                <p className="font-bold">{props.name}</p>
                <p className="text-zinc-600 text-sm">{props.users.length} members</p>
          </div>
        </div>
      </li>
    </>
  );
}

export default Component;
