import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AppConfigService } from "@app/_services/appconfigservice ";
import {
  ModalDismissReasons,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CompanyService } from "../master/company/company.service";
import { Subject } from "rxjs";
import { CompanyMasterService } from "../master/concessionaire-item-master/company-master.service";
import {
  FormDataModel,
  ProhibitedAuditSummary,
  ProhibitedDetails,
  ProhibitedItemAudit,
  ProhibitedItemForAudit,
} from "../master/concessionaire-security/concessionaire.model";
import { DataTableDirective } from "angular-datatables";
import { Company } from "../master/company";
import { InspectionrecordService } from "../inspectionrecord/inspectionrecord.service";
import { FromTODate } from "../incidentreport/incidentreport.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-concessionssecurityaudit",
  templateUrl: "./concessionssecurityaudit.component.html",
  styleUrls: ["./concessionssecurityaudit.component.scss"],
})
export class ConcessionssecurityauditComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  
  dtElement: DataTableDirective;
  @ViewChild("opdAlert", { static: true }) opdAlert!: TemplateRef<any>;
  queryParam1 = {
    pageNumber: 1,
    pageSize: 10,
    maxPageSize: 10,
  };

  pageHeaders1 = {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
  };
  pagedProhibitedItemList: any[] = [];
  @ViewChild("template2", { static: true }) template2!: TemplateRef<any>;

  // @ViewChild('opdAlert')
  // opdAlert!: TemplateRef<any>;

  fromToDates: FromTODate = new FromTODate();
  fromDate: string;
  toDate: string;
  selectedLogType: string;
  clonedItems: any[] = [];
  modalInstance: any;
  closeResult: any;
  user: any;
  displayTable = false;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  isAuthsigner: boolean = false;
  isStaffAdmin: boolean = false;
  isConcessionaireUser: boolean;
  prohibitedList: ProhibitedAuditSummary[] = [];
  prohibitedItemList: ProhibitedItemAudit[] = [];
  prohibitedItemModel = new ProhibitedItemAudit();
  prohibitedAuditModel: ProhibitedAuditSummary = new ProhibitedAuditSummary();
  LogId: number = 0;
  allCompanyList: Company[];
  onselectedCompany: Company | null = null;
  selectedCompany: string = "";
  selectedAuditCount: string = "";
  selectedcompanylocation: string = "";
  auditedBy: string;
  isMobileView = window.innerWidth <= 768;
  // itemTemplate = [
  //   {
  //     photo:
  //       "https://5.imimg.com/data5/SELLER/Default/2023/4/297329234/UX/PZ/JY/28869292/craft-paper-cutting-scissor-1000x1000.jpg",
  //     description: "Scissors: Handheld cutting tool...",
  //     qtyApproved: 9,
  //     qtyUsed: 4,
  //     dateApproved: "01/24/2025",
  //     // status: 'Submitted',
  //     confirmed: false,
  //   },
  //   {
  //     photo:
  //       "https://5.imimg.com/data5/SELLER/Default/2024/3/400571400/MF/CY/TK/1096757/lockers-500x500.jpg",
  //     description: "Locker: Secure storage...",
  //     qtyApproved: 9,
  //     qtyUsed: 8,
  //     dateApproved: "04/12/2025",
  //     // status: 'Submitted',
  //     confirmed: false,
  //   },
  // ];

  items = [
    { name: "Item 1", status: "" },
    { name: "Item 2", status: "" },
  ];

  formDataModel = new FormDataModel();
  showLink: boolean = false;
  citationId: number;
  pendingAuditId: number | null = null;
  submitteddate: string;
  prohibitedItemForAudit: ProhibitedItemForAudit = new ProhibitedItemForAudit();
  prohibitedItemForAuditList: ProhibitedItemForAudit[] = [];
  auditNo: number;
  auditLocationId:number
  completedAuditCount:number
  modalOptions: NgbModalOptions;
  constructor(
    private ref: ChangeDetectorRef,
    private companyMasterService: CompanyMasterService,
    private appURL: AppConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private CompanyService: CompanyService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private inspservice: InspectionrecordService,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private sanitizer: DomSanitizer
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg',      
      keyboard: false
    }
  }
  ngOnInit(): void {
    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    this.auditedBy = this.user.id;
    this.fromToDates.toDate = this.dateAdapter.toModel(
      this.ngbCalendar.getToday()
    );
    this.fromToDates.fromDate = this.dateAdapter.toModel(
      this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), "d", 30)
    );

    this.fromDate = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.fromDate)
    );
    this.toDate = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.toDate)
    );

    if (
      this.user.rolename == "AuthSigner" ||
      this.user.rolename == "Concessionaire User"
    ) {
      this.isAuthsigner = true;
    } else if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
    }

    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   language: {
    //     emptyTable: "No records found",
    //   },
    //   order: [4, "desc"],
    //   destroy: true,
    // };

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      order: [[4, "desc"]],
      columnDefs: [
        {
          targets: 4,
          render: function (data, type) {
            // Only change value for sorting
            if (type === 'sort' || type === 'type') {
              return data ? new Date(data).getTime() : 0;
            }

            // IMPORTANT: return original data for display
            return data;
          }
        }
      ],

      language: {
        emptyTable: "No records found",
      },
      destroy: true,

      // 👇 Add this part
      dom:
        "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-2'B>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

      buttons: {
        buttons: [
          {
            extend: "csv",
            title: "Prohibited Audit Listing", // customize title
            exportOptions: {
              columns: ":visible", // export all visible columns
            },
            className: "btn btn-sm btn-primary",
          },
          {
            extend: "excel",
            title: "Prohibited Audit Listing", // customize title
            exportOptions: {
              columns: ":visible",
            },
            className: "btn btn-sm btn-primary",
          },
        ],
        dom: {
          button: {
            className: "btn",
          },
        },
      },
    };
    // this.GetProhibitedItemList();
    this.GetCompanyList1();
    this.getConcessionVariable();

    this.route.queryParams.subscribe((params) => {
      const auditIdFromRoute = +params["dailyAuditId"];
      if (auditIdFromRoute) {
        this.pendingAuditId = auditIdFromRoute; // Store for later
      }
    });

    // ✅ Step 2: Load data and handle modal trigger after loading
    this.GetProhibitedItemList();
  }
  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.isMobileView = window.innerWidth <= 768;
  }
  public getConcessionVariable() {
    this.companyMasterService.getConcessionVariable().subscribe(
      (response: FormDataModel) => {
        if (response) {
          this.formDataModel = response;
        } else {
          this.toastr.warning("No data received from server.", "Warning");
        }
      },
      (error: any) => {
        console.error("Failed to load configuration", error);
        this.toastr.error("Failed to load configuration", "Error");
      }
    );
  }

  setPagedData() {
    const start = (this.queryParam1.pageNumber - 1) * this.queryParam1.pageSize;
    const end = start + this.queryParam1.pageSize;

    this.pagedProhibitedItemList = this.prohibitedList.slice(start, end);
    this.pageHeaders1.pageSize = this.queryParam1.pageSize;
    this.pageHeaders1.pageNumber = this.queryParam1.pageNumber;
    this.pageHeaders1.totalItems = this.prohibitedList.length;
  }

  onPageChange(page: number): void {
    this.queryParam1.pageNumber = page;
    this.setPagedData();
  }

  onPageSizeChange(): void {
    this.queryParam1.pageNumber = 1;
    this.setPagedData();
  }

  checkBoxChange(value: boolean, id: number) {
    this.prohibitedAuditModel.isCompletedAudit = value;
    this.prohibitedAuditModel.id = id;
    this.EditUpdateCompletedAudit();
  }

  EditUpdateCompletedAudit() {
    const updateModel = {
      id: this.prohibitedAuditModel.id,
      isCompletedAudit: this.prohibitedAuditModel.isCompletedAudit,
    } as ProhibitedAuditSummary;

    this.companyMasterService.EditUpdateCompletedAudit(updateModel).subscribe({
      next: (response: ProhibitedAuditSummary) => {
        if (response) {
          this.toastr.success("Comment saved successfully!", "Success");

          this.GetProhibitedItemList();
        } else {
          this.toastr.warning("Comment save response was empty.", "Warning");
        }
      },
      error: () => {
        this.toastr.error("Failed to save comment", "Error");
      },
    });
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split("-");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  basicSearchAudit() {
    if (this.onselectedCompany === null) {
      this.GetProhibitedItemList(); // Call the method when "All Company" is selected
    }
    if (this.onselectedCompany != null) {
      this.onCompanySelected();
    }
  }

  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${month}-${day}-${year}`; // MM-dd-yyyy
  }

  normalizeDateString(dateStr: string): string {
    const parts = dateStr.split("-"); // ["MM", "d", "yyyy"] or ["M","dd","yyyy"]

    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    const year = parts[2];

    return `${month}-${day}-${year}`; // MM-dd-yyyy
  }

  public GetProhibitedItemList() {
    // this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    // this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))

    let fromString = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.fromDate)
    );
    let toString = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.toDate)
    );

    // Normalize in case of single-digit dates
    fromString = this.normalizeDateString(fromString);
    toString = this.normalizeDateString(toString);

    this.companyMasterService
      .GetProhibitedAuditSummary(
        this.user.id,
        this.user.rolename,
        fromString,
        toString
      )
      .subscribe(
        (response: ProhibitedAuditSummary[]) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize to midnight for comparison
          this.prohibitedList = response;

          // this.prohibitedList = response.map(item => {
          //   const auditedDate = item.auditedDateTime ? new Date(item.auditedDateTime) : null;

          //   const isBeforeToday = auditedDate && auditedDate < today;
          //   const auditcountvalue = this.formDataModel.auditCount - 1
          //   return {
          //     ...item,
          //     showCitationButton: item.auditNo === auditcountvalue && isBeforeToday
          //   };
          // });

          this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTrigger.next();
          }) ?? this.dtTrigger.next();

          // ✅ Step 3: Open modal if dailyAuditId matched
          if (this.pendingAuditId) {
            const matchedLog = this.prohibitedList.find(
              (log) => log.dailyAuditId === this.pendingAuditId
            );
            if (matchedLog) {
              setTimeout(() => {
                this.openModalInspection(matchedLog, this.template2);
              }, 500); // delay to ensure modal template is ready
            }
          }
          this.setPagedData();
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  getStatusClass(status: string) {
    switch (status) {
      case "DRAFT":
        return "badge badge-secondary";
      case "COMPLETED":
        return "badge-success";
      case "SUBMITTED":
        return "badge badge-warning";
      case "PENDING REVIEW":
        return "badge badge-orange";
      case "RETURNED TO AS":
        return "badge badge-danger";
      default:
        return "badge badge-light";
    }
  }

  openModalInspection(
    log: ProhibitedAuditSummary,
    template2: TemplateRef<any>
  ) {
    this.submitteddate = log.auditedDateTime;
    this.LogId = log.id;
    this.auditNo = log.auditNo;
    this.selectedCompany = log.companyName;
    this.selectedcompanylocation = log.location;
    this.auditLocationId = log.locationId;
    this.completedAuditCount  = log.completedAuditCount ;
    this.selectedAuditCount =
      log.completedAuditCount + 1 + "/" + log.dailyAuditCount;
    if (this.user.rolename == "StaffAdmin") {
      this.selectedAuditCount = log.auditNo.toString();
    }
    this.getDailyItemsForAudit(log.id, this.user.rolename, log.auditNo, this.user.id);
    // Load items (clone data)
   // this.clonedItems = JSON.parse(JSON.stringify(this.itemTemplate)); // deep clone to avoid mutation

    this.modalService.open(template2, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  convertToSafeUrl(base64Data: string, mimeType: string): SafeUrl {
  const base64Url = `data:${mimeType};base64,${base64Data}`;
  return this.sanitizer.bypassSecurityTrustUrl(base64Url);
}


  closeAll(): void {
    // Bootstrap / NgbModal
    document.body.classList.remove('modal-open');

    const modals = document.querySelectorAll('.modal');
    modals.forEach(m => m.classList.remove('show'));

    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(b => b.remove());
  }

getItemStatus(dailyAuditId: number, modal: any) {
  this.companyMasterService.GetProhibitedItemStatus(dailyAuditId)
    .subscribe(
      (response: any[]) => {
        this.prohibitedItemForAuditList = response;

        // ✅ validation: status must be true or false
        const allConfirmed = this.prohibitedItemForAuditList.every(
          item => item.status === "true" || item.status === "false"
        );

        if (!allConfirmed) {
          this.toastr.error(
            'Please confirm all items before submitting the audit.'
          );
          return;
        }

        // ✅ only submit if validation passes
        this.finalSubmit(modal);
      },
      (error: any) => {
        this.toastr.error(`${error}`, 'Error');
      }
    );
}

  GetProhibitedItemAuditAsync(logid: number, auditNo: number, locationId:number) {
    this.companyMasterService
      .GetProhibitedItemAuditAsync(logid, auditNo, locationId)
      .subscribe(
        (response: ProhibitedItemAudit[]) => {
          this.prohibitedItemList = response; 
         
          this.prohibitedItemList.forEach((item) => { 
            this.companyMasterService.GetProhibitedItemImages(item.prohibitedItemId )
              .subscribe((imgList) => {
                if (imgList && imgList.length > 0) {
                  const thumb = imgList[0]; // FIRST item = thumbnail
                  item.thumbnailUrl = this.convertToSafeUrl(
                    thumb.fileBytes,
                    thumb.mimeType
                  );
                } 
              });
          });
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }  



  getDailyItemsForAudit(logid, roleName, auditNo,userId) {
    this.companyMasterService
      .GetProhibitedItemForAudit(logid, roleName, auditNo,userId)
      .subscribe(
        (response: ProhibitedItemAudit[]) => {
          this.prohibitedItemList = response;
          this.prohibitedItemList = this.prohibitedItemList.sort((a, b) =>
            a.shortDescription.localeCompare(b.shortDescription)
          );
          this.prohibitedItemList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.prohibitedItemId)
              .subscribe((imgList) => {
                if (imgList && imgList.length > 0) {
                  const thumb = imgList[0]; // FIRST item = thumbnail

                  item.thumbnailUrl = this.convertToSafeUrl(
                    thumb.fileBytes,
                    thumb.mimeType
                  );
                }
              });
          });
          if (response.length > 0 && response[0].auditComment) {
            if (this.isStaffAdmin) {
              this.prohibitedItemModel.auditComment = response[0].auditComment;
            }
          } else {
            this.prohibitedItemModel.auditComment = "";
          }
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  confirmAudit(item: ProhibitedItemAudit, status: string) {
    // update locally
    item.auditStatus = status;
    if (status === "false") {
      this.modalService.open(this.opdAlert, { centered: true });
      //alert('You must immediately notify OPD');
    }
    this.companyMasterService.UpdateProhibitedItemStatus(item).subscribe(
      (response: any) => {
       // this.getItemStatus(this.prohibitedItemList[0].dailyAuditId);
         //this.getDailyItemsForAudit(this.LogId, this.user.roleName, 0);
        //this.toastr.success("Audit status updated successfully.", "Success");
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
      }
    );

    // TODO: optionally call API to persist status
    // this.auditService.updateStatus(item.dailyAuditId, item.prohibitedItemId, status).subscribe();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  // loadOriginalImage(item: any) {
  //   // If already loaded, open directly
  //   if (item.originalUrl) {
  //     this.openImageModal(item.originalUrl);
  //     return;
  //   }

  //   this.companyMasterService.GetOriginalItemImage(item.id).subscribe((res) => {
  //     if (res && res.length > 0) {
  //       const original = res[0];

  //       item.originalUrl = this.convertToSafeUrl(
  //         original.fileBytes,
  //         original.mimeType
  //       );

  //       this.openImageModal(item.originalUrl);
  //     }
  //   });
  // }

  public onCompanySelected(): void {
    if (this.onselectedCompany === null) {
      this.GetProhibitedItemList(); // Call the method when "All Company" is selected
    }
    if (!this.onselectedCompany || !this.onselectedCompany.id) {
      return;
    }
    // this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    // this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    const companyId = this.onselectedCompany.id;

    let fromString = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.fromDate)
    );
    let toString = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.toDate)
    );

    // Normalize in case of single-digit dates
    fromString = this.normalizeDateString(fromString);
    toString = this.normalizeDateString(toString);

    this.companyMasterService
      .GetProhibitedAuditSummaryByCompanyId(companyId, fromString, toString)
      .subscribe(
        (response: ProhibitedAuditSummary[]) => {
          this.prohibitedList = response;
          if (!this.isMobileView) {
            this.dtElement?.dtInstance?.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            }) ?? this.dtTrigger.next();
          }

          if (this.isMobileView) {
            this.setPagedData();
            setTimeout(() => {
              this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.destroy();
                this.dtTrigger.next(); // re-render after DOM update
              });
            }, 0);
          }
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  public GetCompanyList1() {
    //this.spinner.show();
    this.companyMasterService.GetComapniesForSA().subscribe(
      (response: Company[]) => {
        // this.allCompanyList = response;
        this.allCompanyList = response.sort((a, b) =>
          a.companyName.localeCompare(b.companyName, undefined, {
            sensitivity: "base",
          })
        );
        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  //for Perform Button
  isAuditCompleted(audits: string): boolean {
    if (!audits) return false;

    const parts = audits.split("of").map((part) => parseInt(part.trim(), 10));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      return false;
    }

    const [completed, total] = parts;
    return completed >= total;
  }

  confirmItem(item: any, status: string) {
    item.confirmed = true;
    item.status = status;
  }

  isAllItemsConfirmed(): boolean {    
    return this.prohibitedItemList.some((item) => item.auditStatus == "");
  }
  getDate() {
    return new Date();
  }

  // submitAudit(modal: any) {
    
  //   const allConfirmed = this.prohibitedItemList.every((item) => item.status);
  //   if (!allConfirmed) {
  //     this.toastr.error(
  //       "Please confirm all items before submitting the audit."
  //     );
  //     return;
  //   }
  //   const auditComment = this.prohibitedItemModel.auditComment;
  //   //Update Records
  //   this.companyMasterService
  //     .UpdateProhibitedDailySummary(this.LogId, this.auditedBy, auditComment)
  //     .subscribe(
  //       (response: any) => {
  //         this.GetProhibitedItemList();
  //         this.toastr.success("Audit Submitted Successfully!");
  //         modal.close("Audit submitted");
  //       },
  //       (error: any) => {
  //         this.toastr.error(`${error}`, "Error");
  //       }
  //     );
  // }

//   submitAudit(modal: any) {
//   const dailyAuditId = this.prohibitedItemList[0].dailyAuditId;
//   this.getItemStatus(dailyAuditId, modal);

//   this.GetProhibitedItemAuditAsync(this.LogId, this.completedAuditCount, this.auditLocationId);
// }

submitAudit(modal: any) {

  const allConfirmed = this.prohibitedItemList.every(
    item => item.auditStatus === "true" || item.auditStatus === "false"
  );

  if (!allConfirmed) {
    this.toastr.error('Please confirm all items before submitting the audit.');
    return;
  }

  // send all items to API
  this.companyMasterService.UpdateMultipleItemStatus(this.prohibitedItemList)
    .subscribe(() => {
        this.finalSubmit(modal);
    });
}

finalSubmit(modal: any) {
  const auditComment = this.prohibitedItemModel.auditComment;

  this.companyMasterService
    .UpdateProhibitedDailySummary(this.LogId, this.auditedBy, auditComment)
    .subscribe(
      (response: boolean) => {
        if (!response) {
          this.toastr.error('Audit submission failed. Please contact support.');
          this.GetProhibitedItemList();
          return;
        }
        this.GetProhibitedItemList();
        this.toastr.success('Audit Submitted Successfully!');
        modal.close('Audit submitted');
      },
      (error: any) => {
        this.toastr.error(`${error}`, 'Error');
      }
    );
}
  closeModal() {
    this.modalInstance.hide();
  }

  search() {
    // Implement search logic here
  }

  goToCitationPage(citationNo, auditId) {
    if (citationNo != 0) {
      this.inspservice
        .goToCitationPage(citationNo)
        .subscribe((response: string) => {
          if (response != null) {
            this.citationId = +response;
            this.router.navigate(["admin/nov/details"], {
              queryParams: {
                isEdit: 1,
                isProhibitedAudit: true,
                auditId: auditId,
                citationId: this.citationId,
              },
              skipLocationChange: true,
            });
          } else {
            this.toastr.error("This citation does not exist.", "Information");
          }
        });
    } else {
      this.toastr.error("This citation does not exist.", "Information");
    }
  }

  getAuditButtonClass(log: any): string {
    const nextAudit = log.completedAuditCount + 1;

    if (nextAudit === 1) {
      return "btn-danger"; // Red
    }

    if (nextAudit === 2) {
      return "btn-warning"; // Yellow
    }

    return "btn-success"; // Green
  }
  getAuditButtonText(log: any): string {
    const nextAudit = log.completedAuditCount + 1;

    return `Start Audit ${nextAudit}`;
  }
}
