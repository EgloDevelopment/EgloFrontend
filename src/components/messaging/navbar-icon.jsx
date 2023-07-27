import { useState } from "react";

import Cookies from "js-cookie";
function Component(props) {
  return (
    <>
      <div className={"fixed dropdown dropdown-end right-0 mr-" + props.margin}>
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-15 rounded-full">
            <div className="">{props.icon}</div>
          </div>
        </label>
      </div>
    </>
  );
}

export default Component;
