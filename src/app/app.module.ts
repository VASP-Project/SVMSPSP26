import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  CommonModule,
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FullComponent } from "./layouts/full/full.component";
import { NavigationComponent } from "./shared/header/navigation.component";
import { SidebarComponent } from "./shared/sidebar/sidebar.component";
import { Approutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SpinnerComponent } from "./shared/spinner.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { LoginComponent } from "./authentication/login/login.component";
import { NgxSpinner, NgxSpinnerModule } from "ngx-spinner";
import { SpinnerHttpInterceptor } from "./_helpers/SpinnerHttpInterceptor";
import { JwtInterceptor } from "./_helpers";
import { ToastrModule } from "ngx-toastr";
import { AppConfigService } from "./_services/appconfigservice ";
import { BreadcrumbComponent } from "./shared/breadcrumb/breadcrumb.component";
import { BlankComponent } from "./layouts/blank/blank.component";
import { DataTablesModule } from "angular-datatables";
import { ResetpasswordComponent } from "./pages/resetpassword/resetpassword.component";
import { ForgotpasswordComponent } from "./pages/forgotpassword/forgotpassword.component";
import { SignaturePadModule } from "angular2-signaturepad";
import { ChartsModule } from "ng2-charts";
import { NgSelectModule } from "@ng-select/ng-select";
import { AuthenticationService } from "./_services";
import { BnNgIdleService } from "bn-ng-idle"; // import bn-ng-idle service
import { NgxPaginationModule } from "ngx-pagination";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BadgeauditdashboardComponent } from "./pages/pendingbadgeapplicants/badgeauditdashboard/badgeauditdashboard.component";
import { NgxPrintModule } from "ngx-print";
import { SmscouComponent } from "./pages/smscou/smscou.component";
import { SmsnovComponent } from "./pages/smsnov/smsnov.component";
import { LinkexpireComponent } from "./authentication/linkexpire/linkexpire.component";
import { MsalService, MSAL_INSTANCE, MsalInterceptor, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalInterceptorConfiguration, MsalModule } from "@azure/msal-angular";
import { msalServiceFactory } from "./msal-service.factory";
import { InteractionType } from "@azure/msal-browser";
import { msalConfig, msalInstance } from "./msal.config";

import { OktaAuthModule, OKTA_CONFIG, OktaAuthStateService, OKTA_AUTH } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import { oktaAuthFactory } from "./OktaAuthFactory";
import { AzureAuthFactory } from "./AzureAuthFactory";

//Use APP_INITIALIZER to ensure OktaAuth and AppConfigService are initialized before the app starts
export function initializerConfigFn(configService: AppConfigService): () => Promise<void> {
  // This ensures that AppConfig is loaded before the rest of the app is initialized
  return () => configService.loadAppConfig();
}

const guardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Popup,  // Use popup for login
  authRequest: {
    scopes: ['user.read', 'mail.read'],  // Request specific scopes for login
  },
};

const interceptorConfig: MsalInterceptorConfiguration = {
  interactionType: InteractionType.Popup, // Define how the interaction should happen (e.g., Popup)
  protectedResourceMap: new Map([
    ['https://graph.microsoft.com/v1.0/me', ['user.read']], // Protect API requests with specific scopes
  ]),
};
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20,
};

export function initializeMsal(
    msalService: MsalService
) {
    return () => msalService.instance.initialize();
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BreadcrumbComponent,
    BlankComponent,
    ResetpasswordComponent,
    ForgotpasswordComponent,
    BadgeauditdashboardComponent,
    SmscouComponent,
    SmsnovComponent,
    LinkexpireComponent,
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    OktaAuthModule,
    NgbModule,
    NgxPrintModule,
    DataTablesModule.forRoot(),
    RouterModule.forRoot(Approutes, {
      useHash: false,
      relativeLinkResolution: "legacy",
    }),
    PerfectScrollbarModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    SignaturePadModule,
    ChartsModule,
    NgxDatatableModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
      closeButton: true,
    }),
    MsalModule.forRoot(msalInstance, guardConfig, interceptorConfig),
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializerConfigFn,
      deps: [AppConfigService],
      multi: true,
    },
    {
      provide: OktaAuth,
      useFactory: oktaAuthFactory,
      deps: [AppConfigService]
    },
    {
      provide: OKTA_AUTH, 
      useFactory: oktaAuthFactory,
      deps: [AppConfigService]
    },
    {
      provide: OKTA_CONFIG,
      useFactory: oktaAuthFactory,
      deps: [AppConfigService],
    },    
    AuthenticationService,
    OktaAuthStateService,
    BnNgIdleService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerHttpInterceptor,
      multi: true,
    },
    //FOR normal JWT
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    // {
    //   provide: MsalService,
    //   useFactory: msalServiceFactory,
    //   deps: [Location], // Dependency Injection for Location
    // },
    {
      provide: MSAL_INSTANCE,
      useValue: msalInstance,  // Provide the MSAL instance
    },
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: AzureAuthFactory,      
    //   deps: [AppConfigService]
    //   //useValue: msalInstance,  // Provide the MSAL instance
    // },
    {
  provide: APP_INITIALIZER,
  useFactory: initializeMsal,
  deps: [MsalService],
  multi: true
},
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: 'popup',
        authRequest: {
          scopes: ['user.read'],
        },
      } as MsalGuardConfiguration,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useValue: {
        interactionType: 'popup',
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['user.read']],
        ]),
      } as MsalInterceptorConfiguration,
    },
    MsalService,
    MsalGuard,
    // MsalBroadcastService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true,
    // },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
