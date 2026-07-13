import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, sample } from 'rxjs/operators';

import { User } from '../pages/user/user';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './appconfigservice ';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SystemLog } from '@app/authentication/login/systemlogs';
import { OKTA_CONFIG } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  public loggedIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  private currentUserSubject: BehaviorSubject<User>;
  private curusername = new BehaviorSubject<string>(this.setUsername());
  gnBaseURL;

  // constructor(@Inject(OKTA_CONFIG) private oktaConfig: { oktaAuth: OktaAuth }, private http: HttpClient, private appURL: AppConfigService,private spinner: NgxSpinnerService,private router: Router) {

  //     this.currentUserSubject = new BehaviorSubject<User>(
  //         JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
  // }

  constructor(
    private http: HttpClient,
    private appURL: AppConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(sessionStorage.getItem("currentUser") || "{}"),
    );
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public addSystemlog(userId: string, loginuser: string) {
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http.get<SystemLog>(
      this.gnBaseURL + "Account/AddSystemLog/" + userId + "/" + loginuser,
    );
  }

  login(Email: string, PasswordHash: string) {
    console.log("login");
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http
      .post<any>(this.gnBaseURL + "Account/authenticate", {
        Email,
        PasswordHash,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          sessionStorage.setItem("token", "Bearer " + user.token);

          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return user;
        }),
      );
  }

  loginSSO(Email: string, PasswordHash: string) {
    console.log("login");
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http
      .post<any>(this.gnBaseURL + "Account/authenticatesso", {
        Email,
        PasswordHash,
      })
      .pipe(
        map((user) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem("currentUser", JSON.stringify(user));
          sessionStorage.setItem("token", "Bearer " + user.token);

          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return user;
        }),
      );
  }

  confirmationcode(userId: string, code: string) {
    console.log("login");
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http.get<any>(
      this.gnBaseURL + "Account/authenticatecode/" + userId + "/" + code,
    );
  }

  resendcode(userId: string) {
    console.log("login");
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http.get<any>(this.gnBaseURL + "Account/resendcode/" + userId);
  }

  logout() {
    //     var uservalue = JSON.parse(sessionStorage.getItem("currentUser"));
    //    this.addSystemlog(uservalue.id,"logout");
    // remove user from local storage to log user out
    this.loggedIn.next(false);
    this.curusername.next("");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    let user = new User();
    this.currentUserSubject.next(user);
  }

  get getcurrentusername() {
    return this.curusername.asObservable();
  }

  private tokenAvailable(): boolean {
    return !!sessionStorage.getItem("token");
  }

  forgotPassword(username: string) {
    this.gnBaseURL = this.appURL.getServerUrl();

    username = username.toLowerCase();
    let headers = new HttpHeaders();
    headers = headers.append("noToken", "noToken");
    headers = headers.append("Content-Type", "application/json");

    return this.http
      .post<any>(
        this.gnBaseURL + "Account/ForgotPassword",
        { Email: username },
        { headers: headers },
      )
      .pipe(
        map((a) => {
          return a;
        }),
      );
  }

  resetpassword(
    userid: string,
    code: string,
    password: string,
    confirmpassword: string,
  ) {
    this.gnBaseURL = this.appURL.getServerUrl();
    let headers = new HttpHeaders();
    headers = headers.append("noToken", "noToken");
    headers = headers.append("Content-Type", "application/json");
    return this.http
      .post<any>(
        this.gnBaseURL + "Account/updatepassword",
        {
          userId: userid,
          password: password,
          confirmPassword: confirmpassword,
          code: code,
        },
        { headers: headers },
      )
      .pipe(
        map((a) => {
          return a;
        }),
      );
  }

  private setUsername(): string {
    if (this.loggedIn.value) {
      var uu = JSON.parse(sessionStorage.getItem("currentUser"));
      if (uu != null) {
        let UName = uu.name;
        if (UName == null) {
          return "";
        } else {
          return uu.name;
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  authenticateSSO(token: string): Observable<any> {
    this.gnBaseURL = this.appURL.getServerUrl();
    return this.http.post(`${this.gnBaseURL}Account/authenticatessonew`, {
      token: token,
    });
  }

  public setCurrentUser(user: User) {
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    sessionStorage.setItem("token", "Bearer " + user.token);

    this.currentUserSubject.next(user);
    this.loggedIn.next(true);
  }
}