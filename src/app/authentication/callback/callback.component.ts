import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import OktaAuth from '@okta/okta-auth-js';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular'; // Import OktaAuthStateService
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Userconfirmationdetails } from '../login/userconfirmation.module';
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { SystemLog } from '../login/systemlogs';
@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {
  @ViewChild("template") modalContent: TemplateRef<any>;
  modalOptions: NgbModalOptions;
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = "";
  isForgotPassword: boolean = false;
  year: number = 2020;
  closeResult: string;
  template: any;
  authenticationcode: string = "";
  userId: string;
  display: any;
  showresend: boolean = false;
  emailid: string = "";
  phone: string = "";
  email: any;
  saveusertoarray: number;
  //saveuseryes : boolean = false;
  saveuseryes: string = "yes";
  public starttimer: any;
  public timerInterval: any;
  systemLog: SystemLog = new SystemLog();

  userCodeArray: Userconfirmationdetails[] = [];
  constructor(
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,  // Inject OktaAuth
    private route: ActivatedRoute, private authenticationService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit(): Promise<void> {
    // Handle the redirect callback from Okta using OktaAuth
    // Retrieve tokens from the token manager

    const tokenResponse = await this.oktaAuth.token.parseFromUrl();
    // Extract tokens from the response
    const tokens = {
      idToken: tokenResponse.tokens.idToken,
      accessToken: tokenResponse.tokens.accessToken,
      refreshToken: tokenResponse.tokens.refreshToken // If refresh tokens are enabled
    };

    // Set tokens in the token manager
    this.oktaAuth.tokenManager.setTokens(tokens);
    // Retrieve the user's profile
    const user = await this.oktaAuth.token.getUserInfo(tokens.accessToken);
    // this.loginAzureSSOGetdataByEmail(user.email)
    this.loginAzureSSOGetdataByEmail(user.email)

    // //const tokens = await this.oktaAuth.handleRedirectCallback();
    // const tokensds = await this.oktaAuth.getAccessToken();


    // const tokens = await this.oktaAuth.tokenManager.getTokens();

    // // Set the tokens in the token manager (optional if automatic)
    // this.oktaAuth.tokenManager.setTokens(tokens);

    // // Retrieve user profile
    // const user = await this.oktaAuth.getUser();
    // console.log('User Email:', user.email);
    // // this.loginAzureSSOGetdataByEmail(user.email)
    // this.loginAzureSSOGetdataByEmail(user.email)
  }

  loginAzureSSOGetdataByEmail(email: string) {
    this.authenticationService
      .loginSSO(email, "")
      .pipe(first())
      .subscribe(
        (data: any) => {
          var user = JSON.parse(sessionStorage.getItem("currentUser"));
          this.setLoginRoute(data);
        },
        (error: any) => {
          this.error = "Invalid Credentials";
          this.loading = false;
          //this.spinner.hide();
        }
      );
  }

  resendcode() {
    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user != null) {
      this.userId = user.id;
    }
    this.authenticationService.resendcode(this.userId).subscribe();
    this.showresend = false;
    this.timer(5);
  }

  timer(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        this.showresend = true;
        clearInterval(timer);
      }
    }, 1000);
  }

  close() {
    window.location.reload();
    sessionStorage.setItem("confirmationPopUpOpen", "false");
    this.modalService.dismissAll();
    this.loading = false;

    clearInterval(this.timerInterval);
    this.authenticationService.logout();
    // this.router.navigate(["/authentication"]);
    this.router.navigate(["xyz"]).then(() => {
      this.router.navigate(["authentication"], {});
    });
  }

  stop() {
    clearInterval(this.timerInterval);
  }

  openModal(template: TemplateRef<any>) {
    sessionStorage.setItem("confirmationPopUpOpen", "true");
    this.modalService.open(template, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.timer(5);
  }

  setLoginRoute(data: any) {
    if (data.rolename == "Superadmin") {
      var loginuser = "login";
      this.authenticationService.addSystemlog(data.id, loginuser).subscribe(
        (sysLog: SystemLog) => {
          this.systemLog = sysLog;
        },
        (customError) => {
          this.toastr.error();
        }
      );

      this.router.navigate(["admin/user"]);
    } else if (data.errorText == "Deactivated") {
      this.error = "User Deactivated";
      this.loading = false;
      //this.spinner.hide();
    } else {
      var loginuser = "login";
      this.authenticationService.addSystemlog(data.id, loginuser).subscribe(
        (sysLog: SystemLog) => {
          this.systemLog = sysLog;
        },
        (customError) => {
          this.toastr.error();
        }
      );

      if (data.rolename == "Tenant") {
        console.log("admin/badgeverification")
        this.router.navigate(["admin/badgeverification"]);
      } else if (data.rolename == "Security") {
        console.log("Security")
        this.router.navigate(["admin/badgeverification"]);
      } else {
        console.log("admin/nov")
        this.router.navigate(["admin/nov"], {
          queryParams: { fromLoginPage: 1 },
        });
      }
    }
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  public emailMasking(_email: any) {
    if (_email) {
      _email = _email.split("");
      let finalarray: any = [];
      let length = _email.indexOf("@");
      _email.forEach((item: any, pos: any) => {
        pos >= 2 && pos <= length - 1
          ? finalarray.push("X")
          : finalarray.push(_email[pos]);
      });
      return finalarray.join("");
    } else {
      return null;
    }
  }
}
