import DocumentsList from "./pages/DocumentsList";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import SideBar from "./components/SideBar";
import lightTheme from "./styles/theme.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React, { useState, useEffect } from 'react';
import Loading from "./components/Loading.jsx";
import { useIsAuthenticated } from '@azure/msal-react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";

export default function App() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [loading, setLoading] = useState(false);

  const handleChildLoading = (show) => {
    setLoading(show);
  };

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    if (!isAuthenticated && instance.inProgress === 'none') {
      instance.loginRedirect(loginRequest).then(() => {
        setIsLoggedIn(true);
      }).catch(e => {
        console.log(e);
      });
    } else if (isAuthenticated) {
      console.log(instance.getAllAccounts()[0]);
      instance.setActiveAccount(instance.getAllAccounts()[0]);
    }
  }, [isAuthenticated, instance]);

  const appContent = (
    <Router>
      <div className="flex" style={{background: lightTheme.colors.background}}>
        {loading && <Loading />}

        <SideBar />
        <div className="flex-1">
          <Header />
          <div className="mx-6 mt-6">
            <Routes>
              <Route path="/" element={<DocumentsList onLoading={handleChildLoading} instance={instance} />} />
              <Route path="/upload" element={<UploadDocument onLoading={handleChildLoading} instance={instance}   />} />
              <Route path="/document/:id" element={<ViewDocument onLoading={handleChildLoading} instance={instance}  />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
  
  const notAuthenticated = (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl">Please sign in to view documents.</h1>
    </div>
  );

  return isAuthenticated ? appContent : notAuthenticated;
}
