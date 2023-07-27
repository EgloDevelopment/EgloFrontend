import { useState, useEffect } from "react";

import Cookies from "js-cookie" 
import axios from "axios";

function Component(props) {
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    showUserData()
    console.log(props)
 }, []);

  async function showUserData() {
    const json = { id: props.userData.id };

    await axios.post("/api/user/get-user-from-id", json).then((response) => {
      if (!response.data.error) {
        setUserData(response.data);
        setUserDataLoading(false);
      } else {
                   
      }
    });
  }

  return (
    <>
      <dialog
        id="user_data_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <form
          method="dialog"
          className="modal-box border border-secondary h-[15rem]"
        >
          {!userDataLoading ? (
            <>
              <div
                className="tooltip tooltip-right -mt-5"
                data-tip={userData.id}
              >
                {userData.preferred_name ? (
                  <>
                    <h3 className="font-bold text-lg text-white">
                      {userData.preferred_name}
                    </h3>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-white">
                      {userData.username}
                    </h3>
                  </>
                )}
              </div>
              {userData.preferred_name && (
                <>
                  <p className="text-md mt-1 text-zinc-500 text-white break-all max-w-full mb-4">
                    {userData.username}
                  </p>
                </>
              )}
              <p className="text-sm mt-1 text-zinc-500 text-white break-all max-w-full">
                {userData.about_me}
              </p>
              {userData.username !== Cookies.get("username") ? (
                <>
                  <div className="fixed bottom-0 right-0 m-10 modal-action">
                    <button
                      className="btn capitalize"
                      onClick={() => props.addFriend(userData.username)}
                    >
                      Add as friend
                    </button>
                    <button className="btn btn-primary capitalize">
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="fixed bottom-0 right-0 m-10 modal-action">
                    <button className="btn btn-primary capitalize">
                      Close
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mt-16">
                <span className="loading loading-spinner text-secondary" />
              </div>
              <div className="fixed bottom-0 right-0 m-10 modal-action">
                <button className="btn btn-primary capitalize">Close</button>
              </div>
            </>
          )}
        </form>
      </dialog>
    </>
  );
}

export default Component;
