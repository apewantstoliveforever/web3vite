import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"
import "./index.css";
import * as process from "process";
import GunProvider from "./providers/gun-provider.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./auth/store";

(window as any).global = window;
(window as any).process = process;
(window as any).Buffer = [];
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />{" "}
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
