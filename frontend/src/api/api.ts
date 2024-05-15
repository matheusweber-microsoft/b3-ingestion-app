import axios from 'axios';
import { CreateDocumentResponse, Theme, ViewDocument } from "./models";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1/';
export async function fetchThemes(): Promise<[Theme] | undefined> {
    try {
        const response = await axios.get(API_URL + 'themes');
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
        subtheme: string,
        expiryDate: string,
        documentFile: File,
        uploadedBy: string,
        language: string
    ): Promise<CreateDocumentResponse | undefined> {
    // Validate parameters
    if (!documentTitle || !theme || !subtheme || !expiryDate || !documentFile || !uploadedBy || !language) {
      throw new Error('All parameters must be provided');
    }
    // Create form data
    const formData = new FormData();
    formData.append('documentTitle', documentTitle);
    formData.append('theme', theme);
    formData.append('subtheme', subtheme);
    formData.append('expiryDate', expiryDate);
    formData.append('documentFile', documentFile);
    formData.append('uploadedBy', uploadedBy);
    formData.append('language', language);

    try {
      const response = await axios.post(API_URL + 'document', formData, {
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
      const response = await axios.get(API_URL + 'document/' + id);
      const document = response.data;
      return document;
  } catch (error) {
      console.error('Error fetching document:', error);
  }
  return undefined;
}