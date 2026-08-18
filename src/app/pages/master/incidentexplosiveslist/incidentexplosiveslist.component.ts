import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentExplosivesMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidentexplosiveslist',
  templateUrl: './incidentexplosiveslist.component.html',
  styleUrls: ['./incidentexplosiveslist.component.scss']
})
export class IncidentexplosiveslistComponent implements OnInit {
  user:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  explosiveList: IncidentExplosivesMaster[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService
  ) { }

  ngOnInit(): void {
     this.GetExplosivesList()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
    };
    // console.log("abc")
    const editedRowId = sessionStorage.getItem('editedExploisvesRowId');

        if (editedRowId) {
            setTimeout(() => {

                const row = document.getElementById('row-' + editedRowId);

                if (row) {

                    row.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                   
                    row.classList.add('highlight-row');

                    setTimeout(() => {
                        row.classList.remove('highlight-row');
                    }, 3000);
                }
             
            }, 500);
           sessionStorage.removeItem('editedExploisvesRowId');
        }
   
  }

  public GetExplosivesList()
  {
    this.incidentreportservice.GetExplosivesList().subscribe((response : IncidentExplosivesMaster[]) => {
      this.explosiveList = response;  
      this.dtTrigger.next();      
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");      
    });    
  }

  viewExplosive(id: number) {
    let navigationExtras: any = {
        queryParams: {
            'explosiveId': id,
            'isEdit': 1,
            'isView': 1
        }
    };
    this.router.navigate(['/admin/explosiveaddedit'], navigationExtras);
  }

  deleteExplosive(id) {
    var ans = confirm("Are you sure you want to delete this Explosive?");
    if (ans == true) {
        //this.spinner.show();
        this.incidentreportservice.DeleteExplosiveById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Explosive not deleted. It is attached to a incident record');
            }
            else {
                this.toastr.success('Explosive  deleted successfully');
            }
            //this.spinner.hide();
            $('#dt1').DataTable().destroy();
            this.GetExplosivesList();
        });
    }
  }

  onEditClick(id: number): void {
    sessionStorage.setItem('editedExploisvesRowId', id.toString());
  }
}
