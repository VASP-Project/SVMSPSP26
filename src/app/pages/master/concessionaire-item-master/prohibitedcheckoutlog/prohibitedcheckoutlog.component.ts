import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  Item,
  ProhibitedDetails,
  ProhibitedItemCheckOut,
  ShortDescItem,
} from "../../concessionaire-security/concessionaire.model";
import { Company } from "../../company";
import { Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DataTableDirective } from "angular-datatables";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { NovService } from "@app/pages/novlist/nov.service";
import { Badgeholder } from "@app/pages/novlist/badgeholder";
import { CompanyService } from "../../company/company.service";
import { Locations } from "../../locations";
import { LocationService } from "../../location/location.service";
import { FromTODate } from "@app/pages/inspectionrecord/inspectionrecord.model";

@Component({
  selector: "app-prohibitedcheckoutlog",
  templateUrl: "./prohibitedcheckoutlog.component.html",
  styleUrls: ["./prohibitedcheckoutlog.component.scss"],
})
export class ProhibitedcheckoutlogComponent implements OnInit {
  @ViewChild("templatedelete", { static: true })
  deleteTemplate!: TemplateRef<any>;
  modalRef!: NgbModalRef;
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
  fromToDates: FromTODate = new FromTODate();
  fromDate: string;
  toDate: string;

  pagedProhibitedcheckoutList: any[] = [];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  companies: Company[];
  allCompanyList: Company[];
  user: any;
  displayTable = false;
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject();
  prohibitedmodel = new ProhibitedDetails();
  isAuthsigner: boolean;
  isStaffAdmin: boolean;
  isConcessionaireUser: boolean;
  selectedCompany: Company | null = null;
  prohibitedList: ProhibitedDetails[] = [];
  //prohibitedList1: ProhibitedDetails[] = [];
  companyList: any[] = []; // Fill from API
  deleteId: number | null = null;
  selectedItem: ProhibitedDetails | null = null;

  companyId: number = 0;
  companyName: string;
  showForDiscard: boolean = false;
  shortDescriptions: string[] = [];
  shortDesc: ShortDescItem[] = [];

  prohibitedCheckoutModel = new ProhibitedItemCheckOut();
  prohibitedItemCheckoutList: ProhibitedItemCheckOut[] = [];
  isEdit: boolean = false;
  hours: string;
  minutes: string;
  year: any;
  month: string;
  day: string;
  editingRowId: number;
  selectedThumbnailImage: string = "";
  locationList: Locations[] = [];
  location = new Locations();
  isMobileView = window.innerWidth <= 768;
  showcompanyName: boolean = false;
  displayText:string;
  constructor(
    private ref: ChangeDetectorRef,
    private companyMasterService: CompanyMasterService,
    private appURL: AppConfigService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe,
    private NovService: NovService,
    private CompanyService: CompanyService,
    private modalService: NgbModal,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
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

    const now = new Date();
    const today = new Date();
    this.year = now.getFullYear();
    this.month = String(now.getMonth() + 1).padStart(2, "0");
    this.day = String(now.getDate()).padStart(2, "0");
    this.hours = String(now.getHours()).padStart(2, "0");
    this.minutes = String(now.getMinutes()).padStart(2, "0");

    this.prohibitedCheckoutModel.checkoutTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;

    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    if (
      this.user.rolename == "AuthSigner" ||
      this.user.rolename == "Concessionaire User"
    ) {
      this.isAuthsigner = true;
      this.GetCompanyList(this.user.id);
    } else if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
      this.GetProhibitedItemCheckOutList();
    }
    // else if (this.user.rolename == "Concessionaire User") {
    //    this.isConcessionaireUser = true;
    //   //  this.user.
    //    this.GetProhibitedItemCheckOutList()
    //    this.GetCompanyList(this.user.id);
    // }
    else {
      this.isAuthsigner = false;
    }

    this.GetCompanyList1();

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (
      this.appURL.getLoginMethod() !== "Azure" &&
      this.appURL.getLoginMethod() !== "Okta"
    ) {
      if (!this.user?.passwordReseted) {
        this.router.navigate(["admin/changepassword"]);
      }
    }

    const requestDateIndex = this.isStaffAdmin ? 6 : 5;
    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 10,
    //   language: {
    //     emptyTable: "No records found",
    //   },
    //   order: [6, 'desc'],
    //   destroy: true,
    // };
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      order: [[6, "desc"]],      
      columnDefs: [
        {
          targets: 6,
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
            title: "Prohibited Checkout Listing", // customize title
            exportOptions: {
              columns: ":visible", // export all visible columns
            },
            className: "btn btn-sm btn-primary",
          },
          {
            extend: "excel",
            title: "Prohibited Checkout Listing", // customize title
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
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: Event) {
    this.isMobileView = window.innerWidth <= 768;
  }

  setPagedData(): void {
    const start = (this.queryParam1.pageNumber - 1) * this.queryParam1.pageSize;
    const end = start + this.queryParam1.pageSize;

    this.pagedProhibitedcheckoutList = this.prohibitedItemCheckoutList.slice(
      start,
      end
    );
    this.pageHeaders1.pageSize = this.queryParam1.pageSize;
    this.pageHeaders1.pageNumber = this.queryParam1.pageNumber;
    this.pageHeaders1.totalItems = this.prohibitedItemCheckoutList.length;
  }

  onPageChange(page: number): void {
    this.queryParam1.pageNumber = page;
    this.setPagedData();
  }

  onPageSizeChange(): void {
    this.queryParam1.pageNumber = 1;
    this.setPagedData();
  }

  basicSearchAudit() {
    this.onCompanySelected();
  }
  public GetCompanyList(userId: string) {
    this.companyMasterService
      .getAllCompanies(userId)
      .subscribe((response: Company[]) => {
        // this.companies = response;
        const companyList = response.filter((c) => c.isConcessionaire === true);
        this.companies = companyList.sort((a, b) =>
          a.companyName.localeCompare(b.companyName, undefined, {
            sensitivity: "base",
          })
        );
        this.selectedCompany = this.companies[0];

        this.onCompanySelected();

        this.dtTrigger.next();
      });
  }

  public GetCompanyList1() {
    //this.spinner.show();
    this.companyMasterService.GetComapniesForSA().subscribe(
      (response: Company[]) => {
        //this.allCompanyList = response;
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

  normalizeDateString(dateStr: string): string {
    const parts = dateStr.split("-"); // ["MM", "d", "yyyy"] or ["M","dd","yyyy"]

    const month = parts[0].padStart(2, "0");
    const day = parts[1].padStart(2, "0");
    const year = parts[2];

    return `${month}-${day}-${year}`; // MM-dd-yyyy
  }

  public GetProhibitedItemCheckOutList() {
    this.showcompanyName = true;
    //  this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
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
      .GetProhibitedItemCheckOutList(fromString, toString)
      .subscribe(
        (response: ProhibitedItemCheckOut[]) => {
          this.prohibitedItemCheckoutList = [];
          this.prohibitedItemCheckoutList = response;
          this.prohibitedItemCheckoutList.forEach((element) => {
            if (element.badgeNo) {
              element.badgeName = `${element.firstName ?? ""} ${
                element.lastName ?? ""
              }`.trim();
            }
          });
          if (this.dtElement?.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy(); // Destroy the existing table instance
              this.dtTrigger.next(); // Reinitialize DataTable
            });
          } else {
            this.dtTrigger.next(); // For initial load
          }
          if (this.isMobileView) {
            this.setPagedData();
          }
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  resetForm() {
    this.prohibitedCheckoutModel = new ProhibitedItemCheckOut();
    this.selectedThumbnailImage = "";
    const now = new Date();
    this.prohibitedCheckoutModel.checkoutTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
    // this.prohibitedCheckoutModel.checkoutDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());

    this.prohibitedCheckoutModel.returnDateTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
    this.editingRowId = 0;
  }

  public GetProhibitedItemCheckOutListByCompany(companyId: number) {
    this.showcompanyName = false;

    this.companyMasterService
      .GetProhibitedItemCheckOutListByCompany(companyId)
      .subscribe(
        (response: ProhibitedItemCheckOut[]) => {
          this.prohibitedItemCheckoutList = [];
          this.prohibitedItemCheckoutList = response;
          // this.prohibitedItemCheckoutList =
          //   this.prohibitedItemCheckoutList.filter(
          //     (x) => x.returnDateTime == null
          //   );
          this.prohibitedItemCheckoutList.forEach((element) => {
            if (element.badgeNo) {
              element.badgeName = `${element.firstName ?? ""} ${
                element.lastName ?? ""
              }`.trim();
            }
          });

          if (this.dtElement?.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy(); // Destroy the existing table instance
              this.dtTrigger.next(); // Reinitialize DataTable
            });
          } else {
            this.dtTrigger.next(); // For initial load
          }
          if (this.isMobileView) {
            this.setPagedData();
          }
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  GetProhibitedItemCheckOutListByCompanyForstaffadmin(companyId: number) {
    this.showcompanyName = false;

    let fromString = this.normalizeDateString(
      this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    );
    let toString = this.normalizeDateString(
      this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    );

    this.companyMasterService
      .GetProhibitedItemCheckOutListByCompanyForstaffadmin(
        companyId,
        fromString,
        toString
      )
      .subscribe(
        async (response) => {
          // 1️⃣ Destroy DataTable BEFORE updating data
          if (this.dtElement?.dtInstance) {
            const dtInstance = await this.dtElement.dtInstance;
            dtInstance.destroy();
          }

          // 2️⃣ Update table data
          this.prohibitedItemCheckoutList = response;

          this.prohibitedItemCheckoutList.forEach((element) => {
            if (element.badgeNo) {
              element.badgeName = `${element.firstName ?? ""} ${
                element.lastName ?? ""
              }`.trim();
            }
          });

          // 3️⃣ Re-render DataTable
          this.dtTrigger.next();

          // 4️⃣ Mobile view pagination
          if (this.isMobileView) {
            this.setPagedData();
          }
        },
        (error) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  public GetProhibitedItemCheckOutListByUserId() {
    this.showcompanyName = false;
    this.companyMasterService
      .GetProhibitedItemCheckOutListByUserId(this.user.id)
      .subscribe(
        (response: ProhibitedItemCheckOut[]) => {
          this.prohibitedItemCheckoutList = response;
          // this.prohibitedItemCheckoutList =
          //   this.prohibitedItemCheckoutList.filter(
          //     (x) => x.returnDateTime == null
          //   );
          this.prohibitedItemCheckoutList.forEach((element) => {
            if (element.badgeNo) {
              element.badgeName = `${element.firstName ?? ""} ${
                element.lastName ?? ""
              }`.trim();
            }
          });

          if (this.dtElement?.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy(); // Destroy the existing table instance
              this.dtTrigger.next(); // Reinitialize DataTable
            });
          } else {
            this.dtTrigger.next(); // For initial load
          }
          this.setPagedData();
        },
        (error: any) => {
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  public GetShortDescriptionsByCompanyId(companyId: number) {
    this.companyMasterService
      .GetShortDescriptionsByCompanyId(companyId)
      .subscribe({
        next: (response) => {
          // ✅ Filter only "Approved" items
          const approvedItems = response.filter(
            (item) => item.status === "Approved"
          );

          // ✅ Map the approved items
          this.shortDesc = approvedItems
            .map((item) => ({
              shortDescription: item.shortDescription,
              filePath: item.filePath,
              thumbnailImage: item.thumbnailImage,
              // thumbnailImage: item.thumbnailImage
              //   ? "data:image/png;base64," + item.thumbnailImage
              //   : "",
              description: item.description,
              quantityAllowed: item.quantityAllowed,
              newQuantityAllowed: item.newQuantityAllowed,
              location: item.location,
              locationId: item.locationId,
              status: item.status,
              itemId: item.itemId,
              prohibitedItemId: item.prohibitedItemId,
              companyId: item.companyId,
              companyName: item.companyName,
              displayText: item.itemId
                ? `${item.shortDescription} <> ${item.itemId}`
                : item.shortDescription,
            }))
            .sort((a, b) =>
              a.shortDescription.localeCompare(b.shortDescription)
            );
        },
      });
  }

  public GetShortDescriptionsByUserId(userId: string) {
    this.showcompanyName = false;
    this.companyMasterService.GetShortDescriptionsByUserId(userId).subscribe({
      next: (response) => {
        // ✅ Filter only "Approved" items
        const approvedItems = response.filter(
          (item) => item.status === "Approved"
        );

        // ✅ Map the approved items
        this.shortDesc = approvedItems
          .map((item) => ({
            shortDescription: item.shortDescription,
            filePath: item.filePath,
            thumbnailImage: item.thumbnailImage,
            //thumbnailImage: item.thumbnailImage
            // ? "data:image/png;base64," + item.thumbnailImage
            // : "",
            description: item.description,
            quantityAllowed: item.quantityAllowed,
            newQuantityAllowed: item.newQuantityAllowed,
            location: item.location,
            locationId: item.locationId,
            status: item.status,
            itemId: item.itemId,
            prohibitedItemId: item.prohibitedItemId,
            companyId: item.companyId,
            companyName: item.companyName,
            displayText: item.itemId
              ? `${item.shortDescription} <> ${item.itemId}`
              : item.shortDescription,
          }))
          .sort((a, b) => a.shortDescription.localeCompare(b.shortDescription));
      },
    });
  }

  onShortDescChange(selected: any): void {
    this.prohibitedCheckoutModel.shortDescription = selected.shortDescription;
    // this.prohibitedCheckoutModel.location = selected.location
    this.prohibitedCheckoutModel.itemId = selected.itemId;
    this.prohibitedCheckoutModel.filePath = selected.filePath;
    this.prohibitedCheckoutModel.prohibitedItemId = selected.prohibitedItemId;
    this.prohibitedCheckoutModel.status = selected.status;
    this.prohibitedCheckoutModel.companyId = selected.companyId;
    this.prohibitedCheckoutModel.companyName = selected.companyName;
    if (selected && selected.thumbnailImage) {
      this.selectedThumbnailImage = selected.thumbnailImage;
    } else {
      this.selectedThumbnailImage = "";
    }
    this.prohibitedCheckoutModel.prohibitedItemId = selected.prohibitedItemId;
    //this.prohibitedCheckoutModel.location = selected.location
  }

  public getProhibitedrecordById(selected: any) {
    this.companyMasterService.GetProhibitedrecordByIdForCheckout(selected.prohibitedItemId).subscribe({
      next: (response) => {
        //this.prohibitedCheckoutModel = response;

        this.prohibitedCheckoutModel.shortDescription = selected.shortDescription;
    // this.prohibitedCheckoutModel.location = selected.location
    this.prohibitedCheckoutModel.itemId = response.itemId;
    this.prohibitedCheckoutModel.filePath = response.filePath;
    this.prohibitedCheckoutModel.prohibitedItemId = response.id;
    this.prohibitedCheckoutModel.status = response.status;
    this.prohibitedCheckoutModel.companyId = response.companyId;
    this.prohibitedCheckoutModel.companyName = response.companyName;
    if (response && response.thumbnailImage) {
      this.selectedThumbnailImage = response.thumbnailImage;
    } else {
      this.selectedThumbnailImage = "";
    }
    this.prohibitedCheckoutModel.prohibitedItemId = response.id;
    this.displayText = response.itemId
              ? `${response.description} <> ${response.itemId}`
              : response.description;

    const now = new Date();
    const today = new Date();
    this.year = now.getFullYear();
    this.month = String(now.getMonth() + 1).padStart(2, "0");
    this.day = String(now.getDate()).padStart(2, "0");
    this.hours = String(now.getHours()).padStart(2, "0");
    this.minutes = String(now.getMinutes()).padStart(2, "0");

    this.prohibitedCheckoutModel.checkoutTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
      },
      error: (err) => {
        this.toastr.error('Failed to load item.', 'Error');
      }
    });

  }

  public onCompanySelected(): void {
    if (this.selectedCompany === null) {
      if (this.isAuthsigner) {
        this.GetShortDescriptionsByUserId(this.user.id);
        this.GetProhibitedItemCheckOutListByUserId();
      }
      if (this.isStaffAdmin) {
        this.GetProhibitedItemCheckOutList();
      }
    }
    if (!this.selectedCompany || !this.selectedCompany.id) {
      return;
    }
    const companyId = this.selectedCompany.id;

    if (this.isAuthsigner) {
      this.GetShortDescriptionsByCompanyId(companyId);
      this.GetProhibitedItemCheckOutListByCompany(companyId);
    }
    if (this.isStaffAdmin) {
      this.GetProhibitedItemCheckOutListByCompanyForstaffadmin(companyId);
    }

    this.GetLocationListByCompanyId(companyId);
    this.resetForm();
  }

  public GetLocationById(id: number) {
    //this.spinner.show();
    this.companyMasterService
      .GetLocationById(id)
      .subscribe((response: Locations) => {
        this.location = response;
        this.location.id = id;
        this.prohibitedCheckoutModel.location = this.location.location;
      });
  }

  
  public GetLocationListByCompanyId(companyId: number) {
    this.companyMasterService
      .GetLocationListByCompanyId(companyId)
      .subscribe((response: Locations[]) => {
        this.locationList = response;
        this.locationList.sort((a, b) => a.location.localeCompare(b.location));
        this.dtTrigger.next();
      });
  }

  GetBadgeholderInfoASCX() {
    const badgeNo = this.prohibitedCheckoutModel.badgeNo;

    if (badgeNo && badgeNo.trim() !== "") {
      this.NovService.GetBadgeByNumber(badgeNo).subscribe(
        (res) => {
          if (res && res.data && res.data.length > 0) {
            const data = res.data[0];
            if (data) {
              this.prohibitedCheckoutModel.badgeNo = data.badgeNumber;
              this.prohibitedCheckoutModel.badgeName =
                data.firstName + " " + data.lastName;
              this.prohibitedCheckoutModel.firstName = data.firstName;
              this.prohibitedCheckoutModel.lastName = data.lastName;
            } else {
              this.toastr.warning(
                "Security Badge # does not exist.",
                "Warning"
              );
            }
          } else {
            this.toastr.warning("Security Badge # does not exist.", "Warning");
          }
        },
        (error) => {
          this.toastr.error("Failed to retrieve badge info.", "Error");
        }
      );
    } else {
      this.toastr.warning("Please enter a valid Security Badge #", "Warning");
    }
  }

  GetBadgeholderInfo() {
    const badgeNo = this.prohibitedCheckoutModel.badgeNo?.trim();

    if (!badgeNo) {
      this.toastr.warning("Please enter a valid Security Badge #", "Warning");
      return;
    }

    this.NovService.GetBadgeholderInfo(badgeNo).subscribe({
      next: (data: Badgeholder) => {
        if (data) {
          // If badge is found, update the model

          this.prohibitedCheckoutModel.badgeNo = data.badgeNo;
          this.prohibitedCheckoutModel.badgeName =
            data.firstName + " " + data.lastName;
          this.prohibitedCheckoutModel.firstName = data.firstName;
          this.prohibitedCheckoutModel.lastName = data.lastName;
        } else {
          this.toastr.warning("Security Badge # does not exist.", "Warning");
        }
      },
      error: (error: any) => {
        this.toastr.error("Failed to retrieve badge info.", "Error");
      },
    });
  }

  public GetChekoutItemById(id: number) {
    this.editingRowId = id;
    this.companyMasterService.GetChekoutItemById(id).subscribe({
      next: (response: ProhibitedItemCheckOut) => {
        this.prohibitedCheckoutModel = response;
        this.isEdit = true;
        const now = new Date();
        this.year = now.getFullYear();
        this.month = String(now.getMonth() + 1).padStart(2, "0");
        this.day = String(now.getDate()).padStart(2, "0");
        this.hours = String(now.getHours()).padStart(2, "0");
        this.minutes = String(now.getMinutes()).padStart(2, "0");
        this.prohibitedCheckoutModel.returnDateTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
        if (this.prohibitedCheckoutModel.badgeNo) {
          this.prohibitedCheckoutModel.badgeName =
            this.prohibitedCheckoutModel.firstName +
            " " +
            this.prohibitedCheckoutModel.lastName;
        }
        if (this.prohibitedCheckoutModel.locationId) {
          this.GetLocationById(this.prohibitedCheckoutModel.locationId);
        }

        this.prohibitedCheckoutModel.thumbnailImage = response.thumbnailImage
          ? "data:image/png;base64," + response.thumbnailImage
          : "";
        this.prohibitedCheckoutModel.shortDescription =
          response.shortDescription;
        //this.prohibitedCheckoutModel.thumbnailImage = response.thumbnailImage
      },
      error: (err) => {
        this.toastr.error("Failed to load item.", "Error");
      },
    });
  }

  cancelRecord() {
    this.prohibitedCheckoutModel = new ProhibitedItemCheckOut();
    this.selectedThumbnailImage = "";
    const now = new Date();
    this.prohibitedCheckoutModel.filePath = "";
    this.prohibitedCheckoutModel.checkoutTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
    // this.prohibitedCheckoutModel.checkoutDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());

    this.prohibitedCheckoutModel.returnDateTime = "";
    this.editingRowId = 0;
    this.isEdit = false;
  }

  saveProhibitedItemCheckOut() {
    if (!this.prohibitedCheckoutModel.shortDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    if (this.isEdit == true) {
      this.prohibitedCheckoutModel.thumbnailImage = "";
      this.prohibitedCheckoutModel.updatedBy = this.user.id;
      if (this.prohibitedCheckoutModel.returnDateTime == "") {
        this.prohibitedCheckoutModel.returnDateTime = `${this.year}-${this.month}-${this.day}T${this.hours}:${this.minutes}`;
      }

      // const parts = this.prohibitedCheckoutModel.checkoutDate.split('-');
      // const day = parts[0].padStart(2, '0');
      // const month = parts[1].padStart(2, '0');
      // const year = parts[2];
      // this.prohibitedCheckoutModel.checkoutDate = `${month}-${day}-${year}`;
    } else {
      if (this.prohibitedCheckoutModel.locationId) {
        this.GetLocationById(this.prohibitedCheckoutModel.locationId);
      }
      this.prohibitedCheckoutModel.submittedBy = this.user.id;
      this.prohibitedCheckoutModel.returnDateTime = null;

      if (this.selectedCompany) {
        this.prohibitedCheckoutModel.companyId = this.selectedCompany.id;
        this.prohibitedCheckoutModel.companyName =
          this.selectedCompany.companyName;
      } else {
        // All Companies
        this.prohibitedCheckoutModel.companyId =
          this.prohibitedCheckoutModel.companyId; // already set in onShortDescChange
        this.prohibitedCheckoutModel.companyName =
          this.prohibitedCheckoutModel.companyName;
      }
    }
    this.prohibitedCheckoutModel.thumbnailImage = "";
    const checkOutDetails = this.prohibitedCheckoutModel;
    this.companyMasterService
      .AddEditProhibitedItemCheckOut(checkOutDetails)
      .subscribe((response: any) => {
        this.toastr.success("Prohibited Items details saved!!", "Information");
        this.resetForm();
        this.GetProhibitedItemCheckOutListByCompany(this.selectedCompany.id);
        this.GetShortDescriptionsByCompanyId(this.selectedCompany.id);
        this.isEdit = false;
      });
  }

  // deleteCheckout(id: number): void {
  //   if (confirm("Are you sure you want to delete this record?")) {
  //     // $("#dt1").DataTable().destroy();
  //     this.companyMasterService.DeleteCheckoutRecordById(id).subscribe({
  //       next: (response: any) => {
  //         if (response.statusText === "Fail") {
  //           this.toastr.warning("Failed to delete. Please try again.");
  //         } else if (response.statusText === "Success") {
  //           this.toastr.success("Item deleted successfully");
  //           if (this.isStaffAdmin == true) {
  //             this.GetProhibitedItemCheckOutList()
  //           }

  //         } else {
  //           this.toastr.error("Please try again");
  //         }
  //       },
  //       error: () => {
  //         this.toastr.error("Error deleting company", "Error");
  //       },
  //     });
  //   }
  // }
  deleteCheckout(id: number): void {
    this.deleteId = id;
    this.modalRef = this.modalService.open(this.deleteTemplate, {
      centered: true,
    });
  }

  confirmDelete(): void {
    if (this.deleteId == null) return;

    this.companyMasterService
      .DeleteCheckoutRecordById(this.deleteId)
      .subscribe({
        next: (response: any) => {
          if (response.statusText === "Fail") {
            this.toastr.warning("Failed to delete. Please try again.");
          } else if (response.statusText === "Success") {
            this.toastr.success("Item deleted successfully");
            if (this.isStaffAdmin === true) {
              this.GetProhibitedItemCheckOutList();
            }
          } else {
            this.toastr.error("Please try again");
          }

          this.modalRef?.close();
          this.deleteId = null;
        },
        error: () => {
          this.toastr.error("Error deleting company", "Error");
          this.modalRef?.close();
          this.deleteId = null;
        },
      });
  }
}
