import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { User, Role } from './user';
import { NgForm } from '@angular/forms';
import { CompanyService } from '@app/pages/master/company/company.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from "@app/_services/user.service";
import { Company } from "@app/pages/master/company";
import { FormCanDeactivate } from "@app/_helpers/form-can-deactivate/form-can-deactivate";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-user",
  templateUrl: "user.component.html"
})
export class UserComponent implements OnInit {
  
  User: User = new User();
  allCompanyList: Company[];
  roleList: Role[];
  userstorage: any;
  isEdit = false;
  isAuthsigner: boolean;
  // users:any
  isConcessionaireUser: boolean;
  selectedCompany = [];
  dropdownSettings = {};
  countrycode = [
    {label: '+1',value:'+1'},
    {label: '+91',value:'+91'}
];
  

  constructor(public toastr: ToastrService, 
    private activatedRoute: ActivatedRoute, 
    private spinner: NgxSpinnerService, 
    private router: Router, 
    private CompanyService: CompanyService, private appURL: AppConfigService,
    private _userService: UserService) 
    { }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'companyName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.userstorage = JSON.parse(sessionStorage.getItem('currentUser'));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.userstorage.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }   
    //  var users = JSON.parse(sessionStorage.getItem("currentUser"));
    // this.users = users;
    //  if (this.users.rolename == "AuthSigner") {
    //   this.isAuthsigner = true;
    // } else if (this.users.rolename == "Concessionaire User") {
    //   this.isConcessionaireUser = true;
    // }
    const method = this.activatedRoute.snapshot.paramMap.get('method');
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.GetCompanyList();
    this.GetRoleList();
    if (method === 'e') {
      this.isEdit = true;
      this.GetUserById(id);
    }
    this.User.countryCode = "+1";

  }

  showlist() {
    this.router.navigate(["admin/user"]);
  }

  GetUserById(id) {
    this._userService.getUserById(id).subscribe((response: any) => {
      this.User = response;
      this.selectedCompany = response.company;
      if(this.User.userAuthenticationType == 1){
        this.User.userAuthenticationEmail = true;
        this.User.userAuthenticationSms = false;
        this.User.userAuthenticationBoth = false;
      }
      else if(this.User.userAuthenticationType == 2){
        this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = true;
        this.User.userAuthenticationBoth = false;
      }
      else if(this.User.userAuthenticationType == 3){
        this.User.userAuthenticationEmail = true;
        this.User.userAuthenticationSms = true;
        this.User.userAuthenticationBoth = true;
      }
     if(this.User.rolename == "AuthSigner" )
      {
        this.isAuthsigner = true;
        this.isConcessionaireUser=true
      }
      if(this.User.rolename == "Concessionaire User"){
        this.isConcessionaireUser=true
      }
    });
  }

  

  saveUser(formData: NgForm) {
    if (this.isEdit) {
      //this.spinner.show();
      this.User.company = this.selectedCompany;
      
        this._userService.editUser(this.User).subscribe(() => {
          //this.spinner.hide();
          this.toastr.success("User Updated Successfully!");
          this.router.navigate(['admin/user']);
        }, (error: any) => {
          //this.spinner.hide();
        }
        );
      
    } else {
      var usr = {
        id: formData.value.id,
        email: formData.value.email,
        adUserName: formData.value.adUserName,
        passwordHash: formData.value.password,
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        address: formData.value.address,
        roleId: formData.value.roleid,
        rolename: this.User.rolename,
        companyId: formData.value.companyid,
        token: "",
        isADAuthenticated: this.User.isADAuthenticated,
        isActive: this.User.isActive,
        company: this.selectedCompany,
        //isTSA:this.User.isTSA,
        newPassword:this.User.newPassword,
        isBadgeAudit:this.User.isBadgeAudit,
        isUserAuthenticated:this.User.isUserAuthenticated,
        userAuthenticationType:this.User.userAuthenticationType,
        phoneNumber:this.User.phoneNumber,
        countryCode:"+1",
        isTsaApprover:this.User.isTsaApprover,
        isTsaScheduler:this.User.isTsaScheduler,
        isAuditor: this.User.isAuditor,
        isPiCheckout: this.User.isPicheckout ,
        // createdBy: userForm.value.id == null || userForm.value.id == "" ? this.userid : (userForm.value.createdBy == null || userForm.value.createdBy == "" ? this.userid : userForm.value.createdBy),
        // dateCreated: userForm.value.id == null || userForm.value.id == "" ? new Date() : (userForm.value.dateCreated == null || userForm.value.dateCreated == "" ? new Date() : userForm.value.dateCreated),
        // updatedBy: this.userid,
        // dateUpdated: new Date()
      };
      //this.spinner.show();
     
        this._userService.register(usr).subscribe((response: Response) => {
          //this.spinner.hide();
          if (response.statusText == "Success") {
            this.toastr.success("User Added Successfully!");
            this.router.navigate(["admin/user"]);
          }
          else if (response.statusText == "ALREADY_TAKEN") {
            this.toastr.warning("Email already taken! Try with different Username");
          }
          else if (response.statusText == "USERNAME_ALREADY_TAKEN") {
            this.toastr.warning("User name already taken! Try with different Username");
  
          }
          else if (response.statusText == "USER_Authentication") {
            this.toastr.warning("elect at least one user authenticatio type");
  
          }
          else {
            this.toastr.error(response.statusText);
          }
          
  
        },
        error=>{
          this.toastr.error(error.message);
        });
      
    }
  }

 

  public GetCompanyList() {
    //this.spinner.show();
    this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
      this.allCompanyList = response;
      //this.spinner.hide();
    }, (error:any)=> {
      //this.spinner.hide();
      console.log("error list");
    });
  }

  public GetRoleList() {
    //this.spinner.show();
    this._userService.GetAllRolesList().subscribe((response: Role[]) => {
      this.roleList = response.filter(x => x.name != 'Superadmin');
      //this.spinner.hide();
    }, (error:any)=> {
      console.log("error list");
      //this.spinner.hide();
    });
  }

  // onRoleChange(roleId) {
   
  //   this.User.rolename = this.roleList.filter(x => x.id == roleId)[0].name
  //   if(this.User.rolename == "AuthSigner"){
  //     this.User.isBadgeAudit = true;
  //     this.User.isAuditor = true;
  //     this.User.isPicheckout =true;
  //     this.isAuthsigner = true;
  //   }else{
  //     this.User.isBadgeAudit = false;
  //      this.User.isAuditor = false;
  //      this.User.isPicheckout =false;
  //     this.isAuthsigner = false;
  //     // this.isConcessionaireUser=false;
  //   }
  //   if(this.User.rolename == "Concessionaire User"){
  //     this.User.isAuditor = true;
  //     this.User.isPicheckout =true;
  //     this.isConcessionaireUser=true
  //   }else{
  //      this.User.isAuditor = false;
  //      this.User.isPicheckout =false;
  //      this.isConcessionaireUser=false;
  //   }
  //   if(this.User.rolename == "TSA User"){
  //     this.User.isTsaApprover = true;
  //   }else{
  //     this.User.isTsaApprover = false;
  //   }
  // }
onRoleChange(roleId) {
  this.User.rolename = this.roleList.filter(x => x.id == roleId)[0].name;

  // Reset all visibility flags
  this.isAuthsigner = false;
  this.isConcessionaireUser = false;

  // AuthSigner Role
  if (this.User.rolename === "AuthSigner") {
    this.User.isBadgeAudit = true;
    this.User.isAuditor = true;
    this.User.isPicheckout = true;
    // this.User.isTsaApprover = false;
    this.isAuthsigner = true;

  } 
  // Concessionaire User Role
  else if (this.User.rolename === "Concessionaire User") {
    this.User.isBadgeAudit = false;
    this.User.isAuditor = true;
    this.User.isPicheckout = true;
    this.User.isTsaApprover = false;
    this.isConcessionaireUser = true;

  } 
  // TSA User Role
  else if (this.User.rolename === "TSA User") {
    this.User.isBadgeAudit = false;
    this.User.isAuditor = false;
    this.User.isPicheckout = false;
    this.User.isTsaApprover = true;

  } 
  // All other roles
  else {
    this.User.isBadgeAudit = false;
    this.User.isAuditor = false;
    this.User.isPicheckout = false;
    this.User.isTsaApprover = false;
  }
}


  CheckBoxChange(event) {
    this.User.isADAuthenticated = event.target.checked;
    if(!this.User.isADAuthenticated)
    this.User.adUserName="";
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
      
      if(this.User.userAuthenticationSms == event.target.checked){
        this.User.userAuthenticationType = 3;
      }else{
        this.User.userAuthenticationType = 1;
      }
    } else{
      this.User.userAuthenticationType  = 2;
      this.User.userAuthenticationSms = true;
      this.User.userAuthenticationEmail = false;
      this.User.isUserAuthenticated = true;
    }

  }

  UserCheckBoxChangeSms(event){
    this.User.userAuthenticationSms = event.target.checked;
    if(event.target.checked){
      this.User.userAuthenticationSms = true;
      this.User.isUserAuthenticated = true;
     
      if(this.User.userAuthenticationEmail == event.target.checked){
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
  
  UserCheckBoxChange(event, param) {
    this.User.isUserAuthenticated = event.target.checked;
    this.User.userAuthenticationType = param

    if(this.User.userAuthenticationType == 1){
      if(event.target.checked){
        this.User.userAuthenticationEmail = true;
        // this.User.userAuthenticationSms = false;
        // this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      } else{
        this.User.userAuthenticationType = 2;
       // this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = true;
        //this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      }
      
    }
    else if(this.User.userAuthenticationType == 2){
      if(event.target.checked){
        //this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = true;
        //this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      }else{
        this.User.userAuthenticationType = 1;
        this.User.userAuthenticationEmail = true;
       // this.User.userAuthenticationSms = false;
       // this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      }
      
    }
    // else if(this.User.userAuthenticationType == 3){
    //   if(event.target.checked){
    //     this.User.userAuthenticationEmail = true;
    //   this.User.userAuthenticationSms = true;
    //   this.User.userAuthenticationBoth = true;
    //   this.User.isUserAuthenticated = true;
    //   }else{
    //     this.User.userAuthenticationType = 1;
    //     this.User.userAuthenticationEmail = true;
    //     this.User.userAuthenticationSms = false;
    //     this.User.userAuthenticationBoth = false;
    //     this.User.isUserAuthenticated = true;
    //   }
      
    // }
      else{
        this.User.userAuthenticationEmail = false;
        this.User.userAuthenticationSms = false;
        this.User.userAuthenticationBoth = false;
        this.User.isUserAuthenticated = true;
      }    
  }
checkBoxChangePICheckout(event) {
  this.User.isPicheckout = event.target.checked;
}

checkBoxChangePIAudit(event) {
  this.User.isAuditor = event.target.checked;
}

  CheckBoxChangeBadgeAudit(event) {
    this.User.isBadgeAudit = event.target.checked;
    
  }

  checkBoxChangeTsaUser(event){
    this.User.isTsaApprover = event.target.checked
  }
  checkBoxChangeTsaUserForScheduler(event){
    this.User.isTsaScheduler = event.target.checked
  }

  tsaCheckBoxChange(event) {
  //  this.User.isTSA = event.target.checked;   
  }

  activeCheckBoxChange(event) {
    this.User.isActive = event.target.checked;
  }


  onItemSelect(item: any) {
    
    // console.log(item);
  }
  onSelectAll(items: any) {
    
    // console.log(items);
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
