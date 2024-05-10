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
};