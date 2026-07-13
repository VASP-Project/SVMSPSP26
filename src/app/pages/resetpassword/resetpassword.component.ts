import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { ResetPasswordModel } from './resetpassword.model';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  model: any = {};
  userid = '';
  code = '';
  currentuserid: string

  constructor(private _loginService: AuthenticationService, private router: Router,
    private route: ActivatedRoute, private _fb: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService) {
  }

  forgetpass: ResetPasswordModel = new ResetPasswordModel();
  UserName: string = "";
  Token: string = "";

  ngOnInit() {
    // this.userid = this.route.snapshot.paramMap.get('userId');
    // this.code = this.route.snapshot.paramMap.get('code');
    // this.model.code = this.code;
    // this.model.userid = this.userid;
    let param = this.route.snapshot.paramMap.get('userId') || '{}';
    let split = param.split('&&');

    //this.model.userid = this.route.snapshot.paramMap.get('userId') || '{}';
    //this.model.code = this.route.snapshot.fragment;
    this.model.userid = split[0];
    this.model.code =split[1];
    // debugger;
  }

  onSubbmit() {
    if (this.model.password === this.model.confirmpassword) {
      //this.spinner.show();
      console.log("code");
      // console.log(this.model.code);
      this._loginService.resetpassword(this.model.userid, this.model.code, this.model.password, this.model.confirmpassword)
        .subscribe((response: any) => {
          //this.spinner.hide();
          if (response != null) {
            let result = '';
            try {
              result = response.errorText;
            } catch { }
            if (result === 'Error') {
              this.toastr.error('Something went wrong while Reseting password');
            } else if (result === 'Success') {
              this.toastr.success('Password changed');
              this.router.navigate(["authentication"]);
            } else if(result === "BadError"){
              this.toastr.error('Password already reseted using this link.');
            } 
            else {
              this.toastr.error('Error in resetting password. Create restet link again');
            }
          }
        }, (error:any) => {
          //this.spinner.hide();
        }
        );
    }
    else {
      //this.spinner.hide();
      this.toastr.error("Password & Confirm password should be same");
    }


  }

  onSubbmitLogin() {
    this.router.navigate(["authentication"]);
  }

}
