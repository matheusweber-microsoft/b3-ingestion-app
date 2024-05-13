import "./UploadDocument.css";
import "../styles/theme.js";
import lightTheme from "../styles/theme.js";
import Header from "../components/Header";
import UploadDocumentForm from "../components/pagesComponents/UploadDocumentForm.jsx";
import { useEffect } from "react";
import { fetchThemes } from "../api/api.ts";
import { useState } from "react";
import Loading from "../components/Loading.jsx";

export default function UploadDocument() {
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

  const handleChildLoading = (show) => {
    setLoading(show);
  };

  return (
    <main
      class="relative"
      style={{
        backgroundColor: lightTheme.colors.background,
      }}
    >
      {loading && <Loading />}

      <div
        className="content"
        style={{
          marginTop: "15px",
          paddingRight: "15px",
          paddingLeft: "15px",
          height: "100vh",
        }}
      >
        <UploadDocumentForm themes={themes} onLoading={handleChildLoading} />
      </div>
    </main>
  );
}
