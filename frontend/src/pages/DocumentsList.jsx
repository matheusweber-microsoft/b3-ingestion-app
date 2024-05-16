import Filters from "../components/Filters";
import { Link } from "react-router-dom";
import ListDocuments from "../components/pagesComponents/ListDocuments";
import DocumentListFilter from "../components/pagesComponents/DocumentListFilter";
import React, { useState, useEffect } from 'react';
import lightTheme from "../styles/theme.js";
import Loading from "../components/Loading.jsx";
import { fetchThemes } from "../api/api.ts";

export default function DocumentsList() {
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState([]);
  
  useEffect(() => {
    fetchThemes()
      .then((themes) => {
        // Do something with the themes
        setThemes(themes);
        setLoading(false);
      })
      .catch((error) => {
        // Handle the error
        setLoading(false);
      });
  }, []);

  return (
    <main
      class="relative"
      style={{
        backgroundColor: lightTheme.colors.background,
      }}
    >
      {loading && <Loading />}

      <DocumentListFilter themes={themes} onLoading={setLoading} />

      <div style={{marginTop: "20px", float:"left", width:"100%"}}>
        <ListDocuments />
      </div>
    </main>
  );
}
