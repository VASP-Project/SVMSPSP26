import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../user/user';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  User: User = new User();
  isEdit = false;
  userstorage: any;
  olduserAuthentication:boolean = false;
  userAuthenticationType:number;

  constructor(public toastr: ToastrService, 
    private activatedRoute: ActivatedRoute, 
    private _userService: UserService,
    private router: Router,
    private loc :Location) { }

  ngOnInit(): void {
    this.userstorage = JSON.parse(sessionStorage.getItem('currentUser'));
    const method = this.activatedRoute.snapshot.paramMap.get('method');
   const idsf = this.activatedRoute.snapshot.paramMap.get('id');
    const id = this.userstorage.id;
      this.isEdit = true;
      this.GetUserById(id);
    

  }

  GetUserById(id) {
    this._userService.getUserById(id).subscribe((response: any) => {
      this.User = response;
      this.olduserAuthentication = this.User.isUserAuthenticated;
      //this.selectedCompany = response.company;
      if(this.User.userAuthenticationType == 1){
        this.User.userAuthenticationEmail = true;
        this.User.userAuthenticationSms = false;
        //this.User.userAuthenticationBoth = false;
      }
      else if(this.User.userAuthenticationType == 2){
        this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = true;
        //this.User.userAuthenticationBoth = false;
      }
      else if(this.User.userAuthenticationType == 3){
        this.User.userAuthenticationEmail = true;
        this.User.userAuthenticationSms = true;
        //this.User.userAuthenticationBoth = true;
      }
    });
  }

  back() {
   // this.router.navigate(['/admin/dashboard']);
    this.loc.back();
  }

  saveUser(formData: NgForm) {
    if (this.isEdit) {
      //this.spinner.show();
      //this.User.company = this.selectedCompany;
      
        this._userService.editUser(this.User).subscribe(() => {
          //this.spinner.hide();
          this.toastr.success("Profile Updated Successfully!");
          //this.router.navigate(['admin/dashboard']);
          this.loc.back();
        }, (error: any) => {
          //this.spinner.hide();
        }
        );
      
    }
  }

  AuthenticationCheckBoxChange(event){
    if(this.User.isUserAuthenticated = event.target.checked){
      
      this.User.userAuthenticationEmail = true;
      this.User.userAuthenticationType = 1
   
    }
  }
  UserCheckBoxChangeEmail(event){
    this.User.userAuthenticationEmail = event.target.checked;
    if(event.target.checked){
      this.User.userAuthenticationEmail = true;
      this.User.isUserAuthenticated = true;
      
      if(this.User.userAuthenticationSms == true){
        this.User.userAuthenticationType = 3;
      }else{
        this.User.userAuthenticationType = 1;
      }
    } else{
      this.User.userAuthenticationType  = 2;
      this.User.userAuthenticationSms = true;
      this.User.userAuthenticationEmail=false;
      this.User.isUserAuthenticated = true;
    }

  }

  UserCheckBoxChangeSms(event){
    this.User.userAuthenticationSms = event.target.checked;
    if(event.target.checked){
      this.User.userAuthenticationSms = true;
      this.User.isUserAuthenticated = true;
     
      if(this.User.userAuthenticationEmail == true){
        this.User.userAuthenticationType = 3;
      }else{
        this.User.userAuthenticationType = 2;
      }
    }else{
      this.User.userAuthenticationType  = 1;
      this.User.userAuthenticationEmail = true;
      this.User.userAuthenticationSms = false;
      this.User.isUserAuthenticated = true;
    }
  }

  UserCheckBoxChange(event,param) {

    this.User.isUserAuthenticated = event.target.checked;
   // this.userAuthenticationType = param;
    // this.User.userAuthenticationSms = event.target.checked;
    // this.User.userAuthenticationEmail = event.target.checked;

    if(this.User.userAuthenticationSms == true && this.User.userAuthenticationEmail == true){
      this.User.userAuthenticationType = 3
    }else if(this.User.userAuthenticationSms == true){
      this.User.userAuthenticationType = 2
    }else if(this.User.userAuthenticationEmail == true){
      this.User.userAuthenticationType = 1
    }else{
      this.User.userAuthenticationType = 1
      this.User.userAuthenticationEmail = true
    }
    
    if(this.User.userAuthenticationType == 1){
      if(event.target.checked){
        this.User.userAuthenticationEmail = true;
        this.User.isUserAuthenticated = true;
      } else{
        this.userAuthenticationType = 2;
        this.User.userAuthenticationSms = true;
        this.User.isUserAuthenticated = true;
      }
      
    }
    else if(this.User.userAuthenticationType == 2){
      if(event.target.checked){
        this.User.userAuthenticationSms = true;
        this.User.isUserAuthenticated = true;
      }else{
        this.userAuthenticationType = 1;
        this.User.userAuthenticationEmail = true;
        this.User.isUserAuthenticated = true;
      }
      
    }
    else if(this.User.userAuthenticationType == 3){
      this.User.userAuthenticationEmail = true;
      this.User.userAuthenticationSms = true;
      this.User.isUserAuthenticated = true;
      
    }
      else{
        this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = false;
        this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      } 
  }

  


  formatUserPhoneNumber() {
    if( this.User.phoneNumber != null){
      let valLength = this.User.phoneNumber.length;
      if (valLength == 1) {
        this.User.phoneNumber = "(" + this.User.phoneNumber;
      }
      if (valLength == 4) {
        this.User.phoneNumber = this.User.phoneNumber + ") ";
      }
      if (valLength == 9) {
        this.User.phoneNumber = this.User.phoneNumber + "-";
      }
   
    }
  }

}
