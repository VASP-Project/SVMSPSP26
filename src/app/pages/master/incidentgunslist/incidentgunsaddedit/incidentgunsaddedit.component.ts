import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentGunsMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-incidentgunsaddedit',
  templateUrl: './incidentgunsaddedit.component.html',
  styleUrls: ['./incidentgunsaddedit.component.scss']
})
export class IncidentgunsaddeditComponent implements OnInit {
  gunTypes = new IncidentGunsMaster();
  view: boolean = false;
  oldGuntype:string="";
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
            var guntypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['guntypeId'];
            this.editGunType(guntypeId, isView)
        }
  }

  editGunType(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetGunsById(id);
  }
  private GetGunsById(id: number) {
    this.incidentreportservice.GetGunsById(id).subscribe((response: IncidentGunsMaster) => {
        this.gunTypes = response
        this.gunTypes.id = id;
        this.oldGuntype = response.gunTypeName; 
    });
  }

  onSubmit(formData: NgForm) {
    var gunTypes = {
        Id: formData.value.id,
        GunTypeName: formData.value.gunTypeName

    };
    //this.spinner.show();
    if(this.oldGuntype.toUpperCase().trim() != this.gunTypes.gunTypeName.toUpperCase().trim())
    {
      this.incidentreportservice.CheckGuntypeExists(this.gunTypes.gunTypeName).subscribe((response) => {
        if (response) {
          this.toastr.error('Gun Type already exist. Try other Gun Type', 'Information');
          this.gunTypes.gunTypeName = this.oldGuntype;
          //this.spinner.hide();
        }
        else
        {
          this.saveGuntype(gunTypes, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Gun Type already exist. Try other Gun Type', 'Information');
        //this.spinner.hide();
      });
    } 
    else
    {
      this.saveGuntype(gunTypes, formData);
    }  
  }


  saveGuntype(gunTypes, formData: NgForm) {
      this.incidentreportservice.AddEditGunType(gunTypes).subscribe((response) => {
          this.toastr.success('Record Saved Successfully');
          formData.reset();
          //this.spinner.hide();
          this.router.navigate(['/admin/gunslist']);
      });
  }


//Hide Add form 
  hideaddform() {
      this.router.navigate(['/admin/gunslist']);
  }

}
