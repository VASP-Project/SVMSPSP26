import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentIndividualTypesMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incidentindividualaddedit',
  templateUrl: './incidentindividualaddedit.component.html',
  styleUrls: ['./incidentindividualaddedit.component.scss']
})
export class IncidentindividualaddeditComponent implements OnInit {
  individuals = new IncidentIndividualTypesMaster();
  view: boolean = false;
  oldIndividualName:string="";
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
            var individualeId: number = this.route.snapshot.pathFromRoot[1].queryParams['individualeId'];
            this.editIndividual(individualeId, isView)
        }
  }

  editIndividual(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetIndividualTypeById(id);
  }
  private GetIndividualTypeById(id: number) {   
    this.incidentreportservice.GetIndividualTypeById(id).subscribe((response: IncidentIndividualTypesMaster) => {
        this.individuals = response
        this.individuals.id = id;
        this.oldIndividualName = response.individualTypeName;
        
    });
  }

  onSubmit(formData: NgForm) {
    var individual = {
        Id: formData.value.id,
        IndividualTypeName: formData.value.individualTypeName

    };
    //this.spinner.show();
    if(this.oldIndividualName.toUpperCase().trim() != this.individuals.individualTypeName.toUpperCase().trim())
    {
      this.incidentreportservice.CheckIndividualTypeExists(this.individuals.individualTypeName).subscribe((response) => {
        if (response) {
          this.toastr.error('Individual type already exist. Try other Individual type', 'Information');
          this.individuals.individualTypeName = this.oldIndividualName;
        }
        else
        {
          this.saveIndividual(individual, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Individual type already exist. Try other Individual type', 'Information');
      });
    } 
    else
    {
      this.saveIndividual(individual, formData);
    }  
  }


  saveIndividual(individuals, formData: NgForm) {
      this.incidentreportservice.AddEditIndividualType(individuals).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          //this.spinner.hide();
          this.router.navigate(['/admin/individuallist']);
      });
  }


//Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/individuallist']);
  }

}
