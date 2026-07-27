import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";

import { AuditLogService } from "../auditlog/auditlog.service";
import {
  CitationDetailStatus,
  CitationDetails
} from "../novlist/CitationDetails";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
// import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { ModalDismissReasons, NgbCalendar, NgbDate, NgbDateAdapter, NgbDateStruct, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { InspetionRecordDetail, InspetionRecordDetailStatus } from "../inspectionrecord/inspectionrecord.model";
import { BadgeVerificationAudit, SecurityClearanceAuditLog} from "../pendingbadgeapplicants/pendingbadgeapplicants";
import { AuditLogData } from "./auditlog";
import { SystemLogAudit } from "@app/authentication/login/systemlogs";
import { IncidentRecordDetailStatus, IncidentreportDetail } from "../incidentreport/incidentreport.model";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { ProhibitedDetails, ProhibitedDetailsStatus, ProhibitedItemAudit } from "../master/concessionaire-security/concessionaire.model";

@Component({
  selector: "app-auditlog",
  templateUrl: "auditlog.component.html",
  styleUrls: ["./auditlog.component.scss"]
})
export class AuditLogComponent implements OnInit {
  // modalRef: BsModalRef;
  //  citationdetailsStatus: CitationDetailStatus[];
  @ViewChild("template") modalContent: TemplateRef<any>;
  
  dtOptions={}// DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject(); 

  dtOptions1={} //DataTables.Settings = {};
  dtTrigger1: Subject<any> = new Subject(); 

  dtOptions2={}//: DataTables.Settings = {};
  dtTrigger2: Subject<any> = new Subject(); 

  dtOptions3={}//: DataTables.Settings = {};
  dtTrigger3: Subject<any> = new Subject();
  
  dtOptions4={}//: DataTables.Settings = {};
  dtTrigger4: Subject<any> = new Subject();

  dtOptions5={}//: DataTables.Settings = {};
  dtTrigger5: Subject<any> = new Subject();

  dtOptions6={}//: DataTables.Settings = {};
  dtTrigger6: Subject<any> = new Subject();

  dtOptions7={}//: DataTables.Settings = {};
  dtTrigger7: Subject<any> = new Subject();

  fromDate: string;
  toDate: string;
  citationId: number;
  inspectionId: number;
  updatedBy: string;

  citationdetailsStatusFromDb: CitationDetailStatus[] = [];
  citationdetailsStatus: CitationDetailStatus[] = [];
  citationdetailsStatusAll: CitationDetailStatus[] = [];
  allCitationsId: CitationDetails[] = [];
  currentRecord: CitationDetailStatus = new CitationDetailStatus();
  previousRecord: CitationDetailStatus = new CitationDetailStatus();

  inspectionetailsStatusFromDb: InspetionRecordDetailStatus[] = [];
  inspectiondetailsStatus: InspetionRecordDetailStatus[] = [];
  inspectiondetailsStatusAll: InspetionRecordDetailStatus[] = [];
  allInspectionsId: InspetionRecordDetail[] = [];
  currentRecordInsp: InspetionRecordDetailStatus = new InspetionRecordDetailStatus();
  previousRecordInsp: InspetionRecordDetailStatus = new InspetionRecordDetailStatus();

  securityClearanceFromDB: SecurityClearanceAuditLog[] = [];
  securityClearance: SecurityClearanceAuditLog[] = [];
  securityClearanceAll: SecurityClearanceAuditLog[] = [];

  badgeVerificationFromDB: BadgeVerificationAudit[] = [];
  badgeVerification: BadgeVerificationAudit[] = [];
  badgeVerificationAll: BadgeVerificationAudit[] = [];

  systemLogsFromDB: SystemLogAudit[] = [];
  systemLogs: SystemLogAudit[] = [];
  systemLogsAll: SystemLogAudit[] = [];

  incidentdetailsStatusFromDb: IncidentRecordDetailStatus[] = [];
  incidentdetailsStatus: IncidentRecordDetailStatus[] = [];
  incidentdetailsStatusAll: IncidentRecordDetailStatus[] = [];
  incidentRecordDetail: IncidentreportDetail[] = [];
  currentRecordIncident: IncidentRecordDetailStatus = new IncidentRecordDetailStatus();
  previousRecordIncident: IncidentRecordDetailStatus = new IncidentRecordDetailStatus();

  prohibiteAuditFromDB:ProhibitedItemAudit[] = [];
  prohibiteAudit:ProhibitedItemAudit[] = [];
  prohibiteAuditAll:ProhibitedItemAudit[] = [];

  prohibitedDetailsFromDB:ProhibitedDetailsStatus[] = [];
  prohibitedDetails:ProhibitedDetailsStatus[] = []
  prohibitedDetailsAll:ProhibitedDetailsStatus[] = [] 
  currentRecordProhibited: ProhibitedDetailsStatus = new ProhibitedDetailsStatus();
  previousRecordProhibited:ProhibitedDetailsStatus = new ProhibitedDetailsStatus();

  currentRemedialTrainings: any;
  previousRemedialTrainings: any;
  user: any;

  isCitation: boolean = true;
  isInspection: boolean = false;
  isSecurityClearance: boolean = false;
  isBadgeVerification: boolean = false
  showCitationTable: boolean = true;
  showInspectionTable: boolean = false;
  showSecurityClearanceTable: boolean = false;
  showBadgeVerificationTable: boolean = false;
  isSystemLogs:boolean = false;
  showSystemLogsTable:boolean = false;
  isIncidentReport:boolean = false
  showIncidentTable:boolean = false;
  isProhibitedAudit:boolean = false;
  showProhibitedAudit:boolean = false;
  isProhibitedDetails:boolean = false;
  showProhibitedDetails:boolean = false
  auditType
  days: number

  closeResult: string;

  audit: AuditLogData = new AuditLogData()
  readonly DELIMITER = '/';

  auditTypes = [
    {type : "NOV/COU", value:"citation"},
    {type : "Inspection", value: "inspection"},
    {type : "Security Clearance", value: "securityClearance"},
    {type : "Badge Verification", value: "badgeVerification"},
    {type : "Incident Report", value: "incidentreport"},
    {type : "Prohibited Items", value: "prohibitedItems" },
    {type : "Prohibited Audit", value: "prohibitedAudit"},
    {type : "SEMS System Logs", value: "systemlog"},
  ]

  constructor(
    // private modalService: BsModalService,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private AuditLogService: AuditLogService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService, 
    private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar, private appURL: AppConfigService,
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[4, 'desc']],
      columnDefs: [
        { targets: 4, type: 'date' }
      ],
    }
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[3, 'desc']],
      columnDefs: [
        { targets: 3, type: 'date' }
      ],
    } 
    
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[2, 'desc']],
      columnDefs: [
        { targets: 2, type: 'date' }
      ],
    } 

    this.dtOptions3 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[2, 'desc']],
      columnDefs: [
        { targets: 2, type: 'date' }
      ],
    }
    
    this.dtOptions4 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[2, 'desc']],
      columnDefs: [
        { targets: 2, type: 'date' }
      ],
    }

    this.dtOptions5 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[3, 'desc']],
      columnDefs: [
        { targets: 3, type: 'date' }
      ],
    }

    this.dtOptions6 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[3, 'desc']],
      columnDefs: [
        { targets: 3, type: 'date' }
      ],
    } 

     this.dtOptions7 = {
      pagingType: 'full_numbers',
      pageLength: 50,
      stateSave: true,
      stateDuration: -1,
      order: [[3, 'desc']],
      columnDefs: [
        { targets: 3, type: 'date' }
      ],
    } 

    this.isCitation = true
    this.showCitationTable = true 
    this.auditType = 'citation'
    this.days = 15 
    // this.toDate = this.datePipe.transform(new Date(),'MM/dd/yyyy'); 
    this.audit.toDate = this.dateAdapter.toModel(this.ngbCalendar.getToday())      
    // this.fromDate= this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() - 15)),'MM/dd/yyyy'); 
    this.audit.fromDate = this.dateAdapter.toModel(this.ngbCalendar.getPrev(this.ngbCalendar.getToday(),'d',15))
    
    this.fromDate = this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
    this.toDate = this.dateAdapter.toModel(this.fromModel(this.audit.toDate))
    this.GetCitationDetailsStatusList(this.fromDate,this.toDate);    
    // this.GetCitationsIdList();
    this.GetInspectionDetailsStatusList(this.fromDate,this.toDate);
    // this.GetInspectionsIdList();
    this.GetSecurityClearanceData(this.fromDate,this.toDate)    
    this.GetBadgeVerificationDataForAuditLog(this.fromDate,this.toDate)  
    this. GetSystemLogsDataForAuditLog(this.fromDate,this.toDate)
    this. GetIncidentList(this.fromDate,this.toDate)
    this.GetProhibitedAuditList(this.fromDate,this.toDate)
    //this.GetProhibitedItemsList(this.fromDate,this.toDate)
  }

  convertDate(date): string {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : '';
  }

  openModalProhibited(template4: TemplateRef<any>, prohibitedId,id) {   
    this.currentRecordProhibited = this.prohibitedDetailsAll
      .filter(c => c.id == id && c.prohibitedItemDetailsId == prohibitedId)
      .sort(c => c.id)[0];
      // if(this.currentRecordProhibited != undefined){
      //   this.currentRecordIncident.newTimeOccurred = this.datePipe.transform(this.currentRecordIncident.timeOccurred, 'HH:mm');
      // this.currentRecordIncident.newTimeOccurred = this.onTimeChange(this.currentRecordIncident.newTimeOccurred)
      // }
      

    this.previousRecordProhibited = this.prohibitedDetailsAll
      .filter(c => c.id < id && c.prohibitedItemDetailsId == prohibitedId)
      .sort(c => c.id)[0];   
      // if( this.previousRecordIncident != undefined){
      //   this.previousRecordIncident.newTimeOccurred = this.datePipe.transform(this.previousRecordIncident.timeOccurred, 'HH:mm');
      //   this.previousRecordIncident.newTimeOccurred = this.onTimeChange(this.previousRecordIncident.newTimeOccurred)
      // }
     

    this.modalService.open(template4, {size:'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalIncident(template3: TemplateRef<any>, incidentId,id) {   
    this.currentRecordIncident = this.incidentdetailsStatusAll
      .filter(c => c.id == id && c.incidentId == incidentId)
      .sort(c => c.id)[0];
      if(this.currentRecordIncident != undefined){
        this.currentRecordIncident.newTimeOccurred = this.datePipe.transform(this.currentRecordIncident.timeOccurred, 'HH:mm');
      this.currentRecordIncident.newTimeOccurred = this.onTimeChange(this.currentRecordIncident.newTimeOccurred)
      }
      

    this.previousRecordIncident = this.incidentdetailsStatusAll
      .filter(c => c.id < id && c.incidentId == incidentId)
      .sort(c => c.id)[0];   
      if( this.previousRecordIncident != undefined){
        this.previousRecordIncident.newTimeOccurred = this.datePipe.transform(this.previousRecordIncident.timeOccurred, 'HH:mm');
        this.previousRecordIncident.newTimeOccurred = this.onTimeChange(this.previousRecordIncident.newTimeOccurred)
      }
     

    this.modalService.open(template3, {size:'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  openModalInspection(template2: TemplateRef<any>, inspectionId,id) {   
    this.currentRecordInsp = this.inspectiondetailsStatusAll
      .filter(c => c.id == id && c.inspectionId == inspectionId)
      .sort(c => c.id)[0];

    this.previousRecordInsp = this.inspectiondetailsStatusAll
      .filter(c => c.id < id && c.inspectionId == inspectionId)
      .sort(c => c.id)[0];   

    // this.modalRef = this.modalService.show(template2, { class: "modal-lg" });   
    this.modalService.open(template2, {size:'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal(template: TemplateRef<any>,template1: TemplateRef<any>, citationId, id,type) {
    this.currentRemedialTrainings = [];
    this.previousRemedialTrainings = [];
    this.currentRecord = this.citationdetailsStatusAll
      .filter(c => c.id == id && c.citationId == citationId)
      .sort(c => c.id)[0];

    this.previousRecord = this.citationdetailsStatusAll
      .filter(c => c.id < id && c.citationId == citationId)
      .sort(c => c.id)[0];

    if (this.currentRecord.remedialTrainingTypeName != null) {
      this.currentRemedialTrainings = this.currentRecord.remedialTrainingTypeName.split(
        ","
      );
    }
    if (this.previousRecord != undefined) {
      if (this.previousRecord.remedialTrainingTypeName != null) {
        this.previousRemedialTrainings = this.previousRecord.remedialTrainingTypeName.split(
          ","
        );
      }
    }
    if(type == 'NOV')
    {
      // this.modalRef = this.modalService.show(template, { class: "modal-lg" });
      this.modalService.open(template, {size:'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    if(type == 'COU')
    {
      // this.modalRef = this.modalService.show(template1, { class: "modal-lg" });
      this.modalService.open(template1, {size:'lg'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    
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
  private processData() {
    const citationIdSeen = {};
    this.citationdetailsStatus = this.citationdetailsStatusFromDb
      .sort((a, b) => {
        const violationTypeIdComp = a.citationId
          .toString()
          .localeCompare(b.citationId.toString());
        return violationTypeIdComp; // ? violationTypeIdComp : a.county.localeCompare(b.county);
      })
      .map(x => {
        const citationIdSpan = citationIdSeen[x.citationId.toString()]
          ? 0
          : this.citationdetailsStatusFromDb.filter(
            y => y.citationId.toString() === x.citationId.toString()
          ).length;
        citationIdSeen[x.citationId.toString()] = true;
        return { ...x, citationIdSpan };
      });
  }

  public GetCitationDetailsStatusList(fromDate,toDate) {
    $('#dt1').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetCitationDetailsStatusList(fromDate,toDate).subscribe(
      (response: CitationDetailStatus[]) => {
        this.citationdetailsStatusFromDb = response;
        this.citationdetailsStatusAll = response;        
        this.dtTrigger.next();
        //this.processData();
        // this.dtTrigger.next();
        //this.spinner.hide();
      }
    );    
  }

  public GetInspectionDetailsStatusList(fromDate,toDate) {
    $('#dt2').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetInspectionDetailsStatusList(fromDate,toDate).subscribe(
      (response: InspetionRecordDetailStatus[]) => {
        this.inspectionetailsStatusFromDb = response;
        this.inspectiondetailsStatusAll = response;        
        this.dtTrigger1.next();
        //this.processData();
        // this.dtTrigger.next();
        //this.spinner.hide();
      }
    );
  }
  

  public GetSecurityClearanceData(fromDate,toDate)
  {
    $('#dt3').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetSecurityClearanceData(fromDate,toDate).subscribe(
      (response: SecurityClearanceAuditLog[]) => {
        this.securityClearanceFromDB = response;
        this.securityClearanceAll = response;        
        this.dtTrigger2.next();
        //this.processData();
        // this.dtTrigger.next();
        //this.spinner.hide();
      }
    );
  }

  public GetBadgeVerificationDataForAuditLog(fromDate,toDate)
  {
    $('#dt4').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetBadgeVerificationDataForAuditLog(fromDate,toDate).subscribe(
      (response: BadgeVerificationAudit[]) => {
        this.badgeVerificationFromDB = response;
        this.badgeVerificationAll = response;        
        this.dtTrigger3.next();
        //this.processData();
        // this.dtTrigger.next();
        //this.spinner.hide();
      }
    );
  }

  public GetSystemLogsDataForAuditLog(fromDate,toDate)
  {
    $('#dt5').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetSystemLogsDataForAuditLog(fromDate,toDate).subscribe(
      (response: SystemLogAudit[]) => {
        this.systemLogsFromDB = response;
        this.systemLogsAll = response;        
        this.dtTrigger4.next();
        //this.processData();
        // this.dtTrigger.next();
        //this.spinner.hide();
      }
    );
  }

  public GetIncidentList(fromDate,toDate)
  {
    $('#dt6').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetIncidentList(fromDate,toDate).subscribe(
      (response: IncidentRecordDetailStatus[]) => {
        //this.incidentRecordDetail = response;
        this.incidentdetailsStatusFromDb = response;
        this.incidentdetailsStatusAll = response;  
          
        this.dtTrigger5.next();
        
      }
    );
  }

  public GetProhibitedAuditList(fromDate,toDate)
  {
    $('#dt7').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetProhibitedAuditList(fromDate,toDate).subscribe(
      (response: ProhibitedItemAudit[]) => {
        this.prohibiteAuditFromDB = response;
        this.prohibiteAuditAll = response;        
        this.dtTrigger6.next();
      }
    );
  }


  public GetProhibitedItemsList(fromDate,toDate)
  {
    $('#dt8').DataTable().destroy();
    //this.spinner.show();
    this.AuditLogService.GetProhibitedItemsList(fromDate,toDate).subscribe(
      (response: ProhibitedDetailsStatus[]) => {
        //this.incidentRecordDetail = response;
        this.prohibitedDetailsFromDB = response;
        this.prohibitedDetailsAll = response;  
          
        this.dtTrigger7.next();
        
      }
    );
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

  public searchList(fromDate,toDate) {
    if(this.isCitation == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetCitationDetailsStatusList(frmDate,tDate)
      
      // var list = this.citationdetailsStatusAll;
      // //$('#dt1').DataTable().destroy();
      // if (
      //   this.toDate != "mm/dd/yyyy" &&
      //   this.toDate != undefined &&
      //   this.toDate != ""
      // ) {
      //   list = list.filter(
      //     c =>
      //       new Date(this.datePipe.transform(c.updatedDate, "MM/dd/yyyy")) <=
      //       new Date(this.datePipe.transform(this.toDate, "MM/dd/yyyy"))
      //   );
      // }
      // if (
      //   this.fromDate != "mm/dd/yyyy" &&
      //   this.fromDate != undefined &&
      //   this.fromDate != ""
      // ) {
      //   list = list.filter(
      //     c =>
      //       new Date(this.datePipe.transform(c.updatedDate, "MM/dd/yyyy")) >=
      //       new Date(this.datePipe.transform(this.fromDate, "MM/dd/yyyy"))
      //   );
      // }

      // if (this.citationId != undefined && this.citationId > 0) {
      //   list = list.filter(c => c.citationId == this.citationId);
      // }

      // if (this.updatedBy != undefined) {
      //   list = list.filter(c =>
      //     c.updatedBy
      //       .toLowerCase()
      //       .includes(this.updatedBy.toLowerCase()));
      // }
      // //  this.dtTrigger.next();
      // $('#dt1').DataTable().destroy();
      // this.citationdetailsStatusFromDb = list;
      // this.dtTrigger.next();
      // //this.processData();
    }


    if(this.isInspection == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetInspectionDetailsStatusList(frmDate,tDate)

      // var list1 = this.inspectiondetailsStatusAll;
      // //$('#dt2').DataTable().destroy();
      // if (
      //   this.toDate != "mm/dd/yyyy" &&
      //   this.toDate != undefined &&
      //   this.toDate != ""
      // ) {
      //   list1 = list1.filter(
      //     c =>
      //       new Date(this.datePipe.transform(c.updatedDate, "MM/dd/yyyy")) <=
      //       new Date(this.datePipe.transform(this.toDate, "MM/dd/yyyy"))
      //   );
      // }
      // if (
      //   this.fromDate != "mm/dd/yyyy" &&
      //   this.fromDate != undefined &&
      //   this.fromDate != ""
      // ) {
      //   list1 = list1.filter(
      //     c =>
      //       new Date(this.datePipe.transform(c.updatedDate, "MM/dd/yyyy")) >=
      //       new Date(this.datePipe.transform(this.fromDate, "MM/dd/yyyy"))
      //   );
      // }

      // if (this.inspectionId != undefined && this.inspectionId > 0) {
      //   list1 = list1.filter(c => c.inspectionId == this.inspectionId);
      // }

      // if (this.updatedBy != undefined) {
      //   list1 = list1.filter(c =>
      //     c.updatedBy
      //       .toLowerCase()
      //       .includes(this.updatedBy.toLowerCase()));
      // }
      // //  this.dtTrigger1.next();
      // $('#dt2').DataTable().destroy();
      // this.inspectionetailsStatusFromDb = list1;
      // this.dtTrigger1.next();
      // //this.processData();
    }

    if(this.isSecurityClearance == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetSecurityClearanceData(frmDate,tDate)
    }

    if(this.isBadgeVerification == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetBadgeVerificationDataForAuditLog(frmDate,tDate)
    }
    
    if(this.isSystemLogs == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetSystemLogsDataForAuditLog(frmDate,tDate)
    }

    if(this.isIncidentReport == true)
    {
      // var frmDate= this.datePipe.transform(fromDate,'MM/dd/yyyy');
      // var tDate= this.datePipe.transform(toDate,'MM/dd/yyyy');

      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetIncidentList(frmDate,tDate)
    }

    if(this.isProhibitedAudit == true ){
      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetProhibitedAuditList(frmDate,tDate)
    }

    if(this.isProhibitedDetails == true ){
      var frmDate=  this.dateAdapter.toModel(this.fromModel(this.audit.fromDate))
      var tDate=  this.dateAdapter.toModel(this.fromModel(this.audit.toDate))

      this.GetProhibitedItemsList(frmDate,tDate)
    }
  }

  public clearList() {
    $('#dt1').DataTable().destroy();
    this.GetCitationDetailsStatusList(this.audit.fromDate,this.audit.toDate);
    $('#dt2').DataTable().destroy();
    this.GetInspectionDetailsStatusList(this.audit.fromDate,this.audit.toDate);
    this.audit.toDate = "";
    this.audit.fromDate = "";
    this.citationId = 0;
    this.inspectionId = 0;
    this.updatedBy = "";
  }

  public GetCitationsIdList() {
    this.AuditLogService.GetCitationsIdList().subscribe(
      (response: CitationDetails[]) => {
        this.allCitationsId = response;
      },
      (error:any)=> {
        console.log("error list");
      }
    );
  }

  public GetInspectionsIdList() {
    this.AuditLogService.GetInspectionsIdList().subscribe(
      (response: InspetionRecordDetail[]) => {
        this.allInspectionsId = response;
      },
      (error:any)=> {
        console.log("error list");
      }
    );
  }

  

  public setType(auditType)
  {    
    if(auditType == 'citation')
    {
      this.isCitation = true;
      this.isInspection = false;
      this.isSecurityClearance = false;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = false
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    }
    if(auditType == 'inspection')
    {
      this.isCitation = false;
      this.isInspection = true;
      this.isSecurityClearance = false;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = false
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    }   
    if(auditType == 'securityClearance')
    {
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = true;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = false
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    }  
    if(auditType == 'badgeVerification')
    {
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = false;
      this.isBadgeVerification = true;
      this.isSystemLogs = false;
      this.isIncidentReport = false
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    }  
    if(auditType == 'systemlog')
    {
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = false;
      this.isBadgeVerification = false;
      this.isSystemLogs = true;
      this.isIncidentReport = false
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    } 
    if(auditType == 'incidentreport'){
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = true;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = true
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = false;
    }
    if(auditType == 'prohibitedAudit'){
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = true;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = false;
      this.isProhibitedAudit = true;
      this.isProhibitedDetails = false;
    }
    if(auditType == 'prohibitedItems'){
      this.isCitation = false;
      this.isInspection = false;
      this.isSecurityClearance = true;
      this.isBadgeVerification = false;
      this.isSystemLogs = false;
      this.isIncidentReport = false;
      this.isProhibitedAudit = false;
      this.isProhibitedDetails = true;
    }
  }

  public selectTable()
  {
    if(this.isCitation == true)
    {
      this.showCitationTable = true
      this.showInspectionTable = false   
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showIncidentTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isInspection == true)
    {
      this.showInspectionTable = true
      this.showCitationTable = false
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showIncidentTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isSecurityClearance == true)
    {
      this.showInspectionTable = false
      this.showCitationTable = false
      this.showSecurityClearanceTable = true
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isBadgeVerification == true)
    {
      this.showInspectionTable = false
      this.showCitationTable = false
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = true
      this.showSystemLogsTable = false
      this.showIncidentTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isSystemLogs == true)
    {
      this.showInspectionTable = false
      this.showCitationTable = false
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = true
      this.showIncidentTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isIncidentReport == true){
      this.showCitationTable = false
      this.showInspectionTable = false   
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showIncidentTable = true
      this.showProhibitedAudit = false
      this.showProhibitedDetails = false
    }
    if(this.isProhibitedAudit == true){
      this.showCitationTable = false
      this.showInspectionTable = false   
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showIncidentTable = false
      this.showProhibitedAudit = true
      this.showProhibitedDetails = false
    }
    if(this.isProhibitedDetails == true){
      this.showCitationTable = false
      this.showInspectionTable = false   
      this.showSecurityClearanceTable = false
      this.showBadgeVerificationTable = false
      this.showSystemLogsTable = false
      this.showIncidentTable = false
      this.showProhibitedAudit = false
      this.showProhibitedDetails = true
    }
  }


}
