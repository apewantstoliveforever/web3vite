import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as process from "process";
import GunProvider from "./providers/gun-provider.jsx";



(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
