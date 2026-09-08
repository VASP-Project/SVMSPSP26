import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const currentUser = sessionStorage.getItem('currentUser');
 
      if (!currentUser) {
        console.log('Session expired - unsaved changes gone');
  
        return true;
      }
      if (!component.canDeactivate()) {
        if (confirm("You have unsaved changes! Click Ok to discard your changes or Cancel to stay on this page.")) {
          return true;
        } else {
          return false;
        }
      } return true;
  }
}
