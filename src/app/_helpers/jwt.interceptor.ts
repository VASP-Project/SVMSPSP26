import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        // return next.handle(request);
        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401 || err.status === 403) {
                    // auto redirect to login page if 401 response returned from api
                    // this.authenticationService.clearSession();
                    // location.reload(true);
                    this.router.navigate(['authentication']);
                }
                return throwError(err);
            })
        );
    }
}