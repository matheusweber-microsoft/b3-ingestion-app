import DocumentsList from "./pages/DocumentsList";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import SideBar from "./components/SideBar";
import lightTheme from "./styles/theme.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import React, { useState, useEffect } from 'react';
import Loading from "./components/Loading.jsx";

export default function App() {
  const [loading, setLoading] = useState(false);

  const handleChildLoading = (show) => {
    setLoading(show);
  };

  console.log("V1.0")
  return (
    <Router>
      <div className="flex" style={{background: lightTheme.colors.background}}>
        {loading && <Loading />}

        <SideBar />
        <div className="flex-1">
          <Header />
          <div className="mx-6 mt-6">
            <Routes>
              <Route path="/" element={<DocumentsList onLoading={handleChildLoading} />} />
              <Route path="/upload" element={<UploadDocument onLoading={handleChildLoading}  />} />
              <Route path="/document/:id" element={<ViewDocument />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
