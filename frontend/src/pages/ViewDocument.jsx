import DocumentDetails from '../components/DocumentDetails.jsx';
import Header from '../components/Header.jsx';
import Title from '../components/Title.jsx';
import ListPDF from '../components/pagesComponents/ListPDF.jsx';
import lightTheme from '../styles/theme.js';
import { useEffect, useState } from "react";
import { getDocument } from '../api/api.ts';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import LoadingV2 from '../components/LoadingV2.jsx';

export default function ViewDocument() {
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState([]);
  const { id } = useParams();

  useEffect(() => { 
    setLoading(true);
    getDocument(id)
      .then((document) => {
        // Do something with the document
        setDocument(document);
        setLoading(false);
      })
      .catch((error) => {
        // Handle the error
        setLoading(false);
      });
  },[]);

  return (
    <main class="relative" style={{
      backgroundColor: lightTheme.colors.background,
    }}>

      {loading ? 
      <LoadingV2 /> : (
        <div style={{ height: "105vh", backgroundColor: lightTheme.colors.background}}>
          <Header />
          {document ? (
            <div>
              <DocumentDetails
                documentTitle={document.documentTitle}
                fileName={document.fileName}
                theme={document.theme}
                subtheme={document.subtheme}
                uploadedDate={document.uploadDate}
                expiryDate={document.expiryDate}
                uploadedBy={document.uploadedBy}
              />

              <div style={{ padding: '10px'}}>
                <Title title="Lista de citações" />
              </div>
              <div style={{ padding: '10px'}}>
                <ListPDF documents={document.documentPages} />
              </div>
            </div>
          ) : (
            <div>Error: Documento não encontrado.</div>
          )}
        </div>
      )}
    </main>
  );
}
