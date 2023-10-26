import { sidebarState, chatData } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import makePostRequest from "../functions/other/make-post-request";
import redirect from "../functions/routing/redirect";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

function Component(props) {
  const [showSidebar, setShowSidebar] = useAtom(sidebarState);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

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
        <div className="fixed top-0 left-0 overflow-y-scroll hide-scrollbars bg-default-50 z-40 w-72 h-full mt-14">
          <div className="ml-16 mt-2.5">
            {friends.map((col) => (
              <>
                <div
                  className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
                  onClick={() =>
                    setCurrentChatData({
                      label: {
                        name: col.username,
                        id: col.friend_id,
                      },
                      connection_data: {
                        type: "friend",
                        id: col.id,
                        channel_id: col.channel_id,
                      },
                    })
                  }
                >
                  <div className="mt-2.5 ml-2">
                    <Avatar
                      className="w-8 h-8"
                      src={
                        "https://api.dicebear.com/6.x/initials/svg?seed=" +
                        col.username +
                        "&backgroundType=gradientLinear"
                      }
                      isBordered
                      color={
                        col.last_online + 5 * 60 * 1000 > Date.now()
                          ? "success"
                          : "danger"
                      }
                    />
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
