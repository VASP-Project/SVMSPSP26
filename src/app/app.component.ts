import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { AppConfigService } from './_services/appconfigservice ';
import { msalInstance } from './msal.config';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Security Violation Management System';

  constructor(private appURL: AppConfigService, private router: Router, private bnIdle: BnNgIdleService, private titleService: Title,private msalService:MsalService) {

  }

  // initiate it in your component OnInit
  ngOnInit(): void {
    this.titleService.setTitle('PSP System');
    if (this.appURL.getLoginMethod() == "Azure") {
      // Ensure the MSAL instance is initialized
      msalInstance.initialize().then(() => {
        console.log('MSAL instance initialized');
        
      }).catch(error => {
        console.error('MSAL initialization failed', error);
      });

    }
    else if(this.appURL.getLoginMethod() == "Okta"){

    }
    let sessiontimeout = this.appURL.getTimeOutText();
    this.bnIdle.startWatching(+sessiontimeout).subscribe((res) => {
      if (res) {
        if (this.router.url != '/authentication') {
          console.log("session expired");
          this.router.navigate(["/authentication"])
        }
      }
    })
  }
}

export enum CaseStatus {
  Open = 1,
  Submitted = 2,
  InProcess = 3,
  PendingCompletion = 4,
  Closed = 5,
  ReturnedToIssuer = 7,
  ReturnedToAS = 8
}

export enum InspectionStatus {
  Draft = 1,
  Submitted = 2,
  Assigned = 3,
  Closed = 4
}

export enum CouStatus {
  Draft = 1,
  Closed = 5
}

