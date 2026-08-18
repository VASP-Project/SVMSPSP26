import { Component, OnInit } from '@angular/core';
import { FromTODate, IncidentTypes, IncidentreportDetail, SelectedLocation } from './incidentreport.model';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { IncidentReportService } from './incidentreport.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-incidentreport',
  templateUrl: './incidentreport.component.html',
  styleUrls: ['./incidentreport.component.scss']
})
export class IncidentreportComponent implements OnInit {
  user: any;
  fromToDates: FromTODate = new FromTODate();
  fromDate: string;
  toDate: string;
  incidentinfo : IncidentreportDetail=new IncidentreportDetail(); 
  allIncidentTypeDisplayNameList: IncidentTypes[];
  dtOptions:{}
  dtTrigger:Subject<any> = new Subject();
  incidentList : IncidentreportDetail[] = [];
  showGobutton:boolean = true;

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private toastr: ToastrService,
    private incidentreportservice:IncidentReportService

  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())          
    this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(),'d',30))
    var incidentSearch = JSON.parse(sessionStorage.getItem("incidentSearch"));
    if(incidentSearch!=null)
    {
      this.fromToDates = incidentSearch;
    }
    this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))

    
    if(incidentSearch!=null)
    {
    this.fromToDates = incidentSearch;
    }
    if(this.user.rolename == 'TSA User'){
      this.showGobutton = false;
    }
    this.GetInscidentList(this.fromDate, this.toDate);
    this.GetIncidentTypeList();
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,  
      order: [[0, 'desc']],    
     
      dom: 'lBfrtip',           
    };
  }

  HighlightIncident(){
      const editedRowId = sessionStorage.getItem('editedIncidentRowId');

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
           sessionStorage.removeItem('editedIncidentRowId');
        }
    }


  onEditClick(id: number): void {
    sessionStorage.setItem('editedIncidentRowId', id.toString());
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {      
      const date = value.split("-");
      return {
        month : parseInt(date[0], 10),
        day : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
  }
  
  identify(index, item) 
  {
    return item.id;
  }
  public GetIncidentTypeList()
  {
    this.incidentreportservice.GetIncidentTypeList().subscribe((response : IncidentTypes[]) => {
      this.allIncidentTypeDisplayNameList = response;               
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");      
    });    
  }

  public goToEdit()
  {    
    if(this.incidentinfo.incidentType == undefined)
    {
      this.toastr.error("Please select Incident type.", "Error");
    }
    else
    {
      var incidentType = this.allIncidentTypeDisplayNameList.find(x => x.id == this.incidentinfo.incidentType)
      this.router.navigate(["/admin/incident/incidentreportadd"], {
        queryParams: { isEdit: 0, inciTypeId: this.incidentinfo.incidentType , inciTypeName: incidentType.incidentType},
        skipLocationChange: true,
      });
    }    
  }

  basicSearchInspection() {   
    sessionStorage.setItem("incidentSearch",JSON.stringify(this.fromToDates));
    this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    $("#dt1").DataTable().destroy();
    if(
      this.fromDate != "mm/dd'yyyy" && this.fromDate != undefined &&
      this.toDate != "mm/dd'yyyy" && this.toDate != undefined
    )
    {
      this.GetInscidentList(this.fromDate,this.toDate);
    }      
    
  }
  showEditButton(item: any) {
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    return (this.user.rolename == 'Issuer' &&  (item.incidentStatusDisplay == 'Draft'  || item.incidentStatusDisplay == 'Returned') &&
          (this.user.id == item.createdby )
      )
      || (this.user.rolename == 'Security' &&  (item.incidentStatusDisplay == 'Draft'  || item.incidentStatusDisplay == 'Returned') &&
          (this.user.id == item.createdby)
      )
      || (this.user.rolename == 'StaffAdmin' && item.incidentStatusDisplay != 'Closed' 
      )
      
      || this.user.rolename == 'Superadmin'
  }

  showViewButton(item: any) {
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    return (this.user.rolename == 'Issuer' 
      )
      || (this.user.rolename == 'Security' &&  
          this.user.id == item.createdby 
      )
      || (this.user.rolename == 'StaffAdmin'
      )
      || (this.user.rolename == 'TSA User'
      )
      || this.user.rolename == 'Superadmin'
  }
  showCloneButton(item: any) {
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    return (this.user.rolename == 'Issuer' 
      )
      || (this.user.rolename == 'Security' 
      )
      || (this.user.rolename == 'StaffAdmin'
      )
      
      || this.user.rolename == 'Superadmin'
  }

  public GetInscidentList(fromDate,toDate)
  {
    this.incidentreportservice.GetInscidentList(fromDate,toDate).subscribe(
      (response: IncidentreportDetail[]) => {        
          this.incidentList = response;              
          this.dtTrigger.next();     
          this.HighlightIncident();
      },
    
    );
  }
  
  DeleteIncident(id) {

    if (confirm("Are you sure you want to delete Incident?")) {
      this.incidentreportservice.DeleteIncident(id).subscribe(
        (response: Response) => {
          this.toastr.success("Incident record Deleted Sucessfully!");
          $('#dt1').DataTable().destroy();
          this.GetInscidentList(this.fromDate, this.toDate);

        },
        (error:any)=> {
          this.toastr.error("Error deleting Incident. Try Again!");
          //this.spinner.hide();
        }
      );
    }
    else {

    }

  }
}
