import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class MsalInterceptor implements HttpInterceptor {
  constructor(private msalService: MsalService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const protectedResourceMap = new Map<string, string[]>([
      ['https://graph.microsoft.com/v1.0/me', ['user.read']]
    ]);

    const account = this.msalService.instance.getActiveAccount();
    const token = account?.idToken; // Use accessToken if applicable

    if (token && this.isProtectedResource(request.url, protectedResourceMap)) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }

  private isProtectedResource(url: string, protectedResourceMap: Map<string, string[]>): boolean {
    return Array.from(protectedResourceMap.keys()).some((resourceUrl) => url.startsWith(resourceUrl));
  }
}
