import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BadgeReportSettings,BadgeReportEmailSettings, BadgeReportList, DataOutputModel } from '../badgereportsettings';
import { BadgeReportSettingsService } from './badgereport.service'
import { NgForm } from '@angular/forms';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';


@Component({
  selector: 'app-badge-report-settings-list',
  templateUrl: './badge-report-settings-list.component.html',
  styleUrls: ['./badge-report-settings-list.component.scss']
})
export class BadgeReportSettingsListComponent implements OnInit {

  badgereportemailsettings: BadgeReportEmailSettings[];
  badgereportsettings = new BadgeReportSettings();
  user:any;
  queryParam: QueryStringParameters = new QueryStringParameters();
  badgeReportList : BadgeReportList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, 
      private badgeReportSettService: BadgeReportSettingsService, private appURL: AppConfigService,
      private router: Router) { }

  ngOnInit() {
    this.queryParam.pageSize = 10
    this.queryParam.pageNumber = 1
    this.queryParam.maxPageSize = 10
    this.config = {
    currentPage: 1,
    itemsPerPage: this.queryParam.pageSize
};
              //Get user form local storage
     this.user = JSON.parse(sessionStorage.getItem("currentUser"));
     if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
     this.GetBadgeReportSettings();
      this.GetBadgeReportEmailSettingsList();
      this.dtOptions = {
          pagingType: 'full_numbers',
          pageLength: 10,
          stateSave: true,
      stateDuration: -1,
      };
     
  }


  private GetBadgeReportSettings() {
    
    this.badgeReportSettService.GetBadgeReportSettings().subscribe((response: BadgeReportSettings) => {
      
        this.badgereportsettings = response
       
    });

}


  onClick(id: string, type: string) {
      this.router.navigate(['/badgereportaddedit', id, type])
  }


  public GetBadgeReportEmailSettingsList() {
      
      this.badgeReportSettService.GetBadgeReportEmailSettingsList().subscribe((response: BadgeReportEmailSettings[]) => {
          this.badgereportemailsettings = response;
          this.dtTrigger.next();
          
      });
  }
  onSortClick(event, columnname) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.queryParam.orderBy = columnname
    this.queryParam.orderDir = this.sortDir == -1 ? "desc" : "asc"
    this.GetBadgeReportEmailSettingsListNew();
  }

  public GetBadgeReportEmailSettingsListNew() {
   
    this.badgeReportSettService.GetBadgeReportEmailSettingsListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.badgeReportList = response.items;
      this.pageHeaders = response.paging
      
    }, (error: any) => {
      
      console.log("error list");
      
      //this.spinner.hide();
  });
  }
  

  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    this.GetBadgeReportEmailSettingsListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetBadgeReportEmailSettingsListNew();
  }

  searchtable(){
    this.GetBadgeReportEmailSettingsListNew();
  }

deleteBadgeReportEmailSettings(id) {
      var ans = confirm("Are you sure you want to delete this Email?");
      if (ans == true) {
          
          this.badgeReportSettService.DeleteBadgeReportEmailSettingsById(id).subscribe((response: Response) => {
              if (response.statusText == "Fail") {
                  this.toastr.success('There was some error deleting the record. Please try again later');
              } else if (response.statusText === "Exists") {
                
              }
              else {
                  this.toastr.success('Email deleted successfully');
              }
              
              $('#dt1').DataTable().destroy();
              this.GetBadgeReportEmailSettingsList();
          });
      }
  }


    //Add User Submit
    onSubmit(formData: NgForm) {
        var badgeReportSettings = {
            Id: formData.value.id,
            ReminderDays: formData.value.reminderDays,
            ShowRecordFor: formData.value.showRecordFor,
            PickUpDays: formData.value.pickUpDays,
            SPRunMinutes: formData.value.sprunMinutes,
        };
        
        this.badgeReportSettService.AddEditBadgeReportSettings(badgeReportSettings).subscribe((response) => {
            this.toastr.success('Record Saved Successfully');
            
            formData.reset();
            this.GetBadgeReportSettings();
           
        });
        
    }

}
