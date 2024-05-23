import ListDocuments from "../components/pagesComponents/ListDocuments";
import DocumentListFilter from "../components/pagesComponents/DocumentListFilter";
import React, { useState, useEffect, useRef } from 'react';
import lightTheme from "../styles/theme.js";
import { fetchThemes, fetchDocuments, deleteDocument } from "../api/api.ts";
import { useMsal } from "@azure/msal-react";
import { appRoles } from '../authConfig';

export default function DocumentsList(props) {
  const [themes, setThemes] = useState([]);
  const [reloadDocuments, setReloadDocuments] = useState(true);
  const [listDocuments, setListDocuments] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const { onLoading, instance } = props;
  const listDocumentsRef = useRef();

  let activeAccount;

  if (instance) {
      activeAccount = instance.getActiveAccount();
  }

  useEffect(() => {
    filters.page = currentPage;
    setFilters(filters);

    searchFilteredDocuments(filters);

    if (activeAccount && activeAccount.idTokenClaims['roles']) {
      console.log(activeAccount.idTokenClaims['roles']);
      let role = appRoles.Admin;
      let roles = activeAccount.idTokenClaims['roles'];
      setIsAdmin(roles.includes(role));
    }
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteClicked = (id) => {
    if (window.confirm("Você tem certeza que deseja deletar este documento?")) {
      onLoading(true);

      deleteDocument(instance, id)
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

    Promise.all([
        fetchThemes(instance),
        fetchDocuments(instance, {})
    ])
    .then(([themes, documents]) => {
        setThemes(themes);
        setListDocuments(documents);
    })
    .catch((error) => {
        onLoading(false);
    })
    .finally(() => {
        onLoading(false);
    });
  }, []);

  const handleFilter = (fields) => {
    const filteredFields = Object.fromEntries(
      Object.entries(fields).filter(([key, value]) => value !== undefined && value !== "default")
    );
    setFilters(filteredFields);
    listDocumentsRef.current.setPage(1);
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

      <div style={{ marginTop: "20px", float: "left", width: "100%" }}>
        <ListDocuments
          ref={listDocumentsRef}
          documents={listDocuments.documents}
          totalCount={listDocuments.count}
          totalPages={listDocuments.pages}
          onPageChange={handlePageChange}
          onDelete={handleDeleteClicked}
          username={activeAccount.username}
          isAdmin={isAdmin}
        />
      </div>
    </main>
  );
}
