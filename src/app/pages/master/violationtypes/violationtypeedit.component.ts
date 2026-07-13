import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ViolationTypes } from '../violationtypes';
import { ViolationTypesService } from './violationtype.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
    templateUrl: './violationtypeedit.component.html',
    styleUrls: ['./violationtype.component.css']
})
export class ViolationTypeseditComponent implements OnInit {
    violation = new ViolationTypes();
    view: boolean = false;
    oldViolationName:string="";
    user:any;
    constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private violationTypesService: ViolationTypesService, private appURL: AppConfigService,
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
            var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
            var violationtypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['violationtypeId'];
            this.editViolationTypes(violationtypeId, isView)
        }
    }


    editViolationTypes(id, mode) {
        if (mode == "1")
            this.view = true;
        else
            this.view = false;
        this.GetViolationTypeById(id);
    }


    private GetViolationTypeById(id: number) {
        //this.spinner.show();
        this.violationTypesService.GetViolationTypeById(id).subscribe((response: ViolationTypes) => {
            this.violation = response
            this.violation.id = id;
            this.oldViolationName = response.violationType;
            //this.spinner.hide();

        });

    }


    //Add User Submit
    onSubmit(formData: NgForm) {
        var violation = {
            Id: formData.value.id,
            ViolationType: formData.value.violationType

        };
        //this.spinner.show();
        if(this.oldViolationName.toUpperCase().trim() != this.violation.violationType.toUpperCase().trim())
        {
          this.violationTypesService.CheckTypeExists(this.violation.violationType).subscribe((response) => {
            if (response) {
              this.toastr.error('Violation type already exist. Try other Violation type', 'Information');
              this.violation.violationType = this.oldViolationName;
              //this.spinner.hide();
            }
            else
            {
              this.saveViolation(violation, formData);
            }       
          }, (error:any)=> {
            this.toastr.error('Violation type already exist. Try other Violation type', 'Information');
            //this.spinner.hide();
          });
        } 
        else
        {
          this.saveViolation(violation, formData);
        }  
    }


    saveViolation(violation, formData: NgForm) {
        this.violationTypesService.AddEditViolationTypes(violation).subscribe((response) => {
            this.toastr.success('Record Saved Successfully');
            formData.reset();
            //this.spinner.hide();
            this.router.navigate(['/admin/violationtype']);
        });
    }


    //Hide Add form 
    hideaddform() {
        this.router.navigate(['/admin/violationtype']);
    }
}
