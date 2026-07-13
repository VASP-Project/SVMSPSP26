import { Component, OnInit } from '@angular/core';
import { Disabling, DisablingList } from './disabling';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { IncendiariesService } from '../incendiaries-list/incendiaries.service';
import { Router } from '@angular/router';
import { DisablingService } from './disabling.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-disabling-list',
  templateUrl: './disabling-list.component.html',
  styleUrls: ['./disabling-list.component.scss']
})
export class DisablingListComponent implements OnInit {
  disabling: Disabling[];
      user: any;
      dtOptions: DataTables.Settings = {};
      disablingList: DisablingList[];
      dtTrigger: Subject<any> = new Subject();
      constructor(
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private disablingService: DisablingService, private appURL: AppConfigService,
        private router: Router
      ) {}
    
      ngOnInit() {
        //Get user form local storage
        this.user = JSON.parse(sessionStorage.getItem("currentUser"));
        if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
          if (!this.user.passwordReseted) {
            //this.spinner.hide();
            this.router.navigate(['admin/changepassword']);
          }
        }    
        this.dtOptions = {
          pagingType: "full_numbers",
          pageLength: 10,
        };
        this.GetDisablingList();
      }
    
      public GetDisablingList() {
        //this.spinner.show();
        this.disablingService
          .GetDisablingList()
          .subscribe((response: DisablingList[]) => {
            this.disabling = response;
            this.dtTrigger.next();
            //this.spinner.hide();
          });
      }
    
      viewDisabling(id: number) {
        let navigationExtras: any = {
          queryParams: {
            disableId: id,
            isEdit: 1,
            isView: 1,
          },
        };
        this.router.navigate(["/admin/disablingEdit"], navigationExtras);
      }
    
      DeleteDisablingById(id) {
        var ans = confirm("Are you sure you want to delete this Record?");
        if (ans == true) {
          //this.spinner.show();
          this.disablingService
            .DeleteDisablingById(id)
            .subscribe((response: Response) => {
              if (response.statusText == "Fail") {
                this.toastr.success(
                  "There was some error deleting the record. Please try again later"
                );
              } else if (response.statusText === "Exists") {
                this.toastr.error(
                  "Record not deleted. It is attached to a Incident record"
                );
              } else {
                this.toastr.success("Record deleted successfully");
              }
              //this.spinner.hide();
              $("#dt1").DataTable().destroy();
              this.GetDisablingList();
            });
        }
      }
    }
