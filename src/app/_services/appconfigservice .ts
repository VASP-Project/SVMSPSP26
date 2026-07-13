import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OktaAuth } from '@okta/okta-auth-js';  // Correct import of OktaAuth
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private appConfig: any;

  constructor(private http: HttpClient) {
  }


  // loadAppConfig() {
  //   return this.http
  //     .get("assets/config.json")
  //     .toPromise()
  //     .then(data => {
  //       console.log(data);
  //       return (this.appConfig = data);

  //     });
  //   //return this.http.get('assets/config.json').toPromise();
  // }
  // Load configuration from an external file or API
  loadAppConfig(): Promise<void> {
    return this.http
      .get('assets/config.json') // Ensure the correct path here
      .toPromise()
      .then((config) => {
        this.appConfig = config;
      })
      .catch((error) => {
        console.error('Error loading app config:', error);
        throw error; // Ensures the app will fail to start if config is not loaded
      });
  }



  getClientIdaAzure(): string { return this.appConfig.clientIdaAzure }
  getAuthorityAzure(): string { return this.appConfig.authorityAzure }
  getRedirectUriAzure(): string { return this.appConfig.redirectUriAzure }
  getPostLogoutRedirectUriAzure(): string { return this.appConfig.postLogoutRedirectUriAzure }
  
  getLoginMethod(): string {
    return this.appConfig?.LoginMethod;
  }
  getIssuerOkta(): string {
    return this.appConfig?.issuerOkta;
  }
  getClientIdOkta(): string {
    return this.appConfig?.clientIdOkta;
  }
  getRedirectUriOkta(): string {
    return this.appConfig?.redirectUriOkta;
  }


  getServerUrl(): string {
    return this.appConfig?.API_URL;
  }

  getHeaderText(): string {
    return this.appConfig?.HeaderText;
  }

  getSecurityMessage(): string {
    return this.appConfig.SecurityMessage;
  }



  getClearanceDateText(): string {
    return this.appConfig.ClearanceDateText;
  }

  getAdvisoryText(): string {
    return this.appConfig.AdvisoryText;
  }

  getTimeOutText(): string {
    return this.appConfig.SessionTimeOutMinutes;
  }
  getBadgeAuditMessage(): string {
    return this.appConfig.SecurityMessageAuth;
  }
  getAdminFineMessage(): string {
    return this.appConfig.Adminfinepopup;
  }
  getSSO(): string {
    return this.appConfig.SSO;
  }
}