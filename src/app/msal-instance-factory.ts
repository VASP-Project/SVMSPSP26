// msal-instance-factory.ts
import { PublicClientApplication, Configuration, BrowserCacheLocation } from '@azure/msal-browser';
import { AppConfigService } from './_services/appconfigservice ';

export function MSALInstanceFactory(appConfigService: AppConfigService): PublicClientApplication {
  const config: any = {
    auth: {
      clientId: appConfigService.getClientIdaAzure(),  // Dynamically get clientId from AppConfigService
      authority: appConfigService.getAuthorityAzure(),  // Dynamically get authority
      redirectUri: appConfigService.getRedirectUriAzure(),  // Dynamically get redirectUri
      postLogoutRedirectUri: appConfigService.getPostLogoutRedirectUriAzure(),  // Dynamically get postLogoutRedirectUri
      //navigateToLoginRequestUrl: true,
      validateAuthority:true
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,  // You can also use SessionStorage here
      storeAuthStateInCookie: true,  // Set to true for IE11 support
    },
    system: {
      loggerOptions: {
        loggerCallback: () => {},
        piiLoggingEnabled: false,
      },
    },
  };

  return new PublicClientApplication(config);  // Return the MSAL instance
}
