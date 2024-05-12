import { useState } from "react";

export default function ListDocuments() {
  const documents = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    filename: `Document ${i + 1}`,
    theme: "This is a document",
    subTheme: "This is a document",
    indexStatus: "This is a document",
    uploadDate: "This is a document",
    expiryDate: "This is a document",
    uploadBy: "This is a document",
    aboutToExpire: "This is a document",
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 2;
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
            <th>Actions</th>
            <th>File Name</th>
            <th>Theme / Sub-Theme</th>
            <th>Index Status</th>
            <th>Upload Date</th>
            <th>Expiry Date</th>
            <th>Upload By</th>
            <th>About to Expire</th>
          </tr>
        </thead>
        <tbody>
          {currentDocuments.map((document) => (
            <tr key={document.id}>
              <td>
                <div className="flex">
                  <button className="btn">View</button>
                  <button className="btn">Download</button>
                </div>
              </td>
              <td>{document.filename}</td>
              <td>
                {document.theme} / {document.subTheme}
              </td>
              <td>{document.indexStatus}</td>
              <td>{document.uploadDate}</td>
              <td>{document.expiryDate}</td>
              <td>{document.uploadBy}</td>
              <td>{document.aboutToExpire}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center">
        <button
          className="btn mx-1"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            className="btn mx-1"
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
          Next
        </button>
      </div>
    </div>
  );
}
