import React from 'react';
import { useState } from "react";
import './ListPDF.css';

const ListPDF = ({ documents }) => {
    if(documents !== null) {
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
                        <th className="px-4 py-2">Citação</th>
                        <th className="px-4 py-2">Indexada em:</th>
                        <th className="px-4 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {currentDocuments.map((document) => (
                        <tr key={document.id}>
                            <td className="border px-4 py-2">{document.filePageName}</td>
                            <td className="border px-4 py-2">{document.indexCompletionDate}</td>
                            <td className="border px-4 py-2"><a href={document.documentURL} target="_blank">Visualizar</a></td>
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