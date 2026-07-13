import { Component, ElementRef, Injectable, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, CanDeactivate, Route, Router } from '@angular/router';
import { DetectionMethod, FromTODate, IncidentAcTypesMaster, IncidentAgency, IncidentAirlineMaster, IncidentAttachmentFiles, IncidentAttachmentTypesMaster, IncidentAttachments, IncidentAttendeesMaster, IncidentCountryMaster, IncidentDisablingMaster, IncidentEvents, IncidentExplosivesMaster, IncidentFirearmInformation, IncidentGunsMaster, IncidentHotWash, IncidentHotwashAdditionalInfo, IncidentHotwashNameMaster, IncidentIncendiariesMaster, IncidentIndividualTypesMaster, IncidentIndividuals, IncidentLocations, IncidentMastersLists, IncidentNotifications, IncidentPassengerInformation, IncidentPerimeterMaster, IncidentProhibitedItems, IncidentReviews, IncidentRootCauseMaster, IncidentSelectedPerimeter, IncidentSharpObjectsMaster, IncidentStatesMaster, IncidentTerminalMaster, IncidentTypes, IncidentVehicleInformation, IncidentreportDetail, NotificationTypes, SelectedAttendees, SelectedDetectionMethod, SelectedHotwashTopic, SelectedInvolvedAgency, SelectedLocation, SelectedLocationDoor, SelectedRepoAgency, SelectedRootCause, files } from '../incidentreport.model';
import { IncidentReportService } from '../incidentreport.service';
import { Toast, ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { CitationDetails, DataOutputModel, MobileViewData } from '@app/pages/novlist/CitationDetails';
import { NovService } from "../../novlist//nov.service";
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { DataOutputModelForIncident, InspetionRecordDetail } from '@app/pages/inspectionrecord/inspectionrecord.model';
import { InspectionrecordService } from '../../inspectionrecord/inspectionrecord.service';
import { element } from 'protractor';
import { runInContext } from 'vm';
import { FormCanDeactivate } from '@app/_helpers/form-can-deactivate/form-can-deactivate';
import { Facilities } from '@app/pages/master/facility';
import { Locations } from '@app/pages/master/locations';
import { LocationService } from '@app/pages/master/location/location.service';
import { FacilityService } from '@app/pages/master/facility/facility.service';
import { EventTypes } from '@app/pages/master/eventtypes';
import { EventTypesService } from '@app/pages/master/eventtypes/eventtype.service';


@Component({
  selector: 'app-incidentreportaddedit',
  templateUrl: './incidentreportaddedit.component.html',
  styleUrls: ['./incidentreportaddedit.component.scss']
})
export class IncidentreportaddeditComponent extends FormCanDeactivate implements OnInit {
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  user: any;
  isClone: String = "";
  readOnlyIncident: boolean = false;
  incidentinfo: IncidentreportDetail = new IncidentreportDetail();
  allIncidentTypeDisplayNameList: IncidentTypes[];
  inspectionId: number;
  inciTypeId: number;
  inciTypeName: string;
  allIncidentLocationList: IncidentLocations[];
  isDirty: boolean = false;
  isEdit:string = ""
  paramincidentId:number = 0
  isSaveFormDetails:boolean = false




  

  isIndividualChange:boolean = false;
  isPassengerChange:boolean = false;
  isProhibitedChange:boolean = false;
  isFirearmChange:boolean = false
  isMotorChange:boolean = false;
  isAttachmentChange:boolean = false;
  isHotwashChange:boolean = false;

  incidentMastersLists: IncidentMastersLists = new IncidentMastersLists();

  selectedLocationList: any[] = [];
  selectedLocationNumber: IncidentLocations[] = [];
  locationDropdownSettings: {};
  showTextForLocation: boolean = false;
  selectedLocation: any[] = []
  incidentPerimeterList: IncidentPerimeterMaster[];
  incidentPerimeterListbyid: IncidentPerimeterMaster[];
  fromToDates: FromTODate = new FromTODate();
  dtTrigger: Subject<any> = new Subject();

  incidentAgencyList: IncidentAgency[];
  agencyDropdownSettings: {}
  selectedAgencyList: any[] = [];
  selectedAgencyNumber: IncidentAgency[] = []
  selectedRepoAgencyList: any[] = [];
  selectedInAgencyList: any[] = [];
  isIncidentSummary: boolean = false;
  showPerimeterDesc: boolean = false;
  showingPerimeterValue = new IncidentSelectedPerimeter();
  showOtherRepo: boolean = false;
  showOtherInvol: boolean = false;
  
  incidentIndividualTypeList: IncidentIndividualTypesMaster[]
  notificationTypes: NotificationTypes[];
  notificationModel = new IncidentNotifications();
  incdentNotification: IncidentNotifications[] = [];
  deletedeventIds: number[] = [];
  isIncidentNotification: boolean = false;
  nonDeleted:IncidentNotifications[] = []

  isIncidentEvent:boolean = false;
  eventTypeList: EventTypes[] = [];
  eventModel = new IncidentEvents();
  incidentEvent:IncidentEvents[] = [];
  deletedncidentEventIds:number[] = [];
  nonDeletedEvents:IncidentEvents[] = [];
  eventValue:boolean = false
  
  isIncidentIndividual: boolean = false;
  incidentIndividual: IncidentIndividuals = new IncidentIndividuals();
  inciIndividual: IncidentIndividuals[] = [];
  incidentId: number;
  showTextForIndividualType: boolean = false;
  deletedIndividualIds: number[] = []
  showTextForIndividual:boolean = false;

  incidentAirlineList: IncidentAirlineMaster[];
  incidentAcTypesList: IncidentAcTypesMaster[];
  isArrested: boolean = false;
  passengerModel = new IncidentPassengerInformation();
  incidentPassenger: IncidentPassengerInformation[] = [];
  isIncidentPassenger: boolean = false;
  isFlightDelay: boolean = false;
  isShowPassengerInvolved: boolean = false;
  noPassengerInvlved: boolean = false;
  deletePassengerIds: number[] = []

  incidentCountryList: IncidentCountryMaster[];
  incidentStatList: IncidentStatesMaster[];
  incidnetTerminalList: IncidentTerminalMaster[];
  incidentExplosivesList: IncidentExplosivesMaster[];
  incidentGunsList: IncidentGunsMaster[];
  incidentSharpObjectsList: IncidentSharpObjectsMaster[];
  incidentIncendiariesList: IncidentIncendiariesMaster[];
  incidentDisablingList: IncidentDisablingMaster[];
  incidentAttachmentTypesList: IncidentAttachmentTypesMaster[];
  isProhabteditemsshow: boolean = false;
  incidentProhibitedModel = new IncidentProhibitedItems();
  incidentProhibiteditem: IncidentProhibitedItems[] = []
  detectionMethodList: DetectionMethod[];
  detectionDropdownSettings = {}
  selectedDetectionList = []
  deleteProhibitedIds: number[] = []

  isFirearminformation: boolean = false;
  incidentFirearmModel = new IncidentFirearmInformation();
  incidentFirearmItem: IncidentFirearmInformation[] = [];
  deleteFireIds: number[] = []

  isVehicleinformation: boolean = false;
  incidentVehicleModel = new IncidentVehicleInformation();
  incidentVehicleItem: IncidentVehicleInformation[] = [];
  deleteVhicleIds: number[] = []

  isAttachInfo: boolean = false;
  incidentAttachModel = new IncidentAttachments();
  incidentAttachItem: IncidentAttachments[] = [];
  showTextForAttachment: boolean = false
  deletedAttachmentIds: number[] = [];

  isHotwashInfo: boolean = false;
  incidentHotWashModel = new IncidentHotWash();
  incidentHotwashItem: IncidentHotWash[] = [];
  isShowAdditionalInfo: boolean = false;
  attendeesList: IncidentAttendeesMaster[];
  attendeesDropdownSettings = {}
  selectedAttendeesList = []

  hotwashList: IncidentHotwashNameMaster[];
  hotwashDropdownSettings = {}
  selectedHotwashList = []
  deletedHotwashIds:number[] = []

  rootcauseRequired:boolean = false;
  rootCauseList: IncidentRootCauseMaster[];
  rootCauseDropdownSettings = {}
  selectedRootcauseList = []

  isReviewInfo: boolean = false;
  incidentReviewModel = new IncidentReviews();
  incidentReviewItem: IncidentReviews[] = [];

  remedialTrainings: Array<IncidentHotwashAdditionalInfo> = [];

  newDynamic: IncidentHotwashAdditionalInfo = new IncidentHotwashAdditionalInfo();
  defaulttimeValue: string
  modalReference: NgbModalRef;
  closeResult: string = "";
  modalOptions: NgbModalOptions;
  citationList: CitationDetails[] = [];
  citationListAll: CitationDetails[] = [];
  dtOptions: any = {};

  showFirst: string
  showFirstSummary: number = 0
  showFirstNotification: number = 0
  showFirstIndividual: number = 0
  showFirstPassenger: number = 0
  showFirstProHibited: number = 0
  showFirstFirearm: number = 0
  showFirstVehicle: number = 0
  showFirstAttach: number = 0
  showFirstHotwash: number = 0
  showFirstReview: number = 0

  isDropdownDisabled: boolean = false
  sortDir = 1; //1= 'ASE' -1= DSC
  queryParam: QueryStringParameters = new QueryStringParameters();
  mobileViewData: MobileViewData = new MobileViewData();
  pageHeaders: PagingHeader = new PagingHeader();
  config: any;
  inspectionList: InspetionRecordDetail[] = [];
  showInspModal: boolean = false;
  showRequiredFiled: boolean = false
  showSubmit:boolean = false;
  view:boolean = false
  showEvacuationDesctext:boolean = false
  isEvacuationRequired:boolean = false
  isStatusRequird:boolean = false;
  files: string[] = [];
  filemodel = new files()
  deletedFiles: string[] = [];
  attachfile = []
  showImage:boolean = false;
  perimeterBreachRequired:boolean = false;
  returcommentrequired:boolean = false
  dateApproved:string

  notificationValue:boolean = false;
  public incidentAttachmentsImg: IncidentAttachmentFiles[] = [];
  public incidentAttachmentsFile: IncidentAttachmentFiles[] = [];
  accordianDiv = "ALL"

  allFacilityList: Facilities[];
  allLocationList: Locations[] = [];
  locationForIncident:Locations[] = [];
  locationDoorlist: Locations[] = [];
  selectedDoorList: Locations[];
  doorDropdownSettings: {};
  selectedDoorGateNumber: Locations[] = [];

  findingDoorList: Locations[];
  findingDoorDropdownSettings: {};

  isFacility: boolean = false;
  isFinding: boolean = false;
  locatonName:Locations[] = []
  oldselectedDoorForIncident: string
  boolndlOptions = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" }
  ]
  genderValue = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" }
  ]
  reviewIncidentStatus = [
    { label: "Approved", value: "Approved" },
    { label: "Returned", value: "Returned" }
  ]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentreportservice: IncidentReportService,
    private toastr: ToastrService,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private NovService: NovService,
    private InspService: InspectionrecordService,
    private locationService: LocationService,
    private facilityService: FacilityService,
    private eventTypesService: EventTypesService,
  ) { 
    super();
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'xl'
    }
  }

  ngOnInit(): void {
    this.mobileViewData.pageSize = 10;
    this.mobileViewData.pageNumber = 1;
    this.mobileViewData.maxPageSize = 10;
    this.config = {
      currentPage: 1,
      itemsPerPage: this.mobileViewData.pageSize,
    };
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.GetIncidentTypeList()  
    this.isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    var isClone: string = this.route.snapshot.pathFromRoot[1].queryParams['isClone'];
    var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
    if(isView == '1'){
      this.view = true
      
    }
    this.incidentinfo.createdDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    this.incidentinfo.updatedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());

    this.incidentinfo.dateOccurred = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    this.incidentinfo.dateReview = this.dateAdapter.toModel(this.ngbCalendar.getToday());

    this.eventModel.userId = this.user.id;
    this.eventModel.userName = this.user.name;
    this.eventModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    this.eventModel.eventTime = this.datePipe.transform((new Date), 'HH:mm');

    if(this.user.rolename == "StaffAdmin"){
      this.dateApproved = this.dateAdapter.toModel(this.ngbCalendar.getToday());
      this.incidentinfo.dateApproved = this.dateApproved
    }

    this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
    this.notificationModel.notifiedTime = this.datePipe.transform((new Date), 'HH:mm');

    this.defaulttimeValue = this.datePipe.transform((new Date), 'HH:mm')
    this.incidentinfo.timeOccurred = this.datePipe.transform((new Date), 'HH:mm');
    this.incidentinfo.timeReview = this.datePipe.transform((new Date), 'HH:mm');

    this.fromToDates.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    this.fromToDates.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), 'd', 30))

    

    this.isArrested = true;
    this.isFlightDelay = true;
    this.showEvacuationDesctext = true
    
    console.log(this.view)
    this.paramincidentId = this.route.snapshot.pathFromRoot[1].queryParams['incidentId'];
    this.isClone = isClone;
    this.inciTypeId = this.route.snapshot.pathFromRoot[1].queryParams['inciTypeId'];
    this.inciTypeName = this.route.snapshot.pathFromRoot[2].queryParams['inciTypeName'];
    this.incidentinfo.incidentType = +this.inciTypeId
    this.incidentinfo.inciType = this.inciTypeName
    
    this.notificationValue = false
    this.GetEventTypeList();
   
    this.GetFacilityListByDoorGate();
    this.GetAllIncidentMastersLists();
    if(this.isEdit == '1'){
      this.isSaveFormDetails = true
      this.notificationValue = true
    }
   
    this.GetCitationListMobileView(0);
    this.GetInspectionListForMobileView();
     
    this.locationDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'incidentLocation',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.agencyDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'reportingAgency',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.detectionDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'detectionMethod',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.attendeesDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'attendeesName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.hotwashDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'hotwashTopicName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    }

    this.rootCauseDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'rootCauseName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    }

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      responsive: true,
      order: [[0, 'desc']],
    }
    this.doorDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "location",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.isDropdownDisabled = true

    

    this.incidentinfo.mediaAttention = '0'
    this.incidentinfo.tsacheckpointClosure = '0'
    this.incidentinfo.evacuation = '0'
    
  }

  public GetIncidentTypeList()
  {
    this.incidentreportservice.GetIncidentTypeList().subscribe((response : IncidentTypes[]) => {
      this.allIncidentTypeDisplayNameList = response;               
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");      
    });    
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModalPeri(templatePerimeter: TemplateRef<any>) {   
    this.showPerimeterDesc = true;
    this.modalService.open(templatePerimeter, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalCategory(templateShowCategory: TemplateRef<any>, id: any) {    
    this.incidentreportservice.GetPerimeterListByid(id).subscribe((response: IncidentPerimeterMaster[]) => {
      this.incidentPerimeterListbyid = response;
      this.modalService.open(templateShowCategory, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    })


  }
  openModal(template: TemplateRef<any>) {
    this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  closedesc() {
    this.modalService.dismissAll();
  }
  public GetCitationList(companyId) {

    $("#dt1").DataTable().destroy();
    this.citationList = [];
    this.citationListAll = [];
    var details = {
      CompanyId: companyId,
      FirstName: "",
      LastName: "",
      DOB: "",
      FromDate: this.dateAdapter.toModel(this.fromModel(this.fromToDates.fromDate)),
      ToDate: this.dateAdapter.toModel(this.fromModel(this.fromToDates.toDate))
    }
    this.NovService.GetCitationDetails(details).subscribe(
      (response: CitationDetails[]) => {
        this.citationList = response;
        this.dtTrigger.next();
      }
      ,
      (error: any) => {
        console.log("error list");
      }
    );
  }

  close() {
    this.modalService.dismissAll();
    this.showInspModal = false;
  }

  basicSearchCitations() {
    if (this.showInspModal == true) {
      this.GetInspectionListForMobileView()
    } else {
      this.GetCitationListMobileView(0)
    }


  }

  public GetCitationListMobileView(companyId) {
    $("#dt1").DataTable().destroy();
    this.citationList = [];
    this.citationListAll = [];
    (this.mobileViewData.CompanyId = companyId),
      (this.mobileViewData.FirstName = ""),
      (this.mobileViewData.LastName = ""),
      (this.mobileViewData.DOB = ""),
      (this.mobileViewData.FromDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.fromDate)
      )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.NovService.GetCitationDetailsNew(this.mobileViewData).subscribe(
      (response: DataOutputModel) => {
        this.citationListAll = response.items;
        this.citationList = response.items;
        this.pageHeaders = response.paging;
        this.dtTrigger.next();
      },
      (error: any) => {
        console.log("error list");        
      }
    );
  }

  onPageChange(newPage: number): void {
    this.mobileViewData.pageNumber = newPage;
    {
      if (this.showInspModal == true) {
        this.GetInspectionListForMobileView()
      } else {
        this.GetCitationListMobileView(0)
      }      
    }
  }
  onPageSizeChange(): void {
    this.mobileViewData.pageSize = +this.mobileViewData.pageSize;
    this.mobileViewData.maxPageSize = +this.mobileViewData.pageSize;
    if (this.showInspModal == true) {
      this.GetInspectionListForMobileView()
    } else {
      this.GetCitationListMobileView(0)
    }    
  }
  searchtable() {
    if (this.showInspModal == true) {
      this.GetInspectionListForMobileView()
    } else {
      this.GetCitationListMobileView(0)
    }
  }

  getAssociNov(id) {
    this.incidentinfo.associatedNovreport = (this.citationList.filter(x => x.id == id)[0].novNo).toString();
    this.isDirty = true;
    this.close();
  }

  openModalInsp(templateInsp: TemplateRef<any>) {    
    this.showInspModal = true;
    this.modalService.open(templateInsp, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  public GetInspectionListForMobileView() {
    //this.spinner.show();
    this.inspectionList = [];
    (this.mobileViewData.FromDate = this.dateAdapter.toModel(
      this.fromModel(this.fromToDates.fromDate)
    )),
      (this.mobileViewData.ToDate = this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDate)
      ));
    this.InspService.GetInspectionListForMobileView(
      this.mobileViewData
    ).subscribe(
      (response: DataOutputModelForIncident) => {
        this.inspectionList = response.items;
        this.pageHeaders = response.paging;
      },
      (error: any) => {
        this.toastr.error("Error while fetching Inspection data", "Error");
      }
    );
  }

  getAssociInsp(id) {
    this.incidentinfo.associatedInspreport = (this.inspectionList.filter(x => x.id == id)[0].inspectionRecordNo).toString();
    this.isDirty = true;
    this.close();

  }
  getCatId(id) {
    this.showingPerimeterValue.selectedcat = this.incidentPerimeterList.filter(x => x.id === id)[0].categoryName.toString()
    this.incidentinfo.perimeterBreach = id
    this.incidentinfo.perimeterBreachName = this.incidentPerimeterList.filter(x => x.id === id)[0].categoryName.toString()
    this.isDirty = true;
    this.close();
  }
  public showDisposition() {
    if (this.incidentIndividual.arrestedbyLeo == "1") {
      this.isArrested = false
    }
    else {
      this.isArrested = true
    }
  }

  public showDelayTime() {
    if (this.passengerModel.isFlightDelayed == "1") {
      this.isFlightDelay = false
    }
    else {
      this.isFlightDelay = true
    }
  }

  public GetEventTypeList() {
    this.eventTypesService.GetEventTypeList().subscribe((response: EventTypes[]) => {
      this.eventTypeList = response;
    }, (error: any) => {
      console.log("error list");
    });
  }

  // public GetIncidentLocationList() {
  //   this.incidentreportservice.GetIncidentLocationList().subscribe((response: IncidentLocations[]) => {
  //     this.allIncidentLocationList = response;
  //   }, (error: any) => {
  //     this.toastr.error(`${error}`, "Error");
  //     //this.spinner.hide();
  //   });
  // }

  public GetLocationListByFacility(facilityId: number) {   
    this.locationService.GetLocationListByFacility(facilityId).subscribe(
      (response: Locations[]) => {
        this.allLocationList = response;
        this.locationForIncident = this.allLocationList.filter(x=> x.inIncident == true)
        if(this.locationForIncident.length == 0){
          this.incidentinfo.incidentDoor = ''
          this.incidentinfo.incidentDoorName = ''
        }
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public onDoorSelect(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    this.selectedDoorGateNumber = this.selectedDoorList;   

    
    let strLocation = "";
    let strLocationNames = ""
    
    this.selectedDoorList.forEach(item => {
      strLocation = strLocation + item.id + ",";
      strLocationNames = strLocationNames + item.location + ",";
       
    });
    var strDoorName = this.selectedDoorList.find(x=>x.facilityName)
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);
   // this.oldselectedDoorForIncident = strDoorName

    this.incidentinfo.incidentDoor = strLocation;
    this.incidentinfo.incidentDoorName = strLocationNames; 
  }

  public onDoorDeselect(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    this.selectedDoorGateNumber = this.selectedDoorList;
    let strLocation = "";
    let strLocationNames = ""
    this.selectedDoorList.forEach(item => {
      strLocation = strLocation + item.id + ",";
      strLocationNames = strLocationNames + item.location + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.incidentDoor = strLocation;
    this.incidentinfo.incidentDoorName = strLocationNames; 

  }

  public onSelectAllDoors(item: any) {
    this.isDirty = true;
    this.findingDoorList = [];
    // this.selectedDoorGateNumber = [];
    // item.forEach((element) => {
    //   this.selectedDoorGateNumber.push(element);
    // });    
    let strLocation = "";
    let strLocationNames = ""
    item.forEach(element => {
      strLocation = strLocation + element.id + ",";
      strLocationNames = strLocationNames + element.location + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.incidentDoor = strLocation;
    this.incidentinfo.incidentDoorName = strLocationNames;

  }

  public onDeSelectAllDoors(item: any) {
    this.isDirty = true;
    this.selectedDoorList = [];
    this.findingDoorList = [];
    this.selectedDoorGateNumber = [];

   
    let strLocation = "";
    let strLocationNames = ""
    item.forEach(element => {
      strLocation = strLocation + element.id + ",";
      strLocationNames = strLocationNames + element.location + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.incidentDoor = strLocation;
    this.incidentinfo.incidentDoorName = strLocationNames;   

  }

  public fillLocation(facilityId: number) {    
    this.incidentinfo.incidentFacilityName = this.allFacilityList.filter(x => x.id === facilityId)[0].facilityName;
    this.selectedDoorList = []
    this.incidentinfo.incidentDoor = ''
    this.incidentinfo.incidentDoorName = ''
    this.GetLocationListByFacility(facilityId);
  }

  public GetFacilityListByDoorGate() {
    this.incidentreportservice.GetFacilityListByDoorGate().subscribe(
      (Response: Facilities[]) => {
        this.allFacilityList = Response;
        //this.checkFacility(inspTypeName);
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
        //this.spinner.hide();
      }
    );
  }

  public GetPerimeterListByid(id) {
    this.incidentreportservice.GetPerimeterListByid(id).subscribe((response: IncidentPerimeterMaster[]) => {
      this.incidentPerimeterListbyid = response;
    })
  }
  showPerimeterValue() {
    this.showPerimeterDesc = true;
  }


  public GetAllIncidentMastersLists(){

    this.incidentreportservice.GetAllIncidentMastersLists().subscribe(
      (data :IncidentMastersLists) => {
        this.incidentMastersLists = data as IncidentMastersLists
        this.allIncidentLocationList = data.incidentLocations
        this.incidentAgencyList = data.incidentAgency
        this.detectionMethodList = data.detectionMethod
        this.attendeesList = data.incidentAttendeesMaster
        this.hotwashList = data.incidentHotwashNameMaster
        this.rootCauseList= data.incidentRootCauseMaster
        this.incidentIndividualTypeList = data.incidentIndividualTypesMaster
        this.incidentAirlineList = data.incidentAirlineMaster
        this.incidentAcTypesList = data.incidentAcTypesMaster
        this.incidentExplosivesList = data.incidentExplosivesMaster
        this.incidentGunsList = data.incidentGunsMaster
        this.incidentSharpObjectsList  = data.incidentSharpObjectsMaster
        this.incidentIncendiariesList = data.incidentIncendiariesMaster
        this.incidentDisablingList = data.incidentDisablingMaster
        this.incidentAttachmentTypesList = data.incidentAttachmentTypesMaster
        this.incidentCountryList = data.incidentCountryMaster
        this.incidentStatList  = data.incidentStatesMaster
        this.incidnetTerminalList  = data.incidentTerminalMaster
        this.incidentPerimeterList = data.incidentPerimeterMaster
        this.notificationTypes = data.notificationTypes  
        this.locationDoorlist = data.locationsDoor      
        if (this.isEdit == "1") {
          this.incidentId = this.paramincidentId;
          this.GetIncidentDetailsById(this.incidentId)
        }else{
          this.incidentinfo.airportOfficial = this.user.name
        }
        if(this.inciTypeName != "" || this.inciTypeName != undefined){
          this.setPerimeterBreachRequired(this.inciTypeName);
        }
        
      }, (error: any) => {
      this.toastr.error(`${error}`, "Masterlist error");
    });
  }

  // public getSelectedDoors(inspectionId) {
  //   this.inspservice
  //     .GetSelectedDoors(inspectionId)
  //     .subscribe((data: Locations[]) => {
  //       this.selectedDoorList = [];
  //       this.selectedDoorGateNumber = [];
  //       this.selectedDoorGateNumber = data as Locations[];
  //       this.selectedDoorList = data as Locations[];
  //     });
  // }
//--------------------------------------#region GetIncidentDetailsById----------------
  async GetIncidentDetailsById(incidentId: number) :Promise<any> {
    return new Promise<void>((resolve, reject) => {
    this.incidentreportservice.GetIncidentDetailsById(incidentId)
      .subscribe(
        (data: IncidentreportDetail) => {

          this.incidentinfo = data as IncidentreportDetail;                         
          this.incidentinfo.dateOccurred = this.datePipe.transform(this.incidentinfo.dateOccurred, 'dd-MM-yyyy');
          this.incidentinfo.dateReview = this.datePipe.transform(this.incidentinfo.dateReview, 'dd-MM-yyyy');
          this.incidentinfo.timeOccurred = this.datePipe.transform(this.incidentinfo.timeOccurred, 'HH:mm');
          this.incidentinfo.timeReview = this.datePipe.transform(this.incidentinfo.timeReview, 'HH:mm');
          if(this.incidentinfo.dateApproved != null || this.incidentinfo.dateApproved != undefined){
            this.incidentinfo.dateApproved = this.datePipe.transform(this.incidentinfo.dateApproved, 'dd-MM-yyyy');
          }else{
            this.incidentinfo.dateApproved  = this.dateApproved 
          }          
          if(this.incidentinfo.evacuation == 'True'){
            this.showEvacuationDesctext = false
          }
          if (this.incidentinfo.otherLocationTextvalue != null) {
            this.showTextForLocation = true
          }
          if (this.incidentinfo.otherReportingvalue != null) {
            this.showOtherRepo = true
          }
          if (this.incidentinfo.otherInvolvedvalue != null) {
            this.showOtherInvol = true
          }
          if (this.incidentinfo.tsacheckpointClosure == 'True') {
            this.incidentinfo.tsacheckpointClosure = '1'
          } else {
            this.incidentinfo.tsacheckpointClosure = '0'
          }
          if (this.incidentinfo.mediaAttention == 'True') {
            this.incidentinfo.mediaAttention = '1'
          } else {
            this.incidentinfo.mediaAttention = '0'
          }
          if (this.incidentinfo.evacuation == 'True') {
            this.incidentinfo.evacuation = '1'
          } else {
            this.incidentinfo.evacuation = '0'
          }
          this.GetLocationListByFacility(data.incidentFacilityId);
          let selectedRepo = []
          let repoids = data.reportingAgency.split(",")
          repoids.forEach(element => {
            let repo = new SelectedRepoAgency()
            repo.id = +element
            let name = this.incidentAgencyList.filter(x => x.id == +element)[0].reportingAgency
            selectedRepo.push({ id: +element, reportingAgency: name })
          });
          this.selectedRepoAgencyList = selectedRepo

          let selectedInvo = []
          let invoids = data.involvedAgency.split(",")
          invoids.forEach(element => {
            let involved = new SelectedInvolvedAgency()
            involved.id = +element
            let name = this.incidentAgencyList.filter(x => x.id == +element)[0].reportingAgency
            selectedInvo.push({ id: +element, reportingAgency: name })
          });
          this.selectedInAgencyList = selectedInvo

          // let selectedL = []
          // let locationids = data.location.split(",")
          // locationids.forEach(element => {
          //   let loc = new SelectedLocation()
          //   loc.id = +element
          //   let name = this.allIncidentLocationList.filter(x => x.id == +element)[0].incidentLocation
          //   selectedL.push({ id: +element, incidentLocation: name })
          // });
          // this.selectedLocationList = selectedL

          
          let selectedD = []
          let doorids = data.incidentDoor.split(",")
          doorids.forEach(element => {
            let dor = new SelectedLocationDoor()
            dor.id = +element
            let name = this.locationDoorlist.filter(x => x.id == +element)[0].location
            selectedD.push({ id: +element, location: name })
          });
          this.selectedDoorList = selectedD

          this.incdentNotification = data.notificationList;
          this.incdentNotification.forEach(element => {          
           element.newDate = element.notifiedDate
           element.newTime = this.onTimeChange(element.notifiedTime)
          });

          this.incidentEvent = data.incidentEvents;
          this.incidentEvent.forEach(element => {          
           element.newDate = element.eventDate
           element.newTime = this.onTimeChange(element.eventTime)
          });

          this.inciIndividual = data.incidentIndividuals
          this.inciIndividual.forEach(element => {            
          })
          this.incidentPassenger = data.incidentPassengerInformation
          this.incidentProhibiteditem = data.incidentProhibitedItems
          this.incidentFirearmItem = data.incidentFirearmInformation
          this.incidentVehicleItem = data.incidentVehicleInformation
          this.incidentAttachItem = data.incidentAttachments
          this.incidentHotwashItem = data.incidentHotWash
          this.incidentHotwashItem.forEach(element => {
            element.newHotwashDate = element.hotwashDate
           // element.hotwashDate = this.datePipe.transform(element.hotwashDate, 'MM/dd/yyyy')
          })
          if(this.incidentEvent.length > 0){
            this.isIncidentEvent = true
          }
          if(this.inciIndividual.length > 0){
            this.isIncidentIndividual = true
          }
          if(this.incidentPassenger.length > 0){
            this.isIncidentPassenger = true
          }
          if(this.incidentProhibiteditem.length > 0){
            this.isProhabteditemsshow = true
            this.GetIncidentDetectionMethodList();
          }
          if(this.incidentFirearmItem.length > 0){
            this.isFirearminformation = true
          }
          if(this.incidentVehicleItem.length > 0){
            this.isVehicleinformation = true
          }
          if(this.incidentAttachItem.length > 0 ){
            this.isAttachInfo = true
          }
          if(this.incidentHotwashItem.length > 0){
            this.isHotwashInfo = true
            this.GetIncidentAttendeesList();
            this.GetIncidentHotwashList();
            this.GetIncidentRootCauseList(); 
          }
          this.isReviewInfo = true;

         
          this.inciTypeId = data.incidentType;
          this.inciTypeName = data.inciType;
          
          //this.setPerimeterBreachRequired(this.inciTypeId);
          this.notificationTypeIdValue(this.notificationModel)
          resolve()
        }, (error: any) => {
          this.toastr.error(`${error}`, "Getting error");
          reject()
        });
      });
  }
//---------------------------------------------------------------------------------------------
//#endregion

  setPerimeterBreachRequired(inciTypeName){
    const substring = "(Security Breach)"
   // this.incidentinfo.incidentTypeName = this.allIncidentTypeDisplayNameList.find(x=>x.id == inciTypeName).incidentType
    if(inciTypeName.includes(substring)){
      this.perimeterBreachRequired = true
    }
   
  }

  setPerimeterBreachRequiredEdit(inciTypeName){
    const substring = "(Security Breach)"
    this.incidentinfo.incidentTypeName = this.allIncidentTypeDisplayNameList.find(x=>x.id == inciTypeName).incidentType
    if(this.incidentinfo.incidentTypeName .includes(substring)){
      this.perimeterBreachRequired = true
    }else{
      this.perimeterBreachRequired = false
    }
   
  }

  clearbreach(){    
    this.incidentinfo.perimeterBreach = ""
    this.incidentinfo.perimeterBreachName = ""
  }
  deleteFile(model,file) {
    
    var ans = confirm("Do you want to delete file ?");
    if (ans == true) {
      this.isDirty = true;
      this.incidentAttachModel = model
     this.files.slice( this.incidentAttachModel.thumbnailImage .indexOf(file), 1)
      this.incidentAttachModel.thumbnailImage.slice( this.incidentAttachModel.thumbnailImage .indexOf(file), 1);
      this.files.splice(+this.incidentAttachModel.thumbnailImage, 1)
      this.deletedFiles.push(file.this.incidentAttachModel.id);
    }
  }

  downloadFile(id: number, fileName: string) {
    this.incidentreportservice.getAttachment(id).subscribe(
      data => {
        this.toastr.success("File is Downloading....Please wait!!")

        const blob = new Blob([data], { type: data.type });        
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

  public onLocationSelect(item: any) {
    if (item.incidentLocation == "Other") {
      this.showTextForLocation = true;
    }
    this.isDirty = true;
    let strLocation = "";
    let strLocationNames = ""
    this.selectedLocationList.forEach(item => {
      strLocation = strLocation + item.id + ",";
      strLocationNames = strLocationNames + item.incidentLocation + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.location = strLocation;
    this.incidentinfo.locationName = strLocationNames;    

  }

  public onLocationDeselect(item: any) {
    if (item.incidentLocation == "Other") {
      this.showTextForLocation = false;
    }
    this.isDirty = true;
    let strLocation = "";
    let strLocationNames = ""
    this.selectedLocationList.forEach(item => {
      strLocation = strLocation + item.id + ",";
      strLocationNames = strLocationNames + item.incidentLocation + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.location = strLocation;
    this.incidentinfo.locationName = strLocationNames;
    
  }

  public onSelectAllLocations(item: any) {
    item.forEach(element => {
      if (element.incidentLocation == "Other") {
        this.showTextForLocation = true;
      }
    });
    this.isDirty = true;
    let strLocation = "";
    let strLocationNames = ""
    item.forEach(element => {
      strLocation = strLocation + element.id + ",";
      strLocationNames = strLocationNames + element.incidentLocation + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.location = strLocation;
    this.incidentinfo.locationName = strLocationNames;
   
  }

  public onDeSelectAllLocations(item: any) {    
    this.showTextForLocation = false;
      
    this.isDirty = true;
    let strLocation = "";
    let strLocationNames = ""
    item.forEach(element => {
      strLocation = strLocation + element.id + ",";
      strLocationNames = strLocationNames + element.incidentLocation + ",";
    });
    strLocation = strLocation.slice(0, -1);
    strLocationNames = strLocationNames.slice(0, -1);

    this.incidentinfo.location = strLocation;
    this.incidentinfo.locationName = strLocationNames;   
  }

  setDirtyFlag() {
    this.isDirty = true;
  }

  setIndividualChangeFlag(){
    this.isIndividualChange = true;
  }
  
  setPassengerChangeFlag(){
    this.isPassengerChange = true
  }
  setProhibitedChangeFlag(){
    this.isProhibitedChange = true;
  }
  setFirearmChangeFlag(){
    this.isFirearmChange = true
  }
  setMotorChangeFlag(){
    this.isMotorChange = true
  }
  setAttachmentChangeFlag(){
    this.isAttachmentChange = true
  }
  setHotwashChangeFlag(){
    this.isHotwashChange = true
  }
  checkBoxChangeTsaNotified(event){
    this.incidentinfo.tsaNotified = event.target.checked
  }
  
  checkStatus(){
    if(this.incidentinfo.incidentStatus == "Returned"){
      this.returcommentrequired = true
    }else{
      this.returcommentrequired = false
    }
  }
  

  public GetIncidentNotiTypeList() {
    this.incidentreportservice.GetIncidentNotiTypeList().subscribe((response: NotificationTypes[]) => {
      this.notificationTypes = response;
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");      
    });
  }


  showTypeTextvalue() {
    if (this.incidentAttachModel.type == 4) {
      this.showTextForAttachment = true;
    } else {
      this.showTextForAttachment = false;
    }
  }
  showTextTypeText() {
    if (this.incidentIndividual.individualType == 7) {
      this.showTextForIndividualType = true;
    }else{
      this.showTextForIndividualType = false;
    }
  }

  showEvacuatonDesc(){
    if(this.incidentinfo.evacuation == '1'){
      this.showEvacuationDesctext = false
      this.isEvacuationRequired = true
    }else{
      this.showEvacuationDesctext = true
      this.isEvacuationRequired = false
    }
   
  }
  //Open-Close sub module start
  public showIncidentSummary(item: any) {    
      
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstSummary = item
    this.isIncidentSummary = !this.isIncidentSummary;
  }
  public showIncidentNotification(item: any) {
    if (this.showFirstNotification != 0) {
      if (this.isIncidentSummary != true) {
        this.isIncidentSummary = this.isIncidentSummary
      } else {
        this.isIncidentSummary = !this.isIncidentSummary
      }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
    }
    this.showFirstNotification = item
    this.isIncidentNotification = !this.isIncidentNotification;

  }

  public showIncidentEvents(item: any) {
    if (this.isIncidentIndividual != true) {
      this.isIncidentIndividual = this.isIncidentIndividual
    }
    else {
      this.isIncidentIndividual = !this.isIncidentIndividual
    }
      
    if (this.isIncidentPassenger != true) {
      this.isIncidentPassenger = this.isIncidentPassenger
    } else {
      this.isIncidentPassenger = !this.isIncidentPassenger
    }
    if (this.isProhabteditemsshow != true) {
      this.isProhabteditemsshow = this.isProhabteditemsshow
    } else {
      this.isProhabteditemsshow = !this.isProhabteditemsshow
    }
    if (this.isFirearminformation != true) {
      this.isFirearminformation = this.isFirearminformation
    } else {
      this.isFirearminformation = !this.isFirearminformation
    }
    if (this.isVehicleinformation != true) {
      this.isVehicleinformation = this.isVehicleinformation
    } else {
      this.isVehicleinformation = !this.isVehicleinformation
    }
    if (this.isAttachInfo != true) {
      this.isAttachInfo = this.isAttachInfo
    } else {
      this.isAttachInfo = !this.isAttachInfo
    }
    if (this.isHotwashInfo != true) {
      this.isHotwashInfo = this.isHotwashInfo
    } else {
      this.isHotwashInfo = !this.isHotwashInfo
    }
    if (this.isReviewInfo != true) {
      this.isReviewInfo = this.isReviewInfo
    } else {
      this.isReviewInfo = !this.isReviewInfo
    }
 
  //this.showFirstIndividual = item;
  this.isIncidentEvent = !this.isIncidentEvent;

}

  public showIncidentIndividual(item: any) {
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstIndividual = item;
    this.isIncidentIndividual = !this.isIncidentIndividual;

  }

  public showIncidentPassenger(item: any) {  
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
    
    //this.showFirstPassenger = item;
    this.isIncidentPassenger = !this.isIncidentPassenger;
  }

  showProhabitedItems(item: any) {    
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
    
    //this.showFirstProHibited = item
    this.isProhabteditemsshow = !this.isProhabteditemsshow;
    this.GetIncidentDetectionMethodList();
  }

  showPassengerInvolved() {
   
    if (this.passengerModel.incidentInvolve == "1") {
      this.isShowPassengerInvolved = true;
    }
    else {
      this.noPassengerInvlved = true;
      this.isShowPassengerInvolved = false;
    }

  }

  showFirearmInfo(item: any) {    
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstFirearm = item;
    this.isFirearminformation = !this.isFirearminformation
  }

  showVehcleInfo(item: any) {    
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstVehicle = item;
    this.isVehicleinformation = !this.isVehicleinformation
  }

  showAtachInfo(item: any) {   
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstAttach = item
    this.isAttachInfo = !this.isAttachInfo
  }

  showHotwash(item: any) {
    if (this.isIncidentEvent != true) {
      this.isIncidentEvent = this.isIncidentEvent
    }
    else {
      this.isIncidentEvent = !this.isIncidentEvent
    }
      
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isReviewInfo != true) {
        this.isReviewInfo = this.isReviewInfo
      } else {
        this.isReviewInfo = !this.isReviewInfo
      }
   
    //this.showFirstHotwash = item
    this.isHotwashInfo = !this.isHotwashInfo
    this.GetIncidentAttendeesList();
    this.GetIncidentHotwashList();
    this.GetIncidentRootCauseList()
  }

  showReview(item: any) {   
      
      if (this.isIncidentIndividual != true) {
        this.isIncidentIndividual = this.isIncidentIndividual
      }
      else {
        this.isIncidentIndividual = !this.isIncidentIndividual
      }
      if (this.isIncidentPassenger != true) {
        this.isIncidentPassenger = this.isIncidentPassenger
      } else {
        this.isIncidentPassenger = !this.isIncidentPassenger
      }
      if (this.isProhabteditemsshow != true) {
        this.isProhabteditemsshow = this.isProhabteditemsshow
      } else {
        this.isProhabteditemsshow = !this.isProhabteditemsshow
      }
      if (this.isFirearminformation != true) {
        this.isFirearminformation = this.isFirearminformation
      } else {
        this.isFirearminformation = !this.isFirearminformation
      }
      if (this.isVehicleinformation != true) {
        this.isVehicleinformation = this.isVehicleinformation
      } else {
        this.isVehicleinformation = !this.isVehicleinformation
      }
      if (this.isAttachInfo != true) {
        this.isAttachInfo = this.isAttachInfo
      } else {
        this.isAttachInfo = !this.isAttachInfo
      }
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
    
    //this.showFirstReview = item
    this.isReviewInfo = !this.isReviewInfo
  }

  notificationTypeIdValue(notificationModel: IncidentNotifications){
    this.notificationModel = notificationModel
    if(this.isEdit == "1"){
      if((this.notificationModel.notificationTypeId != undefined || this.notificationModel.notificationTypeId != null) || this.incidentinfo.notificationList.length != 0){
        this.notificationValue = true
      }else{
        this.notificationValue = false
      }
    }else{
      if((this.notificationModel.notificationTypeId != undefined || this.notificationModel.notificationTypeId != null) ||  this.incidentinfo.notificationList.length != 0){
        this.notificationValue = true
      }else{
        this.notificationValue = false
      }
    }
        
  }

  showAdditionalInfo() {
    if (this.incidentinfo.isIncidentHotwash == '1') {
      this.isShowAdditionalInfo = true;
    } else {
      this.isShowAdditionalInfo = false;
    }

  }
  //Open-Close sub module end





  public GetIncidentDetectionMethodList() {
    this.incidentreportservice.GetIncidentDetectionMethodList().subscribe((response: DetectionMethod[]) => {
      this.detectionMethodList = response;
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });
  }
  onDetectionItemSelect(item: any){
    this.isDirty = true
    this.isProhibitedChange = true;
  }
  onDetectionSelectAll(items: any){
    this.isProhibitedChange = true;
    this.isDirty = true
  }
  onAttendeesItemSelect(item: any){
    this.isDirty = true
    this.isHotwashChange = true
  }
  onAttendeesSelectAll(items:any){
    this.isDirty = true
    this.isHotwashChange = true
  }
  onItemSelect(item: any) {
    this.isDirty = true
    this.isHotwashChange = true;
    
  }

  onSelectAll(items: any) {    
    let strRoot = "";
    let strRootNames = ""
    items.forEach(element => {
      strRoot = strRoot + element.id + ",";
      strRootNames = strRootNames + element.rootCauseName + ",";
    });
    strRoot = strRoot.slice(0, -1);
    strRootNames = strRootNames.slice(0, -1);

    this.incidentHotWashModel.rootCause = strRoot;
    this.incidentHotWashModel.rootCauseName = strRootNames;
    this.isHotwashChange = true;
    this.isDirty = true    
  }

  onItemSelectRepoAgency(item: any) {
    if (item.reportingAgency == 'Other') {
      this.showOtherRepo = true;
    }
    let strrepoAgency = "";
    let strrepoAgencyNames = ""
    this.selectedRepoAgencyList.forEach(item => {
      strrepoAgency = strrepoAgency + item.id + ",";
      strrepoAgencyNames = strrepoAgencyNames + item.reportingAgency + ",";
    });
    strrepoAgency = strrepoAgency.slice(0, -1);
    strrepoAgencyNames = strrepoAgencyNames.slice(0, -1);

    this.incidentinfo.reportingAgency = strrepoAgency;
    this.incidentinfo.reportingAgencyName = strrepoAgencyNames;
    this.isDirty = true
  }

  onSelectAllRepoAgency(item: any) {
    item.forEach(element =>{
      if (element.reportingAgency == 'Other') {
        this.showOtherRepo = true;
      }
    })
   
    let strrepoAgency = "";
    let strrepoAgencyNames = ""
    item.forEach(element => {
      strrepoAgency = strrepoAgency + element.id + ",";
      strrepoAgencyNames = strrepoAgencyNames + element.reportingAgency + ",";
    });
    strrepoAgency = strrepoAgency.slice(0, -1);
    strrepoAgencyNames = strrepoAgencyNames.slice(0, -1);

    this.incidentinfo.reportingAgency = strrepoAgency;
    this.incidentinfo.reportingAgencyName = strrepoAgencyNames;
    this.isDirty = true
  }
  onItemDeSelectRepoAgency(item: any) {
    if (item.reportingAgency == 'Other') {
      this.showOtherRepo = false;
    }
    let strrepoAgency = "";
    let strrepoAgencyNames = ""
    this.selectedRepoAgencyList.forEach(item => {
      strrepoAgency = strrepoAgency + item.id + ",";
      strrepoAgencyNames = strrepoAgencyNames + item.reportingAgency + ",";
    });
    strrepoAgency = strrepoAgency.slice(0, -1);
    strrepoAgencyNames = strrepoAgencyNames.slice(0, -1);

    this.incidentinfo.reportingAgency = strrepoAgency;
    this.incidentinfo.reportingAgencyName = strrepoAgencyNames;
    this.isDirty = true
  }

  onDeSelectAllRepoAgency(item: any) {
    this.showOtherRepo = false;
      
    
    let strrepoAgency = "";
    let strrepoAgencyNames = ""
    item.forEach(element => {
      strrepoAgency = strrepoAgency + element.id + ",";
      strrepoAgencyNames = strrepoAgencyNames + element.reportingAgency + ",";
    });
    strrepoAgency = strrepoAgency.slice(0, -1);
    strrepoAgencyNames = strrepoAgencyNames.slice(0, -1);

    this.incidentinfo.reportingAgency = strrepoAgency;
    this.incidentinfo.reportingAgencyName = strrepoAgencyNames;
    this.isDirty = true
  }

  onItemSelectInvoAgency(item: any) {
    if (item.reportingAgency == 'Other') {
      this.showOtherInvol = true;
    }
    let strInvoAgency = "";
    let strInvoAgencyNames = ""
    this.selectedInAgencyList.forEach(item => {
      strInvoAgency = strInvoAgency + item.id + ",";
      strInvoAgencyNames = strInvoAgencyNames + item.reportingAgency + ",";
    });
    strInvoAgency = strInvoAgency.slice(0, -1);
    strInvoAgencyNames = strInvoAgencyNames.slice(0, -1);

    this.incidentinfo.involvedAgency = strInvoAgency;
    this.incidentinfo.involvedAgencyName = strInvoAgencyNames;
    this.isDirty = true
  }

  onSelectAllInvoAgency(item: any) {
    item.forEach(element => {
      if (element.reportingAgency == 'Other') {
        this.showOtherInvol = true;
      }
    });
    let strInvoAgency = "";
    let strInvoAgencyNames = ""
    item.forEach(element => {
      strInvoAgency = strInvoAgency + element.id + ",";
      strInvoAgencyNames = strInvoAgencyNames + element.reportingAgency + ",";
    });
    strInvoAgency = strInvoAgency.slice(0, -1);
    strInvoAgencyNames = strInvoAgencyNames.slice(0, -1);

    this.incidentinfo.involvedAgency = strInvoAgency;
    this.incidentinfo.involvedAgencyName = strInvoAgencyNames;
    this.isDirty = true
  }
  onItemDeSelectInvoAgency(item: any) {
    if (item.reportingAgency == 'Other') {
      this.showOtherInvol = false;
    }
    let strInvoAgency = "";
    let strInvoAgencyNames = ""
    this.selectedInAgencyList.forEach(item => {
      strInvoAgency = strInvoAgency + item.id + ",";
      strInvoAgencyNames = strInvoAgencyNames + item.reportingAgency + ",";
    });
    strInvoAgency = strInvoAgency.slice(0, -1);
    strInvoAgencyNames = strInvoAgencyNames.slice(0, -1);

    this.incidentinfo.involvedAgency = strInvoAgency;
    this.incidentinfo.involvedAgencyName = strInvoAgencyNames;
    this.isDirty = true
  }

  onDeSelectAllInvoAgency(item: any) {
    this.showOtherInvol = false;
     
    let strInvoAgency = "";
    let strInvoAgencyNames = ""
    item.forEach(element => {
      strInvoAgency = strInvoAgency + element.id + ",";
      strInvoAgencyNames = strInvoAgencyNames + element.reportingAgency + ",";
    });
    strInvoAgency = strInvoAgency.slice(0, -1);
    strInvoAgencyNames = strInvoAgencyNames.slice(0, -1);

    this.incidentinfo.involvedAgency = strInvoAgency;
    this.incidentinfo.involvedAgencyName = strInvoAgencyNames;
    this.isDirty = true
  }

  onItemSelectTopic(item: any) {
    if (item.hotwashTopicName == 'Root Cause Analysis') {
      this.rootcauseRequired = true
    }    
    this.isDirty = true
    this.isHotwashChange = true
  }

  onSelectAllTopic(items: any) {   
    items.forEach(element => {
      if (element.hotwashTopicName == "Root Cause Analysis") {
        this.rootcauseRequired = true
      }else{
        this.rootcauseRequired = false
      }
    });
    this.isHotwashChange = true
    this.isDirty = true
  }
  onItemDeselectTopic(item: any) {
    if (item.hotwashTopicName == 'Root Cause Analysis') {
      this.rootcauseRequired = false
    } 
    this.isDirty = true
    this.isHotwashChange = true
  }
  onItemDeselectTopicAll(items: any) {   
    this.rootcauseRequired = false
    this.isDirty = true
    this.isHotwashChange = true
  }

  public GetIncidentAttendeesList() {
    this.incidentreportservice.GetIncidentAttendeesList().subscribe((response: IncidentAttendeesMaster[]) => {
      this.attendeesList = response;
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");
      
    });
  }

  public GetIncidentHotwashList() {
    this.incidentreportservice.GetIncidentHotwashList().subscribe((response: IncidentHotwashNameMaster[]) => {
      this.hotwashList = response;
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");
      
    });
  }

  public GetIncidentRootCauseList() {
    this.incidentreportservice.GetIncidentRootCauseList().subscribe((response: IncidentRootCauseMaster[]) => {
      this.rootCauseList = response;
    }, (error: any) => {
      this.toastr.error(`${error}`, "Error");
      
    });
  }

  setontvalue() {
    if (this.incidentIndividual.referralIssue == "1") {
      this.showRequiredFiled = true
    } else {
      this.showRequiredFiled = false
    }
  }
//--------------------------------------------------------------------------------------------------------------
  //#region ADD NOTIFICATION TO DB
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

  timeConversion(notifiedTime: string) {   
    var hours = Number(notifiedTime.match(/^(\d+)/)[1]);
    var minutes = Number(notifiedTime.match(/:(\d+)/)[1]);
    var AMPM = notifiedTime.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;
    return (sHours + ":" + sMinutes);
   
  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    return month + "-" + day + "-" + year;
   }

  resetEventModel() {
    // Reset
    this.notificationModel = new IncidentNotifications();

    this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    this.notificationModel.notifiedTime = this.datePipe.transform((new Date), 'HH:mm');   
  }

  getEventName(notificationTypeId: number) {
    return this.notificationTypes.filter(x => x.id == notificationTypeId)[0].notificationName;
  }

  onEditClick(index: any, model: IncidentNotifications) {
    this.notificationModel = model
    this.notificationModel.inedit = true;
    this.notificationModel.newDate = this.notificationModel.notifiedDate
   // this.notificationModel.notifiedDate = this.datePipe.transform(this.notificationModel.notifiedDate, 'dd-MM-yyyy');
   var find = "/";
        var re = new RegExp(find, "g");
        var badgeDOB = model.notifiedDate.replace(re, "-");
        this.notificationModel.notifiedDate = this.dateAdapter.toModel(
          this.fromModel(badgeDOB)
        );

    if(this.notificationModel.id > 0){
      this.notificationModel.notifiedTime = this.notificationModel.notifiedTime
    }else{
      this.notificationModel.notifiedTime = this.timeConversion(this.notificationModel.notifiedTime)
    }    
  }



  validateAndAddNotificationRecord(notificationModel: IncidentNotifications) {
    if (this.validateNotificationRecord()) {
      this.notificationModel = notificationModel
      this.notificationModel.notifiedTime =  this.onTimeChange(this.notificationModel.notifiedTime)
      this.notificationModel.incidentId = this.incidentId;
      this.notificationModel.inedit = false
      this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.fromModel(this.notificationModel.notifiedDate));
      this.notificationModel.newDate = this.notificationModel.notifiedDate
      this.notificationModel.newTime = this.notificationModel.notifiedTime
      this.notificationModel.officialNotified = this.notificationTypes.filter(x => x.id === this.notificationModel.notificationTypeId)[0].notificationName;
      this.notificationModel.notificationTypeId = notificationModel.notificationTypeId
      const copyEvent = { ...this.notificationModel };
      
      this.incidentinfo.notificationList.push(copyEvent);
      this.incidentinfo.notificationEdited = "Added";
      
      this.notificationTypeIdValue(notificationModel)
     
      this.resetEventModel();
    }
  }

  UpdateEventRecord(notificationModel: IncidentNotifications, flag) {
    this.notificationModel = notificationModel;
    this.notificationModel.inedit = false
    this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.fromModel(this.notificationModel.notifiedDate));
    this.notificationModel.newDate = this.notificationModel.notifiedDate  
    this.notificationModel.newTime = this.onTimeChange(this.notificationModel.notifiedTime)
   // this.notificationModel.notifiedTime = (this.notificationModel.notifiedTime), 'HH:mm';
    if (+notificationModel.notificationTypeId > 0) {
      notificationModel.officialNotified = this.getEventName(+notificationModel.notificationTypeId)
    }     
    this.resetEventModel();
  }


  deleteEvent(indexid:number,event: IncidentNotifications) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incdentNotification.findIndex((x => x.id == event.id))
        this.incdentNotification.splice(index, 1)
        this.nonDeleted = this.incdentNotification
       
        this.deletedeventIds.push(event.id)
        this.notificationModel = event
        this.notificationModel = new IncidentNotifications()
        this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
        
        this.notificationTypeIdValue(this.notificationModel)
      }else{
        this.incidentinfo.notificationList.splice(indexid, 1)
        this.incidentinfo.notificationList = this.incidentinfo.notificationList
        this.notificationValue = false
        this.notificationModel = event
        this.notificationModel = new IncidentNotifications()
        this.notificationModel.notifiedDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
        
        this.notificationTypeIdValue(this.notificationModel)
      }
      
    }
    else {

    }

  }

  cancelEventUpdate(notificationModel: IncidentNotifications) {
    this.resetEventModel();
    notificationModel.inedit = false
    var index = this.incdentNotification.findIndex((x => x.id == notificationModel.id))
    this.incdentNotification[index].inedit = notificationModel.inedit
    this.incidentinfo.notificationList[index].inedit = notificationModel.inedit
  }

  validateNotificationRecord() {
    return (
      this.notificationModel.notificationTypeId !== undefined &&
      this.notificationModel.notifiedBy !== null
    );
  }

  clearNotofication(){
    this.resetEventModel();
    if(this.isEdit != "1"){
      this.notificationValue = false
    this.notificationValue = false
    }
  }

  //#endregion  
  //--------------------------------------------------------------------------------------------------
  //#region ADD INCIDENT EVENT TO DB
  eventTypeIdValue(eventModel: IncidentEvents){
    this.eventModel = eventModel
    if(this.isEdit == "1"){
      if((this.eventModel.eventTypeId != undefined || this.eventModel.eventTypeId != null) || this.incidentinfo.incidentEvents.length != 0){
        this.eventValue = true
      }else{
        this.eventValue = false
      }
    }else{
      if((this.eventModel.eventTypeId != undefined || this.eventModel.eventTypeId != null) ||  this.incidentinfo.incidentEvents.length != 0){
        this.eventValue = true
      }else{
        this.eventValue = false
      }
    }
        
  }

  resetIncidentEventModel() {
    // Reset
    this.eventModel = new IncidentEvents();

    this.eventModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())
    this.eventModel.eventTime = this.datePipe.transform((new Date), 'HH:mm');   
  }

  getIncidentEventName(eventTypeId: number) {
    return this.eventTypeList.filter(x => x.id == eventTypeId)[0].type;
  }

  onEventEditClick(index: any, model: IncidentEvents) {
    this.eventModel = model
    this.eventModel.inedit = true;
    this.eventModel.newDate = this.eventModel.eventDate
  
   var find = "/";
        var re = new RegExp(find, "g");
        var badgeDOB = model.eventDate.replace(re, "-");
        this.eventModel.eventDate = this.dateAdapter.toModel(
          this.fromModel(badgeDOB)
        );

    if(this.eventModel.id > 0){
      this.eventModel.eventTime = this.eventModel.eventTime
    }else{
      this.eventModel.eventTime = this.timeConversion(this.eventModel.eventTime)
    }    
  }

  validateAndAddEventRecord(eventModel: IncidentEvents) {
    if (this.validateIncidentEventRecord()) {
      this.eventModel = eventModel
      this.eventModel.eventTime =  this.onTimeChange(this.eventModel.eventTime)
      this.eventModel.incidentId = this.incidentId;
      this.eventModel.inedit = false
      this.eventModel.eventDate = this.dateAdapter.toModel(this.fromModel(this.eventModel.eventDate));
      this.eventModel.newDate = this.eventModel.eventDate
      this.eventModel.newTime = this.eventModel.eventTime
      this.eventModel.eventTypeName = this.eventTypeList.filter(x => x.id === this.eventModel.eventTypeId)[0].type;
      this.eventModel.eventTypeId = eventModel.eventTypeId
      const copyEvent = { ...this.eventModel };
      
      this.incidentinfo.incidentEvents.push(copyEvent);
      //this.incidentinfo.notificationEdited = "Added";
      
      //this.eventTypeIdValue(this.eventModel)
     
      this.resetIncidentEventModel();
    }else{
      this.toastr.error('Please enter data in required fileds.', 'Information');
    }
      

      
  }

  UpdateIncidentEventRecord(eventModel: IncidentEvents, flag) {
    this.eventModel = eventModel;
    this.eventModel.inedit = false
    this.eventModel.eventDate = this.dateAdapter.toModel(this.fromModel(this.eventModel.eventDate));
    this.eventModel.newDate = this.eventModel.eventDate  
    this.eventModel.newTime = this.onTimeChange(this.eventModel.eventTime)
   
    if (+eventModel.eventTypeId > 0) {
      eventModel.eventTypeName = this.getIncidentEventName(+eventModel.eventTypeId)
    }     
    this.resetIncidentEventModel();
  }


  deleteIncidentEvent(indexid:number,event: IncidentEvents) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentEvent.findIndex((x => x.id == event.id))
        this.incidentEvent.splice(index, 1)
        this.nonDeletedEvents = this.incidentEvent
       
        this.deletedncidentEventIds.push(event.id)
        this.eventModel = event
        this.eventModel = new IncidentEvents()
        this.eventModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
        
        //this.eventTypeIdValue(this.eventModel)
      }else{
        this.incidentinfo.incidentEvents.splice(indexid, 1)
        this.incidentinfo.incidentEvents = this.incidentinfo.incidentEvents
       // this.notificationValue = false
        this.eventModel = event
        this.eventModel = new IncidentEvents()
        this.eventModel.eventDate = this.dateAdapter.toModel(this.ngbCalendar.getToday());
        
        //this.eventTypeIdValue(this.eventModel)
      }
      
    }
    else {

    }

  }

  // cancelEventUpdate(notificationModel: IncidentNotifications) {
  //   this.resetEventModel();
  //   notificationModel.inedit = false
  //   var index = this.incdentNotification.findIndex((x => x.id == notificationModel.id))
  //   this.incdentNotification[index].inedit = notificationModel.inedit
  //   this.incidentinfo.notificationList[index].inedit = notificationModel.inedit
  // }

  validateIncidentEventRecord() {
    return (
      this.eventModel.eventTypeId !== undefined 
    );
  }

  clearEvent(){
    this.resetIncidentEventModel();
    if(this.isEdit != "1"){
      this.eventValue = false
   
    }
  }

  //#endregion
  //----------------------------------------------------------------------------------------------
  //#region ADD INDIVIDUAL INFORMATION TO DB
  validateIndividualRecord() {
    return (
      this.incidentIndividual.individualType !== undefined
    );
  }
  validateIndividual() {
    return (
      this.incidentIndividual.firstName != undefined && this.incidentIndividual.lastName != undefined &&
      this.incidentIndividual.birthDate != undefined && this.incidentIndividual.gender != undefined
    )
  }

  resetIndivudualModel() {
    // Reset
    this.incidentIndividual = new IncidentIndividuals();
    this.showRequiredFiled = false
    this.isIndividualChange  = false
  }

  validateAndAddIndividualRecord(flag): boolean {
    if (this.validateIndividualRecord()) {
      if (this.incidentIndividual.referralIssue == '1') {
        if (this.validateIndividual()) {
          this.incidentIndividual.incidentId = this.incidentId;
          this.isDirty = true
            this.incidentIndividual.expirationDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.expirationDate));
            this.incidentIndividual.dlexpiringDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.dlexpiringDate));
            this.incidentIndividual.birthDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.birthDate));
            this.incidentIndividual.individualTypeName = this.incidentIndividualTypeList.filter(x => x.id === this.incidentIndividual.individualType)[0].individualTypeName;
            if(this.incidentIndividual.country != undefined){
              this.incidentIndividual.countryName = this.incidentCountryList.filter(x => x.id === this.incidentIndividual.country)[0].country;
            
            }
            if( this.incidentIndividual.dlissuingState != undefined)
            {
              this.incidentIndividual.dlissuingStateName = this.incidentStatList.filter(x => x.id === this.incidentIndividual.dlissuingState)[0].state;

            }
            
            const copyEvent = { ...this.incidentIndividual };
            this.incidentinfo.incidentIndividuals.push(copyEvent);
           
           // this.inciIndividual.push(this.incidentIndividual);
            this.resetIndivudualModel();
          

          // }
          return true;
        } else {
          if (flag == 1) {
            this.toastr.error('Please enter data in required fileds.', 'Information');

            return false;
          }
          if (flag == 0) {

          }
        }
      } else {

        this.incidentIndividual.incidentId = this.incidentId;  
        this.isDirty = true      
          this.incidentIndividual.expirationDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.expirationDate));
          this.incidentIndividual.dlexpiringDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.dlexpiringDate));
          this.incidentIndividual.birthDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.birthDate));
          this.incidentIndividual.individualTypeName = this.incidentIndividualTypeList.filter(x => x.id === +this.incidentIndividual.individualType)[0].individualTypeName;
          if(this.incidentIndividual.country != undefined){
            this.incidentIndividual.countryName = this.incidentCountryList.filter(x => x.id === this.incidentIndividual.country)[0].country;
          
          }
          if( this.incidentIndividual.dlissuingState != undefined)
          {
            this.incidentIndividual.dlissuingStateName = this.incidentStatList.filter(x => x.id === this.incidentIndividual.dlissuingState)[0].state;

          }
          const copyEvent = { ...this.incidentIndividual };
          this.incidentinfo.incidentIndividuals.push(copyEvent);
          this.resetIndivudualModel();
        
        return true;
      }
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select Individual type.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  getindividualType(individualType: number) {
    return this.incidentIndividualTypeList.filter(x => x.id == individualType)[0].individualTypeName;
  }

  UpdateIndividualRecord(incidentIndividual: IncidentIndividuals, flag) {
    this.incidentIndividual = incidentIndividual;
    this.incidentIndividual.inedit = false
    this.isDirty = true
    this.incidentIndividual.expirationDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.expirationDate));
    this.incidentIndividual.dlexpiringDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.dlexpiringDate));
    this.incidentIndividual.birthDate = this.dateAdapter.toModel(this.fromModel(this.incidentIndividual.birthDate));
    if(this.incidentIndividual.country != 0){
      this.incidentIndividual.countryName = this.incidentCountryList.filter(x => x.id === this.incidentIndividual.country)[0].country;
    
    }
    if( this.incidentIndividual.dlissuingState != 0)
    {
      this.incidentIndividual.dlissuingStateName = this.incidentStatList.filter(x => x.id === this.incidentIndividual.dlissuingState)[0].state;

    }     
    if (+incidentIndividual.individualType > 0) {
      incidentIndividual.individualTypeName = this.getindividualType(+incidentIndividual.individualType)
    }
    this.resetIndivudualModel();   

  }

  deleteIndividual(indexid:number,event: IncidentIndividuals) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id>0){
        var index = this.inciIndividual.findIndex((x => x.id == event.id))
        this.inciIndividual.splice(index, 1)
        //this.incidentinfo.incidentIndividuals.splice(index, 1)
        this.deletedIndividualIds.push(event.id)
      }else{
        this.incidentinfo.incidentIndividuals.splice(indexid, 1)
        this.incidentinfo.incidentIndividuals = this.incidentinfo.incidentIndividuals
        
      }
    }
    else {

    }

  }

  cancelIndividualUpdate(incidentIndividual: IncidentIndividuals) {
    this.resetIndivudualModel();
    incidentIndividual.inedit = false
    var index = this.inciIndividual.findIndex((x => x.id == incidentIndividual.id))
    this.inciIndividual[index].inedit = incidentIndividual.inedit
    this.incidentinfo.incidentIndividuals[index].inedit = incidentIndividual.inedit
  }

  onIndividualEditClick( index: number, model: IncidentIndividuals) {   
      this.incidentIndividual = model
      this.incidentIndividual.inedit = true 
      this.isDirty = true   
      this.isIndividualChange  = false
      this.incidentIndividual.birthDate = this.datePipe.transform(this.incidentIndividual.birthDate, 'dd-MM-yyyy');
      this.incidentIndividual.dlexpiringDate = this.datePipe.transform(this.incidentIndividual.dlexpiringDate, 'dd-MM-yyyy');
      this.incidentIndividual.expirationDate = this.datePipe.transform(this.incidentIndividual.expirationDate, 'dd-MM-yyyy');      
      if(this.incidentIndividual.referralIssue == '1'){
        this.showRequiredFiled = true
      }
      if (this.incidentIndividual.individualType == 7 && this.incidentIndividual.otherIndividualTypevalue != '') {
      this.showTextForIndividualType = true
    }
    
  }

  clearIndividuals(){
    this.resetIndivudualModel();
  }
  //#endregion  
  //------------------------------------------------------------------------------------------------------------
  //#region ADD AIRLINE PASSENGER INTO DB
  validatePassengerRecord() {
    if(this.passengerModel.airline == undefined){
      return false
    }else if(this.passengerModel.airline == null){
      return true
    }
    else{
      return true
    }
  }

  validateAndAddPassengerRecord(flag): boolean {
    if (this.validatePassengerRecord()) {
      this.passengerModel.incidentId = this.incidentId;
      this.isDirty = true
      this.passengerModel.airlineName = this.incidentAirlineList.filter(x => x.id === +this.passengerModel.airline)[0].airlineName;
      if (this.passengerModel.acType != undefined) {
        this.passengerModel.acTypeName = this.incidentAcTypesList.filter(x => x.id === +this.passengerModel.acType)[0].actypeName;
      }
      if (this.passengerModel.terminal != undefined) {
        this.passengerModel.terminalName = this.incidnetTerminalList.filter(x => x.id === +this.passengerModel.terminal)[0].terminalName;
      }
      const copyEvent = { ...this.passengerModel };
      this.incidentinfo.incidentPassengerInformation.push(copyEvent);
      this.isPassengerChange = false; 
      //this.incidentPassenger.push(this.passengerModel);
      this.resetPassengerModel();
      
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select Airline.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  resetPassengerModel() {
    this.passengerModel = new IncidentPassengerInformation();
    this.isPassengerChange = false; 
  }

  getairlineType(airLine: number) {
    return this.incidentAirlineList.filter(x => x.id == airLine)[0].airlineName;
  }

  getacType(actype: number) {
    return this.incidentAcTypesList.filter(x => x.id == actype)[0].actypeName;
  }

  getterminalType(terminal: number) {
    return this.incidnetTerminalList.filter(x => x.id == terminal)[0].terminalName;
  }

  UpdatePassengerRecord(passengerModel: IncidentPassengerInformation, flag) { 
    if (this.validatePassengerRecord()) {
      this.passengerModel = passengerModel
      this.passengerModel.inedit = false
      this.isDirty = true
      if (+this.passengerModel.airline > 0) {
        this.passengerModel.airlineName = this.getairlineType(+this.passengerModel.airline)
      }
      if (+this.passengerModel.acType > 0) {
        this.passengerModel.acTypeName = this.getacType(+this.passengerModel.acType)
      }
      if (+this.passengerModel.terminal > 0) {
       this.passengerModel.terminalName = this.getterminalType(+this.passengerModel.terminal)      
      }
      if(this.passengerModel.acType == null ){
        this.passengerModel.acTypeName = ""
      }
      if(this.passengerModel.airline == null ){
        this.passengerModel.airlineName = ""
      }
      if(this.passengerModel.terminal == null ){
        this.passengerModel.terminalName = ""
      }
      this.resetPassengerModel();
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select Airline.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  deletePassenger(indexid:number,event: IncidentPassengerInformation) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentPassenger.findIndex((x => x.id == event.id))
        this.incidentPassenger.splice(index, 1)
        //this.incidentinfo.incidentPassengerInformation.splice(index, 1)
        this.deletePassengerIds.push(event.id)
      }else{
        this.incidentinfo.incidentPassengerInformation.splice(indexid, 1)
        this.incidentinfo.incidentPassengerInformation = this.incidentinfo.incidentPassengerInformation
        
      }
    }
    else {

    }

  }

  cancelPassengerUpdate(passengerModel: IncidentPassengerInformation) {
    this.resetPassengerModel();
    passengerModel.inedit = false
    var index = this.incidentPassenger.findIndex((x => x.id == passengerModel.id))
    this.incidentPassenger[index].inedit = passengerModel.inedit
    this.incidentinfo.incidentPassengerInformation[index].inedit = passengerModel.inedit
  }

  onPassengerEditClick( index: number, model: IncidentPassengerInformation) {
      this.passengerModel = model
      this.passengerModel.inedit = true  
      this.isDirty = true 
      if (this.passengerModel.isFlightDelayed == "1") {
        this.isFlightDelay = false
      }
      else {
        this.isFlightDelay = true
      }
  }

  clearPassenger(){
    this.resetPassengerModel();
  }
  //#endregion
  //------------------------------------------------------------------------------------------------------------------------------
  //#region ADD PROHIBITED ITEMS INTO DATABASE
  validateAndAddProhibitedItemsRecord(flag): boolean {
    if (this.validateProhibited()) {
      if (this.validateProhibitedDetection()) {
        this.incidentProhibitedModel.incidentId = this.incidentId;
        this.isDirty = true
        let strdmethod = "";
        let strdmethodNames = ""
        this.selectedDetectionList.forEach(element => {
          strdmethod = strdmethod + element.id + ",";
          strdmethodNames = strdmethodNames + element.detectionMethod + ",";
        });
        strdmethod = strdmethod.slice(0, -1);
        strdmethodNames = strdmethodNames.slice(0, -1);

        this.incidentProhibitedModel.detectionMethod = strdmethod;
        this.incidentProhibitedModel.detectionMethodName = strdmethodNames;
        if (this.incidentProhibitedModel.explosives != undefined) {
          this.incidentProhibitedModel.explosivesName = this.incidentExplosivesList.filter(x => x.id === +this.incidentProhibitedModel.explosives)[0].explosiveTypeName;
        }
        if (this.incidentProhibitedModel.guns != undefined) {
          this.incidentProhibitedModel.gunsName = this.incidentGunsList.filter(x => x.id === +this.incidentProhibitedModel.guns)[0].gunTypeName;

        }
        if (this.incidentProhibitedModel.incendiaries != undefined) {
          this.incidentProhibitedModel.incendiariesName = this.incidentIncendiariesList.filter(x => x.id === +this.incidentProhibitedModel.incendiaries)[0].incendiarieName;

        }
        if (this.incidentProhibitedModel.sharpObjects != undefined) {
          this.incidentProhibitedModel.sharpObjectsName = this.incidentSharpObjectsList.filter(x => x.id === +this.incidentProhibitedModel.sharpObjects)[0].sharpObjectName;

        }
        if (this.incidentProhibitedModel.disabling != undefined) {
          this.incidentProhibitedModel.disablingName = this.incidentDisablingList.filter(x => x.id === +this.incidentProhibitedModel.disabling)[0].disablingName;

        }

        const copyEvent = { ...this.incidentProhibitedModel };
        this.incidentinfo.incidentProhibitedItems.push(copyEvent);
      
        let selectedC = []
        let dtectionids = this.incidentProhibitedModel.detectionMethod.split(",")
        dtectionids.forEach(element => {
          let dmethod = new SelectedDetectionMethod()
          dmethod.id = +element
          let name = this.detectionMethodList.filter(x => x.id == +element)[0].detectionMethod
          selectedC.push({ id: +element, detectionMethod: name })
        });
        this.selectedDetectionList = selectedC


        //this.incidentProhibiteditem.push(this.incidentProhibitedModel);
        this.resetProhibitedModel();
       
        
      }
      else {
        if (flag == 1) {
          this.toastr.error('Please select Detection method.', 'Information');

          return false;
        }
        if (flag == 0) {

        }
      }
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select any one prohibited item type .', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }

  }

  validateProhibitedDetection() {
    return (
      this.selectedDetectionList.length != 0
    )
  }
  validateProhibitedForUpdate(){
    if (this.incidentProhibitedModel.explosives !== null || this.incidentProhibitedModel.disabling !== null
      || this.incidentProhibitedModel.guns != null || this.incidentProhibitedModel.sharpObjects !== null || 
      this.incidentProhibitedModel.incendiaries !== null) {
      return true
    }
    return false
  }

  validateProhibited() {
    if(this.incidentProhibitedModel.explosives != undefined || this.incidentProhibitedModel.explosives != null){
      return  true
    }else if(this.incidentProhibitedModel.disabling != undefined || this.incidentProhibitedModel.disabling != null){
      return true
    }else if(this.incidentProhibitedModel.guns != undefined || this.incidentProhibitedModel.guns != null){
      return true
    }else if(this.incidentProhibitedModel.sharpObjects != undefined || this.incidentProhibitedModel.sharpObjects != null){
      return true
    }else if(this.incidentProhibitedModel.incendiaries != undefined || this.incidentProhibitedModel.incendiaries != null){
      return true
    }else{
      return false
    }
    // if (this.incidentProhibitedModel.explosives !== undefined || this.incidentProhibitedModel.disabling !== undefined
    //   || this.incidentProhibitedModel.guns != undefined || this.incidentProhibitedModel.sharpObjects != undefined
    //   || this.incidentProhibitedModel.incendiaries != undefined) {
    //   return true
    // }
    
  }

  resetProhibitedModel() {
    this.selectedDetectionList = []
    this.incidentProhibitedModel = new IncidentProhibitedItems()
    this.isProhibitedChange = false
  }

  getExplosiveType(explosive: number) {
    return this.incidentExplosivesList.filter(x => x.id == explosive)[0].explosiveTypeName;
  }

  getGunsType(gun: number) {
    return this.incidentGunsList.filter(x => x.id == gun)[0].gunTypeName;
  }

  getSharpObjectsType(sharpObj: number) {
    return this.incidentSharpObjectsList.filter(x => x.id == sharpObj)[0].sharpObjectName;
  }

  getIncendiariesType(incen: number) {
    return this.incidentIncendiariesList.filter(x => x.id == incen)[0].incendiarieName;
  }

  getDisablingType(disable: number) {
    return this.incidentDisablingList.filter(x => x.id == disable)[0].disablingName;
  }
  getDetectionType(disable: string) {
    let strdmethod = "";
        let strdmethodNames = ""
        this.selectedDetectionList.forEach(element => {
          strdmethod = strdmethod + element.id + ",";
          strdmethodNames = strdmethodNames + element.detectionMethod + ",";
        });
        strdmethod = strdmethod.slice(0, -1);
        strdmethodNames = strdmethodNames.slice(0, -1);
        this.incidentProhibitedModel.detectionMethod = strdmethod;
        this.incidentProhibitedModel.detectionMethodName = strdmethodNames;  
    
  }

  UpdateProhibitedRecord(incidentProhibitedModel: IncidentProhibitedItems, flag) {
    if (this.validateProhibitedForUpdate()) {
      if (this.validateProhibitedDetection()) {
        this.incidentProhibitedModel = incidentProhibitedModel
        this.incidentProhibitedModel.inedit = false
        this.isDirty = true
        this.isProhibitedChange = false
        if (+this.incidentProhibitedModel.explosives > 0) {
          this.incidentProhibitedModel.explosivesName = this.getExplosiveType(+this.incidentProhibitedModel.explosives)
        }
        if (+this.incidentProhibitedModel.guns > 0) {
          this.incidentProhibitedModel.gunsName = this.getGunsType(+this.incidentProhibitedModel.guns)
        }
        if (+this.incidentProhibitedModel.sharpObjects > 0) {
          this.incidentProhibitedModel.sharpObjectsName = this.getSharpObjectsType(+this.incidentProhibitedModel.sharpObjects)
        }
        if (+this.incidentProhibitedModel.incendiaries > 0) {
          this.incidentProhibitedModel.incendiariesName = this.getIncendiariesType(+this.incidentProhibitedModel.incendiaries)
        }
        if (+this.incidentProhibitedModel.disabling > 0) {
          this.incidentProhibitedModel.disablingName = this.getDisablingType(+this.incidentProhibitedModel.disabling)
        }
        if (+this.incidentProhibitedModel.detectionMethod.length > 0) {
          this.getDetectionType(this.incidentProhibitedModel.detectionMethod)
        }
        if(this.incidentProhibitedModel.explosives == null){
          this.incidentProhibitedModel.explosivesName = ''
        }
        if(this.incidentProhibitedModel.guns == null){
          this.incidentProhibitedModel.gunsName = ''
        }
        if(this.incidentProhibitedModel.sharpObjects == null){
          this.incidentProhibitedModel.sharpObjectsName = ''
        }
        if(this.incidentProhibitedModel.disabling == null){
          this.incidentProhibitedModel.disablingName = ''
        }
        if(this.incidentProhibitedModel.incendiaries == null){
          this.incidentProhibitedModel.incendiariesName = ''
        }
        this.GetIncidentDetectionMethodList()
        this.resetProhibitedModel();

        
      }
      else {
        if (flag == 1) {
          this.toastr.error('Please select Detection method.', 'Information');

          return false;
        }
        if (flag == 0) {

        }
      }
    } else {
      if (flag == 1) {
        this.toastr.error('Please select any one prohibited item type .', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  deleteProhibited(indexid:number,event: IncidentProhibitedItems) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentProhibiteditem.findIndex((x => x.id == event.id))
        this.incidentProhibiteditem.splice(index, 1)       
        this.deleteProhibitedIds.push(event.id)
      }else{
        this.incidentinfo.incidentProhibitedItems.splice(indexid, 1)
        this.incidentinfo.incidentProhibitedItems = this.incidentinfo.incidentProhibitedItems
        
      }
    }
    else {

    }

  }

  cancelProhibitedUpdate(incidentProhibitedModel: IncidentProhibitedItems) {
    this.resetProhibitedModel();
    incidentProhibitedModel.inedit = false
    var index = this.incidentProhibiteditem.findIndex((x => x.id == incidentProhibitedModel.id))
    this.incidentProhibiteditem[index].inedit = incidentProhibitedModel.inedit
    this.incidentinfo.incidentProhibitedItems[index].inedit = incidentProhibitedModel.inedit
  }

  onProhibitedEditClick(index: number, model: IncidentProhibitedItems) {
    this.incidentProhibitedModel = model
    this.isDirty = true
    if(this.incidentProhibitedModel.disabling == 0){
      this.incidentProhibitedModel.disabling  = null
    }
    if(this.incidentProhibitedModel.explosives == 0){
      this.incidentProhibitedModel.explosives  = null
    }
    if(this.incidentProhibitedModel.incendiaries == 0){
      this.incidentProhibitedModel.incendiaries  = null
    }
    if(this.incidentProhibitedModel.sharpObjects == 0){
      this.incidentProhibitedModel.sharpObjects  = null
    }
    if(this.incidentProhibitedModel.guns == 0){
      this.incidentProhibitedModel.guns  = null
    }
    
    this.incidentProhibitedModel.inedit = true
    this.isProhibitedChange = false
    this.GetIncidentDetectionMethodList();
    let selectedL = []
    let locationids = this.incidentProhibitedModel.detectionMethod.split(",")
    locationids.forEach(element => {
      let loc = new SelectedDetectionMethod()
      loc.id = +element
      let name = this.detectionMethodList.filter(x => x.id == +element)[0].detectionMethod
      selectedL.push({ id: +element, detectionMethod: name })
    });
    this.selectedDetectionList = selectedL
    
  }
  clearProhibited(){
    this.resetProhibitedModel();
  }
  //#endregion
  //------------------------------------------------------------------------------------------------------------------------------
  //#region ADDING FIREARM RECORDS 
  validateAndAddFirearmRecord(flag): boolean {
    if (this.validateFirearmItem()) {
      this.incidentFirearmModel.incidentId = this.incidentId;

      const copyEvent = { ...this.incidentFirearmModel };
      this.incidentinfo.incidentFirearmInformation.push(copyEvent);   
      this.resetFirearmModel();
      
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter data in required fields.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  validateFirearmItem() {    
    return (
      this.incidentFirearmModel.make !== undefined &&
      this.incidentFirearmModel.isFirearmLoaded != undefined &&
      this.incidentFirearmModel.model != undefined
    );
  }

  resetFirearmModel() {
    // Reset
    this.isFirearmChange = false
    this.incidentFirearmModel = new IncidentFirearmInformation();    
  }



  UpdateFireRecord(incidentFirearmModel: IncidentFirearmInformation, flag) {
      incidentFirearmModel.inedit = false          
      this.resetFirearmModel();
  }
  
  deleteFire(indexid:number,event: IncidentFirearmInformation) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentFirearmItem.findIndex((x => x.id == event.id))
        this.incidentFirearmItem.splice(index, 1)
       
        this.deleteFireIds.push(event.id)
      }else{
        this.incidentinfo.incidentFirearmInformation.splice(indexid, 1)
        this.incidentinfo.incidentFirearmInformation = this.incidentinfo.incidentFirearmInformation
        
      }
    }
    else {

    }

  }

  cancelFireUpdate(incidentFirearmModel: IncidentFirearmInformation) {
    this.resetFirearmModel();
    incidentFirearmModel.inedit = false
    var index = this.incidentFirearmItem.findIndex((x => x.id == incidentFirearmModel.id))
    this.incidentFirearmItem[index].inedit = incidentFirearmModel.inedit
    this.incidentinfo.incidentFirearmInformation[index].inedit = incidentFirearmModel.inedit
  }

  onFireEditClick( index: number, model: IncidentFirearmInformation) {
      this.incidentFirearmModel = model
      this.incidentFirearmModel.inedit = true  
      this.isFirearmChange = false    
  }

  clearFirearm(){
    this.resetFirearmModel();
  }
  //#endregion
  //---------------------------------------------------------------------------------------------------------------------
  //#region ADDING VEHICLE RECORDS
  validateAndAddVehicleRecord(flag): boolean {
    if (this.validateVehicleItem()) {
      this.incidentVehicleModel.incidentId = this.incidentId;
      this.isDirty = true
      
      if (this.incidentVehicleModel.licenseState != undefined) {
        this.incidentVehicleModel.licenseStateName = this.incidentStatList.filter(x => x.id === +this.incidentVehicleModel.licenseState)[0].state;

      }
      const copyEvent = { ...this.incidentVehicleModel };
      this.incidentinfo.incidentVehicleInformation.push(copyEvent);      
      this.resetVehicleModel();
      
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter data in required fields.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  validateVehicleItem() {
    return (
      this.incidentVehicleModel.makeVehicle !== undefined &&
      this.incidentVehicleModel.type !== undefined &&
      this.incidentVehicleModel.modelVehicle !== undefined
    );
  }

  resetVehicleModel() {
    this.isMotorChange = false
    this.incidentVehicleModel = new IncidentVehicleInformation();
  }

  onVehicleEditClick( index: number, model: IncidentVehicleInformation) {
    this.incidentVehicleModel = model
    this.incidentVehicleModel.inedit = true   
    this.isDirty = true   
    this.isMotorChange = false
  } 

  getlicensestate(state: number) {
    return this.incidentStatList.filter(x => x.id == state)[0].state;
  } 
  UpdateVehicleRecord(incidentVehicleModel: IncidentVehicleInformation, flag) {
    if (this.validateVehicleItem()) {    
      this.incidentVehicleModel = incidentVehicleModel 
      this.incidentVehicleModel.inedit = false    
      this.isDirty = true
      if (+this.incidentVehicleModel.licenseState > 0) {
        this.incidentVehicleModel.licenseStateName = this.getlicensestate(+this.incidentVehicleModel.licenseState)
      }
      this.resetVehicleModel();
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter required field.', 'Information');
        
        return false;
      }
      if (flag == 0) {
        
      }
    }

  }

  deleteVehicle(indexid:number,event: IncidentVehicleInformation) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentVehicleItem.findIndex((x => x.id == event.id))
        this.incidentVehicleItem.splice(index, 1)
        //this.incidentinfo.incidentVehicleInformation.splice(index, 1)
        this.deleteVhicleIds.push(event.id)
       
      }else{
        this.incidentinfo.incidentVehicleInformation.splice(indexid, 1)
        this.incidentinfo.incidentVehicleInformation = this.incidentinfo.incidentVehicleInformation
      }
    }
    else {

    }
  }

  clearVehicle(){
    this.resetVehicleModel();
  }
  //#endregion
  //------------------------------------------------------------------------------------------------------------------//
  //#region ADDING ATTACHMENT
  addFile(files) {
    this.showImage = false;
    if (files.length === 0) {
      return;
    }
    //files.name = 
    this.isDirty = true;
    for (let file of files) {
      var parts = file.name.split('.');
      if (parts.length <= 1) {
        this.toastr.error("File " + file.name + " is not valid file");
      }
      else {
        this.incidentAttachModel.fileName = file.name
        this.filemodel.name = file.name
        this.filemodel.size = file.size
        this.filemodel.lastModified = file.lastModified
        this.filemodel.lastModifiedDate = file.lastModifiedDate 
        this.filemodel.webkitRelativePath = file.webkitRelativePath
        const filemodelvalue = {...this.filemodel} 
        
        //this.incidentAttachModel.incidentFiles.push(filemodelvalue)

        this.files.push(file)
        this.resetFileModel()        
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

  resetFileModel(){
    this.filemodel = new files()
  }
  validateAndAddAttachmentRecord(flag): boolean {
    if (this.validateAttachmentItem()) {
      this.incidentAttachModel.incidentId = this.incidentId;
      this.isDirty = true
      this.incidentAttachModel.typeName = this.incidentAttachmentTypesList.filter(x => x.id === this.incidentAttachModel.type)[0].attachmentTypeName;
      const copyEvent = { ...this.incidentAttachModel };
      this.incidentinfo.incidentAttachments.push(copyEvent);
      this.showTextForAttachment = false
      this.resetAttachmentModel();
     
      return true;
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please select Attachment type.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }
  }

  validateAttachmentItem() {
    return (
      this.incidentAttachModel.type !== undefined
    );
  }

  resetAttachmentModel() {
    this.isAttachmentChange = false
    this.incidentAttachModel = new IncidentAttachments();
  }
  onAttachEditClick( index: number, model: IncidentAttachments) {
    this.incidentAttachModel = model
    this.incidentAttachModel.inedit = true  
    this.isDirty = true    
    this.isAttachmentChange = false
    if (this.incidentAttachModel.type == 4 && this.incidentAttachModel.otherAttachmentTypevalue != '') {
      this.showTextForAttachment = true
    }
    //this.editFile(this.incidentAttachModel.fileName)
  } 

  getAttachType(attach: number) {
    return this.incidentAttachmentTypesList.filter(x => x.id == attach)[0].attachmentTypeName;
  }
  UpdateAttachRecord(incidentAttachModel: IncidentAttachments, flag) {
    if (this.validateAttachmentItem()) {
      this.incidentAttachModel = incidentAttachModel     
      this.incidentAttachModel.inedit = false   
      this.isDirty = true 
      if (this.incidentAttachModel.type > 0) {
        this.incidentAttachModel.typeName = this.getAttachType(+this.incidentAttachModel.type)
      }
      this.resetAttachmentModel();
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter required field.', 'Information');
        
        return false;
      }
      if (flag == 0) {
        
      }
    }

  }

  deleteAttach(indexid:number,event: IncidentAttachments) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentAttachItem.findIndex((x => x.id == event.id))
        this.incidentAttachItem.splice(index, 1)
       // this.incidentinfo.incidentAttachments.splice(index, 1)
        this.deletedAttachmentIds.push(event.id)
        
      }else{
        this.incidentinfo.incidentAttachments.splice(indexid, 1)
        this.incidentinfo.incidentAttachments = this.incidentinfo.incidentAttachments
        
      }
    }
    else {

    }

  }

  clearAttachment(){
    this.resetAttachmentModel();
  }
  //#endregion
  //------------------------------------------------------------------------------------------------------//
  //#region ADDING HOTWASH RECORDS
  resetHotwashModel() {
    this.selectedAttendeesList = []
    this.selectedHotwashList = []
    this.selectedRootcauseList = []
    this.incidentHotWashModel = new IncidentHotWash()
    this.rootcauseRequired = false
    this.isHotwashChange = false
  }
  validateAndAddHotwashRecord(flag): boolean {

    this.incidentHotWashModel.incidentId = this.incidentId;
    this.isDirty = true
   
    //////////////////////////////Attendees/////////////////////////////
    let strattendees = "";
    let strattendeesNames = ""
    this.selectedAttendeesList.forEach(element => {
      strattendees = strattendees + element.id + ",";
      strattendeesNames = strattendeesNames + element.attendeesName + ",";
    });
    strattendees = strattendees.slice(0, -1);
    strattendeesNames = strattendeesNames.slice(0, -1);

    this.incidentHotWashModel.attendees = strattendees;
    this.incidentHotWashModel.attendeesName = strattendeesNames;

    /////////////////////////HotwashTopic///////////////////////////////        
    let strhotwashtopic = "";
    let strhotwashtopicsNames = ""
    this.selectedHotwashList.forEach(item => {
      strhotwashtopic = strhotwashtopic + item.id + ",";
      strhotwashtopicsNames = strhotwashtopicsNames + item.hotwashTopicName + ",";
    });
    strhotwashtopic = strhotwashtopic.slice(0, -1);
    strhotwashtopicsNames = strhotwashtopicsNames.slice(0, -1);

    this.incidentHotWashModel.hotwashTopic = strhotwashtopic;
    this.incidentHotWashModel.hotwashTopicName = strhotwashtopicsNames;
    ///////////////////////////RootCauseList////////////////////////
    let strrootcause = "";
    let strrootcauseNames = ""
    this.selectedRootcauseList.forEach(item => {
      strrootcause = strrootcause + item.id + ",";
      strrootcauseNames = strrootcauseNames + item.rootCauseName + ",";
    });
    strrootcause = strrootcause.slice(0, -1);
    strrootcauseNames = strrootcauseNames.slice(0, -1);

    this.incidentHotWashModel.rootCause = strrootcause;
    this.incidentHotWashModel.rootCauseName = strrootcauseNames;

    ////////////////////Add in DB /////////////////////
    if (this.validateHotwashItem()) {
      if(this.rootcauseRequired !== true){
        this.incidentHotWashModel.hotwashDate = this.dateAdapter.toModel(this.fromModel(this.incidentHotWashModel.hotwashDate));
        this.incidentHotWashModel.newHotwashDate = this.incidentHotWashModel.hotwashDate
      //////////////////////////////Return to UI Attendees/////////////////////////////
      let selectedC = []
      let attendeeids = this.incidentHotWashModel.attendees.split(",")
      attendeeids.forEach(element => {
        let attendt = new SelectedAttendees()
        attendt.id = +element
        let name = this.attendeesList.filter(x => x.id == +element)[0].attendeesName
        selectedC.push({ id: +element, attendeesName: name })
      });
      this.selectedAttendeesList = selectedC

      ///////////////////////// Return to UI HotwashTopic ///////////////////////////////    
      let selectedHT = []
      let topicids = this.incidentHotWashModel.hotwashTopic.split(",")
      topicids.forEach(item => {
        let topic = new SelectedHotwashTopic()
        topic.id = +item
        let topicname = this.hotwashList.filter(x => x.id == +item)[0].hotwashTopicName
        selectedHT.push({ id: +item, hotwashTopicName: topicname })
      });
      this.selectedHotwashList = selectedHT
     
      //////////////////////////Return to UI RootCause //////////////////////
      if(this.selectedRootcauseList.length > 0){
        let selectedRC = []
        let rootids = this.incidentHotWashModel.rootCause.split(",")
        rootids.forEach(item => {
          let root = new SelectedRootCause()
          root.id = +item
          let rootname = this.rootCauseList.filter(x => x.id == +item)[0].rootCauseName
          selectedRC.push({ id: +item, rootCauseName: rootname })
        });
        this.selectedRootcauseList = selectedRC
      }
      const copyEvent = { ...this.incidentHotWashModel };
      this.incidentinfo.incidentHotWash.push(copyEvent);
     
      
      
      this.resetHotwashModel();
     
      return true;
      }
      else if(this.rootcauseRequired == true && this.incidentHotWashModel.rootCause !== ''){
        this.incidentHotWashModel.hotwashDate = this.dateAdapter.toModel(this.fromModel(this.incidentHotWashModel.hotwashDate));
        this.incidentHotWashModel.newHotwashDate = this.incidentHotWashModel.hotwashDate
      //////////////////////////////Return to UI Attendees/////////////////////////////
      let selectedC = []
      let attendeeids = this.incidentHotWashModel.attendees.split(",")
      attendeeids.forEach(element => {
        let attendt = new SelectedAttendees()
        attendt.id = +element
        let name = this.attendeesList.filter(x => x.id == +element)[0].attendeesName
        selectedC.push({ id: +element, attendeesName: name })
      });
      this.selectedAttendeesList = selectedC

      ///////////////////////// Return to UI HotwashTopic ///////////////////////////////    
      let selectedHT = []
      let topicids = this.incidentHotWashModel.hotwashTopic.split(",")
      topicids.forEach(item => {
        let topic = new SelectedHotwashTopic()
        topic.id = +item
        let topicname = this.hotwashList.filter(x => x.id == +item)[0].hotwashTopicName
        selectedHT.push({ id: +item, hotwashTopicName: topicname })
      });
      this.selectedHotwashList = selectedHT
     
      //////////////////////////Return to UI RootCause //////////////////////
      if(this.selectedRootcauseList.length > 0){
        let selectedRC = []
        let rootids = this.incidentHotWashModel.rootCause.split(",")
        rootids.forEach(item => {
          let root = new SelectedRootCause()
          root.id = +item
          let rootname = this.rootCauseList.filter(x => x.id == +item)[0].rootCauseName
          selectedRC.push({ id: +item, rootCauseName: rootname })
        });
        this.selectedRootcauseList = selectedRC
      }
      const copyEvent = { ...this.incidentHotWashModel };
      this.incidentinfo.incidentHotWash.push(copyEvent);
      this.resetHotwashModel();
      }
      else{
        if (flag == 1) {
          this.toastr.error('Please enter data in required fields.', 'Information');
  
          return false;
        }
        if (flag == 0) {
  
        }
      }
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter data in required fields.', 'Information');

        return false;
      }
      if (flag == 0) {

      }
    }

  }

  validateHotwashItem() {
    if (
      this.incidentHotWashModel.hotwashDate !== undefined &&
      this.incidentHotWashModel.attendees !== '' &&
      this.incidentHotWashModel.hotwashTopic !== '' 
    ){
      return true
    }    
  }

  onHotwashEditClick( index: number, model: IncidentHotWash) {
    this.incidentHotWashModel = model
    this.incidentHotWashModel.inedit = true 
    this.isDirty = true   
    this.isHotwashChange = false
    this.incidentHotWashModel.newHotwashDate = this.incidentHotWashModel.hotwashDate
    this.incidentHotWashModel.hotwashDate = this.datePipe.transform(this.incidentHotWashModel.hotwashDate, 'dd-MM-yyyy');  
    let selectedC = []
      let attendeeids = this.incidentHotWashModel.attendees.split(",")
      attendeeids.forEach(element => {
        let attendt = new SelectedAttendees()
        attendt.id = +element
        let name = this.attendeesList.filter(x => x.id == +element)[0].attendeesName
        selectedC.push({ id: +element, attendeesName: name })
      });
      this.selectedAttendeesList = selectedC

    let selectedHT = []
      let topicids = this.incidentHotWashModel.hotwashTopic.split(",")
      topicids.forEach(item => {
        let topic = new SelectedHotwashTopic()
        topic.id = +item
        let topicname = this.hotwashList.filter(x => x.id == +item)[0].hotwashTopicName
        selectedHT.push({ id: +item, hotwashTopicName: topicname })
      });
      this.selectedHotwashList = selectedHT
    
      if(this.selectedHotwashList.find (x=>x.hotwashTopicName == 'Root Cause Analysis')){
        this.rootcauseRequired = true
      }
      let selectedRC = []
      let rootids = this.incidentHotWashModel.rootCause.split(",")
      rootids.forEach(item => {
        let root = new SelectedRootCause()
        root.id = +item
        let rootname = this.rootCauseList.filter(x => x.id == +item)[0].rootCauseName
        selectedRC.push({ id: +item, rootCauseName: rootname })
      });
      this.selectedRootcauseList = selectedRC  
      
     this.GetIncidentAttendeesList();
     this.GetIncidentHotwashList();
     this.GetIncidentRootCauseList();
  } 

  getattendees(attendees: string) {
    let strattendees = "";
    let strattendeesNames = ""
    this.selectedAttendeesList.forEach(element => {
      strattendees = strattendees + element.id + ",";
      strattendeesNames = strattendeesNames + element.attendeesName + ",";
    });
    strattendees = strattendees.slice(0, -1);
    strattendeesNames = strattendeesNames.slice(0, -1);

    this.incidentHotWashModel.attendees = strattendees;
    this.incidentHotWashModel.attendeesName = strattendeesNames;    
  }

  gethotwashtopicname(hotwashTopic: string) {
    let strhotwashtopic = "";
    let strhotwashtopicsNames = ""
    this.selectedHotwashList.forEach(item => {
      strhotwashtopic = strhotwashtopic + item.id + ",";
      strhotwashtopicsNames = strhotwashtopicsNames + item.hotwashTopicName + ",";
    });
    strhotwashtopic = strhotwashtopic.slice(0, -1);
    strhotwashtopicsNames = strhotwashtopicsNames.slice(0, -1);

    this.incidentHotWashModel.hotwashTopic = strhotwashtopic;
    this.incidentHotWashModel.hotwashTopicName = strhotwashtopicsNames;    
  }

  getRootcausenames(rootCause: string) {
    let strrootcause = "";
    let strrootcauseNames = ""
    this.selectedRootcauseList.forEach(item => {
      strrootcause = strrootcause + item.id + ",";
      strrootcauseNames = strrootcauseNames + item.rootCauseName + ",";
    });
    strrootcause = strrootcause.slice(0, -1);
    strrootcauseNames = strrootcauseNames.slice(0, -1);

    this.incidentHotWashModel.rootCause = strrootcause;
    this.incidentHotWashModel.rootCauseName = strrootcauseNames; 
  }

  UpdateHotwashRecord(incidentHotWashModel: IncidentHotWash, flag) {
    if (this.validateHotwashItem()) {  
      let strrootcause = "";
    let strrootcauseNames = ""
    this.selectedRootcauseList.forEach(item => {
      strrootcause = strrootcause + item.id + ",";
      strrootcauseNames = strrootcauseNames + item.rootCauseName + ",";
    });
    strrootcause = strrootcause.slice(0, -1);
    strrootcauseNames = strrootcauseNames.slice(0, -1);

    this.incidentHotWashModel.rootCause = strrootcause;
    this.incidentHotWashModel.rootCauseName = strrootcauseNames;

      if(this.rootcauseRequired != true){
        this.incidentHotWashModel = incidentHotWashModel
        incidentHotWashModel.inedit = false  
        this.rootcauseRequired = false
        this.isDirty = true
        this.incidentHotWashModel.hotwashDate = this.dateAdapter.toModel(this.fromModel(this.incidentHotWashModel.hotwashDate));  
        this.incidentHotWashModel.newHotwashDate = this.incidentHotWashModel.hotwashDate
        if (+incidentHotWashModel.attendees.length > 0) {
          this.getattendees(incidentHotWashModel.attendees)
        }
        if (+incidentHotWashModel.hotwashTopic.length > 0) {
          this.gethotwashtopicname(incidentHotWashModel.hotwashTopic)
        }
        if (+incidentHotWashModel.rootCause.length > 0) {
          this.getRootcausenames(incidentHotWashModel.rootCause)
        }
        
        this.resetHotwashModel();
      }
      else if(this.rootcauseRequired == true && this.incidentHotWashModel.rootCause !== ''){
        this.incidentHotWashModel = incidentHotWashModel
        incidentHotWashModel.inedit = false  
        this.rootcauseRequired = false
        this.isDirty = true
        this.incidentHotWashModel.hotwashDate = this.dateAdapter.toModel(this.fromModel(this.incidentHotWashModel.hotwashDate));  
        this.incidentHotWashModel.newHotwashDate = this.incidentHotWashModel.hotwashDate
        if (+incidentHotWashModel.attendees.length > 0) {
          this.getattendees(incidentHotWashModel.attendees)
        }
        if (+incidentHotWashModel.hotwashTopic.length > 0) {
          this.gethotwashtopicname(incidentHotWashModel.hotwashTopic)
        }
        if (+incidentHotWashModel.rootCause.length > 0) {
          this.getRootcausenames(incidentHotWashModel.rootCause)
        }
        
        this.resetHotwashModel();
      }else{
        
          this.toastr.error('Please enter required field.', 'Information');
          
          return false;
        
      }
    }
    else {
      if (flag == 1) {
        this.toastr.error('Please enter required field.', 'Information');
        
        return false;
      }
      if (flag == 0) {
        
      }
    }

  }

  deleteHotwash(indexid:number,event: IncidentHotWash) {
    if (confirm("Are you sure you want to delete")) {
      if(event.id > 0){
        var index = this.incidentHotwashItem.findIndex((x => x.id == event.id))
        this.incidentHotwashItem.splice(index, 1)
        this.incidentinfo.incidentHotWash.splice(index, 1)
        this.deletedHotwashIds.push(event.id)
      }else{
        this.incidentinfo.incidentHotWash.splice(indexid, 1)
        this.incidentinfo.incidentHotWash = this.incidentinfo.incidentHotWash
        
      }
    }
    else {

    }

  }

  clearHotwash(){
    this.resetHotwashModel();
  }
  //#endregion
  //----------------------------------------------------------------------------------------------------------------------//

  enableSave() {
      if (this.incidentinfo.dateOccurred == undefined) {
        return true
      } else if (this.incidentinfo.incidentType == null || this.incidentinfo.incidentType == undefined) {
        //this.toastr.warning('Incident Type is not selected!!', 'Information');
        return true
      }
      else if (this.incidentinfo.dateReview == undefined) {
        return true
      } else if (this.incidentinfo.incidentSummary == undefined) {
        return true
      } else if (this.isEvacuationRequired == true && this.incidentinfo.evacuationDescription == undefined) {
        return true
      }
      else if (this.incidentinfo.reportingAgency == undefined || this.incidentinfo.reportingAgency == '') {
        return true
      }
      else if (this.incidentinfo.involvedAgency == undefined || this.incidentinfo.involvedAgency == '') {
        return true
      }
       else if (this.perimeterBreachRequired == true && ( this.incidentinfo.perimeterBreach == undefined || this.incidentinfo.perimeterBreach == null)) {
        return true
      }else if(this.notificationValue != true){    
        return true      
      }else if(this.returcommentrequired == true && (this.incidentinfo.returnedComment == '' || this.incidentinfo.returnedComment == undefined)){
        return true
      }else if (this.incidentinfo.incidentFacilityId == undefined || this.incidentinfo.incidentFacilityId == null) {
        return true
      }else {
        return false
      }
  }

  public GetIncidentDetails() {
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

    this.router.navigate(["/admin/incident"]);
  }  

  statusField(){
    if(this.user.rolename == 'StaffAdmin'){
    this.isStatusRequird = true
     }else{
      this.isStatusRequird = false
     } 
  }
  enableSubmit(){
     if(this.isSaveFormDetails == true){
      return false
    } 
    else{
      return true
    }
  }

  resetIsDirtyFlag() {
    this.isDirty = false;
  }

  showSubmtbutton(){
    if(this.incidentinfo.incidentStatusDisplay != 'Submitted' ){
      this.showSubmit = true
    }
    else{
      this.showSubmit = false
    }
  }
  

  saveIncidentRecord(formData: NgForm) {  
    if(this.notificationModel.notificationTypeId != undefined || this.notificationModel.notificationTypeId != null
      ){
        this.validateAndAddNotificationRecord(this.notificationModel);
      }
      if(this.eventModel.eventTypeId != undefined || this.eventModel.eventTypeId != null
        ){
          this.validateAndAddEventRecord(this.eventModel);
        }  
    if( this.isIndividualChange == true ){
      if(this.incidentIndividual.individualType != undefined){
        if (this.incidentIndividual.referralIssue == '1') {
          if (this.validateIndividual()) {
            this.validateAndAddIndividualRecord(1);
          }else{
            this.toastr.error('Please enter data in required field of Individual(s) Incident.', 'Information');
            return;
          }
        }else{
          this.validateAndAddIndividualRecord(1);
        }
      }else{
        this.toastr.error('Please enter data in required field Individual(s) Incident.', 'Information');
            return;
      }
    }
    if(this.isPassengerChange == true){
      if(this.passengerModel.airline != undefined){
        this.validateAndAddPassengerRecord(1);
      }else{
        this.toastr.error('Please select Airline in Airline / Aircraft / Scheduled passenger Information.', 'Information');
            return;
      }
    } 
    if(this.isProhibitedChange == true){
      if(this.selectedDetectionList.length != 0){
        if (this.validateProhibited()){
            this.validateAndAddProhibitedItemsRecord(1);
          }else{
              this.toastr.error('Please select any one prohibited item type .', 'Information');
              return;
          }
      }else{
        this.toastr.error('Please select Detection method in Prohibited Items Discovered.', 'Information');
              return;
      }
    }
    
    if(this.isFirearmChange == true){
      if(this.incidentFirearmModel.make !== undefined &&
        this.incidentFirearmModel.isFirearmLoaded != undefined &&
        this.incidentFirearmModel.model != undefined){
          this.validateAndAddFirearmRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Firearms Information.', 'Information');
              return;
      }
    }
    
    if(this.isMotorChange == true){
      if(this.incidentVehicleModel.makeVehicle !== undefined &&
        this.incidentVehicleModel.type !== undefined &&
        this.incidentVehicleModel.modelVehicle !== undefined){
          this.validateAndAddVehicleRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Motor Vehicle Information.', 'Information');
              return;
      }
    }
    if(this.isAttachmentChange == true){      
      this.validateAndAddAttachmentRecord(1)      
    }
    if(this.isHotwashChange == true){
      if(this.incidentHotWashModel.hotwashDate !== undefined &&
        this.selectedHotwashList.length != 0  &&
        this.selectedAttendeesList.length != 0){
          this.validateAndAddHotwashRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Hotwash & Root Cause Analysis.', 'Information');
        return;
      }
    }
    
    
    
    
    this.incidentinfo.dateOccurred = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateOccurred))
    this.incidentinfo.dateReview = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateReview))
    this.incidentinfo.dateApproved = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateApproved))
    
    if(this.incidentinfo.createdby == '' || this.incidentinfo.createdby == null || this.incidentinfo.createdby == undefined){
      this.incidentinfo.createdby = this.user.id
    }
    this.incidentinfo.isSubmitted = ''    
     
    this.isSaveFormDetails = true
    if(this.incidentinfo.incidentStatusDisplay == ''|| this.incidentinfo.incidentStatusDisplay == null){
      this.incidentinfo.incidentStatusDisplay = "Draft"
    }
    
    if(this.user.rolename == "StaffAdmin"){
      this.incidentinfo.submittedBy = "SubmittedByStaffAdmin";
      this.incidentinfo.approvingOfficial = this.user.name
      this.incidentinfo.updatedBy = this.user.id
    }else if(this.user.rolename == "Issuer"){
      this.incidentinfo.submittedBy = "SubmittedByIssuer";
     
      this.incidentinfo.updatedBy = this.user.id
    }else if(this.user.rolename == "Security"){
      this.incidentinfo.submittedBy = "SubmittedBySecurity";
      
      this.incidentinfo.updatedBy = this.user.id
    }

    var incidentDetails = this.incidentinfo;
    this.incidentreportservice.AddIncidentDetail(incidentDetails,this.isSaveFormDetails, this.files,this.deletedeventIds,this.deletedncidentEventIds,this.deletedIndividualIds,this.deletePassengerIds,
      this.deleteProhibitedIds,
      this.deleteFireIds,this.deleteVhicleIds,this.deletedAttachmentIds,this.deletedHotwashIds
    ).subscribe((response: string) => {
      this.resetIsDirtyFlag()
      this.toastr.success('Incident Information saved!!', 'Information');
      this.router.navigate(["/admin/dashboard"]).then(() => {
        this.router.navigate(['/admin/incident/incidentreportadd'], {
          queryParams: {
            incidentId: +response,
            isEdit: 1,
            isClone: 0,
            isView: 0
          }
        });
      });

    });
  }

  SubmitByUser() {
    if(this.notificationModel.notificationTypeId != undefined || this.notificationModel.notificationTypeId != null
      ){
        this.validateAndAddNotificationRecord(this.notificationModel);
      }
      if(this.eventModel.eventTypeId != undefined || this.eventModel.eventTypeId != null
        ){
          this.validateAndAddEventRecord(this.eventModel);
        }
    if( this.isIndividualChange == true ){
      if(this.incidentIndividual.individualType != undefined){
        if (this.incidentIndividual.referralIssue == '1') {
          if (this.validateIndividual()) {
            this.validateAndAddIndividualRecord(1);
          }else{
            this.toastr.error('Please enter data in required field of Individual(s) Incident.', 'Information');
            return;
          }
        }else{
          this.validateAndAddIndividualRecord(1);
        }
      }else{
        this.toastr.error('Please enter data in required field Individual(s) Incident.', 'Information');
            return;
      }
    }
    if(this.isPassengerChange == true){
      if(this.passengerModel.airline != undefined){
        this.validateAndAddPassengerRecord(1);
      }else{
        this.toastr.error('Please select Airline in Airline / Aircraft / Scheduled passenger Information.', 'Information');
            return;
      }
    } 
    if(this.isProhibitedChange == true){
      if(this.selectedDetectionList.length != 0){
        if (this.incidentProhibitedModel.explosives !== undefined || this.incidentProhibitedModel.disabling !== undefined
          || this.incidentProhibitedModel.guns != undefined || this.incidentProhibitedModel.sharpObjects != undefined
          || this.incidentProhibitedModel.incendiaries != undefined){
            this.validateAndAddProhibitedItemsRecord(1);
          }else{
              this.toastr.error('Please select any one prohibited item type .', 'Information');
              return;
          }
      }else{
        this.toastr.error('Please select Detection method in Prohibited Items Discovered.', 'Information');
              return;
      }
    }
    
    if(this.isFirearmChange == true){
      if(this.incidentFirearmModel.make !== undefined &&
        this.incidentFirearmModel.isFirearmLoaded != undefined &&
        this.incidentFirearmModel.model != undefined){
          this.validateAndAddFirearmRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Firearms Information.', 'Information');
              return;
      }
    }
    
    if(this.isMotorChange == true){
      if(this.incidentVehicleModel.makeVehicle !== undefined &&
        this.incidentVehicleModel.type !== undefined &&
        this.incidentVehicleModel.modelVehicle !== undefined){
          this.validateAndAddVehicleRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Motor Vehicle Information.', 'Information');
              return;
      }
    }
    if(this.isAttachmentChange == true){      
      this.validateAndAddAttachmentRecord(1)      
    }
    if(this.isHotwashChange == true){
      if(this.incidentHotWashModel.hotwashDate !== undefined &&
        this.selectedHotwashList.length != 0  &&
        this.selectedAttendeesList.length != 0){
          this.validateAndAddHotwashRecord(1);
      }else{
        this.toastr.error('Please enter data in required fields of Hotwash & Root Cause Analysis.', 'Information');
        return;
      }
    }

    this.incidentinfo.dateOccurred = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateOccurred))
    this.incidentinfo.dateReview = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateReview))
    this.incidentinfo.dateApproved = this.dateAdapter.toModel(this.fromModel(this.incidentinfo.dateApproved))
    if(this.incidentinfo.createdby == '' || this.incidentinfo.createdby == null || this.incidentinfo.createdby == undefined){
      this.incidentinfo.createdby = this.user.id
    }
   
    
    if(this.incidentinfo.incidentStatusDisplay == ''|| this.incidentinfo.incidentStatusDisplay == null){
      this.incidentinfo.incidentStatusDisplay = "Submitted"
    }else if(this.incidentinfo.incidentStatusDisplay == "Draft"){
      this.incidentinfo.incidentStatusDisplay = "Submitted"
    }else if(this.incidentinfo.incidentStatus == "Returned" && this.user.rolename == "Issuer"){
      this.incidentinfo.incidentStatusDisplay = "Submitted"
    }else if(this.incidentinfo.incidentStatus == "Returned" && this.user.rolename == "Security"){
      this.incidentinfo.incidentStatusDisplay = "Submitted"
    }else if(this.incidentinfo.incidentStatus == "Returned" && this.user.rolename == "StaffAdmin"){
      this.incidentinfo.incidentStatusDisplay = "Returned"
    }else if(this.incidentinfo.incidentStatus == "Approved"){
      this.incidentinfo.incidentStatusDisplay = "Closed"
    }

    if(this.user.rolename == "StaffAdmin"){
      this.incidentinfo.submittedBy = "SubmittedByStaffAdmin";
      this.incidentinfo.approvingOfficial = this.user.name
      this.incidentinfo.updatedBy = this.user.id
    }else if(this.user.rolename == "Issuer"){
      this.incidentinfo.submittedBy = "SubmittedByIssuer";
      
      this.incidentinfo.updatedBy = this.user.id
    }else if(this.user.rolename == "Security"){
      this.incidentinfo.submittedBy = "SubmittedBySecurity";
      
      this.incidentinfo.updatedBy = this.user.id
    }    
    this.incidentinfo.isSubmitted = "Submitted"    
    var incidentDetails = this.incidentinfo;
    this.incidentreportservice.AddIncidentDetail(incidentDetails,this.isSaveFormDetails,this.files,this.deletedeventIds,this.deletedncidentEventIds,this.deletedIndividualIds,this.deletePassengerIds,
      this.deleteProhibitedIds,
      this.deleteFireIds,
      this.deleteVhicleIds,this.deletedAttachmentIds,this.deletedHotwashIds).subscribe((response: string) => {      
      this.resetIsDirtyFlag();
      this.toastr.success('Incident Information submitted!!', 'Information');
      this.router.navigate(["/admin/incident"])     
    })
  }
}
