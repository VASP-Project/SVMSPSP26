import { Component, ElementRef, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CitationDetails, CitationSearch, DataOutputModel, MobileViewData } from "../CitationDetails";
import { NovService } from "../nov.service";
import { DatePipe } from "@angular/common";
// import { CaseStatus } from "src/app/app.component";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
// import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { ModalDismissReasons, NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef } from "@angular/core";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { PagingHeader, QueryStringParameters } from "@app/shared/shared.model";
import { SafeHtml } from "@angular/platform-browser";


@Component({
  selector: "app-novlist",
  templateUrl: "./novlist.component.html",
  styleUrls: ["./novlist.component.scss"],
  // host: {
  //   "(window:resize)": "onResize()"
  // }
})


export class NovlistComponent implements OnInit {
  sortDir = 1; //1= 'ASE' -1= DSC
  queryParam: QueryStringParameters = new QueryStringParameters();
  mobileViewData: MobileViewData = new MobileViewData();
  pageHeaders: PagingHeader = new PagingHeader();
  config: any;
  public windowRef: Window;
  // @ViewChild('template', { static: false })
  @ViewChild("template") modalContent: TemplateRef<any>;
  modalOptions:NgbModalOptions;
  user!: any;
  isStaffAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isSuperAdmin: boolean = false;
  isIssuer: boolean = true;
  isTSA: boolean = false;
  citationList: CitationDetails[] = [];
  citationListAll: CitationDetails[] = [];
  isClone: boolean = false;
  citation: CitationDetails = new CitationDetails();
  isAdvanceSearch: boolean = false;
  // dtElement: DataTableDirective;
  dtOptions: any = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  dynamicArray: Array<any> = [];
  newDynamic: any = {};
  public securityMsg: string;
  // modalRef: BsModalRef;
  fromLogin: number; 
  isDesc: boolean = false;
  closeResult: string;
  isConcessionaireUser : boolean = false;
  readonly DELIMITER = '/';
  advancedSearchOptions = [
    {label: "First Name", value: "FirstName"},
    {label: "Last Name", value: "LastName"},
    {label: "Violator Birth Date", value: "ViolatorDOB"},
    {label: "Security Badge#", value: "SecurityBadgeNo"},
    {label: "Company", value: "Company"},
    {label: "Category", value: "ViolationType"},
    {label: "Incident Report#", value: "OPDPoliceReport"},
    {label: "Citation Date", value: "ViolationDate"},
    {label: "Summary Of Violation", value: "Summary"},
    {label: "NOV Notes", value: "NOVNotes"},
    {label: "Case Status", value: "CaseStatus"},
  ]

  fromToDates: CitationSearch = new CitationSearch();
  fromDate: string;
  toDate: string;

  @ViewChild('chatBox') private chatBox!: ElementRef;
    userInput = '';
    //closeResult: string = "";
    messages: { text: string | SafeHtml; sender: 'user' | 'bot' }[] = [];
 
  constructor(
    private router: Router,
    private NovService: NovService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private appURL: AppConfigService,
    // private modalService: BsModalService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,

  ) {
    console.log("In Constructor");
    this.modalOptions = {
      backdrop:'static',
      backdropClass:'customBackdrop'
    }
  }

  ngOnInit() {
    this.mobileViewData.pageSize = 10;
    this.mobileViewData.pageNumber = 1;
    this.mobileViewData.maxPageSize = 10;
    this.config = {
      currentPage: 1,
      itemsPerPage: this.mobileViewData.pageSize,
    };

    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    // console.log(this.user)
 

    sessionStorage.setItem("tab", "");
    this.newDynamic = { fieldName: "", fieldValue: "" };
    this.dynamicArray.push(this.newDynamic);

    if (this.user.rolename == "Concessionaire User") {
     this.isConcessionaireUser = true;
    }else{
      this.isConcessionaireUser = false
    }

// this.fromLogin = this.route.snapshot.pathFromRoot[1].queryParams['fromLoginPage'];
//     if (this.fromLogin != undefined) {
//       if (this.fromLogin == 1) {
//         this.securityMsg = this.appURL.getSecurityMessage();
//         //this.openModal(this.template);
//         $("#btnModal").click();
//         //document.getElementById('#btnModal').click();

        
//         // this.modalService.open(this.modalContent, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
//         //   this.closeResult = `Closed with: ${result}`;
//         // }, (reason) => {
//         //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//         // });
//       }
//     }

   
    
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      responsive:true,
      order: [[0, 'desc']],
      columnDefs: [
        { targets: 0, type: 'date' },
        { targets: 6, type: 'date' },
        { targets: 3, width: '10%'},
        { targets: 7, width: '20%'},
        { targets: 9, width: '12%'}
      ],
      // dom: 'lBfrtip',
      dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-2'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: {
        buttons: [
          {
            extend: 'csv',
            title: 'Citation Listing',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7]
            },
            className: 'btn btn-sm btn-primary'
          },
          {
            extend: 'excel',
            title: 'Citation Listing',
            exportOptions: {
              columns: [1, 2, 3, 4, 5, 6, 7]
            },
            className: 'btn btn-sm btn-primary'
          }
        ],
        dom: {
          button: {
            className: 'btn'
          }
        }
      }
      // retrieve: true,
    };

    this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())      
    // this.fromDate= this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 15)),'MM/dd/yyyy'); 
    this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(),'d',30))
    // this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    // this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    //Read from session and bind to frommodels
    var citaionSearch = JSON.parse(sessionStorage.getItem("citationSearch"));
    if(citaionSearch!=null)
    {
    this.fromToDates = citaionSearch;
    }

    
   this.windowRef = window;
    if (this.windowRef.innerWidth < 768) {
      if (this.user.rolename == "Issuer") {
        this.isStaffAdmin = false;
        this.isAuthsigner = false;
        this.isIssuer = true;
        this.isTSA = false;
        this.GetCitationListMobileView(0);
      } else if (this.user.rolename == "StaffAdmin") {
        this.isStaffAdmin = true;
        this.isAuthsigner = false;
        this.isIssuer = false;
        this.isTSA = false;
        this.GetCitationListMobileView(0);
      } else if (this.user.rolename == "AuthSigner") {
        this.isStaffAdmin = false;
        this.isAuthsigner = true;
        this.isIssuer = false;
        this.isTSA = false;
        this.GetCitationDetailsAuthSignerForMobileView(this.user.id);
      } else if (this.user.rolename == "TSA User") {
        this.isStaffAdmin = true;
        this.isAuthsigner = true;
        this.isIssuer = false;
        this.isTSA = true;
        this.GetCitationDetailsTsaForMobileView(0);
      } else {
        //SuperADmin
        this.isSuperAdmin = true;
        this.isStaffAdmin = true;
        this.isAuthsigner = false;
        this.isIssuer = false;
        this.GetCitationListMobileView(0);
      }
    }
    if (this.windowRef.innerWidth >= 768) {
      if (this.user.rolename == "Issuer") {
        this.isStaffAdmin = false;
        this.isAuthsigner = false;
        this.isIssuer = true;
        this.isTSA = false;
        this.GetCitationList(0);
      } else if (this.user.rolename == "StaffAdmin") {
        this.isStaffAdmin = true;
        this.isAuthsigner = false;
        this.isIssuer = false;
        this.isTSA = false;
        this.GetCitationList(0);
      } else if (this.user.rolename == "AuthSigner") {
        this.isStaffAdmin = false;
        this.isAuthsigner = true;
        this.isIssuer = false;
        this.isTSA = false;
        this.GetCitationListAuthSigner(this.user.id);
      } else if (this.user.rolename == "TSA User") {
        this.isStaffAdmin = true;
        this.isAuthsigner = true;
        this.isIssuer = false;
        this.isTSA = true;
        this.GetCitationListTsa(0);
      } else {
        //SuperADmin
        this.isSuperAdmin = true;
        this.isStaffAdmin = true;
        this.isAuthsigner = false;
        this.isIssuer = false;
        this.GetCitationList(0);
      }
    }  
    //this.onResize();
  
    
  }

   ngAfterViewInit(): void {
    this.fromLogin = this.route.snapshot.pathFromRoot[1]?.queryParams['fromLoginPage'];

    if (this.fromLogin == 1 && this.modalContent) {
      this.securityMsg = this.appURL.getSecurityMessage();

      setTimeout(() => {
        this.modalService.open(this.modalContent, {
          ariaLabelledBy: 'modal-basic-title',
          windowClass: 'auto-width-modal',
          backdrop: 'static'
        });
      });
    }
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month : parseInt(date[0], 10),
        day : parseInt(date[1], 10),
        year : parseInt(date[2], 10)
      };
    }
    return null;
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


  showAdvanceSearch() {    
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    return user.rolename == 'StaffAdmin';

  }

  showEditButton(item: any) {
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    return (this.user.rolename != 'TSA User' && this.user.rolename == 'Issuer' && (item.currentCitationStatusId == 1 || item.currentCitationStatusId == 7) && item.currentCitationStatusId != 5
      && this.user.id == item.createdBy)
      || (this.user.rolename == 'StaffAdmin' && item.currentCitationStatusId != 5)
      || (this.user.rolename == 'AuthSigner' && (item.currentCitationStatusId == 3 || item.currentCitationStatusId == 8))
      || this.user.rolename == 'Superadmin'
  }
  
  onResize() {
    var navbar = document.getElementsByClassName("table")[0];
    if (window.innerWidth < 993) {
      // && !this.isCollapsed) {
      navbar.classList.add("table-responsive");
    } else {
      navbar.classList.remove("table-responsive");
    }
  }

  addRow(index) {
    this.newDynamic = { fieldName: "", fieldValue: "" };
    this.dynamicArray.push(this.newDynamic);
    return true;
  }

  deleteRow(index) {
    if (this.dynamicArray.length == 1) {
      // this.toastr.error("Can't delete the row when there is only one row", 'Warning');
      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      return true;
    }
  }
  // addNov() {
  //   this.router.navigate(["admin/nov/novaddedit"]);
  // }

  public GetCitationListTsa(companyId) {
    //this.spinner.show();
    this.citationList = [];
    this.citationListAll = [];
    $("#dt1")
      .DataTable()
      .destroy();
    var details = {
      CompanyId : companyId,
      FirstName : this.fromToDates.violatorFirstName,
      LastName  : this.fromToDates.violatorLastName,
      DOB : this.fromToDates.violatorBirthDate == '' ? this.fromToDates.violatorBirthDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.violatorBirthDate)),
      FromDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate)),
      ToDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    }
    this.NovService.GetCitationDetailsTsa(details).subscribe(
      (response: CitationDetails[]) => {
        if (this.user.rolename == "Superadmin") {
          this.citationListAll = response.filter(x => x.status === 'Closed');
          this.citationList = response.filter(x => x.status === 'Closed');
          this.dtTrigger.next();
          //this.spinner.hide();
        }
        else {

          this.citationListAll = response;
          this.citationList = response;
          this.dtTrigger.next();
          //this.spinner.hide();
        }

      },
      (error:any)=> {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

  public GetCitationDetailsTsaForMobileView(companyId) {
    //this.spinner.show();
    $("#dt1").DataTable().destroy();
    this.citationList = [];
    this.citationListAll = [];
    (this.mobileViewData.CompanyId = companyId),
      (this.mobileViewData.FirstName = this.fromToDates.violatorFirstName),
      (this.mobileViewData.LastName = this.fromToDates.violatorLastName),
      (this.mobileViewData.DOB =
        this.fromToDates.violatorBirthDate == ""
          ? this.fromToDates.violatorBirthDate
          : this.dateAdapter.toModel(
              this.fromModel(this.fromToDates.violatorBirthDate)
            )),
      (this.mobileViewData.FromDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.fromDate)
      )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.NovService.GetCitationDetailsTsaForMobileView(
      this.mobileViewData
    ).subscribe(
      (response: DataOutputModel) => {
        if (this.user.rolename == "Superadmin") {
          this.citationListAll = response.items.filter(
            (x) => x.status === "Closed"
          );
          this.citationList = response.items.filter(
            (x) => x.status === "Closed"
          );
          this.pageHeaders = response.paging;
          this.dtTrigger.next();
          //this.spinner.hide();
        } else {
          this.citationListAll = response.items;
          this.citationList = response.items;
          this.pageHeaders = response.paging;
          this.dtTrigger.next();
          //this.spinner.hide();
        }
      },
      (error: any) => {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

  public GetCitationList(companyId) {
    //this.spinner.show();
    $("#dt1")
      .DataTable()
      .destroy();
    this.citationList = [];
    this.citationListAll = [];
    var details = {
      CompanyId : companyId,
      FirstName : this.fromToDates.violatorFirstName,
      LastName  : this.fromToDates.violatorLastName,
      DOB : this.fromToDates.violatorBirthDate == '' ? this.fromToDates.violatorBirthDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.violatorBirthDate)),
      FromDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate)),
      ToDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    }
    this.NovService.GetCitationDetails(details).subscribe(
      (response: CitationDetails[]) => {        

        if (this.user.rolename == "Superadmin") {
          this.citationListAll = response;
          this.citationList = response;          
            this.dtTrigger.next();
          //this.spinner.hide();
        }
        else {
          if (this.user.rolename != "TSA User") {
              this.citationListAll = response;
              this.citationList = response;
            
          }
          else {

          }
            this.dtTrigger.next();          
          //this.spinner.hide();
        }

      },
      (error:any)=> {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

  public GetCitationListMobileView(companyId) {
    //this.spinner.show();
    $("#dt1").DataTable().destroy();
    this.citationList = [];
    this.citationListAll = [];
    (this.mobileViewData.CompanyId = companyId),
      (this.mobileViewData.FirstName = this.fromToDates.violatorFirstName),
      (this.mobileViewData.LastName = this.fromToDates.violatorLastName),
      (this.mobileViewData.DOB =
        this.fromToDates.violatorBirthDate == ""
          ? this.fromToDates.violatorBirthDate
          : this.dateAdapter.toModel(
              this.fromModel(this.fromToDates.violatorBirthDate)
            )),
      (this.mobileViewData.FromDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.fromDate)
      )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.NovService.GetCitationDetailsNew(this.mobileViewData).subscribe(
      (response: DataOutputModel) => {
        if (this.user.rolename == "Superadmin") {
          this.citationListAll = response.items;
          this.citationList = response.items;
          this.pageHeaders = response.paging;
          this.dtTrigger.next();
          //this.spinner.hide();
        } else {
          if (this.user.rolename != "TSA User") {
            this.citationListAll = response.items;
            this.citationList = response.items;
            this.pageHeaders = response.paging;
          } else {
          }
          this.dtTrigger.next();
          //this.spinner.hide();
        }
      },
      (error: any) => {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

  onPageChange(newPage: number): void {
    this.mobileViewData.pageNumber = newPage;
    if (this.user.rolename == "AuthSigner") {
      this.GetCitationDetailsAuthSignerForMobileView(this.user.id);
    } else if (this.user.rolename == "TSA User") {
      this.GetCitationDetailsTsaForMobileView(0);
    } else {
      this.GetCitationListMobileView(0);
    }
  }
  onPageSizeChange(): void {
    this.mobileViewData.pageSize = +this.mobileViewData.pageSize;
    this.mobileViewData.maxPageSize = +this.mobileViewData.pageSize;
    if (this.user.rolename == "AuthSigner") {
      this.GetCitationDetailsAuthSignerForMobileView(this.user.id);
    } else if (this.user.rolename == "TSA User") {
      this.GetCitationDetailsTsaForMobileView(0);
    } else {
      this.GetCitationListMobileView(0);
    }
  }
  searchtable() {
    if (this.user.rolename == "AuthSigner") {
      this.GetCitationDetailsAuthSignerForMobileView(this.user.id);
    } else if (this.user.rolename == "TSA User") {
      this.GetCitationDetailsTsaForMobileView(0);
    } else {
      this.GetCitationListMobileView(0);
    }
  }

  public GetCitationListAuthSigner(id) {
    //this.spinner.show();
    $("#dt1")
      .DataTable()
      .destroy();
    this.citationList = [];
    this.citationListAll = [];
    var details = {
      FirstName : this.fromToDates.violatorFirstName,
      LastName  : this.fromToDates.violatorLastName,
      DOB : this.fromToDates.violatorBirthDate == '' ? this.fromToDates.violatorBirthDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.violatorBirthDate)),
      FromDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate)),
      ToDate : this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate)),
      UserId : id
    }
    this.NovService.GetCitationDetailsAuthSigner(details).subscribe(
      (response: CitationDetails[]) => {
        this.citationListAll = response;
        this.citationList = response;
        this.dtTrigger.next();
        //this.spinner.hide();
      },
      (error:any)=> {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

  public GetCitationDetailsAuthSignerForMobileView(id) {
    //this.spinner.show();
    $("#dt1").DataTable().destroy();
    this.citationList = [];
    this.citationListAll = [];
    (this.mobileViewData.UserId = id),
      (this.mobileViewData.FirstName = this.fromToDates.violatorFirstName),
      (this.mobileViewData.LastName = this.fromToDates.violatorLastName),
      (this.mobileViewData.DOB =
        this.fromToDates.violatorBirthDate == ""
          ? this.fromToDates.violatorBirthDate
          : this.dateAdapter.toModel(
              this.fromModel(this.fromToDates.violatorBirthDate)
            )),
      (this.mobileViewData.FromDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.fromDate)
      )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.NovService.GetCitationDetailsAuthSignerForMobileView(
      this.mobileViewData
    ).subscribe(
      (response: DataOutputModel) => {
        if (this.user.rolename == "Superadmin") {
          this.citationListAll = response.items;
          this.citationList = response.items;
          this.pageHeaders = response.paging;
          this.dtTrigger.next();
          //this.spinner.hide();
        } else {
          if (this.user.rolename != "TSA User") {
            this.citationListAll = response.items;
            this.citationList = response.items;
            this.pageHeaders = response.paging;
          } else {
          }
          this.dtTrigger.next();
          //this.spinner.hide();
        }
      },
      (error: any) => {
        console.log("error list");
        //this.spinner.hide();
      }
    );
  }

   basicSearchCitations() {     
     sessionStorage.setItem("citationSearch",JSON.stringify(this.fromToDates));
     if(this.user.rolename == 'AuthSigner')
     {
       this.GetCitationListAuthSigner(this.user.id)
     }
     else if(this.user.rolename == 'TSA User')
     {
       this.GetCitationListTsa(0)
     }
     else
     {
      this.GetCitationList(0) 
     }
     
    // $("#dt1").DataTable().destroy();
      
    // var list = this.citationListAll;
    // var date = this.datePipe;
    // if (this.citation.violatorFirstName != "") {
    //   list = list.filter(c =>
    //     c.violatorFirstName
    //       .toLowerCase()
    //       .includes(this.citation.violatorFirstName.toLowerCase())
    //   );
    // }
    // if (this.citation.violatorLastName != "") {
    //   list = list.filter(c =>
    //     c.violatorLastName
    //       .toLowerCase()
    //       .includes(this.citation.violatorLastName.toLowerCase())
    //   );
    // }
    // this.citation.violatorBirthDate = this.dateAdapter.toModel(this.fromModel(this.citation.violatorBirthDate))
    // if (
    //   this.citation.violatorBirthDate != "mm/dd/yyyy" &&
    //   this.citation.violatorBirthDate != undefined
    // ) {
    //   list = list.filter(
    //     c =>
    //       date.transform(c.violatorBirthDate, "yyyy-MM-dd") ==
    //       date.transform(this.citation.violatorBirthDate, "yyyy-MM-dd")
    //   );
    // }
    // this.citationList = list;
    // this.dtTrigger.next();
    // this.isClone = true;
    
  }

  clearSearch() {
    this.mobileViewData.searchQuery = "";
    if (this.user.rolename == "Issuer") {
      this.isStaffAdmin = false;
      this.isAuthsigner = false;
      this.isIssuer = true;
      this.isTSA = false;
      this.GetCitationListMobileView(0);
    } else if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
      this.isAuthsigner = false;
      this.isIssuer = false;
      this.isTSA = false;
      this.GetCitationListMobileView(0);
    } else if (this.user.rolename == "AuthSigner") {
      this.isStaffAdmin = false;
      this.isAuthsigner = true;
      this.isIssuer = false;
      this.isTSA = false;
      this.GetCitationDetailsAuthSignerForMobileView(this.user.id);
    } else if (this.user.rolename == "TSA User") {
      this.isStaffAdmin = true;
      this.isAuthsigner = true;
      this.isIssuer = false;
      this.isTSA = true;
      this.GetCitationDetailsTsaForMobileView(0);
    } else {
      //SuperADmin
      this.isSuperAdmin = true;
      this.isStaffAdmin = true;
      this.isAuthsigner = false;
      this.isIssuer = false;
      this.GetCitationListMobileView(0);
    }
  }

  convertDate(date): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }

  identify(index, item) {
    return item.id;
  }

  searchCitations() {
    var list = this.citationListAll;
    var date = this.datePipe;
    this.fromToDates.violatorFirstName = "";
    this.fromToDates.violatorLastName = "";
    this.fromToDates.violatorBirthDate = "";
    this.dynamicArray.forEach(function (value) {
      $("#dt1")
        .DataTable()
        .destroy();
      switch (value.fieldName) {
        case "FirstName": {
          list = list.filter(c =>
            c.violatorFirstName
              .toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "LastName": {
          list = list.filter(c =>
            c.violatorLastName
              .toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "ViolatorDOB": {
          list = list.filter(
            c =>
              date.transform(c.violatorBirthDate, "yyyy-MM-dd") ==
              date.transform(value.fieldValue, "yyyy-MM-dd")
          );
          break;
        }
        case "SecurityBadgeNo": {
          list = list.filter(c =>
            c.securityBadgeNo.toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "Company": {
          list = list.filter(c =>
            c.companyName.toLowerCase().includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "ViolationType": {
          list = list.filter(c =>
            c.violationType
              .toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "OPDPoliceReport": {
          list = list.filter(c =>
            c.opdPoliceReport
              .toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "ViolationDate": {
          list = list.filter(
            c =>
              date.transform(c.violationDate, "yyyy-MM-dd") ==
              date.transform(value.fieldValue, "yyyy-MM-dd")
          );
          break;
        }
        case "Summary": {
          list = list.filter(c =>
            c.summaryOfViolation
              .toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "NOVNotes": {
          list = list.filter(c =>
            c.novNotes.toLowerCase().includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "CaseStatus": {
          list = list.filter(c =>
            c.statusDisplayName.toLowerCase().includes(value.fieldValue.toLowerCase())
          );
          break;
        }
      }
    });
    this.citationList = list;
    this.dtTrigger.next();
    this.isClone = true;
  }

  clearCitations() {
    $("#dt1")
      .DataTable()
      .destroy();
    // this.citation = new CitationDetails();
    this.fromToDates.companyId = 0
    this.fromToDates.violatorFirstName = ""
    this.fromToDates.violatorLastName = ""
    this.fromToDates.violatorBirthDate = ""
    this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())      
    this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(),'d',30))
    this.citationList = [];
    this.citationListAll = [];
    this.isClone = false;
    var companyId: number = 0;
    if (this.user.rolename == "AuthSigner") {
      companyId = this.user.companyId;
    }

    if(this.user.rolename == 'AuthSigner')
     {
       this.GetCitationListAuthSigner(this.user.id)
     }
     else if(this.user.rolename == 'TSA user')
     {
       this.GetCitationListTsa(0)
     }
     else
     {
      this.GetCitationList(0) 
     }
    this.dynamicArray = [];
    this.newDynamic = { fieldName: "", fieldValue: "" };
    this.dynamicArray.push(this.newDynamic);
  }

  DeleteCitation(id) {

    if (confirm("Are you sure you want to delete Citation?")) {
      this.NovService.DeleteCitationDetails(id).subscribe(
        (response: Response) => {
          this.toastr.success("Citation Deleted Sucessfully!");
          $('#dt1').DataTable().destroy();
          this.GetCitationList(0);

        },
        (error:any)=> {
          this.toastr.error("Error deleting Citation. Try Again!");
          //this.spinner.hide();
        }
      );
    }
    else {

    }

  }

  clickSearch() {
    this.citation = new CitationDetails();
    this.fromToDates.violatorFirstName = ""
    this.fromToDates.violatorLastName = ""
    this.fromToDates.violatorBirthDate = ""
    
    if (this.isAdvanceSearch == true) {
      this.isAdvanceSearch = false;     
    }
    else {
      this.isAdvanceSearch = true;      
    }

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

  sortTable()
  {
    this.isDesc = !this.isDesc; //change the direction
    //this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.citationList.sort(function (a, b) {
      var dateA = new Date(a.violationDate).getTime();
      var dateB = new Date(b.violationDate).getTime();
      //return dateA > dateB ? 1 : -1;
      if (dateA < dateB) {
        return -1 * direction;
      }
      else if (dateA > dateB) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  }


   openModalPeri(templatePerimeter: TemplateRef<any>) {
    
   
    this.modalService.open(templatePerimeter, { ariaLabelledBy: 'modal-basic-title', size: 'l' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  close() {
    this.modalService.dismissAll();
  }
}
