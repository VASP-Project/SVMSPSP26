import { Component, OnInit } from '@angular/core';
import { changePasswordModel } from './changepassword.model';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  ChangePasswordModel = new changePasswordModel();
  changePassword: changePasswordModel[] = [];
  user: any;

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private _userService: UserService) { }


  ngOnInit() {
    // const navbar = document.getElementsByTagName("nav")[0];   
    // navbar.classList.add("navbar-transparent");
    // navbar.classList.remove("bg-white");
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  changePasswords() {
    if (this.ChangePasswordModel.oldPassword == this.ChangePasswordModel.newPassword) {
      this.toastr.error("Your new password must be different from your previous password");
    }
    else if (this.ChangePasswordModel.newPassword != this.ChangePasswordModel.reEnterNewPassword) {
      this.toastr.error("Re-entered Password not matched with Password");
    }  
    else {
      //this.spinner.show();
      var uu = JSON.parse(sessionStorage.getItem('currentUser'));
      this.ChangePasswordModel.userId = this.user.id
      this._userService.changePassword(this.ChangePasswordModel).subscribe(
        (response: any) => {
          if (response != null) {
            var result = ""
            try {
              result = response.result
            }
            catch{
            }
            if (result == 'Error') {
              this.toastr.error("You have entered the wrong current password");
              //this.spinner.hide();
            }
            else if (result == 'Success') {
              sessionStorage.removeItem('currentUser');
              sessionStorage.removeItem('token');
              this.router.navigate(['/authentication'])
              //this.spinner.hide();
              this.toastr.success("Password changed Successfully. Please login again");
            }
            else {
              //this.spinner.hide();
              this.toastr.info(result);
            }
          }
        }
      );
    }
  }

  back() {
    this.router.navigate(['/admin/dashboard']);
  }
}
