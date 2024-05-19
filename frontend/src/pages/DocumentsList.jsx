import ListDocuments from "../components/pagesComponents/ListDocuments";
import DocumentListFilter from "../components/pagesComponents/DocumentListFilter";
import React, { useState, useEffect } from 'react';
import lightTheme from "../styles/theme.js";
import { fetchThemes, fetchDocuments, deleteDocument } from "../api/api.ts";
import { useMsal } from "@azure/msal-react";

export default function DocumentsList(props) {
  const [themes, setThemes] = useState([]);
  const [reloadDocuments, setReloadDocuments] = useState(true);
  const [listDocuments, setListDocuments] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const { onLoading, instance } = props;

  useEffect(() => {
    filters.page = currentPage;
    setFilters(filters);

    searchFilteredDocuments(filters);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClicked = (id) => {
    if (window.confirm("Você tem certeza que deseja deletar este documento?")) {
      console.log("Delete clicked", id);
      onLoading(true);

      deleteDocument(id)
        .then((response) => { 
          alert(response);
          window.location.reload();
          onLoading(false);
        })
        .catch((error) => {
          // Handle the error
          alert(error);
          onLoading(false);
        });
      // Add your delete logic here
    }
  };

  useEffect(() => {
    onLoading(true);
    
    fetchThemes(instance)
      .then((themes) => {
        // Do something with the themes
        setThemes(themes);
        onLoading(false);
      })
      .catch((error) => {
        // Handle the error
        onLoading(false);
      });

    fetchDocuments(instance, {})
      .then((response) => {
        // Do something with the documents
        setListDocuments(response);
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
    setFilters(filteredFields);
    setCurrentPage(1);
    searchFilteredDocuments(filteredFields);
  };

  const searchFilteredDocuments = (fields) => {
    onLoading(true);

    fetchDocuments(instance, fields)
      .then((response) => {
        // Do something with the documents
        setListDocuments(response);
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
        <ListDocuments documents={listDocuments.documents} totalCount={listDocuments.count} totalPages={listDocuments.pages}  onPageChange={handlePageChange} onDelete={handleDeleteClicked} />
      </div>
    </main>
  );
}
