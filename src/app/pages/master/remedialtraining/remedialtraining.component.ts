import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { RemedialTraining } from '../remedialtraining';
import { RemedialTrainingService } from './remedialtraining.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
    templateUrl: './remedialtraining.component.html',
    styleUrls: ['./remedialtraining.component.css']
})
export class RemedialTrainingeditComponent implements OnInit {
    training = new RemedialTraining();
    view: boolean = false;
    oldTrainingName: string = "";
    user:any;
    constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private remedialTrainingService: RemedialTrainingService, private appURL: AppConfigService,
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
            var trainingtypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['id'];
            this.editRemedialTraining(trainingtypeId, isView)
        }
    }


    editRemedialTraining(id, mode) {
        if (mode == "1")
            this.view = true;
        else
            this.view = false;
        this.GetRemedialTrainingById(id);
    }


    private GetRemedialTrainingById(id: number) {
        //this.spinner.show();
        this.remedialTrainingService.GetRemedialTrainingById(id).subscribe((response: RemedialTraining) => {
            this.training = response
            this.training.id = id;
            this.oldTrainingName = response.remedialTrainingType;
            //this.spinner.hide();

        });

    }


    //Add User Submit
    onSubmit(formData: NgForm) {
        var trainingData = {
            Id: formData.value.id,
            RemedialTrainingType: formData.value.remedialTrainingType

        };
        //this.spinner.show();
        if (this.oldTrainingName === null)
            this.oldTrainingName = "";
        if (this.oldTrainingName.toUpperCase().trim() != this.training.remedialTrainingType.toUpperCase().trim()) {
            this.remedialTrainingService.CheckTypeExists(this.training.remedialTrainingType).subscribe((response) => {
                if (response) {
                    this.toastr.error('Corrective Action already exist. Try other Corrective Action', 'Information');
                    this.training.remedialTrainingType = this.oldTrainingName;
                    //this.spinner.hide();
                }
                else {
                    this.saveTraining(trainingData, formData);
                }
            }, (error:any)=> {
                this.toastr.error('Corrective Action already exist. Try other Corrective Action', 'Information');
                //this.spinner.hide();
            });
        }
        else {
            this.saveTraining(trainingData, formData);
        }
    }


    saveTraining(training, formData: NgForm) {
        this.remedialTrainingService.AddEditRemedialTraining(training).subscribe((response) => {
            this.toastr.success('Record Saved Successfully');
            formData.reset();
            //this.spinner.hide();
            this.router.navigate(['/admin/remedialtraining']);
        });
    }


    //Hide Add form 
    hideaddform() {
        this.router.navigate(['/admin/remedialtraining']);
    }
}
