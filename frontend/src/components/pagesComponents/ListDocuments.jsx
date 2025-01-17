import { useState, useEffect } from "react";
import './ListPDF.css';
import StatusView from "../StatusView";
import { Link } from "react-router-dom";
import { getLocaleDate } from "../../api/models.ts";
import React from 'react';

const ListDocuments = React.forwardRef(({ documents, totalCount, totalPages, onPageChange, onDelete, username, isAdmin }, ref) => {
  var imageBasePath = window.location.protocol + "//" + window.location.host + "/ingestion/";
  if(documents === null || documents === undefined) {
    documents = [];
  }

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;
  const setPage = (page) => {
    setCurrentPage(page);
  };

  React.useImperativeHandle(ref, () => ({
    setPage,
  }));
  // Get current documents
  const indexOfLastDocument = currentPage * documentsPerPage;
  const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
  const currentDocuments = documents.slice(
    indexOfFirstDocument,
    indexOfLastDocument
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };
   
  // Generate page numbers
  const pageNumbers = [];
  if (totalPages <= 3) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage === 1 || currentPage === 2) {
      pageNumbers.push(1, 2, 3);
    } else if (currentPage === totalPages || currentPage === totalPages - 1) {
      pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
    }
  }

  const getTranslatedIndexStatus = (indexStatus) => {
    switch (indexStatus) {
      case 'Submitted':
        return 'Enviado';
      case 'Processing':
        return 'Processando';
      case 'Indexed':
        return 'Concluído';
      case 'Deleting':
        return 'Deletando';
      default:
        return '';
    }
  };
  
  return (
    <div>
        <table className="table-auto w-full">
            <thead>
                <tr>
                  <th className="px-4 py-2" style={{width: "100px"}}>Ações</th>
                  <th className="px-4 py-2">Título</th>
                  <th className="px-4 py-2">Nome do Arquivo</th>
                  <th className="px-4 py-2">Tema/Subtema</th>
                  <th className="px-4 py-2">Indexamento</th>
                  <th className="px-4 py-2">Data de Upload</th>
                  <th className="px-4 py-2">Data de Validade</th>
                  <th className="px-4 py-2">Salvo por</th>
                  <th className="px-4 py-2" style={{width: "200px"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {documents.map((document) => (
                    <tr key={document.id}  style={{ height: '50px' }}>
                        <td className="border px-4 py-2">
                          <div className="flex flex-row">
                            {/* administrator */}
                            {document.indexStatus === 'Indexed' && (document.uploadedBy === username || isAdmin === true) && 
                              <div className="flex flex-col space-x-4  flex-grow">
                                <button onClick={() => onDelete(document.id)}><img src={imageBasePath+"delete-ic.svg"} alt="Delete Icon" style={{ width: '24px', height: '24px', display: 'block', margin: '0 auto' }} /></button>
                              </div>
                            }
                            <div className="flex flex-col space-x-4  flex-grow">
                              <Link to={`/ingestion/document/${document.id}`}><img src={imageBasePath+"eye-ic.svg"} alt="See Icon" style={{ width: '24px', height: '24px', display: 'block', margin: '0 auto' }} /></Link>
                            </div>  
                          </div>
                        </td>
                        <td className="border px-4 py-2">{document.documentTitle}</td>
                        <td className="border px-4 py-2">{document.fileName}</td>
                        <td className="border px-4 py-2">{document.themeName} / {document.subthemeName}</td>
                        <td className="border px-4 py-2">{getTranslatedIndexStatus(document.indexStatus)}</td>
                        <td className="border px-4 py-2">{getLocaleDate(document.uploadDate, true)}</td>
                        <td className="border px-4 py-2">{getLocaleDate(document.expiryDate, false)}</td>
                        <td className="border px-4 py-2">{document.uploadedBy}</td>
                        
                        <td className="border px-4 py-2"><StatusView status={document.expireStatus}></StatusView></td>
                    </tr>
                ))}
            </tbody>
        </table>

        <div className="flex justify-center mt-4">
            <button
                className="btn mx-1"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Anterior
            </button>
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={`btn mx-3 ${currentPage === number ? 'bg-blue-500 text-white p-2' : ''}`}
                    onClick={() => paginate(number)}
                >
                    {number}
                </button>
            ))}
            <button
                className="btn mx-1"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Próximo
            </button>
        </div>
    </div>
  );
});

export default ListDocuments;
