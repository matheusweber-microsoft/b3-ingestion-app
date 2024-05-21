import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { msalConfig } from './authConfig';
import { PublicClientApplication, EventType } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
      const account = event.payload.account;
      msalInstance.setActiveAccount(account);
  }

  if (event.eventType === EventType.LOGOUT_SUCCESS) {
      if (msalInstance.getAllAccounts().length > 0) {
          msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
      }
  }

  if (event.eventType === EventType.LOGIN_FAILURE) {
      console.log(JSON.stringify(event));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App instance={msalInstance} />
      </BrowserRouter>
  </React.StrictMode>
);
