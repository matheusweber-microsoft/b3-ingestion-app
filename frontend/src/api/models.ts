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

export type DateType = {
    dateString?: string;
    dateObject?: {
        $date: number;
    };
};

export type Document = {
    documentTitle: string;
    expireStatus: number;
    expiryDate: DateType;
    fileName: string;
    id: string;
    subtheme: string;
    subthemeName: string;
    theme: string;
    themeName: string;
    uploadDate: DateType;
    uploadedBy: string;
    indexStatus: string;
};

export function convertGMTToLocal(gmtDate: string): string {
    // Create a Date object from the GMT date string
    const date = new Date(gmtDate);
    // Convert the Date object to a string using the user's local time zone
    const localDate = date.toLocaleString();
    console.log("INVALID DATE: " + gmtDate + " CONVERTED TO: " + localDate);
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

export function getLocaleDate(date: DateType): string {
    console.log(date);
    if (date === undefined) {
        return "";
    }

    if (date["$date"]) { // Check if dateObject exists and has the key $date
        console.log(convertTimestampToLocal(date["$date"]));
        return convertTimestampToLocal(date["$date"]);
    } else if (typeof date === 'string' && date !== '') {
        console.log(date);
        return convertGMTToLocal(date);
    } else {
        return "";
    }
}