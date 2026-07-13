import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AuditCompanies, BadgeAuditDetails, BadgeAuditDetailsList, DataOutputModel } from './badgelisting.model';
import { BadgelistingService } from './badgelistingedit/badgelisting.service';
//import { BadgelistingService } from './badgelistingedit/badgelisting.service';

@Component({
  selector: 'app-badgelisting',
  templateUrl: './badgelisting.component.html',
  styleUrls: ['./badgelisting.component.scss']
})
export class BadgelistingComponent implements OnInit {
  public windowRef: Window;
  sortDir = 1;//1= 'ASE' -1= DSC
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  dtOptions: DataTables.Settings = {};
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  orderdataTable:any [];
  user:any;
  badgeAuditDetailsList : BadgeAuditDetailsList[];
  badgeauditinfo: BadgeAuditDetails = new BadgeAuditDetails();
  badgeauditdetails: BadgeAuditDetails[];
  queryParam: QueryStringParameters = new QueryStringParameters()
  pageHeaders: PagingHeader = new PagingHeader()
  config: any;
  isAuthSigner:boolean = false;
  isStaffAdmin:boolean = false;
  ackauth:AuditCompanies[]=[];
  ackview:boolean = false;
  auditId: number = 0;
  isSubmitDetails:boolean= false;
 
  constructor(private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private badgeAuditService: BadgelistingService ) { }

  ngOnInit(): void {
    this.windowRef = window;
    this.queryParam.pageSize = 10
    this.queryParam.pageNumber = 1
    this.queryParam.maxPageSize = 10
    this.config = {
      currentPage: 1,
      itemsPerPage: this.queryParam.pageSize
    };
    
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.dtOptions = {
         pagingType: 'full_numbers',
         pageLength: 10,
    };    

    if (this.user.rolename == "AuthSigner") {
     
     this.GetBadgeAuditByRole(this.user.id); 
     this.isAuthSigner = true;
    }else{
      this.GetBadgeAuditList();
      
    }
    
  }
  onSortClick(event, columnname) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.queryParam.orderBy = columnname
    this.queryParam.orderDir = this.sortDir == -1 ? "desc" : "asc"
    if (this.user.rolename == "AuthSigner") {
      this.GetBadgeAuditByRole(this.user.id); 
    }
    else{
       this.GetBadgeAuditList();
    }
  }
  public GetBadgeAuditList() {
    //this.spinner.show();
    this.badgeAuditService.GetBadgeAuditList(this.queryParam).subscribe((response: DataOutputModel) => {
      this.badgeAuditDetailsList = response.items;
      this.pageHeaders = response.paging
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
      
      //this.spinner.hide();
  });
  }
  public GetBadgeAuditByRole(id:string) {
    //this.spinner.show();
    this.badgeAuditService.GetBadgeAuditByRole(this.queryParam, this.user.id).subscribe((response: DataOutputModel) => {
      this.badgeAuditDetailsList = response.items;
      this.pageHeaders = response.paging
      if(this.badgeAuditDetailsList.some(x=>x.companyStatus ==  "True")){
        this.isSubmitDetails = true;
      }
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
      
      //this.spinner.hide();
  });
  }

  clearSearch() {
    this.queryParam.searchQuery = "";
    this.GetBadgeAuditList();
  }

  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    if (this.user.rolename == "AuthSigner") {
      this.GetBadgeAuditByRole(this.user.id); 
    }
    else{
       this.GetBadgeAuditList();
    }
  }
  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    if (this.user.rolename == "AuthSigner") {
      this.GetBadgeAuditByRole(this.user.id); 
    }
    else{
       this.GetBadgeAuditList();
    }
  }

  searchtable(){
    if (this.user.rolename == "AuthSigner") {
      this.GetBadgeAuditByRole(this.user.id); 
    }
    else{
       this.GetBadgeAuditList();
    }
  }

  editbadgeAudit(id: number) {
    let navigationExtras: any = {
        queryParams: {
          'isEdit': 1,
          'auditId': id,
         
        }
    };
    this.router.navigate(['/admin/badgelistingedit'], navigationExtras);
  }
  viewbadgeAudit(id: number) {
    let navigationExtras: any = {
        queryParams: {
          'isEdit': 1,
          'auditId': id,
          'isView': 1
        }
    };
    this.router.navigate(['/admin/badgelistingview'], navigationExtras);
  }
  
}
