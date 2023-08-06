import { useState, useEffect } from "react";

import axios from "axios";
import Cookies from "js-cookie";
import validator from "validator";
import { BiArrowBack } from "react-icons/bi";

import checkLoggedIn from "../../functions/check-logged-in";

import changeEncryptionKey from "../../functions/change-encryption-key";

function App() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [aboutMe, setAboutMe] = useState("");
  const [preferredName, setPreferredName] = useState("");

  const [allowFriendRequests, setAllowFriendRequests] = useState(true);

  const [recoveryEmail, setRecoveryEmail] = useState("");

  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState("");

  useEffect(() => {
    checkLoggedIn();
    getUserSettings();
  }, []);

  async function getUserSettings() {
    await axios.post("/api/settings/get").then((response) => {
      if (!response.data.error) {
        setAllowFriendRequests(response.data.accepting_friend_requests);
        setAboutMe(response.data.about_me);
        setPreferredName(response.data.preferred_name);
        setRecoveryEmail(response.data.recovery_email);
        if (Cookies.get("dark-mode")) {
          setTheme(Cookies.get("dark-mode"));
        } else {
          setTheme(true);
        }
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeFriendRequests() {
    setAllowFriendRequests(!allowFriendRequests);

    await axios.post("/api/settings/change-friend-request").then((response) => {
      if (!response.data.error) {
        setSuccess("Updated friend request setting");
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changePassword() {
    if (
      validator.isEmpty(oldPassword) === true ||
      validator.isEmpty(newPassword1) === true ||
      validator.isEmpty(newPassword2) === true
    ) {
      return;
    }

    if (newPassword1 !== newPassword2) {
      setError("Passwords do not match");
      return;
    }

    if (validator.isStrongPassword(newPassword1) === false) {
      setError("Password does not meet requirements");
      return;
    }

    let new_private_key = await changeEncryptionKey(newPassword1);

    const json = {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
      new_private_key: new_private_key,
    };

    await axios.post("/api/settings/change-password", json).then((response) => {
      if (response.data.success) {
        window.location.href = "/password-enter";
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeRecoveryEmail() {
    const json = {
      new_email: recoveryEmail,
    };

    await axios
      .post("/api/settings/change-recovery-email", json)
      .then((response) => {
        if (response.data.success) {
          setSuccess("Changed recovery email");
        } else {
          setError(response.data.error);
          console.log(response);
        }
      });
  }

  async function deleteAccount() {
    const json = { password: deleteAccountConfirm };

    await axios.post("/api/settings/delete-account", json).then((response) => {
      if (response.data.success) {
        window.location.href = "/login";
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function changeAboutMe() {
    const json = { about_me: aboutMe, preferred_name: preferredName };

    if (aboutMe.length > 200) {
      setError("About Me must be under 200 characters");
      return;
    }

    if (preferredName.length > 20) {
      setError("Preferred name must be under 20 characters");
      return;
    }

    if (validator.isAlphanumeric(preferredName) === false) {
      setError("Preferred name is invalid");
      return;
    }

    await axios.post("/api/settings/change-about-me", json).then((response) => {
      if (!response.data.error) {
        setSuccess("Updated About Me successfully");
      } else {
        setError(response.data.error);
        console.log(response);
      }
    });
  }

  async function logout() {
    await axios.post("/api/auth/logout").then((response) => {
      if (!response.data.error) {
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("id");
        window.sessionStorage.removeItem("private_key");
        window.location.href = "/login";
      } else {
        setError(response.data.error);
      }
    });
  }

  return (
    <>
      <div className="fixed top-0 left-0 z-50 min-w-full navbar bg-base-300 rounded-box">
        <div className="flex justify-start flex-1 px-2">
          <div className="flex items-stretch">
            <div className="dropdown dropdown-start">
              <button
                className="normal-case btn btn-ghost rounded-btn"
                onClick={() => window.history.back()}
              >
                <BiArrowBack className="mt-0" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 ml-5">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img
              src={
                "https://api.dicebear.com/6.x/initials/svg?seed=" +
                Cookies.get("username") +
                "&backgroundType=gradientLinear"
              }
            />
          </div>
        </div>

        <p className="text-4xl bold mt-5">{Cookies.get("username")}</p>
        <p className="text-sm mt-2 text-zinc-500">{Cookies.get("id")}</p>

        <div className="form-control mt-24 max-w-xs">
          <p className="text-lg mb-3">About me</p>
          <hr className="mb-5" />
          <input
            className="input input-bordered input-secondary w-full max-w-xs"
            placeholder="What is your preferred name?"
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
          ></input>

          <input
            className="input input-bordered input-secondary w-full max-w-xs mt-4"
            placeholder="Tell us about yourself"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
          ></input>
          <button
            className="capitalize mt-5 btn btn-outline"
            onClick={() => changeAboutMe()}
          >
            Update
          </button>
        </div>

        <div className="form-control mt-24 max-w-[13rem]">
          <p className="text-lg mb-3">Security settings</p>
          <hr className="mb-5" />
          <label className="label cursor-pointer">
            <span className="label-text">Allow friend requests</span>
            <input
              type="checkbox"
              className="toggle"
              onChange={() => changeFriendRequests()}
              checked={allowFriendRequests}
            />
          </label>
        </div>

        <div className="form-control mt-24 max-w-[10rem]">
          <p className="text-lg mb-3">Visuals</p>
          <hr className="mb-5" />
          <div className="dropdown dropdown-start">
            <label tabIndex={0} className="normal-case btn rounded-btn">
              Themes
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-64 mt-4 border border-secondary"
            >
              <li className="cursor-pointer m-1">
                <button
                  onClick={() => {
                    Cookies.set("theme", "black"),
                      (window.location.href = "/settings");
                  }}
                >
                  Dark
                </button>
              </li>
              <li className="cursor-pointer m-1">
                <button
                  onClick={() => {
                    Cookies.set("theme", "lofi"),
                      (window.location.href = "/settings");
                  }}
                >
                  Light
                </button>
              </li>

              <li className="cursor-pointer m-1">
                <button
                  onClick={() => {
                    Cookies.set("theme", "business"),
                      (window.location.href = "/settings");
                  }}
                >
                  Business
                </button>
              </li>

              <li className="cursor-pointer m-1">
                <button
                  onClick={() => {
                    Cookies.set("theme", "wireframe"),
                      (window.location.href = "/settings");
                  }}
                >
                  Wireframe
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="form-control w-full max-w-xs mt-24 mb-24">
          <p className="text-lg mb-3">Recovery email</p>
          <hr className="mb-5" />
          <input
            type="email"
            placeholder="No recovery email"
            className="input input-bordered input-secondary w-full max-w-xs "
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <button
            className="capitalize mt-5 btn btn-outline"
            onClick={() => changeRecoveryEmail()}
          >
            Change recovery email
          </button>
        </div>

        <div className="form-control w-full max-w-xs mt-24 mb-24">
          <p className="text-lg mb-3">Change password</p>
          <hr className="mb-5" />
          <input
            type="password"
            placeholder="Current password"
            className="input input-bordered input-secondary w-full max-w-xs "
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            className="input input-bordered input-secondary w-full max-w-xs mt-4"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password again"
            className="input input-bordered input-secondary w-full max-w-xs mt-4"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
          <label className="label">
            <span className="label-text-alt">
              8+ Characters, Symbols & Numbers with Capitals
            </span>
          </label>
          <button
            className="capitalize mt-5 btn btn-outline"
            onClick={() => changePassword()}
          >
            Change password
          </button>
        </div>
      </div>

      <dialog
        id="delete_account_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form method="dialog" className="modal-box border border-secondary">
          <h3 className="font-bold text-lg text-white">Are you sure?</h3>
          <div className="form-control w-full max-w-xs mt-5">
            <label className="label">
              <span className="label-text">Enter your password to confirm</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered input-secondary w-full max-w-full text-white"
              value={deleteAccountConfirm}
              onChange={(e) => setDeleteAccountConfirm(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-error btn-outline capitalize"
              onClick={() => deleteAccount()}
            >
              Delete
            </button>
            <button className="btn capitalize">Cancel</button>
          </div>
        </form>
      </dialog>

      <div className="w-full p-10">
        <button
          className="capitalize w-full btn btn-outline mt-56"
          onClick={() => logout()}
        >
          LOGOUT
        </button>
        <button
          className="capitalize w-full btn btn-error btn-outline mt-10"
          onClick={() => window.delete_account_modal.showModal()}
        >
          DELETE ACCOUNT
        </button>
      </div>

      <div className="toast toast-bottom toast-end z-50">
        {success && (
          <div
            className="alert alert-success cursor-pointer border-0"
            onClick={() => {
              setSuccess(null);
            }}
          >
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div
            className="alert alert-error cursor-pointer border-0"
            onClick={() => {
              setError(null);
            }}
          >
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
