import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import {
  AwsInspList,
  CompanyInformation,
  InspectionAttachments,
  InspectionBadgeholder,
  InspectionEdtAlarm,
  InspectionEdtResolution,
  InspetionRecordDetail,
  VehicleInspection,
} from "../inspectionrecord.model";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { InspectionrecordService } from "../inspectionrecord.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Company } from "../../master/company";
import { CompanyService } from "../../master/company/company.service";
import { Subject } from "rxjs";
import {
  FileSystemDirectoryEntry,
  FileSystemFileEntry,
  NgxFileDropEntry,
} from "ngx-file-drop";
import { InspectionTypeService } from "../../master/inspectiontypes/inspectiontypes.service";
import { InspectionTypes } from "../../master/inspectiontypes";
import { NovService } from "../../novlist/nov.service";
import { CitationDetails } from "../../novlist/CitationDetails";
import { Facilities } from "../../master/facility";
import { FacilityService } from "../../master/facility/facility.service";
import { LocationService } from "../../master/location/location.service";
import { Locations } from "../../master/locations";
// import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Badgeholder } from "../../novlist/badgeholder";
import { error, time } from "console";
import { FormCanDeactivate } from "@app/_helpers/form-can-deactivate/form-can-deactivate";
import { InspectionStatus } from "@app/app.component";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbTimeStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { replaceAll } from "chartist";

@Component({
  selector: "app-inspectionrecordaddedit",
  templateUrl: "./inspectionrecordaddedit.component.html",
  styleUrls: ["./inspectionrecordaddedit.component.scss"],
})
export class InspectionrecordaddeditComponent
  extends FormCanDeactivate
  implements OnInit {
  public windowRef: Window;
  @ViewChild("formData", { static: false })
  // @ViewChild('ctdTabset', { static: false })
  // private ctdTabset: NgbTabset;
  form: NgForm;
  public activeTab = "tab1";
  inspectioninfo: InspetionRecordDetail = new InspetionRecordDetail();
  isInspectionExists: boolean = false;
  loading = false;
  submitted: boolean = false;
  isSaveDetails: boolean = false;
  isSaveFormDetails: boolean = false;
  files: string[] = [];
  deletedFiles: string[] = [];
  readOnlyInspection: boolean = false;
  inspectionId: number = 0;
  companyId: number = 0;
  public isDirty: boolean = false;
  allCompanyList: Company[];
  allInspectionTypeList: InspectionTypes[];
  allFacilityList: Facilities[];
  allLocationList: Locations[] = [];
  @ViewChild("input", { static: false }) myInputVariable: ElementRef;
  public inspectionImageList: InspectionAttachments[] = [];
  public inspectionFilesList: InspectionAttachments[] = [];
  inspectionTimeObj: any;
  user: any;
  isClone: String = "";
  isViewInspection: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  isStaffAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isIssuer: boolean = true;
  isSubmitted: boolean = false;
  isViewAuthorizedSigner: boolean = false;
  isSubmitShow: boolean = false;
  showBtn = -1;
  closeResult: string = "";
  public citationId: number = 0;
  isCitationId: boolean = false;
  isSecurityBadge: boolean = false;
  days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  weekday = [1, 2, 3, 4, 5, 6, 7];
  citation: CitationDetails = new CitationDetails();
  citationNo: number = 0;
  isPerimeterInsp: boolean = false;
  isAWSInspection: boolean = false;
  isPortalInsp: boolean = false;
  isFacilityInsp: boolean = false;
  isDeliveryVehicleInsp: boolean = false;
  isSterileAreaPiInsp: boolean = false;
  isVisitorInfoShow: boolean = false;

  selectedDoorList: Locations[];
  doorDropdownSettings: {};
  selectedDoorGateNumber: Locations[] = [];

  findingDoorList: Locations[];
  findingDoorDropdownSettings: {};

  vehicleModel = new VehicleInspection();
  vehicleInsp: VehicleInspection[] = [];
  isFacility: boolean = false;
  isFinding: boolean = false;
  isDesc: boolean = false;
  sortDir = 1; //1= 'ASE' -1= DSC
  isNOV: boolean = false;
  isNovExists: boolean = false;
  deletedDoorIds: number[] = [];
  doorFiles: string[] = [];
  inspTypeName: string = "";
  inspTypeId: number;
  isGreaterThanZero: boolean = true;
  show: boolean = false;
  isHyperlink: boolean = false;
  mappingNOV: CitationDetails[] = [];
  eachMappingNovNo: string = "";

  badgeholderModel = new InspectionBadgeholder();
  badgeholderInsp: InspectionBadgeholder[] = [];

  companyModel = new CompanyInformation();
  companyInsp: CompanyInformation[] = [];

  readonlyBadge: boolean = false;
  badgeholder: Badgeholder = new Badgeholder();
  BadgeholderList: Badgeholder[] = [];
  isCompany: boolean = false;

  isVehicleInspection: boolean = false;
  deletedBadgeholderIds: number[] = [];
  deletedVehicleIds: number[] = [];
  deletedCompanyIds: number[] = [];
  isDev: boolean = false;
  isShowTable: boolean = false;
  canFindBadgeInfo: boolean = true;
  isValid: boolean = false;
  awsInspList: AwsInspList[] = [];
  awsInspModel = new AwsInspList();
  isBadge1: boolean = false;
  isBadge2: boolean = false;
  isBadge3: boolean = false;

  findingOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  novRequiredOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  hoursNumber = [
    { label: "00", value: "00" },
    { label: "01", value: "01" },
    { label: "02", value: "02" },
    { label: "03", value: "03" },
    { label: "04", value: "04" },
    { label: "05", value: "05" },
  ];

  minutesNumber = [
    { label: "00", value: "00" },
    { label: "15", value: "15" },
    { label: "30", value: "30" },
    { label: "45", value: "45" },
  ];
  personInspected = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];
  unAuthData = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
  ];
  isDeviation = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  leoOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  edtResolutionList: InspectionEdtResolution[] = [];
  edtAlarmList: InspectionEdtAlarm[] = [];
  isEdtResolution:boolean = true;

  selectedDoorName: string = "";
  facilityId: number;
  locationId: number;
  fromScheduler: boolean = false;
  isschedularId: boolean = false;
  // time = {hour: 13, minute: 30};
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  readonly DELIMITER = "/";

  constructor(
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private inspservice: InspectionrecordService,
    private router: Router,
    private route: ActivatedRoute,
    private CompanyService: CompanyService,
    private inspTypeService: InspectionTypeService,
    private facilityService: FacilityService,
    private locationService: LocationService,
    private NovService: NovService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
  ) {
    super();
  }

  ngOnInit() {
    this.isValid = true;
    this.windowRef = window;
    this.inspTypeId =
      this.route.snapshot.pathFromRoot[1].queryParams["inspTypeId"];
    this.inspTypeName =
      this.route.snapshot.pathFromRoot[2].queryParams["inspTypeName"];
    // this.inspectioninfo.inspectionType = inspTypeId
    this.GetCompanyList();
    this.GetInspectionTypeList();
    this.GetFacilityList(this.inspTypeName);
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.inspectioninfo.issuedBy = this.user.name;
    this.inspectioninfo.createdBy = this.user.id;
    this.inspectioninfo.updatedBy = this.user.id;
    // this.inspectioninfo.inspectionTime = new Date().toISOString();
    var isEdit: string =
      this.route.snapshot.pathFromRoot[1].queryParams["isEdit"];
    var isClone: string =
      this.route.snapshot.pathFromRoot[1].queryParams["isClone"];
    this.isClone = isClone;
    this.isDirty = false;
    this.inspectioninfo.id = 0;
    // this.inspectioninfo.inspectionDate = this.datePipe.transform(new Date(),'MM/dd/yyyy');
    this.inspectioninfo.inspectionDate = this.dateAdapter.toModel(
      this.ngbCalendar.getToday()
    );
    this.isSecurityBadge = true;
    this.isPerimeterInsp = false;
    this.isAWSInspection = false;
    this.isPortalInsp = false;
    this.isFacilityInsp = false;
    this.isDeliveryVehicleInsp = false;
    this.isSterileAreaPiInsp = false;
    this.isVisitorInfoShow = false;
    this.isFacility = false;
    this.isFinding = true;
    this.isNOV = true;

    var inspectionId: number =
      this.route.snapshot.pathFromRoot[1].queryParams["inspectionId"];
    this.citationId =
      this.route.snapshot.pathFromRoot[1].queryParams["citationId"];
    if (isEdit == "1") {
      if (isClone != "1") {
        this.readOnlyInspection = true;
        console.log("Here1");
      } else {
        this.inspectioninfo.issuedBy = this.user.name;
        console.log("Here2");
      }
      this.companyId = this.user.companyId;
      this.inspectionId = inspectionId;
      if(inspectionId > 0){
        this.isEdtResolution = false;
      }
      //Get Inspection details by id, company id
      //this.GetInspectionDetailsById(inspectionId, this.companyId);
      //this.isCitationId=true;
    } else {
      //Assign Issued by in ADD
      this.inspectioninfo.issuedBy = this.user.name;
      this.isViewInspection = false;
    }

    if (inspectionId > 0) {
      this.inspectionId = inspectionId;
    }
    if (this.inspectionId > 0) {
      this.GetInspectionDetailsById(this.inspectionId, this.companyId);
    }

    //Set default active tab
    sessionStorage.setItem("tab", this.activeTab);

    // else if (inspectionId > 0 && this.citationId == 0) {
    //   this.GetInspectionDetailsById(inspectionId, this.companyId);
    // }

    
    this.getEdtResolutionList();
    this.getEdtAlarmList();

    this.doorDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "location",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.findingDoorDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "location",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.showFields(this.inspTypeId, this.inspTypeName);
    this.route.queryParams.subscribe((params) => {
      const scheduleDate = params["scheduleDate"];
      const startTime = params["startTime"];
      const door = params["door"];
      this.facilityId = +params["facilityId"];
      this.locationId = +params["locationId"];
      this.fromScheduler = params["fromScheduler"] === 'true';
      this.inspectioninfo.schedulerInputId = +params["schedulerId"];
      this.inspectioninfo.schedulerSlotId = params["slotId"];

      this.inspectioninfo.inspectionFacilityId = this.facilityId;

      this.GetLocationListByFacility(this.facilityId);
      // Date

      if (startTime) {
        this.inspectioninfo.inspectionTime = this.convertTo24Hour(startTime);
      } else {
        this.inspectioninfo.inspectionTime = this.datePipe.transform(
          new Date(),
          "HH:mm",
        );
      }
      if (scheduleDate) {
        this.inspectioninfo.inspectionDate =
          this.convertMMDDYYYYToAdapterFormat(scheduleDate);

        //this.inspectioninfo.inspectionDate = this.dateAdapter.toModel(ngbDate);
      } else {
        this.inspectioninfo.inspectionDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
      }
      // Save door temporarily
      this.selectedDoorName = door;
    });
    // this.inspectioninfo.inspectionNOV = "0"
  }

  private convertMMDDYYYYToAdapterFormat(date: string): string {
    const parts = date.split("/");
    return `${parts[1]}-${parts[0]}-${parts[2]}`;
  }

  checkBadgeFields() {
    this.canFindBadgeInfo = !(
      this.badgeholderModel.securityBadgeNo &&
      this.badgeholderModel.securityBadgeNo2 &&
      this.badgeholderModel.securityBadgeNo3
    );
  }

  public GetCitationDetailsById(citationId: number, companyId: number) {
    this.NovService.GetCitationDetailsById(citationId, companyId).subscribe(
      (data: CitationDetails) => {
        //this.citation = data as CitationDetails;
        this.citationNo = data.novNo;
        // this.inspectioninfo.inspectionNOVNumber = this.citationNo
        if (this.citationNo > 0) {
          this.isNOV = true;
          this.isNovExists = false;
        }
      },
      (error: any) => {
        //this.spinner.hide();
        //this.toastr.error(`${error}`, "Error");
      }
    );
  }

  securityBadge(ans) {
    if (ans == 1) {
      this.isSecurityBadge = false;
    } else {
      this.isSecurityBadge = true;
      this.inspectioninfo.securityBadge = "";
    }
  }

  getEdtResolutionList(){
    this.inspservice.GetEdtResolutionList().subscribe(
      (data: any) => {
        this.edtResolutionList = data;
      },
      (error: any) => {
        // Handle error appropriately
        console.error("Error fetching EDT resolution list:", error);
      }
    );
  }

  getEdtAlarmList(){  
    this.inspservice.GetEdtAlarmList().subscribe(   
      (data: any) => {    
        this.edtAlarmList = data; 
      },
      (error:any) => {  
        console.error("Error fetching EDT alarm list:", error); 
      }
    )
  }   



  bindInspectionDetails() {
    var inspectionDetails = {
      id: this.inspectioninfo.id,
      InspectionRecordNo: this.inspectioninfo.inspectionRecordNo,
      SecurityBadgeHolder: this.inspectioninfo.securityBadgeHolder,
      SecurityBadge: this.inspectioninfo.securityBadge,
      CompanyInspected: this.inspectioninfo.companyInspected,
      CompanyEscorting: this.inspectioninfo.companyEscorting,
      FirstName: this.inspectioninfo.firstName,
      LastName: this.inspectioninfo.lastName,
      // BadgeholderDOB: this.inspectioninfo.badgeHolderDOB,
      // BadgeHolderDOB: this.datePipe.transform(this.inspectioninfo.badgeHolderDOB, 'MM/dd/yyyy'),
      MVOP: this.inspectioninfo.mvop,
      DriverLicenseNo: this.inspectioninfo.driverLicenseNo,
      LicenseState: this.inspectioninfo.licenseState,
      VehicleState: this.inspectioninfo.vehicleState,
      VehicleYear: this.inspectioninfo.vehicleYear,
      VehicleModel: this.inspectioninfo.vehicleModel,
      VehicleLicenseNo: this.inspectioninfo.vehicleLicenseNo,
      // InspectionDate: this.datePipe.transform(this.inspectioninfo.inspectionDate, 'MM/dd/yyyy'),
      InspectionDate: this.dateAdapter.toModel(
        this.fromModel(this.inspectioninfo.inspectionDate)
      ),
      // InspectionTime: this.datePipe.transform(this.inspectioninfo.inspectionTime, 'MM/dd/yyyy HH:mm:ss'),
      InspectionTime: this.inspectioninfo.inspectionTime,
      Hours: this.inspectioninfo.hours,
      Minutes: this.inspectioninfo.minutes,
      InspectionType: this.inspTypeId,
      InspectionFacilityId: this.inspectioninfo.inspectionFacilityId,
      // InspectionLocationId: this.inspectioninfo.inspectionLocationId,
      InspectionFinding: this.inspectioninfo.inspectionFinding,
      InspectionNOV: this.inspectioninfo.inspectionNOV,
      // InspectionIncidentReport: this.inspectioninfo.inspectionIncidentReport,
      InspectionSummary: this.inspectioninfo.inspectionSummary,
      CurrentInspectionStatusId: InspectionStatus.Draft,
      CreatedBy: this.inspectioninfo.createdBy,
      CreatedDate: this.datePipe.transform(
        this.inspectioninfo.createdDate,
        "MM/dd/yyyy"
      ),
      UpdatedBy: this.user.id,
      UpdatedDate: this.datePipe.transform(
        this.inspectioninfo.updatedDate,
        "MM/dd/yyyy"
      ),
      IssuedBy: this.inspectioninfo.issuedBy,
      //isSubmitted: false,
      DoorGateNumber: this.inspectioninfo.doorGateNumber,
      InspectionNOVNumber: this.inspectioninfo.inspectionNOVNumber,
      BadgeholderList: this.inspectioninfo.badgeholderList,
      AwsInspList: this.inspectioninfo.awsInspList,
      //BadgeholderList: this.BadgeholderList,
      VehicleList: this.inspectioninfo.vehicleList,
      CompanyList: this.inspectioninfo.companyList,
      IndividualsInspected: this.inspectioninfo.individualsInspected,
      UnAuthData: this.inspectioninfo.unAuthData,
      IsDeviation: this.inspectioninfo.isDeviation,
      Justification: this.inspectioninfo.justification,
      Badge1: this.inspectioninfo.badge1,
      Name1: this.inspectioninfo.name1,
      Badge2: this.inspectioninfo.badge2,
      Name2: this.inspectioninfo.name2,
      Badge3: this.inspectioninfo.badge3,
      Name3: this.inspectioninfo.name3,
      IsBadgeAutoFilled: this.inspectioninfo.isBadgeAutoFilled,
      EdtResolution: this.inspectioninfo.edtResolution,
      EdtAlarm: this.inspectioninfo.edtAlarm,
      SchedulerInputId: this.inspectioninfo.schedulerInputId,
      SchedulerSlotId: this.inspectioninfo.schedulerSlotId,
      IsLeo: this.inspectioninfo.isLeo,
    };
    return inspectionDetails;
  }

  //Inspection page UnAuthdata field only allow numeric value
//   onlyNumberKey(event: KeyboardEvent) {
//   const charCode = event.which ? event.which : event.keyCode;
  
//   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
//     event.preventDefault();
//     return false;
//   }
//   return true;
// }

onlyNumberKey(event: KeyboardEvent) {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab'
  ];

  if (
    allowedKeys.includes(event.key) ||
    (event.key >= '0' && event.key <= '9')
  ) {
    return;
  }

  event.preventDefault();
}


  resetIsDirtyFlag() {
    this.isDirty = false;
  }

  //To save Inspection
  saveInspectionRecord(formData: NgForm) {
    // console.log(formData.value)
    //this.spinner.show();
    if (this.isInspectionExists) {
      this.inspectioninfo.inspectionRecordNo = undefined;
      this.toastr.error(
        "Please try again! Either this Inspection already exists Or Try entering Inspection between 1 and 100000.",
        "Information"
      );
      //this.spinner.hide();
    } else {
      var inspectionDetails = this.bindInspectionDetails();
      if (inspectionDetails.IsDeviation == "0") {
        inspectionDetails.Justification = null;
      }
      //this.submitted = true;
      if (inspectionDetails.CompanyInspected == null) {
        inspectionDetails.CompanyInspected = 0;
      }
      if (inspectionDetails.CompanyEscorting == null) {
        inspectionDetails.CompanyEscorting = 0;
      }
      // // stop here if form is invalid
      // if (formData.invalid) {
      //   return;
      // }
      this.isSaveFormDetails = true;
      this.loading = true;

      if (this.inspectioninfo.currentInspectionStatusId != undefined) {
        inspectionDetails.CurrentInspectionStatusId =
          this.inspectioninfo.currentInspectionStatusId;
      } else
        inspectionDetails.CurrentInspectionStatusId = InspectionStatus.Draft;

      if (inspectionDetails.Hours == null) {
        inspectionDetails.Hours = 0;
      }
      if (inspectionDetails.Minutes == null) {
        inspectionDetails.Minutes = 0;
      }
      if (
        inspectionDetails.InspectionNOVNumber == null ||
        inspectionDetails.InspectionNOVNumber == undefined
      ) {
        inspectionDetails.InspectionNOVNumber = 0;
      }
      if (
        inspectionDetails.InspectionNOV == null ||
        inspectionDetails.InspectionNOV == undefined
      ) {
        inspectionDetails.InspectionNOV = "0";
      }
      if (
        inspectionDetails.InspectionFinding == null ||
        inspectionDetails.InspectionFinding == undefined
      ) {
        inspectionDetails.InspectionFinding = "0";
      }
      if (this.isDeliveryVehicleInsp == true) {
        this.validateAndAddBadgeholderRecord(0);
      }
      if (this.isVehicleInspection == true) {
        this.validateAndAddVehicleRecord(0);
      }
      if (this.isSterileAreaPiInsp == true) {
        this.validateAndAddCompanyRecord(0);
      }
      if (this.selectedDoorList.length == 0) {
        this.toastr.error("Please select door/gate.", "Information");
        //this.spinner.hide();
        return;
      }
      if (inspectionDetails.InspectionFinding == "1") {
        if (this.findingDoorList.length == 0) {
          this.toastr.error(
            "Please select at least one Finding/Vulnerability door/gate.",
            "Information"
          );
          //this.spinner.hide();
          return;
        }
      }
      if (inspectionDetails.IndividualsInspected == null) {
        inspectionDetails.IndividualsInspected = 0;
      }
      if (
        inspectionDetails.IsLeo == null ||
        inspectionDetails.IsLeo == undefined
      ) {
        inspectionDetails.IsLeo = "0";
      }
      this.inspservice
        .AddInpsectionDetail(
          inspectionDetails,
          this.isSaveFormDetails,
          this.files,
          this.deletedFiles,
          this.selectedDoorList,
          this.findingDoorList,
          this.deletedBadgeholderIds,
          this.deletedVehicleIds,
          this.deletedCompanyIds
        )
        .subscribe(
          (response: string) => {
            this.loading = false;
            this.toastr.success(
              "Inspection Information saved – Please remember to click Submit upon completion!!",
              "Information"
            );
            if (inspectionDetails.CurrentInspectionStatusId === 4) {
              this.isSubmitShow = false;
            } else {
              this.isSubmitShow = true;
            }

            //this.spinner.hide();
            this.files = [];
            this.deletedFiles = [];
            this.readOnlyInspection = true;
            this.resetIsDirtyFlag();

            //this.inspectioninfo.id = +response;
            //this.GetInspectionDetailsById(+response, this.inspectioninfo.companyInspected);
            // if(inspectionDetails.InspectionNOV == "1" && inspectionDetails.InspectionNOVNumber == 0 && this.isCitationId == false )
            if (
              inspectionDetails.InspectionNOV == "1" &&
              this.isCitationId == false
            ) {
              this.router.navigate(["admin/nov/details"], {
                queryParams: { isEdit: 0, inspectionId: response },
                skipLocationChange: true,
              });
            } else {
              this.router.navigate(["/admin/dashboard"]).then(() => {
                this.router.navigate(["/admin/inspection/details"], {
                  queryParams: {
                    inspectionId: response,
                    isEdit: 1,
                    isClone: 0,
                    fromScheduler: this.fromScheduler,
                  },
                });
              });
            }
          },
          (error: any) => {
            this.toastr.error(
              "Inspection Information not saved!",
              "Information"
            );
            //this.spinner.hide();
          }
        );
    }
  }

  convertDate(date): string {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : "";
  }

  //To check the entered Inspection no exists or not
  CheckInspectionExists() {
    if (!this.readOnlyInspection) {
      let inspid =
        this.inspectioninfo.inspectionRecordNo === undefined
          ? 0
          : this.inspectioninfo.inspectionRecordNo;
      this.inspservice.CheckInspectionExists(inspid).subscribe(
        (response) => {
          if (response) {
            this.isInspectionExists = true;
            this.toastr.error(
              "Please try again! Either this Inspection already exists Or Try entering Inspection between 1 and 100000.",
              "Information"
            );
            this.inspectioninfo.inspectionRecordNo = 0;
          } else {
            this.isInspectionExists = false;
          }
        },
        (error: any) => {
          this.toastr.error(
            "Please try again! Either this Inspection already exists Or Try entering Inspection between 1 and 100000.",
            "Information"
          );
          //this.spinner.hide();
        }
      );
    }
  }

  //To save unsaved changes before going to close and Add Nov
  saveBeforeContinue() {
    //this.spinner.show();
    var inspectionDetails = this.bindInspectionDetails();
    //this.submitted = true;
    // stop here if form is invalid
    if (this.CheckRequiredFields()) {
      this.toastr.error("Please enter required fields", "Alert");
      //this.spinner.hide();
      return false;
    } else {
      this.isSaveFormDetails = true;
      this.loading = true;
      if (inspectionDetails.CompanyInspected == null) {
        inspectionDetails.CompanyInspected = 0;
      }
      if (inspectionDetails.CompanyEscorting == null) {
        inspectionDetails.CompanyEscorting = 0;
      }

      if (this.inspectioninfo.currentInspectionStatusId != undefined) {
        inspectionDetails.CurrentInspectionStatusId =
          this.inspectioninfo.currentInspectionStatusId;
      } else
        inspectionDetails.CurrentInspectionStatusId = InspectionStatus.Draft;

      if (this.inspectioninfo.hours == null) {
        inspectionDetails.Hours = 0;
      }
      if (this.inspectioninfo.minutes == null) {
        inspectionDetails.Minutes = 0;
      }
      if (
        inspectionDetails.InspectionNOVNumber == null ||
        inspectionDetails.InspectionNOVNumber == undefined
      ) {
        inspectionDetails.InspectionNOVNumber = 0;
      }
      if (this.isDeliveryVehicleInsp == true) {
        this.validateAndAddBadgeholderRecord(0);
      }
      if (this.isVehicleInspection == true) {
        this.validateAndAddVehicleRecord(0);
      }
      if (this.isSterileAreaPiInsp == true) {
        this.validateAndAddCompanyRecord(0);
      }
      if (this.selectedDoorList.length == 0) {
        this.toastr.error("Please select door/gate.", "Information");
        //this.spinner.hide();
        return;
      }
      if (inspectionDetails.InspectionFinding == "1") {
        if (this.findingDoorList.length == 0) {
          this.toastr.error(
            "Please select at least one finding door.",
            "Information"
          );
          //this.spinner.hide();
          return;
        }
      }
      if (inspectionDetails.IndividualsInspected == null) {
        inspectionDetails.IndividualsInspected = 0;
      }
      this.inspservice
        .AddInpsectionDetail(
          inspectionDetails,
          this.isSaveFormDetails,
          this.files,
          this.deletedFiles,
          this.selectedDoorList,
          this.findingDoorList,
          this.deletedBadgeholderIds,
          this.deletedVehicleIds,
          this.deletedCompanyIds
        )
        .subscribe(
          (response: string) => {
            this.loading = false;
            this.toastr.success(
              "Inspection Information saved!!",
              "Information"
            );
            if (inspectionDetails.CurrentInspectionStatusId === 4) {
              this.isSubmitShow = false;
            } else {
              this.isSubmitShow = true;
            }
            //this.spinner.hide();
            this.files = [];
            this.deletedFiles = [];
            this.readOnlyInspection = true;
            this.resetIsDirtyFlag();

            // if(inspectionDetails.InspectionNOV == "1" && inspectionDetails.InspectionNOVNumber == 0 && this.isCitationId == false )
            if (
              inspectionDetails.InspectionNOV == "1" &&
              this.isCitationId == false
            ) {
              this.router.navigate(["admin/nov/details"], {
                queryParams: { isEdit: 0, inspectionId: response },
                skipLocationChange: true,
              });
            } else {
              this.router.navigate(["/admin/dashboard"]).then(() => {
                this.router.navigate(["/admin/inspection/details"], {
                  queryParams: {
                    inspectionId: response,
                    isEdit: 1,
                    isClone: 0,
                  },
                });
              });
            }
          },
          (error: any) => {
            this.toastr.error(
              "Inspection Information not saved!",
              "Information"
            );
            //this.spinner.hide();
          }
        );
      return true;
    }
  }

  //While editing Inspection, to remove the file after adding it.
  removeFile(file) {
    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;
      this.files.splice(this.files.indexOf(file), 1);
      this.doorFiles.splice(this.doorFiles.indexOf(file));
    }
  }

  public GetInspectionDetails() {
    if((this.inspectioninfo.schedulerInputId > 0 && this.inspectioninfo.schedulerSlotId !== "") && this.fromScheduler == true){
      this.router.navigate(["admin/scheduler"], {
        queryParams: {
          isEdit: 1,          
          scheduleId: this.inspectioninfo.schedulerInputId,
          slotId: this.inspectioninfo.schedulerSlotId,
          isView:"1",
          isShow: false,
          submitted: true,
          verified: true,
          isNewSchedule:true

        },skipLocationChange: true
      });
    }else{
      this.router.navigate(["admin/inspection"]);
    }
  }

  //To retrieve Company names on page loading
  public GetCompanyList() {
    this.CompanyService.GetCompanyList().subscribe(
      (response: Company[]) => {
        this.allCompanyList = response;
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
        //this.spinner.hide();
      }
    );
  }

  public GetInspectionTypeList() {
    this.inspTypeService.GetInspectionTypeList().subscribe(
      (response: InspectionTypes[]) => {
        this.allInspectionTypeList = response;
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
        //this.spinner.hide();
      }
    );
  }

  public GetFacilityList(inspTypeName) {
    this.facilityService.GetFacilityList().subscribe(
      (Response: Facilities[]) => {
        this.allFacilityList = Response;
        this.checkFacility(inspTypeName);
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
        //this.spinner.hide();
      }
    );
  }

  public checkFacility(inspTypeName) {
    if (inspTypeName == "Perimeter Inspection") {
      var facility1 = "Perimeter";
      var facility = this.allFacilityList.find(
        (x) =>
          x.facilityName.toLowerCase().trim() == facility1.toLowerCase().trim()
      );
      if (
        facility.facilityName.toLowerCase().trim() ==
        facility1.toLowerCase().trim()
      ) {
        this.inspectioninfo.inspectionFacilityId = facility.id;
        this.fillLocation(facility.id);
      }
    }

    // if(inspTypeName == "Portal Inspection")
    // {
    //   var facility1 = "Portal";
    //   var facility = this.allFacilityList.find(x => x.facilityName.toLowerCase().trim() == facility1.toLowerCase().trim())
    //   if(facility.facilityName.toLowerCase().trim() == facility1.toLowerCase().trim())
    //   {
    //     this.inspectioninfo.inspectionFacilityId = facility.id
    //     this.fillLocation(facility.id)
    //   }
    // }

    if (inspTypeName == "Delivery-Vehicle Inspection") {
      var facility1 = "Delivery-Vehicle";
      var facility = this.allFacilityList.find(
        (x) =>
          x.facilityName.toLowerCase().trim() == facility1.toLowerCase().trim()
      );
      if (
        facility.facilityName.toLowerCase().trim() ==
        facility1.toLowerCase().trim()
      ) {
        this.inspectioninfo.inspectionFacilityId = facility.id;
        this.fillLocation(facility.id);
      }
    }

    if (inspTypeName == "Sterile Area PI Inspection") {
      var facility1 = "Sterile Area PI";
      var facility = this.allFacilityList.find(
        (x) =>
          x.facilityName.toLowerCase().trim() == facility1.toLowerCase().trim()
      );
      if (
        facility.facilityName.toLowerCase().trim() ==
        facility1.toLowerCase().trim()
      ) {
        this.inspectioninfo.inspectionFacilityId = facility.id;
        this.fillLocation(facility.id);
      }
    }
  }

  public fillLocation(facilityId: number) {
    // this.inspectioninfo.inspectionLocationId = 0;
    this.GetLocationListByFacility(facilityId);
  }

  //Get Citation Reason List By Violation
  public GetLocationListByFacility(facilityId: number) {
    this.allLocationList = [];
    this.selectedDoorList = [];
    this.findingDoorList = [];
    this.locationService.GetLocationListByFacility(facilityId).subscribe(
      (response: Locations[]) => {
        this.allLocationList = response;
        const selectedDoor = this.allLocationList.find(
          (x) => x.id == this.locationId,
        );
        const data =
          this.inspectioninfo.inspectionFinding == "1"
            ? this.findingDoorList
            : this.selectedDoorList;
        if (selectedDoor) {
          this.inspectioninfo.inspectionFacilityId = selectedDoor.facilityId;
          this.selectedDoorList = [selectedDoor];
        }
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  GetFormattedDate(badgeHolderDOB) {
    var todayTime = new Date(badgeHolderDOB);
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return month + "/" + day + "/" + year;
  }

  public getSelectedDoors(inspectionId) {
    this.inspservice
      .GetSelectedDoors(inspectionId)
      .subscribe((data: Locations[]) => {
        this.selectedDoorList = [];
        this.selectedDoorGateNumber = [];
        this.selectedDoorGateNumber = data as Locations[];
        this.selectedDoorList = data as Locations[];
      });
  }

  public GetFindingDoors(inspectionId) {
    this.inspservice
      .GetFindingDoors(inspectionId)
      .subscribe((data: Locations[]) => {
        this.findingDoorList = [];
        this.findingDoorList = data as Locations[];
      });
  }

  public GetMappingNov(inspectionId) {
    this.inspservice.GetMappingNov(inspectionId).subscribe((response) => {
      this.mappingNOV = response as CitationDetails[];
      if (response.length > 0) {
        this.isCitationId = true;
      }
    });
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

  // To retrieve data to edit Inspection
  public GetInspectionDetailsById(inspectionId: number, companyId: number) {
    //this.spinner.show();
    //$('#dt1').DataTable().destroy();
    this.inspservice
      .GetInspectionDetailsById(inspectionId, companyId)
      .subscribe(
        (data: InspetionRecordDetail) => {
          this.showFields(data.inspectionType, data.inspType);
          // this.isFacility = true;
          this.inspectioninfo = data as InspetionRecordDetail;
          if (this.inspectioninfo.schedulerInputId > 0) {
            this.isschedularId = true;
          }
          this.inspectioninfo.edtAlarm = data.edtAlarm ? +data.edtAlarm : null;
          this.inspectioninfo.edtResolution = data.edtResolution ? +data.edtResolution : null;
          if (this.inspectioninfo.badge1 != "") {
            this.isBadge1 = true;
          }
          if (this.inspectioninfo.badge2 != "") {
            this.isBadge2 = true;
          }
          if (this.inspectioninfo.badge3 != "") {
            this.isBadge3 = true;
          }
          if(this.inspectioninfo.isBadgeAutoFilled == true){
            this.readonlyBadge = true
          }else{
            this.readonlyBadge = false
          }
          // this.inspectioninfo.badgeHolderDOB = this.GetFormattedDate(data.badgeHolderDOB);
          // this.inspectioninfo.inspectionDate = this.datePipe.transform(this.inspectioninfo.inspectionDate,'MM/dd/yyyy');
          // this.inspectioninfo.hours = '0'+this.inspectioninfo.hours;
          this.inspectioninfo.inspectionDate = this.dateAdapter.toModel(
            this.fromModel(this.inspectioninfo.inspectionDate)
          );
          this.inspectioninfo.inspectionTime = this.datePipe.transform(
            this.inspectioninfo.inspectionTime,
            "HH:mm"
          );
          this.inspectioninfo.inspectionFinding =
            data.inspectionFinding.toString().toLowerCase() == "true"
              ? "1"
              : "0";
          this.inspectioninfo.isDeviation =
            data.isDeviation.toString().toLowerCase() == "true" ? "1" : "0";
          if (this.inspectioninfo.isDeviation == "1") {
            this.isDev = true;
          }

          this.inspectioninfo.inspectionNOV =
            data.inspectionNOV.toString().toLowerCase() == "true" ? "1" : "0";
          this.inspectioninfo.isLeo =
            data.isLeo.toString().toLowerCase() == "true"
              ? "1"
              : "0";
          // this.citationId = data.citationId;
          this.inspTypeId = data.inspectionType;
          this.inspTypeName = data.inspType;
          this.getSelectedDoors(inspectionId);
          this.GetFindingDoors(inspectionId);
          this.GetMappingNov(inspectionId);
          // this.mappingNOV.push(data.inspectionNOVNumber)
          // this.badgeholderInsp = this.inspectioninfo.badgeholderList;
          // this.badgeholderInsp.forEach(element => {
          //   element.badgeholderDOB = new Date(element.badgeholderDOB).toString();
          //   // element.eventTypeName = this.getEventName(element.eventTypeId)
          // });
          // this.vehicleInsp = this.inspectioninfo.vehicleList;
          // this.companyInsp = this.inspectioninfo.companyList;
          this.getBadgeholderRecordByInspectionId(inspectionId);
          this.getVehicleRecordByInspectionId(inspectionId);
          this.getCompanyRecordByInspectionId(inspectionId);

          if (this.inspectioninfo.inspectionNOV == "1") {
            this.isNOV = false;
          } else {
            this.isNOV = true;
          }

          if (this.inspectioninfo.inspectionFinding == "1") {
            this.isFinding = false;
          } else {
            this.isFinding = true;
            this.inspectioninfo.doorGateNumber = 0;
          }

          this.inspectioninfo.securityBadgeHolder =
            data.securityBadgeHolder.toString().toLowerCase() == "true"
              ? "1"
              : "0";

          // if (this.citationId > 0) {
          //   this.GetCitationDetailsById(this.citationId,this.companyId);
          //   this.isCitationId = true;
          //   this.show = true
          // }

          if (
            this.citationId == 0 &&
            this.inspectioninfo.inspectionNOVNumber == 0
          ) {
            this.isGreaterThanZero = false;
            this.isNovExists = false;
            this.inspectioninfo.inspectionNOVNumber = 0;
          }

          this.dtTrigger.next();
          if (this.inspectioninfo.securityBadgeHolder == "0") {
            this.isSecurityBadge = true;
          } else {
            this.isSecurityBadge = false;
          }

          if (this.isClone == "1") {
            this.inspectioninfo.issuedBy = this.user.name;
          }

          /* Filter FIles by User */
          this.inspectionImageList = data.inspAttachments.filter(
            (x) =>
              x.filePath.toLowerCase().split(".", 2)[1] == "png" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "jpg" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "jpeg" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "gif"
          );
          this.inspectionFilesList = data.inspAttachments.filter(
            (x) =>
              x.filePath.toLowerCase().split(".", 2)[1] != "png" &&
              x.filePath.toLowerCase().split(".", 2)[1] != "jpg" &&
              x.filePath.toLowerCase().split(".", 2)[1] != "jpeg" &&
              x.filePath.toLowerCase().split(".", 2)[1] != "gif"
          );

          this.GetLocationListByFacility(data.inspectionFacilityId);

          if (
            this.inspectioninfo.currentInspectionStatusId ==
            InspectionStatus.Closed
          ) {
            this.inspectioninfo.status = "Closed";
          }
          // this.CheckNovExists(data.inspectionNOVNumber)
          var isClone: string =
            this.route.snapshot.pathFromRoot[1].queryParams["isClone"];
          if (isClone == "1") {
            this.clearInspectionBeforeClone();
            this.inspectioninfo.currentStatus = "Draft";
          } else {
            if (
              this.inspectioninfo.currentInspectionStatusId ==
              InspectionStatus.Draft
            ) {
              if (this.user.rolename == "AuthSigner") {
                this.isViewInspection = false;
                this.isViewAuthorizedSigner = false;
              } else {
                this.isStaffAdmin = false;
                this.isAuthsigner = false;
                this.isIssuer = true;
                this.isViewInspection = false;
              }
            } else {
              if (this.user.rolename == "StaffAdmin") {
                //this.isViewCitation = true;
                this.isViewInspection = false;
                this.isViewAuthorizedSigner = false;
              } else if (this.user.rolename == "AuthSigner") {
                this.isViewInspection = false;
                this.isViewAuthorizedSigner = false;
              } else {
                this.isViewInspection = true;
                this.isViewAuthorizedSigner = false;
              }
            }

            if (
              this.inspectioninfo.inspectionRecordNo != undefined &&
              this.inspectioninfo.currentInspectionStatusId ==
              InspectionStatus.Draft &&
              this.user.rolename != "AuthSigner"
            ) {
              this.isSubmitShow = true;
            } else {
              this.isSubmitShow = false;
            }
            this.readOnlyInspection = true;
          }
          //this.spinner.hide();
        },
        (error: any) => {
          //this.spinner.hide();
          this.toastr.error(`${error}`, "Error");
        }
      );
  }

  // To clear Inspection data before clone
  clearInspectionBeforeClone() {
    this.inspectioninfo.id = 0;
    this.inspectioninfo.inspectionRecordNo = 0;
    this.inspectioninfo.securityBadgeHolder = null;
    this.inspectioninfo.securityBadge = "";
    //this.inspectioninfo.badgeHolderDOB = "";
    this.inspectioninfo.mvop = "";
    this.inspectioninfo.driverLicenseNo = "";
    this.inspectioninfo.licenseState = "";
    this.inspectioninfo.vehicleState = "";
    this.inspectioninfo.vehicleYear = 0;
    this.inspectioninfo.vehicleModel = "";
    this.inspectioninfo.vehicleLicenseNo = "";
    // this.inspectioninfo.inspectionDate = "";
    // this.inspectioninfo.inspectionTime = "";
    this.inspectioninfo.hours;
    this.inspectioninfo.minutes;
    this.inspectioninfo.individualsInspected;
    // this.inspectioninfo.inspectionType = 0;
    // this.inspectioninfo.inspectionFacilityId = null;
    // this.inspectioninfo.inspectionLocationId = null;
    // this.inspectioninfo.inspectionFinding = null;
    this.inspectioninfo.inspectionNOV = null;
    // this.inspectioninfo.inspectionIncidentReport = "";
    // this.inspectioninfo.inspectionSummary = "";
    this.inspectioninfo.inspectionNOVNumber = 0;
    this.files = [];
    this.inspectionFilesList = [];
    this.inspectionImageList = [];
    this.inspectioninfo.inspAttachments = [];
    this.deletedFiles = [];
    this.inspectioninfo.companyList = [];
    this.inspectioninfo.badgeholderList = [];
    this.inspectioninfo.vehicleList = [];
    this.isSubmitted = false;
    //this.caseStatus = false;
    this.isViewAuthorizedSigner = false;
    this.inspectioninfo.currentInspectionStatusId = InspectionStatus.Draft;
    this.isCitationId = false;
  }

  //To submit Inspection
  SubmitByUser() {
    //this.spinner.show();
    this.isSaveFormDetails = true;
    if (
      this.user.rolename == "Issuer" ||
      this.user.rolename == "StaffAdmin" ||
      this.user.rolename == "Security"
    ) {
      if (this.CheckRequiredFields()) {
        this.toastr.error("Please enter required fields", "Alert");
        //this.spinner.hide();
        //return;
      } else {
        var inspStatus = this.bindInspectionDetails();
        //inspStatus.isSubmitted = true;
        inspStatus.CurrentInspectionStatusId = InspectionStatus.Closed;
        if (this.inspectioninfo.hours == null) {
          this.inspectioninfo.hours = 0;
        }
        if (this.inspectioninfo.minutes == null) {
          this.inspectioninfo.minutes = 0;
        }
        if (
          inspStatus.InspectionNOVNumber == null ||
          inspStatus.InspectionNOVNumber == undefined
        ) {
          inspStatus.InspectionNOVNumber = 0;
        }
        if (inspStatus.CompanyEscorting == null) {
          inspStatus.CompanyEscorting = 0;
        }
        if (this.isDeliveryVehicleInsp == true) {
          this.validateAndAddBadgeholderRecord(0);
        }
        if (this.isVehicleInspection == true) {
          this.validateAndAddVehicleRecord(0);
        }
        if (this.isSterileAreaPiInsp == true) {
          this.validateAndAddCompanyRecord(0);
        }
        if (this.selectedDoorList.length == 0) {
          this.toastr.error("Please select door/gate.", "Information");
          //this.spinner.hide();
          return;
        }
        if (inspStatus.InspectionFinding == "1") {
          if (this.findingDoorList.length == 0) {
            this.toastr.error(
              "Please select at least one finding door.",
              "Information"
            );
            //this.spinner.hide();
            return;
          }
        }
        if (inspStatus.IndividualsInspected == null) {
          inspStatus.IndividualsInspected = 0;
        }
        this.inspservice
          .AddInpsectionDetail(
            inspStatus,
            this.isSaveFormDetails,
            this.files,
            this.deletedFiles,
            this.selectedDoorList,
            this.findingDoorList,
            this.deletedBadgeholderIds,
            this.deletedVehicleIds,
            this.deletedCompanyIds
          )
          .subscribe(
            (response: string) => {
              this.loading = false;
              this.resetIsDirtyFlag();
              this.toastr.success(
                "Inspection Information Submitted!",
                "Information"
              );
              //this.spinner.hide();

              // if(this.inspectioninfo.inspectionNOV == "1" && inspStatus.InspectionNOVNumber == 0 && this.isCitationId == false)
              if (
                this.inspectioninfo.inspectionNOV == "1" &&
                this.isCitationId == false
              ) {
                this.router.navigate(["admin/nov/details"], {
                  queryParams: { isEdit: 0, inspectionId: response },
                  skipLocationChange: true,
                });
              } else {
                this.router.navigate(["/admin/inspection"]);
              }
            },
            (error: any) => {
              this.toastr.error(
                "Inspection Information not Submitted!",
                "Information"
              );
              //this.spinner.hide();
            }
          );
      }
    }
  }

  //To check whether the required fields are filled or not
  CheckRequiredFields() {
    if (this.inspectioninfo.inspFacility == "Delivery-Vehicle Inspections") {
      if (
        this.inspectioninfo.companyInspected == undefined ||
        this.inspectioninfo.companyInspected == 0 ||
        this.inspectioninfo.firstName == undefined ||
        this.inspectioninfo.firstName == "" ||
        this.inspectioninfo.lastName == undefined ||
        this.inspectioninfo.lastName == "" ||
        this.inspectioninfo.badgeHolderDOB == undefined ||
        this.inspectioninfo.badgeHolderDOB == ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  setDirtyFlag() {
    this.isDirty = true;
  }

  //To drag files
  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: any) => {
          this.files.push(file);
          this.doorFiles.push(file);
          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  //While editing Inspection, to delete the previously saved file
  deleteFile(file) {
    //var ans = confirm("Do you want to delete file '" + filetitle + "'?");
    var ans = confirm("Do you want to delete file ?");
    if (ans == true) {
      this.isDirty = true;

      this.inspectioninfo.inspAttachments.splice(
        this.inspectioninfo.inspAttachments.indexOf(file),
        1
      );

      this.inspectionImageList = this.inspectioninfo.inspAttachments.filter(
        (x) =>
          x.filePath.toLowerCase().split(".", 2)[1] == "png" ||
          x.filePath.toLowerCase().split(".", 2)[1] == "jpg" ||
          x.filePath.toLowerCase().split(".", 2)[1] == "jpeg" ||
          x.filePath.toLowerCase().split(".", 2)[1] == "gif"
      );
      this.inspectionFilesList = this.inspectioninfo.inspAttachments.filter(
        (x) =>
          x.filePath.toLowerCase().split(".", 2)[1] != "png" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "jpg" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "jpeg" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "gif"
      );

      this.deletedFiles.push(file.id);
    }
  }

  //Used for file handling
  showUndoBtn(index, filePath) {
    if (this.showBtn === index) this.showBtn = -1;
    else this.showBtn = index;

    var fileExt = filePath.toLowerCase().split(".", 2)[1];
    if (
      fileExt != "png" &&
      fileExt != "jpg" &&
      fileExt != "jpeg" &&
      fileExt != "gif"
    ) {
      this.showBtn = -1;
      this.downloadFile(index, filePath);
    }
  }

  //To download previously saved files while editing Inspection
  downloadFile(id: number, fileName: string) {
    this.inspservice.getAttachment(id).subscribe(
      (data) => {
        const blob = new Blob([data], { type: data.type });
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
        //   window.navigator.msSaveOrOpenBlob(blob, fileName);
        // } else { // for Non-IE (chrome, firefox etc.)
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.hidden = true;
        var fileUrl = URL.createObjectURL(blob);
        a.href = fileUrl;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
        // }
      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
      ${error.message}`,
          "Error"
        );
      }
    );
  }

  //To view files while editing Inspection
  viewFile(id: number, fileName: string) {
    this.inspservice.getAttachment(id).subscribe(
      (data) => {
        // IE doesn't allow using a blob object directly as link href
        //instead it is necessary to use msSaveOrOpenBlob
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   var newBlob = new Blob([data], { type: data.type })
        //   window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        //   return;
        // }
        const objectURL = window.URL.createObjectURL(data);
        window.open(objectURL, "_blank");
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(objectURL);
        }, 100);
      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
      ${error.message}`,
          "Error"
        );
      }
    );
  }

  //To alert user for saving unsaved data
  Unsave(event, flag) {
    if (this.isDirty) {
      var ans = confirm(
        "You have unsaved changes. Do you want to save Inspection data and continue?"
      );
      if (ans == true) {
        if (!this.saveBeforeContinue()) {
          event.preventDefault();
        } else {
          this.isDirty = false;
          if (flag == 0) {
            this.GetInspectionDetails();
          } else {
            this.router.navigate(["admin/nov/details"], {
              queryParams: { isEdit: 0, inspectionId: this.inspectioninfo.id },
              skipLocationChange: true,
            });
          }
        }
      } else {
        this.GetInspectionDetails();
        //event.preventDefault();
      }
    } else {
      this.isDirty = false;
      if (flag == 0) {
        this.GetInspectionDetails();
      } else {
        this.router.navigate(["admin/nov/details"], {
          queryParams: { isEdit: 0, inspectionId: this.inspectioninfo.id },
          skipLocationChange: true,
        });
      }
    }
  }

  onChangeDate(selectedDate: Date) {
    //   var eventDate = $('#CalenderInputTextBox').val();
    //   var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    //   var date = new Date(eventDate).getDay();
    //   var day = weekday[date];
    // $('#inspectionDate').val(this.weekday[selectedDate.getDay()]);
    //this.inspectioninfo.inspectionDate = text + 'A';
  }

  onYearChange(event: any) {
    if (event.target.value.length >= 4) return false;
  }

  public showVehicleInspection() {
    this.isVehicleInspection = !this.isVehicleInspection;
  }

  public showFields(inspTypeId: number, inspTypeName) {
    // this.GetInspectionTypeList();
    // var inspTypeName = this.allInspectionTypeList.find(x => x.id == inspTypeId)
    if (inspTypeName == "Perimeter Inspection") {
      this.isPerimeterInsp = true;
      this.isAWSInspection = false;
      this.isPortalInsp = false;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = false;
      this.isFacility = true;
      this.clearFields();
    } else if (inspTypeName == "Portal Inspection") {
      this.isPerimeterInsp = false;
      this.isAWSInspection = false;
      this.isPortalInsp = true;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = false;
      this.isFacility = false;
      this.clearFields();
    } else if (inspTypeName == "AWS Inspection") {
      this.isPerimeterInsp = false;
      this.isAWSInspection = true;
      this.isPortalInsp = false;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = false;
      this.isFacility = false;
      this.clearFields();
    } else if (inspTypeName == "Facility Inspection") {
      this.isPerimeterInsp = false;
      this.isAWSInspection = false;
      this.isPortalInsp = false;
      this.isFacilityInsp = true;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = false;
      this.isFacility = false;
      this.clearFields();
    } else if (inspTypeName == "Delivery-Vehicle Inspection") {
      this.isPerimeterInsp = false;
      this.isAWSInspection = false;
      this.isPortalInsp = false;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = true;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = true;
      this.isFacility = true;
      this.clearFields();
    } else if (inspTypeName == "Sterile Area PI Inspection") {
      this.isPerimeterInsp = false;
      this.isAWSInspection = false;
      this.isPortalInsp = false;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = true;
      this.isVisitorInfoShow = false;
      this.isFacility = true;
      this.clearFields();
    } else {
      this.isPerimeterInsp = true;
      this.isPortalInsp = false;
      this.isAWSInspection = false;
      this.isFacilityInsp = false;
      this.isDeliveryVehicleInsp = false;
      this.isSterileAreaPiInsp = false;
      this.isVisitorInfoShow = false;
      this.isFacility = false;
      this.clearFields();
    }
  }

  public onDoorSelect(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    this.selectedDoorGateNumber = this.selectedDoorList;
    // this.selectedDoorList.push(item);
    // this.selectedDoorNameList.push(item.location);

    // this.selectedDoorGateNumber.push(item);
  }

  public onDoorDeselect(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    this.selectedDoorGateNumber = this.selectedDoorList;
    // this.selectedDoorList = this.selectedDoorList.filter(obj => obj.id !== item.id);
    // this.selectedDoorNameList = this.selectedDoorNameList.filter(obj => obj !== item.location);

    // this.selectedDoorGateNumber = this.selectedDoorGateNumber.filter(obj => obj.id !== item.id)
  }

  public onSelectAllDoors(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    // this.selectedDoorGateNumber = this.selectedDoorList;

    this.selectedDoorGateNumber = [];
    item.forEach((element) => {
      this.selectedDoorGateNumber.push(element);
    });
  }

  public onDeSelectAllDoors(item: any) {
    this.isDirty = true;
    this.selectedDoorList = [];
    this.findingDoorList = [];
    this.selectedDoorGateNumber = [];
  }

  // Finding doors
  public onFindingDoorSelect(item: any) {
    this.isDirty = true;
    // this.findingDoorList.push(item);
  }

  public onFindingDoorDeselect(item: any) {
    this.isDirty = true;
    this.findingDoorList = this.findingDoorList.filter(
      (obj) => obj.id !== item.id
    );
  }

  public onSelectAllFindingDoors(item: any) {
    this.isDirty = true;
  }

  public onDeSelectAllFindingDoors(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
  }

  public clearFields() {
    this.inspectioninfo.inspectionFacilityId = null;
    // this.inspectioninfo.inspectionDate = this.datePipe.transform(new Date(),'MM/dd/yyyy');
    if (!this.fromScheduler) {
      this.inspectioninfo.inspectionDate = this.dateAdapter.toModel(
        this.ngbCalendar.getToday(),
      );
    }
    // this.inspectioninfo.inspectionTime = new Date().toISOString();
    this.inspectioninfo.hours;
    this.inspectioninfo.minutes;
    this.inspectioninfo.individualsInspected;
    this.inspectioninfo.inspectionFinding = null;
    this.inspectioninfo.inspectionNOV = null;
    // this.inspectioninfo.inspectionIncidentReport = "";
    this.inspectioninfo.inspectionSummary = "";
    this.files = [];
    this.inspectionFilesList = [];
    this.inspectionImageList = [];
    this.inspectioninfo.inspAttachments = [];
    this.deletedFiles = [];
    this.isSubmitted = false;
    //this.caseStatus = false;
    this.isViewAuthorizedSigner = false;
    this.inspectioninfo.currentInspectionStatusId = InspectionStatus.Draft;
    this.isCitationId = false;
    this.inspectioninfo.securityBadgeHolder = null;
    this.inspectioninfo.securityBadge = "";
    this.inspectioninfo.firstName = "";
    this.inspectioninfo.lastName = "";
    this.inspectioninfo.companyInspected = null;
    this.inspectioninfo.companyEscorting = null;
    this.inspectioninfo.badgeHolderDOB = "";
    this.inspectioninfo.mvop = "";
    this.inspectioninfo.driverLicenseNo = "";
    this.inspectioninfo.licenseState = "";
    this.inspectioninfo.vehicleState = "";
    this.inspectioninfo.vehicleYear = 0;
    this.inspectioninfo.vehicleModel = "";
    this.inspectioninfo.vehicleLicenseNo = "";
  }

  validateAndAddBadgeholderRecord(flag): boolean {
    if (this.validateBadgeholderRecord()) {     
      if (this.badgeholderModel.inedit == true) {
        this.UpdateBadgeholderRecord(this.badgeholderModel, 0);
      } else {
        this.badgeholderModel.inspectionId = this.inspectionId;
        this.badgeholderModel.id = 0;
        this.badgeholderModel.cmpName = this.allCompanyList.filter(
          (x) => x.id === +this.badgeholderModel.companyId
        )[0].companyName;
        this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
          this.fromModel(this.badgeholderModel.badgeholderDOB)
        );
        const copyBadgeholder = { ...this.badgeholderModel };
        this.inspectioninfo.badgeholderList.push(copyBadgeholder);
        this.inspectioninfo.badgeholderEdited = "Added";
        this.badgeholderInsp.push(this.badgeholderModel);
        this.resetBadgeholderRecordModel();
        this.readonlyBadge = false;
        this.isCompany = false;
      }
      // }
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }
  }

  // validate reference submittal attachement
  validateBadgeholderRecord() {
    return (
      // this.badgeholderModel.securityBadgeNo !== "" &&
      this.badgeholderModel.firstName !== undefined &&
      this.badgeholderModel.lastName !== undefined &&
      this.badgeholderModel.companyId !== undefined &&
      this.badgeholderModel.badgeholderDOB !== undefined &&
      this.badgeholderModel.companyId !== null &&
      this.badgeholderModel.firstName !== null &&
      this.badgeholderModel.lastName !== null &&
      this.badgeholderModel.badgeholderDOB !== null 
    );
  }

  convertMMDDYYYYtoDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';
    const [month, day, year] = dateStr.split('/');
    return `${day}-${month}-${year}`;
  }
  
  public getBadgeholderRecordByInspectionId(inspectionId: number) {
    $("#dt1").DataTable().destroy();
    this.badgeholderInsp = [];
    this.inspservice.getBadgeholderRecordByInspectionId(inspectionId).subscribe(
      (response: InspectionBadgeholder[]) => {
        this.badgeholderInsp = response;
        this.badgeholderInsp.forEach((element) => {
          // element.badgeholderDOB = new Date(element.badgeholderDOB).toISOString();
          // if(element.companyEscortedId > 0)
          // {
          //   element.companyEscortedName = this.getCompanyName(element.companyEscortedId)
          // }

          element.badgeNumber = element.securityBadgeNo
          element.badgeholderDOB = this.convertMMDDYYYYtoDDMMYYYY(element.badgeholderDOB);

        });
        // this.inspectioninfo.badgeholderList.sort(this.sortFunction);
        this.dtTrigger.next();
      },
      (error: any) => {
        //this.spinner.hide();
        this.toastr.error(`${error}`, "Error Fetching Badgeholder Record");
      }
    );
  }

  UpdateBadgeholderRecord(badgeholderModel: InspectionBadgeholder, flag) {
    if (this.validateBadgeholderRecord()) {
      //this.spinner.show();
      this.resetBadgeholderRecordModel();
      this.readonlyBadge = false;
      this.isCompany = false;
      badgeholderModel.inedit = false;
      if (+badgeholderModel.companyId > 0) {
        badgeholderModel.cmpName = this.getCompanyName(
          +badgeholderModel.companyId
        );
      }
      // if(+badgeholderModel.companyEscortedId > 0)
      // {
      //   badgeholderModel.companyEscortedName = this.getCompanyName(+badgeholderModel.companyEscortedId)
      // }

      // var date1 = new Date(badgeholderModel.badgeholderDOB);
      // badgeholderModel.badgeholderDOB = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000)).toISOString()
      badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
        this.fromModel(badgeholderModel.badgeholderDOB)
      );
      var badgeindex = this.badgeholderInsp.findIndex(
        (x) => x.id == badgeholderModel.id
      );
      this.badgeholderInsp[badgeindex] = badgeholderModel;
      this.inspectioninfo.badgeholderList[badgeindex] = badgeholderModel;
      //this.spinner.hide();
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }

    // this.inspservice.EditBadgeholderRecord(badgeholderModel).subscribe((response: InspectionBadgeholder) => {
    //   this.getBadgeholderRecordByInspectionId(this.inspectionId);
    //   this.resetBadgeholderRecordModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Badgeholder record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  cancelBadgeholderRecordUpdate(badgeholderModel: InspectionBadgeholder) {
    this.resetBadgeholderRecordModel();
    this.readonlyBadge = false;
    this.isCompany = false;
    badgeholderModel.inedit = false;
    var badgeindex = this.badgeholderInsp.findIndex(
      (x) => x.id == badgeholderModel.id
    );
    this.badgeholderInsp[badgeindex].inedit = badgeholderModel.inedit;
    this.inspectioninfo.badgeholderList[badgeindex].inedit =
      badgeholderModel.inedit;
  }

  resetBadgeholderRecordModel() {
    this.badgeholderModel = new InspectionBadgeholder();
  }

  onBadgeholderEditClick(
    event,
    index: number,
    badgeholderModel: InspectionBadgeholder
  ) {
    // this.NovService.GetBadgeholderInfo(badgeholderModel.securityBadgeNo).subscribe((data: Badgeholder) => {
    //   if(data == null)
    //   {
    //     badgeholderModel.badgeholderDOB = new Date(badgeholderModel.badgeholderDOB).toISOString();
    //     badgeholderModel.inedit = true;
    //     badgeholderModel.companyId = +badgeholderModel.companyId
    //     badgeholderModel.companyEscortedId = +badgeholderModel.companyEscortedId
    //     badgeholderModel.companyEscortedName = this.getCompanyName(+badgeholderModel.companyEscortedId)
    //     if (this.badgeholderModel.inedit == true) {
    //       this.toastr.error("Updated the edited entry");
    //    return;
    //     }
    //   }

    // }, (error:any)=> {
    //   //this.spinner.hide();
    // });

    if (this.validateBadgeholderRecord()) {
      this.UpdateBadgeholderRecord(this.badgeholderModel, 0);
      badgeholderModel.inedit = true;
      
      const copyBadgeholder = { ...badgeholderModel };
      this.badgeholderModel = copyBadgeholder;
      // this.badgeholderModel.badgeholderDOB = this.datePipe.transform(badgeholderModel.badgeholderDOB, 'MM/dd/yyyy');
      // this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(this.fromModel(this.badgeholderModel.badgeholderDOB));
      var badgeindex = this.badgeholderInsp.findIndex(
        (x) => x.id == badgeholderModel.id
      );
      // this.badgeholderInsp.splice(badgeindex, 1)
      // this.inspectioninfo.badgeholderList.splice(badgeindex, 1)
      // this.deletedBadgeholderIds.push(badgeholderModel.id)
      if (badgeholderModel.securityBadgeNo != null) {
        //this.GetBadgeholderInfo(0);
        this.GetBadgeholderInfoASCX(0)
      } else {
        var find = "/";
        var re = new RegExp(find, "g");
        var badgeDOB = badgeholderModel.badgeholderDOB.replace(re, "-");
        this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
          this.fromModel(badgeDOB)
        );
      }
    } else {
      badgeholderModel.inedit = true;
      
      const copyBadgeholder = { ...badgeholderModel };
      this.badgeholderModel = copyBadgeholder;
      // this.badgeholderModel.badgeholderDOB = this.datePipe.transform(badgeholderModel.badgeholderDOB, 'MM/dd/yyyy');
      // this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(this.fromModel(this.badgeholderModel.badgeholderDOB));
      var badgeindex = this.badgeholderInsp.findIndex(
        (x) => x.id == badgeholderModel.id
      );
      // this.badgeholderInsp.splice(badgeindex, 1)
      // this.inspectioninfo.badgeholderList.splice(badgeindex, 1)
      // this.deletedBadgeholderIds.push(badgeholderModel.id)
      if (badgeholderModel.securityBadgeNo != null) {
        //this.GetBadgeholderInfo(0);
        this.GetBadgeholderInfoASCX(0)
      } else {
        var find = "/";
        var re = new RegExp(find, "g");
        var badgeDOB = badgeholderModel.badgeholderDOB.replace(re, "-");
        this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
          this.fromModel(badgeDOB)
        );
      }
    }
  }

  UpdateBadgeholder(badgeholderModel: InspectionBadgeholder) {
    //this.spinner.show();
    badgeholderModel.inedit = false;
    badgeholderModel.cmpName = this.getCompanyName(+badgeholderModel.companyId);
    // badgeholderModel.companyEscortedName = this.getCompanyName(+badgeholderModel.companyEscortedId)
    // var date1 = new Date(badgeholderModel.badgeholderDOB);
    // badgeholderModel.badgeholderDOB = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000)).toISOString()
    badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
      this.fromModel(badgeholderModel.badgeholderDOB)
    );
    var badgeindex = this.badgeholderInsp.findIndex(
      (x) => x.id == badgeholderModel.id
    );
    this.badgeholderInsp[badgeindex] = badgeholderModel;
    this.inspectioninfo.badgeholderList[badgeindex] = badgeholderModel;
    //this.spinner.hide();

    // //this.eventsModel.eventDate =new Date(this.eventsModel.eventDate).toISOString(); //this.datePipe.transform(this.eventsModel.eventDate, 'MM/dd/yyyy HH:mm');
    // this.inspservice.EditBadgeholderRecord(badgeholderModel).subscribe((response: InspectionBadgeholder) => {
    //   this.getBadgeholderRecordByInspectionId(this.inspectionId);
    //   this.resetBadgeholderRecordModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Badgeholder record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  deleteBadgeholder(badgeholderModel: InspectionBadgeholder) {
    if (confirm("Are you sure you want to delete Badgeholder record?")) {
      // if (badgeholder.id !== 0 && badgeholder.id !== undefined) {        ​
      //   this.inspservice.DeleteBadgeholder(badgeholder.id).subscribe((response: Response) => {
      //     this.badgeholderInsp = this.badgeholderInsp.filter(item => item !== badgeholder);
      //     this.getBadgeholderRecordByInspectionId(this.inspectionId);
      //     this.resetBadgeholderRecordModel();
      //     //this.spinner.hide();
      //   }
      //     , (error:any)=> {
      //       this.toastr.error('Error deleting Badgeholder record', 'Information');
      //       //this.spinner.hide();
      //     });
      // }
      // else {
      //   this.badgeholderInsp = this.badgeholderInsp.filter(item => item !== badgeholder);
      //   this.inspectioninfo.badgeholderList = this.inspectioninfo.badgeholderList.filter(item => item !== badgeholder);
      // }
      var badgeindex = this.badgeholderInsp.findIndex(
        (x) => x.id == badgeholderModel.id
      );
      this.badgeholderInsp.splice(badgeindex, 1);
      this.inspectioninfo.badgeholderList.splice(badgeindex, 1);
      this.deletedBadgeholderIds.push(badgeholderModel.id);
    } else {
    }
  }

  validateAndAddVehicleRecord(flag): boolean {
    if (this.validateVehicleRecord()) {
      if (this.vehicleModel.inedit == true) {
        this.UpdateVehicleRecord(this.vehicleModel, 0);
      } else {
        this.vehicleModel.inspectionId = this.inspectionId;
        this.vehicleModel.id = 0;
        const copyVehicle = { ...this.vehicleModel };
        this.inspectioninfo.vehicleList.push(copyVehicle);
        this.inspectioninfo.vehicleEdited = "Added";
        this.vehicleInsp.push(this.vehicleModel);
        this.resetVehicleModel();
      }
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }

    // if (this.validateVehicleRecord()) {
    //   // this.vehicleModel.inspectionId = this.inspectionId;
    //   // if (this.inspectionId != 0) {
    //   //   //Add event
    //   //   this.inspservice.AddVehicleRecord(this.vehicleModel).subscribe((response: VehicleInspection) => {
    //   //     this.getVehicleRecordByInspectionId(this.inspectionId);
    //   //     this.resetVehicleModel();
    //   //     //this.spinner.hide();
    //   //   }
    //   //     , (error:any)=> {
    //   //       this.toastr.error('Vehicle Record not added!', 'Information');
    //   //       //this.spinner.hide();
    //   //     });
    //   // }
    //   // else {

    //   // }
    //   return true;
    // }
    // return false;
  }

  validateVehicleRecord() {
    return (
      this.vehicleModel.vehicleModel !== "" &&
      this.vehicleModel.vehicleModel !== null &&
      this.vehicleModel.vehicleModel !== undefined
    );
  }

  public getVehicleRecordByInspectionId(inspectionId: number) {
    $("#dt1").DataTable().destroy();
    this.vehicleInsp = [];
    this.inspservice.getVehicleRecordByInspectionId(inspectionId).subscribe(
      (response: VehicleInspection[]) => {
        this.vehicleInsp = response;
        // this.inspectioninfo.vehicleList.sort(this.sortFunction);
        if (this.vehicleInsp.length > 0) {
          this.isVehicleInspection = true;
        } else {
          this.isVehicleInspection = false;
        }
        this.dtTrigger.next();
      },
      (error: any) => {
        //this.spinner.hide();
        this.toastr.error(`${error}`, "Error Fetching Vehicle Record");
      }
    );
  }

  UpdateVehicleRecord(vehicleModel: VehicleInspection, flag) {
    if (this.validateVehicleRecord()) {
      //this.spinner.show();
      this.resetVehicleModel();
      vehicleModel.inedit = false;
      var index = this.vehicleInsp.findIndex((x) => x.id == vehicleModel.id);
      this.vehicleInsp[index] = vehicleModel;
      this.inspectioninfo.vehicleList[index] = vehicleModel;
      //this.spinner.hide();
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }

    // this.inspservice.EditVehicleRecord(vehicleModel).subscribe((response: VehicleInspection) => {
    //   this.getVehicleRecordByInspectionId(this.inspectionId);
    //   this.resetVehicleModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Vehicle record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  cancelVehicleUpdate(vehicleModel: VehicleInspection) {
    this.resetVehicleModel();
    vehicleModel.inedit = false;
    var index = this.vehicleInsp.findIndex((x) => x.id == vehicleModel.id);
    this.vehicleInsp[index].inedit = vehicleModel.inedit;
    this.inspectioninfo.vehicleList[index].inedit = vehicleModel.inedit;
  }

  resetVehicleModel() {
    // Reset
    this.vehicleModel = new VehicleInspection();
  }

  onVehicleEditClick(event, index: number, vehicleModel: VehicleInspection) {
    if (this.validateVehicleRecord()) {
      this.UpdateVehicleRecord(this.vehicleModel, 0);
      vehicleModel.inedit = true;
      const copyVehicle = { ...vehicleModel };
      this.vehicleModel = copyVehicle;
    } else {
      vehicleModel.inedit = true;
      const copyVehicle = { ...vehicleModel };
      this.vehicleModel = copyVehicle;
    }

    // var index = this.vehicleInsp.findIndex((x => x.id == vehicleModel.id))
    // this.vehicleInsp.splice(index, 1)
    // this.inspectioninfo.vehicleList.splice(index, 1)
    // this.deletedVehicleIds.push(vehicleModel.id)
  }

  UpdateVehicle(vehicleModel: VehicleInspection) {
    //this.spinner.show();
    vehicleModel.inedit = false;
    var index = this.vehicleInsp.findIndex((x) => x.id == vehicleModel.id);
    this.vehicleInsp[index] = vehicleModel;
    this.inspectioninfo.vehicleList[index] = vehicleModel;
    //this.spinner.hide();
    // this.inspservice.EditVehicleRecord(vehicleModel).subscribe((response: VehicleInspection) => {
    //   this.getVehicleRecordByInspectionId(this.inspectionId);
    //   this.resetVehicleModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Vehicle Record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  deleteVehicle(vehicle: VehicleInspection) {
    if (confirm("Are you sure you want to delete Vehicle record?")) {
      // if (vehicle.id !== 0 && vehicle.id !== undefined) {        ​
      //   this.inspservice.deleteVehicle(vehicle.id).subscribe((response: Response) => {
      //     this.vehicleInsp = this.vehicleInsp.filter(item => item !== vehicle);
      //     this.getVehicleRecordByInspectionId(this.inspectionId);
      //     this.resetVehicleModel();
      //     //this.spinner.hide();
      //   }
      //     , (error:any)=> {
      //       this.toastr.error('Error deleting Vehicle record', 'Information');
      //       //this.spinner.hide();
      //     });
      // }
      // else {
      //   this.vehicleInsp = this.vehicleInsp.filter(item => item !== vehicle);
      //   this.inspectioninfo.vehicleList = this.inspectioninfo.vehicleList.filter(item => item !== vehicle);
      // }

      var index = this.vehicleInsp.findIndex((x) => x.id == vehicle.id);
      this.vehicleInsp.splice(index, 1);
      this.inspectioninfo.vehicleList.splice(index, 1);
      this.deletedVehicleIds.push(vehicle.id);
    } else {
    }
  }

  validateAndAddCompanyRecord(flag): boolean {
    if (this.validateCompanyRecord()) {
      // this.companyModel.inspectionId = this.inspectionId;
      // if (this.inspectionId != 0) {
      //   //Add event
      //   this.inspservice.AddCompanyRecord(this.companyModel).subscribe((response: CompanyInformation) => {
      //     this.getCompanyRecordByInspectionId(this.inspectionId);
      //     this.resetCompanyRecordModel();
      //     //this.spinner.hide();
      //   }
      //     , (error:any)=> {
      //       this.toastr.error('Company Record not added!', 'Information');
      //       //this.spinner.hide();
      //     });
      // }
      // else {
      if (this.companyModel.inedit == true) {
        this.UpdateCompanyRecord(this.companyModel, 0);
      } else {
        this.companyModel.inspectionId = this.inspectionId;
        this.companyModel.id = 0;
        this.companyModel.cmpName = this.allCompanyList.filter(
          (x) => x.id === +this.companyModel.companyId
        )[0].companyName;
        if (
          this.companyModel.dateOfKnife !== "" &&
          this.companyModel.dateOfKnife !== undefined &&
          this.companyModel.dateOfKnife !== null
        ) {
          // var date1 = new Date(this.companyModel.dateOfKnife);
          // this.companyModel.dateOfKnife = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000)).toISOString()
          this.companyModel.dateOfKnife = this.dateAdapter.toModel(
            this.fromModel(this.companyModel.dateOfKnife)
          );
        }
        const copyCompany = { ...this.companyModel };
        this.inspectioninfo.companyList.push(copyCompany);
        this.inspectioninfo.companyEdited = "Added";
        this.companyInsp.push(this.companyModel);
        this.resetCompanyRecordModel();
      }
      // }
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }
  }

  // validate reference submittal attachement
  validateCompanyRecord() {
    return (
      (this.companyModel.companyId !== null &&
        this.companyModel.companyId !== undefined) ||
      (this.companyModel.companyFacilitator !== null &&
        this.companyModel.companyFacilitator !== undefined &&
        this.companyModel.companyFacilitator !== "")
    );
  }

  public getCompanyRecordByInspectionId(inspectionId: number) {
    $("#dt1").DataTable().destroy();
    this.companyInsp = [];
    this.inspservice.getCompanyRecordByInspectionId(inspectionId).subscribe(
      (response: CompanyInformation[]) => {
        this.companyInsp = response;
        this.companyInsp.forEach((element) => {
          element.cmpName = this.getCompanyName(element.companyId);
        });
        // this.inspectioninfo.companyList.sort(this.sortFunction);
        this.dtTrigger.next();
      },
      (error: any) => {
        //this.spinner.hide();
        this.toastr.error(`${error}`, "Error Fetching Company Record");
      }
    );
  }

  getCompanyName(companyId: number) {
    return this.allCompanyList.filter((x) => x.id == companyId)[0].companyName;
  }

  UpdateCompanyRecord(companyModel: CompanyInformation, flag) {
    if (this.validateCompanyRecord()) {
      //this.spinner.show();
      this.resetCompanyRecordModel();
      companyModel.inedit = false;
      if (+companyModel.companyId > 0) {
        companyModel.cmpName = this.getCompanyName(+companyModel.companyId);
      }

      // var date1 = new Date(companyModel.dateOfKnife);
      // companyModel.dateOfKnife = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000)).toISOString()
      companyModel.dateOfKnife = this.dateAdapter.toModel(
        this.fromModel(companyModel.dateOfKnife)
      );
      var index = this.companyInsp.findIndex((x) => x.id == companyModel.id);
      this.companyInsp[index] = companyModel;
      this.inspectioninfo.companyList[index] = companyModel;
      //this.spinner.hide();
      return true;
    } else {
      if (flag == 1) {
        this.toastr.error("Please enter required field.", "Information");
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }
    // this.inspservice.EditCompanyRecord(companyModel).subscribe((response: CompanyInformation) => {
    //   this.getCompanyRecordByInspectionId(this.inspectionId);
    //   this.resetCompanyRecordModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Company Record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  cancelCompanyUpdate(companyModel: CompanyInformation) {
    this.resetCompanyRecordModel();
    companyModel.inedit = false;
    var index = this.companyInsp.findIndex((x) => x.id == companyModel.id);
    this.companyInsp[index].inedit = companyModel.inedit;
    this.inspectioninfo.companyList[index].inedit = companyModel.inedit;
  }

  resetCompanyRecordModel() {
    this.companyModel = new CompanyInformation();
  }

  onCompanyEditClick(event, index: number, companyModel: CompanyInformation) {
    // companyModel.dateOfKnife = new Date(companyModel.dateOfKnife).toISOString();
    // companyModel.inedit = true;
    // companyModel.companyId = +companyModel.companyId
    // if (this.companyModel.inedit == true) {
    //   this.toastr.error("Updated the edited entry");
    //   return;
    // }

    if (this.validateCompanyRecord()) {
      this.UpdateCompanyRecord(this.companyModel, 0);
      companyModel.inedit = true;
      const copyCompany = { ...companyModel };
      this.companyModel = copyCompany;
      // this.companyModel.dateOfKnife = this.datePipe.transform(companyModel.dateOfKnife, 'MM/dd/yyyy');
      // this.companyModel.dateOfKnife = this.dateAdapter.toModel(this.fromModel(this.companyModel.dateOfKnife));
      // var index = this.companyInsp.findIndex((x => x.id == companyModel.id))
      // this.companyInsp.splice(index, 1)
      // this.inspectioninfo.companyList.splice(index, 1)
      // this.deletedCompanyIds.push(companyModel.id)
      var find = "/";
      var re = new RegExp(find, "g");
      var compDOK = companyModel.dateOfKnife.replace(re, "-");
      this.companyModel.dateOfKnife = this.dateAdapter.toModel(
        this.fromModel(compDOK)
      );
    } else {
      companyModel.inedit = true;
      const copyCompany = { ...companyModel };
      this.companyModel = copyCompany;
      // this.companyModel.dateOfKnife = this.datePipe.transform(companyModel.dateOfKnife, 'MM/dd/yyyy');
      // this.companyModel.dateOfKnife = this.dateAdapter.toModel(this.fromModel(companyModel.dateOfKnife));
      // var index = this.companyInsp.findIndex((x => x.id == companyModel.id))
      // this.companyInsp.splice(index, 1)
      // this.inspectioninfo.companyList.splice(index, 1)
      // this.deletedCompanyIds.push(companyModel.id)
      var find = "/";
      var re = new RegExp(find, "g");
      var compDOK = companyModel.dateOfKnife.replace(re, "-");
      this.companyModel.dateOfKnife = this.dateAdapter.toModel(
        this.fromModel(compDOK)
      );
    }
  }

  UpdateCompany(companyModel: CompanyInformation) {
    //this.spinner.show();
    companyModel.inedit = false;
    // var date1 = new Date(companyModel.dateOfKnife);
    // companyModel.dateOfKnife = new Date(date1.getTime() + Math.abs(date1.getTimezoneOffset() * 60000)).toISOString()
    companyModel.dateOfKnife = this.dateAdapter.toModel(
      this.fromModel(companyModel.dateOfKnife)
    );
    companyModel.cmpName = this.getCompanyName(+companyModel.companyId);
    var index = this.companyInsp.findIndex((x) => x.id == companyModel.id);
    this.companyInsp[index] = companyModel;
    this.inspectioninfo.companyList[index] = companyModel;
    //this.spinner.hide();
    // this.companyModel.dateOfKnife = new Date(this.companyModel.dateOfKnife).toDateString(); //this.datePipe.transform(this.eventsModel.eventDate, 'MM/dd/yyyy HH:mm');
    // this.inspservice.EditCompanyRecord(companyModel).subscribe((response: CompanyInformation) => {
    //   this.getCompanyRecordByInspectionId(this.inspectionId);
    //   this.resetCompanyRecordModel();
    //   //this.spinner.hide();
    // }
    //   , (error:any)=> {
    //     this.toastr.error('Company Record not updated!', 'Information');
    //     //this.spinner.hide();
    //   });
  }

  deleteCompany(company: CompanyInformation) {
    if (confirm("Are you sure you want to delete Company record?")) {
      // if (company.id !== 0 && company.id !== undefined) {        ​
      //   this.inspservice.deleteCompany(company.id).subscribe((response: Response) => {
      //     this.companyInsp = this.companyInsp.filter(item => item !== company);
      //     this.getCompanyRecordByInspectionId(this.inspectionId);
      //     this.resetCompanyRecordModel();
      //     //this.spinner.hide();
      //   }
      //     , (error:any)=> {
      //       this.toastr.error('Error deleting Company record', 'Information');
      //       //this.spinner.hide();
      //     });
      // }
      // else {
      //   this.companyInsp = this.companyInsp.filter(item => item !== company);
      //   this.inspectioninfo.companyList = this.inspectioninfo.companyList.filter(item => item !== company);
      // }

      var index = this.companyInsp.findIndex((x) => x.id == company.id);
      this.companyInsp.splice(index, 1);
      this.inspectioninfo.companyList.splice(index, 1);
      this.deletedCompanyIds.push(company.id);
    } else {
    }
  }

  public showEdtResolution() {
    if (this.inspectioninfo.edtAlarm == null) {
      this.isEdtResolution = true;
    } else {
      this.isEdtResolution = false;
    }
     
  }

  public showGate() {
    if (this.inspectioninfo.inspectionFinding == "1") {
      // if(this.selectedDoorList.length == 0)
      // {
      //   this.toastr.error('Please select the Door/Gate number(s).', 'Information');
      // }
      this.isFinding = false;
    } else {
      this.isFinding = true;
      this.findingDoorList = [];
    }
  }
  public isdeviation() {
    if (this.inspectioninfo.isDeviation == "1") {
      this.isDev = true;
    } else {
      this.isDev = false;
    }
  }

  public isCreateNOV() {
    if (this.inspectioninfo.inspectionNOV == "1") {
      this.isNOV = false;
      this.isGreaterThanZero = true;
    } else {
      this.isNOV = true;
      this.inspectioninfo.inspectionNOVNumber = 0;
      this.isNovExists = false;
      this.show = false;
      this.isGreaterThanZero = false;
    }
  }

  //Check if NOV exits
  CheckNovExists(inspectionNOVNumber) {
    if (!this.isNOV) {
      if (inspectionNOVNumber > 0) {
        this.isNovExists = true;
        this.show = true;
        var novid = inspectionNOVNumber === undefined ? 0 : inspectionNOVNumber;
        this.NovService.CheckNovExists(novid).subscribe(
          (response) => {
            if (response) {
              this.isNovExists = true;
              // this.toastr.error('Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.', 'Information');
              this.citation.novNo = 0;
              this.isHyperlink = true;
            } else {
              this.isHyperlink = false;
              // this.isNovExists = false;
              // this.show = false
              // this.isGreaterThanZero = true
            }
          },
          (error: any) => {
            this.toastr.error(
              "Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.",
              "Information"
            );
            this.inspectioninfo.inspectionNOVNumber = 0;
            this.isNovExists = false;
            this.show = false;
            //this.spinner.hide();
          }
        );
      }
    }
  }

  checkMinutes() {
    if (this.inspectioninfo.minutes > 60) {
      this.toastr.error("Please enter minutes properly.", "Information");
    } else {
      this.inspectioninfo.minutes = this.inspectioninfo.minutes;
    }
  }

  goToCitationPage(citationNo) {
    if (citationNo != 0) {
      this.inspservice
        .goToCitationPage(citationNo)
        .subscribe((response: string) => {
          if (response != null) {
            this.citationId = +response;
            this.router.navigate(["admin/nov/details"], {
              queryParams: {
                isEdit: 1,
                inspectionId: this.inspectioninfo.id,
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

  removeNovNo(inspectionNOVNumber) {
    this.isNovExists = false;
    this.show = false;
    this.inspectioninfo.inspectionNOVNumber = 0;
  }

  GetBadgeholderInfoASCX(flag) {
    this.badgeholderModel.securityBadgeNo = this.badgeholderModel.badgeNumber
    var badgeNo =
      this.badgeholderModel.securityBadgeNo === ""
        ? "0"
        : this.badgeholderModel.securityBadgeNo;
    if (this.badgeholderModel.securityBadgeNo != "") {
      if (this.badgeholderModel.securityBadgeNo != undefined) {
        this.readonlyBadge = true;

        this.NovService.GetBadgeByNumber(
          this.badgeholderModel.securityBadgeNo
        ).subscribe(
          res => {
            if (res && res.data && res.data.length > 0) {
              const data = res.data[0]

              if (data != null) {
                this.badgeholder = data as Badgeholder;
                this.badgeholderModel.securityBadgeNo = this.badgeholder.badgeNumber;
                this.badgeholderModel.firstName = this.badgeholder.firstName;
                this.badgeholderModel.lastName = this.badgeholder.lastName;
                // this.badgeholderModel.badgeholderDOB = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');

                this.badgeholderModel.badgeholderDOB = this.formatDateToMMDDYYYY(this.badgeholder.birthDate)
                this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(this.fromModel(this.badgeholderModel.badgeholderDOB));
                var company = this.allCompanyList.find(
                  (x) => x.companyName == this.badgeholder.company
                );
                this.badgeholderModel.driverLicenseNo = this.badgeholder.driversLicenseNo  
                this.inspectioninfo.isBadgeAutoFilled = true
                if (company !== undefined) {
                  this.badgeholderModel.companyId = company.id;
                  this.isCompany = true;
                } else {
                  //this.spinner.hide();
                  this.isCompany = true;
                  this.badgeholderModel.companyId = null;
                  if (this.badgeholder.company !== null) {
                    this.toastr.error(
                      "The company " +
                      '"' +
                      this.badgeholder.company +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                      "Error"
                    );
                  } else {
                    this.toastr.error(
                      "Company associated with badge# " +
                      '"' +
                      this.badgeholder.badgeNo +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                      "Error"
                    );
                  }
                }
                this.badgeholder.dob = this.datePipe.transform(
                  this.badgeholder.dob,
                  "MM/dd/yyyy"
                );
                this.dtTrigger.next();
              } else {
                //this.spinner.hide();
                this.readonlyBadge = false;
                if (flag == 1) {
                  this.toastr.warning("Security Badge # does not exist.", "Error");
                  this.isCompany = false;
                  this.clearBadgeholderInfo();
                }
              }
            }else {
              //this.spinner.hide();
              this.readonlyBadge = false;
              if (flag == 1) {
                this.toastr.warning("Security Badge # does not exist.", "Error");
                this.isCompany = false;
                this.clearBadgeholderInfo();
              }
            }
          },
          (error: any) => {
            //this.spinner.hide();
            if (flag == 1) {
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.clearBadgeholderInfo();
            }
          }
        );
      } else {
        //this.spinner.hide();
        this.readonlyBadge = false;
        if (flag == 1) {
          this.clearBadgeholderInfo();
          this.isCompany = false;
        }
      }
    } else {
      //this.spinner.hide();
      this.readonlyBadge = false;
      if (flag == 1) {
        this.clearBadgeholderInfo();
        this.isCompany = false;
      }
    }
  }

  formatDateToMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensures two digits
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  GetBadgeholderInfo(flag) {
    var badgeNo =
      this.badgeholderModel.securityBadgeNo === ""
        ? "0"
        : this.badgeholderModel.securityBadgeNo;
    if (this.badgeholderModel.securityBadgeNo != "") {
      if (this.badgeholderModel.securityBadgeNo != undefined) {
        this.readonlyBadge = true;
        // this.badgeholderModel.companyId = 0;
        this.NovService.GetBadgeholderInfo(
          this.badgeholderModel.securityBadgeNo
        ).subscribe(
          (data: Badgeholder) => {
            if (data != null) {
              this.badgeholder = data as Badgeholder;
              this.badgeholderModel.securityBadgeNo = this.badgeholder.badgeNo;
              this.badgeholderModel.firstName = this.badgeholder.firstName;
              this.badgeholderModel.lastName = this.badgeholder.lastName;
              // this.badgeholderModel.badgeholderDOB = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
              this.badgeholderModel.badgeholderDOB = this.dateAdapter.toModel(
                this.fromModel(this.badgeholder.dob)
              );
              var company = this.allCompanyList.find(
                (x) => x.companyName == this.badgeholder.company
              );
              if (company !== undefined) {
                this.badgeholderModel.companyId = company.id;
                this.isCompany = true;
              } else {
                //this.spinner.hide();
                this.isCompany = true;
                this.badgeholderModel.companyId = null;
                if (this.badgeholder.company !== null) {
                  this.toastr.error(
                    "The company " +
                    '"' +
                    this.badgeholder.company +
                    '"' +
                    " is not defined in SEMS Application, please contact SBO.",
                    "Error"
                  );
                } else {
                  this.toastr.error(
                    "Company associated with badge# " +
                    '"' +
                    this.badgeholder.badgeNo +
                    '"' +
                    " is not defined in SEMS Application, please contact SBO.",
                    "Error"
                  );
                }
              }
              this.badgeholder.dob = this.datePipe.transform(
                this.badgeholder.dob,
                "MM/dd/yyyy"
              );
              this.dtTrigger.next();
            } else {
              //this.spinner.hide();
              this.readonlyBadge = false;
              if (flag == 1) {
                this.toastr.warning("Security Badge # does not exist.", "Error");
                this.isCompany = false;
                this.clearBadgeholderInfo();
              }
            }
          },
          (error: any) => {
            //this.spinner.hide();
            if (flag == 1) {
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.clearBadgeholderInfo();
            }
          }
        );
      } else {
        //this.spinner.hide();
        this.readonlyBadge = false;
        if (flag == 1) {
          this.clearBadgeholderInfo();
          this.isCompany = false;
        }
      }
    } else {
      //this.spinner.hide();
      this.readonlyBadge = false;
      if (flag == 1) {
        this.clearBadgeholderInfo();
        this.isCompany = false;
      }
    }
  }

  GetBadgeholderInfoAWSForBadgeASCX(badgeNum) {
    if (this.inspectioninfo.badge1 != "") {
      this.isBadge1 = true;
    }
    if (this.inspectioninfo.badge2 != "") {
      this.isBadge2 = true;
    }
    if (this.inspectioninfo.badge3 != "") {
      this.isBadge3 = true;
    }
    var badgeNo = badgeNum === "" ? "0" : badgeNum;
    //checked if badge entered is not null
    if (badgeNum != "") {
      //checked if badge is not undefined
      if (badgeNum != undefined) {
        this.readonlyBadge = true;
        //service call to get data of security badge
        this.NovService.GetBadgeByNumber(badgeNum).subscribe(
          res => {
            if (res && res.data && res.data.length > 0) {
              const data = res.data[0]

            if (data != null) {
              
              this.isValid = true;
              this.badgeholder = data as Badgeholder;
              
              if (this.inspectioninfo.badge1 === badgeNum) {
                
                this.inspectioninfo.badge1 = this.badgeholder.badgeNumber;
                this.inspectioninfo.name1 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              } else if (this.inspectioninfo.badge2 === badgeNum) {
                // this.isBadge2 = true;
                this.inspectioninfo.badge2 = this.badgeholder.badgeNumber;
                this.inspectioninfo.name2 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              } else if (this.inspectioninfo.badge3 === badgeNum) {
                //this.isBadge3 = true;
                this.inspectioninfo.badge3 = this.badgeholder.badgeNumber;
                this.inspectioninfo.name3 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              }
              this.isValid = true;
              this.inspectioninfo.isBadgeAutoFilled = true
            }
            // if data is null error msg will show
            else {
              this.readonlyBadge = false;
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.isValid = false;
              //make the repectivename field null if data is not available
              if (this.inspectioninfo.badge1 === badgeNum) {
                this.inspectioninfo.name1 = "";
              }
              if (this.inspectioninfo.badge2 === badgeNum) {
                this.inspectioninfo.name2 = "";
              }
              if (this.inspectioninfo.badge3 === badgeNum) {
                this.inspectioninfo.name3 = "";
              }
              this.isCompany = false;
              this.clearBadgeholderInfo();
            }
          }else{
            this.readonlyBadge = false;
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.isValid = false;
              //make the repectivename field null if data is not available
              if (this.inspectioninfo.badge1 === badgeNum) {
                this.inspectioninfo.name1 = "";
              }
              if (this.inspectioninfo.badge2 === badgeNum) {
                this.inspectioninfo.name2 = "";
              }
              if (this.inspectioninfo.badge3 === badgeNum) {
                this.inspectioninfo.name3 = "";
              }
              this.isCompany = false;
              this.clearBadgeholderInfo();
          }

          },
          (error: any) => {
            //error message
            this.toastr.warning("Security Badge # does not exist.", "Error");
            this.clearBadgeholderInfo();
            this.isValid = false;
          }
        );
      } else {
        this.readonlyBadge = false;
        this.clearBadgeholderInfo();
        this.isCompany = false;
        //this.isValid = false;
      }
    }
    //if data is null values will be null
    else if (!badgeNum) {
      if (this.inspectioninfo.badge1 === badgeNum) {
        this.isBadge1 = false; // Reset the badge flag
        this.inspectioninfo.badge1 = "";
        this.inspectioninfo.name1 = "";
      }
      if (this.inspectioninfo.badge2 === badgeNum) {
        this.isBadge2 = false; // Reset the badge flag
        this.inspectioninfo.badge2 = "";
        this.inspectioninfo.name2 = "";
      }
      if (this.inspectioninfo.badge3 === badgeNum) {
        this.isBadge3 = false; // Reset the badge flag
        this.inspectioninfo.badge3 = "";
        this.inspectioninfo.name3 = "";
      }
      this.isValid = true;
    } else {
      this.isValid = true;
    }
  }

  //get information of security badge also checks if it is valid or not
  GetBadgeholderInfoAWSForBadge(badgeNum) {
    if (this.inspectioninfo.badge1 != "") {
      this.isBadge1 = true;
    }
    if (this.inspectioninfo.badge2 != "") {
      this.isBadge2 = true;
    }
    if (this.inspectioninfo.badge3 != "") {
      this.isBadge3 = true;
    }
    var badgeNo = badgeNum === "" ? "0" : badgeNum;
    //checked if badge entered is not null
    if (badgeNum != "") {
      //checked if badge is not undefined
      if (badgeNum != undefined) {
        this.readonlyBadge = true;
        //service call to get data of security badge
        this.NovService.GetBadgeholderInfo(badgeNum).subscribe(
          (data: Badgeholder) => {
            //checked if data is not null
            if (data != null) {
              //make isValid true to enable the save or submit button
              this.isValid = true;
              this.badgeholder = data as Badgeholder;
              //checked textbox name with badge number if it matches assign the values of response to that textboc value

              if (this.inspectioninfo.badge1 === badgeNum) {
                // this.isBadge1 = true;
                this.inspectioninfo.badge1 = this.badgeholder.badgeNo;
                this.inspectioninfo.name1 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              } else if (this.inspectioninfo.badge2 === badgeNum) {
                // this.isBadge2 = true;
                this.inspectioninfo.badge2 = this.badgeholder.badgeNo;
                this.inspectioninfo.name2 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              } else if (this.inspectioninfo.badge3 === badgeNum) {
                //this.isBadge3 = true;
                this.inspectioninfo.badge3 = this.badgeholder.badgeNo;
                this.inspectioninfo.name3 = `${this.badgeholder.firstName} ${this.badgeholder.lastName}`;
              }
              this.isValid = true;
            }
            // if data is null error msg will show
            else {
              this.readonlyBadge = false;
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.isValid = false;
              //make the repectivename field null if data is not available
              if (this.inspectioninfo.badge1 === badgeNum) {
                this.inspectioninfo.name1 = "";
              }
              if (this.inspectioninfo.badge2 === badgeNum) {
                this.inspectioninfo.name2 = "";
              }
              if (this.inspectioninfo.badge3 === badgeNum) {
                this.inspectioninfo.name3 = "";
              }
              this.isCompany = false;
              this.clearBadgeholderInfo();
            }
          },
          (error: any) => {
            //error message
            this.toastr.warning("Security Badge # does not exist.", "Error");
            this.clearBadgeholderInfo();
            this.isValid = false;
          }
        );
      } else {
        this.readonlyBadge = false;
        this.clearBadgeholderInfo();
        this.isCompany = false;
        //this.isValid = false;
      }
    }
    //if data is null values will be null
    else if (!badgeNum) {
      if (this.inspectioninfo.badge1 === badgeNum) {
        this.isBadge1 = false; // Reset the badge flag
        this.inspectioninfo.badge1 = "";
        this.inspectioninfo.name1 = "";
      }
      if (this.inspectioninfo.badge2 === badgeNum) {
        this.isBadge2 = false; // Reset the badge flag
        this.inspectioninfo.badge2 = "";
        this.inspectioninfo.name2 = "";
      }
      if (this.inspectioninfo.badge3 === badgeNum) {
        this.isBadge3 = false; // Reset the badge flag
        this.inspectioninfo.badge3 = "";
        this.inspectioninfo.name3 = "";
      }
      this.isValid = true;
    } else {
      this.isValid = true;
    }
  }

  getBadgeData(badgeNumbers: string[]) {
    if (badgeNumbers == undefined) {
      this.toastr.error("Enter Three Security # Badges.", "Error");
    } else {
      this.isShowTable = true;
      console.log("Fetching data for badge numbers:", badgeNumbers);
      this.NovService.GetBadgeholderInfoForMultipleBadgeNumbers(
        badgeNumbers
      ).subscribe((data: Badgeholder[]) => {
        if (data != null) {
          this.BadgeholderList = data;
        }
      });
    }
  }

  public clearBadgeholderInfo() {
    this.badgeholderModel.companyId = null;
    this.badgeholderModel.firstName = "";
    this.badgeholderModel.lastName = "";
    this.badgeholderModel.badgeholderDOB = "";
    this.badgeholderModel.birthDate = "";

  }

  sort(property, event) {
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

    this.isDesc = !this.isDesc; //change the direction
    //this.column = property;
    let direction = this.isDesc ? 1 : -1;
    if (property === "dateOfKnife") {
      this.companyInsp.sort(function (a, b) {
        var dateA = new Date(a.dateOfKnife).getTime();
        var dateB = new Date(b.dateOfKnife).getTime();
        //return dateA > dateB ? 1 : -1;
        if (dateA < dateB) {
          return -1 * direction;
        } else if (dateA > dateB) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
    }
    if (property === "badgeholderDOB") {
      this.badgeholderInsp.sort(function (a, b) {
        var dateA = new Date(a.badgeholderDOB).getTime();
        var dateB = new Date(b.badgeholderDOB).getTime();
        //return dateA > dateB ? 1 : -1;
        if (dateA < dateB) {
          return -1 * direction;
        } else if (dateA > dateB) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
    } else {
      this.badgeholderInsp.sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1 * direction;
        } else if (a[property] > b[property]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });

      this.vehicleInsp.sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1 * direction;
        } else if (a[property] > b[property]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });

      this.companyInsp.sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1 * direction;
        } else if (a[property] > b[property]) {
          return 1 * direction;
        } else {
          return 0;
        }
      });
    }
  }

  sortFunction(a, b) {
    // this.isDesc = !this.isDesc; //change the direction
    // //this.column = property;
    // let direction = this.isDesc ? 1 : -1;

    var dateA = new Date(a.badgeholderDOB).getTime();
    var dateB = new Date(b.badgeholderDOB).getTime();
    return 0 - (dateA > dateB ? 1 : -1);
  }

  enableSave() {
    if (this.isDeliveryVehicleInsp == true) {
      if (this.isVisitorInfoShow == true) {
        if (
          (this.badgeholderModel.companyId == undefined ||
            this.badgeholderModel.firstName == undefined ||
            this.badgeholderModel.lastName == undefined ||
            this.badgeholderModel.badgeholderDOB == undefined ||
            this.inspectioninfo.inspectionTime == undefined ||
            this.selectedDoorList.length == 0) &&
          this.badgeholderInsp.length == 0
        ) {
          return true;
        }
        return false;
      }
      if (this.isVehicleInspection == true) {
        if (
          (this.vehicleModel.vehicleModel == undefined ||
            this.vehicleModel.vehicleModel == "") &&
          this.vehicleInsp.length == 0
        ) {
          return true;
        }
        return false;
      }
    } else if (this.isSterileAreaPiInsp == true) {
      if (
        (this.companyModel.companyId == undefined ||
          this.companyModel.companyFacilitator == undefined ||
          this.inspectioninfo.inspectionTime == undefined) &&
        this.companyInsp.length == 0
      ) {
        return true;
      }
      return false;
    } else if (this.isPortalInsp == true) {
      if (
        this.selectedDoorList == undefined ||
        this.inspectioninfo.inspectionTime == undefined ||
        this.inspectioninfo.hours == undefined ||
        this.inspectioninfo.minutes == undefined ||
        this.inspectioninfo.individualsInspected == undefined ||
        this.selectedDoorList.length == 0
      ) {
        return true;
      }
      return false;
    } else if (this.isAWSInspection == true) {
      if (
        this.selectedDoorList == undefined ||
        this.inspectioninfo.inspectionTime == undefined ||
        this.inspectioninfo.hours == undefined ||
        this.inspectioninfo.minutes == undefined ||
        this.inspectioninfo.individualsInspected == undefined ||
        this.selectedDoorList.length == 0
        //this.isValid == false
      ) {
        return true;
      } else if (this.inspectioninfo.badge1 != '' &&
        this.inspectioninfo.name1 == ''
      ) {
        return true;
      }
      else if (this.inspectioninfo.badge2 != '' &&
        this.inspectioninfo.name2 == ''
      ) {
        return true;
      }
      else if (this.inspectioninfo.badge3 != '' &&
        this.inspectioninfo.name3 == ''
      ) {
        return true;
      }
      return false;

    }
    // else if(this.inspectioninfo.badge2 != ''  && 
    //   this.inspectioninfo.name2 == ''
    // ){
    //   return true;
    // } 
    // else if(this.inspectioninfo.badge3 != ''  && 
    //   this.inspectioninfo.name3 == ''
    // ){
    //   return true;
    // }
    else if (this.inspectioninfo.inspectionTime == undefined) {
      return true;
    } else {
      if (this.inspectioninfo.inspectionFacilityId == undefined) {
        return true;
      }
      return false;
    }
  }

  convertToNgbDate(date: string) {
    const d = new Date(date);

    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  convertTo24Hour(time: string): string {
    const [t, modifier] = time.split(" ");
    let [hours, minutes] = t.split(":");

    let h = parseInt(hours, 10);

    if (modifier === "PM" && h < 12) {
      h += 12;
    }

    if (modifier === "AM" && h === 12) {
      h = 0;
    }

    return `${h.toString().padStart(2, "0")}:${minutes}`;
  }
  goToSchdelarPage(id: number) {
    this.router.navigate(["/admin/scheduler"], {
      queryParams: {
        isEdit: 1,
        scheduleId: id,
        isView:"1",
        isShow: false,
        submitted: true,
        verified: true
      },
      skipLocationChange: true,
    });
  }
}
