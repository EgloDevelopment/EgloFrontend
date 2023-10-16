import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.jsx";
import "./main.css";

import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NextUIProvider>
    <Router />
  </NextUIProvider>
);
