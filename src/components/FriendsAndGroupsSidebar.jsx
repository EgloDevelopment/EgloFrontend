import { sidebarState, chatData } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import makePostRequest from "../functions/other/make-post-request";
import redirect from "../functions/routing/redirect";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

function Component(props) {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const [currentChatData, setCurrentChatData] = useAtom(chatData)

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getFriends();
  }, []);

  async function getFriends() {
    await makePostRequest("/api/friends/get-friends-list").then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setFriends(response);
      }
    });
  }

  return (
    <>
      <div className={showSidebar ? "show" : "hidden"}>
        <div className="fixed top-0 left-0 overflow-y-scroll bg-default-50 z-40 w-72 h-full mt-14">
          <div className="ml-16 mt-2.5">
            {friends.map((col) => (
              <>
                <div
                  className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
                  onClick={() => setCurrentChatData(col)}
                >
                  <div className="mt-2 ml-2">
                    <Avatar
                      className="w-8 h-8"
                      src={
                        "https://api.dicebear.com/6.x/initials/svg?seed=" +
                        col.username +
                        "&backgroundType=gradientLinear"
                      }
                    />

                    {col.logged_in === true ? (
                      <>
                        <span className="relative flex h-3 w-3 -mb-8 ml-6 z-30 -mt-3 ml-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-1"></span>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-3 w-3 -mb-8 ml-6 z-30 -mt-3 ml-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-1"></span>
                        </span>
                      </>
                    )}
                  </div>
                  {col.preferred_name ? (
                    <>
                      <div className="ml-3  mb-1">
                        <p className="font-bold">{col.preferred_name}</p>
                        <p className="text-default-500 -mt-1">{col.username}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="ml-3 mt-3 mb-4">
                        <p className="font-bold">{col.username}</p>
                      </div>
                    </>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Component;
