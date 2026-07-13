import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentExplosivesMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incidentexplosiveaddedit',
  templateUrl: './incidentexplosiveaddedit.component.html',
  styleUrls: ['./incidentexplosiveaddedit.component.scss']
})
export class IncidentexplosiveaddeditComponent implements OnInit {
  explosives = new IncidentExplosivesMaster();
  view: boolean = false;
  oldExplosiveName:string="";
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
            var explosiveId: number = this.route.snapshot.pathFromRoot[1].queryParams['explosiveId'];
            this.editExplosive(explosiveId, isView)
        }
  }

  editExplosive(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetExplosiveById(id);
  }
  private GetExplosiveById(id: number) {   
    this.incidentreportservice.GetExplosiveById(id).subscribe((response: IncidentExplosivesMaster) => {
        this.explosives = response
        this.explosives.id = id;
        this.oldExplosiveName = response.explosiveTypeName;
        
    });
  }

  onSubmit(formData: NgForm) {
    var explosive = {
        Id: formData.value.id,
        ExplosivetypeName: formData.value.explosiveTypeName

    };
    //this.spinner.show();
    if(this.oldExplosiveName.toUpperCase().trim() != this.explosives.explosiveTypeName.toUpperCase().trim())
    {
      this.incidentreportservice.CheckExplosiveExists(this.explosives.explosiveTypeName).subscribe((response) => {
        if (response) {
          this.toastr.error('Explosive type already exist. Try other Explosive type', 'Information');
          this.explosives.explosiveTypeName = this.oldExplosiveName;
        }
        else
        {
          this.saveExplosive(explosive, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Explosive type already exist. Try other Explosive type', 'Information');
      });
    } 
    else
    {
      this.saveExplosive(explosive, formData);
    }  
  }


  saveExplosive(explosives, formData: NgForm) {
      this.incidentreportservice.AddEditExplosives(explosives).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          //this.spinner.hide();
          this.router.navigate(['/admin/explosivelist']);
      });
  }


//Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/explosivelist']);
  }
}
