import { useState } from "react";

import Home from "./pages/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PasswordEnter from "./pages/auth/Password-Enter";

function Router() {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const [page, setPage] = useState("/");
  const [lastPagePollResult, setLastPagePollResult] = useState("/");

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

  //clearConsole(); //UNCOMMENT ME WHEN IN PRODUCTION
  pollForPageChanges();

  return (
    <>
      {page === "/" && <Home />}

      {page === "/login" && <Login />}
      {page === "/register" && <Register />}
      {page === "/password-enter" && <PasswordEnter />}
    </>
  );
}

export default Router;
