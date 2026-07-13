import { Injectable } from '@angular/core';
import { BrowserCacheLocation, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { Observable } from 'rxjs';
import { AppConfigService } from './_services/appconfigservice ';

@Injectable({
  providedIn: 'root',
})
export class MsalConfigService {
  private msalInstance: PublicClientApplication;

  constructor(private appConfigService: AppConfigService) { }

  // Load config asynchronously and create msalInstance once config is available
  getMsalInstance(): Observable<PublicClientApplication> {
    return new Observable((observer) => {
      const msalConfig = {
        auth: {
          clientId: this.appConfigService.getClientIdaAzure(),
          authority: `https://login.microsoftonline.com/${this.appConfigService.getAuthorityAzure()}`,
          redirectUri: this.appConfigService.getRedirectUriAzure(),
          postLogoutRedirectUri: this.appConfigService.getPostLogoutRedirectUriAzure(),
          validateAuthority: true,
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: false,
        },
        system: {
          loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
              if (containsPii) return;
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
            piiLoggingEnabled: false,
          },
        },
      };
      this.msalInstance = new PublicClientApplication(msalConfig);
      observer.next(this.msalInstance);
      observer.complete();

    });
  }
}
