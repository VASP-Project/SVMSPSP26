import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Facilities } from '../facility';
import { FacilityService } from './facility.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-facilityedit',
  templateUrl: './facilityedit.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilityeditComponent implements OnInit {
  facility = new Facilities();
  view: boolean = false;
  oldFacilityName:string="";
  user:any;

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private appURL: AppConfigService,
    private facilityService: FacilityService, private router: Router,
    private route: ActivatedRoute) { }

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
          var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
          var facilityId: number = this.route.snapshot.pathFromRoot[1].queryParams['facilityId'];
          this.editFacility(facilityId, isView)
      }
  }

  editFacility(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetFacilityById(id);
  }

  private GetFacilityById(id: number) {
    //this.spinner.show();
    this.facilityService.GetFacilityById(id).subscribe((response: Facilities) => {
        this.facility = response
        this.facility.id = id;
        this.oldFacilityName = response.facilityName;
        //this.spinner.hide();
    });
  }


  //Add Facility
  onSubmit(formData: NgForm) {
    var facility = {
      Id: formData.value.id,
      FacilityName: formData.value.facilityName

  };
  //this.spinner.show();
  if(this.oldFacilityName.toUpperCase().trim() != formData.value.facilityName.toUpperCase().trim())
  {
    this.facilityService.CheckTypeExists(this.facility.facilityName).subscribe((response) => {
      if (response) {
        this.toastr.error('Facility already exist. Try other Facility', 'Information');
        this.facility.facilityName = this.oldFacilityName;
        //this.spinner.hide();
      }
      else
      {
        this.saveFacility(facility, formData);
      }       
    }, (error:any)=> {
      this.toastr.error('Facility already exist. Try other Facility', 'Information');
      //this.spinner.hide();
    });
  } 
  else
  {
    this.saveFacility(facility, formData);
  }  
  }


  saveFacility(facility, formData: NgForm) {
    this.facilityService.AddEditFacility(facility).subscribe((response) => {
      this.toastr.success('Record Saved Successfully');
      formData.reset();
      //this.spinner.hide();
      this.router.navigate(['/admin/facility']);
  });
  }


  //Hide Add form 
  hideaddform() {
    this.router.navigate(['/admin/facility']);
}
}
