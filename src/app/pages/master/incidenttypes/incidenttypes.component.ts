import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentTypes } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidenttypes',
  templateUrl: './incidenttypes.component.html',
  styleUrls: ['./incidenttypes.component.scss']
})
export class IncidenttypesComponent implements OnInit {

  user:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  allIncidentTypeDisplayNameList: IncidentTypes[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService
  ) { }

  ngOnInit(): void {
    this.GetIncidentTypeList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
  };
  const editedRowId = sessionStorage.getItem("editedIncidentTypesRowId");

  if (editedRowId) {
    setTimeout(() => {
      const row = document.getElementById("row-" + editedRowId);

      if (row) {
        row.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        row.classList.add("highlight-row");

        setTimeout(() => {
          row.classList.remove("highlight-row");
        }, 3000);
      }
    }, 500);
    sessionStorage.removeItem("editedIncidentTypesRowId");
  }
  }

  public GetIncidentTypeList()
  {
    this.incidentreportservice.GetIncidentTypeList().subscribe((response : IncidentTypes[]) => {
      this.allIncidentTypeDisplayNameList = response;  
      this.dtTrigger.next();      
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });    
  }

  viewIncidentType(id: number) {
    let navigationExtras: any = {
        queryParams: {
            'incidenttypeId': id,
            'isEdit': 1,
            'isView': 1
        }
    };
    this.router.navigate(['/admin/incidenttypeaddedit'], navigationExtras);
  }

  deleteIncidentTypes(id) {
    var ans = confirm("Are you sure you want to delete this Incident Type?");
    if (ans == true) {
        //this.spinner.show();
        this.incidentreportservice.DeleteIncidentTypeById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Incident Type not deleted. It is attached to a incident record');
            }
            else {
                this.toastr.success('Incident Type deleted successfully');
            }
            //this.spinner.hide();
            $('#dt1').DataTable().destroy();
            this.GetIncidentTypeList();
        });
    }
  }

  onEditClick(id: number): void {
    sessionStorage.setItem('editedIncidentTypesRowId', id.toString());
  }
}
