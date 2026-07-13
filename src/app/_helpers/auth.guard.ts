import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Userconfirmationdetails } from '@app/authentication/login/userconfirmation.module';
import { AuthenticationService } from '@app/_services';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    userCodeArray: Userconfirmationdetails[] = [];
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService, private appURL: AppConfigService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (this.appURL.getLoginMethod() == "Okta") {
            if (currentUser) {
                // logged in so return true           
                return true;
            }
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/authentication']);  //, { queryParams: { returnUrl: state.url } }
            return false;
        }
        else {
            let popstatus = JSON.parse(sessionStorage.getItem("confirmationPopUpOpen"))
            if (!currentUser.isUserAuthenticated) {
                popstatus = false
            }


            // this.authenticationService.isLoggedIn.subscribe(event => currentUser = event); -- To do
            // TODO : check for logged in user. - Rushali

            if (currentUser && popstatus == false) {
                // logged in so return true           
                return true;
            }
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/authentication']);  //, { queryParams: { returnUrl: state.url } }
            return false;
        }

    }
}