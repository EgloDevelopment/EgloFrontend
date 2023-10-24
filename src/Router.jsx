import { useState, useEffect } from "react";

import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Subscribe from "./pages/Subscribe";
import Profile from "./pages/Profile";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PasswordEnter from "./pages/auth/Password-Enter";

import makePostRequest from "./functions/other/make-post-request";

function Router() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [page, setPage] = useState("/");
  const [lastPagePollResult, setLastPagePollResult] = useState("/");

  useEffect(() => {
    const element = document.documentElement;

    element.scroll({
      top: 0,
    });
  }, [window.location.pathname]);

  async function pollForPageChanges() {
    let currentPage = window.location.pathname;

    if (currentPage !== lastPagePollResult) {
      setPage(currentPage);
      setLastPagePollResult(currentPage);
    }

    await sleep(50);
    pollForPageChanges();
  }

  async function clearConsole() {
    console.clear();
    await sleep(50);
    clearConsole();
  }

  //clearConsole(); UNCOMMENT ME WHEN IN PRODUCTION
  pollForPageChanges();

  return (
    <>
      {page === "/" && <Home />}
      {page === "/settings" && <Settings />}
      {page === "/subscribe" && <Subscribe />}
      {page.startsWith("/profile/") && <Profile />}

      {page === "/login" && <Login />}
      {page === "/register" && <Register />}
      {page === "/password-enter" && <PasswordEnter />}
    </>
  );
}

export default Router;
