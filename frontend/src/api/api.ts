import axios from 'axios';
import { CreateDocumentResponse, DocumentListResponse, Theme, ViewDocument } from "./models";
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import { useMsal } from "@azure/msal-react";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

async function getToken(instance) {
  const account = instance.getAllAccounts()[0];
  const tokenRequest = {
    scopes: ["User.Read"], // replace with your API scopes
    account: account
  };

  try {
    const response = await instance.acquireTokenSilent(tokenRequest);
    return response.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      // fallback to interaction when silent call fails
      return instance.acquireTokenPopup(tokenRequest)
        .then(response => {
          return response.accessToken;
        });
    }
  }
}


export async function fetchThemes(instance): Promise<[Theme] | undefined> {
    try {
      const token = await getToken(instance);
      const response = await axios.get(API_URL + '/api/v1/themes', {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const themes = response.data;
      return themes;
    } catch (error) {
        console.error('Error fetching themes:', error);
    }
    return undefined;
}

export async function uploadDocument(
        instance,
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
      const token = await getToken(instance);
      const response = await axios.post(API_URL + '/api/v1/document', formData, {
        withCredentials: false,
        headers: {
          'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${token}`
        }
      });
      const documentId = response.data['id'];
      return { success: true, message: 'Document uploaded successfully', id: documentId };
    } catch (error) {
      const errorMessage = error.response.data['error'];
      return { success: false, message: errorMessage || error.message, id: "" };
    }
  }

export async function getDocument(instance, id): Promise<[ViewDocument] | undefined> {
  try {
      const token = await getToken(instance);
      const response = await axios.get(API_URL + '/api/v1/documents/' + id, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const document = response.data;
      return document;
  } catch (error) {
      console.error('Error fetching document:', error);
  }
  return undefined;
}

export async function fetchDocuments(instance, fields): Promise<DocumentListResponse | undefined> {
  const token = await getToken(instance);
  const queryParams = new URLSearchParams(fields);
  const url = API_URL + '/api/v1/documents?' + queryParams.toString();
  const response = await axios.get(url, {
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.log(url);
  try {
    const documents = response.data["data"];
    const metadata = response.data["metadata"];
    const count = metadata["totalCount"];
    const pages = metadata["totalPages"]; 

    return { documents, count, pages};
  } catch (error) {
    console.error('Error fetching document:', error);
  }
  return undefined;
}

export async function deleteDocument(instance, id): Promise<String | undefined> {
  try {
    const token = await getToken(instance);
    const response = await axios.delete(API_URL + '/api/v1/documents/' + id, {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const message = response.data['message'];
    return message;
  } catch (error) {
      console.error('Error fetching document:', error);
      return error.response.data['error'];
  }
  return undefined;
}

