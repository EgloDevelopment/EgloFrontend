import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/react";

import "./main.css";


import Home from "./pages/Home.jsx"
import UserSettings from "./pages/settings/User-Settings.jsx"

import Login from "./pages/auth/Login.jsx"
import PasswordEnter from "./pages/auth/Password-Enter.jsx"
import Register from "./pages/auth/Register.jsx"
import RecoverSend from "./pages/auth/Recover-Send.jsx"
import RecoverHandle from "./pages/auth/Recover-Handle.jsx"

import GroupSettings from "./pages/settings/Group-Settings.jsx"

import FourOhFour from "./pages/404.jsx"
import FiveHundred from "./pages/500.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <NextUIProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/settings" element={<UserSettings />} />

        <Route path="/group-settings" element={<GroupSettings />} />

        <Route path="/login" element={<Login />} />
        <Route path="/password-enter" element={<PasswordEnter />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-send" element={<RecoverSend />} />
        <Route path="/recover-handle" element={<RecoverHandle />} />

        <Route path="*" element={<FourOhFour />} />
        <Route path="/500" element={<FiveHundred />} />
      </Routes>
    </NextUIProvider>
  </BrowserRouter>
);
