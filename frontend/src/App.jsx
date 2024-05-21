import DocumentsList from "./pages/DocumentsList";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import SideBar from "./components/SideBar";
import lightTheme from "./styles/theme.js";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React, { useState } from 'react';
import Loading from "./components/Loading.jsx";
import { AuthenticatedTemplate } from "@azure/msal-react";
import { RouteGuard } from './components/RouteGuard';
import { appRoles } from './authConfig';
import { MsalProvider } from '@azure/msal-react';
import { PageLayout } from './components/PageLayout';

const Pages = ({ instance, loading }) => {
  return (
    <Routes>
      <Route 
        exact
        path="/" 
        element={
          <RouteGuard roles={[appRoles.Admin, appRoles.User]}>
            <DocumentsList onLoading={loading} instance={instance} />
          </RouteGuard>
        } 
      />
      <Route 
        exact
        path="/upload" 
        element={
          <RouteGuard roles={[appRoles.Admin, appRoles.User]}>
            <UploadDocument onLoading={loading} instance={instance} />
          </RouteGuard>
        }
      />
      <Route 
        exact
        path="/document/:id" 
        element={
          <RouteGuard roles={[appRoles.Admin, appRoles.User]}>
            <ViewDocument onLoading={loading} instance={instance}  />
          </RouteGuard>
        } />
    </Routes>
            
)};

const App = ({ instance }) => {
  const [loading, setLoading] = useState(false);
  
  const handleChildLoading = (show) => {
    setLoading(show);
  };

  const logout = () => {
    instance.logout();
  };
  return (
    <MsalProvider instance={instance}>
      <PageLayout>
        <div className="flex" style={{background: lightTheme.colors.background}}>
          {loading && <Loading />}
          <AuthenticatedTemplate><SideBar /></AuthenticatedTemplate>
          <div className="flex-1">
            <Header />
            <div className="mx-6 mt-6">
              <Pages instance={instance} loading={handleChildLoading} />
              </div>
            </div>
          </div>
      </PageLayout>
    </MsalProvider>
  );
};

export default App;
