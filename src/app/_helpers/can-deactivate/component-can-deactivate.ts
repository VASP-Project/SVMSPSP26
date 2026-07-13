import {HostListener, Injectable} from "@angular/core";
import { NgForm } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export abstract class ComponentCanDeactivate {
 
  abstract  canDeactivate(): boolean;
  abstract isDirty?: boolean;
    @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any) {
        if (!this.canDeactivate()) {
            $event.returnValue =true;
        }
    }
}