import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BadgeReportEmailSettings, BadgeReportSettings } from '../badgereportsettings';
import { BadgeReportSettingsService } from './badgereport.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-badge-report-settings',
  templateUrl: './badge-report-settings.component.html',
  styleUrls: ['./badge-report-settings.component.scss']
})
export class BadgeReportSettingsComponent implements OnInit {

  badgereportemailsettings = new BadgeReportEmailSettings();
  emailType = [
      { value : "BCC"},
      { value : "CC"}
  ]
 
  user:any;
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, 
      private badgereportsettingsService: BadgeReportSettingsService, private appURL: AppConfigService,
      private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
              //Get user form local storage
     this.user = JSON.parse(sessionStorage.getItem("currentUser"));
     if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
        if (!this.user.passwordReseted) {
          //this.spinner.hide();
          this.router.navigate(['admin/changepassword']);
        }
      }    
      var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
      if (isEdit == "1") {
          var id: number = this.route.snapshot.pathFromRoot[1].queryParams['id'];
          this.editBadgeReportEmailSettings(id)
      }
  }


  editBadgeReportEmailSettings(id) {     
      this.GetBadgeReportEmailSettingsById(id);
  }


  private GetBadgeReportEmailSettingsById(id: number) {
       this.badgereportsettingsService.GetBadgeReportEmailSettingsById(id).subscribe((response: BadgeReportEmailSettings) => {
          
      });

  }


  //Add User Submit
  onSubmit(formData: NgForm) {
      var badgeReportEmailSettings = {
          Id: formData.value.id,
          Email: formData.value.email,
          Type:formData.value.type

      };
      
      this.saveBadgeReportSettings(badgeReportEmailSettings, formData);
      
  }


  saveBadgeReportSettings(badgeReportSettings, formData: NgForm) {
      this.badgereportsettingsService.AddEditBadgeReportEmailSettings(badgeReportSettings).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          
          this.router.navigate(['/admin/badgereportsettingslist']);
      });
  }


  //Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/badgereportsettingslist']);
  }
}
