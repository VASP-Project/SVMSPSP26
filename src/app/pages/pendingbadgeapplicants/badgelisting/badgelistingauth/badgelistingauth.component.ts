import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseStatus } from '@app/app.component';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { ModalDismissReasons, NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuditCompanies, AuthSignerCountViewModel, BadgeAuditCompanyEmployee, BadgeAuditCompanyEmployeeList, BadgeAuditDetails, DataOutputModelemp, FromTODate } from '../badgelisting.model';
import { BadgelistingService } from '../badgelistingedit/badgelisting.service';

@Component({
  selector: 'app-badgelistingauth',
  templateUrl: './badgelistingauth.component.html',
  styleUrls: ['./badgelistingauth.component.scss']
})
export class BadgelistingauthComponent implements OnInit {
  public windowRef: Window;
  sortDir = 1;
  modalOptions: NgbModalOptions;
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
  confirmed: boolean = false;
  unaccountablereason: boolean = false;
  deactivatedReasons = [
    { label: "Lost", value: "Lost" },
    { label: "Stolen", value: "Stolen" },
    { label: "Separation", value: "Separation" },
    { label: "Conclusion of Operational Need", value: "Conclusion of Operational Need" }
  ]
  isDirty: boolean = false;
  badgeauditempinfo: BadgeAuditCompanyEmployee = new BadgeAuditCompanyEmployee();
  confirmCount: number = 0;
  pendingCount: number = 0;
  deactivatedCount: number = 0;
  closeResult: string = "";
  modalReference: NgbModalRef;
  selectedBadgeEmp: BadgeAuditCompanyEmployee = new BadgeAuditCompanyEmployee();
  commentauth: BadgeAuditDetails = new BadgeAuditDetails()
  fromToDates: FromTODate = new FromTODate();
  badgeauditinfo: BadgeAuditDetails = new BadgeAuditDetails();
  badgeauditcompany: AuditCompanies = new AuditCompanies();
  confirmAccountableCount: number = 0;
  confirmUnaccountableCount: number = 0;
  issued: number = 0;
  unaccountablePercent: number = 0;
  issuedbadgeaudit: BadgeAuditCompanyEmployeeList = new BadgeAuditCompanyEmployeeList();
  badgeAuditAuthCountViewModel: AuthSignerCountViewModel = new AuthSignerCountViewModel();
  ackCompanyAuth: AuditCompanies = new AuditCompanies();
  unaccountableDetails: string;
  badgeRecovered: string;
  submitDetails: BadgeAuditCompanyEmployee[] = [];
  ackauth: AuditCompanies[] = [];
  isSubmitDetails: boolean = false;
  public authAuditMsg: string;



  constructor(
    private modalService: NgbModal,
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private appURL: AppConfigService,
    //private CompanyService: CompanyService,
    private badgeAuditService: BadgelistingService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    console.log("In Constructor");
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  async ngOnInit(): Promise<void> {
    this.windowRef = window;
    this.queryParam.pageSize = 50
    this.queryParam.pageNumber = 1
    this.queryParam.maxPageSize = 50
    this.queryParam.selectedValue = 'All'
    this.config = {
      currentPage: 1,
      itemsPerPage: this.queryParam.pageSize
    };

    this.isEdit = +this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    this.auditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    this.isView = +this.route.snapshot.pathFromRoot[1].queryParams['isView'];
    this.fromToDates.unaccountableDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (this.auditId != 0) {
      this.isEdit = 1;
    }

    if (this.user.rolename == "AuthSigner") {
      this.isAuthsigner = true;
      await this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id)
      await this.GetBadgeAuditByDate(this.auditId)
      this.GetbadgeAuditAuthCountByCompany()
      this.submitauditAuthsigner()
      this.GetAcknowledgeByAuth()



    }


    // if (this.user.rolename == "AuthSigner") 
    // {
    //   if(this.ackauth.some(x=>x.acknowledge ==  false|| x.acknowledge == null)){
    //     this.authAuditMsg = this.appURL.getBadgeAuditMessage();

    //     $("#btnModal").click();
    // } 
    // }

  }
  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  public GetbadgeAuditAuthCountByCompany() {
    this.badgeAuditService.GetbadgeAuditAuthCountByCompany(this.auditId, this.user.id).subscribe((response: AuthSignerCountViewModel) => {
      this.badgeAuditAuthCountViewModel = response;
    }, (error: any) => {
      console.log("error list");

    });
  }

  async GetBadgeAuditByDate(id: number): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      //this.spinner.show();
      this.badgeAuditService.GetBadgeAuditByDate(this.auditId).subscribe((response: BadgeAuditDetails) => {
        this.badgeauditinfo = response;
        resolve()
      }, (error: any) => {
        //this.spinner.hide();
        console.log("error list");
        reject()
      });
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
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
  }
  async GetLaunchBadgeAuditByIdNew(id: number, userId: string): Promise<any> {
    //this.spinner.show();
    return new Promise<void>((resolve, reject) => {
      this.badgeAuditService.GetLaunchBadgeAuditByIdNew(this.queryParam, this.auditId, this.user.id).subscribe((response: DataOutputModelemp) => {
        this.launchbadgeauditlist = response.items;
        this.pageHeaders = response.paging
        resolve()
        //this.dtTrigger.next();
      }, (error: any) => {
        //this.spinner.hide();
        console.log("error list");
        reject()
      });
      //this.spinner.hide();
    });
  }
  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
  }
  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
  }

  onSelectedValueChange(value): void {
    this.queryParam.selectedValue = this.queryParam.selectedValue
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
    // if (value == 'All') {
    //   this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id)
    // }
    // if (value == 'Accountable') {
    //   this.launchbadgeauditlist.sort((a, b) => {
    //     if (a.accountable == b.accountable) {
    //       return 0;
    //     }
    //     if (a.accountable) {
    //       return 1;
    //     }
    //     if (b.accountable) {
    //       return -1;
    //     }
    //   })
    // }

    // if (value == 'Confirmed') {
    //   this.launchbadgeauditlist.sort((a, b) => {
    //     if (a.accountable == b.accountable) {
    //       return 0;
    //     }
    //     if (a.accountable) {
    //       return -1;
    //     }
    //     if (b.accountable) {
    //       return 1;
    //     }
    //   })
    // }
  }
  searchtable() {
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
  }

  clearSearch() {
    this.queryParam.searchQuery = "";
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
  }
  
  confirm(item: BadgeAuditCompanyEmployee) {
    item.accountable = true;

    this.badgeAuditService.EditBadgeAuditEmployee(item).subscribe((response: BadgeAuditCompanyEmployee) => {
      this.GetbadgeAuditAuthCountByCompany();
      this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);
    });

  }


  reason(item: BadgeAuditCompanyEmployee) {
    item.accountable = false;
    this.confirmAccountableCount = this.launchbadgeauditlist.filter(c => c.empStatus == 1).length;
    this.confirmUnaccountableCount = this.launchbadgeauditlist.filter(c => c.empStatus == 2).length;
    this.confirmCount = this.confirmAccountableCount + this.confirmUnaccountableCount;
    this.pendingCount = this.launchbadgeauditlist.filter(c => c.empStatus == 0).length;
    this.deactivatedCount = this.launchbadgeauditlist.filter(c => c.empStatus == 3).length;
    this.unaccountablePercent = (this.confirmUnaccountableCount * 100) / this.issued;
    this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id);


  }

  updateEmp() {
    this.selectedBadgeEmp.unaccountableDate = new Date(this.fromToDates.unaccountableDate.split("-").reverse().join("/"));
    if (this.selectedBadgeEmp.deactivatedReason == '' || this.selectedBadgeEmp.deactivatedReason == null) {
      this.toastr.error("Enter Unaccountable Reason");
      return;
    }
    else if (this.fromToDates.unaccountableDate == null) {
      this.toastr.error("Enter Reason Date");
      return;
    }
    else {
      this.selectedBadgeEmp.accountable = false;
      //this.selectedBadgeEmp.unaccountableDate = new Date(this.fromToDates.unaccountableDate.split("-").reverse().join("/"));
      //this.selectedBadgeEmp.comment = 
      this.badgeAuditService.EditBadgeAuditEmployee(this.selectedBadgeEmp).subscribe((response: BadgeAuditCompanyEmployee) => {
        this.GetbadgeAuditAuthCountByCompany();
        this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id)
        this.modalService.dismissAll();
      });

    }

  }

  submitaudit() {

    this.badgeAuditService.UpdateSubmitAudit(this.auditId, this.user.id).subscribe((response: BadgeAuditCompanyEmployee) => {
      this.toastr.success("Audit submitted successfully")
      this.router.navigate(['/admin/badgelisting']);
      //this.isSubmitDetails = true;
      this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id)
    }, customError => {

      this.toastr.error(
        ` 
                ${customError.error.ERROR[0]}`
      );
      this.router.navigate(['/admin/badgelistingauth']);
    });
    //this.router.navigate(['/admin/badgelisting']);

  }

  showemployee(content, model: BadgeAuditCompanyEmployee) {
    this.selectedBadgeEmp = model;
    this.modalReference = this.modalService.open(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showunaccountable(content, model: BadgeAuditCompanyEmployee) {
    // this.auditId = model.auditId;
    this.selectedBadgeEmp = model;
    if (this.selectedBadgeEmp.badgeRecovered == true) {
      this.badgeRecovered = 'Yes';
    } else {
      this.badgeRecovered = 'No';
    }
    this.modalReference = this.modalService.open(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  close() {
    this.selectedBadgeEmp = new BadgeAuditCompanyEmployee();
    this.modalService.dismissAll();
  }

  refresh() {
    var msg = " Do you want to Refresh Badge Audit? ";
    if (confirm(msg)) {

      this.badgeAuditService.RefreshBadgeAudit(this.badgeauditinfo).subscribe((response: BadgeAuditDetails) => {
        this.toastr.success("Active employee refresh successful")
        this.router.navigate(["/admin/badgelisting"]).then(() => {
          this.router.navigate(['/admin/badgelistingauth'], {

            queryParams: {
              auditId: response.id,
              isEdit: 1,
              isView: 1
            }, skipLocationChange: true
          });
        });

      }
        ,);
    }
  }

  submitauditAuthsigner() {
    this.badgeAuditService.GetBadgeAuditSubmitById(this.auditId, this.user.id).subscribe((badgeaudit: BadgeAuditCompanyEmployee[]) => {
      this.submitDetails = badgeaudit;
      // this.submitcount = this.launchbadgeaudit.filter(c => c.isSubmitted == true).length;
      if (this.submitDetails.some(x => x.isSubmitted == false || x.isSubmitted == null)) {
        this.isSubmitDetails = true;
      }
    }, customError => {

      this.toastr.error(
        ` 
                ${customError.error.ERROR[0]}`
      );
    });;
    //this.router.navigate(['/admin/badgelisting']);
  }


  authComment() {
    this.badgeAuditService.EditUpdateSummary(this.auditId, this.user.id, this.badgeauditcompany).subscribe((response: AuditCompanies) => {
      this.GetbadgeAuditAuthCountByCompany();
      this.GetLaunchBadgeAuditByIdNew(this.auditId, this.user.id)
    });

  }
  openModal(template: TemplateRef<any>) {

    // this.modalRef = this.modalService.show(template,
    //   { class: "modal-sm backdrop", backdrop: 'static', keyboard: false });

    this.modalService.open(template, this.modalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  closeAuth() {
    this.selectedBadgeEmp = new BadgeAuditCompanyEmployee();
    this.modalService.dismissAll();
  }
  saveAck() {
    this.badgeAuditService.addAcknowledge(this.auditId, this.user.id).subscribe((badgeaudit: AuditCompanies[]) => {
      this.ackauth = badgeaudit;
      // this.submitcount = this.launchbadgeaudit.filter(c => c.isSubmitted == true).length;
      // if(this.submitDetails.some(x=>x.isSubmitted ==  false|| x.isSubmitted == null)){
      //   this.isSubmitDetails = true;
      // }
    }, customError => {

      this.toastr.error(
        ` 
                ${customError.error.ERROR[0]}`
      );
    });;

  }
  // saveSubmit(){
  //   this.badgeAuditService.AddSubmit(this.auditId, this.user.id).subscribe((badgeaudit: AuditCompanies[]) => {
  //     this.ackauth = badgeaudit;
  //    // this.submitcount = this.launchbadgeaudit.filter(c => c.isSubmitted == true).length;
  //     // if(this.submitDetails.some(x=>x.isSubmitted ==  false|| x.isSubmitted == null)){
  //     //   this.isSubmitDetails = true;
  //     // }
  //     }, customError => {

  //       this.toastr.error(
  //         ` 
  //                 ${customError.error.ERROR[0]}`
  //       );
  //     });;

  // }
  public GetAcknowledgeByAuth() {
    this.badgeAuditService.GetAcknowledgeByAuth(this.auditId, this.user.id).subscribe((response: AuditCompanies) => {
      //this.ackauth = response;
      if(response!=null)
      {
        this.badgeauditcompany = response;
        if (this.badgeauditcompany.acknowledge == false) {
          this.authAuditMsg = this.appURL.getBadgeAuditMessage();
  
          $("#btnModal").click();
        }
        if (this.badgeauditcompany.isSubmitted == false) {
          this.isSubmitDetails = true;
        }
      }
    
    }, (error: any) => {
      console.log("error list");

    });
  }

}
