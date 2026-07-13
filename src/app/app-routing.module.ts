import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { FullComponent } from './layouts/full/full.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { AuthGuard } from './_helpers';
import { SmscouComponent } from './pages/smscou/smscou.component';
import { SmsnovComponent } from './pages/smsnov/smsnov.component';
import { MsalGuard } from '@azure/msal-angular';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { CallbackComponent } from './authentication/callback/callback.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/authentication', pathMatch: 'full' },
      { path: 'authentication', redirectTo: '/authentication', pathMatch: 'full' },     
      {
        path: 'forgotpassword',
        component: ForgotpasswordComponent,
      },
      { path: 'resetpassword/:userId', component: ResetpasswordComponent, data: { breadcrumb: 'Reset Password' } }, //removed canactivate authguard
      {
        path: "admin",
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
        canActivate: [AuthGuard]
        //canActivate: [MsalGuard], // Protect this route
      },
      // {
      //   path: 'login',
      //   loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      // },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      // {
      //   path: 'about',
      //   loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      // },
      // {
      //   path: 'component',
      //   loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      // }
    ]
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule)
      },
      {path:'M1/:id/:cid', component:SmsnovComponent},
      {path:'M8/:id/:cid', component:SmscouComponent},
      { path: 'callback', component: CallbackComponent  },
      // {
      //   path: 'authentication/callback',
      //   component: OktaCallbackComponent // Okta callback handler
      // }
      // {path:'errorpage', component:ErrorpageComponent},
      // {path:'urlerrorpage', component:UrlerrorpageComponent},
      // {path:'linkexppage',component:LinkexpirepageComponent}
    ]
  },
  {
    path: '**',
    redirectTo: '/authentication'
  }
];
