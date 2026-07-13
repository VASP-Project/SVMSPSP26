import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@app/pages/master/company';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BadgeAuditCompanyEmployee, BadgeAuditCompanyEmployeeList, BadgeAuditDetails, DataOutputModelemp, FromTODate, SelectedCompanies } from '../badgelisting.model';
import { CompanyService } from '@app/pages/master/company/company.service'
import { BadgelistingService } from './badgelisting.service';
import { NgForm } from '@angular/forms';
import { map } from 'jquery';
import { Subject } from 'rxjs';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-badgelistingedit',
  templateUrl: './badgelistingedit.component.html',
  styleUrls: ['./badgelistingedit.component.scss']
})
export class BadgelistingeditComponent implements OnInit {
  public windowRef: Window;
  sortDir = 1;
  fromToDates: FromTODate = new FromTODate();
  fromDate: string;
  toDate: string;
  dropdownSettings = {};
  selectedCompany: any[] = [];
  allCompanyList: Company[];
  badgeauditinfo: BadgeAuditDetails = new BadgeAuditDetails();
  badgeauditdetails: BadgeAuditDetails[];
  launchbadgeaudit: BadgeAuditCompanyEmployee[];
  launchbadgeauditlist: BadgeAuditCompanyEmployeeList[];
  auditTypes = [
    { label: "Random Audit", value: "Random Audit" },
    { label: "Targeted Audit", value: "Targeted Audit" },
    { label: "100% Audit", value: "100% Audit" }
  ]
  isAudit: boolean;
  isDirty: boolean = false;
  isEdit: number = 0;
  auditId: number = 0
  isLaunched: boolean = false;
  saveEdit: boolean = false;
  dtOptions: DataTables.Settings = {};
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  queryParam: QueryStringParameters = new QueryStringParameters()
  pageHeaders: PagingHeader = new PagingHeader()
  config: any;
  isView:number = 0;
  user:any;
  pending:any;

  constructor(
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private CompanyService: CompanyService,
    private badgeAuditService: BadgelistingService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.windowRef = window;
    this.queryParam.pageSize = 10
    this.queryParam.pageNumber = 1
    this.queryParam.maxPageSize = 10
    this.config = {
      currentPage: 1,
      itemsPerPage: this.queryParam.pageSize
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'companyName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };

    this.isEdit = +this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    this.auditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    this.isView = +this.route.snapshot.pathFromRoot[1].queryParams['isView'];
    this.badgeauditinfo.auditType ='Targeted Audit';
    await this.GetCompanyList();

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (this.auditId != 0) {
      //Get Audit by id
      this.isEdit = 1;
      await this.GetBadgeAuditById(this.auditId)
      //this.GetLaunchBadgeAuditById(this.auditId)
      this.GetLaunchBadgeAuditByStaffAdmin(this.auditId)
    }
    else {
    
      //Add
      this.badgeauditinfo.auditType = "Targeted Audit";
      this.badgeauditinfo.auditPercent = "100";
      this.isAudit = true;
      this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getNext(this.ngbCalendar.getToday(), 'd', 30))
      //this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), 'd', 30))
      this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
      this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
      this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    }
    // this.GetBadgeAuditById(this.auditId)

  }



  getAuditById() {
    // this.badgeauditinfo = data
  }

  async GetBadgeAuditById(id): Promise<any> {

    return new Promise<void>((resolve, reject) => {
      this.badgeAuditService.GetBadgeAuditById(id).subscribe((response: BadgeAuditDetails) => {
        this.badgeauditinfo = response;
        if (this.badgeauditinfo.auditType == '100% Audit') {
          this.isAudit = true;
        }
        this.fromToDates.fromDate = this.dateAdapter.toModel(this.fromModelResponse(response.auditFromDate.toString().split('T')[0]));
       // this.fromToDates.fromDate = this.dateAdapter.toModel(this.fromModelResponse(response.auditFromDate.toString().split('T')[0]));
        this.fromToDates.toDate = this.dateAdapter.toModel(this.fromModelResponse(response.auditToDate.toString().split('T')[0]));
        let selectedC = []
        let compids = response.selectedCompanies.split("*")
        compids.forEach(element => {
          let comp = new SelectedCompanies()
          comp.id = +element
          let name = this.allCompanyList.filter(x => x.id == +element)[0].companyName
          selectedC.push({ id: +element, companyName: name })
        });
        this.selectedCompany = selectedC
        this.GetCompanyList();
        resolve()
      }, (error: any) => {
        //this.spinner.hide();
        console.log("error list");
        reject()
      });
    });
  }


  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("/");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }
  fromModelResponse(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month: parseInt(date[1]),
        day: parseInt(date[2]),
        year: parseInt(date[0])
      };
    }
    return null;
  }
  async GetCompanyList(): Promise<any> {

    return new Promise<void>((resolve, reject) => {
      this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
        this.allCompanyList = response;
        resolve()
      }, (error: any) => {
        //this.spinner.hide();
        console.log("error list");
        reject()
      });
    });
  }

  // public GetCompanyList() {
  //   //this.spinner.show();
  //   this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
  //     this.allCompanyList = response;
  //     //this.spinner.hide();
  //   }, (error: any) => {
  //     //this.spinner.hide();
  //     console.log("error list");
  //   });
  // }
  setDirtyFlag() {
    this.isDirty = true;
  }
  hideaddform() {
    this.router.navigate(['/admin/badgelisting']);
  }
  onItemSelect(item: any) {

    // console.log(item);
  }
  onSelectAll(items: any) {

    // console.log(items);
  }

  public showAuditType() {
    this.GetCompanyList();
    if (this.badgeauditinfo.auditType == "Random Audit") {

      this.isAudit = false
      this.badgeauditinfo.auditPercent = "10"
      this.selectedCompany = [];

    }
    else if (this.badgeauditinfo.auditType == "Targeted Audit") {
      this.isAudit = true
      this.badgeauditinfo.auditPercent = "100"
    }
    else {
      this.isAudit = true;
      this.badgeauditinfo.auditPercent = "100";

      this.selectedCompany = [];
    }
  }

  launch() {
    this.isLaunched = true;
  }

  refresh() {
    var msg = " Do you want to Refresh Badge Audit? ";
    if (confirm(msg)) {
    this.badgeAuditService.RefreshBadgeAudit(this.badgeauditinfo).subscribe((response: BadgeAuditDetails) => {
      this.router.navigate(["/admin/badgelisting"]).then(() => {
        this.router.navigate(['/admin/badgelistingedit'], {
          queryParams: {
            isEdit: 1,
            auditId: response.id
          },skipLocationChange: true
        });
      });
    }
    ,);
  }
}
  public GetLaunchBadgeAuditById(id: number) {
    //this.spinner.show();
    this.badgeAuditService.GetLaunchBadgeAuditById(id).subscribe((response: BadgeAuditCompanyEmployee[]) => {
      this.launchbadgeaudit = response;
      this.dtTrigger.next();

      //this.spinner.hide();
    });
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
    this.GetLaunchBadgeAuditByStaffAdmin(this.auditId);
  }
  public GetLaunchBadgeAuditByStaffAdmin(id: number) {
    //this.spinner.show();
    this.badgeAuditService.GetLaunchBadgeAuditByStaffAdmin(this.queryParam, this.auditId).subscribe((response: DataOutputModelemp) => {
      this.launchbadgeauditlist = response.items;
      // this.pending = this.launchbadgeauditlist.entries;
      this.pageHeaders = response.paging
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");

      //this.spinner.hide();
    });
  }
  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    this.GetLaunchBadgeAuditByStaffAdmin(this.auditId);
  }
  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetLaunchBadgeAuditByStaffAdmin(this.auditId);
  }

  searchtable() {
    this.GetLaunchBadgeAuditByStaffAdmin(this.auditId);
  }

  clearSearch(){
    this.queryParam.searchQuery = "";
    this.GetLaunchBadgeAuditByStaffAdmin(this.auditId);

  }
  
  launchUpdate(){
    this.badgeauditinfo.auditFromDate = new Date(this.fromToDates.fromDate.split("-").reverse().join("/"));
    this.badgeauditinfo.auditToDate = new Date(this.fromToDates.toDate.split("-").reverse().join("/"));
    if (this.badgeauditinfo.status != '') {
      if (this.isLaunched) {
        this.badgeauditinfo.status = "LAUNCHED";
      }
    }
    let strcompnay = "";
    let strCompanyNames =""
    if (this.badgeauditinfo.auditType == "Targeted Audit") {
      this.selectedCompany.forEach(element => {
        strcompnay = strcompnay + element.id + "*"
        strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*"
      });
      strcompnay = strcompnay.slice(0, -1);
      strCompanyNames = strCompanyNames.slice(0, -1);
    }
    else {
      this.allCompanyList.forEach(element => {
        strcompnay = strcompnay + element.id + "*"
        strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*"
      });
      strcompnay = strcompnay.slice(0, -1);
      strCompanyNames = strCompanyNames.slice(0, -1);
    }
    this.badgeauditinfo.selectedCompanies = strcompnay;
    this.badgeauditinfo.selectedCompaniesNames = strCompanyNames;
    this.badgeAuditService.Updateaudit(this.badgeauditinfo).subscribe((response: BadgeAuditDetails) => {
      this.router.navigate(["/admin/badgelisting"]).then(() => {
        this.router.navigate(['/admin/badgelistingedit'], {
          queryParams: {
            isEdit: 1,
            auditId: response.id
          }
        });
      });
    }, customError => {
      
      this.toastr.error(
        `Error occurred adding audit. 
                ${customError.error.ERROR[0]}`
      );
    });
  }

  addbadgeAudit(formdata: NgForm) {

    if (!this.isEdit) {
      //add
      this.badgeauditinfo.auditFromDate = new Date(this.fromToDates.fromDate.split("-").reverse().join("/"));
      this.badgeauditinfo.auditToDate = new Date(this.fromToDates.toDate.split("-").reverse().join("/"));
      this.badgeauditinfo.createdOn = new Date();
      this.badgeauditinfo.launchOn = new Date();
      if (this.isLaunched) {
        this.badgeauditinfo.status = "LAUNCHED";
      } else {
        this.badgeauditinfo.status = "DRAFT";
      }
      //this.badgeauditinfo.status = "DRAFT";
      let strcompnay = "";
      let strCompanyNames =""
      if (this.badgeauditinfo.auditType == "Targeted Audit") {
        this.selectedCompany.forEach(element => {
          strcompnay = strcompnay + element.id + "*";
          strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*";
        });
        strcompnay = strcompnay.slice(0, -1);
        strCompanyNames = strCompanyNames.slice(0, -1);
      }
      else {
        this.allCompanyList.forEach(element => {
          strcompnay = strcompnay + element.id + "*"
          strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*"
        });
        strcompnay = strcompnay.slice(0, -1);
        strCompanyNames = strCompanyNames.slice(0, -1);
      }
      this.badgeauditinfo.selectedCompanies = strcompnay;
      this.badgeauditinfo.selectedCompaniesNames = strCompanyNames;

      this.badgeAuditService.AddBadgeAudit(this.badgeauditinfo).subscribe((response: BadgeAuditDetails) => {
        this.router.navigate(["/admin/badgelisting"]).then(() => {
          this.router.navigate(['/admin/badgelistingedit'], {
            queryParams: {
              isEdit: 1,
              auditId: response.id,
              
            },skipLocationChange: true
          });
        });

      }, customError => {
        
        this.toastr.error(
          `Cannot Save this Audit. 
                  ${customError.error.ERROR[0]}`
        );
      });
    }
    else {
      //Edit
      this.badgeauditinfo.auditFromDate = new Date(this.fromToDates.fromDate.split("-").reverse().join("/"));
      this.badgeauditinfo.auditToDate = new Date(this.fromToDates.toDate.split("-").reverse().join("/"));
      if (this.badgeauditinfo.status != '') {
        if (this.isLaunched) {
          this.badgeauditinfo.status = "LAUNCHED";
        }
      }
      let strcompnay = '';
      let strCompanyNames =""
      if (this.badgeauditinfo.auditType == "Targeted Audit") {
        this.selectedCompany.forEach(element => {
          strcompnay = strcompnay + element.id + "*"
          strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*"
        });
        strcompnay = strcompnay.slice(0, -1);
        strCompanyNames = strCompanyNames.slice(0, -1);
      }
      else {
        this.allCompanyList.forEach(element => {
          strcompnay = strcompnay + element.id + "*"
          strCompanyNames = strCompanyNames + element.companyName.toLowerCase().trim() + "*"
        });
        strcompnay = strcompnay.slice(0, -1);
        strCompanyNames = strCompanyNames.slice(0, -1);
      }
      this.badgeauditinfo.selectedCompanies = strcompnay;
      this.badgeauditinfo.selectedCompaniesNames = strCompanyNames;
      this.badgeAuditService.EditBadgeAudit(this.badgeauditinfo).subscribe((response: BadgeAuditDetails) => {
        this.router.navigate(["/admin/badgelisting"]).then(() => {
          this.router.navigate(['/admin/badgelistingedit'], {
            queryParams: {
              isEdit: 1,
              auditId: response.id,
             
            },skipLocationChange: true
          });
        });
      }, customError => {
        
        this.toastr.error(
          `Error occurred adding audit. 
                  ${customError.error.ERROR[0]}`
        );
      });
    }



  }

}
