import axios from 'axios';
import { CreateDocumentResponse, Theme, ViewDocument } from "./models";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export async function fetchThemes(): Promise<[Theme] | undefined> {
    try {
      const response = await axios.get(API_URL + '/api/v1/themes', { withCredentials: false });
        
      const themes = response.data;
      return themes;
    } catch (error) {
        console.error('Error fetching themes:', error);
    }
    return undefined;
}

export async function uploadDocument(
        documentTitle: string,
        theme: string,
        themeName: string,
        subtheme: string,
        subthemeName: string,
        expiryDate: string,
        documentFile: File,
        uploadedBy: string,
        language: string
    ): Promise<CreateDocumentResponse | undefined> {
    // Validate parameters
    if (!documentTitle || !theme || !subtheme || !expiryDate || !documentFile || !uploadedBy || !language || !themeName || !subthemeName) {
      throw new Error('All parameters must be provided');
    }

    // Create form data
    const formData = new FormData();
    formData.append('documentTitle', documentTitle);
    formData.append('theme', theme);
    formData.append('themeName', themeName);
    formData.append('subtheme', subtheme);
    formData.append('subthemeName', subthemeName);
    formData.append('expiryDate', expiryDate);
    formData.append('documentFile', documentFile);
    formData.append('uploadedBy', uploadedBy);
    formData.append('language', language);

    

    try {
      const response = await axios.post(API_URL + '/api/v1/document', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const documentId = response.data['id'];
      return { success: true, message: 'Document uploaded successfully', id: documentId };
    } catch (error) {
      const errorMessage = error.response.data['error'];
      return { success: false, message: errorMessage || error.message, id: "" };
    }
  }

export async function getDocument(id): Promise<[ViewDocument] | undefined> {
  try {
      const response = await axios.get(API_URL + '/api/v1/documents/' + id, { withCredentials: false });
      const document = response.data;
      return document;
  } catch (error) {
      console.error('Error fetching document:', error);
  }
  return undefined;
}

export async function fetchDocuments(fields): Promise<[Document[], number] | undefined> {
  const queryParams = new URLSearchParams(fields);
  const url = API_URL + '/api/v1/documents?' + queryParams.toString();
  const response = await axios.get(url, { withCredentials: false });
  try {
    const documents = response.data["data"];
    const count = response.data["count"];
    return [documents, count];
  } catch (error) {
    console.error('Error fetching document:', error);
  }
  return undefined;
}

