
import { OktaAuth } from '@okta/okta-auth-js';
import { AppConfigService } from './_services/appconfigservice ';

export function oktaAuthFactory(configService: AppConfigService): OktaAuth {
    return new OktaAuth({
        issuer: configService.getIssuerOkta(),
        clientId: configService.getClientIdOkta(),
        redirectUri: configService.getRedirectUriOkta(),      
        scopes: ['openid', 'profile', 'email'],
        devMode: true, // Enables detailed logs
        pkce: true,
        tokenManager: {
            storage: 'sessionStorage',
        },
    });
}
