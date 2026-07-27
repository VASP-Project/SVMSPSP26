import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentIndividualTypesMaster } from '@app/pages/incidentreport/incidentreport.model';
import { IncidentReportService } from '@app/pages/incidentreport/incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidentindividuallist',
  templateUrl: './incidentindividuallist.component.html',
  styleUrls: ['./incidentindividuallist.component.scss']
})
export class IncidentindividuallistComponent implements OnInit {
  user:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  individualList: IncidentIndividualTypesMaster[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService
  ) { }

  ngOnInit(): void {
    this.GetIndividualTypeList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
    };
    console.log("abc")
  }

  public GetIndividualTypeList()
  {
    this.incidentreportservice.GetIndividualTypeList().subscribe((response : IncidentIndividualTypesMaster[]) => {
      this.individualList = response;  
      this.dtTrigger.next();      
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");      
    });    
  }

  viewIndividual(id: number) {
    let navigationExtras: any = {
        queryParams: {
            'individualeId': id,
            'isEdit': 1,
            'isView': 1
        }
    };
    this.router.navigate(['/admin/individualaddedit'], navigationExtras);
  }

  deleteIndividual(id) {
    var ans = confirm("Are you sure you want to delete this Individual Type?");
    if (ans == true) {
        //this.spinner.show();
        this.incidentreportservice.DeleteIndividualeById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Individual Type not deleted. It is attached to a incident record');
            }
            else {
                this.toastr.success('Individual Type deleted successfully');
            }
            //this.spinner.hide();
            $('#dt1').DataTable().destroy();
            this.GetIndividualTypeList();
        });
    }
  }
}
