import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SpinnerHttpInterceptor implements HttpInterceptor {

    count = 0;

    constructor(private spinner: NgxSpinnerService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show()

        this.count++;

        return next.handle(req)

            .pipe(tap(

                event => console.log(event),

                (error:any)=> console.log(error)

            ), finalize(() => {

                this.count--;

                if (this.count == 0) this.spinner.hide()
            })
            );
    }
}