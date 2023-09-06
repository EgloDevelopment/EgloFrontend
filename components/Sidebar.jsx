import { useState, useEffect } from "react";
import { Card, CardBody } from "@nextui-org/react";

import axios from "axios";
import Cookies from "js-cookie";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

function Component(props) {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [servers, setServers] = useState([]);

  useEffect(() => {
    getFriends();
    getGroups();
    getServers();
  }, []);

  async function getFriends() {
    await axios.post("/api/friends/get").then((response) => {
      if (!response.data.error) {
        setFriends(response.data);
      } else {
        console.log(response);
      }
    });
  }

  async function getGroups() {
    await axios.post("/api/groups/get").then((response) => {
      if (!response.data.error) {
        setGroups(response.data);
      } else {
        console.log(response);
      }
    });
  }

  async function getServers() {
    await axios.post("/api/servers/get").then((response) => {
      if (!response.data.error) {
        setServers(response.data);
      } else {
        console.log(response);
      }
    });
  }

  return (
    <div className={"fixed top-0 left-0 overflow-y-scroll bg-default-50 z-40 w-72 h-full mt-14 " + props.state}>
      {friends.length > 0 && (
        <>
          <p className="font-bold text-lg ml-2 mt-5">Friends</p>
        </>
      )}

      {friends.map((col) => (
        <>
          <div
            className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
            onClick={() => props.loadMessages(col)}
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

      {groups.length > 0 && (
        <>
          <p className="font-bold text-lg ml-2 mt-5">Groups</p>
        </>
      )}

      {groups.map((col) => (
        <>
          <div
            className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
            onClick={() => props.loadMessages(col)}
          >
            <div className="mt-2 ml-2">
              <Avatar
                className="w-8 h-8"
                src={
                  "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  col.name +
                  "&backgroundType=gradientLinear"
                }
              />
            </div>

            <div className="ml-3  mb-1">
              <p className="font-bold">{col.name}</p>
              <p className="text-default-500 -mt-1">
                {col.users.length} members
              </p>
            </div>
          </div>
        </>
      ))}

      {servers.length > 0 && (
        <>
          <p className="font-bold text-lg ml-2 mt-5">Servers</p>
        </>
      )}

      {servers.map((col) => (
        <>
          <div
            className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
            onClick={() => props.loadMessages(col)}
          >
            <div className="mt-2 ml-2">
              <Avatar
                className="w-8 h-8"
                src={
                  "https://api.dicebear.com/6.x/initials/svg?seed=" +
                  col.name +
                  "&backgroundType=gradientLinear"
                }
              />
            </div>

            <div className="ml-3 mt-3 mb-4">
              <p className="font-bold">{col.name}</p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}

export default Component;
