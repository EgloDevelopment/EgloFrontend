import { useState } from "react";

function Component(props) {
  return (
    <>
      <li
        className=""
      >
        <div className="text-left text-md mt-2">
          {props.icon}
          <p>{props.text}</p>
        </div>
      </li>
    </>
  );
}

export default Component;
