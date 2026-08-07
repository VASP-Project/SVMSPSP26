
import { OktaAuth } from '@okta/okta-auth-js';
import { AppConfigService } from './_services/appconfigservice ';
import { BrowserCacheLocation, LogLevel, PublicClientApplication } from '@azure/msal-browser';

export function AzureAuthFactory(configService: AppConfigService): any {
    const msalConfig: any = {
        auth: {
            clientId: '4e6f8061-07c4-411f-a910-95293446de99', // Replace with your App Registration ID from Azure Portal
            authority: 'https://login.microsoftonline.com/25dfd246-e2dd-437a-83ad-4463946e422e', // Replace with your tenant ID from Azure Portal
            validateAuthority: true,
            redirectUri: 'https://prod.icssoft.com/pspgui/auth/callback', // Match the redirect URI set in your app registration
            postLogoutRedirectUri: 'https://prod.icssoft.com/pspgui', // Your Angular app's logout redirect
            // clientId: 'd48917c2-1b01-450c-8ce1-cdc2dd532638', // Replace with your App Registration ID from Azure Portal
            // authority: 'https://login.microsoftonline.com/71e77330-aea1-46bc-bf5e-aae26d31e39c/v2.0', // Replace with your tenant ID from Azure Portal
            // validateAuthority: true,
            // redirectUri: 'http://localhost:4200/callback', // Match the redirect URI set in your app registration
            // postLogoutRedirectUri: 'http://localhost:4200', // Your Angular app's logout redirect
            cache: {
                cacheLocation: BrowserCacheLocation.LocalStorage, // Cache location, LocalStorage recommended
                storeAuthStateInCookie: false, // Store auth state in cookie (optional)
            },
        },
        cache: {
            cacheLocation: BrowserCacheLocation.SessionStorage, // Enable caching for session data
            storeAuthStateInCookie: true, // Optional, stores user session data in a cookie
        },
        system: {
            loggerOptions: {
                loggerCallback(level: LogLevel, message: string, containsPii: boolean) {
                    if (containsPii) {
                        return; // Avoid logging personally identifiable information
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
                    }
                },
                piiLoggingEnabled: false, // Disable logging of PII (Personally Identifiable Information)
            },
        },
    };

    return new PublicClientApplication(msalConfig);

}
