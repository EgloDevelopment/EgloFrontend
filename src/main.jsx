import ReactDOM from "react-dom/client";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./globals.css";

import Home from "./pages/Home.jsx";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register";
import RecoverSend from "./pages/auth/Recover-Send";
import RecoverCancel from "./pages/auth/Recover-Cancel";
import RecoverConfirm from "./pages/auth/Recover-Confirm";
import PasswordEnter from "./pages/auth/Password-Enter";

import Settings from "./pages/Settings";

import FourOhFour from "./404.jsx";
import FiveHundred from "./500.jsx"

import ServerSettings from "./pages/server/Server-Settings";
import ServerInvite from "./pages/server/Server-Invite";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />

      <Route path="/settings" element={<Settings />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover-send" element={<RecoverSend />} />
      <Route path="/recover-cancel" element={<RecoverCancel />} />
      <Route path="/recover-confirm" element={<RecoverConfirm />} />
      <Route path="/password-enter" element={<PasswordEnter />} />

      <Route path="/server-settings" element={<ServerSettings />} />
      <Route path="/server-invite" element={<ServerInvite />} />

      <Route path="*" element={<FourOhFour />} />
      <Route path="/500" element={<FiveHundred />} />
    </Routes>
  </BrowserRouter>
);
