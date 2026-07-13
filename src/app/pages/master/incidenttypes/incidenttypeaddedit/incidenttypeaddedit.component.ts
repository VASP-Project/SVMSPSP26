import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentTypes } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incidenttypeaddedit',
  templateUrl: './incidenttypeaddedit.component.html',
  styleUrls: ['./incidenttypeaddedit.component.scss']
})
export class IncidenttypeaddeditComponent implements OnInit {
  incident = new IncidentTypes();
  view: boolean = false;
  oldIncidentName:string="";
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
            var incidenttypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['incidenttypeId'];
            this.editIncidentTypes(incidenttypeId, isView)
        }
  }

  editIncidentTypes(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetIncidentTypeById(id);
  }
  private GetIncidentTypeById(id: number) {
    //this.spinner.show();
    this.incidentreportservice.GetIncidentTypeById(id).subscribe((response: IncidentTypes) => {
        this.incident = response
        this.incident.id = id;
        this.oldIncidentName = response.incidentType;
        //this.spinner.hide();

    });
  }

  onSubmit(formData: NgForm) {
    var incident = {
        Id: formData.value.id,
        IncidentType: formData.value.incidentType

    };
    //this.spinner.show();
    if(this.oldIncidentName.toUpperCase().trim() != this.incident.incidentType.toUpperCase().trim())
    {
      this.incidentreportservice.CheckTypeExists(this.incident.incidentType).subscribe((response) => {
        if (response) {
          this.toastr.error('Incident type already exist. Try other Incident type', 'Information');
          this.incident.incidentType = this.oldIncidentName;
          //this.spinner.hide();
        }
        else
        {
          this.saveIncident(incident, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Incident type already exist. Try other Incident type', 'Information');
        //this.spinner.hide();
      });
    } 
    else
    {
      this.saveIncident(incident, formData);
    }  
  }


  saveIncident(incident, formData: NgForm) {
      this.incidentreportservice.AddEditIncidentType(incident).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          //this.spinner.hide();
          this.router.navigate(['/admin/incidenttypelist']);
      });
  }


//Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/incidenttypelist']);
  }
}
