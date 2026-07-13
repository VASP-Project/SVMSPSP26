import { Component, Inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { filter, first, map } from "rxjs/operators";
import { NgxSpinnerService } from "ngx-spinner";
import { HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "@app/_services";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { Userconfirmationdetails } from "./userconfirmation.module";
import { SystemLog } from "./systemlogs";
import { MSAL_INSTANCE, MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";
import { AuthState, OktaAuth, Tokens } from '@okta/okta-auth-js';
import { AppConfigService } from "@app/_services/appconfigservice ";
import { MsalConfigService } from "@app/MsalConfigService";
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  @ViewChild("template") modalContent: TemplateRef<any>;
  getSsoValue: string = this.appURL.getSSO();
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

  authState: any;
  user: any;
  interactionStatus: InteractionStatus = InteractionStatus.None;
  msalInstance: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private msalService: MsalService,
    private oktaAuth: OktaAuth,
    private appURL: AppConfigService, private msalBroadcastService: MsalBroadcastService, private authService:OktaAuthStateService,
    private msalConfigService: MsalConfigService
  ) {
    if (this.appURL.getLoginMethod() == "Azure") {
      // Ensure login is only called when MSAL is fully initialized
      // this.msalBroadcastService.inProgress$.subscribe((status) => {
      //   this.interactionStatus = status;
      //   this.msalInstance = this.msalConfigService.getMsalInstance();
      //   const accounts = this.msalInstance.getAllAccounts();

      //   if (accounts.length > 0) {
      //     const activeAccount = accounts[0];  // Use the first account as the active one
      //     console.log('Active account:', activeAccount);
      //     this.loginAzureSSOGetdataByEmail(activeAccount.username);
      //   } else {
      //     console.log('No accounts found, user might not be logged in.');
      //   }
      //   // this.msalConfigService.getMsalInstance().subscribe({
      //   //   next: (instance: PublicClientApplication) => {
      //   //     this.msalInstance = instance; // Assign the MSAL instance
      //   //     console.log('MSAL instance initialized:', this.msalInstance);
      //   //     this.getEmailIfStartupStatus()
      //   //     console.log('MSAL interaction status:', status);
      //   //   },
      //   //   error: (err) => {
      //   //     console.error('Error initializing MSAL instance:', err);
      //   //   }
      //   // });




      // });
    }
    else if(this.appURL.getLoginMethod() == "Okta"){
      let isAuthenticated$ = this.authService.authState$.pipe(
        filter((authState: AuthState) => !!authState),
        map((authState: AuthState) => authState.isAuthenticated ?? false)
      );
      //alert("isAuthenticated"+ isAuthenticated$)
    }
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }

    this.modalOptions = {
      backdrop: "static",
      backdropClass: "customBackdrop",
      size: "xl",
    };
  }

  ngOnInit() {


    this.year = new Date().getFullYear();
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    this.isForgotPassword = false;
    if (this.appURL.getLoginMethod() == "Azure") {
      // Ensure MSAL instance is ready for use
      // this.msalInstance = this.msalConfigService.getMsalInstance();
      // const accounts = this.msalInstance.getAllAccounts();

      // if (accounts.length > 0) {
      //   const activeAccount = accounts[0];  // Use the first account as the active one
      //   console.log('Active account:', activeAccount);
      //   this.loginAzureSSOGetdataByEmail(activeAccount.username);
      // } else {
      //   console.log('No accounts found, user might not be logged in.');
      // }
      // this.msalConfigService.getMsalInstance().subscribe({
      //   next: (instance: PublicClientApplication) => {
      //     this.msalInstance = instance; // Assign the MSAL instance
      //     console.log('MSAL instance initialized:', this.msalInstance);
      //     const accounts = this.msalInstance.getAllAccounts();

      //     if (accounts.length > 0) {
      //       const activeAccount = accounts[0];  // Use the first account as the active one
      //       console.log('Active account:', activeAccount);
      //       this.loginAzureSSOGetdataByEmail(activeAccount.username)

      //     } else {
      //       console.log('No accounts found, user might not be logged in.');
      //     }
      //   },
      //   error: (err) => {
      //     console.error('Error initializing MSAL instance:', err);
      //   }
      // });


      // const accounts = this.msalInstance.getAllAccounts();

      // if (accounts.length > 0) {
      //   const activeAccount = accounts[0];  // Use the first account as the active one
      //   console.log('Active account:', activeAccount);
      //   this.loginAzureSSOGetdataByEmail(activeAccount.username)

      // } else {
      //   console.log('No accounts found, user might not be logged in.');
      // }
    }
    else if(this.appURL.getLoginMethod() == "Okta"){

    }
  }

  getEmailIfStartupStatus() {
    const activeAccount = this.msalInstance.getActiveAccount();

    if (activeAccount) {
      console.log("User Email:", activeAccount.username); // Usually the email or UPN
      return activeAccount.username;
    } else {
      console.warn("No active account found. The user might not be signed in.");
      return null;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubbmitLogin() {
    this.isForgotPassword = false;
    this.router.navigate(["authentication"]);
  }


  async loginOkta() {
    // Trigger the popup-based login flow
    const response = await this.oktaAuth.signInWithRedirect();    
  }

  async loginSSO() {
    if (this.appURL.getLoginMethod() == "Azure") {


      // if (!this.msalInstance.getActiveAccount()) {
      //   await this.msalInstance.loginPopup();
      // }

      
      this.msalBroadcastService.inProgress$
        .subscribe((status: InteractionStatus) => {
          if (status === InteractionStatus.None) {
            
            this.msalService.loginPopup()
              .subscribe({
                next: (response) => {
                  console.log('Login successful:', response);
                  // Cast idTokenClaims to a specific type
                  const claims = response.idTokenClaims as { [key: string]: any };

                  // Extract email or username
                  const email = claims['preferred_username'] || claims['email'];
                  //Call API to generate token with given email

                  if (email) {
                    console.log('Logged-in user email:', email);
                    this.loginAzureSSOGetdataByEmail(email)
                  } else {
                    console.warn('Email claim is not available in the token.');
                  }
                },
                error: (err) => {
                  console.error('Login failed:', err);
                }
              });
          } else {
            console.warn('Another interaction is in progress.');
            // this.msalService.instance.logoutRedirect(); // Resets the session
            // this.msalService.logoutPopup();


          }
        });

      this.msalService.loginPopup().subscribe(
        (response: AuthenticationResult) => {
          console.log('Login successful:', response);
          // Cast idTokenClaims to a specific type
          const claims = response.idTokenClaims as { [key: string]: any };

          // Extract email or username
          const email = claims['preferred_username'] || claims['email'];
          //Call API to generate token with given email

          if (email) {
            console.log('Logged-in user email:', email);
            this.loginAzureSSOGetdataByEmail(email)
          } else {
            console.warn('Email claim is not available in the token.');
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.toastr.error("SSO Login Failed");
        }
      );
    }
    else if (this.appURL.getLoginMethod() == "Okta") {
      await this.loginOkta()
    }


  }

  loginAzureSSOGetdataByEmail(email: string) {
    this.authenticationService
      .loginSSO(email, "")
      .pipe(first())
      .subscribe(
        (data: any) => {
          var user = JSON.parse(sessionStorage.getItem("currentUser"));
          if (user.userAuthenticationType == 1) {
            this.emailid = user.email;
            // let hide = this.emailid.split("@")[0].length - 2;//<-- number of characters to hide
            // var r = new RegExp(".{"+hide+"}@", "g")
            // this.emailid = this.emailid.replace(r, "***@" );
            this.email = this.emailMasking(this.emailid);
          } else if (user.userAuthenticationType == 2) {
            this.phone = user.phoneNumber;
            this.phone =
              "(XXX) XXX-" + this.phone.substr(this.phone.length - 4);
          } else if (user.userAuthenticationType == 3) {
            this.emailid = user.email;
            this.email = this.emailMasking(this.emailid);
            this.phone = user.phoneNumber;
            this.phone =
              "(XXX) XXX-" + this.phone.substr(this.phone.length - 4);
          }
          this.setLoginRoute(data);
          // if (data.isUserAuthenticated == true) {
          //   this.userCodeArray = JSON.parse(
          //     localStorage.getItem("userCodeArray")
          //   );
          //   if (this.userCodeArray != null) {
          //     sessionStorage.setItem("confirmationPopUpOpen", "false");
          //     if (this.userCodeArray.some((x) => x.userId == user.id)) {
          //       let userCoder = this.userCodeArray.filter(
          //         (x) => x.userId == user.id
          //       )[0];
          //       const usercodevalidtill = userCoder.confirmationvalidtill;
          //       const validdate = new Date(usercodevalidtill);
          //       const currentDate = new Date();
          //       if (!userCoder.isVerified) {
          //         //If confirmation not verified
          //         this.openModal(this.modalContent);
          //       } else {
          //         //If confirmation code is verifed
          //         if (currentDate < validdate) {
          //           this.setLoginRoute(data);
          //         } else {
          //           this.resendcode();
          //           this.openModal(this.modalContent);
          //         }
          //       }
          //     } else {
          //       this.resendcode();
          //       //Show popup
          //       this.openModal(this.modalContent);
          //     }
          //   } else {
          //     this.resendcode();
          //     this.openModal(this.modalContent);
          //   }
          // } else {
          //   this.setLoginRoute(data);
          // }
        },
        (error: any) => {
          this.error = "Invalid Credentials";
          this.loading = false;
          //this.spinner.hide();
        }
      );
  }

  logout(): void {
    // You can also use logout methods provided by MsalService
    this.msalService.logout();
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
        this.router.navigate(["admin/badgeverification"]);
      } else if (data.rolename == "Security") {
        this.router.navigate(["admin/badgeverification"]);
      } else {
        this.router.navigate(["admin/nov"], {
          queryParams: { fromLoginPage: 1 },
        });
      }
    }
  }

  onSubmit(template: TemplateRef<any>) {
    if (!this.isForgotPassword) {
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }
      this.loading = true;
      //this.spinner.show();

      this.authenticationService
        .login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          (data: any) => {
            var user = JSON.parse(sessionStorage.getItem("currentUser"));
            if (user.userAuthenticationType == 1) {
              this.emailid = user.email;
              this.email = this.emailMasking(this.emailid);
            } else if (user.userAuthenticationType == 2) {
              this.phone = user.phoneNumber;
              this.phone =
                "(XXX) XXX-" + this.phone.substr(this.phone.length - 4);
            } else if (user.userAuthenticationType == 3) {
              this.emailid = user.email;
              this.email = this.emailMasking(this.emailid);
              this.phone = user.phoneNumber;
              this.phone =
                "(XXX) XXX-" + this.phone.substr(this.phone.length - 4);
            }

            if (data.isUserAuthenticated == true) {
              this.userCodeArray = JSON.parse(
                localStorage.getItem("userCodeArray")
              );
              if (this.userCodeArray != null) {
                sessionStorage.setItem("confirmationPopUpOpen", "false");
                if (this.userCodeArray.some((x) => x.userId == user.id)) {
                  let userCoder = this.userCodeArray.filter(
                    (x) => x.userId == user.id
                  )[0];
                  const usercodevalidtill = userCoder.confirmationvalidtill;
                  const validdate = new Date(usercodevalidtill);
                  const currentDate = new Date();
                  if (!userCoder.isVerified) {
                    //If confirmation not verified
                    this.openModal(template);
                  } else {
                    //If confirmation code is verifed
                    if (currentDate < validdate) {
                      this.setLoginRoute(data);
                    } else {
                      this.resendcode();
                      this.openModal(template);
                    }
                  }
                } else {
                  this.resendcode();
                  //Show popup
                  this.openModal(template);
                }
              } else {
                this.resendcode();
                this.openModal(template);
              }
            } else {
              this.setLoginRoute(data);
            }
          },
          (error: any) => {
            this.error = "Invalid Credentials";
            this.loading = false;
            //this.spinner.hide();
          }
        );
    } else {
      this.submitted = true;
      // stop here if form is invalid
      if (this.f.username.value === "") {
        this.toastr.error("Enter Username");
        return;
      }
      //this.spinner.show();
      this.authenticationService
        .forgotPassword(this.f.username.value)
        .subscribe(
          (data: any) => {
            // console.log(data);
            if (data.errorText == "Mail_Sent") {
              this.error = "";
              this.isForgotPassword = false;
              //this.spinner.hide();
              this.toastr.success(
                "Password reset link has been sent to email."
              );
              this.router.navigate(["authentication"]);
            } else if (data.errorText == "User_Not_Found") {
              //this.spinner.hide();
              this.toastr.error("Email not found");
            } else {
              //this.spinner.hide();
              this.toastr.error("Password reset link not sent. Try again");
            }
          },
          (error: any) => {
            this.error = error;
            //this.spinner.hide();
            if (error == "OK") {
              this.toastr.error("Password reset link has been sent to email.");
            }

            this.isForgotPassword = false;
            this.error = "";
            this.router.navigate(["authentication"]);
          }
        );
    }
  }

  saveuser(param) {
    this.saveusertoarray = param;

    if (this.saveusertoarray == 0) {
      this.saveuseryes = "no";
    } else {
      this.saveuseryes = "yes";
    }
  }

  onAuthCodeSubmit() {
    if (this.authenticationcode == "") {
      this.toastr.warning("Enter Confirmation Code");
      return;
    }
    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user != null) {
      this.userId = user.id;
    }
    this.authenticationService
      .confirmationcode(this.userId, this.authenticationcode)
      .subscribe((data: any) => {
        sessionStorage.setItem("confirmationPopUpOpen", "false");
        ////this.spinner.hide();
        if (data.userId != null) {
          this.modalService.dismissAll();
          //Get Usercode form userCodeArray for logged in user
          this.userCodeArray = JSON.parse(
            localStorage.getItem("userCodeArray")
          );
          var usercodedetail = new Userconfirmationdetails();
          //if(user exits)
          if (this.saveuseryes == "yes") {
            if (this.userCodeArray != null) {
              if (this.userCodeArray.some((x) => x.userId == user.id)) {
                let userCoder = this.userCodeArray.find(
                  (x) => x.userId == user.id
                );
                //let usercodeget = this.userCodeArray.indexOf(userCoder)
                //remove that user object and add new
                this.userCodeArray.splice(
                  this.userCodeArray.indexOf(userCoder),
                  1
                );
                (usercodedetail.userId = data.userId),
                  (usercodedetail.isVerified = data.isVerified),
                  (usercodedetail.confirmationvalidtill =
                    data.confirmationValidTill);

                this.userCodeArray.push(usercodedetail);
                localStorage.setItem(
                  "userCodeArray",
                  JSON.stringify(this.userCodeArray)
                );
                this.setLoginRoute(user);
              } else {
                (usercodedetail.userId = data.userId),
                  (usercodedetail.isVerified = data.isVerified),
                  (usercodedetail.confirmationvalidtill =
                    data.confirmationValidTill);

                this.userCodeArray.push(usercodedetail);
                localStorage.setItem(
                  "userCodeArray",
                  JSON.stringify(this.userCodeArray)
                );
                this.setLoginRoute(user);
              }
            } else {
              this.userCodeArray = [];
              (usercodedetail.userId = data.userId),
                (usercodedetail.isVerified = data.isVerified),
                (usercodedetail.confirmationvalidtill =
                  data.confirmationValidTill);

              this.userCodeArray.push(usercodedetail);
              localStorage.setItem(
                "userCodeArray",
                JSON.stringify(this.userCodeArray)
              );

              this.setLoginRoute(user);
            }
          } else {
            this.setLoginRoute(user);
          }
        } else {
          this.toastr.error("Incorrect Confirmation Code");
          // this.error = "Confirmation code incorrect";
          this.loading = false;
          //this.spinner.hide();
        }
      });
  }

  forgotPassword() {
    this.isForgotPassword = true;
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

  resendcode() {
    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user != null) {
      this.userId = user.id;
    }
    this.authenticationService.resendcode(this.userId).subscribe();
    this.showresend = false;
    this.timer(5);
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

  loginWithMicrosoft() {
    console.log("sso", this.msalService.instance.getConfiguration().auth);
    this.msalService
      .loginPopup({
        scopes: ["openid", "profile", "email"],
        //prompt: "login",
      })
      .subscribe({
        next: (response: any) => {
          const idToken = response.idToken;

          this.authenticationService.authenticateSSO(idToken).subscribe({
            next: (result: any) => {
               this.authenticationService.setCurrentUser(result);
              // sessionStorage.setItem("currentUser", JSON.stringify(result));
              // var user = JSON.parse(sessionStorage.getItem("currentUser"));
              // sessionStorage.setItem('token', 'Bearer ' + user.token);

              localStorage.setItem("user", JSON.stringify(result));

              if (result.isUserAuthenticated) {
                // Same 2FA flow as normal login
                this.userCodeArray = JSON.parse(
                  localStorage.getItem("userCodeArray"),
                );
                
                
              } else {
                this.setLoginRoute(result);
              }
              this.setLoginRoute(result);
            },

            error: (err) => {
              if (err.error && err.error.errorText) {
                this.error = err.error.errorText;

                this.toastr.error(err.error.errorText);
                
              } else {
                this.error = "SSO Login failed";

                this.toastr.error("SSO Login failed");
              }
            },
          });
        },

        error: (err) => {
          console.log("Microsoft login failed", err);
          this.toastr.error("Microsoft Sign-in failed");
        },
      });
  }
}
