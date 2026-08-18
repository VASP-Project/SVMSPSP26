import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentGunsMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidentgunslist',
  templateUrl: './incidentgunslist.component.html',
  styleUrls: ['./incidentgunslist.component.scss']
})
export class IncidentgunslistComponent implements OnInit {
  user:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  guntypeList: IncidentGunsMaster[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService
  ) { }

  ngOnInit(): void {
    this.GetGunList()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
    };
    const editedRowId = sessionStorage.getItem("editedgunRowId");

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
      sessionStorage.removeItem("editedgunRowId");
    }
    
  }

  public GetGunList()
  {
    this.incidentreportservice.GetGunList().subscribe((response : IncidentGunsMaster[]) => {
      this.guntypeList = response;  
      this.dtTrigger.next();      
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });    
  }

  viewGunType(id: number) {
    let navigationExtras: any = {
        queryParams: {
            'guntypeId': id,
            'isEdit': 1,
            'isView': 1
        }
    };
    this.router.navigate(['/admin/gunsaddedit'], navigationExtras);
  }

  deleteGunType(id) {
    var ans = confirm("Are you sure you want to delete this Gun Type?");
    if (ans == true) {
        //this.spinner.show();
        this.incidentreportservice.DeleteGuntypeById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Gun Type not deleted. It is attached to a incident record');
            }
            else {
                this.toastr.success('Gun Type deleted successfully');
            }
            //this.spinner.hide();
            $('#dt1').DataTable().destroy();
            this.GetGunList();
        });
    }
  }

  onEditClick(id: number): void {
    sessionStorage.setItem('editedgunRowId', id.toString());
  }
}
