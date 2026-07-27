import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Company } from "../company";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { CompanyService } from "../company/company.service";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { ActivatedRoute, Router } from "@angular/router";
import { PagingHeader, QueryStringParameters } from "@app/shared/shared.model";
import { forkJoin, Subject } from "rxjs";
import { CompanyMasterService } from "./company-master.service";
import {
  DataOutputModel,
  ProhibitedDetails,
} from "../concessionaire-security/concessionaire.model";
import { DataTableDirective } from "angular-datatables";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as ExcelJS from "exceljs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { use } from "marked";

import * as JSZip from "jszip";
import { MobileViewData } from "@app/pages/inspectionrecord/inspectionrecord.model";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { get } from "jquery";
import { map } from 'rxjs/operators';


// 👇 Required for Excel export to work
(window as any).JSZip = JSZip;
@Component({
  selector: "app-concessionaire-item-master",
  templateUrl: "./concessionaire-item-master.component.html",
  styleUrls: ["./concessionaire-item-master.component.scss"],
  // concessionaire-item-master.component.scss
})
export class CompanyMasterComponent implements OnInit, OnDestroy {
  @ViewChild("template", { static: true }) templateRef!: TemplateRef<any>;
  @ViewChild("templatedelete", { static: true })
  confirmTemplate!: TemplateRef<any>;
  @ViewChild("statustemplate", { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild("templateApproved") templateApproved!: TemplateRef<any>;
  @ViewChild("templateReject") templateReject!: TemplateRef<any>;

  @ViewChild("statusTemplateApproved", { static: true })
  statusTemplateReject!: TemplateRef<any>;
  @ViewChild("statusTemplateReject", { static: true })
  statusTemplateApproved!: TemplateRef<any>;

  modalRef!: NgbModalRef;
  pendingCompany!: ProhibitedDetails;
  queryParam1 = {
    pageNumber: 1,
    pageSize: 50,
    maxPageSize: 50,
  };

  pageHeaders1 = {
    pageNumber: 1,
    pageSize: 50,
    totalItems: 0,
  };

  pagedProhibitedList: any[] = [];
  pendingStatus!: "Approved" | "Addition Rejected" | "Pending" | "Hidden";
  @ViewChild("modal2") modal2: ElementRef;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  companies: Company[];
  allCompanyList: Company[];
  user: any;
  displayTable = false;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  queryParam: QueryStringParameters = new QueryStringParameters();
  pageHeaders: PagingHeader = new PagingHeader();
  config: any;
  prohibitedmodel = new ProhibitedDetails();
  isAuthsigner: boolean;
  isStaffAdmin: boolean;
  isConcessionaireUser: boolean;
  selectedCompany: Company | null = null;
  prohibitedList: ProhibitedDetails[] = [];
  prohibitedListExport: ProhibitedDetails[] = [];
  companyList: any[] = []; // Fill from API
  showEditModal: boolean = false;
  public totalQuantityOfCompany: number = 0;
  showlabelApprove: boolean = false;
  showlabelReject: boolean = false;
  showlabel: boolean = false;
  selectedItem: ProhibitedDetails | null = null;
  qtyToMove: number = 0;
  qtyToDiscard: number = 0;
  qtyToRemove: number = 0;
  companyId: number = 0;
  companyName: string;
  showForDiscard: boolean = false;
  selectedImage: string | null = null;
  isModalOpen: boolean = false;
  isCompanyExist: boolean = false;
  isMobileView = window.innerWidth <= 768;
  public windowRef: Window;
  iscompanyselected: number = 0;
  mobileViewData: MobileViewData = new MobileViewData();
  sortDir = 1;
  private deleteId: number | null = null;
  previewImage: string | null = null;
  checkuser:number  =0;
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
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    
    const savedPageSize = sessionStorage.getItem('ProhibitedItemsizeList');
    const savedPageNumber = sessionStorage.getItem('ProhibitedItemPageNumber');
    const savedSearch = sessionStorage.getItem('ProhibitedItemSearch');
    const savedCompanyId = sessionStorage.getItem("ProhibitedItemCompanyId");

    this.mobileViewData.searchQuery = savedSearch ? savedSearch : '';
    this.queryParam.pageSize =  savedPageSize ? +savedPageSize : 50;
    this.queryParam.pageNumber = savedPageNumber ? +savedPageNumber: 1;
    this.queryParam.maxPageSize = savedPageSize ? +savedPageSize : 50;

    
   
    this.config = {
      currentPage: 1,
      itemsPerPage: this.queryParam.pageSize,
    };

    this.mobileViewData.pageSize = savedPageSize ? +savedPageSize : 50;
    this.mobileViewData.pageNumber = savedPageNumber ? +savedPageNumber: 1;
    this.mobileViewData.maxPageSize =  savedPageSize ? +savedPageSize : 50;
    this.mobileViewData.orderBy = "SubmittedDate";
    this.mobileViewData.orderDir = "desc";
    this.config = {
      currentPage: 1,
      itemsPerPage: this.mobileViewData.pageSize,
    };
  

    setTimeout(()=>{

    
    this.setInitialSortIcon();

    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    //savedCompanyId ? + savedCompanyId : 
  this.companyId =+this.route.snapshot.pathFromRoot[1].queryParams["companyId"];

    this.companyName =
      this.route.snapshot.pathFromRoot[1].queryParams["companyName"];
    if (this.companyId > 0) {
      this.isCompanyExist = true;
    }
    if (
      this.user.rolename == "AuthSigner" ||
      this.user.rolename == "Concessionaire User"
    ) {
      this.isAuthsigner = true;
      
      this.GetCompanyList(this.user.id);
      this.checkuser = 1;
    } else if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
      this.checkuser = 0;
     this.GetCompanyList1();
      if (this.isCompanyExist) {
        this.GetCompanyWiseItems(this.companyId);
        

      } else {
        this.iscompanyselected = 1;
       
        this.GetProhibitedItemList();
      }
    }
    // else if (this.user.rolename == "Concessionaire User") {
    //    this.isConcessionaireUser = true;
    //   this.GetProhibitedItemList();
    //   this.GetCompanyList(this.user.id);
    // }
    else {
      this.isAuthsigner = false;
    }

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (
      this.appURL.getLoginMethod() !== "Azure" &&
      this.appURL.getLoginMethod() !== "Okta"
    ) {
      if (!this.user?.passwordReseted) {
        this.router.navigate(["admin/changepassword"]);
      }
    }
    this.FixOldProhibitedImages();
    const requestDateIndex = this.isStaffAdmin ? 6 : 5;

    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   order: [[requestDateIndex, "desc"]],
    //   language: {
    //     emptyTable: "No records found",
    //   },
    //   destroy: true,
    // };
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 50,
    //   order: [[requestDateIndex, "desc"]],
    //   language: {
    //     emptyTable: "No records found",
    //   },
    //   destroy: true,

    //   // 👇 Add this part
    //   dom:
    //     "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-2'B>>" +
    //     "<'row'<'col-sm-12'tr>>" +
    //     "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

    //   buttons: {
    //     buttons: [
    //       {
    //         extend: "csv",
    //         title: "Prohibited Items Listing", // customize title
    //         exportOptions: {
    //           columns: ":visible", // export all visible columns
    //         },
    //         className: "btn btn-sm btn-primary",
    //       },
    //       {
    //         extend: "excel",
    //         title: "Prohibited Items Listing", // customize title
    //         exportOptions: {
    //           columns: ":visible",
    //         },
    //         className: "btn btn-sm btn-primary",
    //       },
    //     ],
    //     dom: {
    //       button: {
    //         className: "btn",
    //       },
    //     },
    //   },
    // };
       },300);
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.isMobileView = window.innerWidth <= 768;
  }

  public GetCompanyWiseItems(companyId: number) {
    this.companyMasterService
      .GetProhibitedItemsByCompanyId(companyId, this.mobileViewData, this.checkuser)
      .subscribe(
        (response: DataOutputModel) => {
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;
        
          // this.prohibitedList.forEach((item) => {
          //   this.companyMasterService
          //     .GetProhibitedItemImages(item.id)
          //     .subscribe((imgResponse) => {
          //       const original = imgResponse.find(
          //         (f) => !f.fileName.toLowerCase().includes("thumb")
          //       );

          //       const thumb = imgResponse.find((f) =>
          //         f.fileName.toLowerCase().includes("thumb")
          //       );

          //       item.originalurl = original
          //         ? this.convertToSafeUrl(original.fileBytes, original.mimeType)
          //         : null;

          //       item.thumbnailUrl = thumb
          //         ? this.convertToSafeUrl(thumb.fileBytes, thumb.mimeType)
          //         : item.originalurl;
          //     });
          // });
          //   this.prohibitedList.forEach(item => {
          //   if (!item.fileList) return;

          //   const original = item.fileList.find(f =>
          //     !f.fileName.toLowerCase().includes("thumb")
          //   );

          //   const thumb = item.fileList.find(f =>
          //     f.fileName.toLowerCase().includes("thumb")
          //   );

          //   item.originalurl = this.convertToUrl(original);
          //   item.thumbnailUrl = this.convertToUrl(thumb || original); // fallback
          // });

          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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

          if (this.isAuthsigner) {
            this.prohibitedList = this.prohibitedList.filter(
              (x) => x.status != "Removed"
            );
          }

          this.prohibitedList.forEach((item) => {
            // if (item.comment != null) {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            } else {
            }

            //}
          });
          // this.setPagedData();
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();

          //   this.dtTrigger.next(); // Rerender
          // });
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  public FixOldProhibitedImages() {
    // $('#dt1').DataTable().destroy();
    this.companyMasterService.FixOldProhibitedImages().subscribe(
      (response: any) => {
        console.log(
          "Old prohibited item images fixed successfully." + response
        );
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public GetCompanyList1() {
    // $('#dt1').DataTable().destroy();
    this.companyMasterService.GetComapniesForSA().subscribe(
      (response: Company[]) => {
        //  const companyList = response.filter(c => c.isConcessionaire == true);

        // this.allCompanyList = response;
        this.allCompanyList = response.sort((a, b) =>
          a.companyName.localeCompare(b.companyName, undefined, {
            sensitivity: "base",
          })
        );
        if (this.isCompanyExist) {
          this.selectedCompany =
            this.allCompanyList.find((c) => c.id === this.companyId) || null;
        }
        // this.dtTrigger.next();
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  setPagedData() {
    const start = (this.queryParam1.pageNumber - 1) * this.queryParam1.pageSize;
    const end = start + this.queryParam1.pageSize;

    this.pagedProhibitedList = this.prohibitedList.slice(start, end);
    this.pageHeaders1.pageSize = this.queryParam1.pageSize;
    this.pageHeaders1.pageNumber = this.queryParam1.pageNumber;
    this.pageHeaders1.totalItems = this.prohibitedList.length;
  }

  onPageChange(newPage: number): void {
    this.mobileViewData.pageNumber = newPage;

    sessionStorage.setItem('ProhibitedItemPageNumber', newPage.toString());

    if (this.isAuthsigner == true) {
      if (this.selectedCompany != null) {
        this.GetItemsForAuthsigner(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemsByAuthSignerUserId();
      }
    } else if (this.isStaffAdmin == true) {
      if (this.selectedCompany != null) {
        this.GetCompanyWiseItems(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemList();
      }
    }
  }
  onPageSizeChange(): void {
console.log("Sending PageSize:", this.mobileViewData.pageSize);

    sessionStorage.setItem('ProhibitedItemsizeList', this.mobileViewData.pageSize.toString());

    this.mobileViewData.pageSize = +this.mobileViewData.pageSize;
    this.mobileViewData.maxPageSize = +this.mobileViewData.pageSize;
     this.mobileViewData.pageNumber = 1;
     sessionStorage.setItem(
    'ProhibitedItemPageNumber',
    this.mobileViewData.pageNumber.toString() );
   
    if (this.isAuthsigner == true) {
      if (this.selectedCompany != null) {
        this.GetItemsForAuthsigner(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemsByAuthSignerUserId();
      }
    } else if (this.isStaffAdmin == true) {
      if (this.selectedCompany != null) {
        this.GetCompanyWiseItems(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemList();
      }
    }
  }
  searchtable() {
   this.mobileViewData.pageNumber = 1;

   sessionStorage.setItem(
    'ProhibitedItemPageNumber',
    this.mobileViewData.pageNumber.toString() );

     sessionStorage.setItem(
    'ProhibitedItemSearch',
    this.mobileViewData.searchQuery || ''
  );
    if (this.isAuthsigner == true) {
      if (this.selectedCompany != null) {
        this.GetItemsForAuthsigner(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemsByAuthSignerUserId();
      }
    } else if (this.isStaffAdmin == true) {
      if (this.selectedCompany != null) {
        this.GetCompanyWiseItems(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemList();
      }
    }

   // sessionStorage.removeItem('InspectionPageNumber');
     
  }
  async exportToExcelWithImages() {
    let exportData;
    if (this.isAuthsigner == true) {
      if (this.selectedCompany != null) {
        exportData = this.GetItemsForAuthsignerExport(this.selectedCompany.id);
      } else {
        exportData = this.GetProhibitedItemsByAuthSignerUserIdExport();
      }
    } else if (this.isStaffAdmin == true) {
      if (this.selectedCompany != null) {
        exportData = this.GetItemsForAuthsignerExport(this.selectedCompany.id);
      } else {
        exportData = this.GetProhibitedItemListForExport();
      }
    }
    // this.prohibitedList = exportData;
    // const workbook = new ExcelJS.Workbook();
    // const worksheet = workbook.addWorksheet("Prohibited Items");

    // worksheet.columns = [
    //   { header: "Company", key: "companyName", width: 15 },
    //   { header: "Item ID", key: "itemId", width: 15 },
    //   { header: "Description", key: "shortDescription", width: 20 },
    //   { header: "Location", key: "location", width: 15 },
    //   { header: "Photo", key: "thumbnailImage", width: 20 },
    //   { header: "Status", key: "status", width: 15 },
    //   { header: "Request Comment", key: "description", width: 30 },
    //   { header: "Approval Comment", key: "comment", width: 25 },
    //   { header: "Request Date", key: "submittedDate", width: 15 },
    //   { header: "Approval Date", key: "approvedDate", width: 15 },
    // ];

    // worksheet.getRow(1).font = { bold: true };

    // let rowIndex = 2;
    // for (const item of this.prohibitedList) {
    //   worksheet.addRow({
    //     companyName: item.companyName,
    //     itemId: item.itemId,
    //     shortDescription: item.shortDescription,
    //     location: item.location,
    //     status: item.status,
    //     description: item.description,
    //     comment: item.comment,
    //     submittedDate: item.submittedDate
    //       ? new Date(item.submittedDate).toLocaleDateString()
    //       : "",
    //     approvedDate: item.approvedDate
    //       ? new Date(item.approvedDate).toLocaleDateString()
    //       : "",
    //   });
    //   if (item.thumbnailImage && item.thumbnailImage.startsWith("data:image")) {
    //     const imageType =
    //       item.thumbnailImage.includes("jpeg") ||
    //       item.thumbnailImage.includes("jpg")
    //         ? "jpeg"
    //         : "png";

    //     const imageId = workbook.addImage({
    //       base64: item.thumbnailImage,
    //       extension: imageType,
    //     });
    //     worksheet.addImage(imageId, {
    //       tl: { col: 4, row: rowIndex - 1 },
    //       ext: { width: 80, height: 80 },
    //       editAs: "oneCell",
    //     });
    //     worksheet.getRow(rowIndex).height = 85;
    //   } else {
    //     worksheet.getRow(rowIndex).height = 25;
    //   }

    //   worksheet.getRow(rowIndex).alignment = {
    //     vertical: "middle",
    //     wrapText: true,
    //   };
    //   rowIndex++;
    // }
    // const buffer = await workbook.xlsx.writeBuffer();
    // const blob = new Blob([buffer], {
    //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    // });
    // saveAs(blob, "ProhibitedItems_WithImages.xlsx");
  }
  exportToCSV(): void {
    const exportData = this.prohibitedList.map((item) => ({
      Company: item.companyName || "",
      ItemID: item.itemId || "",
      Description: item.shortDescription || "",
      Location: item.location || "",
      Status: item.status || "",
      RequestComment: item.description || "",
      ApprovalComment: item.comment || "",
      RequestDate: item.submittedDate
        ? new Date(item.submittedDate).toLocaleDateString()
        : "",
      ApprovalDate: item.approvedDate
        ? new Date(item.approvedDate).toLocaleDateString()
        : "",
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const csvData: string = XLSX.utils.sheet_to_csv(worksheet);
    const blob: Blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "ProhibitedItems.csv");
  }

  clearSearch() {

    this.mobileViewData.searchQuery = "";
       this.mobileViewData.pageNumber =1;
       
      sessionStorage.setItem(
    'ProhibitedItemPageNumber',
    this.mobileViewData.pageNumber.toString() );

    sessionStorage.removeItem('ProhibitedItemSearch');

    if (this.isAuthsigner == true) {
      if (this.selectedCompany != null) {
        this.GetItemsForAuthsigner(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemsByAuthSignerUserId();
      }
    } else if (this.isStaffAdmin == true) {
      if (this.selectedCompany != null) {
        this.GetCompanyWiseItems(this.selectedCompany.id);
      } else {
        this.GetProhibitedItemList();
      }
    }
  }

  // onSortClick(event, columnname) {
  //   let target = event.currentTarget,
  //     classList = target.classList;

  //   if (classList.contains("fa-chevron-up")) {
  //     classList.remove("fa-chevron-up");
  //     classList.add("fa-chevron-down");
  //     this.sortDir = -1;
  //   } else {
  //     classList.add("fa-chevron-up");
  //     classList.remove("fa-chevron-down");
  //     this.sortDir = 1;
  //   }
  //   this.mobileViewData.orderBy = columnname;
  //   this.mobileViewData.orderDir = this.sortDir == -1 ? "desc" : "asc";
  //   if (this.isAuthsigner == true) {
  //     this.GetCompanyList(this.user.id);
  //   } else if (this.isStaffAdmin == true) {
  //     if (this.selectedCompany != null) {
  //       this.GetCompanyWiseItems(this.selectedCompany.id);
  //     } else {
  //       this.GetProhibitedItemList();
  //     }
  //   }
  // }

  setInitialSortIcon() {
  setTimeout(() => {
    const icons = document.querySelectorAll(".sort-icon");

    icons.forEach((i: any) => {
      const column = i.getAttribute("data-column");

      if (column === this.mobileViewData.orderBy) {
        // Active column
        i.classList.remove("fa-chevron-up");
        i.classList.add(
          this.mobileViewData.orderDir === "desc"
            ? "fa-chevron-down"
            : "fa-chevron-up"
        );
      } else {
        // Reset other columns
        i.classList.remove("fa-chevron-down");
        i.classList.add("fa-chevron-up");
      }
    });
  });
}


  onSortClick(event, columnname) {
  const icons = document.querySelectorAll(".sort-icon");

  // Reset all icons except clicked one
  icons.forEach((icon: any) => {
    if (icon !== event.currentTarget) {
      icon.classList.remove("fa-chevron-down");
      icon.classList.add("fa-chevron-up");
    }
  });

  // Existing toggle logic
  let target = event.currentTarget,
      classList = target.classList;

  if (classList.contains("fa-chevron-up")) {
    classList.remove("fa-chevron-up");
    classList.add("fa-chevron-down");
    this.sortDir = -1;
  } else {
    classList.add("fa-chevron-up");
    classList.remove("fa-chevron-down");
    this.sortDir = 1;
  }

  this.mobileViewData.orderBy = columnname;
  this.mobileViewData.orderDir = this.sortDir == -1 ? "desc" : "asc";

  if (this.isAuthsigner) {
    this.GetCompanyList(this.user.id);
  } else if (this.isStaffAdmin) {
    if (this.selectedCompany) {
      this.GetCompanyWiseItems(this.selectedCompany.id);
    } else {
      this.GetProhibitedItemList();
    }
  }
}

  // onPageChange(page: number): void {
  //   this.queryParam1.pageNumber = page;
  //   this.setPagedData();
  // }

  // onPageSizeChange(): void {
  //   this.queryParam1.pageNumber = 1;
  //   this.setPagedData();
  // }

  onCompanyGo(): void {
    if (this.prohibitedmodel) {
      const companyId = this.prohibitedmodel.companyId;
      const companyName = this.prohibitedmodel.companyName;

      console.log("Selected Company ID:", companyId);
      console.log("Selected Company Name:", companyName);
      console.log("Selected Company :", this.prohibitedmodel);
    } else {
      console.warn("No company selected.");
    }
  }

  onRequestProhibitedItem() {
    if (this.prohibitedmodel) {
      console.log(this.prohibitedmodel);
      if (this.selectedCompany == null) {
        this.toastr.warning("Please select Company.", "Warning");
      }
      const companyId = this.selectedCompany.id;
      const companyName = this.selectedCompany.companyName;
      this.selectedCompany = this.selectedCompany;
      this.router.navigate(["/admin/addeditprohibiteditem"], {
        queryParams: {
          isEdit: 0,
          companyId: this.selectedCompany.id,
          companyName: this.selectedCompany.companyName,
          totalquantityofcompany: this.totalQuantityOfCompany,
        },
        skipLocationChange: true,
      });
    } else {
      console.warn("No company selected");
    }
  }

  // async GetProhibitedItemListForExport() {
  //   this.companyMasterService
  //     .GetProhibitedItemListForExport(this.mobileViewData)
  //     .subscribe(
  //       async (response: ProhibitedDetails[]) => {
  //         this.prohibitedListExport = response;

  //         this.prohibitedListExport.forEach((item) => {
  //           this.companyMasterService
  //             .GetProhibitedItemThumbImg(item.id)
  //             .subscribe((imgList) => {
  //               if (imgList && imgList.length > 0) {
  //                 const thumb = imgList[0]; // FIRST item = thumbnail

  //                 item.thumbnailImage = thumb.thumbnailImage;
  //               }
  //             });
  //         });

  //         // --- Excel creation starts here ---
  //         const workbook = new ExcelJS.Workbook();
  //         const worksheet = workbook.addWorksheet("Prohibited Items");

  //         worksheet.columns = [
  //           { header: "Company", key: "companyName", width: 15 },
  //           { header: "Item ID", key: "itemId", width: 15 },
  //           { header: "Description", key: "shortDescription", width: 20 },
  //           { header: "Location", key: "location", width: 15 },
  //           { header: "Photo", key: "thumbnailImage", width: 20 },
  //           { header: "Status", key: "status", width: 15 },
  //           { header: "Request Comment", key: "description", width: 30 },
  //           { header: "Approval Comment", key: "comment", width: 25 },
  //           { header: "Request Date", key: "submittedDate", width: 15 },
  //           { header: "Approval Date", key: "approvedDate", width: 15 },
  //         ];

  //         worksheet.getRow(1).font = { bold: true };

  //         let rowIndex = 2;

  //         for (const item of this.prohibitedListExport) {
  //           worksheet.addRow({
  //             companyName: item.companyName,
  //             itemId: item.itemId,
  //             shortDescription: item.shortDescription,
  //             location: item.location,
  //             status: item.status,
  //             description: item.description,
  //             comment: item.comment,
  //             submittedDate: item.submittedDate
  //               ? new Date(item.submittedDate).toLocaleDateString()
  //               : "",
  //             approvedDate: item.approvedDate
  //               ? new Date(item.approvedDate).toLocaleDateString()
  //               : "",
  //           });

  //           if (
  //             item.thumbnailImage &&
  //             item.thumbnailImage.startsWith("data:image")
  //           ) {
  //             const imageType =
  //               item.thumbnailImage.includes("jpeg") ||
  //               item.thumbnailImage.includes("jpg")
  //                 ? "jpeg"
  //                 : "png";

  //             const imageId = workbook.addImage({
  //               base64: item.thumbnailImage,
  //               extension: imageType,
  //             });

  //             worksheet.addImage(imageId, {
  //               tl: { col: 4, row: rowIndex - 1 },
  //               ext: { width: 80, height: 80 },
  //               editAs: "oneCell",
  //             });

  //             worksheet.getRow(rowIndex).height = 85;
  //           } else {
  //             worksheet.getRow(rowIndex).height = 25;
  //           }

  //           worksheet.getRow(rowIndex).alignment = {
  //             vertical: "middle",
  //             wrapText: true,
  //           };

  //           rowIndex++;
  //         }

  //         // ✅ Await is required here
  //         const buffer = await workbook.xlsx.writeBuffer();

  //         const blob = new Blob([buffer], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(blob, "ProhibitedItems.xlsx");
  //       },
  //       (error: any) => {
  //         this.toastr.error(`${error}`, "Error");
  //       }
  //     );
  // }

 

async GetProhibitedItemListForExport() {
  this.companyMasterService
    .GetProhibitedItemListForExport(this.mobileViewData)
    .subscribe(
      (response: ProhibitedDetails[]) => {
        this.prohibitedListExport = response || [];

        // Build list of thumbnail requests
        const thumbRequests = this.prohibitedListExport.map(item =>
          this.companyMasterService.GetProhibitedItemThumbImg(item.id).pipe(
            map(imgList => {
              if (imgList && imgList.length > 0) {
                item.thumbnailImage = imgList[0].thumbnailImage;
              } else {
                item.thumbnailImage = null;
              }
              return item;
            })
          )
        );

        // If no items, export directly
        if (thumbRequests.length === 0) {
          this.exportToExcel();
          return;
        }

        // Wait for ALL thumbnail requests
        forkJoin(thumbRequests).subscribe(
          () => {
            // After thumbnails loaded → Export Excel
            this.exportToExcel();
          },
          (err) => {
            console.error('Error loading thumbnails', err);
            // Still export without images
            this.exportToExcel();
          }
        );
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
      }
    );
}


  // public GetProhibitedItemList() {
  //   this.companyMasterService.GetProhibitedItemList().subscribe(
  //     (response: ProhibitedDetails[]) => {
  //       this.prohibitedList = response;

  //       if (this.isAuthsigner) {
  //         this.prohibitedList = this.prohibitedList.filter(x => x.status != "Removed")
  //       }

  //       this.prohibitedList.forEach((item) => {
  //         // if (item.comment != null) {
  //         item.showlabel = true;

  //         if (item.status == "Approved") {
  //           item.showlabelApprove = true;
  //         } else if (item.status == "Addition Rejected") {
  //           item.showlabelReject = true;
  //         } else {
  //         }

  //       });

  //       if (this.dtElement && this.dtElement.dtInstance) {
  //         this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //           dtInstance.destroy();
  //           this.dtTrigger.next();
  //         });
  //       } else {
  //         // Fallback if dtElement is not yet initialized
  //         this.dtTrigger.next();
  //       }
  //       this.setPagedData();
  //     },
  //     (error: any) => {
  //       this.toastr.error(`${error}`, "Error");
  //       //this.spinner.hide();
  //     }
  //   );
  // }

  convertToUrl(file: any): any {
    if (!file) return null;

    const byteArray = Uint8Array.from(atob(file.fileBytes), (c) =>
      c.charCodeAt(0)
    );
    const blob = new Blob([byteArray], { type: file.mimeType });

    const objectUrl = URL.createObjectURL(blob);

    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  // public GetProhibitedItemList() {
  //   this.companyMasterService
  //     .GetProhibitedItemList(this.mobileViewData)
  //     .subscribe(
  //       (response: DataOutputModel) => {
  //         this.prohibitedList = response.items;

  //         this.pageHeaders = response.paging;

  //         // if(this.isMobileView){
  //         //     this.setPagedData
  //         // }
  //       },

  //       (error: any) => {
  //         this.toastr.error(`${error}`, "Error");
  //         //this.spinner.hide();
  //       }
  //     );
  // }

  public GetProhibitedItemList() {
    this.companyMasterService
      .GetProhibitedItemList(this.mobileViewData)
      .subscribe(
        (response: DataOutputModel) => {
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;

          // Now load all images one by one
          // this.prohibitedList.forEach((item) => {
          //   this.companyMasterService
          //     .GetProhibitedItemImages(item.id)
          //     .subscribe((imgResponse) => {
          //       const original = imgResponse.find(
          //         (f) => !f.fileName.toLowerCase().includes("thumb")
          //       );

          //       const thumb = imgResponse.find((f) =>
          //         f.fileName.toLowerCase().includes("thumb")
          //       );

          //       item.originalurl = original
          //         ? this.convertToSafeUrl(original.fileBytes, original.mimeType)
          //         : null;

          //       item.thumbnailUrl = thumb
          //         ? this.convertToSafeUrl(thumb.fileBytes, thumb.mimeType)
          //         : item.originalurl;
          //     });
          // });

          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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

  convertToSafeUrl(base64Data: string, mimeType: string): SafeUrl {
    // Convert base64 → binary array
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const objectUrl = URL.createObjectURL(blob);
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }

  async GetProhibitedItemsByAuthSignerUserIdExport() {
    this.companyMasterService
      .GetProhibitedItemsByAuthSignerUserIdWithoutPagination(this.user.id)
      .subscribe(
        async (response: ProhibitedDetails[]) => {
          this.prohibitedListExport = response;

          
          // 🔹 Filter out removed items for AuthSigner
          if (this.isAuthsigner) {
            this.prohibitedListExport = this.prohibitedListExport.filter(
              (x) => x.status != "Removed"
            );
          }

          // 🔹 Label setup logic
          this.prohibitedListExport.forEach((item) => {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            }
          });

          // Build array of API calls
          const thumbRequests = this.prohibitedListExport.map((item) =>
            this.companyMasterService.GetProhibitedItemThumbImg(item.id).pipe(
              map((imgList) => {
                if (imgList && imgList.length > 0) {
                  item.thumbnailImage = imgList[0].thumbnailImage;
                }
                return item;
              })
            )
          );

          // Wait for all calls
          forkJoin(thumbRequests).subscribe(async (updatedItems) => {
            this.prohibitedListExport = updatedItems;

            // Now run your Excel export code here (SAFE)
            this.exportToExcel();
          });

          

          // --- ✅ Excel creation starts here ---
          // const workbook = new ExcelJS.Workbook();
          // const worksheet = workbook.addWorksheet("Prohibited Items");

          // worksheet.columns = [
          //   { header: "Company", key: "companyName", width: 15 },
          //   { header: "Item ID", key: "itemId", width: 15 },
          //   { header: "Description", key: "shortDescription", width: 20 },
          //   { header: "Location", key: "location", width: 15 },
          //   { header: "Photo", key: "thumbnailImage", width: 20 },
          //   { header: "Status", key: "status", width: 15 },
          //   { header: "Request Comment", key: "description", width: 30 },
          //   { header: "Approval Comment", key: "comment", width: 25 },
          //   { header: "Request Date", key: "submittedDate", width: 15 },
          //   { header: "Approval Date", key: "approvedDate", width: 15 },
          // ];

          // worksheet.getRow(1).font = { bold: true };

          // let rowIndex = 2;

          // for (const item of this.prohibitedListExport) {
          //   worksheet.addRow({
          //     companyName: item.companyName,
          //     itemId: item.itemId,
          //     shortDescription: item.shortDescription,
          //     location: item.location,
          //     status: item.status,
          //     description: item.description,
          //     comment: item.comment,
          //     submittedDate: item.submittedDate
          //       ? new Date(item.submittedDate).toLocaleDateString()
          //       : "",
          //     approvedDate: item.approvedDate
          //       ? new Date(item.approvedDate).toLocaleDateString()
          //       : "",
          //   });

          //   // 🔹 Handle images
          //   if (
          //     item.thumbnailImage &&
          //     item.thumbnailImage.startsWith("data:image")
          //   ) {
          //     const imageType =
          //       item.thumbnailImage.includes("jpeg") ||
          //       item.thumbnailImage.includes("jpg")
          //         ? "jpeg"
          //         : "png";

          //     const imageId = workbook.addImage({
          //       base64: item.thumbnailImage,
          //       extension: imageType,
          //     });

          //     worksheet.addImage(imageId, {
          //       tl: { col: 4, row: rowIndex - 1 },
          //       ext: { width: 80, height: 80 },
          //       editAs: "oneCell",
          //     });

          //     worksheet.getRow(rowIndex).height = 85;
          //   } else {
          //     worksheet.getRow(rowIndex).height = 25;
          //   }

          //   worksheet.getRow(rowIndex).alignment = {
          //     vertical: "middle",
          //     wrapText: true,
          //   };

          //   rowIndex++;
          // }

          // // ✅ Generate and download Excel file
          // const buffer = await workbook.xlsx.writeBuffer();
          // const blob = new Blob([buffer], {
          //   type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          // });
          // saveAs(blob, "ProhibitedItems.xlsx");
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prohibited Items");

    worksheet.columns = [
      { header: "Company", key: "companyName", width: 15 },
      { header: "Item ID", key: "itemId", width: 15 },
      { header: "Description", key: "shortDescription", width: 20 },
      { header: "Location", key: "location", width: 15 },
      { header: "Photo", key: "thumbnailImage", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Request Comment", key: "description", width: 30 },
      { header: "Approval Comment", key: "comment", width: 25 },
      { header: "Request Date", key: "submittedDate", width: 15 },
      { header: "Approval Date", key: "approvedDate", width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };

    let rowIndex = 2;

    for (const item of this.prohibitedListExport) {
      worksheet.addRow({
        companyName: item.companyName,
        itemId: item.itemId,
        shortDescription: item.shortDescription,
        location: item.location,
        status: item.status,
        description: item.description,
        comment: item.comment,
        submittedDate: item.submittedDate
          ? new Date(item.submittedDate).toLocaleDateString()
          : "",
        approvedDate: item.approvedDate
          ? new Date(item.approvedDate).toLocaleDateString()
          : "",
      });

      if (item.thumbnailImage?.startsWith("data:image")) {
        const imageType = item.thumbnailImage.includes("jpeg") ? "jpeg" : "png";

        const imageId = workbook.addImage({
          base64: item.thumbnailImage,
          extension: imageType,
        });

        worksheet.addImage(imageId, {
          tl: { col: 4, row: rowIndex - 1 },
          ext: { width: 80, height: 80 },
          editAs: "oneCell",
        });

        worksheet.getRow(rowIndex).height = 85;
      }

      rowIndex++;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "ProhibitedItems.xlsx"
    );
  }

  // async GetItemsForAuthsignerExport(companyId) {
  //   this.companyMasterService
  //     .GetProhibitedItemsByCompanyIdForExport(
  //       this.selectedCompany.id,
  //       this.mobileViewData
  //     )
  //     .subscribe(
  //       async (response: ProhibitedDetails[]) => {
  //         this.prohibitedListExport = response;

  //         //  this.prohibitedList.forEach((item) => {
  //         //   this.companyMasterService
  //         //     .GetProhibitedItemImages(item.id)
  //         //     .subscribe((imgList) => {
  //         //       if (imgList && imgList.length > 0) {
  //         //         const thumb = imgList[0]; // FIRST item = thumbnail

  //         //         item.thumbnailUrl = this.convertToSafeUrl(
  //         //           thumb.fileBytes,
  //         //           thumb.mimeType
  //         //         );
  //         //       }
  //         //     });
  //         // });
  //         this.prohibitedListExport.forEach((item) => {
  //           this.companyMasterService
  //             .GetProhibitedItemThumbImg(item.id)
  //             .subscribe((imgList) => {
  //               if (imgList && imgList.length > 0) {
  //                 const thumb = imgList[0]; // FIRST item = thumbnail

  //                 item.thumbnailImage = thumb.thumbnailImage;
  //               }
  //             });
  //         });

  //         if (this.isAuthsigner) {
  //           this.prohibitedListExport = this.prohibitedListExport.filter(
  //             (x) => x.status != "Removed"
  //           );
  //         }

  //         this.prohibitedListExport.forEach((item) => {
  //           item.showlabel = true;
  //           if (item.status == "Approved") item.showlabelApprove = true;
  //           else if (item.status == "Addition Rejected")
  //             item.showlabelReject = true;
  //         });

  //         const workbook = new ExcelJS.Workbook();
  //         const worksheet = workbook.addWorksheet("Prohibited Items");

  //         worksheet.columns = [
  //           { header: "Company", key: "companyName", width: 15 },
  //           { header: "Item ID", key: "itemId", width: 15 },
  //           { header: "Description", key: "shortDescription", width: 20 },
  //           { header: "Location", key: "location", width: 15 },
  //           { header: "Photo", key: "thumbnailImage", width: 20 },
  //           { header: "Status", key: "status", width: 15 },
  //           { header: "Request Comment", key: "description", width: 30 },
  //           { header: "Approval Comment", key: "comment", width: 25 },
  //           { header: "Request Date", key: "submittedDate", width: 15 },
  //           { header: "Approval Date", key: "approvedDate", width: 15 },
  //         ];

  //         worksheet.getRow(1).font = { bold: true };

  //         let rowIndex = 2;
  //         for (const item of this.prohibitedListExport) {
  //           worksheet.addRow({
  //             companyName: item.companyName,
  //             itemId: item.itemId,
  //             shortDescription: item.shortDescription,
  //             location: item.location,
  //             status: item.status,
  //             description: item.description,
  //             comment: item.comment,
  //             submittedDate: item.submittedDate
  //               ? new Date(item.submittedDate).toLocaleDateString()
  //               : "",
  //             approvedDate: item.approvedDate
  //               ? new Date(item.approvedDate).toLocaleDateString()
  //               : "",
  //           });

  //           if (
  //             item.thumbnailImage &&
  //             item.thumbnailImage.startsWith("data:image")
  //           ) {
  //             const imageType =
  //               item.thumbnailImage.includes("jpeg") ||
  //               item.thumbnailImage.includes("jpg")
  //                 ? "jpeg"
  //                 : "png";

  //             const imageId = workbook.addImage({
  //               base64: item.thumbnailImage,
  //               extension: imageType,
  //             });
  //             worksheet.addImage(imageId, {
  //               tl: { col: 4, row: rowIndex - 1 },
  //               ext: { width: 80, height: 80 },
  //               editAs: "oneCell",
  //             });
  //             worksheet.getRow(rowIndex).height = 85;
  //           } else {
  //             worksheet.getRow(rowIndex).height = 25;
  //           }

  //           worksheet.getRow(rowIndex).alignment = {
  //             vertical: "middle",
  //             wrapText: true,
  //           };
  //           rowIndex++;
  //         }

  //         // ✅ FIXED HERE
  //         const buffer = await workbook.xlsx.writeBuffer();

  //         const blob = new Blob([buffer], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });
  //         saveAs(blob, "ProhibitedItems.xlsx");
  //       },
  //       (error: any) => {
  //         this.toastr.error(`${error}`, "Error");
  //       }
  //     );
  // }

  async GetItemsForAuthsignerExport(companyId) {
  this.companyMasterService
    .GetProhibitedItemsByCompanyIdForExport(this.selectedCompany.id, this.mobileViewData)
    .subscribe(
      async (response: ProhibitedDetails[]) => {
        this.prohibitedListExport = response || [];

        // Filter removed early if you want thumbnails only for remaining items
        if (this.isAuthsigner) {
          this.prohibitedListExport = this.prohibitedListExport.filter(x => x.status !== 'Removed');
        }

        // Prepare an array of observables for thumbnails
        const thumbRequests = this.prohibitedListExport.map(item =>
          this.companyMasterService.GetProhibitedItemThumbImg(item.id).pipe(
            map(imgList => {
              if (imgList && imgList.length > 0) {
                const thumb = imgList[0];
                item.thumbnailImage = thumb.thumbnailImage;
              } else {
                item.thumbnailImage = null;
              }
              return item; // return the modified item
            })
          )
        );

        // If there are no items, skip forkJoin and export directly
        if (thumbRequests.length === 0) {
          this.exportToExcel();
          return;
        }

        // Wait for ALL thumbnail requests to complete
        forkJoin(thumbRequests).subscribe(
          async (updatedItems: ProhibitedDetails[]) => {
            // updatedItems are the same objects (modified with thumbnailImage)
            this.prohibitedListExport = updatedItems;

            // set labels etc
            this.prohibitedListExport.forEach(item => {
              item.showlabel = true;
              item.showlabelApprove = item.status === 'Approved';
              item.showlabelReject = item.status === 'Addition Rejected';
            });

            // Now that thumbnails are present, build & download Excel
            await this.exportToExcel();
          },
          err => {
            // If thumbnails fail, you can still export without images or show error
            console.error('Thumbnail loading failed', err);
            // Optionally continue to export anyway:
            this.exportToExcel();
          }
        );
      },
      (error: any) => {
        this.toastr.error(`${error}`, 'Error');
      }
    );
}


  async convertUrlToBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

  GetItemsForAuthsigner(companyId) {
    this.companyMasterService
      .GetProhibitedItemsByCompanyId(
        this.selectedCompany.id,
        this.mobileViewData, this.checkuser
      )
      .subscribe(
        (response: DataOutputModel) => {
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;
          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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
          if (this.isAuthsigner) {
            this.prohibitedList = this.prohibitedList.filter(
              (x) => x.status != "Removed"
            );
          }

          this.prohibitedList.forEach((item) => {
            // if (item.comment != null) {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            } else {
            }

            //}
          });
          this.setPagedData();
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();

          //   this.dtTrigger.next(); // Rerender
          // });
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  public onCompanySelected(): void {

     if (this.selectedCompany) {
    sessionStorage.setItem(
      "ProhibitedItemCompanyId",
      this.selectedCompany.id.toString()
    );
  } else {
    sessionStorage.removeItem("ProhibitedItemCompanyId");
  }
    sessionStorage.removeItem("ProhibitedItemPageNumber");

    if (this.selectedCompany === null) {
      this.iscompanyselected = 1;
      if (this.isAuthsigner) {
        this.GetProhibitedItemsByAuthSignerUserId();
      }
      if (this.isStaffAdmin) {
        //this.mobileViewData.pageSize = 50;
        this.mobileViewData.pageNumber = 1;
        // this.mobileViewData.maxPageSize = 50;
        // this.config = {
        //   currentPage: 1,
        //   itemsPerPage: this.mobileViewData.pageSize,
        // };
        this.GetProhibitedItemList();
      }
    } else {
      this.iscompanyselected = 0;
      // this.mobileViewData.pageSize = 50;
     // this.mobileViewData.pageNumber = 1;
      // this.mobileViewData.maxPageSize = 50;
      // this.config = {
      //   currentPage: 1,
      //   itemsPerPage: this.mobileViewData.pageSize,
      // };
    }
    if (!this.selectedCompany || !this.selectedCompany.id) {
      return;
    }

    const companyId = this.selectedCompany.id;

    this.companyMasterService
      .GetProhibitedItemsByCompanyId(companyId, this.mobileViewData,this.checkuser)
      .subscribe(
        (response: DataOutputModel) => {
          this.mobileViewData.pageNumber=1;
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;
          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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

          if (this.isAuthsigner) {
            this.prohibitedList = this.prohibitedList.filter(
              (x) => x.status != "Removed"
            );
          }

          this.prohibitedList.forEach((item) => {
            // if (item.comment != null) {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            } else {
            }
            console.log("thumbnailImage:", item.thumbnailImage);
            thumbnailImage: item.thumbnailImage; // ensure mapping
            originalImage: item.originalImage;
            //         // this.convertToBase64(item.thumbnailImage).then(base64 => {
            //         //       item.thumbnailImage = base64;
            // });

            //}
          });

          this.setPagedData();
          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();

          //   this.dtTrigger.next(); // Rerender
          // });
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  //   createImg(file: FileList): string {
  //   const byteCharacters = atob(file.fileBytes);
  //   const byteNumbers = new Array(byteCharacters.length)
  //     .fill(0)
  //     .map((_, i) => byteCharacters.charCodeAt(i));
  //   const blob = new Blob([new Uint8Array(byteNumbers)], { type: file.mimeType });
  //   return URL.createObjectURL(blob);
  // }
  

  GetProhibitedItemsByAuthSignerUserId() {
    this.companyMasterService
      .GetProhibitedItemsByAuthSignerUserId(this.user.id, this.mobileViewData)
      .subscribe(
        (response: DataOutputModel) => {
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;
          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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

          if (this.isAuthsigner) {
            this.prohibitedList = this.prohibitedList.filter(
              (x) => x.status != "Removed"
            );
          }

          this.prohibitedList.forEach((item) => {
            // if (item.comment != null) {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            } else {
            }

            //}
          });

          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();

          //   this.dtTrigger.next(); // Rerender
          // });
          this.setPagedData();
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  public GetCompanyList(userId: string) {
    this.companyMasterService
      .getAllCompanies(userId)
      .subscribe((response: Company[]) => {
        console.log("Full Company Response:", response);
        const companyList = response.filter((c) => c.isConcessionaire === true);
        console.log("Company List:", companyList);
        //this.companies = response;
        this.companies = companyList.sort((a, b) =>
          a.companyName.localeCompare(b.companyName, undefined, {
            sensitivity: "base",
          })
        );
        // this.selectedCompany = this.companies[0];
        // this.onCompanySelected();
        if (this.isCompanyExist === true) {
          const matchedCompany = this.companies.find(
            (c) => c.id === this.companyId
          );
          if (matchedCompany) {
            this.selectedCompany = matchedCompany;
          }
        } else {
          this.selectedCompany = this.companies[0];
        }

        this.onCompanySelected();

        // this.dtTrigger.next();
      });
  }

  convertToBase64(url: string): Promise<string> {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          })
      );
  }

  // deleteCompany(id: number): void {
  //   if (confirm("Are you sure you want to delete this record?")) {
  //     //$("#dt1").DataTable().destroy();
  //     this.companyMasterService.DeleteProhibitedRecordById(id).subscribe({
  //       next: (response: any) => {
  //         if (response.statusText === "Fail") {
  //           this.toastr.warning("Failed to delete. Please try again.");
  //         } else if (response.statusText === "Exists") {
  //           this.toastr.error("Item is linked to other records");
  //         } else {
  //           this.toastr.success("Item deleted successfully");
  //           if (this.isAuthsigner == true) {
  //             this.GetCompanyList(this.user.id);
  //           }
  //           if (this.isStaffAdmin == true) {
  //             this.GetProhibitedItemList()
  //           }
  //         }
  //       },
  //       error: () => {
  //         this.toastr.error("Error deleting company", "Error");
  //       },
  //     });
  //   }
  // }

  GetProhibitedListByCompany(companyId: number) {
    this.companyMasterService
      .GetProhibitedItemsByCompanyId(companyId, this.mobileViewData,this.checkuser)
      .subscribe(
        (response: DataOutputModel) => {
          this.prohibitedList = response.items;
          this.pageHeaders = response.paging;
          this.prohibitedList.forEach((item) => {
            this.companyMasterService
              .GetProhibitedItemImages(item.id)
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
          if (this.isAuthsigner) {
            this.prohibitedList = this.prohibitedList.filter(
              (x) => x.status != "Removed"
            );
          }

          this.prohibitedList.forEach((item) => {
            // if (item.comment != null) {
            item.showlabel = true;
            if (item.status == "Approved") {
              item.showlabelApprove = true;
            } else if (item.status == "Addition Rejected") {
              item.showlabelReject = true;
            } else {
            }

            //}
          });

          // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          //   dtInstance.destroy();

          //   this.dtTrigger.next(); // Rerender
          // });
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
          //this.spinner.hide();
        }
      );
  }

  deleteCompany(id: number, confirmed = false): void {
    // Step 1: Show modal
    if (!confirmed) {
      this.deleteId = id;
      this.modalRef = this.modalService.open(this.confirmTemplate, {
        centered: true,
      });
      return;
    }

    // Step 2: Perform deletion
    if (this.deleteId != null) {
      this.companyMasterService
        .DeleteProhibitedRecordById(this.deleteId)
        .subscribe({
          next: (response: any) => {
            if (response.statusText === "Fail") {
              this.toastr.warning("Failed to delete. Please try again.");
            } else if (response.statusText === "Exists") {
              this.toastr.error("Item is linked to other records");
            } else {
              this.toastr.success("Item deleted successfully");
              if (this.isAuthsigner) {
                this.GetCompanyList(this.user.id);
              }
              if (this.isStaffAdmin) {
                this.GetProhibitedItemList();
              }
            }
            this.deleteId = null;
          },
          error: () => {
            this.toastr.error("Error deleting company", "Error");
            this.deleteId = null;
          },
        });

      if (this.modalRef) {
        this.modalRef.close();
      }
    }
  }

  // Called when clicking "Yes" inside the modal
  confirmDelete(): void {
    this.deleteCompany(this.deleteId!, true);
  }
  editCompany(id: number): void {
    this.router.navigate(["/admin/addeditconcessionaireitem"], {
      queryParams: {
        companyId: id,
        isEdit: 1,
        isView: 0,
      },
      skipLocationChange: true,
    });
  }

  handleCommentAction(
    company: ProhibitedDetails,
    action: "Approved" | "Addition Rejected" | "Pending" | "Hidden"
  ): void {
    this.pendingCompany = company;
    this.pendingStatus = action;

    if (action === "Approved") {
      this.modalRef = this.modalService.open(this.templateApproved, {
        centered: true,
      });
    } else if (action === "Addition Rejected") {
      this.modalRef = this.modalService.open(this.templateReject, {
        centered: true,
      });
    }
    // this.pendingCompany = company;
    // this.pendingStatus = action;

    // // Open the modal
    // this.modalRef = this.modalService.open(this.statusTemplate, {
    //   centered: true,
    // });
  }

  confirmStatusChange(): void {
    const updateModel = {
      id: this.pendingCompany.id,
      comment: this.pendingCompany.comment,
      approvedBy: this.user.id,
      companyId: this.pendingCompany.companyId,
      shortDescription: this.pendingCompany.shortDescription,
      status: this.pendingCompany.status,
      newStatus: this.pendingStatus,
      removalComment: this.pendingCompany.removalComment,
      companyName: this.pendingCompany.companyName,
      filePath: this.pendingCompany.filePath,
      description: this.pendingCompany.description,
      updatedBy: this.user.id,
    } as ProhibitedDetails;
    this.pendingCompany.approvedBy = this.user.id;
    this.pendingCompany.updatedBy = this.user.id;
    this.companyMasterService.EditUpdateComment(updateModel).subscribe({
      next: (response: ProhibitedDetails) => {
        if (response) {
          this.toastr.success("Comment saved successfully!", "Success");
          this.showlabel = true;
          this.GetCompanyWiseItems(this.pendingCompany.companyId);
          this.selectedCompany =
            this.allCompanyList.find(
              (c) => c.id === this.pendingCompany.companyId
            ) || null;
        } else {
          this.toastr.warning("Comment save response was empty.", "Warning");
        }
        this.modalRef?.close();
      },
      error: () => {
        this.toastr.error("Failed to save comment", "Error");
        this.modalRef?.close();
      },
    });
  }

  loadOriginalImage(item: any) {
    // If already loaded, open directly
    if (item.originalUrl) {
      this.openImageModal(item.originalUrl);
      return;
    }

    this.companyMasterService.GetOriginalItemImage(item.id).subscribe((res) => {
      if (res && res.length > 0) {
        const original = res[0];

        item.originalUrl = this.convertToSafeUrl(
          original.fileBytes,
          original.mimeType
        );

        this.openImageModal(item.originalUrl);
      }
    });
  }

  // handleCommentAction(
  //   company: ProhibitedDetails,
  //   action: "Approved" | "Addition Rejected" | "Pending" | "Hidden"
  // ) {
  //   const confirmed = confirm(`Are you sure you want to change the status to "${action}"?`);
  //   if (!confirmed) return;
  //   const updateModel = {
  //     id: company.id,
  //     comment: company.comment,
  //     approvedBy: this.user.id,
  //     companyId: company.companyId,
  //     shortDescription: company.shortDescription,
  //     status: company.status,
  //     newStatus: action,
  //     removalComment: company.removalComment

  //   } as ProhibitedDetails;

  //   this.companyMasterService.EditUpdateComment(updateModel).subscribe({
  //     next: (response: ProhibitedDetails) => {
  //       if (response) {
  //         const first = response[0]; // assuming all items have same company

  //         // this.selectedCompany = this.companies.find(
  //         //   c => c.id === first.companyId
  //         // );

  //         this.toastr.success("Comment saved successfully!", "Success");
  //         this.showlabel = true;
  //         this.GetProhibitedItemList(); // optional: refresh table
  //       } else {
  //         this.toastr.warning("Comment save response was empty.", "Warning");
  //       }
  //     },
  //     error: () => {
  //       this.toastr.error("Failed to save comment", "Error");
  //     },
  //   });
  // }

  handleAfterDiscard(
    company: ProhibitedDetails,
    action: "Approved" | "Addition Rejected",
    discardApproved: number
  ) {
    const updateModel = {
      id: company.id,
      comment: company.comment,
      approvedBy: this.user.id,
      //status: action,
      companyId: company.companyId,
      shortDescription: company.shortDescription,
      status: company.status,
      newStatus: action,
      discardApproved: discardApproved,
    } as ProhibitedDetails;

    this.companyMasterService.ApprovedOnDiscard(updateModel).subscribe({
      next: (response: ProhibitedDetails[]) => {
        if (response && response.length > 0) {
          const first = response[0]; // assuming all items have same company

          // this.selectedCompany = this.companies.find(
          //   c => c.id === first.companyId
          // );

          this.toastr.success("Comment saved successfully!", "Success");
          this.showlabel = true;
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

  openEditProhibited(item: ProhibitedDetails) {
    this.selectedItem = item;

    if (this.modal2) {
      const modalElement = this.modal2.nativeElement;
      modalElement.style.display = "block";
      modalElement.classList.add("show");
      modalElement.style.backgroundColor = "rgba(0, 0, 0, 0.6)"; // darker background
    }
  }

  closeprohibited() {
    if (this.modal2) {
      this.modal2.nativeElement.style.display = "none";
      this.modal2.nativeElement.classList.remove("show");
    }
  }

  moveToInUsed() {
    if (this.selectedItem) {
      // ✅ Check if entered quantity exceeds approved quantityqtyToDiscard
      if (this.qtyToMove > this.selectedItem.quantityAllowed) {
        this.toastr.error(
          `Quantity cannot exceed approved value (${this.selectedItem.quantityAllowed}).`,
          "Validation Error"
        );
        return;
      }
      const updateModel = {
        id: this.selectedItem.id,
        companyId: this.selectedItem.companyId,
        quantityAllowed: this.selectedItem.quantityAllowed,
        quantityUsein: this.qtyToMove,
      } as ProhibitedDetails;

      this.companyMasterService.UpdateQuantityUsein(updateModel).subscribe({
        next: (response: ProhibitedDetails) => {
          if (response) {
            this.toastr.success("Quantity updated successfully!", "Success");
            this.closeprohibited(); // close modal
            this.GetProhibitedItemList(); // refresh table
          } else {
            this.toastr.warning("Update response was empty.", "Warning");
          }
        },
        error: () => {
          this.toastr.error("Failed to update quantity", "Error");
        },
      });
    }
  }

  discardQty() {
    if (this.selectedItem) {
      // ✅ Check if entered quantity exceeds approved tyToDiscard
      if (this.qtyToDiscard > this.selectedItem.quantityUsein) {
        this.toastr.error(
          `Quantity cannot exceed approved value (${this.selectedItem.quantityUsein}).`,
          "Validation Error"
        );
        return;
      }

      const updateModel = {
        id: this.selectedItem.id,
        companyId: this.selectedItem.companyId,
        status: "Pending",
      } as ProhibitedDetails;

      this.companyMasterService.UpdateDiscardQuantity(updateModel).subscribe({
        next: (response: ProhibitedDetails) => {
          if (response) {
            this.toastr.success("Quantity updated successfully!", "Success");
            this.closeprohibited(); // close modal
            this.GetProhibitedItemList(); // refresh table
          } else {
            this.toastr.warning("Update response was empty.", "Warning");
          }
        },
        error: () => {
          this.toastr.error("Failed to update quantity", "Error");
        },
      });
    }
  }

  closemodel() {
    this.modalService.dismissAll();
  }

  selectedAction: "Removal Pending" | "Removed" | "Removal Rejected" | null =
    null;

  moveForRemove(action: "Removal Pending" | "Removed" | "Removal Rejected") {
    if (!this.selectedItem) return;

    this.selectedAction = action;

    // if (action === "Removal Pending") {
    //   this.modalRef = this.modalService.open(this.templateRef);
    // } else if (action === "Removed") {
    //   this.modalRef = this.modalService.open(this.statusTemplateReject, {
    //     centered: true,
    //   });
    // } else if (action === "Removal Rejected") {
    //   this.modalRef = this.modalService.open(this.statusTemplateApproved, {
    //     centered: true,
    //   });
    // }
    const updateModel = {
      id: this.selectedItem.id,
      companyId: this.selectedItem.companyId,
      status: this.selectedAction,
      removalComment: this.selectedItem.removalComment,
      //submittedBy: this.user.id,
      updatedBy: this.user.id,
    } as ProhibitedDetails;

    this.companyMasterService.UpdateForHidden(updateModel).subscribe({
      next: (response: ProhibitedDetails) => {
        if (response) {
          this.toastr.success("Record submitted successfully!", "Success");
          this.closeprohibited(); // Close main modal
          if (this.isStaffAdmin) {
            this.GetCompanyWiseItems(this.selectedItem.companyId);
            this.selectedCompany =
              this.allCompanyList.find(
                (c) => c.id === this.selectedItem.companyId
              ) || null;
          }
          if (this.isAuthsigner) {
            this.GetProhibitedListByCompany(response.companyId);
          }
          // Refresh table
        } else {
          this.toastr.warning("Update response was empty.", "Warning");
        }
      },
      error: () => {
        this.toastr.error("Failed to update quantity", "Error");
      },
    });
  }

  confirmStatusChange1() {
    if (!this.selectedItem || !this.selectedAction) return;

    const updateModel = {
      id: this.selectedItem.id,
      companyId: this.selectedItem.companyId,
      status: this.selectedAction,
      removalComment: this.selectedItem.removalComment,
    } as ProhibitedDetails;

    this.companyMasterService.UpdateForHidden(updateModel).subscribe({
      next: (response: ProhibitedDetails) => {
        if (response) {
          this.toastr.success("Record submitted successfully!", "Success");
          this.closeprohibited(); // Close main modal
          if (this.isStaffAdmin) {
            this.GetCompanyWiseItems(this.selectedItem.companyId);
            this.selectedCompany =
              this.allCompanyList.find(
                (c) => c.id === this.selectedItem.companyId
              ) || null;
          }
          if (this.isAuthsigner) {
            this.GetProhibitedListByCompany(response.companyId);
          }
          // Refresh table
        } else {
          this.toastr.warning("Update response was empty.", "Warning");
        }
      },
      error: () => {
        this.toastr.error("Failed to update quantity", "Error");
      },
    });

    this.modalRef?.close(); // Close confirmation modal
  }
  // moveForRemove(action: "Removal Pending" | "Removed" | "Removal Rejected") {
  //   if (this.selectedItem) {
  //     if (action == "Removal Pending") {
  //       // this.toastr.error("Do not remove item until you have received an approval from SBO", "Alert");
  //       this.modalRef = this.modalService.open(this.templateRef);
  //     } else if (action == "Removed") {
  //        this.modalRef = this.modalService.open(this.statusTemplateApproved);
  //     }else if (action == "Removal Rejected") {
  //        this.modalRef = this.modalService.open(this.statusTemplateReject);
  //     }

  //     const updateModel = {
  //       id: this.selectedItem.id,
  //       companyId: this.selectedItem.companyId,

  //       status: action,
  //       removalComment: this.selectedItem.removalComment,
  //     } as ProhibitedDetails;

  //     this.companyMasterService.UpdateForHidden(updateModel).subscribe({
  //       next: (response: ProhibitedDetails) => {
  //         if (response) {
  //           this.toastr.success("Record submitted successfully!", "Success");
  //           this.closeprohibited(); // close modal
  //           this.GetProhibitedItemList(); // refresh table
  //         } else {
  //           this.toastr.warning("Update response was empty.", "Warning");
  //         }
  //       },
  //       error: () => {
  //         this.toastr.error("Failed to update quantity", "Error");
  //       },
  //     });
  //   }
  // }
  // openEditProhibited(item: ProhibitedDetails){
  //   if(this.modal2){

  //         this.modal2.nativeElement.style.display="block"
  //   }

  // }

  // closeprohibited(){
  //    if(this.modal2){
  //         this.modal2.nativeElement.style.display="none"
  //   }
  // }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedImage = null;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
