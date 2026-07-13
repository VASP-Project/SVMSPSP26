import { OktaAuth } from "@okta/okta-auth-js";
import { AppConfigService } from "./_services/appconfigservice ";

export const oktaAuthConfig = {
  issuer: 'https://trial-7339616.okta.com/oauth2/default',
  clientId: '0oap8wns3cuexNelk697',
  redirectUri: 'http://localhost:4200/callback',
  scopes: ['openid', 'profile', 'email'],
  devMode: true, // Enables detailed logs
  pkce: true,
  tokenManager: {
    storage: 'sessionStorage',
  },
};