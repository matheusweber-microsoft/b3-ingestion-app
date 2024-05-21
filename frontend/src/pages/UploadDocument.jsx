import "./UploadDocument.css";
import "../styles/theme.js";
import lightTheme from "../styles/theme.js";
import UploadDocumentForm from "../components/pagesComponents/UploadDocumentForm.jsx";
import { useEffect } from "react";
import { fetchThemes } from "../api/api.ts";
import { useState } from "react";
import { useMsal } from "@azure/msal-react";

export default function UploadDocument(props) {
  const [themes, setThemes] = useState([]);
  const { onLoading, instance } = props;

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
  }, []);

  return (
    <main
    className="relative"
      style={{
        backgroundColor: lightTheme.colors.background,
      }}
    >

      <div
        className="content"
        style={{
          marginTop: "15px",
          paddingRight: "15px",
          paddingLeft: "15px",
          height: "100vh",
        }}
      >
        <UploadDocumentForm themes={themes} onLoading={onLoading} />
      </div>
    </main>
  );
}
