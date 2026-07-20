import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
// import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from "angular-datatables";
import { SignaturePad } from "angular2-signaturepad";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { Observable, Subject } from "rxjs";
import { CitationReasons } from "../../master/citationreasons";
import { Company } from "../../master/company";
import { ViolationTypes } from "../../master/violationtypes";
import { ViolationTypesService } from "../../master/violationtypes/violationtype.service";
import { CompanyService } from "../../master/company/company.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { CitationReasonsService } from "../../master/CitationReasons/citationreasons.service";
import { runInThisContext } from "vm";
import { NovService } from "../nov.service";
import { CitationAttachments, CitationDetails, recentCitationMaster } from "../CitationDetails";
import {
  CorrectiveActions,
  CorrectiveActionsTrainings,
} from "../correctiveactions";
import { Badgeholder } from "../badgeholder";
import { forEach } from "jszip";
import { Locations } from "../../master/locations";
import { LocationService } from "../../master/location/location.service";
import { CouStatus } from "@app/app.component";
import { FormCanDeactivate } from "@app/_helpers/form-can-deactivate/form-can-deactivate";
import {
  ModalDismissReasons,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { AppConfigService } from "@app/_services/appconfigservice ";

@Component({
  selector: "app-cou",
  templateUrl: "./cou.component.html",
  styleUrls: ["./cou.component.scss"],
})
export class CouComponent extends FormCanDeactivate implements OnInit {
  @ViewChild("formData", { static: false })

  // @ViewChild('ctdTabset', { static: false })
  // private ctdTabset: NgbTabset;
  form: NgForm;
  public activeTab = "tab1";
  time = { hour: 13, minute: 30 };
  meridian = false;
  enableEdit = false;
  enableEditIndex = null;
  dtOptions: any = {};
  isDesc: boolean = false;
  oldSign: string = "";
  @ViewChild("opdAlert", { static: true }) opdAlert!: TemplateRef<any>;
  smsSend: string = "true";
  emailSend: string = "true";

  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  @ViewChild("input", { static: false }) myInputVariable: ElementRef;
  @ViewChild(SignaturePad, { static: false }) public signaturePad: SignaturePad;
  dtElement: DataTableDirective;
  dtInstance: {}; // Promise<DataTables.Api>;

  public signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 1,
    canvasHeight: 150,
    canvasWidth: 300,
  };

  strCommentAuth: string = "";
  readOnlyCou: boolean = false;
  isCollapsed = false;
  loading = false;
  isCouExists: boolean = false;
  isStaffAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isIssuer: boolean = true;
  isViewCou: boolean = false;
  isViewAuthorizedSigner: boolean = false;
  cou: CitationDetails = new CitationDetails();
  badgeholder: Badgeholder = new Badgeholder();
  couId: number = 0;
  companyId: number = 0;
  allViolationTypes: ViolationTypes[];
  unfilteredViolationTypes: ViolationTypes[];
  activeViolationTypes: ViolationTypes[];
  allCompanyList: Company[];
  personUniqueId:string ="";
  allCitationReasonsList: CitationReasons[] = [];
  activecitationReasonList:CitationReasons[] = [];
  // violationTypesListForScreens : ViolationTypesTemp[] = [];
  Filtered: CitationReasons[];
  files: string[] = [];
  couImagesLst: string[] = [];
  deletedFiles: string[] = [];
  webCameraImage: string;
  user: any;
  isPendingForCompletion: boolean = false;
  public couAttachmentsImg: CitationAttachments[] = [];
  public couAttachmentsFile: CitationAttachments[] = [];
  showBtn = -1;
  public showWebcam = false;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];
  public isDirty: boolean = false;
  // latest snapshot
  public webcamImage: WebcamImage = null;
  public webcamImageArr: WebcamImage[] = [];
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  submitted: boolean = false;
  isSubmitShow: boolean = true;
  isSaveFormDetails: boolean = false;
  //public citationCaseStatus: string = "0";
  isClone: String = "";
  sortDir = 1; //1= 'ASE' -1= DSC
  staffAdminComment = "";
  staffAdminCommentIssuer = "";
  correctiveAction: CorrectiveActions = new CorrectiveActions();
  remedialTrainings: Array<CorrectiveActionsTrainings> = [];
  deletedeventIds: number[] = [];
  inspectionId: number = 0;
  maxValue: number = 0;
  company = new Company();
  cmpId: number;
  pagedData: any[] = []; // final display

  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  allLocationList: Locations[] = [];
  selectedDoorList: Locations[] = [];
  dtOptionsPastCou: {};
  doorDropdownSettings: {}
  selectedDoorGateNumber: Locations[] = [];
  readonly DELIMITER = "/";
  key: String;
  CIT_type = "COU";
  selectedNovDoorList: Locations[] = [];
  readonlyBadge: boolean = false;
  closeResult: any;
  pastCou: recentCitationMaster[] = [];
  windowRef: any;
  selectedDoorNames: string = "";

  sortColumn: string = "";
  sortDirection: "asc" | "desc" = "asc";
  couCount: number = 0;
  novCount: number = 0;
  isCitationEdit:string;
  allowNavigation = false;
  dataLoaded: boolean = false;
  callCount = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private ViolationTypesService: ViolationTypesService,
    private CompanyService: CompanyService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private CitationReasonsService: CitationReasonsService,
    private _cdRef: ChangeDetectorRef,
    private NovService: NovService,
    private locationService: LocationService,
    private ngbCalendar: NgbCalendar,
    private appURL: AppConfigService,
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (
      this.appURL.getLoginMethod() != "Azure" &&
      this.appURL.getLoginMethod() != "Okta"
    ) {
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(["admin/changepassword"]);
      }
    }
    this.GetCitationReasonList();

    this.isDirty = false;
    //Get Violation type list
    this.GetViolationTypeList();

    //Get Company list
    this.GetCompanyList();

    //Get Location list
    this.GetLocationList();

    //Set default active tab
    sessionStorage.setItem("tab", this.activeTab);
    this.windowRef = window;
    this.loadMaxValue();
    //this.loadViolationTypes();

    //Set Violtion default date
    // this.cou.violationDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.cou.violationDate = this.dateAdapter.toModel(
      this.ngbCalendar.getToday(),
    );
    this.cou.violationTime = this.datePipe.transform(new Date(), "HH:mm");

    //Web cam setting
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      },
    );

    //Get Data from routes
    var isEdit: string =
      this.route.snapshot.pathFromRoot[1].queryParams["isEdit"];
    var isClone: string =
      this.route.snapshot.pathFromRoot[1].queryParams["isClone"];

    this.isClone = isClone;
    if (isEdit == "1") {
      this.isCitationEdit = "1"
      if (isClone != "1") {
        this.readOnlyCou = true;
        console.log("Here1");
      } else {
        this.cou.issuedBy = this.user.name;
        console.log("Here2");
      }
      var couId: number =
        this.route.snapshot.pathFromRoot[1].queryParams["couId"];
      var companyId =
        this.user.rolename == "AuthSigner" ? this.user.companyId : 0;
      this.companyId = companyId;
    } else {
      this.isCitationEdit = "0"
      this.cou.issuedBy = this.user.name;
      this.isViewCou = false;
    }
    if (couId > 0) {
      this.couId = couId;
    }
    if (couId > 0) {
      this.GetCouDetailsById(this.couId, this.companyId);
    }

    this.doorDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.dtOptionsPastCou = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      responsive: true,

      order: [[0, "desc"]], // sort by date column
      orderMulti: false,
       columnDefs: [
        { targets: 0, type: 'date' }
       
        
      ],
    };

    var date1 = new Date().toISOString();
    var date2 = this.datePipe.transform(new Date(), "MM/dd/yyyy HH:mm:ss.SSS");
    var date3 = new Date();

    var date4 = new Date().getTime() / 1000; //for seconds
    var date5 = new Date().getTime(); //for milliseconds
    this.key = this.CIT_type + this.user.id + date5;
  }

  canDeactivate(): boolean {
  if (this.allowNavigation) {
    return true;
  }
  return !this.isDirty;
}
  goToNov() {
  this.allowNavigation = true;

  this.router.navigate(['/admin/nov/details'], {
    queryParams: {
      isEdit: 0,
      badgeNo: this.badgeholder.badgeNumber
    },
    skipLocationChange: true
  });
}
  // loadTable() {
  //   setTimeout(() => {
  //     $("#couTable").DataTable({
  //       paging: true,
  //       searching: true,
  //       ordering: true,
  //       destroy: true, // important for reloading
  //       pageLength: 5,
  //       lengthMenu: [5, 10, 20],
  //       columnDefs: [{ orderable: true, targets: [0, 1, 2, 3] }],
  //     });
  //   }, 0);
  // }

  GetFormattedDate(badgeHolderDOB) {
    var todayTime = new Date(badgeHolderDOB);
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return month + "/" + day + "/" + year;
  }

  //-----------------------------------------------CAMERA PART---------------------------------------------------------//
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  //Toggel Webcam
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === "NotAllowedError"
    ) {
      console.warn("Camera access was not allowed by user!");
    }
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    //console.log('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    this.webcamImageArr.push(webcamImage);
  }

  public cameraWasSwitched(deviceId: string): void {
    //console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  //-----------------------------------------------CAMERA PART Ends---------------------------------------------------------//

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  //Bind Cou Details
  bindCouDetails() {
    if (this.webcamImageArr != null) {
      this.webcamImageArr.forEach((element) => {
        this.couImagesLst.push(element.imageAsDataUrl);
      });
      //this.citation.capturedImage = this.webcamImage.imageAsDataUrl;
    }
    var couDetails = {
      Id: this.cou.id,
      NovNo: this.cou.novNo,
      //Type: this.citation.type,
      // CaseStatus: this.citation.caseStatus,
      ViolatorFirstName: this.cou.violatorFirstName,
      ViolatorLastName: this.cou.violatorLastName,
      // ViolatorBirthDate: this.datePipe.transform(this.cou.violatorBirthDate, 'MM/dd/yyyy'),
      // ViolationDate: this.datePipe.transform(this.cou.violationDate, 'MM/dd/yyyy'),
      
       ViolatorBirthDate: this.badgeholder.birthDate
    ? this.dateAdapter.toModel(
        this.fromModel(this.badgeholder.birthDate)
      )
    : null,
      ViolationDate: this.dateAdapter.toModel(
        this.fromModel(this.cou.violationDate),
      ),
      ViolationTime: this.onTimeChange(this.cou.violationTime),
      ViolationTypeId: this.cou.violationTypeId,
      OPDPoliceReport: this.cou.opdPoliceReport,
      CitationResonId: this.cou.citationResonId,
      isCompanyCitation: this.cou.isCompanyCitation,
      SummaryOfViolation: this.cou.summaryOfViolation,
      Address: this.cou.address,
      City: this.cou.city,
      State: this.cou.state,
      Zip: this.cou.zip,
      DriversLicenseNo: this.cou.driversLicenseNo,
      LicenseState: this.cou.licenseState,
      SecurityBadgeNo: this.cou.securityBadgeNo,
      CompanyId: this.cou.companyId,
      MVOPPermitNo: this.cou.mvopPermitNo,
      VehicleLicenseNo: this.cou.vehicleLicenseNo,
      VehicleState: this.cou.vehicleState,
      VehicleYear: this.cou.vehicleYear,
      VehicleMakeModel: this.cou.vehicleMakeModel,
      WitnessName: this.cou.witnessName,
      WitnessBadgeNo: this.cou.witnessBadgeNo,
      NOVNotes: this.cou.novNotes,
      OffenderSignature: this.signaturePad.toDataURL(),
      CapturedImage: this.cou.capturedImage, //this.webCameraImage,
      CurrentCitationStatusId: CouStatus.Draft,
      UserId: this.user.id,
      isSubmitted: false,
      isBadgeConfiscated: this.cou.isBadgeConfiscated,
      IssuedBy: this.cou.issuedBy,
      EventList: this.cou.eventList,
      EventEdited: this.cou.eventEdited,
      Type: this.cou.type,
      Email: this.cou.email,
      Phone: this.cou.phone,
      KeyValue: this.key,
      IscctvAvailable: this.cou.iscctvAvailable,
      IsBadgeAutoFilled: this.cou.isBadgeAutoFilled,
      personUniqueId: this.cou.personUniqueId,
    };

    return couDetails;
  }

  formatUserPhoneNumber() {
    if (this.cou.phone != null) {
      let valLength = this.cou.phone.length;
      if (valLength == 1) {
        this.cou.phone = "(" + this.cou.phone;
      }
      if (valLength == 4) {
        this.cou.phone = this.cou.phone + ") ";
      }
      if (valLength == 9) {
        this.cou.phone = this.cou.phone + "-";
      }
    }
  }

  onTimeChange(notifiedTime: string) {
    var timeSplit = notifiedTime.split(":"),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = "PM";
      hours -= 12;
    } else if (hours < 12) {
      meridian = "AM";
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = "PM";
    }
    return hours + ":" + minutes + " " + meridian;
  }

  //Check if NOV exits
  CheckCouExists() {
    if (!this.readOnlyCou) {
      let couid = this.cou.novNo === undefined ? 0 : this.cou.novNo;
      this.NovService.CheckNovExists(couid).subscribe(
        (response) => {
          if (response) {
            this.isCouExists = true;
            this.toastr.error(
              "Please try again! Either this COU# already exists Or Try entering COU# between 1 and 100000.",
              "Information",
            );
            this.cou.novNo = 0;
          } else {
            this.isCouExists = false;
          }
        },
        (error: any) => {
          this.toastr.error(
            "Please try again! Either this COU# already exists Or Try entering COU# between 1 and 100000.",
            "Information",
          );
          //this.spinner.hide();
        },
      );
    }
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

  GetBadgeholderInfoASCX() {
    if (this.badgeholder.badgeNumber != "") {
      if (this.badgeholder.badgeNumber != undefined) {
        this.cou.companyId = 0;
        this.readonlyBadge = true;
        
        this.NovService.GetBadgeByNumber(
          this.badgeholder.badgeNumber,
        ).subscribe(
          (res) => {
            if (res && res.data && res.data.length > 0) {
              const data = res.data[0];

              if (data != null) {
                this.badgeholder = data as Badgeholder;
                //this.badgeholder.birthDate = this.dateAdapter.toModel(this.fromModel(this.badgeholder.birthDate));
               
               if(this.badgeholder.birthDate){
                  this.badgeholder.birthDate = this.formatDateToMMDDYYYY(
                  this.badgeholder.birthDate,
                  );
                  this.badgeholder.birthDate = this.dateAdapter.toModel(
                  this.fromModel(this.badgeholder.birthDate),
                  );
                }else{
                this.badgeholder.birthDate = null;
               }
               
                this.cou.phone = this.badgeholder.mobileNumber;
                this.cou.personUniqueId = this.badgeholder.personUniqueId; //person unique id
                this.cou.zip = this.badgeholder.zipCode;
                this.cou.isBadgeAutoFilled = true;
                // this.cou.email = this.badgeholder.emailAddress
                var company = this.allCompanyList.find(
                  (x) =>
                    x.companyName.toLowerCase().trim() ==
                    this.badgeholder.company.toLowerCase().trim(),
                );
                if (company !== undefined) {
                  this.cou.companyId = company.id;
                } else {
                  //this.spinner.hide();
                  this.cou.companyId = null;
                  if (this.badgeholder.company !== null) {
                    this.toastr.error(
                      "The company " +
                        '"' +
                        this.badgeholder.company +
                        '"' +
                        " is not defined in SEMS Application, please contact SBO. Try another badge",
                      "Error",
                    );
                    this.clearBadgeholderInfo();
                  } else {
                    this.toastr.error(
                      "Company associated with badge# " +
                        '"' +
                        this.badgeholder.badgeNo +
                        '"' +
                        " is not defined in SEMS Application, please contact SBO.",
                      "Error",
                    );
                  }
                }
                this.formatUserEmail();
                // this.badgeholder.dob = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
                this.dtTrigger.next();
                if(this.badgeholder.personUniqueId  != null && this.badgeholder.personUniqueId  != ""){
                  this.GetCouRecordsList(null,this.badgeholder.personUniqueId);
                }else{
                  this.GetCouRecordsList(this.badgeholder.badgeNumber,null);
                }
                
              } else {
                //this.spinner.hide();
                this.toastr.warning(
                  "Security Badge # does not exist.",
                  "Error",
                );
                this.readonlyBadge = false;
                this.clearBadgeholderInfo();
              }
            } else {
              //this.spinner.hide();
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.readonlyBadge = false;
              this.clearBadgeholderInfo();
            }
          },
          (error: any) => {
            //this.spinner.hide();
            this.toastr.error(
              "Error while fetching Badgeholder information.",
              "Error",
            );
            this.clearBadgeholderInfo();
          },
        );
      } else if (this.badgeholder.badgeNumber == undefined) {
        this.toastr.error("Please enter Security Badge #", "Information");
        //this.spinner.hide();
        this.readonlyBadge = false;
        this.clearBadgeholderInfo();
      }
    } else {
      this.toastr.error("Please enter Security Badge #", "Information");
      //this.spinner.hide();
      this.readonlyBadge = false;
      this.clearBadgeholderInfo();
    }
    this.formatUserEmail();
  }

 
  

  GetCouRecordsList(badgeNo?: string, personUniqueId?: string) {
  this.callCount++;

  this.NovService.GetPastCouRecords(badgeNo, personUniqueId)
    .subscribe((res) => {
      const data = res;

      this.pastCou = data.sort((a, b) => b.id - a.id);

      this.pastCou.forEach(element => {
        element.violationType = this.getViolationTypeName(element.violationTypeId);
        element.citationReason = this.getCitaionReasonName(element.citationResonId);
      });

      this.setCounts();
      this.dataLoaded = true;
    });
}

  setCounts() {
    this.couCount = this.pastCou.filter((x) => x.type === "COU").length;
    this.novCount = this.pastCou.filter((x) => x.type === "NOV").length;
  }



  sort(column: string) {
    // Toggle direction
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column;
      this.sortDirection = "asc";
    }

    this.pastCou.sort((a, b) => {
      let valA: any;
      let valB: any;

      // Handle special columns
      if (column === "type") {
        valA = this.getViolationTypeName(a.violationTypeId);
        valB = this.getViolationTypeName(b.violationTypeId);
      } else if (column === "reason") {
       valA = this.getCitaionReasonName(a.citationResonId);
       valB = this.getCitaionReasonName(b.citationResonId);
      } else if (column === "createdDate") {
        valA = new Date(a.createdDate);
        valB = new Date(b.createdDate);
      } else {
        valA = a[column];
        valB = b[column];
      }

      // Null safety
      valA = valA ?? "";
      valB = valB ?? "";

      // Compare
      if (valA < valB) return this.sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return this.sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  
  }

  loadMaxValue() {
    this.NovService.getMaxTolerableCount().subscribe((res) => {
      this.maxValue = res.maxValue;
      // console.log("output"+res);
      // console.log(this.maxValue);
    });
  }

  public GetCitationReasonList() {
    this.CitationReasonsService.GetCitationReasonList().subscribe(
      (response: CitationReasons[]) => {
        //console.log(response);
        this.Filtered = response;
        // console.log(this.Filtered)
      },
      (error: any) => {
        console.log("error list");
      },
    );
  }

  showPopup = false;

  openPopup() {
    this.showPopup = true;
    document.body.style.overflow = "hidden";
  }

  closePopup() {
    this.showPopup = false;
    document.body.style.overflow = "auto";
  }

  formatDateToMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensures two digits
    const day = date.getDate().toString().padStart(2, "0"); // Ensures two digits
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  GetBadgeholderInfo() {
    if (this.badgeholder.badgeNo != "") {
      if (this.badgeholder.badgeNo != undefined) {
        this.cou.companyId = 0;
        this.readonlyBadge = true;
        this.NovService.GetBadgeholderInfo(this.badgeholder.badgeNo).subscribe(
          (data: Badgeholder) => {
            if (data != null) {
              this.badgeholder = data as Badgeholder;
              this.badgeholder.dob = this.dateAdapter.toModel(
                this.fromModel(this.badgeholder.dob),
              );
              var company = this.allCompanyList.find(
                (x) =>
                  x.companyName.toLowerCase().trim() ==
                  this.badgeholder.company.toLowerCase().trim(),
              );
              if (company !== undefined) {
                this.cou.companyId = company.id;
              } else {
                //this.spinner.hide();
                this.cou.companyId = null;
                if (this.badgeholder.company !== null) {
                  this.toastr.error(
                    "The company " +
                      '"' +
                      this.badgeholder.company +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                    "Error",
                  );
                } else {
                  this.toastr.error(
                    "Company associated with badge# " +
                      '"' +
                      this.badgeholder.badgeNo +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                    "Error",
                  );
                }
              }
              this.formatUserEmail();
              // this.badgeholder.dob = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
              this.dtTrigger.next();
            } else {
              //this.spinner.hide();
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.readonlyBadge = false;
              this.clearBadgeholderInfo();
            }
          },
          (error: any) => {
            //this.spinner.hide();
            this.toastr.error(
              "Error while fetching Badgeholder information.",
              "Error",
            );
            this.clearBadgeholderInfo();
          },
        );
      } else if (this.badgeholder.badgeNo == undefined) {
        this.toastr.error("Please enter Security Badge #", "Information");
        //this.spinner.hide();
        this.readonlyBadge = false;
        this.clearBadgeholderInfo();
      }
    } else {
      this.toastr.error("Please enter Security Badge #", "Information");
      //this.spinner.hide();
      this.readonlyBadge = false;
      this.clearBadgeholderInfo();
    }
    this.formatUserEmail();
  }

  public clearBadgeholderInfo() {
    this.badgeholder.company = "";
    this.cou.companyId = null;
    this.badgeholder.firstName = "";
    this.badgeholder.lastName = "";
    this.badgeholder.dob = "";
    this.badgeholder.recpt_email_address = "";
    this.badgeholder.emailAddress = "";
    //this.badgeholder.badgeNumber = "";
    this.badgeholder.mobileNumber = "";
    this.badgeholder.birthDate = "";
    this.cou.phone = "";
  }

  resetIsDirtyFlag() {
    this.isDirty = false;
  }

  formValid() {
    if (
      this.cou.companyId === 0 &&
      this.cou.violatorFirstName.trim() === "" &&
      this.cou.violatorLastName.trim() === "" &&
      this.cou.violationTypeId === 0 &&
      this.cou.violatorBirthDate === ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  convertDate(date): string {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : "";
  }

  //Save Citaion by Issuer
  saveCou(formData: NgForm) {
    // console.log(formData.value)
    //this.spinner.show();
    if (this.isCouExists) {
      this.cou.novNo = undefined;
      this.toastr.error(
        "Please try again! Either this COU# already exists Or Try entering COU# between 1 and 100000.",
        "Information",
      );
      //this.spinner.hide();
    } else {
      var couDetails = this.bindCouDetails();
      //Save Citation
      this.submitted = true;
      // stop here if form is invalid
      if (formData.invalid) {
        return;
      }

      this.isSaveFormDetails = true;
      this.loading = true;

      if (this.cou.currentCitationStatusId != undefined) {
        couDetails.CurrentCitationStatusId = this.cou.currentCitationStatusId;
      } else {
        couDetails.CurrentCitationStatusId = CouStatus.Draft;
      }

      couDetails.Type = "COU";
      // couDetails.SecurityBadgeNo = this.badgeholder.badgeNo;
      couDetails.SecurityBadgeNo = this.badgeholder.badgeNumber;
      couDetails.ViolatorFirstName = this.badgeholder.firstName;
      couDetails.ViolatorLastName = this.badgeholder.lastName;
      // couDetails.ViolatorBirthDate = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
      // couDetails.ViolatorBirthDate = this.convertDate(this.badgeholder.dob);
      // couDetails.ViolationDate = this.convertDate(this.cou.violationDate)
      couDetails.Email = this.badgeholder.emailAddress;
      if (this.selectedDoorList.length > 0) {
        // var company = this.allCompanyList.find(x => x.companyName.toLowerCase().trim() == this.badgeholder.company.toLowerCase().trim())
        //if(company !== undefined)
        //{
        //couDetails.CompanyId = company.id

        
        if (couDetails.CompanyId != 0 && couDetails.CompanyId != null) {
          this.NovService.AddCitationDetails(
            couDetails,
            this.files,
            this.deletedFiles,
            this.couImagesLst,
            this.isSaveFormDetails,
            this.correctiveAction,
            this.remedialTrainings,
            this.deletedeventIds,
            this.inspectionId,
            this.selectedDoorList,
            this.selectedNovDoorList
           
          ).subscribe(
            (response: CitationDetails) => {
              this.loading = false;

              this.toastr.success("COU Information saved!!", "Information");
              this.oldSign = this.signaturePad.toDataURL();

              //this.spinner.hide();
              this.files = [];
              this.readOnlyCou = true;
              this.resetIsDirtyFlag();
              this.isSubmitShow = true;
              // if (this.user.rolename != "Issuer")
              this.router.navigate(["/admin/dashboard"]).then(() => {
                this.router.navigate(["/admin/nov/counseling"], {
                  queryParams: {
                    couId: response,
                    isEdit: 1,
                    isClone: 0,
                  },
                });
              });
            },
            (error: any) => {
              console.log(error);
              this.toastr.error("COU Information not saved!", "Information");
              //this.spinner.hide();
            },
          );
        } else {
          if (this.badgeholder.company !== null) {
            this.toastr.error(
              "You cannot save COU information. The company " +
                '"' +
                this.badgeholder.company +
                '"' +
                " is not defined in SEMS Application, please contact SBO.",
              "Error",
            );
          } else {
            this.toastr.error(
              "You cannot save COU information. Company associated with badge# " +
                '"' +
                this.badgeholder.badgeNo +
                '"' +
                " is not defined in SEMS Application, please contact SBO.",
              "Error",
            );
          }
          //this.spinner.hide();
        }
        //}
        //else
        // {
        //   if(this.badgeholder.company !== null)
        //   {
        //     this.toastr.error("You cannot save COU information. The company "+'"'+ this.badgeholder.company +'"'+" is not defined in SEMS Application, please contact SBO.", "Error");
        //   }
        //   else
        //   {
        //     this.toastr.error("You cannot save COU information. Company associated with badge# "+'"'+ this.badgeholder.badgeNo +'"'+" is not defined in SEMS Application, please contact SBO.", "Error");
        //   }
        //   //this.spinner.hide();
        // }
      } else {
        this.toastr.error("Please select door/gate.", "Information");
      }
    }
  }

  isEmail(search: string): boolean {
    var serchfind: boolean;

    const regexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$");

    serchfind = regexp.test(search);

    console.log(serchfind);
    return serchfind;
  }

  /* Submit by user */
  SubmitByUser() {
    //this.spinner.show();
    this.isSaveFormDetails = true;
    if (this.activeTab == "tab1") {
      if (
        this.user.rolename == "Issuer" ||
        this.user.rolename == "StaffAdmin"
      ) {
        // if(this.cou.phone==""){
        //   var mailValid = this.isEmail(this.badgeholder.recpt_email_address);
        //   if(!mailValid){
        //     this.toastr.warning("Please enter valid email address.")
        //     return
        //   }
        // } else if (this.badgeholder.recpt_email_address != "" || this.badgeholder.recpt_email_address != null) {
        //   var mailValid = this.isEmail(this.badgeholder.recpt_email_address);
        //   if (!mailValid) {
        //     this.toastr.warning("Please enter valid email address.")
        //     return
        //   }
        // }

        if (this.CheckRequiredFields()) {
          this.toastr.error("Please enter required fields", "Alert");
          //this.spinner.hide();
          //return;
        } else {
          var couStatus1 = this.bindCouDetails();
          couStatus1.isSubmitted = true;
          couStatus1.CurrentCitationStatusId = CouStatus.Closed;
          couStatus1.Type = "COU";
          couStatus1.SecurityBadgeNo = this.badgeholder.badgeNumber;
          couStatus1.ViolatorFirstName = this.badgeholder.firstName;
          couStatus1.ViolatorLastName = this.badgeholder.lastName;
          // couStatus1.ViolatorBirthDate = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
          // couStatus1.ViolatorBirthDate = this.convertDate(this.badgeholder.dob);
          // couStatus1.ViolationDate = this.convertDate(this.cou.violationDate)
          couStatus1.Email = this.badgeholder.emailAddress;
          if (this.selectedDoorList.length > 0) {
            var company = this.allCompanyList.find(
              (x) =>
                x.companyName.toLowerCase().trim() ==
                this.badgeholder.company.toLowerCase().trim(),
            );
            if (company !== undefined) {
              couStatus1.CompanyId = company.id;
              if (couStatus1.CompanyId != 0 && couStatus1.CompanyId != null) {
                this.NovService.AddCitationDetails(
                  couStatus1,
                  this.files,
                  this.deletedFiles,
                  this.couImagesLst,
                  this.isSaveFormDetails,
                  this.correctiveAction,
                  this.remedialTrainings,
                  this.deletedeventIds,
                  this.inspectionId,
                  this.selectedDoorList,
                  this.selectedNovDoorList,
                  
                ).subscribe(
                  (response: CitationDetails) => {
                    this.loading = false;
                    this.resetIsDirtyFlag();
                    this.toastr.success(
                      "COU Information Submitted!",
                      "Information",
                    );
                    //this.spinner.hide();
                    // if (this.user.rolename === "Issuer") {

                    // }
                    this.router.navigate(["admin/nov"]);
                    // else {
                    //   this.cou.id = +response;
                    //   // this.setTabsandButtons();
                    //   this.GetCouDetailsById(+response,this.cou.companyId);
                    // }
                  },
                  (error: any) => {
                    this.toastr.error(
                      "COU Information not Submitted!",
                      "Information",
                    );
                    //this.spinner.hide();
                  },
                );
              } else {
                if (this.badgeholder.company !== null) {
                  this.toastr.error(
                    "You cannot submit COU information. The company " +
                      '"' +
                      this.badgeholder.company +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                    "Error",
                  );
                } else {
                  this.toastr.error(
                    "You cannot submit COU information. Company associated with badge# " +
                      '"' +
                      this.badgeholder.badgeNo +
                      '"' +
                      " is not defined in SEMS Application, please contact SBO.",
                    "Error",
                  );
                }
                //this.spinner.hide();
              }
            } else {
              if (this.badgeholder.company !== null) {
                this.toastr.error(
                  "You cannot submit COU information. The company " +
                    '"' +
                    this.badgeholder.company +
                    '"' +
                    " is not defined in SEMS Application, please contact SBO.",
                  "Error",
                );
              } else {
                this.toastr.error(
                  "You cannot submit COU information. Company associated with badge# " +
                    '"' +
                    this.badgeholder.badgeNo +
                    '"' +
                    " is not defined in SEMS Application, please contact SBO.",
                  "Error",
                );
              }
              //this.spinner.hide();
            }
          } else {
            this.toastr.error("Please select door/gate.", "Information");
          }
        }
      }
    }
  }

  CheckRequiredFields() {
    if (
      this.badgeholder.badgeNumber == undefined ||
      this.badgeholder.badgeNumber == "" ||
      this.cou.violationTypeId == 0 ||
      this.cou.violationTypeId == undefined ||
      this.cou.citationResonId == 0 ||
      this.cou.citationResonId == undefined
    ) {
      return true;
    } else {
      return false;
    }
  }

  setDirtyFlag() {
    this.isDirty = true;
  }

  public GetCouDetails() {
    // if (this.isDirty)
    // {
    //   var ans = confirm("You have unsaved changes. Are you sure you want to close?");
    //   if(ans == true)
    //   {
    //     this.router.navigate(["admin/nov"]);
    //   }
    // }
    // else
    // {
    //   this.router.navigate(["admin/nov"]);
    // }
    this.router.navigate(["admin/nov"]);
  }

  public GetCouDetailsById(couId: number, companyId: number) {
    //this.spinner.show();
    $("#dt1").DataTable().destroy();
    this.NovService.GetCitationDetailsById(couId, companyId).subscribe(
      (data: CitationDetails) => {
        this.cou = data as CitationDetails;
        this.dtTrigger.next();
        if (this.cou.iscctvAvailable == "False") {
          this.cou.iscctvAvailable = "0";
        }
        if (this.cou.iscctvAvailable == "True") {
          this.cou.iscctvAvailable = "1";
        }
        if (this.isClone == "1") {
          this.cou.issuedBy = this.user.name;
        }
        this.formatUserEmail();
        if (this.cou.isBadgeAutoFilled == true) {
          this.readonlyBadge = true;
        } else {
          this.readonlyBadge = false;
        }

        this.badgeholder.personUniqueId = this.cou.personUniqueId;
        //  this.badgeholder.badgeNo = this.cou.securityBadgeNo;
        this.badgeholder.badgeNumber = this.cou.securityBadgeNo;
        this.badgeholder.company = this.cou.companyName;
        this.badgeholder.firstName = this.cou.violatorFirstName;
        this.badgeholder.lastName = this.cou.violatorLastName;
        this.badgeholder.zipCode = this.cou.zip;
        // this.badgeholder.dob = this.datePipe.transform(this.cou.violatorBirthDate, 'MM/dd/yyyy');
        // this.badgeholder.dob = this.dateAdapter.toModel(this.fromModel(this.cou.violatorBirthDate));
        this.badgeholder.birthDate = this.dateAdapter.toModel(
          this.fromModel(this.cou.violatorBirthDate),
        );
        this.cou.violationDate = this.dateAdapter.toModel(
          this.fromModel(this.cou.violationDate),
        );
        this.badgeholder.emailAddress = this.cou.email;

        /* Filter FIles by User */
        this.couAttachmentsImg = data.citationAttachments.filter(
          (x) =>
            x.tabNo == "Tab1" &&
            (x.filePath.toLowerCase().split(".", 2)[1] == "png" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "jpg" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "jpeg" ||
              x.filePath.toLowerCase().split(".", 2)[1] == "gif"),
        );
        this.couAttachmentsFile = data.citationAttachments.filter(
          (x) =>
            x.tabNo == "Tab1" &&
            x.filePath.toLowerCase().split(".", 2)[1] != "png" &&
            x.filePath.toLowerCase().split(".", 2)[1] != "jpg" &&
            x.filePath.toLowerCase().split(".", 2)[1] != "jpeg" &&
            x.filePath.toLowerCase().split(".", 2)[1] != "gif",
        );

        //first fill citation reason dropdown by violation type
        this.GetCitationReasonListByViolation(data.violationTypeId);
        this.getSelectedDoors(couId);
        this.GetViolationTypeList();
        if(this.badgeholder.personUniqueId != null && this.badgeholder.personUniqueId != ""){
          this.GetCouRecordsList(null,this.badgeholder.personUniqueId);
        }else{
          this.GetCouRecordsList(this.badgeholder.badgeNumber,null);
        }
        //this.getSelectedDoorsforcouview(couId);
        this.formatUserEmail();
        if (this.cou.currentCitationStatusId == CouStatus.Closed) {
          this.cou.status = "Close";
        }

        var isClone: string =
          this.route.snapshot.pathFromRoot[1].queryParams["isClone"];
        if (isClone == "1") {
          this.clearCouBeforeClone();
          this.cou.currentStatus = "Draft";
        } else {
          if (this.cou.currentCitationStatusId == CouStatus.Draft) {
            if (this.user.rolename == "AuthSigner") {
              this.isViewCou = true;
              this.isViewAuthorizedSigner = true;
            } else {
              this.isStaffAdmin = false;
              this.isAuthsigner = false;
              this.isIssuer = true;
              this.isViewCou = false;
              this.isViewAuthorizedSigner = false;
            }
          } else {
            if (this.user.rolename == "StaffAdmin") {
              //this.isViewCitation = true;
              this.isViewCou = false;
              this.isViewAuthorizedSigner = true;
            } else if (this.user.rolename == "AuthSigner") {
              this.isViewCou = true;
              this.isViewAuthorizedSigner = true;
            } else {
              this.isViewCou = true;
              this.isViewAuthorizedSigner = false;
            }
          }
          //when tab1 is active
          if (
            this.cou.novNo != undefined &&
            this.cou.currentCitationStatusId == CouStatus.Draft &&
            this.user.rolename != "AuthSigner"
          ) {
            this.isSubmitShow = true;
          } else {
            this.isSubmitShow = false;
          }

          // Action for first tab
          if (this.signaturePad != undefined) {
            this.oldSign = this.cou.offenderSignature;
            this.signaturePad.fromDataURL(this.cou.offenderSignature);
          }
        }
        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        //this.toastr.error(`${error}`, "Error");
      },
    );
  }

  public GetViolationTypeList() {
    this.ViolationTypesService.GetViolationTypeList().subscribe(
      (response: ViolationTypes[]) => {
        this.unfilteredViolationTypes = response;
        const selectedId = this.cou?.violationTypeId;
      //   this.allViolationTypes = response;//.map(x => ({
      //   ...x,
      //   isDisabled: !x.status && x.id !== selectedId
      // }));
       // this.allViolationTypes = response.filter((x) => x.status === true);
   
      this.allViolationTypes = response.filter(x =>
        x.status === true || x.id === selectedId
      );

            
      this.activeViolationTypes = this.allViolationTypes.filter(x => x.status === true);
        var violationType = this.allViolationTypes.find(
          (x) =>
            x.violationType.toLowerCase().trim() ==
            "Counseling".toLowerCase().trim(),
        );
        this.cou.violationTypeId = violationType.id;
        this.fillCitationReason(this.cou.violationTypeId);
      },
      (error: any) => {
        console.log("error list");
      },
    );
  }

  public getSelectedDoors(couId) {
    this.NovService.GetSelectedDoors(couId).subscribe((data: Locations[]) => {
      this.selectedDoorList = [];

      this.selectedDoorList = data as Locations[];
    });
  }
  //Get Company List
  public GetCompanyList() {
    this.CompanyService.GetCompanyList().subscribe(
      (response: Company[]) => {
        this.allCompanyList = response;
      },
      (error: any) => {
        console.log("error list");
      },
    );
  }

  //Get Citation Reason List By Violation
  public GetCitationReasonListByViolation(violationTypeId: number) {
    this.CitationReasonsService.GetCitationReasonListByViolation(
      violationTypeId,
    ).subscribe(
      //(response: CitationReasons[]) => {
      //    this.allCitationReasonsList = response;
      //   const selectedId = this.cou?.citationResonId;
      //    this.allCitationReasonsList = response.map(x => ({
      //   ...x,
      //   isDisabled: !x.status && x.id !== selectedId
      // }));
      //  // this.allViolationTypes = response.filter((x) => x.status === true);
      //   this.activecitationReasonList = this.allCitationReasonsList.filter(x => x.status === true);

        //this.allCitationReasonsList = response;

        (response: any[]) => {

      const selectedId = this.cou?.citationResonId;

     
      this.allCitationReasonsList = response.filter(x =>
        x.status === true || x.id === selectedId
      );

        this.activecitationReasonList = this.allCitationReasonsList.filter(x => x.status === true);


      
      },
      (error: any) => {
        console.log("error list");
      },
    );
  }

  public GetCitationReasonListByViolationForPopup(violationTypeId: number) {
    this.CitationReasonsService.GetCitationReasonListByViolation(
      violationTypeId,
    ).subscribe(
      (response: CitationReasons[]) => {
        this.Filtered = response;
      },
      (error: any) => {
        console.log("error list");
      },
    );
  }

  public fillCitationReason(violationTypeId: number) {
    // this.cou.citationResonId = 0;
    this.GetCitationReasonListByViolation(violationTypeId);
  }

  //   ngAfterViewInit() {
  //     // this.signaturePad is now available
  //     //this.signaturePad.set('minWidth', 5);
  //     // if (sessionStorage.getItem("tab")) {
  //     //   this.ctdTabset.select(sessionStorage.getItem("tab"));
  //     //   this._cdRef.detectChanges();
  //     // }

  //     if (this.signaturePad != undefined)
  //       this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  // }

  drawComplete() {
    // console.log(this.signaturePad.toDataURL());
    this.isDirty = true;
  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    // console.log('begin drawing');
    // this.isDirty = true;
  }

  drawClear() {
    this.isDirty = true;
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }

  addFile(files) {
    if (files.length === 0) {
      return;
    }
    this.isDirty = true;
    for (let file of files) {
      var parts = file.name.split(".");
      if (parts.length <= 1) {
        this.toastr.error("File " + file.name + " is not valid file");
      } else {
        this.files.push(file);
      }
      //var fs = file.name.split('.').pop()
    }
    this.myInputVariable.nativeElement.value = "";
  }

  removeFile(file) {
    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;
      this.files.splice(this.files.indexOf(file), 1);
    }
  }

  deleteFile(file) {
    //var ans = confirm("Do you want to delete file '" + filetitle + "'?");
    var ans = confirm("Do you want to delete file ?");
    if (ans == true) {
      this.isDirty = true;
      //this.PandIDService.deleteFile(id, filid).subscribe((response: Response) => {
      //this.citation.citationAttachments.splice(this.citation.citationAttachments.indexOf[id], 1);

      this.cou.citationAttachments.splice(
        this.cou.citationAttachments.indexOf(file),
        1,
      );
      this.couAttachmentsImg = this.cou.citationAttachments.filter(
        (x) =>
          x.tabNo == "Tab1" &&
          (x.filePath.toLowerCase().split(".", 2)[1] == "png" ||
            x.filePath.toLowerCase().split(".", 2)[1] == "jpg" ||
            x.filePath.toLowerCase().split(".", 2)[1] == "jpeg" ||
            x.filePath.toLowerCase().split(".", 2)[1] == "gif"),
      );
      this.couAttachmentsFile = this.cou.citationAttachments.filter(
        (x) =>
          x.tabNo == "Tab1" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "png" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "jpg" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "jpeg" &&
          x.filePath.toLowerCase().split(".", 2)[1] != "gif",
      );

      //});
      this.deletedFiles.push(file.id);
    }
  }

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

  //Download file //Need to check it for error
  downloadFile(id: number, fileName: string) {
    this.NovService.getAttachment(id).subscribe(
      (data) => {
        this.toastr.success("File is Downloading....Please wait!!");
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
          "Error",
        );
      },
    );
  }

  //View File
  viewFile(id: number, fileName: string) {
    this.NovService.getAttachment(id).subscribe(
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
          "Error",
        );
      },
    );
  }

  // downloadFile(filename) {

  //   window.open(
  //     fileURL + filename,
  //     '_blank' // <- This is what makes it open in a new window.
  //   );
  // }

  removeImage(image) {
    this.webcamImageArr.splice(this.webcamImageArr.indexOf(image), 1);
  }

  getDateTrans(date) {
    return this.datePipe.transform(date, "MM/dd/yyyy HH:mm");
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      // DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  ngOnDestroy(): void {
    console.log("ngDestroy");
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  clearCouBeforeClone() {
    this.cou.id = 0;
    this.cou.novNo = 0;
    // this.allCitationReasonsList = [];
    // this.cou.violationTypeId = null;
    // this.cou.citationResonId = null;
    // this.cou.violationDate = "";
    // this.cou.opdPoliceReport = "";
    // this.cou.summaryOfViolation = "";
    this.cou.capturedImage = "";
    this.files = [];
    this.deletedFiles = [];
    this.couImagesLst = [];
    this.couAttachmentsImg = [];
    this.couAttachmentsFile = [];
    this.drawClear();
    this.cou.citationAttachments = [];
    this.isPendingForCompletion = false;
    //this.caseStatus = false;
    this.isViewAuthorizedSigner = false;
    this.cou.currentCitationStatusId = CouStatus.Draft;
    this.cou.violationDate = this.dateAdapter.toModel(
      this.ngbCalendar.getToday(),
    );
  }

  public GetLocationList() {
    //this.spinner.show();
    this.locationService.GetLocationList().subscribe(
      (response: Locations[]) => {
        this.allLocationList = response;
        // this.dtTrigger.next();
        //this.spinner.hide();
        /// this.buildDtOptions(response)
        this.dtTrigger.next();
        // this.processData();
      },
      (error: any) => {
        this.toastr.error("Error while fetching Locations", "Error");
        //this.spinner.hide();
      },
    );
  }

  public onDoorSelect(item: any) {
    this.isDirty = true;
    // this.selectedDoorGateNumber = this.selectedDoorList;
    // this.selectedDoorList.push(item);
    // this.selectedDoorNameList.push(item.location);

    // this.selectedDoorGateNumber.push(item);
  }

  public onDoorDeselect(item: any) {
    this.isDirty = true;
    // this.selectedDoorGateNumber = this.selectedDoorList;
    // this.selectedDoorList = this.selectedDoorList.filter(obj => obj.id !== item.id);
    // this.selectedDoorNameList = this.selectedDoorNameList.filter(obj => obj !== item.location);

    // this.selectedDoorGateNumber = this.selectedDoorGateNumber.filter(obj => obj.id !== item.id)
  }

  public onSelectAllDoors(item: any) {
    this.isDirty = true;
    // this.selectedDoorGateNumber = this.selectedDoorList;

    // this.selectedDoorGateNumber = [];
    // item.forEach(element => {
    //   this.selectedDoorGateNumber.push(element);
    // });
  }

  public onDeSelectAllDoors(item: any) {
    this.isDirty = true;
    this.selectedDoorList = [];
    // this.selectedDoorGateNumber = []
  }

  public close() {
    if (this.cou.id == undefined) {
      let sign1 = this.signaturePad.isEmpty();
      if (!sign1) {
        this.isDirty = true;
      }
    } else {
      if (this.oldSign != this.signaturePad.toDataURL()) {
        this.isDirty = true;
      }
    }
  }

  formatUserEmail() {
    if (
      (this.badgeholder.recpt_email_address == "" ||
        this.badgeholder.recpt_email_address == null) &&
      (this.cou.phone == "" || this.cou.phone == undefined)
    ) {
      this.smsSend = "true";
      this.emailSend = "true";
    } else if (
      (this.badgeholder.recpt_email_address != "" ||
        this.badgeholder.recpt_email_address != null) &&
      this.cou.phone == ""
    ) {
      this.smsSend = "false";
      this.emailSend = "true";
    } else if (
      (this.badgeholder.recpt_email_address == "" ||
        this.badgeholder.recpt_email_address == null) &&
      this.cou.phone != ""
    ) {
      this.smsSend = "true";
      this.emailSend = "false";
    } else if (
      this.badgeholder.recpt_email_address != "" &&
      this.cou.phone != ""
    ) {
      this.smsSend = "true";
      this.emailSend = "true";
    } else {
      this.smsSend = "false";
      this.emailSend = "true";
    }
  }

  checkPhoneRequired() {
    if (
      (this.badgeholder.recpt_email_address == "" ||
        this.badgeholder.recpt_email_address == null) &&
      (this.cou.phone == "" || this.cou.phone == undefined)
    ) {
      this.smsSend = "true";
      this.emailSend = "true";
    } else if (
      (this.badgeholder.recpt_email_address != "" ||
        this.badgeholder.recpt_email_address == null) &&
      this.cou.phone == ""
    ) {
      this.smsSend = "false";
      this.emailSend = "true";
    } else if (
      (this.badgeholder.recpt_email_address != "" ||
        this.badgeholder.recpt_email_address == null) &&
      this.cou.phone != ""
    ) {
      this.smsSend = "true";
      this.emailSend = "true";
    } else {
      this.smsSend = "true";
      this.emailSend = "false";
    }
  }

  showcou(id) {
    //this.GetCouDetailsById(id, 0);
    this.modalService.open(this.opdAlert, { size: "lg" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  // ---------------------------------------- new table with popup code ----------------
  getViolationTypeName(id: number): string {
    const type = this.unfilteredViolationTypes.find((x) => x.id === id);
    return type ? type.violationType : "-";
  }

  getCitaionReasonName(id: number): string {
    //console.log(this.Filtered);
    const type = this.Filtered.find((x) => x.id === id);
    return type ? type.reason : "-";
  }

  // loadViolationTypes() {
  //   this.violationTypesListForScreens = [
  //     { id: 101512, violationType: 'Airport test', reason:'Failed', dateTemp:"2025-04-19T07:50:52.877" },
  //     { id: 101216, violationType: 'Accidental', reason:'Damage of component' , dateTemp:"2025-12-09T09:50:52.331"},
  //     { id: 101009, violationType: 'Airport Test', reason:'please check again' , dateTemp:"2025-12-10T08:30:52.500"}
  //   ];
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  public getSelectedDoorsforcouview(couId) {
    this.NovService.GetSelectedDoors(couId).subscribe((data: Locations[]) => {
      this.selectedDoorGateNumber = [];
      this.selectedDoorGateNumber = data as Locations[];
      this.selectedDoorGateNumber.forEach((element) => {
        this.selectedDoorNames =
          this.selectedDoorNames + ", " + element.location;
      });
      if (this.selectedDoorNames.charAt(0) == ",") {
        this.selectedDoorNames = this.selectedDoorNames.substring(1);
      }
    });
  }
}
