/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */

const VITE_MSAL_CLIENT_ID = import.meta.env.VITE_MSAL_CLIENT_ID;
const VITE_MSAL_AUTHORITY = import.meta.env.VITE_MSAL_AUTHORITY;
const VITE_MSAL_REDIRECT_URI = import.meta.env.VITE_MSAL_REDIRECT_URI;
const VITE_MSAL_SCOPE = import.meta.env.VITE_MSAL_SCOPE;

export const msalConfig = {
    auth: {
        clientId: VITE_MSAL_CLIENT_ID,
        authority: VITE_MSAL_AUTHORITY,
        redirectUri: VITE_MSAL_REDIRECT_URI,
        postLogoutRedirectUri: '/',
        clientCapabilities: ['CP1'],
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {	
        
        loggerOptions: {	
            loggerCallback: (level, message, containsPii) => {	
                if (containsPii) {		
                    return;		
                }		
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }	
            }	
        }	
    }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */

export const scopes = [VITE_MSAL_SCOPE]

export const loginRequest = {
    scopes: scopes
};

export const appRoles = {
    User: "DocumentsManager.User",
    Admin: "DocumentsManager.Admin",
}