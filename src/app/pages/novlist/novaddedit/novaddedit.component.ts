import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, ViewContainerRef, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { NovService } from '../nov.service';
import { CitationDetails, CitationAttachments, CitationEvents, CitationStateMaster, PaymentMethod, recentCitationMaster } from '../CitationDetails';
import { ViolationTypes } from '../../master/violationtypes';
import { Company } from '../../master/company';
import { CitationReasons } from '../../master/citationreasons';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { CorrectiveActions, CorrectiveActionsTrainings } from '../correctiveactions';
import { DatePipe } from '@angular/common';
import { ViolationTypesService } from '../../master/violationtypes/violationtype.service'
import { CompanyService } from '../../master/company/company.service'
import { CitationReasonsService } from '../../master/CitationReasons/citationreasons.service'
import { SignaturePad } from 'angular2-signaturepad';
import { NgbCalendar, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbNav } from '@ng-bootstrap/ng-bootstrap';
// import {TabsModule} from 'ngx-tabset';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { RemedialTrainingService } from '../../master/remedialtraining/remedialtraining.service';
import { RemedialTraining } from '../../master/remedialtraining';
import { EventTypes } from '../../master/eventtypes';
import { EventTypesService } from '../../master/eventtypes/eventtype.service';
// import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import { DataTableDirective } from 'angular-datatables';
import { InspetionRecordDetail } from '../../inspectionrecord/inspectionrecord.model';
import { InspectionrecordService } from '../../inspectionrecord/inspectionrecord.service';
import { Badgeholder } from '../badgeholder';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalDismissReasons, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Locations, LocationsList } from '../../master/locations';
import { CaseStatus } from '@app/app.component';
import { FormCanDeactivate } from '@app/_helpers/form-can-deactivate/form-can-deactivate';
import { IncidentStatesMaster } from '@app/pages/incidentreport/incidentreport.model';
import { LocationService } from '@app/pages/master/location/location.service';
import { AppConfigService } from '@app/_services/appconfigservice ';



@Component({
  selector: 'app-novaddedit',
  templateUrl: './novaddedit.component.html',
  styleUrls: ['./novaddedit.component.scss']
})
export class NovaddeditComponent extends FormCanDeactivate implements OnInit {
  public windowRef: Window;
  @ViewChild('formData', { static: false })
  // private ctdTabset: NgbTabset;
  // @ViewChild('ctdTabset', { static: false })
  form: NgForm;
  public activeTab = "tab1";
  time = { hour: 13, minute: 30 };
  meridian = false;
  enableEdit = false;
  enableEditIndex = null;
  dtOptions: any = {};
  isDesc: boolean = false;
  oldSign: string = ""
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  @ViewChild(SignaturePad, { static: false }) public signaturePad: SignaturePad;
  dtElement: DataTableDirective;
  dtInstance = {}//: Promise<DataTables.Api>;
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 1,
    'canvasHeight': 150,
    'canvasWidth': 300,
  };


  strCommentAuth: string = "";
  readOnlyNov: boolean = false;
  isCollapsed = false;
  loading = false;
  isNovExists: boolean = false;
  isStaffAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isIssuer: boolean = true;
  isViewCitation: boolean = false;
  isViewCorrectiveActions: boolean = false;
  isViewAuthorizedSigner: boolean = false;
  citation: CitationDetails = new CitationDetails();
  citationId: number = 0;
  companyId: number = 0;

  personUniqueId: string="hello"
  correctiveAction: CorrectiveActions = new CorrectiveActions();
  citationList: CitationDetails[];
  eventsModel = new CitationEvents();
  deletedeventIds: number[] = [];
  eventTypeList: EventTypes[] = [];
  //eventList:CitationEvents[]=[];
  allViolationTypes: ViolationTypes[];
  activeViolationTypes: ViolationTypes[];
  allCompanyList: Company[];
  allCitationReasonsList: CitationReasons[] = [];
  activecitationReasonList: CitationReasons[] = [];
  UnfilteredViolationTypes: ViolationTypes[] = [];
  citationEvents: CitationEvents[] = [];
  files: string[] = [];
  filesauthsigner: string[] = [];
  CitationImagesLst: string[] = [];
  deletedFiles: string[] = [];
  webCameraImage: string;
  // mvopPermitNo: string = "";
  user: any;
  isPendingForCompletion: boolean = false;
  isSaveTab2: boolean = true;
  // caseStatus: boolean = false;
  // toggle webcam on/off
  remedialTraining: RemedialTraining[];
  stateList: CitationStateMaster[];
  incidentStatList: IncidentStatesMaster[];

  public citationAttachmentsissuersImg: CitationAttachments[] = [];
  public citationAttachmentsissuersFile: CitationAttachments[] = [];

  public citationAttachmentsStaffadminImg: CitationAttachments[] = [];
  public citationAttachmentsStaffadminFile: CitationAttachments[] = [];

  public citationAttachmentsAuthsignerImg: CitationAttachments[] = [];
  public citationAttachmentsAuthsignerFile: CitationAttachments[] = [];
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
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  submitted: boolean = false;
  isSubmitShow: boolean = true;
  saveTab2Details: boolean = false;
  isTab2Visible: boolean = false;
  isSaveFormDetails: boolean = false;
  //public citationCaseStatus: string = "0";
  remedialTrainings: Array<CorrectiveActionsTrainings> = [];
  // deletedTrainings: Array<CorrectiveActionsTrainings> = [];
  deletedTrainings: String = "";
  isClone: String = "";
  newDynamic: CorrectiveActionsTrainings = new CorrectiveActionsTrainings();
  sortDir = 1;//1= 'ASE' -1= DSC
  staffAdminComment = ""
  staffAdminCommentIssuer = "";

  inspectioninfo: InspetionRecordDetail = new InspetionRecordDetail();
  inspectionId: number = 0;
  badgeholder: Badgeholder = new Badgeholder();
  readonlyBadge: boolean = false;
  isCompany: boolean = false;
  inspectionNOVNumber: number = 0;

  allLocationList: LocationsList[] = [];
  selectedNovDoorList: Locations[] = [];
  doorDropdownSettings: {}
  // modalRef?: BsModalRef;
  @ViewChild("template") modalContent: TemplateRef<any>;
  @ViewChild("prohibitedtemplate") prohibitedmodalContent: TemplateRef<any>
  modalRef!: NgbModalRef;
  modalOptions: NgbModalOptions;
  selectedDoorList: Locations[];
  closeResult: string;
  readonly DELIMITER = '/';
  time1 = { hour: 13, minute: 30 };
  key: String;
  smsSend: string = 'true';
  emailSend: string = 'true';
  CIT_type = "NOV"

  public fineMsg: string;
  showpaymentoption: boolean = false;
  paymentMethod: PaymentMethod[] = [];
  ascxuser: boolean = false;

  FAA = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ]
  TSA = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ]

  findingOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];

  caseStatusValue = [
    { label: "Closed", value: "Close" },
    { label: "Return to AS", value: "ReturnedToAS" }
  ]

  caseStatusValue1 = [
    { label: "Return to Issuer", value: "ReturnedToIssuer" },
    { label: "Assigned", value: "Assigned" }
  ]

  isProhibitedAudit: string
  prohibitedCompany: number
  prohibitedauditId: number
  isCitationEdit:string
  showPopup = false;
  couCount: number = 0;
  novCount: number = 0;
  pastCou: recentCitationMaster[] = [];
  dtOptionsPastCou: {};
  dataLoaded: boolean = false;
  callCount = 0;
  unfilteredViolationTypes: ViolationTypes[];
  Filtered: CitationReasons[];
  CitationReasonsFromDb: CitationReasons[];
  State = [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "DC", label: "District Of Columbia" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PA", label: "Pennsylvania" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" }
  ]
  constructor(private router: Router,
    private route: ActivatedRoute,
    private NovService: NovService,
    private datePipe: DatePipe,
    private ViolationTypesService: ViolationTypesService,
    private CompanyService: CompanyService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private CitationReasonsService: CitationReasonsService,
    private _cdRef: ChangeDetectorRef,
    private eventTypesService: EventTypesService,
    private remedialTrainingService: RemedialTrainingService,
    private inspservice: InspectionrecordService,
    // private modalService: BsModalService,
    private modalService: NgbModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private dateParserFormatter: NgbDateParserFormatter,
    private locationService: LocationService,
    public datepipe: DatePipe,
    private appURL: AppConfigService,

  ) {
    super()
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }

  }

  ngOnInit() {
    this.windowRef = window;
    this.correctiveAction.notifyAuth = false;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [[1, 'desc']],
      columnDefs: [
        { targets: 1, type: 'date' }
      ]
      // retrieve: true,

      // new update code to load badge number
      
    };
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta') {
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }
    this.eventsModel.userId = this.user.id;
    this.eventsModel.userName = this.user.name;
    this.eventsModel.eventDetails = "";
    this.eventsModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    // this.eventsModel.eventTime = "00:00";
    this.eventsModel.eventTimeObj = { hour: new Date().getHours(), minute: new Date().getHours() };


    this.isDirty = false;
    //Get Violation type list
    this.GetViolationTypeList();

    this.GetPaymentTypeList();
    //Get Remedial Trainig 
    this.GetRemedialTrainingList();

    //Get Company list
    this.GetCompanyList();

    //Get EventType List
    this.GetEventTypeList();

    //Get state list
    this.GetStateList();

    //Get Citationreason list
    this.GetCitationReasonList();

    this.GetLocationList();
    //Set default active tab
    sessionStorage.setItem('tab', this.activeTab);

    //Set Violtion default date
    // this.citation.violationDate = this.datePipe.transform(new Date(), 'MM/dd/yyyy');
    this.citation.violationDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    this.citation.violationTime = this.datePipe.transform((new Date), 'HH:mm');
    //Web cam setting 
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });

    //Set tab buttons
    this.setTabsandButtons();
    //Get Data from routes
    var isEdit: string = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    var isClone: string = this.route.snapshot.pathFromRoot[1].queryParams['isClone'];
    this.inspectionId = this.route.snapshot.pathFromRoot[1].queryParams['inspectionId'];
    this.inspectionNOVNumber = this.route.snapshot.pathFromRoot[1].queryParams['inspectionNOVNumber']

    this.isProhibitedAudit = this.route.snapshot.pathFromRoot[1].queryParams['isProhibitedAudit'];
    this.prohibitedCompany = +this.route.snapshot.pathFromRoot[1].queryParams['companyId'];
    this.prohibitedauditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    if (this.isProhibitedAudit == 'true' && this.prohibitedCompany != 0) {
      this.citation.isProhibitedCitation = true
      this.citation.auditCompanyId = this.prohibitedCompany
      this.citation.companyId = this.citation.auditCompanyId
      this.citation.prohibitedAuditId = this.prohibitedauditId
    }
    // this.citation.novNo = this.inspectionNOVNumber

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

    this.isClone = isClone;
    if (isEdit == "1") {
      this.isCitationEdit = "1"
      if (isClone != '1') {
        this.readOnlyNov = true;
        console.log('Here1');
      }
      else {
        this.citation.issuedBy = this.user.name;
        console.log('Here2');
      }
      var citationId: number = this.route.snapshot.pathFromRoot[1].queryParams['citationId'];
      var companyId = (this.user.rolename == "AuthSigner" ? this.user.companyId : 0);
      this.companyId = companyId;
      this.citationId = citationId;
      //Get Citatiom details by id, company id
      this.GetCitationDetailsById(citationId, companyId);
      
    }
    else {
      
      this.isCitationEdit = "0"
      
      //Assign Issued by in ADD
      this.citation.issuedBy = this.user.name;
      this.isTab2Visible = false;
      this.isViewCitation = false;
      this.isViewCorrectiveActions = false;
      this.isViewAuthorizedSigner = false;
      if (this.inspectionId !== undefined) {
        if (+this.inspectionId > 0) {
          this.GetInspectionDetailsById(this.inspectionId, 0);
          // this.readonlyBadge = true
          // this.isCompany = true
        }
      }
      else {
        this.inspectionId = 0;
      }
    }

    var date1 = new Date().toISOString();
    var date2 = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss.SSS')
    var date3 = new Date()

    var date4 = (new Date().getTime() / 1000); //for seconds
    var date5 = new Date().getTime();  //for milliseconds
    this.key = this.CIT_type + this.user.id + date5;
    this.citation.countryCode = "+1"

    this.doorDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'location',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

     this.route.queryParams.subscribe(params => {
    const badgeNo = params['badgeNo'];

    if (badgeNo) {
      this.badgeholder.badgeNumber = badgeNo;

  
      this.GetBadgeholderInfoASCX();
    }
  });
  }

  public GetLocationList() {
    //this.spinner.show();
    this.locationService.GetLocationList().subscribe((response: LocationsList[]) => {
      this.allLocationList = response;
      // this.dtTrigger.next();
      //this.spinner.hide();
      /// this.buildDtOptions(response)      
      this.dtTrigger.next();
      // this.processData();
    },
      (error: any) => {
        this.toastr.error('Error while fetching Locations', 'Error');
        //this.spinner.hide();
      });
  }
  convertDate(date): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }

  openModal(template: TemplateRef<any>) {

    this.modalService.open(template, this.modalOptions).result.then((result) => {
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

  GetFormattedDate(badgeHolderDOB) {
    var todayTime = new Date(badgeHolderDOB);
    var month = todayTime.getMonth() + 1;
    var day = todayTime.getDate();
    var year = todayTime.getFullYear();
    return month + "/" + day + "/" + year;
  }

  public GetInspectionDetailsById(inspectionId: number, companyId: number) {
    //this.spinner.show();
    //$('#dt1').DataTable().destroy();
    this.inspservice.GetInspectionDetailsById(inspectionId, companyId)
      .subscribe(
        (data: InspetionRecordDetail) => {
          this.inspectioninfo = data as InspetionRecordDetail;
        }, (error: any) => {
          //this.spinner.hide();
          this.toastr.error(`${error}`, "Error");
        });
  }
  public GetRemedialTrainingList() {
    //this.spinner.show();
    this.remedialTrainingService.GetRemedialTrainingList().subscribe((response: RemedialTraining[]) => {
      this.remedialTraining = response;
    });
  }
  setTabsandButtons() {
    if (this.user.rolename == "Issuer") {
      this.isStaffAdmin = false;
      this.isSuperAdmin = false;
      this.isAuthsigner = false;
      this.isIssuer = true;
      this.isViewCitation = false;
      this.isViewCorrectiveActions = false;
      this.isViewAuthorizedSigner = false;
    }
    else if (this.user.rolename == "StaffAdmin" || this.user.rolename == "Superadmin") {
      this.isStaffAdmin = true;
      this.isSuperAdmin = true;
      this.isAuthsigner = false;
      this.isIssuer = false;
      this.isViewCitation = false;
      this.isViewCorrectiveActions = false;
      this.isViewAuthorizedSigner = false;
      this.isTab2Visible = true;
    }
    else if (this.user.rolename == "AuthSigner") {
      this.isStaffAdmin = false;
      this.isSuperAdmin = false;
      this.isAuthsigner = true;
      this.isIssuer = false;
      this.isViewCitation = true;
      this.isViewCorrectiveActions = true;
      this.isViewAuthorizedSigner = true;
      this.isTab2Visible = true;
    }

  }

  addRow(index) {
    this.newDynamic = new CorrectiveActionsTrainings();
    this.newDynamic.correctiveActionId = this.correctiveAction.id;
    this.newDynamic.userId = this.user.id;
    this.remedialTrainings.push(this.newDynamic);

    return true;
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
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
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

  //Bind Citation Details
  bindCitationDetails() {

     

    if (this.webcamImageArr != null) {
      this.webcamImageArr.forEach(element => {
        this.CitationImagesLst.push(element.imageAsDataUrl);
      });
      //this.citation.capturedImage = this.webcamImage.imageAsDataUrl;


    }
    var citationDetails = {
      Id: this.citation.id,
      NovNo: this.citation.novNo,
      ViolatorFirstName: this.citation.violatorFirstName,
      ViolatorLastName: this.citation.violatorLastName,
      ViolatorBirthDate: this.dateAdapter.toModel(this.fromModel(this.badgeholder.birthDate)),
      ViolationDate: this.dateAdapter.toModel(this.fromModel(this.citation.violationDate)),
      ViolationTime: this.onTimeChange(this.citation.violationTime),
      ViolationTypeId: this.citation.violationTypeId,
      OPDPoliceReport: this.citation.opdPoliceReport,
      CitationResonId: this.citation.citationResonId,
      isCompanyCitation: this.citation.isCompanyCitation,
      SummaryOfViolation: this.citation.summaryOfViolation,
      Address: this.citation.address,
      City: this.citation.city,
      State: this.citation.state,
      Zip: this.citation.zip,
      DriversLicenseNo: this.citation.driversLicenseNo,
      LicenseState: this.citation.licenseState,
      SecurityBadgeNo: this.citation.securityBadgeNo,
      CompanyId: this.citation.companyId,
      MVOPPermitNo: this.citation.mvopPermitNo,
      VehicleLicenseNo: this.citation.vehicleLicenseNo,
      VehicleState: this.citation.vehicleState,
      VehicleYear: this.citation.vehicleYear,
      VehicleMakeModel: this.citation.vehicleMakeModel,
      WitnessName: this.citation.witnessName,
      WitnessBadgeNo: this.citation.witnessBadgeNo,
      NOVNotes: this.citation.novNotes,
      OffenderSignature: this.signaturePad.toDataURL(),
      CapturedImage: this.citation.capturedImage, //this.webCameraImage,
      CurrentCitationStatusId: CaseStatus.Open,
      UserId: this.user.id,
      isSubmitted: false,
      isBadgeConfiscated: this.citation.isBadgeConfiscated,
      IssuedBy: this.citation.issuedBy,
      EventList: this.citation.eventList,
      EventEdited: this.citation.eventEdited,
      Type: this.citation.type,
      Email: this.citation.email,
      Phone: this.citation.phone,
      CountryCode: this.citation.countryCode,
      KeyValue: this.key,
      CreatedDate: this.dateAdapter.toModel(this.ngbCalendar.getToday()),
      UpdatedDate: this.dateAdapter.toModel(this.ngbCalendar.getToday()),
      IscctvAvailable: this.citation.iscctvAvailable,
      IsBadgeAutoFilled: this.citation.isBadgeAutoFilled,
      IsProhibitedCitation: this.citation.isProhibitedCitation,
      ProhibitedAuditId: this.citation.prohibitedAuditId,
      personUniqueId: this.citation.personUniqueId
    }

    return citationDetails;
  }

  formatUserPhoneNumber() {
    if (this.citation.phone != null) {
      let valLength = this.citation.phone.length;
      if (valLength == 1) {
        this.citation.phone = "(" + this.citation.phone;
      }
      if (valLength == 4) {
        this.citation.phone = this.citation.phone + ") ";
      }
      if (valLength == 9) {
        this.citation.phone = this.citation.phone + "-";
      }

    }
  }

  myFunction() {
    let text;
    if (confirm("Press a button!") == true) {
      text = "You pressed OK!";
    } else {
      text = "You canceled!";
    }
    document.getElementById("demo").innerHTML = text;
  }

  showInfo(iscctvavailabe) {
    if (iscctvavailabe == "1") {
      var msg = "Provide camera numbers and archive status using Chronology of INV (CCTV Review).";

      if (confirm(msg)) {
        var test = ''
      }
    }


  }
  //Bind Corrective Actions Details
  bindCorrectiveAction() {
    var correctiveActions = {
      Id: this.correctiveAction.id,
      CitationId: this.citation.id,

      BadgeSuspendedDate: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate)),

      RemedialTrainingAssignedDate: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate)),

      RemedialTrainingCompletionDate: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate)),

      BadgeDeactivatedDate: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate)),
      AdditionalNotes: this.correctiveAction.additionalNotes,
      FAA: this.correctiveAction.faa,
      TSA: this.correctiveAction.tsa,
      Eligible: Number(this.correctiveAction.eligible),
      // DateOfDisclosure: this.datePipe.transform(this.correctiveAction.dateOfDisclosure, 'MM/dd/yyyy'),
      DateOfDisclosure: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure)),
      CurrentCitationStatusId: CaseStatus.InProcess,
      UserId: this.user.id,
      isSubmitted: false,
      BadgeRevoked: this.correctiveAction.badgeRevoked,
      AdminFine: this.correctiveAction.adminFine,
      OtherTraining: this.correctiveAction.otherTraining,
      remedialTrainingId: this.correctiveAction.remedialTrainingId,
      staffAdminComment: this.correctiveAction.staffAdminComment,
      staffAdminCommentIssuer: this.correctiveAction.staffAdminCommentIssuer,
      FineAmount: this.correctiveAction.fineAmount,
      FinePaid: this.correctiveAction.finePaid,
      PaymentMethod: this.correctiveAction.paymentMethod
    }

    return correctiveActions;
  }

  //Check if NOV exits
  CheckNovExists() {
    if (!this.readOnlyNov) {
      let novid = this.citation.novNo === undefined ? 0 : this.citation.novNo;
      this.NovService.CheckNovExists(novid).subscribe((response) => {
        if (response) {
          this.isNovExists = true;
          this.toastr.error('Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.', 'Information');
          this.citation.novNo = 0;
        }
        else {
          this.isNovExists = false;

        }
      }, (error: any) => {
        this.toastr.error('Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.', 'Information');
        //this.spinner.hide();
      });

    }


  }

  resetIsDirtyFlag() {
    this.isDirty = false;
  }

  formValid() {
    if (this.citation.companyId === 0 && this.citation.violatorFirstName.trim() === "" && this.citation.violatorLastName.trim() === "" && this.citation.violationTypeId === 0 && this.citation.isCompanyCitation === false && this.citation.violatorBirthDate === "") {
      return false
    }
    else {
      return true
    }
  }

  //Save Citaion by Issuer
  saveCitationByIssuer(formData: NgForm) {
    // console.log(formData.value)
    //this.spinner.show();
    if (this.isNovExists) {
      this.citation.novNo = undefined;
      this.toastr.error('Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.', 'Information');
      //this.spinner.hide();
    }
    else {
      var citationDetails = this.bindCitationDetails();
      //This is done as 
      if (citationDetails.Id > 0) {
        this.correctiveAction.eligible = Number(this.correctiveAction.eligible);
      }
      //Save Citation
      this.submitted = true;
      // stop here if form is invalid
      if (formData.invalid) {
        return;
      }
      this.isSaveFormDetails = true;
      this.loading = true;

      if (this.citation.currentCitationStatusId != undefined) {
        citationDetails.CurrentCitationStatusId = this.citation.currentCitationStatusId;
      }
      else
        citationDetails.CurrentCitationStatusId = CaseStatus.Open;


      if (this.inspectionId == undefined) {
        this.inspectionId = 0;
      }
      this.validateAndAddEventRecord(0)
      citationDetails.Type = "NOV"
      // citationDetails.SecurityBadgeNo = this.badgeholder.badgeNo;
      citationDetails.SecurityBadgeNo = this.badgeholder.badgeNumber;
      citationDetails.ViolatorFirstName = this.badgeholder.firstName;
      citationDetails.ViolatorLastName = this.badgeholder.lastName;
      //citationDetails.Email = this.badgeholder.recpt_email_address;
      citationDetails.Email = this.badgeholder.emailAddress;
      //citationDetails.Address = this.badgeholder.address;
      citationDetails.Address = this.badgeholder.streetAddress;
      citationDetails.City = this.badgeholder.city;
      citationDetails.State = this.badgeholder.state;
      citationDetails.Zip = this.badgeholder.zip;
      citationDetails.DriversLicenseNo = this.badgeholder.driversLicenseNo;
      //citationDetails.LicenseState = this.badgeholder.licenseState;

      var isClone: string = this.route.snapshot.pathFromRoot[1].queryParams['isClone'];
      if (isClone == "1") {
        this.clearViolationBeforeClone();
      }
      if (citationDetails.CompanyId != undefined && citationDetails.CompanyId != null) {
        this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate))
        this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate))
        this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate))
        this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate))
        this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure))
        this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate))
        this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate))

        this.NovService.AddCitationDetails(citationDetails, this.files, this.deletedFiles, this.CitationImagesLst,
          this.isSaveFormDetails, this.correctiveAction, this.remedialTrainings, this.deletedeventIds, this.inspectionId, this.selectedDoorList, this.selectedNovDoorList).subscribe((response: CitationDetails) => {
            this.loading = false;

            this.toastr.success('Citation Information saved!!', 'Information');
            //this.spinner.hide();
            this.files = [];
            this.readOnlyNov = true;
            this.resetIsDirtyFlag();
            //if (this.user.rolename != "Issuer")  
            if (+this.inspectionId == 0) {
              this.router.navigate(["/admin/dashboard"]).then(() => {
                this.router.navigate(['/admin/nov/details'], {
                  queryParams: {
                    citationId: response,
                    isEdit: 1,
                    isClone: 0
                  }
                });
              });
            }
            else {
              if (this.inspectionId > 0) {
                $("#btnModal").click();

              }
              else {
                this.router.navigate(["/admin/dashboard"]).then(() => {
                  this.router.navigate(['/admin/nov/details'], {
                    queryParams: {
                      citationId: response,
                      isEdit: 1,
                      isClone: 0
                    }
                  });
                });
              }

            }
          }
            , (error: any) => {
              this.toastr.error('Citation Information not saved!', 'Information');
              //this.spinner.hide();
            });
      }
      else {
        //this.spinner.hide();
        this.isCompany = true
        this.citation.companyId = null;
        if (this.badgeholder.company !== null) {
          this.toastr.error("You cannot save Citation information. The company " + '"' + this.badgeholder.company + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
        }
        else {
          this.toastr.error("You cannot save Citation information. Company associated with badge# " + '"' + this.badgeholder.badgeNo + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
        }
      }
    }
  }

  goToInspection() {
    this.router.navigate(['/admin/inspection/details'], {
      queryParams: {
        citationId: this.citationId,
        inspectionId: this.inspectionId
      }
    });


    // this.modalRef.hide()
  }

  ProhibitedAuditpage(auditid) {
    this.router.navigate(['/admin/concessionssecurity'], {
        queryParams: {
          dailyAuditId: auditid
          
        },
        skipLocationChange: true,
      });
  }
  goToProhibitedAudit() {
    this.modalRef = this.modalService.open(this.prohibitedmodalContent);

  }

  goToNOV() {
    this.router.navigate(['admin/nov']);
    // this.modalRef.hide()
  }
  //Save by staff admin
  saveCitationByStaffAdmin(formData: NgForm) {
    //this.spinner.show();
    if (this.isNovExists) {
      this.citation.novNo = undefined;
      this.toastr.error('Please try again! Either this NOV# already exists Or Try entering NOV# between 1 and 100000.', 'Information');
      //this.spinner.hide();
      return;
    }
    // stop here if form is invalid
    if (formData.invalid) {
      //this.spinner.hide();
      this.toastr.error('Please try again!', 'Information');
      return;
    }

    this.loading = true;
    this.isSaveFormDetails = true;
    var correctiveActions = this.bindCorrectiveAction();
    if (correctiveActions.AdminFine != true) {
      correctiveActions.PaymentMethod = 0
      correctiveActions.FineAmount = ''
      correctiveActions.FinePaid = false
    }
    if (this.correctiveAction.currentCitationStatusId != undefined) {
      correctiveActions.CurrentCitationStatusId = this.correctiveAction.currentCitationStatusId;
    }
    else
      correctiveActions.CurrentCitationStatusId = CaseStatus.Submitted;

    let today = new Date();

    if (this.correctiveAction.notifyAuth) {
      if (this.strCommentAuth.trim() != "") {
        if (this.correctiveAction.staffAdminComment == null)
          this.correctiveAction.staffAdminComment = ""
        correctiveActions.staffAdminComment = today.toLocaleDateString() + ": " + this.strCommentAuth + "<br>" + this.correctiveAction.staffAdminComment + "<br>";
      }
    }
    this.citation.violationDate = this.dateAdapter.toModel(this.fromModel(this.citation.violationDate))
    this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate))
    this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate))
    this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate))
    this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate))
    this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure))
    this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate))
    this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate))
    this.NovService.AddCorrectiveActions(correctiveActions, this.files, this.deletedFiles, this.remedialTrainings,
      this.deletedTrainings.trim(), this.isSaveFormDetails, this.citation, this.correctiveAction.notifyAuth).subscribe((response: CorrectiveActions) => {
        this.loading = false;
        this.toastr.success('Corrective Actions saved!', 'Information');
        var companyId = (this.user.rolename == "AuthSigner" ? this.user.companyId : 0);
        this.GetCitationDetailsById(correctiveActions.CitationId, companyId);
        this.GetCorrectiveActionByCitationId(correctiveActions.CitationId);
        this.files = [];
        this.deletedFiles = [];
        this.saveTab2Details = true;
        this.isSubmitShow = true;
        this.resetIsDirtyFlag();
        //this.spinner.hide();

        // this.router.navigateByUrl('admin/nov');
        this.setTabsandButtons();
        //this.correctiveAction.id = +response;
        this.GetCitationDetailsById(correctiveActions.CitationId, this.citation.companyId);
      }
        , (error: any) => {
          this.toastr.error('Corrective Actions not saved!', 'Information');
          //this.spinner.hide();
        });

  }
  isEmail(search: string): boolean {
    var serchfind: boolean;

    const regexp = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');

    serchfind = regexp.test(search);

    console.log(serchfind)
    return serchfind
  }

  /* Submit by user */
  SubmitByUser() {
    //this.spinner.show();
    this.isSaveFormDetails = true;
    if (this.activeTab == "tab1") {
      if (this.user.rolename == "Issuer" || this.user.rolename == "StaffAdmin") {
        // this.citation.securityBadgeNo = this.badgeholder.badgeNo;
        this.citation.securityBadgeNo = this.badgeholder.badgeNumber;
        this.citation.violatorFirstName = this.badgeholder.firstName;
        this.citation.violatorLastName = this.badgeholder.lastName;
        // this.citation.violatorBirthDate = this.convertDate(this.badgeholder.dob);     
        this.citation.violatorBirthDate = this.convertDate(this.badgeholder.birthDate);
        // this.citation.email = this.badgeholder.recpt_email_address;
        this.citation.email = this.badgeholder.emailAddress;
        // this.citation.address = this.badgeholder.address;
        this.citation.address = this.badgeholder.streetAddress;
        this.citation.city = this.badgeholder.city;
        this.citation.state = this.badgeholder.state;
        this.citation.zip = this.badgeholder.zip;
        this.citation.driversLicenseNo = this.badgeholder.driversLicenseNo;
       // this.citation.licenseState = this.badgeholder.licenseState;
        if (this.CheckRequiredFields()) {
          this.toastr.error('Please enter required fields', 'Alert');
          //this.spinner.hide();
          //return;
        }
        else {
          var citationStatus = this.bindCitationDetails();
          citationStatus.isSubmitted = true;
          citationStatus.CurrentCitationStatusId = CaseStatus.Submitted;
          citationStatus.Type = "NOV";
          //citationStatus.SecurityBadgeNo = this.badgeholder.badgeNo;
          this.citation.securityBadgeNo = this.badgeholder.badgeNumber;
          citationStatus.ViolatorFirstName = this.badgeholder.firstName;
          citationStatus.ViolatorLastName = this.badgeholder.lastName;
          //citationStatus.Address = this.badgeholder.address
          this.citation.address = this.badgeholder.streetAddress;
          citationStatus.DriversLicenseNo = this.badgeholder.driversLicenseNo
          citationStatus.State = this.badgeholder.state;
          citationStatus.City = this.badgeholder.city;
          citationStatus.Zip = this.badgeholder.zip
          //this.citation.licenseState = this.badgeholder.licenseState
          // citationStatus.Email = this.badgeholder.recpt_email_address;
          this.citation.email = this.badgeholder.emailAddress;
          this.readonlyBadge = false;
          this.isCompany = false;
          var inspId = this.inspectionId;
          if (this.inspectionId == undefined) {
            this.inspectionId = 0;
          }
          this.validateAndAddEventRecord(0)
          var company = this.allCompanyList.find(x => x.companyName == this.badgeholder.company)
          if (company !== undefined || citationStatus.CompanyId > 0) {

            if (company !== undefined) {
              citationStatus.CompanyId = company.id
            }
            if (citationStatus.CompanyId != 0 && citationStatus.CompanyId != null) {
              // this.citation.violationDate = this.dateAdapter.toModel(this.fromModel(this.citation.violationDate))
              this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate))
              this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate))
              this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate))
              this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate))
              this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure))
              this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate))
              this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate))
              this.NovService.AddCitationDetails(citationStatus, this.files, this.deletedFiles, this.CitationImagesLst,
                this.isSaveFormDetails, this.correctiveAction, this.remedialTrainings, this.deletedeventIds, this.inspectionId, this.selectedDoorList, this.selectedNovDoorList).subscribe((response: CitationDetails) => {
                  this.loading = false;
                  this.resetIsDirtyFlag();
                  this.toastr.success('Citation Information Submitted!', 'Information');
                  //this.spinner.hide();
                  if (this.user.rolename === "Issuer") {
                    this.router.navigate(['admin/nov']);
                  }
                  else {
                    if (inspId > 0) {
                      $("#btnModal").click();
                    }
                    this.citation.id = +response;
                    this.setTabsandButtons();
                    this.GetCitationDetailsById(+response, this.citation.companyId);
                  }
                  //this.Checktabs();
                }
                  , (error: any) => {
                    this.toastr.error('Citation Information not Submitted!', 'Information');
                    //this.spinner.hide();
                  });
            }
            else {
              if (this.badgeholder.company !== null) {
                this.toastr.error("You cannot submit Citation information. The company " + '"' + this.badgeholder.company + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
              }
              else {
                this.toastr.error("You cannot submit Citation information. Company associated with badge# " + '"' + this.badgeholder.badgeNo + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
              }
              //this.spinner.hide();
            }
          }
          else {
            if (this.badgeholder.company !== null) {
              this.toastr.error("You cannot submit Citation information. The company " + '"' + this.badgeholder.company + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
            }
            else {
              this.toastr.error("You cannot submit Citation information. Company associated with badge# " + '"' + this.badgeholder.badgeNo + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
            }
            //this.spinner.hide();
          }

        }
      }
    }
    else if (this.activeTab == "tab2") {
      if (this.user.rolename == "StaffAdmin" || this.user.rolename == "Superadmin") {
        var correctiveActions = this.bindCorrectiveAction();
        correctiveActions.isSubmitted = true;
        if (correctiveActions.AdminFine != true) {
          correctiveActions.PaymentMethod = 0
          correctiveActions.FineAmount = ''
          correctiveActions.FinePaid = false
        }
        if (this.citation.status == "Close") {
          correctiveActions.isSubmitted = false;
          correctiveActions.CurrentCitationStatusId = CaseStatus.Closed;
        }
        else if (this.citation.status == "ReturnedToAS") {
          correctiveActions.isSubmitted = false;
          correctiveActions.CurrentCitationStatusId = CaseStatus.ReturnedToAS;
        }
        else if (this.citation.status == "ReturnedToIssuer") {
          correctiveActions.isSubmitted = false;
          correctiveActions.CurrentCitationStatusId = CaseStatus.ReturnedToIssuer;
        }
        else if (this.citation.currentCitationStatusId != CaseStatus.PendingCompletion) {
          correctiveActions.CurrentCitationStatusId = CaseStatus.InProcess;
        }
        else {
          this.toastr.error('Please select case status!', 'Alert');
          //this.spinner.hide();
          return;
        }
        let today = new Date();
        if (this.citation.currentCitationStatusId == 4) {
          if (this.staffAdminComment.trim() != "") {
            correctiveActions.staffAdminComment = today.toLocaleDateString() + ": " + this.staffAdminComment + "<br>" + this.correctiveAction.staffAdminComment + "<br>";

          }
        }
        if (this.citation.currentCitationStatusId == 2) {
          if (this.staffAdminCommentIssuer.trim() != "") {
            correctiveActions.staffAdminCommentIssuer = today.toLocaleDateString() + ": " + this.staffAdminCommentIssuer + "<br>" + this.correctiveAction.staffAdminCommentIssuer + "<br>"
          }
        }
        if (this.correctiveAction.notifyAuth) {
          if (this.strCommentAuth.trim() != "") {
            if (this.correctiveAction.staffAdminComment == null)
              this.correctiveAction.staffAdminComment = ""
            // correctiveActions.authComment = today.toLocaleDateString() + "-" + this.strCommentAuth + "<br>" + this.correctiveAction.authComment + "<br>";
            correctiveActions.staffAdminComment = today.toLocaleDateString() + ": " + this.strCommentAuth + "<br>" + this.correctiveAction.staffAdminComment + "<br>";

          }
        }
        this.citation.violationDate = this.dateAdapter.toModel(this.fromModel(this.citation.violationDate))
        this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate))
        this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate))
        this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate))
        this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate))
        this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure))
        this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate))
        this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate))
        this.NovService.AddCorrectiveActions(correctiveActions, this.files, this.deletedFiles, this.remedialTrainings,
          this.deletedTrainings, this.isSaveFormDetails, this.citation, this.correctiveAction.notifyAuth).subscribe((response: CorrectiveActions) => {
            this.loading = false;
            this.toastr.success('Corrective Actions Submitted!', 'Information');
            //this.spinner.hide();
            this.resetIsDirtyFlag();
            if (this.citation.status == "Close" || this.citation.status == "ReturnedToIssuer" || this.citation.status == "ReturnedToAS") {
              this.router.navigateByUrl('admin/nov');
            }
            else {
              this.setTabsandButtons();
              //this.correctiveAction.id = +response;
              this.GetCitationDetailsById(correctiveActions.CitationId, this.citation.companyId);
            }
          }
            , (error: any) => {
              this.toastr.error('Corrective Actions not Submitted!', 'Information');
              //this.spinner.hide();
            });

      }
    }
    else if (this.activeTab == "tab3") {
      if (this.user.rolename == "AuthSigner") {
        if (this.correctiveAction.isCorrectiveActionCompleted == 0 || this.correctiveAction.correctiveActionCompletedDate == '') {
          this.toastr.error('Check Is Corrective action and Date Completed!', 'Information');
          //this.spinner.hide();
          return
        }
        var correctiveActionsForAuthSigner = {
          Id: this.correctiveAction.id,
          CitationId: this.citation.id,
          IsCorrectiveActionCompleted: Number(this.correctiveAction.isCorrectiveActionCompleted),
          // CorrectiveActionCompletedDate: this.datePipe.transform(this.correctiveAction.correctiveActionCompletedDate, 'MM/dd/yyyy'),
          CorrectiveActionCompletedDate: this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate)),
          CurrentCitationStatusId: CaseStatus.PendingCompletion,
          UserId: this.user.id,
          isSubmitted: true
        }
        this.citation.violationDate = this.dateAdapter.toModel(this.fromModel(this.citation.violationDate))
        this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate))
        this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate))
        this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate))
        this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate))
        this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure))
        this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate))
        this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate))
        this.NovService.AddEditCorrectiveActionsByAuthSigner(correctiveActionsForAuthSigner, this.filesauthsigner, this.deletedFiles,
          this.citation, this.correctiveAction, this.remedialTrainings).subscribe((response: CorrectiveActions) => {
            this.loading = false;
            this.toastr.success('Corrective Actions Submitted!', 'Information');
            //this.spinner.hide();
            this.resetIsDirtyFlag();
            this.router.navigate(['admin/nov']);
          }
            , (error: any) => {
              this.toastr.error('Corrective Actions not Submitted!', 'Information');
              //this.spinner.hide();
            });
      }
    }
  }


  checkValue(event) {
    this.citation.isCompanyCitation = !this.citation.isCompanyCitation;
  }

  CheckRequiredFields() {
    if (!this.citation.isCompanyCitation) {
      if (this.citation.violatorFirstName == undefined || this.citation.violatorFirstName == ""
        || this.citation.violatorLastName == undefined || this.citation.violatorLastName == ""
        || this.citation.violatorBirthDate == undefined || this.citation.companyId == undefined
        || this.citation.companyId == 0 || this.citation.violationTypeId == 0 || this.citation.violationTypeId == undefined) {
        return true;
      }
    }
    else {
      if (this.citation.violatorFirstName == undefined || this.citation.violatorFirstName == ""
        || this.citation.violatorLastName == undefined || this.citation.violatorLastName == ""
        || this.citation.companyId == undefined
        || this.citation.companyId == 0 || this.citation.violationTypeId == 0 || this.citation.violationTypeId == undefined) {
        return true;
      }
    }

    return false;
  }

  Checktabs() {
    //when tab1 is active
    if (this.citation.novNo != undefined && (this.citation.currentCitationStatusId == CaseStatus.Open || this.citation.currentCitationStatusId == CaseStatus.ReturnedToIssuer) && this.user.rolename != "AuthSigner") {
      this.isSubmitShow = true;
    }
    else
      this.isSubmitShow = false;
    // Action for first tab
    if (this.signaturePad != undefined) {
      this.signaturePad.fromDataURL(this.citation.offenderSignature, this.modalOptions);
    }
    if (this.saveTab2Details == true) {
      if (this.citation.currentCitationStatusId == CaseStatus.PendingCompletion || this.citation.currentCitationStatusId == CaseStatus.Submitted) {
        this.isSubmitShow = true;
      }
    }
  }
  showCommentBoc(event: any) {
    if (this.correctiveAction.notifyAuth == true) {

    }
    else {

    }
  }

  saveByAuthSigner(formData: NgForm) {
    this.router.navigate(['admin/nov']);
  }

  setDirtyFlag() {
    this.isDirty = true;
  }

  changeTab(event) {
    if (this.isDirty) {
      var ans = confirm("You have unsaved changes! Click Ok to discard your changes or Cancel to stay on this page.");
      if (ans == true) {
        this.isDirty = false;
        this.processChangeTab(event);
      }
      else {
        event.preventDefault();
      };
    }
    else {
      this.isDirty = false;
      this.processChangeTab(event);
    }
  }

  processChangeTab(event) {
    this.activeTab = event.nextId;
    sessionStorage.setItem('tab', this.activeTab);
    $('#dt1').DataTable().destroy();

    //TAB 1
    if (event.nextId == 'tab1') {
      //Called API for signature issue     

      this.router.navigate(["/admin/dashboard"]).then(() => {
        this.router.navigate(['/admin/nov/details'], {
          queryParams: {
            citationId: this.citation.id,
            isEdit: 1,
            isClone: 0
          }
        });
      });

    }
    //TAB 2
    // else if (event.nextId == 'tab2') {
    else if (event.nextId == 'tab2') {
      if (this.correctiveAction.id == undefined && this.citation.currentCitationStatusId == CaseStatus.InProcess)// ||this.citation.currentCitationStatusId == CaseStatus.Closed) {
      {
        this.isSubmitShow = false;
      }
      else if (this.user.rolename == "StaffAdmin") {

        if (this.citation.currentCitationStatusId == CaseStatus.Submitted) {
          this.isSaveTab2 = true;
        }
        else {
          this.isSaveTab2 = false;
        }
        if (this.citation.currentCitationStatusId == CaseStatus.PendingCompletion) {
          this.isSubmitShow = true;
          this.isPendingForCompletion = true;
        }
        else {
          this.isSubmitShow = false;
          this.isPendingForCompletion = false;
        }
        if (this.citation.currentCitationStatusId == CaseStatus.Submitted) { // && this.correctiveAction.id != undefined) {
          this.isSubmitShow = true;
        }
      }
      else if (this.user.rolename === 'Superadmin') {
        if (this.citation.currentCitationStatusId == CaseStatus.Closed) {
          this.isSubmitShow = true;
          this.isPendingForCompletion = true;
        }
        else {
          this.isSubmitShow = false;
          this.isPendingForCompletion = false;
        }
      }
      else {
        if (this.user.rolename == "AuthSigner") {
          this.isSaveTab2 = false;
        }

        this.isSubmitShow = false;
        this.isPendingForCompletion = false;
      }
      // Action for second tab
    }
    //TAB 3
    // else if (event.nextId == 'tab3') {
    else if (event.nextId == 'tab3') {
      if (this.user.rolename == "AuthSigner") {
        if (this.correctiveAction.id == undefined || this.citation.currentCitationStatusId == CaseStatus.PendingCompletion ||
          this.citation.currentCitationStatusId == CaseStatus.Closed) {
          this.isSubmitShow = false;
        }
        else
          this.isSubmitShow = true;
      }
      else
        this.isSubmitShow = false;
      // Action for second tab
    }
  }

  public close() {

    if (this.citation.id == undefined) {
      let sign1 = this.signaturePad.isEmpty()
      if (!sign1) {
        this.isDirty = true
      }

    }
    else {
      if (this.oldSign != this.signaturePad.toDataURL()) {
        //  this.isDirty = true;
      }
    }
  }

  public GetCitationDetails() {
    if (this.isProhibitedAudit == 'true') {
      if (this.prohibitedauditId > 0) {
        if (this.isDirty) {
          var ans = confirm("You have unsaved changes! Click Ok to discard your changes or Cancel to stay on this page.");
          if (ans == true) {
            this.isDirty = false
            this.goToProhibitedAudit()
          }
          else {
            return false
          }
        }
        else {
          this.isDirty = false;
          this.goToProhibitedAudit();
        }
      }
    }
    else if (this.inspectionId == undefined) {
      this.router.navigate(["admin/nov"]);
    }
    else if (this.prohibitedauditId == undefined) {
      this.router.navigate(["admin/nov"]);
    }

    else if (this.inspectionId > 0) {
      if (this.isDirty) {
        var ans = confirm("You have unsaved changes! Click Ok to discard your changes or Cancel to stay on this page.");
        if (ans == true) {
          this.isDirty = false
          $("#btnModal").click();
        }
        else {
          return false
        }
      }
      else {
        this.isDirty = false;
        $("#btnModal").click();
      }
    }
    else {
      this.router.navigate(["admin/nov"]);
    }

  }

  //Delete Corrective Action row
  deleteRow(index, id) {
    if (this.remedialTrainings.length == 1) {

      return false;
    } else {
      this.isDirty = true;
      this.remedialTrainings.splice(index, 1);
      if (id != undefined) {
        this.deletedTrainings = this.deletedTrainings + "," + id;
      }

      //this.deletedTrainings.push(index);
      return true;
    }
  }


  customAction() {
    alert("Some custom action");
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
    this.selectedNovDoorList = [];
    // this.selectedDoorGateNumber = []
  }

  public getSelectedDoors(novId) {
    this.NovService.GetNovSelectedDoors(novId).subscribe((data: Locations[]) => {
      this.selectedNovDoorList = []

      this.selectedNovDoorList = data as Locations[];
    });
  }

  convertTo24HourFormat(timeString) {
    const match = timeString.match(/(\d+):(\d+) (\w+)/);
    const hour = parseInt(match[1]);
    const minute = match[2];
    const period = match[3];
    let formattedHour = hour;

    if (period === 'PM' && hour < 12) {
      formattedHour += 12;
    }

    return `${formattedHour}:${minute}`;
  }

  public GetCitationDetailsById(citationId: number, companyId: number) {
    //this.spinner.show();
    $('#dt1').DataTable().destroy();

    this.NovService.GetCitationDetailsById(citationId, companyId)
      .subscribe(
        (data: CitationDetails) => {
          this.citation = data as CitationDetails;
          this.citation.violationTime = this.datePipe.transform(this.citation.violationTime, 'HH:mm');
          if (this.citation.iscctvAvailable == 'False') {
            this.citation.iscctvAvailable = '0'
          }
          if (this.citation.iscctvAvailable == 'True') {
            this.citation.iscctvAvailable = '1'
          }

          this.getCitationEventsByCitaionId(citationId)
          this.formatUserEmail()
          this.citation.eventList.sort(this.sortFunction);
          this.dtTrigger.next();
          if (this.isClone == '1') {
            this.citation.issuedBy = this.user.name;
            this.citation.eventList = [];
            this.citationEvents = [];
          }
          if (this.citation.isBadgeAutoFilled == true) {
            this.readonlyBadge = true
          } else {
            this.readonlyBadge = false
          }
          //this.badgeholder.badgeNo = this.citation.securityBadgeNo;
          this.badgeholder.badgeNumber = this.citation.securityBadgeNo;
          this.badgeholder.company = this.citation.companyName;
          this.badgeholder.firstName = this.citation.violatorFirstName;
          this.badgeholder.lastName = this.citation.violatorLastName;
          this.personUniqueId = this.citation.personUniqueId;
          // this.badgeholder.dob = this.dateAdapter.toModel(this.fromModel(this.citation.violatorBirthDate));
          this.badgeholder.birthDate = this.dateAdapter.toModel(this.fromModel(this.citation.violatorBirthDate));
          //this.badgeholder.licenseExpirationDate = this.dateAdapter.toModel(this.fromModel(this.citation.licenseExpirationDate));
          this.citation.violationDate = this.dateAdapter.toModel(this.fromModel(this.citation.violationDate));
          // this.badgeholder.recpt_email_address = this.citation.email;
          this.badgeholder.emailAddress = this.citation.email;
          //this.badgeholder.address = this.citation.address;
          this.badgeholder.streetAddress = this.citation.address;
          this.badgeholder.city = this.citation.city;
          this.badgeholder.state = this.citation.state;
          this.badgeholder.zip = this.citation.zip;
          this.badgeholder.driversLicenseNo = this.citation.driversLicenseNo;
          //this.badgeholder.licenseState = this.citation.licenseState;
          if (this.citation.phone != "" && this.citation.email == "") {
            this.smsSend = "true"
            this.emailSend = "false"
          }
          else if (this.citation.phone == "" && this.citation.email != "") {
            this.emailSend = "true"
            this.smsSend = "false"
          }
          this.getSelectedDoors(citationId)
          /* Filter FIles by User */
          this.citationAttachmentsissuersImg = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
          this.citationAttachmentsissuersFile = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');
          this.citationAttachmentsStaffadminImg = [] = [];
          this.citationAttachmentsStaffadminFile = [] = [];
          this.citationAttachmentsStaffadminImg = data.citationAttachments.filter(x => x.tabNo == 'Tab2' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
          this.citationAttachmentsStaffadminFile = data.citationAttachments.filter(x => x.tabNo == 'Tab2' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

          this.citationAttachmentsAuthsignerImg = data.citationAttachments.filter(x => x.tabNo == 'Tab3' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
          this.citationAttachmentsAuthsignerFile = data.citationAttachments.filter(x => x.tabNo == 'Tab3' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');
          this.GetCorrectiveActionByCitationId(data.id);



          //first fill citation reason dropdown by violation type
          this.GetCitationReasonListByViolation(data.violationTypeId);
          this.formatUserEmail()
         this.GetViolationTypeList()
          //this.GetCouRecordsList(this.badgeholder.badgeNumber,this.badgeholder.personUniqueId);
          if(this.badgeholder.personUniqueId != null && this.badgeholder.personUniqueId != ""){
            this.GetCouRecordsList(null,this.badgeholder.personUniqueId);
          }else{
            this.GetCouRecordsList(this.badgeholder.badgeNumber,null);
          }
          if (this.citation.currentCitationStatusId == CaseStatus.PendingCompletion) {
            this.isPendingForCompletion = true;
          }
          if (this.citation.currentCitationStatusId == CaseStatus.Closed) {
            this.citation.status = "Close";
          }
          else if (this.citation.currentCitationStatusId == CaseStatus.InProcess) {
            this.citation.status = "InProcess";
          }
          var isClone: string = this.route.snapshot.pathFromRoot[1].queryParams['isClone'];
          if (isClone == "1") {
            this.clearViolationBeforeClone();
            this.citation.currentStatus = 'Draft'
          }
          else {

            if (this.citation.currentCitationStatusId == CaseStatus.Open || this.citation.currentCitationStatusId == CaseStatus.ReturnedToIssuer) {
              if (this.user.rolename == "AuthSigner") {
                this.isViewCitation = true;
                this.isViewCorrectiveActions = true;
                this.isViewAuthorizedSigner = true;
              }
              else {
                this.isStaffAdmin = false;
                this.isAuthsigner = false;
                this.isIssuer = true;
                this.isViewCitation = false;
                this.isViewCorrectiveActions = false;
                this.isViewAuthorizedSigner = false;
              }
            }
            else {
              if (this.user.rolename == "StaffAdmin") {
                //this.isViewCitation = true;
                this.isViewCitation = false;
                this.isViewCorrectiveActions = false;
                this.isViewAuthorizedSigner = true;
              }
              else if (this.user.rolename == "AuthSigner") {
                this.isViewCitation = true;
                this.isViewCorrectiveActions = true;
                this.isViewAuthorizedSigner = true;
              }
              else {
                this.isViewCitation = true;
                this.isViewCorrectiveActions = false;
                this.isViewAuthorizedSigner = false;
              }
            }
            //when tab1 is active
            if (this.citation.novNo != undefined && (this.citation.currentCitationStatusId == CaseStatus.Open || this.citation.currentCitationStatusId == CaseStatus.ReturnedToIssuer) && this.user.rolename != "AuthSigner") {
              this.isSubmitShow = true;
            }
            else {
              this.isSubmitShow = false;
            }

            // Action for first tab
            if (this.signaturePad != undefined) {
              // this.drawClear()
              this.oldSign = this.citation.offenderSignature;
              this.signaturePad.fromDataURL(this.citation.offenderSignature);
            }
            let tab = sessionStorage.getItem('tab');
            if (tab != "tab1") {
              if (this.saveTab2Details == true) {
                if (this.citation.currentCitationStatusId == CaseStatus.PendingCompletion || this.citation.currentCitationStatusId == CaseStatus.Submitted) {
                  this.isSubmitShow = true;
                }
              }
            }

          }
          //this.spinner.hide();
        }, (error: any) => {
          //this.spinner.hide();
          //this.toastr.error(`${error}`, "Error");
        });
  }

  public GetCorrectiveActionByCitationId(citationId: number) {
    //this.spinner.show();
    this.NovService.GetCorrectiveActionByCitationId(citationId)
      .subscribe(
        data => {

          if (data != null) {
            this.correctiveAction = data;
            if (this.correctiveAction.adminFine == true) {
              this.showpaymentoption = true
              this.fineMsg = this.appURL.getAdminFineMessage();
            }
            this.correctiveAction.badgeSuspendedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeSuspendedDate));
            this.correctiveAction.remedialTrainingAssignedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingAssignedDate));
            this.correctiveAction.remedialTrainingCompletionDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.remedialTrainingCompletionDate));
            this.correctiveAction.badgeDeactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeDeactivatedDate));
            this.correctiveAction.badgeReactivatedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.badgeReactivatedDate));
            this.correctiveAction.dateOfDisclosure = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.dateOfDisclosure));
            if (this.correctiveAction.correctiveActionCompletedDate == null || this.correctiveAction.correctiveActionCompletedDate == undefined) {

              this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
            }
            else {
              this.correctiveAction.correctiveActionCompletedDate = this.dateAdapter.toModel(this.fromModel(this.correctiveAction.correctiveActionCompletedDate));
            }
            //var userId = this.user.id;
            //this.remedialTrainings =[];          
            this.remedialTrainings = [];
            this.correctiveAction.correctiveActionsTrainings.forEach(element => {
              element.userId = this.user.id;
              this.remedialTrainings.push(element);
            });

            this.newDynamic = new CorrectiveActionsTrainings();
            this.newDynamic.correctiveActionId = this.correctiveAction.id;
            this.newDynamic.userId = this.user.id;
            this.remedialTrainings.push(this.newDynamic);
          }
          else {
            this.remedialTrainings = [];
            this.newDynamic = new CorrectiveActionsTrainings();
            this.newDynamic.correctiveActionId = this.correctiveAction.id;
            this.newDynamic.userId = this.user.id;
            this.remedialTrainings.push(this.newDynamic);
          }

          //this.spinner.hide();
        }, (error: any) => {

        });

  }

  public GetPaymentTypeList() {

    this.NovService.GetPaymentTypeList().subscribe((response: PaymentMethod[]) => {
      this.paymentMethod = response;
    }, (error: any) => {
      console.log("error list");
    });
  }

  public GetViolationTypeList() {
    this.ViolationTypesService.GetViolationTypeList().subscribe( (response: any[]) => {

      const selectedId = this.citation?.violationTypeId;

     
      this.allViolationTypes = response.filter(x =>
        x.status === true || x.id === selectedId
      );

      

    this.activeViolationTypes = this.allViolationTypes.filter(x => x.status === true );
      
    }, (error: any) => {
      console.log("error list");
    });
  }
  disableInactiveExceptSelected = (item: any) => {
  return !item.status && item.id !== this.citation?.violationTypeId;
};
  

  public GetEventTypeList() {
    this.eventTypesService.GetEventTypeList().subscribe((response: EventTypes[]) => {
      this.eventTypeList = response;
    }, (error: any) => {
      console.log("error list");
    });
  }
  //Get state list
  public GetStateList() {
    this.NovService.GetStateList().subscribe((response: IncidentStatesMaster[]) => {
      this.incidentStatList = response;
    }, (error: any) => {
      console.log("error list");
    });
  }

  //Get Company List
  public GetCompanyList() {
    this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
      this.allCompanyList = response;
    }, (error: any) => {
      console.log("error list");
    });
  }

  public GetCitationReasonList() {
    
    this.CitationReasonsService.GetCitationReasonList().subscribe((response: CitationReasons[]) => {
      this.CitationReasonsFromDb = response;
      
    
    

    });
  }

  //Get Citation Reason List By Violation
  public GetCitationReasonListByViolation(violationTypeId: number) {
    this.CitationReasonsService.GetCitationReasonListByViolation(violationTypeId).subscribe(//(response: CitationReasons[]) => {
    //  this.allCitationReasonsList = response;
      //const selectedId = this.citation?.citationResonId;
        // this.allCitationReasonsList = response//.map(x => ({
      //   ...x,
      //   isDisabled: !x.status && x.id !== selectedId
      // }));
       // this.allViolationTypes = response.filter((x) => x.status === true);

       (response: any[]) => {

      const selectedId = this.citation?.citationResonId;

     
      this.allCitationReasonsList = response.filter(x =>
        x.status === true || x.id === selectedId
      );

      
        this.activecitationReasonList = this.allCitationReasonsList;

        //this.allCitationReasonsList = response;
    }, (error: any) => {
      console.log("error list");
    });
  }

  public fillCitationReason(violationTypeId: number) {
    this.GetCitationReasonListByViolation(violationTypeId);
    this.citation.citationResonId = null;
    
  }

  canvasResize() {

  }

  showpopup(content) {
    if (this.correctiveAction.adminFine == true) {
      this.showpaymentoption = true
      this.fineMsg = this.appURL.getAdminFineMessage();
      // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'L' }).result.then((result) => {
      //   this.closeResult = `Closed with: ${result}`;
      // }, (reason) => {
      //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // });
    } else {
      this.showpaymentoption = false
    }

  }

  showpayment() {
    this.showpaymentoption = true
  }

  closemodal() {
    this.modalService.dismissAll();
  }
  cancelfine() {
    this.correctiveAction.adminFine = false
    this.showpaymentoption = false
    this.modalService.dismissAll();
  }

  ngAfterViewInit() {

    this.signaturePad.set('minWidth', 2);
    this.signaturePad.clear();
  }


  drawComplete() {
    // console.log(this.signaturePad.toDataURL());
    this.isDirty = true;

  }

  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
    this.isDirty = true;
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
      var parts = file.name.split('.');
      if (parts.length <= 1) {
        this.toastr.error("File " + file.name + " is not valid file");
      }
      else {
        this.files.push(file)
      }

    }
    this.myInputVariable.nativeElement.value = "";
  }

  removeFile(file) {
    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;
      this.files.splice(this.files.indexOf(file), 1)
    }
  }


  addFileAuthSigner(files) {
    if (files.length === 0) {
      return;
    }
    this.isDirty = true;
    for (let file of files) {
      this.filesauthsigner.push(file)
    }
    this.myInputVariable.nativeElement.value = "";
  }

  removeFileAuthSigner(file) {

    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;
      this.filesauthsigner.splice(this.files.indexOf(file), 1)
    }
  }

  deleteFile(file) {
    var ans = confirm("Do you want to delete file ?");
    if (ans == true) {
      this.isDirty = true;

      this.citation.citationAttachments.splice(this.citation.citationAttachments.indexOf(file), 1);
      this.citationAttachmentsissuersImg = this.citation.citationAttachments.filter(x => x.tabNo == 'tab1' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsissuersFile = this.citation.citationAttachments.filter(x => x.tabNo == 'tab1' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');


      this.citationAttachmentsStaffadminImg = this.citation.citationAttachments.filter(x => x.tabNo == 'tab2' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsStaffadminFile = this.citation.citationAttachments.filter(x => x.tabNo == 'tab2' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

      this.citationAttachmentsAuthsignerImg = this.citation.citationAttachments.filter(x => x.tabNo == 'tab3' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsAuthsignerFile = this.citation.citationAttachments.filter(x => x.tabNo == 'tab3' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

      //});
      this.deletedFiles.push(file.id);

      this.citationAttachmentsissuersImg = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab1' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsissuersFile = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab1' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');
      this.citationAttachmentsStaffadminImg = [] = [];
      this.citationAttachmentsStaffadminFile = [] = [];
      this.citationAttachmentsStaffadminImg = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab2' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsStaffadminFile = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab2' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

      this.citationAttachmentsAuthsignerImg = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab3' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      this.citationAttachmentsAuthsignerFile = this.citation.citationAttachments.filter(x => x.tabNo == 'Tab3' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

    }
  }

  showUndoBtn(index, filePath) {
    if (this.showBtn === index)
      this.showBtn = -1;
    else
      this.showBtn = index;

    var fileExt = filePath.toLowerCase().split(".", 2)[1];
    if (fileExt != "png" && fileExt != "jpg" && fileExt != "jpeg" && fileExt != "gif") {
      this.showBtn = -1;
      this.downloadFile(index, filePath);
    }
  }


  //Download file
  downloadFile(id: number, fileName: string) {
    this.NovService.getAttachment(id).subscribe(
      data => {
        this.toastr.success("File is Downloading....Please wait!!")
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
        URL.revokeObjectURL(a.href)
        a.remove();
        // }
      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
      ${error.message}`, 'Error');
      });
  }

  //View File
  viewFile(id: number, fileName: string) {
    this.NovService.getAttachment(id).subscribe(
      data => {
        // IE doesn't allow using a blob object directly as link href
        //instead it is necessary to use msSaveOrOpenBlob
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   var newBlob = new Blob([data], { type: data.type })
        //   window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        //   return;
        // }
        const objectURL = window.URL.createObjectURL(data);
        window.open(objectURL, '_blank');
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(objectURL);
        }, 100);
      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
      ${error.message}`, 'Error');
      });
  }

  // downloadFile(filename) {

  //   window.open(
  //     fileURL + filename,
  //     '_blank' // <- This is what makes it open in a new window.
  //   );
  // }

  removeImage(image) {
    this.webcamImageArr.splice(this.webcamImageArr.indexOf(image), 1)
  }

  trackByEventIndex(index: any) {
    return index;
  }
  ValidateDate(event: any) {
    var parsedDate = this.eventsModel.eventDate;
    //// if (!isNaN(parsedDate)) {
    /* do your work */

    //  }
  }

  getDateTrans(date) {
    return this.datePipe.transform(date, 'MM/dd/yyyy HH:mm')
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      //  DataTables.Api) => {
      dtInstance.ajax.reload()
    });
  }

  ngOnDestroy(): void {
    console.log('ngDestroy');
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  // Add Reference Submittal
  validateAndAddEventRecord(flag): boolean {
    if (this.validateEventRecord()) {
      this.eventsModel.citationId = this.citationId;
      if (this.eventsModel.inedit == true) {
        this.UpdateEventRecord(this.eventsModel, 0)
      }
      else {
        this.eventsModel.eventDate = this.dateAdapter.toModel(this.fromModel(this.eventsModel.eventDate));
        this.eventsModel.eventTypeName = this.eventTypeList.filter(x => x.id === this.eventsModel.eventTypeId)[0].type;
        this.eventsModel.newEventTime = this.onTimeChange(this.eventsModel.eventTime)
        const copyEvent = { ...this.eventsModel };
        this.citation.eventList.push(copyEvent);
        this.citation.eventEdited = "Added";
        //this.citationEvents.push(copyEvent);  
        this.citationEvents.push(this.eventsModel);
        this.resetEventModel();
      }
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select Event type.', 'Information');
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        // //this.spinner.hide();
      }
    }
  }

  resetEventModel() {
    // Reset
    this.eventsModel = new CitationEvents();
    this.eventsModel.userId = this.user.id;
    this.eventsModel.userName = this.user.name;
    this.eventsModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())

  }

  ConvertJsonTimeToStrin(eventTime: any) {
    // console.log(eventTime);
  }

  onTimeChange(notifiedTime: string) {
    var timeSplit = notifiedTime.split(':'),
      hours,
      minutes,
      meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    return (hours + ':' + minutes + ' ' + meridian);
  }

  timeConversion(eventTime: string) {
    var hours = Number(eventTime.match(/^(\d+)/)[1]);
    var minutes = Number(eventTime.match(/:(\d+)/)[1]);
    var AMPM = eventTime.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);

  }

  // validate reference submittal attachement
  validateEventRecord() {
    return (
      this.eventsModel.eventTypeId !== 0 &&
      this.eventsModel.eventDetails !== null &&
      this.eventsModel.userId !== null
    );
  }

  isFooterRefSubmittalRecordPresent() {
    return (
      (this.eventsModel.eventTypeId !== 0 &&
        this.eventsModel.eventTypeId !== null) ||
      this.eventsModel.eventDetails !== '' ||
      this.eventsModel.userId !== ''

    );
  }
  cancelEventUpdate(eventsModel: CitationEvents) {
    this.resetEventModel();
    eventsModel.inedit = false
    var index = this.citationEvents.findIndex((x => x.id == eventsModel.id))
    this.citationEvents[index].inedit = eventsModel.inedit
    this.citation.eventList[index].inedit = eventsModel.inedit
  }

  deleteEvent(event: CitationEvents) {
    if (confirm("Are you sure you want to delete event")) {

      var index = this.citationEvents.findIndex((x => x.id == event.id))
      this.citationEvents.splice(index, 1)
      this.citation.eventList.splice(index, 1)
      this.deletedeventIds.push(event.id)
    }
    else {

    }

  }
  getEventName(eventTypeId: number) {
    return this.eventTypeList.filter(x => x.id == eventTypeId)[0].type;
  }

  // UpdateEvent(eventModel: CitationEvents) {
  //   //this.spinner.show();
  //   eventModel.inedit = false
  //   eventModel.eventDate = this.dateAdapter.toModel(this.fromModel(eventModel.eventDate));
  //   this.eventsModel.newEventDate = this.eventsModel.eventDate;
  //   eventModel.eventTypeName = this.getEventName(eventModel.eventTypeId)
  //   var index = this.citationEvents.findIndex((x => x.id == eventModel.id))
  //   this.citationEvents[index] = eventModel
  //   this.citation.eventList[index] = eventModel

  // }


  onEditClick(event, index: number, eventModel: CitationEvents) {
    if (this.validateEventRecord()) {
      this.UpdateEventRecord(this.eventsModel, 0)
      eventModel.inedit = true
      const copyEvents = { ...eventModel };
      this.eventsModel = copyEvents
      this.eventsModel.eventDate = this.dateAdapter.toModel(this.fromModel(eventModel.eventDate));
    }
    else {
      eventModel.inedit = true
      const copyEvents = { ...eventModel };
      this.eventsModel = copyEvents
      this.eventsModel.eventDate = this.dateAdapter.toModel(this.fromModel(eventModel.eventDate));
    }
  }

  UpdateEventRecord(eventModel: CitationEvents, flag) {
    if (this.validateEventRecord()) {
      //this.spinner.show();      
      this.resetEventModel();
      eventModel.inedit = false
      if (+eventModel.eventTypeId > 0) {
        eventModel.eventTypeName = this.getEventName(+eventModel.eventTypeId)
      }

      eventModel.eventDate = this.dateAdapter.toModel(this.fromModel(eventModel.eventDate));

      var index = this.citationEvents.findIndex((x => x.id == eventModel.id))
      this.citationEvents[index] = eventModel
      this.citation.eventList[index] = eventModel
      //this.spinner.hide();
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter required field.', 'Information');
        //this.spinner.hide();
        return false;
      }
      if (flag == 0) {
        //this.spinner.hide();
      }
    }

  }

  onDateSortClick(event) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('my-icon fa-chevron-up')) {
      classList.remove('my-icon fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('my-icon fa-chevron-up');
      classList.remove('my-icon fa-chevron-down');
      this.sortDir = 1;
    }
    this.isDesc = !this.isDesc; //change the direction    
    //this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.citationEvents.sort(function (a, b) {
      var dateA = new Date(a.eventDate).getTime();
      var dateB = new Date(b.eventDate).getTime();
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

  sort(property, event) {
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

    this.isDesc = !this.isDesc; //change the direction    
    //this.column = property;
    let direction = this.isDesc ? 1 : -1;
    if (property === 'eventDate') {
      this.citationEvents.sort(function (a, b) {
        var dateA = new Date(a.eventDate).getTime();
        var dateB = new Date(b.eventDate).getTime();
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
    else {
      this.citationEvents.sort(function (a, b) {
        if (a[property] < b[property]) {
          return -1 * direction;
        }
        else if (a[property] > b[property]) {
          return 1 * direction;
        }
        else {
          return 0;
        }
      });
    }
  };

  sortFunction(a, b) {
    var dateA = new Date(a.eventDate).getTime();
    var dateB = new Date(b.eventDate).getTime();
    return 0 - (dateA > dateB ? 1 : -1);
  };

  onSortClick(event) {
    this.sortArr('fname');
  }
  sortArr(colName: any) {
    // Ascending
    this.citationEvents.sort((a, b) => 0 - (a > b ? -1 : 1));
    // Descending
    this.citationEvents.sort((a, b) => 0 - (a > b ? 1 : -1));
  }
  //Get citaion evnets  by citaion Id
  public getCitationEventsByCitaionId(citationId: number) {
    $('#dt1').DataTable().destroy();
    this.citationEvents = [] = [];
    this.NovService.GetCitationEventsByCitationId(citationId)
      .subscribe((response: CitationEvents[]) => {
        this.citationEvents = response;
        this.citationEvents.forEach(element => {

        });
        this.citation.eventList.sort(this.sortFunction);
        this.dtTrigger.next();
      }, (error: any) => {
        //this.spinner.hide();
        this.toastr.error(`${error}`, "Error Fetching citation events");
      });
  }



  onCancelClick(index: number) {
    this.citation.eventList[index].inedit = false;
    this.citation.eventEdited = "Updated";
  }
  clearViolationBeforeClone() {
    this.citation.id = 0;
    this.citation.novNo = 0;
    this.citation.witnessBadgeNo = "";
    this.citation.witnessName = "";
    this.allCitationReasonsList = [];
    this.citation.violationTypeId = null;
    this.citation.citationResonId = null;
    this.citation.violationDate = "";
    this.citation.opdPoliceReport = "";
    this.citation.summaryOfViolation = "";
    this.citation.novNotes = "";
    this.citation.capturedImage = "";
    this.files = [];
    this.filesauthsigner = [];
    this.deletedFiles = [];
    this.CitationImagesLst = [];
    this.citationAttachmentsissuersImg = [];
    this.citationAttachmentsissuersFile = [];
    this.citationAttachmentsStaffadminImg = [];
    this.citationAttachmentsStaffadminFile = [];
    this.citationAttachmentsAuthsignerImg = [];
    this.citationAttachmentsAuthsignerFile = [];
    this.citation.eventList = [];
    this.drawClear();
    this.citation.citationAttachments = [];
    this.isPendingForCompletion = false;
    //this.caseStatus = false;
    this.isViewAuthorizedSigner = false;
    this.saveTab2Details = false;
    this.citation.currentCitationStatusId = CaseStatus.Open;
    this.citation.violationDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    this.isTab2Visible = false;
    this.correctiveAction = new CorrectiveActions();

  }

  GetBadgeholderInfoASCX() {
    this.ascxuser = !this.ascxuser;
    var badgeNumber = this.badgeholder.badgeNumber === '' ? "0" : this.badgeholder.badgeNumber;
    if (this.badgeholder.badgeNumber != "") {
      if (this.badgeholder.badgeNumber != undefined) {
        this.readonlyBadge = true
        this.citation.companyId = 0;
        this.NovService.GetBadgeByNumber(this.badgeholder.badgeNumber).subscribe(res => {
          if (res && res.data && res.data.length > 0) {
            const data = res.data[0]
            if (data != null) {
              this.badgeholder = data as Badgeholder;
              this.citation.securityBadgeNo = this.badgeholder.badgeNumber;
              this.citation.violatorFirstName = this.badgeholder.firstName;
              this.citation.violatorLastName = this.badgeholder.lastName;
              this.citation.address = this.badgeholder.streetAddress
              this.citation.state = this.badgeholder.state
              this.citation.city = this.badgeholder.city
              this.citation.driversLicenseNo = this.badgeholder.driversLicenseNo
              this.citation.zip = this.badgeholder.zip
              this.citation.licenseState = this.badgeholder.dlState
              this.citation.personUniqueId = this.badgeholder.personUniqueId;
              this.citation.isBadgeAutoFilled = true
              this.formatUserEmail();
              // this.citation.violatorBirthDate = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
              //this.badgeholder.birthDate = this.dateAdapter.toModel(this.fromModel(this.badgeholder.birthDate));
              // const date = new Date(this.badgeholder.birthDate);
              // const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Ensures two digits
              // const day = date.getDate().toString().padStart(2, "0"); // Ensures two digits
              // const year = date.getFullYear();
              // const formattedDate = `${month}/${day}/${year}`;
              // this.badgeholder.birthDate = formattedDate
              this.badgeholder.birthDate = this.formatDateToMMDDYYYY(this.badgeholder.birthDate)
              this.badgeholder.birthDate = this.dateAdapter.toModel(this.fromModel(this.badgeholder.birthDate));
              //this.badgeholder.licenseExpirationDate = this.dateAdapter.toModel(this.fromModel(this.badgeholder.licenseExpirationDate));
              this.citation.email = this.badgeholder.emailAddress;
              this.citation.phone = this.badgeholder.mobileNumber
              var company = this.allCompanyList.find(x => x.companyName == this.badgeholder.company)
              if (company !== undefined) {
                this.citation.companyId = company.id
                this.isCompany = true
              }
              else {
                //this.spinner.hide();
                this.isCompany = true
                this.citation.companyId = null;
                if (this.badgeholder.company !== null) {
                  this.toastr.error("The company " + '"' + this.badgeholder.company + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
                }
                else {
                  this.toastr.error("Company associated with badge# " + '"' + this.badgeholder.badgeNo + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
                }
              }
              this.dtTrigger.next();
              //this.GetCouRecordsList(this.badgeholder.badgeNumber,this.badgeholder.personUniqueId);
              if(this.badgeholder.personUniqueId != null && this.badgeholder.personUniqueId != ""){
                this.GetCouRecordsList(null,this.badgeholder.personUniqueId);
              }else{
                this.GetCouRecordsList(this.badgeholder.badgeNumber,null);
              }
            }
            else {
              //this.spinner.hide();
              this.toastr.warning("Security Badge # does not exist.", "Error");
              this.readonlyBadge = false
              this.isCompany = false
              this.clearBadgeholderInfo();
            }
          } else {
            this.toastr.warning("Security Badge # does not exist.", "Error");
            this.readonlyBadge = false
            this.isCompany = false
            this.clearBadgeholderInfo();
          }

        }, (error: any) => {
          //this.spinner.hide();
          this.toastr.error("Error while fetching Badgeholder information.", "Error");
          this.clearBadgeholderInfo();
        });
      }
      else {
        //this.spinner.hide();
        this.readonlyBadge = false
        this.isCompany = false
        this.clearBadgeholderInfo();
      }
    }
    else {
      //this.spinner.hide();
      this.readonlyBadge = false
      this.isCompany = false
      this.clearBadgeholderInfo();
    }
    this.formatUserEmail();
    
this.addRequiredListItem();
   
  }



  addRequiredListItem(){
     this.ViolationTypesService.GetViolationTypeList().subscribe((response: ViolationTypes[]) => {
      // this.UnfilteredViolationTypes = response.map(x => ({
      //   ...x,
      //   isDisabled: !x.status && x.id !== selectedId
      // }));
      
      const selectedId = Number(this.citation?.violationTypeId);
      this.UnfilteredViolationTypes = response.filter(x =>
        x.status === true || x.id === selectedId
      );

      if (!selectedId) return;

      // Step 3: find that exact item from FULL list
      const requiredItem = response.find(x => x.id === selectedId);

      // Step 4: add ONLY that item if not already present
      if (requiredItem && !this.allViolationTypes.some(x => x.id === requiredItem.id)) {
        this.activeViolationTypes.push(requiredItem);
       
      }
    }, (error: any) => {
      console.log("error list");
    });
  }

  formatDateToMMDDYYYY(dateString: string): string {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensures two digits
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  GetBadgeholderInfo() {
    var badgeNo = this.badgeholder.badgeNo === '' ? "0" : this.badgeholder.badgeNo;
    if (this.badgeholder.badgeNo != "") {
      if (this.badgeholder.badgeNo != undefined) {
        this.readonlyBadge = true
        this.citation.companyId = 0;
        this.NovService.GetBadgeholderInfo(this.badgeholder.badgeNo).subscribe((data: Badgeholder) => {
          if (data != null) {
            this.badgeholder = data as Badgeholder;
            this.citation.securityBadgeNo = this.badgeholder.badgeNo;
            this.citation.violatorFirstName = this.badgeholder.firstName;
            this.citation.violatorLastName = this.badgeholder.lastName;
            this.citation.address = this.badgeholder.address
            this.citation.state = this.badgeholder.state
            this.citation.city = this.badgeholder.city
            this.citation.driversLicenseNo = this.badgeholder.driversLicenseNo
            this.citation.zip = this.badgeholder.zip
            this.citation.licenseState = this.badgeholder.licenseState
            this.formatUserEmail();
            // this.citation.violatorBirthDate = this.datePipe.transform(this.badgeholder.dob, 'MM/dd/yyyy');
            this.badgeholder.dob = this.dateAdapter.toModel(this.fromModel(this.badgeholder.dob));
            //this.badgeholder.licenseExpirationDate = this.dateAdapter.toModel(this.fromModel(this.badgeholder.licenseExpirationDate));
            this.citation.email = this.badgeholder.recpt_email_address;
            var company = this.allCompanyList.find(x => x.companyName == this.badgeholder.company)
            if (company !== undefined) {
              this.citation.companyId = company.id
              this.isCompany = true
            }
            else {
              //this.spinner.hide();
              this.isCompany = true
              this.citation.companyId = null;
              if (this.badgeholder.company !== null) {
                this.toastr.error("The company " + '"' + this.badgeholder.company + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
              }
              else {
                this.toastr.error("Company associated with badge# " + '"' + this.badgeholder.badgeNo + '"' + " is not defined in SEMS Application, please contact SBO.", "Error");
              }
            }
            this.dtTrigger.next();
          }
          else {
            //this.spinner.hide();
            this.toastr.warning("Security Badge # does not exist.", "Error");
            this.readonlyBadge = false
            this.isCompany = false
            this.clearBadgeholderInfo();
          }
        }, (error: any) => {
          //this.spinner.hide();
          this.toastr.error("Error while fetching Badgeholder information.", "Error");
          this.clearBadgeholderInfo();
        });
      }
      else {
        //this.spinner.hide();
        this.readonlyBadge = false
        this.isCompany = false
        this.clearBadgeholderInfo();
      }
    }
    else {
      //this.spinner.hide();
      this.readonlyBadge = false
      this.isCompany = false
      this.clearBadgeholderInfo();
    }
    this.formatUserEmail();
  }

  public clearBadgeholderInfo() {
    this.badgeholder.company = "";
    this.citation.companyId = null;
    this.badgeholder.firstName = "";
    this.badgeholder.lastName = "";
    this.badgeholder.dob = "";
    this.badgeholder.recpt_email_address = "";
    this.badgeholder.driversLicenseNo = "";
    this.badgeholder.state = "";
    this.badgeholder.licenseState
    this.badgeholder.address = "";
    this.badgeholder.city = "";
    this.badgeholder.zip = "";
    this.badgeholder.emailAddress = "";
    this.badgeholder.birthDate = "";
    this.badgeholder.streetAddress = "";
    this.citation.phone = ""

  }

  goToInspectionPage(inspectionRecordNo) {
    if (inspectionRecordNo != 0) {
      this.NovService.goToInspectionPage(inspectionRecordNo).subscribe((response: string) => {
        if (response != null) {
          this.inspectionId = +response;
          this.router.navigate(["admin/inspection/details"], {
            queryParams: { isEdit: 1, citationId: this.citation.id, inspectionId: this.inspectionId },
            skipLocationChange: true,
          });
        }
        else {
          this.toastr.error('This inspection does not exist.', 'Information');
        }
      });
    }
    else {
      this.toastr.error('This inspection does not exist.', 'Information');
    }
  }
  showRequiredPhone(citation) {
    if (citation.email == "" && (citation.phone == "" || citation.phone == undefined)) {
      return true;
    }
    else {
      return false;
    }
  }


  showRequiredEmail(citation) {
    if (this.badgeholder.recpt_email_address == "" && (citation.phone == "" || citation.phone == undefined)) {
      return true;
    }
    else {
      return false;
    }
  }
  formatUserEmail() {
    if ((this.badgeholder.recpt_email_address == "" || this.badgeholder.recpt_email_address == null) && (this.citation.phone == "" || this.citation.phone == undefined)) {
      this.smsSend = 'true';
      this.emailSend = 'true'
    }
    else if ((this.badgeholder.recpt_email_address != "" || this.badgeholder.recpt_email_address != null) && this.citation.phone == "") {
      this.smsSend = 'false';
      this.emailSend = 'true'
    }
    else if ((this.badgeholder.recpt_email_address == "" || this.badgeholder.recpt_email_address == null) && this.citation.phone != "") {
      this.smsSend = 'true';
      this.emailSend = 'false'
    }
    else if ((this.badgeholder.recpt_email_address != "") && this.citation.phone != "") {
      this.smsSend = 'true';
      this.emailSend = 'true'
    }
    else {
      this.smsSend = 'false';
      this.emailSend = 'true'
    }

  }

  checkPhoneRequired() {
    if ((this.badgeholder.recpt_email_address != "" || this.badgeholder.recpt_email_address == null) && (this.citation.phone == "" || this.citation.phone == undefined)) {
      this.smsSend = 'true';
      this.emailSend = 'true'
    }
    else if ((this.badgeholder.recpt_email_address != "" || this.badgeholder.recpt_email_address == null) && this.citation.phone == "") {
      this.smsSend = 'false';
      this.emailSend = 'true'
    }
    else if ((this.badgeholder.recpt_email_address != "" || this.badgeholder.recpt_email_address == null) && this.citation.phone != "") {
      this.smsSend = 'true';
      this.emailSend = 'true'
    }
    else {
      this.smsSend = 'true';
      this.emailSend = 'false'
    }
  }

  openPopup() {
    this.showPopup = true;
    document.body.style.overflow = "hidden";
  }

  closePopup() {
    this.showPopup = false;
    document.body.style.overflow = "auto";
  }
  setCounts() {
    this.couCount = this.pastCou.filter((x) => x.type === "COU").length;
    this.novCount = this.pastCou.filter((x) => x.type === "NOV").length;
  }

  GetCouRecordsList(badgeNo,personUniqueId) {
    this.callCount++;
    console.log("GetCouRecordsList Method called:", this.callCount);

    this.NovService.GetPastCouRecords(badgeNo,personUniqueId).subscribe((res) => {
      {
        //console.log("API DATA:", res);
        const data = res;
        this.pastCou = data.sort((a, b) => b.id - a.id) ;
         this.pastCou.forEach(element => {
          element.violationType =  this.getViolationTypeName(element.violationTypeId) 
          element.citationReason =  this.getCitaionReasonName(element.citationResonId )
          
        });
        this.setCounts();
        this.dataLoaded = true;
      }
    });
  }

   getViolationTypeName(id: number): string {
    if(this.isCitationEdit == "1"){
      const type = this.activeViolationTypes.find((x) => x.id === id);
      return type ? type.violationType : "-";
    }
    else{
      const type = this.allViolationTypes.find((x) => x.id === id);
      return type ? type.violationType : "-";
    }
    
    
  }

  getCitaionReasonName(id: number): string {
    //console.log(this.Filtered);
    const type = this.CitationReasonsFromDb.find((x) => x.id === id);
    return type ? type.reason : "-";
  }
}
