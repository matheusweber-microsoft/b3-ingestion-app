import React from 'react';
import { useState } from "react";
import './ListPDF.css';
import { getLocaleDate } from "../../api/models.ts";

const ListPDF = ({ documents }) => {
    if(documents === null || documents === undefined) {
        documents = [];
    }
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 15;
    const totalPages = Math.ceil(documents.length / documentsPerPage);

    // Get current documents
    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documents.slice(
        indexOfFirstDocument,
        indexOfLastDocument
    );

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    
    return (
        <div>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2" style={{width: "20px"}}>Ações</th>
                        <th className="px-4 py-2">Citação</th>
                        <th className="px-4 py-2">Indexada em:</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDocuments.map((document) => (
                        <tr key={document.documentURL}>
                            <td className="border px-4 py-2" style={{ textAlign: 'center' }}><a href={document.documentURL} target="_blank"><img src="../eye-ic.svg" alt="See Icon" style={{ width: '24px', height: '24px', display: 'block', margin: '0 auto' }} /></a></td>
                            <td className="border px-4 py-2">{document.filePageName}</td>
                            <td className="border px-4 py-2">{getLocaleDate(document.indexCompletionDate)}</td>
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
};

export default ListPDF;