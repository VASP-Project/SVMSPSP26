import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgbCalendar, NgbDateAdapter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BadgeAuditCompanyEmployee, BadgeAuditCompanyEmployeeList, DataOutputModelemp, GenetecCardholder, GenetecCardholderListResponse } from '../badgelisting.model';
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
  cardholders: GenetecCardholder[] = [];
  allCardholders: GenetecCardholder[] = [];

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
     const savedPageSize = sessionStorage.getItem('GenetecCardholderSize');
     const savedPageNumber = sessionStorage.getItem('GenetecCardholderNumber');
   
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
      this.getAllCardholders()
      

    }

      },300);



  }

  public getAllCardholders(): void {

    this.badgeAuditService.GetAllCardholders().subscribe(
      (response: GenetecCardholderListResponse) => {

       this.allCardholders = response?.items || [];
        this.cardholders = [...this.allCardholders];

        this.pageHeaders = {
          pageNumber: this.queryParam.pageNumber,
          pageSize: this.queryParam.pageSize,
          totalItems: response?.count || 0,
          totalPages:response.page
        };

      },
      (error: any) => {

        console.log("Error fetching Genetec cardholders", error);

        this.cardholders = [];

        this.pageHeaders = {
          pageNumber: 1,
          pageSize: this.queryParam.pageSize,
          totalItems: 0,
          totalPages:this.queryParam.pageNumber
        };
      }
    );
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
    this.cardholders.sort((a, b) => {

      let valueA = a[columnname] || '';
      let valueB = b[columnname] || '';

      let result = valueA.toString().localeCompare(
        valueB.toString(),
        undefined,
        { sensitivity: 'base' }
      );

      return this.sortDir === -1 ? -result : result;
    });
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
      'GenetecCardholderNumber',
      newPage.toString()
    );
      this.queryParam.pageNumber = newPage;
      this.GetActiveBadgesByAuth();
    }

  onPageSizeChange(): void {
    sessionStorage.setItem(
    'GenetecCardholderSize',
    this.queryParam.pageSize.toString()
  );

    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.queryParam.pageNumber = 1;

    sessionStorage.setItem('GenetecCardholderNumber', '1');
  }

 
  searchtable(): void {

    const searchText = (this.queryParam.searchQuery || '')
      .trim()
      .toLowerCase();

    this.cardholders = this.allCardholders.filter(item => {

      return [
        item.name,
        item.firstName,
        item.lastName,
        item.email,
        item.mobilePhone,
        item.status,
        item.description
      ].some(value =>
        (value || '').toString().toLowerCase().includes(searchText)
      );

    });

    this.pageHeaders.totalItems = this.cardholders.length;
    this.queryParam.pageNumber = 1;
    this.pageHeaders.pageNumber = 1;
  }

}
