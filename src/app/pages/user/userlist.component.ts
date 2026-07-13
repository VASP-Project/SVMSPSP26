import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserList } from './user';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@app/_services/user.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss'],
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class UserlistComponent implements OnInit {
  userList: UserList[];
  user = new UserList();
  dtOptions: any;
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  loggedInUserId:string ="";
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private _userService: UserService,private appURL: AppConfigService,) { }

  ngOnInit() {

    var user = JSON.parse(sessionStorage.getItem('currentUser'));

    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    this.loggedInUserId = user.id;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      retrieve: true,
    };
    this.GetUserList();
    this.onResize();
  }

  identify(index, item) {
    return item.email;
  }

  onResize() {
    var navbar = document.getElementsByClassName('table')[0];
    if (window.innerWidth < 993) {// && !this.isCollapsed) {
      navbar.classList.add('table-responsive');
    } else {
      navbar.classList.remove('table-responsive');
    }
  }
  GetUserList() {
    // this.spinner.show();
    this._userService.GetUserList().subscribe((response: UserList[]) => {
      this.userList = response;
      this.dtTrigger.next();
      //this.spinner.hide();
    }, (error:any)=> {
      //this.spinner.hide();
      console.log("error list");
    });
  }

  addUser() {
    const method = 'a';
    this.router.navigate(["admin/useradd", method, 'new']);
  }


  editUser(id) {
    const method = 'e';
    this.router.navigate(['admin/useradd', method, id]);
  }

  DeleteUser(id) {
    var ans = confirm("Do you want to delete User?");
    if (ans == true) {
      //this.spinner.show()
      this._userService.DeleteUserByid(id).subscribe((response: Response) => {
        //this.spinner.hide();
        this.toastr.success("User Deleted Successfully");
        $('#dt1').DataTable().destroy();
        this.GetUserList();
      }, (error:any)=> {
        //this.spinner.hide();
        console.log("error list");
      });
    }
  }

  ActivateUser(id:any) {
    var ans = confirm("Do you want to activate User?");
    if (ans == true) {
      //this.spinner.show()
      this._userService.activateUserByid(id).subscribe((response: Response) => {
        //this.spinner.hide();
        this.toastr.success("User Activated Successfully");
        $('#dt1').DataTable().destroy();
        this.GetUserList();
      }, (error:any)=> {
        //this.spinner.hide();
        console.log("error list");
      });
    }
  }
}
