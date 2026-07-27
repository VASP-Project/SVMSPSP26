import { Component, OnInit } from '@angular/core';
import { Incendiaries, IncendiariesList } from './incendiaries';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharpObjectsService } from '../sharp-objects-list/sharpObject.service';
import { Router } from '@angular/router';
import { IncendiariesService } from './incendiaries.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-incendiaries-list',
  templateUrl: './incendiaries-list.component.html',
  styleUrls: ['./incendiaries-list.component.scss']
})
export class IncendiariesListComponent implements OnInit {
  incendiaries: Incendiaries[];
    user: any;
    dtOptions: DataTables.Settings = {};
    incendiariesList: IncendiariesList[];
    dtTrigger: Subject<any> = new Subject();
    constructor(
      private toastr: ToastrService,
      private spinner: NgxSpinnerService,
      private incendiariesService: IncendiariesService, private appURL: AppConfigService,
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
      this.GetIncendiariesList();
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        stateSave: true,
      stateDuration: -1,
      };
    }
  
    public GetIncendiariesList() {
      //this.spinner.show();
      this.incendiariesService
        .GetIncendiariesList()
        .subscribe((response: IncendiariesList[]) => {
          this.incendiaries = response;
          this.dtTrigger.next();
          //this.spinner.hide();
        });
    }
  
    viewIncendiaries(id: number) {
      let navigationExtras: any = {
        queryParams: {
          incendId: id,
          isEdit: 1,
          isView: 1,
        },
      };
      this.router.navigate(["/admin/incendiariedEdit"], navigationExtras);
    }
  
    DeleteIncendiariesById(id) {
      var ans = confirm("Are you sure you want to delete this Record?");
      if (ans == true) {
        //this.spinner.show();
        this.incendiariesService
          .DeleteIncendiariesById(id)
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
            this.GetIncendiariesList();
          });
      }
    }
  }
