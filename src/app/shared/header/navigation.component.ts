import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { SystemLog } from '@app/authentication/login/systemlogs';
import { MsalService } from '@azure/msal-angular';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  public isCollapsed = true;
  public showSearch = false;
  public headerText: string = "";
  UserName$: Observable<string>;
  isLoggedIn$: Observable<boolean>;
  username: string;
  systemLog: SystemLog = new SystemLog();

  constructor(private modalService: NgbModal,
    private appURL: AppConfigService,
    private authenticationService: AuthenticationService,private oktaAuth: OktaAuth,
    private router: Router, private msalService: MsalService) {
  }

  ngOnInit() {
    this.headerText = this.appURL.getHeaderText();
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
    var obuser = this.authenticationService.getcurrentusername;
    this.UserName$ = obuser;
    var uu = JSON.parse(sessionStorage.getItem('currentUser'));
    this.username = uu.name.toUpperCase();

    setInterval(() => {
      this.onClick(this.headerText);
    }, 30000);
  }
  ngAfterViewInit() { }
  logout() {
    var uservalue = JSON.parse(sessionStorage.getItem("currentUser"));
    var loginuser = "logout"
    this.authenticationService.addSystemlog(uservalue.id, loginuser).subscribe(async (sysLog: SystemLog) => {
      this.systemLog = sysLog;

      this.authenticationService.logout();
      // You can also use logout methods provided by MsalService
      if (this.appURL.getLoginMethod() == 'Azure') {
        this.msalService.logout();
      }
      if (this.appURL.getLoginMethod() == 'Okta') {
        // Clear tokens and session locally
        // Subscribe to the authentication state
        // this.authStateService.authState$.subscribe((authState) => {
        //   this.isAuthenticated = !!authState?.isAuthenticated;
        //   this.userName = authState?.idToken?.claims?.name || null;
        // });
       

        this.oktaAuth.signOut().then(() => {
          // Redirect the user to the home page or wherever you want after authentication
          console.log("Okta Logout successfull");
          this.router.navigate(['/']);
        }).catch((error) => {
          console.error('Error during callback handling:', error);
        });
      }

      this.router.navigate(["/authentication"]);
    }, customError => {
      //this.toastr.error();
    });

  }
  changePassword() {
    this.router.navigate(["/admin/changepassword"]);
  }
  profile() {
    this.router.navigate(["/admin/profile"]);
  }
  collapse() {
    // this.router.navigate(["/admin/changepassword"]);
  }

  onClick(text: string) {
    if (text != "") {
      this.headerText = "";
    }
    else {
      this.headerText = this.appURL.getHeaderText();
    }
  }
}
