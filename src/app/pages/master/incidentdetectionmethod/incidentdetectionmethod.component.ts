import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetectionMethod } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidentdetectionmethod',
  templateUrl: './incidentdetectionmethod.component.html',
  styleUrls: ['./incidentdetectionmethod.component.scss']
})
export class IncidentdetectionmethodComponent implements OnInit {

  user:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  detectionMethodList: DetectionMethod[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService
  ) { }

  ngOnInit(): void {
    this.GetDetectionMethodList()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
    };
    console.log("abc")
    
  const editedRowId = sessionStorage.getItem('editedDetectionRowId');

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
           sessionStorage.removeItem('editedDetectionRowId');
        }
  }
   onEditClick(id: number): void {
  sessionStorage.setItem('editedDetectionRowId', id.toString());
}

  public GetDetectionMethodList()
  {
    this.incidentreportservice.GetDetectionMethodList().subscribe((response : DetectionMethod[]) => {
      this.detectionMethodList = response;  
      this.dtTrigger.next();      
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });    
  }

  viewDetectionMethod(id: number) {
    let navigationExtras: any = {
        queryParams: {
            'detectionMethodId': id,
            'isEdit': 1,
            'isView': 1
        }
    };
    this.router.navigate(['/admin/detectionmethodaddedit'], navigationExtras);
  }

  deleteDetectionMehtod(id) {
    var ans = confirm("Are you sure you want to delete this Detection Method?");
    if (ans == true) {
        //this.spinner.show();
        this.incidentreportservice.DeleteDetectionMethodById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Detection Method not deleted. It is attached to a incident record');
            }
            else {
                this.toastr.success('Detection Method  deleted successfully');
            }
            //this.spinner.hide();
            $('#dt1').DataTable().destroy();
            this.GetDetectionMethodList();
        });
    }
  }
}
