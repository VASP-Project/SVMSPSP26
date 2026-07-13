import { Location } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

/**
 * Factory function to create an instance of MsalService with required dependencies.
 */
// export function msalServiceFactory(location: Location): MsalService {
//     return new MsalService(msalInstance, location);
// }

export function msalServiceFactory(location: Location,msalInstance: PublicClientApplication): MsalService {
    return new MsalService(msalInstance, location);
  }