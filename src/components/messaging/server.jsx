import { useState } from "react";

function Component(props) {
  return (
    <>
      <li className="">
        <div className="text-left text-lg mt-2">
          <img
            className="avatar w-8 rounded-full mt-2 mb-2"
            src={
              "https://api.dicebear.com/6.x/initials/svg?seed=" +
              props.name +
              "&backgroundType=gradientLinear"
            }
          />

          <div>{props.name}</div>
        </div>
      </li>
    </>
  );
}

export default Component;
