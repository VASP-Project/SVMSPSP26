import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetectionMethod } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detectionmethodaddedit',
  templateUrl: './detectionmethodaddedit.component.html',
  styleUrls: ['./detectionmethodaddedit.component.scss']
})
export class DetectionmethodaddeditComponent implements OnInit {
  detectionMethods = new DetectionMethod();
  view: boolean = false;
  oldDetectionMethod:string="";
  user:any;

  constructor(
    private toastr: ToastrService,     
    private incidentreportservice:IncidentReportService,       
    private router: Router, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
        if (isEdit == "1") {
            var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
            var detectionMethodId: number = this.route.snapshot.pathFromRoot[1].queryParams['detectionMethodId'];
            this.editDetectionMethod(detectionMethodId, isView)
        }
  }

  editDetectionMethod(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetDetectionMethodById(id);
  }
  private GetDetectionMethodById(id: number) {
    //this.spinner.show();
    this.incidentreportservice.GetDetectionMethodById(id).subscribe((response: DetectionMethod) => {
        this.detectionMethods = response
        this.detectionMethods.id = id;
        this.oldDetectionMethod = response.detectionMethod;
        //this.spinner.hide();

    });
  }

  onSubmit(formData: NgForm) {
    var detectionMethods = {
        Id: formData.value.id,
        DetectionMethod: formData.value.detectionMethod

    };
    //this.spinner.show();
    if(this.oldDetectionMethod.toUpperCase().trim() != this.detectionMethods.detectionMethod.toUpperCase().trim())
    {
      this.incidentreportservice.CheckDetectionExists(this.detectionMethods.detectionMethod).subscribe((response) => {
        if (response) {
          this.toastr.error('Detection method already exist. Try other Detection method', 'Information');
          this.detectionMethods.detectionMethod = this.oldDetectionMethod;
          //this.spinner.hide();
        }
        else
        {
          this.saveDetection(detectionMethods, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Detection method already exist. Try other Detection method', 'Information');
        //this.spinner.hide();
      });
    } 
    else
    {
      this.saveDetection(detectionMethods, formData);
    }  
  }


  saveDetection(detectionMethods, formData: NgForm) {
      this.incidentreportservice.AddEditDetectionMethod(detectionMethods).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          //this.spinner.hide();
          this.router.navigate(['/admin/detectionmethodlist']);
      });
  }


//Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/detectionmethodlist']);
  }

}
