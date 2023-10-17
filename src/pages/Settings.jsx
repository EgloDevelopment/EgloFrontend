import { sidebarPage, chatData } from "../states.jsx";
import { useAtom } from "jotai";

import { useState, useEffect } from "react";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";

import { BiArrowBack } from "react-icons/bi";
import { BiSave } from "react-icons/bi";
import { BiKey } from "react-icons/bi";

import checkLoggedIn from "../functions/other/check-logged-in";
import makePostRequest from "../functions/other/make-post-request";
import changeEncryptionKey from "../functions/encryption/change-encryption-key";

import Navbar from "../components/Navbar.jsx";

import redirect from "../functions/routing/redirect.js";

function Page() {
  const [currentSidebarPage, setCurrentSidebarPage] = useAtom(sidebarPage);

  const [currentChatData, setCurrentChatData] = useAtom(chatData);

  const [updateLoading, setUpdateLoading] = useState(false);
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  const [error, setError] = useState([]);

  const [ID, setID] = useState("");
  const [username, setUsername] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [acceptingFriendRequests, setAcceptingFriendRequests] = useState(true);
  const [egloNumber, setEgloNumber] = useState("");
  const [subscription, setSubscription] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  useEffect(() => {
    checkLoggedIn();
    getSettings();
  }, []);

  async function getSettings() {
    await makePostRequest("/api/settings/get-settings").then((response) => {
      if (response.error === true) {
        console.log(response);
      } else {
        setID(response.id);
        setUsername(response.username);
        setPreferredName(response.preferred_name);
        setAboutMe(response.about_me);
        setRecoveryEmail(response.recovery_email);
        setAcceptingFriendRequests(response.accepting_friend_requests);
        setEgloNumber(response.eglo_number);
        setSubscription(response.subscription);
      }
    });
  }

  async function updateSettings() {
    setUpdateLoading(true);

    await makePostRequest("/api/settings/update", {
      preferred_name: preferredName,
      about_me: aboutMe,
      recovery_email: recoveryEmail,
      accepting_friend_requests: acceptingFriendRequests,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        setError([]);
      }
    });

    setUpdateLoading(false);
  }

  async function changePassword() {
    setChangePasswordLoading(true);

    let new_private_key = await changeEncryptionKey(newPassword1);

    await makePostRequest("/api/settings/change-password", {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
      new_private_key: new_private_key,
    }).then((response) => {
      if (response.error === true) {
        setError({
          field: response.fields[0].toLowerCase(),
          message: response.data,
        });
      } else {
        redirect("/login");
      }
    });

    setChangePasswordLoading(false);
  }

  return (
    <>
      <Navbar
        topInteraction={
          <Button
            variant="light"
            isIconOnly
            className="fixed left-0 mt-[0.4rem] ml-3"
            onPress={() => redirect("/")}
          >
            <BiArrowBack />
          </Button>
        }
        showOptions={false}
      />

      <div className="mt-32 ml-5">
        <div className="form-control w-full max-w-xs">
          <Input
            type="username"
            label="Username"
            variant="bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "username" && true}
            errorMessage={error.field === "username" && error.message}
            disabled
          />

          <Input
            type="phone"
            label="Eglo Number"
            variant="bordered"
            value={egloNumber}
            onChange={(e) => setEgloNumber(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "eglo_number" && true}
            errorMessage={error.field === "eglo_number" && error.message}
            disabled
          />

          <Input
            type="name"
            label="Preferred name"
            variant="bordered"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "preferred_name" && true}
            errorMessage={error.field === "preferred_name" && error.message}
          />

          <Textarea
            label="About Me"
            variant="bordered"
            placeholder="Tell us about yourself"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "about_me" && true}
            errorMessage={error.field === "about_me" && error.message}
          />

          <Input
            type="email"
            label="Recovery email"
            variant="bordered"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            className="mt-4"
            isInvalid={error.field === "recovery_email" && true}
            errorMessage={error.field === "recovery_email" && error.message}
          />

          <Switch
            isSelected={acceptingFriendRequests}
            onValueChange={setAcceptingFriendRequests}
            className="mt-5"
            size="sm"
          >
            Allow friend requests
          </Switch>

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={updateLoading ? null : <BiSave />}
            isLoading={updateLoading}
            fullWidth={true}
            onPress={() => updateSettings()}
          >
            Save settings
          </Button>
        </div>
      </div>

      <div className="mt-24 ml-5">
        <div className="form-control w-full max-w-xs">
          <Input
            type="password"
            label="Current password"
            variant="bordered"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "old_password" && true}
            errorMessage={error.field === "old_password" && error.message}
          />

          <Input
            type="password"
            label="New password"
            variant="bordered"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "new_password1" && true}
            errorMessage={error.field === "new_password1" && error.message}
          />

          <Input
            type="password"
            label="New password again"
            variant="bordered"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
            className="mt-5"
            isInvalid={error.field === "new_password2" && true}
            errorMessage={error.field === "new_password2" && error.message}
          />

          <p className="text-xs mt-2 text-default-500">
            8+ Characters with Symbols, Numbers, and Capitals.
          </p>

          <Button
            color="primary"
            className="mt-5"
            variant="shadow"
            startContent={changePasswordLoading ? null : <BiKey />}
            isLoading={changePasswordLoading}
            fullWidth={true}
            onPress={() => changePassword()}
          >
            Change password
          </Button>
        </div>
      </div>

      <div className="mt-32"></div>
    </>
  );
}

export default Page;
