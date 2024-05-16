import Filters from "../components/Filters";
import { Link } from "react-router-dom";
import ListDocuments from "../components/pagesComponents/ListDocuments";
import DocumentListFilter from "../components/pagesComponents/DocumentListFilter";
import React, { useState, useEffect } from 'react';
import lightTheme from "../styles/theme.js";
import Loading from "../components/Loading.jsx";
import { fetchThemes, fetchDocuments } from "../api/api.ts";

export default function DocumentsList(props) {
  const [themes, setThemes] = useState([]);
  const [reloadDocuments, setReloadDocuments] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [count, setCount] = useState(0);
  
  const { onLoading } = props;

  useEffect(() => {
    onLoading(true);
    
    fetchThemes()
      .then((themes) => {
        // Do something with the themes
        setThemes(themes);
        onLoading(false);
      })
      .catch((error) => {
        // Handle the error
        onLoading(false);
      });

    fetchDocuments({})
      .then((documents) => {
        // Do something with the documents
        setDocuments(documents[0]);
        setCount(documents[1]);
        onLoading(false);
      })
      .catch((error) => {
        // Handle the error
        onLoading(false);
      });
  }, []);

  const handleFilter = (fields) => {
    const filteredFields = Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => value !== undefined && value !== "default")
    );
    onLoading(true);
    console.log(filteredFields);
    fetchDocuments(filteredFields)
      .then((documents) => {
        // Do something with the documents
        setDocuments(documents[0]);
        setCount(documents[1]);
        onLoading(false);
      })
      .catch((error) => {
        // Handle the error
        onLoading(false);
      });
  };

  return (
    <main
    className="relative"
      style={{
        backgroundColor: lightTheme.colors.background,
      }}
    >
      <DocumentListFilter themes={themes} onFilter={handleFilter} />

      <div style={{marginTop: "20px", float:"left", width:"100%"}}>
        <ListDocuments />
      </div>
    </main>
  );
}
