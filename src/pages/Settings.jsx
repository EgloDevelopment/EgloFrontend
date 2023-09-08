import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

import checkLoggedIn from "../../functions/check-logged-in";

function App() {
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [aboutMe, setAboutMe] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [darkMode, setDarkMode] = useState(
    Cookies.get("theme") === "dark" ? true : false
  );

  const [error, setError] = useState("");

  async function getSettings() {
    await axios.post("/api/settings/get").then((response) => {
      if (!response.data.error) {
        setAllowFriendRequests(response.data.accepting_friend_requests);
        setAboutMe(response.data.about_me);
        setPreferredName(response.data.preferred_name);
        setRecoveryEmail(response.data.recovery_email);
      } else {
        console.log(response);
      }
    });
  }

  useEffect(() => {
    checkLoggedIn();
    getSettings();
  }, []);

  async function changeFriendRequests(value) {
    setAllowFriendRequests(value);

    await axios.post("/api/settings/change-friend-request").then((response) => {
      if (response.data.error) {
        console.log(response);
      }
    });
  }

  async function changeDarkMode(value) {
    if (value === true) {
      Cookies.set("theme", "dark", {
        expires: 180,
        sameSite: "strict",
      });
    } else {
      Cookies.set("theme", "light", {
        expires: 180,
        sameSite: "strict",
      });
    }

    window.location.href = "/settings";
  }

  async function savePreferredName() {
    if (validator.isAlphanumeric(preferredName) === false) {
      setError("Preferred name can be only letters or numbers");
      return;
    }

    if (preferredName.length > 20) {
      setError("Preferred name can not be over 20 characters");
      return;
    }

    const json = { preferred_name: preferredName };
    await axios
      .post("/api/settings/change-preferred-name", json)
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
          console.log(response);
        }
      });
  }

  async function saveAboutMe() {
    if (aboutMe.length > 200) {
      setError("About me can not be over 200 characters");
      return;
    }

    const json = { about_me: aboutMe };
    await axios.post("/api/settings/change-about-me", json).then((response) => {
      if (response.data.error) {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function saveRecoveryEmail() {
    if (validator.isEmpty(recoveryEmail) !== true) {
      if (validator.isEmail(recoveryEmail) === false) {
        setError("Recovery email is not valid email");
        return;
      }
    }

    const json = { new_email: recoveryEmail };
    await axios
      .post("/api/settings/change-recovery-email", json)
      .then((response) => {
        if (response.data.error) {
          setError(response.data.error);
          console.log(response);
        }
      });
  }

  return (
    <>
      <div className="z-50 w-full fixed top-0 left-0 bg-default-100 h-14">
        <Button
          color="primary"
          className="fixed right-left mt-[0.4rem] ml-3"
          onPress={() => (window.location.href = "/")}
        >
          Back
        </Button>
      </div>

      <div className="mt-32 ml-10">
        <Avatar
          src={
            "https://api.dicebear.com/6.x/initials/svg?seed=" +
            Cookies.get("username") +
            "&backgroundType=gradientLinear"
          }
          size="lg"
          className="cursor-pointer"
        />

        <p className="text-2xl font-bold mt-3">{Cookies.get("username")}</p>
        <p className="text-xs text-default-400">{Cookies.get("id")}</p>
      </div>

      <div className="mt-10 ml-10 form-control w-full max-w-xs">
        <Input
          type="name"
          label="Preferred name"
          variant="bordered"
          value={preferredName}
          onChange={(e) => setPreferredName(e.target.value)}
          className="mt-5"
          endContent={
            <>
              <Button color="primary" onPress={() => savePreferredName()}>
                Save
              </Button>
            </>
          }
          validationState={error.includes("name") && "invalid"}
          errorMessage={error.includes("name") && error}
        />

        <Input
          type="text"
          label="About me"
          variant="bordered"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          className="mt-5"
          endContent={
            <>
              <Button color="primary" onPress={() => saveAboutMe()}>
                Save
              </Button>
            </>
          }
          validationState={error.includes("About") && "invalid"}
          errorMessage={error.includes("About") && error}
        />

        <Input
          type="email"
          label="Recovery email"
          variant="bordered"
          value={recoveryEmail}
          onChange={(e) => setRecoveryEmail(e.target.value)}
          className="mt-5"
          endContent={
            <>
              <Button color="primary" onPress={() => saveRecoveryEmail()}>
                Save
              </Button>
            </>
          }
          validationState={error.includes("email") && "invalid"}
          errorMessage={error.includes("email") && error}
        />

        <div className="mt-10">
          <Switch
            isSelected={allowFriendRequests}
            onChange={() => changeFriendRequests(event.target.checked)}
            size="sm"
            className="mt-5"
          >
            Allow friend requests
          </Switch>
          <br />
          <Switch
            isSelected={darkMode}
            onChange={() => changeDarkMode(event.target.checked)}
            size="sm"
            className="mt-5"
          >
            Dark mode
          </Switch>
        </div>
      </div>
    </>
  );
}

export default App;
