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

export type Document = {
    documentTitle: string;
    expireStatus: number;
    expiryDate: string;
    fileName: string;
    id: string;
    subtheme: string;
    subthemeName: string;
    theme: string;
    themeName: string;
    uploadDate: string;
    uploadedBy: string;
    indexStatus: string;
};

export function convertGMTToLocal(gmtDate: string, withHours: boolean = false): string {
    const date = new Date(gmtDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getFullYear();
    let localDate = `${day}/${month}/${year}`;
    if (withHours) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        localDate += ` ${hours}:${minutes}:${seconds}`;
    }
    if (isNaN(date.getDate())) {
        return "";
    }
    return localDate;
}

export function convertTimestampToLocal(timestamp: number): string {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);
    // Convert the Date object to a string using the user's local time zone
    const localDate = date.toLocaleString();
    console.log("INVALID DATE: " + timestamp + " CONVERTED TO: " + localDate);
    return localDate;
}

export function getLocaleDate(date: string, withHours: boolean = false): string {
    if (date === undefined) {
        return "";
    }
    return convertGMTToLocal(date, withHours);
}