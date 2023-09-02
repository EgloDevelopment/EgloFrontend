import { useState } from "react";

import axios from "axios";
import Cookies from "js-cookie";

import { BiBell } from "react-icons/bi";

function Component(props) {
  const [notifications, setNotifications] = useState([]);

  async function getNotifications() {
    const json = { subscriber_id: Cookies.get("ens_subscriber_id") };

    await axios.post("/ens/get-notifications", json).then((response) => {
      if (!response.data.error) {
        setNotifications(response.data);
      } else {
        console.log(response);
      }
    });
  }

  async function readNotification(notification_id) {
    const json = {
      subscriber_id: Cookies.get("ens_subscriber_id"),
      notification_id: notification_id,
    };

    await axios.post("/ens/read-notification", json).then((response) => {
      if (!response.data.error) {
        getNotifications();
      } else {
        console.log(response);
      }
    });
  }

  async function deleteNotification(notification_id) {
    const json = {
      subscriber_id: Cookies.get("ens_subscriber_id"),
      notification_id: notification_id,
    };

    await axios.post("/ens/delete-notification", json).then((response) => {
      if (!response.data.error) {
        getNotifications();
      } else {
        console.log(response);
      }
    });
  }

  return (
    <>
      <div className="dropdown z-50">
        <label
          tabIndex={0}
          className="btn btn-circle avatar z-50"
          onClick={() => getNotifications()}
        >
          <BiBell className="w-4 h-4" />
        </label>
        {notifications.length === 0 ? (
          <>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box mt-4 border border-secondary"
            >
              <li onClick={() => getNotifications()}>
                <div className="text-md font-bold hover:bg-base-100">
                  <p>No notifications</p>
                </div>
              </li>
            </ul>
          </>
        ) : (
          <>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] p-2 shadow bg-base-100 w-[20rem] max-h-lg overflow-y-auto rounded-box mt-4 border border-secondary"
            >
              {notifications.map((notification) => (
                <>
                  <li>
                    {notification.read === false ? (
                      <>
                        <div
                          className="flex flex-col items-start"
                          onClick={() => readNotification(notification.id)}
                        >
                          <p className="text-md font-bold">
                            {notification.title}
                          </p>

                          <p className="font-normal break-words">
                            {notification.text}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="flex flex-col items-start opacity-25"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <p className="text-md font-bold">
                            {notification.title}
                          </p>

                          <p className="font-normal break-words">
                            {notification.text}
                          </p>
                        </div>
                      </>
                    )}
                  </li>
                </>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default Component;
