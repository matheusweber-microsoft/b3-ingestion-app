import { useState } from "react";
import theme from "../styles/theme.js";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

export default function Header() {
  var imageBasePath = window.location.protocol + "//" + window.location.host + "/ingestion/";
  const { instance } = useMsal();

  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  const handleLogoutRedirect = () => {
    instance.logoutRedirect().catch((error) => console.log(error));
  };

  const handleLoginRedirect = () => {
    instance.loginRedirect(loginRequest).catch((error) => console.log(error));
  };

  return (
    <header className="flex justify-between px-8 py-2" style={{background: theme.colors.menuBackground, boxShadow: `0 0px 10px -10px ${theme.colors.shadow}`}}>
      <div className="flex">
        <img src={imageBasePath + "home-header.svg"} alt="Home" />
        <p className="font-bold m-4" style={{color: theme.colors.title}}>HOME</p>
      </div>
      <div className="flex items-center">
        <AuthenticatedTemplate>
          <p className="mr-4" style={{color: theme.colors.title}}>{activeAccount ? activeAccount.name : 'Unknown'}</p>
          <button onClick={handleLogoutRedirect} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <p className="mr-4" style={{color: theme.colors.title}}>Faça o login para continuar.</p>
          <button onClick={handleLoginRedirect} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Login</button>
        </UnauthenticatedTemplate>
      </div>
    </header>
  );
}
