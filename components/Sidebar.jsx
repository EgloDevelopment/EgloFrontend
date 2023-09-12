import { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@nextui-org/react";

import axios from "axios";
import Cookies from "js-cookie";

import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";
import { Tooltip } from "@nextui-org/react";

import { BiHash } from "react-icons/bi";
import { BiHomeAlt2 } from "react-icons/bi";
import { BiSolidUser } from "react-icons/bi";
import { BiSolidServer } from "react-icons/bi";
import { BiSolidGroup } from "react-icons/bi";

import getPrivateKey from "../functions/get-private-key-from-keychain";

function Component(props) {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [servers, setServers] = useState([]);

  const [channels, setChannels] = useState([]);

  const [viewing, setViewing] = useState("general");

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

  async function getChannels(id) {
    const json = { server_id: id };

    await axios.post("/api/servers/get-channels", json).then((response) => {
      if (!response.data.error) {
        setChannels(response.data);
      } else {
        console.log(response);
      }
    });
  }

  return (
    <>
      <div className={props.state}>
        <div className="fixed top-0 left-0 h-screen w-16 flex flex-col shadow-lg overflow-y-scroll bg-default-100 z-50 mt-14">
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Direct Messages" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => {
                    props.clear(), setViewing("general"), setChannels([]);
                  }}
                  fallback={<BiHomeAlt2 className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <hr className="mt-3 w-[3rem] ml-[0.5rem] border-default-400" />
          {servers.map((col) => (
            <>
              <div className="rounded-lg cursor-pointer mt-3">
                <div className="ml-[0.7rem]">
                  <Tooltip content={col.name} placement="right">
                    <Avatar
                      className="w-10 h-10"
                      onClick={() => {
                        props.clear(),
                          getChannels(col.id),
                          setViewing("channels"),
                          getPrivateKey(col.id).then((key) => {
                            window.sessionStorage.setItem("current_key", key)
                          })
                          props.setParentID(col.id),
                          props.setParentName(col.name),
                          props.setServerOwner(col.server_owner),
                          props.setChatType("server");
                      }}
                      src={
                        "https://api.dicebear.com/6.x/initials/svg?seed=" +
                        col.name +
                        "&backgroundType=gradientLinear"
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            </>
          ))}

          <div className="mt-15"></div>

          {servers.length !== 0 && (
            <hr className="mt-3 w-[3rem] ml-[0.5rem] border-default-400" />
          )}

          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Add friend" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => props.setShowAddFriend(true)}
                  fallback={<BiSolidUser className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Create server" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => props.setShowNewServer(true)}
                  fallback={<BiSolidServer className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
          <div className="rounded-lg cursor-pointer">
            <div className="ml-[0.7rem] mt-3">
              <Tooltip content="Create group chat" placement="right">
                <Avatar
                  className=""
                  showFallback
                  onClick={() => props.setShowNewGroupChat(true)}
                  fallback={<BiSolidGroup className="w-6 h-6" />}
                />
              </Tooltip>
            </div>
          </div>
        </div>

        {viewing === "general" && (
          <>
            <div className="fixed top-0 left-0 overflow-y-scroll bg-default-50 z-40 w-72 h-full mt-14">
              <div className="ml-16">
                {friends.length > 0 && (
                  <>
                    <p className="font-bold text-lg ml-2 mt-5">
                      Direct Messages
                    </p>
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
                            <p className="text-default-500 -mt-1">
                              {col.username}
                            </p>
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
              </div>
            </div>
          </>
        )}

        <div className="mt-15"></div>

        {viewing === "channels" && (
          <>
            <div className="fixed top-0 left-0 overflow-y-scroll bg-default-50 z-40 w-72 h-full mt-14">
              <div className="ml-16 mt-2">
                <p className="font-bold text-lg ml-2 mt-5">Channels</p>
                {channels.map((col) => (
                  <>
                    <div
                      className="flex text-left transition hover:bg-content2 focus:bg-content2 ml-2 mr-2 rounded-lg cursor-pointer text-md mt-1"
                    onClick={() => {props.socketDisconnect(), props.loadMessages(col)}}
                    >
                      <div className="ml-3 mt-2 mb-2">
                        <div>
                          <BiHash />
                          <p className="font-bold -mt-[1.25rem] ml-4">
                            {col.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Component;
