import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataOutputModel, FromTODate, InspetionRecordDetail, MobileViewData } from './inspectionrecord.model';
import { InspectionrecordService } from './inspectionrecord.service';
import { DataTableDirective } from "angular-datatables";
import { InspectionTypes } from '../master/inspectiontypes';
import { InspectionTypeService } from '../master/inspectiontypes/inspectiontypes.service';
import { Locations } from '../master/locations';
import { CitationDetails } from '../novlist/CitationDetails';
import { NgbCalendar, NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PagingHeader } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-inspectionrecord',
  templateUrl: './inspectionrecord.component.html',
  styleUrls: ['./inspectionrecord.component.scss'],

})

export class InspectionrecordComponent implements OnInit {
  public windowRef: Window;
  sortDir = 1; //1= 'ASE' -1= DSC
  pageHeaders: PagingHeader = new PagingHeader();
  config: any;
  mobileViewData: MobileViewData = new MobileViewData();
  inspectioninfo: InspetionRecordDetail = new InspetionRecordDetail();
  inspectionList: InspetionRecordDetail[] = [];
  inspectionListAll: InspetionRecordDetail[] = [];
  dtTrigger: Subject<any> = new Subject();
  dtOptions = {}// DataTables.Settings = {};
  user: any;
  isStaffAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isSuperAdmin: boolean = false;
  isIssuer: boolean = true;
  inspectioId: number = 0;
  isClone: boolean = false;
  allInspectionTypeDisplayNameList: InspectionTypes[];
  selectedDoorNames: string = "";
  selectedDoorGateNumber: Locations[] = []

  mappingNOV: CitationDetails[] = [];
  eachMappingNovNo: string = "";
  isAdvanceSearch: boolean = false;
  dynamicArray: Array<any> = [];
  newDynamic: any = {};

  fromToDates: FromTODate = new FromTODate();
  fromDate: string;
  toDate: string;

  advancedSearchOptions = [
    { label: "First Name", value: "FirstName" },
    { label: "Last Name", value: "LastName" },
    { label: "Security Badge #", value: "SecurityBadge" },
    { label: "Inspection Summary", value: "InspectionSummary" },
    { label: "Driver's License No.", value: "DriverLicenseNo" },
    { label: "Vehicle License No.", value: "VehicleLicenseNo" },
    { label: "Company Facilitator / Supervisor", value: "CompanyFacilitator" }
  ]

  constructor(
    private router: Router,
    private InspService: InspectionrecordService,
    private spinner: NgxSpinnerService, private toastr: ToastrService,
    private inspTypeService: InspectionTypeService,
    private datePipe: DatePipe,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar, private appURL: AppConfigService,
  ) { }


  async ngOnInit() {
   const savedPageSize = sessionStorage.getItem('InspectionPageSize');
    const savedPageNumber = sessionStorage.getItem('InspectionPageNumber');

    this.mobileViewData.pageSize = savedPageSize ? +savedPageSize : 10;
    this.mobileViewData.pageNumber = savedPageNumber ? Number(savedPageNumber): 1;
    this.mobileViewData.maxPageSize = savedPageSize ? +savedPageSize : 10;
    this.config = {
      currentPage: 1,
      itemsPerPage: this.mobileViewData.pageSize,
    };
    this.windowRef = window;

    

    sessionStorage.setItem("tab", "");
    this.newDynamic = { fieldName: "", fieldValue: "" };
    this.dynamicArray.push(this.newDynamic);

    this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())

    this.fromToDates.fromDate = this.dateAdapter.toModel(
      this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), 'd', 6)
    );
    // this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(),'d',30))


    //Read from session and bind to frommodels
    var inspSearch = JSON.parse(sessionStorage.getItem("inspectionSearch"));
    if (inspSearch != null) {
      this.fromToDates = inspSearch;
    }

    const savedSearchText = sessionStorage.getItem("inspectionSearchText");
    if (savedSearchText) {
    this.mobileViewData.searchQuery = savedSearchText;
    }

    this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta') {
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }
    if (this.user.rolename == "Issuer") {
      this.isStaffAdmin = false;
      this.isAuthsigner = false;
      this.isIssuer = true;

    } else if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
      this.isAuthsigner = false;
      this.isIssuer = false;
    }
    else if (this.user.rolename == "TSA User") {
      this.isStaffAdmin = true;
      this.isAuthsigner = true;
      this.isIssuer = false;
    }
    else {
      //SuperADmin
      this.isSuperAdmin = true;
      this.isStaffAdmin = true;
      this.isAuthsigner = false;
      this.isIssuer = false;
    }
    if (this.windowRef.innerWidth < 768) {
      await this.GetInspectionTypeList();
      this.GetInspectionListForMobileView();
    } else if (this.windowRef.innerWidth >= 768) {
      //this.GetInspectionList(this.fromDate, this.toDate);
     await this.GetInspectionTypeList();
       this.GetInspectionListForMobileView();
    } else {
    }


this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 100,
      stateSave: true,
      stateDuration: -1,
      order: [[0, 'desc']],
      columnDefs: [
        { targets: 3, type: 'date', width: '11%' },
        { targets: 4, width: '9%' },
        { targets: 7, width: '17%' },
        { targets: 9, width: '12%' }
      ],
      dom: 'lBfrtip',
    };
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

  basicSearchInspection() {
    sessionStorage.setItem("inspectionSearch", JSON.stringify(this.fromToDates));
    this.fromDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate))
    this.toDate = this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    $("#dt1").DataTable().destroy();
    if (
      this.fromDate != "mm/dd'yyyy" && this.fromDate != undefined &&
      this.toDate != "mm/dd'yyyy" && this.toDate != undefined
    ) {
     // this.GetInspectionList(this.fromDate, this.toDate);
     this.GetInspectionListForMobileView();
    }

  }

  onResize() {
    var navbar = document.getElementsByClassName("table")[0];
    if (window.innerWidth < 993) {

      navbar.classList.add("table-responsive");
    } else {
      navbar.classList.remove("table-responsive");
    }
  }

  //To show Inspection data on list/main page
  async GetInspectionList(fromDate, toDate): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      //this.spinner.show();    
      this.inspectionList = [];
      this.inspectionListAll = [];
      this.InspService.GetInspectionList(fromDate, toDate).subscribe(
        (response: InspetionRecordDetail[]) => {
          this.inspectionList = response;
          this.inspectionListAll = response;

          resolve()
          this.dtTrigger.next();
          //this.spinner.hide();        
        },
        (error: any) => {
          this.toastr.error('Error while fetching Inspection data', 'Error');
          reject()
          //this.spinner.hide();
        }
      );
    });
  }

  public GetInspectionListForMobileView() {
    //this.spinner.show();
    this.inspectionList = [];
    this.inspectionListAll = [];
    (this.mobileViewData.FromDate = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.fromDate)
    )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.InspService.GetInspectionListForMobileView(
      this.mobileViewData
    ).subscribe(
      (response: DataOutputModel) => {
        this.inspectionList = response.items;
        this.inspectionListAll = response.items;
        this.pageHeaders = response.paging;
          this.mobileViewData.pageNumber = 1;
      },
      (error: any) => {
        this.toastr.error("Error while fetching Inspection data", "Error");
      }
    );
  }
  onPageChange(newPage: number): void {
    this.mobileViewData.pageNumber = newPage;
    sessionStorage.setItem(
    'InspectionPageNumber',
    newPage.toString() );
    this.GetInspectionListForMobileView();
  }
  onPageSizeChange(): void {
   
    sessionStorage.setItem(
    'InspectionPageSize',
    this.mobileViewData.pageSize.toString() );
    this.mobileViewData.pageNumber = 1;
     sessionStorage.setItem(
    'InspectionPageNumber',
    this.mobileViewData.pageNumber.toString() );
    
    this.mobileViewData.pageSize = +this.mobileViewData.pageSize;
    this.mobileViewData.maxPageSize = +this.mobileViewData.pageSize;
  

  
    this.GetInspectionListForMobileView();
  }
  searchtable() {
    this.mobileViewData.pageNumber = 1;
    sessionStorage.setItem("inspectionSearchText", this.mobileViewData.searchQuery);
     
     sessionStorage.setItem(
    'InspectionPageNumber',
    this.mobileViewData.pageNumber.toString() );
    this.GetInspectionListForMobileView();
  }

  onSearchChange(value: string) {
  if (value === "" || value == null) {
    sessionStorage.removeItem("inspectionSearchText");
    this.GetInspectionListForMobileView(); // grid refresh
  }
}
  clearSearch() {
    this.mobileViewData.searchQuery = "";
    sessionStorage.removeItem("inspectionSearchText");
    sessionStorage.removeItem("InspectionPageNumber");
  
    this.GetInspectionListForMobileView();
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
    this.mobileViewData.orderBy = columnname
    this.mobileViewData.orderDir = this.sortDir == -1 ? "desc" : "asc"
    
     this.GetInspectionListForMobileView();
    
  }

  public GetInspectionTypeList() {
    this.inspTypeService.GetInspectionTypeList().subscribe((response: InspectionTypes[]) => {
      this.allInspectionTypeDisplayNameList = response;
      this.allInspectionTypeDisplayNameList.sort((a, b) => a.displayName > b.displayName ? 1 : -1)
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });
  }



  identify(index, item) {
    return item.id;
  }

  public goToEdit() {
    if (this.inspectioninfo.inspectionType == undefined) {
      this.toastr.error("Please select Inspection type.", "Error");
    }
    else {
      var inspType = this.allInspectionTypeDisplayNameList.find(x => x.id == this.inspectioninfo.inspectionType)
      this.router.navigate(["admin/inspection/details"], {
        queryParams: { isEdit: 0, inspTypeId: this.inspectioninfo.inspectionType, inspTypeName: inspType.inspectionType },
        skipLocationChange: true,
      });
    }
  }

  DeleteInspection(id) {

    if (confirm("Are you sure you want to delete Citation?")) {
      this.InspService.DeleteInspectionDetails(id).subscribe(
        (response: Response) => {
          this.toastr.success("Inspection Deleted Sucessfully!");
          $('#dt1').DataTable().destroy();
          this.GetInspectionList(this.fromDate, this.toDate);

        },
        (error: any) => {
          this.toastr.error("Error deleting Inspection. Try Again!");
          //this.spinner.hide();
        }
      );
    }
    else {

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



  clickSearch() {
    this.inspectioninfo = new InspetionRecordDetail();
    this.inspectioninfo.inspectionType = 0

    if (this.isAdvanceSearch == true) {
      this.isAdvanceSearch = false;
    }
    else {
      this.isAdvanceSearch = true;
    }
  }

  showAdvanceSearch() {
    let user = JSON.parse(sessionStorage.getItem("currentUser"));
    return user.rolename == 'StaffAdmin';
  }

  searchInspection() {
    var list = this.inspectionListAll;
    var date = this.datePipe;
    this.dynamicArray.forEach(function (value) {
      $("#dt1")
        .DataTable()
        .destroy();
      switch (value.fieldName) {
        case "FirstName": {
          list = list.filter(c => (c.badgeholderList.find(element =>
            element.firstName.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
        case "LastName": {
          list = list.filter(c => (c.badgeholderList.find(element =>
            element.lastName.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
        case "SecurityBadge": {
          list = list.filter(c => (c.badgeholderList.find(element =>
            element.securityBadgeNo.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
        case "InspectionSummary": {
          list = list.filter(c =>
            c.inspectionSummary.toLowerCase()
              .includes(value.fieldValue.toLowerCase())
          );
          break;
        }
        case "DriverLicenseNo": {
          list = list.filter(c => (c.badgeholderList.find(element =>
            element.driverLicenseNo.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
        case "VehicleLicenseNo": {
          list = list.filter(c => (c.vehicleList.find(element =>
            element.vehicleLicenseNo.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
        case "CompanyFacilitator": {
          list = list.filter(c => (c.companyList.find(element =>
            element.companyFacilitator.toLowerCase().includes(value.fieldValue.toLowerCase())))
          );
          break;
        }
      }
    });
    this.inspectionList = list;
    this.dtTrigger.next();
    this.isClone = true;
  }

  clearInspection() {
    $("#dt1")
      .DataTable()
      .destroy();
    this.inspectioninfo = new InspetionRecordDetail();
    this.inspectionList = [];
    this.inspectionListAll = [];
    this.isClone = false;
    var companyId: number = 0;
    if (this.user.rolename == "AuthSigner") {
      companyId = this.user.companyId;
    }

    this.GetInspectionList(this.fromDate, this.toDate);
    this.dynamicArray = [];
    this.newDynamic = { fieldName: "", fieldValue: "" };
    this.dynamicArray.push(this.newDynamic);
  }
}
