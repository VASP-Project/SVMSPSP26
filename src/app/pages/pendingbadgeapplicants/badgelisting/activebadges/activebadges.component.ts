import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BadgeAuditCompanyEmployee, BadgeAuditCompanyEmployeeList, DataOutputModelemp } from '../badgelisting.model';
import { BadgelistingService } from '../badgelistingedit/badgelisting.service';

@Component({
  selector: 'app-activebadges',
  templateUrl: './activebadges.component.html',
  styleUrls: ['./activebadges.component.scss']
})
export class ActivebadgesComponent implements OnInit {
  public windowRef: Window;
  sortDir = 1;
  launchbadgeaudit: BadgeAuditCompanyEmployee[];
  launchbadgeauditlist: BadgeAuditCompanyEmployeeList[];
  badgeauditemp: BadgeAuditCompanyEmployee = new BadgeAuditCompanyEmployee();
  queryParam: QueryStringParameters = new QueryStringParameters()
  pageHeaders: PagingHeader = new PagingHeader()
  config: any;
  isView: number = 0;
  auditId: number = 0;
  isEdit: number = 0;
  user: any;
  isAuthsigner: boolean = false;
  

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    //private CompanyService: CompanyService,
    private badgeAuditService: BadgelistingService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
     const savedPageSize = sessionStorage.getItem('ActiveBadgeSize');
     const savedPageNumber = sessionStorage.getItem('ActiveBadgeNumber');
   
    this.windowRef = window;
    this.queryParam.pageSize = savedPageSize ? +savedPageSize :50;
    this.queryParam.pageNumber = savedPageNumber ? +savedPageNumber: 1;
    this.queryParam.maxPageSize =savedPageSize ? +savedPageSize :50;
    this.config = {
      currentPage: 1,
      itemsPerPage: this.queryParam.pageSize
    };

    this.isEdit = +this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    this.auditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    this.isView = +this.route.snapshot.pathFromRoot[1].queryParams['isView'];

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (this.auditId != 0) {
      this.isEdit = 1;
    }

      setTimeout(()=>{
    if (this.user.rolename == "AuthSigner" || this.user.rolename == "StaffAdmin") {
      this.isAuthsigner = true;
      this.GetActiveBadgesByAuth()
      

    }

      },300);



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
    this.GetActiveBadgesByAuth();
  }
  public GetActiveBadgesByAuth() {
    //this.spinner.show();
    this.badgeAuditService.GetActiveBadgesByAuth(this.queryParam,  this.user.id).subscribe((response: DataOutputModelemp) => {
      this.launchbadgeauditlist = response.items;
      this.pageHeaders = response.paging
      
      
      

      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");

      //this.spinner.hide();
    });
  }
  onPageChange(newPage: number): void {
sessionStorage.setItem(
    'ActiveBadgeNumber',
    newPage.toString()
  );
    this.queryParam.pageNumber = newPage;
    this.GetActiveBadgesByAuth();
  }
  onPageSizeChange(): void {
    sessionStorage.setItem(
    'ActiveBadgeSize',
    this.queryParam.pageSize.toString()
  );

    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetActiveBadgesByAuth();
  }

 
  searchtable() {
    this.GetActiveBadgesByAuth();
  }

}
