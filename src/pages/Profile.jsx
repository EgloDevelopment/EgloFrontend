import { sidebarPage, chatData } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";

import Cookies from "js-cookie";

import { BiHomeAlt2 } from "react-icons/bi";
import { BiLockOpenAlt } from "react-icons/bi";

import makePostRequest from "../functions/other/make-post-request";
import redirect from "../functions/routing/redirect";

import Navbar from "../components/Navbar.jsx";

function Page() {
  const [profileShorthand, setProfileShorthand] = useState(
    window.location.href.split("/profile/")[1].replace(/\/$/, "")
  );

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    await makePostRequest("/api/user-data/get-profile-from-shorthand", {
      shorthand: profileShorthand,
    }).then((response) => {
      setUserData(response);
    });
  }

  return (
    <>
      {Cookies.get("token") ? (
        <Navbar
          topInteraction={
            <Button
              isIconOnly
              variant="light"
              className="fixed left-0 mt-[0.4rem] ml-3"
              onPress={() => redirect("/")}
            >
              <BiHomeAlt2 />
            </Button>
          }
          showOptions={false}
        />
      ) : (
        <Navbar
          topInteraction={
            <Button
              variant="light"
              className="fixed left-0 mt-[0.4rem] ml-3"
              onPress={() => redirect("/login")}
            >
              <BiLockOpenAlt /> Login
            </Button>
          }
          showOptions={false}
        />
      )}

      <div className="flex flex-col mt-32 justify-center items-center">
        <div className="text-center">
          {userData.preferred_name !== "" ? (
            <>
              <p className="font-bold text-4xl">{userData.preferred_name}</p>
              <p className="font-bold text-default-400 text-2xl">
                {userData.username}
              </p>
            </>
          ) : (
            <p className="font-bold text-2xl">{userData.username}</p>
          )}

          <small className="font-bold text-default-400">
            {userData.eglo_number}
          </small>
        </div>

        <div className="mt-5">
          {userData.last_online + 5 * 60 * 1000 > Date.now() ? (
            <p className="text-success">Online</p>
          ) : (
            <p className="text-danger">Offline</p>
          )}
        </div>

        {userData.about_me !== "" && (
          <div className="form-control w-full max-w-xs mt-7">
            <Textarea
              label="About Me"
              variant="bordered"
              labelPlacement="outside"
              value={userData.about_me}
              className="mt-5"
              readOnly
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
