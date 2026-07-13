import { InjectionToken, NgModule, APP_INITIALIZER } from '@angular/core';
import {
    MsalService,
    MsalModule,
    MsalInterceptor,
    MSAL_INSTANCE,
    MsalBroadcastService,
    MsalGuard,
    MsalGuardConfiguration,
    MSAL_GUARD_CONFIG,
    MSAL_INTERCEPTOR_CONFIG,
    MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigService } from './config.service';
import { BrowserCacheLocation, Configuration, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MsalConfigService } from './MsalConfigService';
import { MSALInstanceFactory } from './msal-instance-factory';
import { AppConfigService } from './_services/appconfigservice ';


const AUTH_CONFIG_URL_TOKEN = new InjectionToken<string>('AUTH_CONFIG_URL');

const guardConfig: MsalGuardConfiguration = {
    interactionType: InteractionType.Popup,  // Use popup for login
    authRequest: {
        scopes: ['user.read', 'mail.read'],  // Request specific scopes for login
    },
};

const interceptorConfig: MsalInterceptorConfiguration = {
    interactionType: InteractionType.Popup, // Define how the interaction should happen (e.g., Popup)
    protectedResourceMap: new Map([
        ['https://graph.microsoft.com/v1.0/me', ['user.read']], // Protect API requests with specific scopes
    ]),
};

// The initializer function that loads the config data
export function initializerFactory(configService: ConfigService, configUrl: string): () => Promise<any> {
    return () => {
        console.log('Initializing ConfigService...');
        return configService.init(configUrl).then(() => {
            console.log('Configuration loaded:', configService.getSettings());
        }).catch((error) => {
            console.error('Failed to load configuration:', error);
        });
    };
}
export function msalInstanceFactory(config: ConfigService): PublicClientApplication {
    console.log('Creating MSAL instance...');
    const msalConfig = msalConfigFactory(config);
    return new PublicClientApplication(msalConfig);
}

// export function msalInstanceFactory(msalConfigService: MsalConfigService): () => Promise<PublicClientApplication> {
//     return () => {
//         return msalConfigService.msalConfig$.toPromise().then((msalConfig) => {
//             if (msalConfig) {
//                 return new PublicClientApplication(msalConfig);  // Return the MSAL instance only after configuration is ready
//             }
//             throw new Error('MSAL configuration is not ready');
//         });
//     };
// }

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);

    return {
        interactionType: InteractionType.Popup, // Interaction type for token acquisition
        protectedResourceMap,
    };
}
// MSAL Configuration Factory
export function msalConfigFactory(config: ConfigService): Configuration {
    const auth = {
        auth: {
            clientId: config.getSettings('clientID'),
            authority: config.getSettings('authority'),
            redirectUri: config.getSettings('redirectUri'),
            postLogoutRedirectUri: config.getSettings('postLogoutRedirectUri'),
            validateAuthority: true,
        },

        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: false,
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
        // {
        //     interactionType: InteractionType.Redirect, // MSAL Guard Configuration
        //   }
    };
    return auth;  // Returning MSAL Configuration
}

@NgModule({
    imports: [MsalModule]  // Import the MSAL module
})
export class MsalApplicationModule {
    static forRoot(configFile: string) {
        return {
            ngModule: MsalApplicationModule,
            providers: [
                ConfigService,
                MsalConfigService,
                { provide: AUTH_CONFIG_URL_TOKEN, useValue: configFile },
                {
                    provide: APP_INITIALIZER,
                    useFactory: initializerFactory,
                    deps: [ConfigService, AUTH_CONFIG_URL_TOKEN],
                    multi: true
                },
                {
                    provide: MSAL_INSTANCE,
                    useFactory: msalInstanceFactory,  // Use the factory to provide the msalInstance
                    deps: [ConfigService, AUTH_CONFIG_URL_TOKEN],
                    multi: false,
                },             
                {
                    provide: MSAL_INTERCEPTOR_CONFIG,
                    useFactory: MSALInterceptorConfigFactory,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: MsalInterceptor,
                    multi: true,
                },               
                MsalService,
                MsalGuard,        
                MsalBroadcastService,

            ]
        };
    }
}
