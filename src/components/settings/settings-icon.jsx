import { useState } from "react";

import Cookies from "js-cookie";
function Component(props) {
  return (
    <>
      <div className="absolute dropdown dropdown-end right-0 mr-2">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <a href="/settings">
              <img
                src={
                  "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  Cookies.get("username") +
                  "&backgroundType=gradientLinear"
                }
              />
            </a>
          </div>
        </label>
      </div>
    </>
  );
}

export default Component;
