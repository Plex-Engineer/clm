import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Provider from "providers";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
