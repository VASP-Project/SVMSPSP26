import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutes } from './login.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthenticationService } from '@app/_services';
import { MsalService } from '@azure/msal-angular';
import { OktaAuthModule } from '@okta/okta-angular';
import { CallbackComponent } from '../callback/callback.component';
import OktaAuth from '@okta/okta-auth-js';
import { oktaAuthFactory } from '@app/OktaAuthFactory';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';
// import { OKTA_CONFIG, OktaAuthModule, OktaAuthStateService } from '@okta/okta-angular';
// import { OktaAuth } from '@okta/okta-auth-js';

// const oktaAuth = new OktaAuth({
//   issuer: 'https://trial-8164203.okta.com/oauth2/default',
//   clientId: '0oan2c0v0tUHZD8KS697',
//   redirectUri: 'http://localhost:4200/authentication/callback',
//   scopes: ['openid', 'profile', 'email'],
//   devMode: true, // Enables detailed logs
//   pkce: true
// });
//console.log('OktaAuth instance:', oktaAuth);

@NgModule({
  declarations: [LoginComponent, CallbackComponent, AuthCallbackComponent],
  imports: [
    RouterModule.forChild(LoginRoutes),
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    //OktaAuthModule
  ],
  providers: [
    MsalService,
    {
      provide: OktaAuth,
      useFactory: oktaAuthFactory,
      deps: [AppConfigService]
    },

  ],

})
export class LoginModule { }
