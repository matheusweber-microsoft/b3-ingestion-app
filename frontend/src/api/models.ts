export type SubTheme = {
    allowedForGroups: string[];
    subthemeId: string;
    subthemeName: string;
};

export type Theme = {
    language: string;
    subThemes: SubTheme[];
    themeId: string;
    themeName: string;
};

export type CreateDocumentResponse = {
    success: boolean;
    message: string;
    id: string;
};

export type DocumentPage = { filePageName: string; indexCompletionDate: string; storageFilePath: string; documentURL: string; };

export type ViewDocument = { documentPages: DocumentPage[]; documentTitle: string; expiryDate: string; fileName: string; id: string; subtheme: string; subthemeName: string; theme: string; themeName: string; uploadDate: string; uploadedBy: string; };

