import { Routes } from '@angular/router';
import { NotfoundComponent } from '../404/not-found.component';
import { LockComponent } from '../lock/lock.component';
import { LoginComponent } from './login.component';
import { SmscouComponent } from '@app/pages/smscou/smscou.component';
import { SmsnovComponent } from '@app/pages/smsnov/smsnov.component';
import { LinkexpireComponent } from '../linkexpire/linkexpire.component';
import { CallbackComponent } from '../callback/callback.component';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { AuthCallbackComponent } from './authentication/auth-callback/auth-callback.component';

export const LoginRoutes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "404",
    component: NotfoundComponent,
  },
  {
    path: "expire",
    component: LinkexpireComponent,
  },
  // {
  //   path: 'lock',
  //   component: LockComponent
  // },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "auth/callback",
    component: AuthCallbackComponent,
  },
  //{ path: 'callback', component: CallbackComponent  },
];
  