import Title from "../components/Title.jsx";
import ListPDF from "../components/pagesComponents/ListPDF.jsx";
import lightTheme from "../styles/theme.js";
import { useEffect, useState } from "react";
import { getDocument } from "../api/api.ts";
import { useParams } from "react-router-dom";
import DocumentDetails from "../components/pagesComponents/DocumentDetails.jsx";
import { getLocaleDate } from "../api/models.ts";

export default function ViewDocument(props) {
  const [document, setDocument] = useState([]);
  const { id } = useParams();
  const { onLoading, instance } = props;

  useEffect(() => {
    onLoading(true);
    getDocument(instance, id)
      .then((document) => {
        // Do something with the document
        setDocument(document);
        onLoading(false);
      })
      .catch((error) => {
        // Handle the error
        onLoading(false);
      });
  }, []);

  return (
    <main
    className="relative"
      style={{
        backgroundColor: lightTheme.colors.background,
      }}
    >
     <div
          style={{
            height: "105vh",
            backgroundColor: lightTheme.colors.background,
          }}
        >
          {document ? (
            <div>
              <DocumentDetails
                documentTitle={document.documentTitle}
                fileName={document.fileName}
                theme={document.theme}
                themeName={document.themeName}
                subtheme={document.subtheme}
                subthemeName={document.subthemeName}
                uploadedDate={getLocaleDate(document.uploadDate)}
                expiryDate={getLocaleDate(document.expiryDate)}
                uploadedBy={document.uploadedBy}
              />

              <div style={{ padding: "10px" }}>
                <Title title="Lista de citações" />
              </div>
              <div style={{ padding: "10px" }}>
                <ListPDF documents={document.documentPages} />
              </div>
            </div>
          ) : (
            <div>Error: Documento não encontrado.</div>
          )}
        </div>
    </main>
  );
}
