import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";

import { Button, ButtonGroup } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Code } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Switch } from "@nextui-org/react";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/react";

import UserProfile from "../../../components/User-Profile";

import checkLoggedIn from "../../../functions/check-logged-in";
import getPrivateKey from "../../../functions/get-private-key-from-keychain";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  let group_id = searchParams.get("id");

  const [error, setError] = useState("");

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [userToView, setUserToView] = useState([]);

  const [deleteGroupName, setDeleteGroupName] = useState("");

  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [groupID, setGroupID] = useState("");

  async function getGroupSettings() {
    const json = { group_id: group_id };

    window.sessionStorage.setItem("current_key", await getPrivateKey(group_id));

    await axios.post("/api/groups/get-settings", json).then((response) => {
      if (!response.data.error) {
        setGroupName(response.data.name);
        setUsers(response.data.users);
        setGroupID(response.data.id);
      } else {
        console.log(response);
      }
    });
  }

  async function changeGroupName() {
    if (validator.isEmpty(groupName) === true) {
      setError("Name can not be empty");
      return;
    }

    if (groupName.length > 25) {
      setError("Name can not be over 25 characters");
      return;
    }

    const json = { group_id: groupID, name: groupName };

    await axios.post("/api/groups/change-name", json).then((response) => {
      if (!response.data.error) {
        setError("");
      } else {
        console.log(response);
      }
    });
  }

  async function loadProfile(username) {
    setShowUserProfile(true);

    const json = { username: username };

    await axios
      .post("/api/user/get-user-from-username", json)
      .then((response) => {
        setUserToView(response.data);
      });
  }

  async function deleteGroup() {
    if (deleteGroupName !== groupName) {
      setError("Group names do not match");
      return;
    }

    const json = { group_id: groupID };

    await axios.post("/api/groups/delete-group", json).then((response) => {
      if (!response.data.error) {
        window.location.href = "/";
      } else {
        console.log(response);
      }
    });
  }

  useEffect(() => {
    if (group_id) {
      checkLoggedIn();
      getGroupSettings();
    }
  }, [group_id]);

  return (
    <>
      <UserProfile
        showUserProfile={showUserProfile}
        setShowUserProfile={setShowUserProfile}
        setUserToView={setUserToView}
        userToView={userToView}
      />

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
            groupName +
            "&backgroundType=gradientLinear"
          }
          size="lg"
          className="cursor-pointer"
        />

        <p className="text-2xl font-bold mt-3">{groupName}</p>
        <p className="text-xs text-default-400">{groupID}</p>
      </div>

      <div className="mt-10 ml-10 form-control w-full max-w-xs">
        <Input
          type="name"
          label="Group name"
          variant="bordered"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mt-5"
          endContent={
            <>
              <Button color="primary" onPress={() => changeGroupName()}>
                Save
              </Button>
            </>
          }
          validationState={error.includes("Name") && "invalid"}
          errorMessage={error.includes("Name") && error}
        />

        <div className="mt-20">
          <p className="font-bold text-lg">Users:</p>
          <p className="text-xs text-default-400">{users.length}/50</p>
          <div className="ml-3 mt-7">
            {users.map((col) => (
              <>
                <div className="mt-5">
                  <button
                    className="capitalize w-full btn "
                    onClick={() => loadProfile(col.username)}
                  >
                    {col.username}
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>

        <Input
          type="name"
          label="Group name"
          variant="bordered"
          onChange={(e) => setDeleteGroupName(e.target.value)}
          className="mt-20"
          endContent={
            <>
              <Button color="danger" onPress={() => deleteGroup()}>
                Delete
              </Button>
            </>
          }
          validationState={error.includes("Group") && "invalid"}
          errorMessage={error.includes("Group") && error}
        />
      </div>
    </>
  );
}

export default App;
