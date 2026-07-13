import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup } from '@angular/forms';
import { NovService } from '../nov.service';
import { CitationDetails, CitationAttachments, CitationEvents, recentCitationMaster } from '../CitationDetails';
import { SignaturePad } from 'angular2-signaturepad';
import { CorrectiveActions } from '../correctiveactions';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EventTypes } from '../../master/eventtypes';
import { EventTypesService } from '../../master/eventtypes/eventtype.service';
import { Subject } from 'rxjs';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { ViolationTypes } from '@app/pages/master/violationtypes';
import { CitationReasons } from '@app/pages/master/citationreasons';
import { ViolationTypesService } from '@app/pages/master/violationtypes/violationtype.service';
import { CitationReasonsService } from '@app/pages/master/CitationReasons/citationreasons.service';

@Component({
    selector: 'app-novview',
    templateUrl: './novview.component.html',
    styleUrls: ['./novview.component.scss']
})
export class NovViewComponent implements OnInit {
    @ViewChild(SignaturePad, { static: false }) public signaturePad: SignaturePad;
    @ViewChild('input', { static: false }) myInputVariable: ElementRef;

    public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
        'minWidth': 1,
        'canvasWidth': 500,
        'canvasHeight': 200
    };
    imgfileurl: string;
    user: any;
    isCollapsed = false;
    loading = false;
    isStaffAdmin: boolean = false;
    isAuthsigner: boolean = false;
    isIssuer: boolean = true;
    citation: CitationDetails = new CitationDetails();
    correctiveAction: CorrectiveActions = new CorrectiveActions();
    citationList: CitationDetails[];
    CitationImagesLst: string[] = [];
    isViewCorrectiveActions: boolean = true;
    isdivClass: boolean = false;
    eventTypeList: EventTypes[] = [];

    dtOptions: any = {};
    // We use this trigger because fetching the list can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject();
    citationEvents: CitationEvents[] = [];

    citationAttachmentsissuers: CitationAttachments[] = [];
    citationAttachmentsStaffadmin: CitationAttachments[] = [];
    citationAttachmentsAuthsigner: CitationAttachments[] = [];
    divTab1: boolean = true;
    divTab2: boolean = true;
    showBtn = -1;
    citationAttachmentsissuersImg: CitationAttachments[] = [];
    citationAttachmentsissuersFile: CitationAttachments[] = [];

    citationAttachmentsStaffadminImg: CitationAttachments[] = [];
    citationAttachmentsStaffadminFile: CitationAttachments[] = [];

    citationAttachmentsAuthsignerImg: CitationAttachments[] = [];
    citationAttachmentsAuthsignerFile: CitationAttachments[] = [];

    showTsa:boolean = false

    callCount = 0;
    unfilteredViolationTypes: ViolationTypes[];
    Filtered: CitationReasons[];
    CitationReasonsFromDb: CitationReasons[];
    showPopup = false;
    couCount: number = 0;
    novCount: number = 0;
    pastCou: recentCitationMaster[] = [];
    dtOptionsPastCou: {};
    dataLoaded: boolean = false;
    allViolationTypes: ViolationTypes[] = [];
    activeViolationTypes: ViolationTypes[] = [];
    isCitationEdit: string ;
    //showBtn=-1;
    constructor(private router: Router, private route: ActivatedRoute, private NovService: NovService, private appURL: AppConfigService,
        private eventTypesService: EventTypesService, private datePipe: DatePipe, private spinner: NgxSpinnerService,
         private toastr: ToastrService, private ViolationTypesService: ViolationTypesService, private CitationReasonsService: CitationReasonsService
        ) { }

    ngOnInit() {
        this.dtOptions = {
            pagingType: "full_numbers",
            pageLength: 10,
            order: [[1, 'desc']],
            searching:false,
            info:false,
            bInfo:false,
            bLengthChange:false,
            paging: false,
            columnDefs: [
              { targets: 1, type: 'date' }
            ]
            // retrieve: true,
          };
        //this.imgfileurl = fileURL;
        this.GetEventTypeList();

         //Get Citationreason list
    this.GetCitationReasonList();

    //Get ViolationType list
    this.GetViolationTypeList();
        //Get user form local storage
        this.user = JSON.parse(sessionStorage.getItem("currentUser"));
        if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
            if (!this.user.passwordReseted) {
              //this.spinner.hide();
              this.router.navigate(['admin/changepassword']);
            }
          }    
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
        var tabName = sessionStorage.getItem('tab');
        if (this.user.rolename == "Issuer") {
            this.isStaffAdmin = false;
            this.isAuthsigner = false;
            this.isIssuer = true;

        }
        else if (this.user.rolename == "StaffAdmin") {
            this.isStaffAdmin = true;
            this.isAuthsigner = false;
            this.isIssuer = false;
            if (tabName == "tab2") {
                this.divTab2 = true;
            }
        }
        else if (this.user.rolename == "AuthSigner") {
            this.isStaffAdmin = false;
            this.isAuthsigner = true;
            this.isIssuer = false;
            if (tabName == "tab2") {
                this.divTab2 = true;
                this.divTab1 = false;
            }
            if (tabName == "tab1") {
                this.divTab1 = true;
                this.divTab2 = false;
            }
        }

        var citationId: number = this.route.snapshot.pathFromRoot[1].queryParams['citationId'];
        this.GetCitationDetailsById(citationId);
        if (this.isStaffAdmin || this.isAuthsigner) {
            this.GetCorrectiveActionByCitationId(citationId);
        }
        this.GetCorrectiveActionByCitationId(citationId);
        var divClass = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
        if (divClass == "0") {
            this.isdivClass = true;
        }
        else {
            if (tabName == "tab2") {
                this.isViewCorrectiveActions = true;
            }
            else {
                this.isViewCorrectiveActions = false;
            }
        }
    }

    public GetEventTypeList() {
        this.eventTypesService.GetEventTypeList().subscribe((response: EventTypes[]) => {
            this.eventTypeList = response;
        }, (error:any)=> {
            console.log("error list");
        });
    }
    trackByEventIndex(index: any) {
        return index;
    }
    getEventName(eventTypeId: number) {
        return this.eventTypeList.filter(x => x.id == eventTypeId)[0].type;
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

    // downloadFile(filename) {

    //     window.open(
    //         fileURL + filename,
    //         '_blank' // <- This is what makes it open in a new window.
    //     );
    // }

    //Download file
    downloadFile(id: number, fileName: string) {
        this.NovService.getAttachment(id).subscribe(
            data => {        this.toastr.success("File is Downloading....Please wait!!")

                const blob = new Blob([data], { type: data.type });
                // if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
                //     window.navigator.msSaveOrOpenBlob(blob, fileName);
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
            (error:any)=> {
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
                //     var newBlob = new Blob([data], { type: data.type })
                //     window.navigator.msSaveOrOpenBlob(newBlob, fileName);
                //     return;
                // }
                const objectURL = window.URL.createObjectURL(data);
                window.open(objectURL, '_blank');
                setTimeout(function () {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(objectURL);
                }, 100);
            },
            (error:any)=> {
                this.toastr.error(
                    `Error occurred while fetching attachment. <br />
      ${error.message}`, 'Error');
            });
    }

    public GetCitationDetails() {
        this.router.navigate(["admin/nov"]);
    }

   
    public GetCitationDetailsById(citationId: number) {
        var companyId = (this.user.rolename == "AuthSigner" ? this.user.companyId : 0);
        //this.spinner.show();
        this.NovService.GetCitationDetailsById(citationId, companyId)
            .subscribe(
                data => {
                    this.citation = data;                   
                    this.citationEvents = this.citation.eventList;
                    this.citationEvents.forEach(element => {
                      element.eventDate = new Date(element.eventDate).toString();
                    });
                    this.dtTrigger.next();
                    // this.citation.eventList.forEach(element => {
                    //     return element.eventTimeObj = {
                    //         hour: +element.eventTime.split(":")[0],
                    //         minute: +element.eventTime.split(":")[1]
                    //     }
                    // });

                   // this.citation.eventList.sort(this.sortFunction);

                    this.citationAttachmentsissuersImg = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
                    this.citationAttachmentsissuersFile = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');


                    this.citationAttachmentsStaffadminImg = data.citationAttachments.filter(x => x.tabNo == 'Tab2' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
                    this.citationAttachmentsStaffadminFile = data.citationAttachments.filter(x => x.tabNo == 'Tab2' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

                    this.citationAttachmentsAuthsignerImg = data.citationAttachments.filter(x => x.tabNo == 'Tab3' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
                    this.citationAttachmentsAuthsignerFile = data.citationAttachments.filter(x => x.tabNo == 'Tab3' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');


                    // this.citationAttachmentsissuers = data.citationAttachments.filter(x => x.tabNo == 'Tab1');
                    // this.citationAttachmentsStaffadmin = data.citationAttachments.filter(x => x.tabNo == 'Tab2');
                    // this.citationAttachmentsAuthsigner = data.citationAttachments.filter(x => x.tabNo == 'Tab3');


                    this.citation.violatorBirthDate = this.datePipe.transform(this.citation.violatorBirthDate, 'yyyy-MM-dd');
                    this.citation.violationDate = this.datePipe.transform(this.citation.violationDate, 'yyyy-MM-dd');
                    //this.spinner.hide();
                    this.GetCorrectiveActionByCitationId(data.id);
                    //this.GetCouRecordsList(this.citation.securityBadgeNo,this.citation.personUniqueId);
                    if(this.citation.personUniqueId != null && this.citation.personUniqueId != ""){
                        this.GetCouRecordsList(null,this.citation.personUniqueId);
                    }else{
                        this.GetCouRecordsList(this.citation.securityBadgeNo,null);
                    }
                }, (error:any)=> {
                    //this.spinner.hide();
                    // //this.spinner.hide();
                    // this.toastr.error(
                    //   `${this.messages.user.getUsersGeneralError} <br />
                    //   ${error}`,
                    //   "Error");
                });
    }
    sort() {
        // Ascending
        this.citation.eventList.sort((a,b) => 0 - (a > b ? -1 : 1));
         // Descending
        this.citation.eventList.sort((a,b) => 0 - (a > b ? 1 : -1));
    }
    sortFunction(a,b){  
        var dateA = new Date(a.eventDate).getTime();
        var dateB = new Date(b.eventDate).getTime();
        return dateA > dateB ? 1 : -1;  
      }; 
      getDateTrans(date)
      {
        return this.datePipe.transform(date, 'MM/dd/yyyy hh:mm a')
      }
    public GetCorrectiveActionByCitationId(citationId: number) {
        //this.spinner.show();
        this.NovService.GetCorrectiveActionByCitationId(citationId)
            .subscribe(
                data => {
                    if (data != null)
                        this.correctiveAction = data;
                    this.correctiveAction.badgeSuspendedDate = this.datePipe.transform(this.correctiveAction.badgeSuspendedDate, 'yyyy-MM-dd');
                    this.correctiveAction.remedialTrainingAssignedDate = this.datePipe.transform(this.correctiveAction.remedialTrainingAssignedDate, 'yyyy-MM-dd');
                    this.correctiveAction.badgeReactivatedDate = this.datePipe.transform(this.correctiveAction.badgeReactivatedDate, 'yyyy-MM-dd');
                    this.correctiveAction.badgeDeactivatedDate = this.datePipe.transform(this.correctiveAction.badgeDeactivatedDate, 'yyyy-MM-dd');
                    this.correctiveAction.dateOfDisclosure = this.datePipe.transform(this.correctiveAction.dateOfDisclosure, 'yyyy-MM-dd');
                    this.correctiveAction.correctiveActionCompletedDate = this.datePipe.transform(this.correctiveAction.correctiveActionCompletedDate, 'yyyy-MM-dd');
                    if(this.correctiveAction.tsa == "Yes"){
                        this.showTsa = true
                    }
                    // if(this.correctiveAction.paymentMethod == "UsethecompanycardonfilewithSBO" && this.correctiveAction.adminFine == true){
                    //     this.correctiveAction.paymentMethod = "Use the company card on file with SBO"
                    // }else if(this.correctiveAction.paymentMethod == "TheSBOwillbecontactedforotherpaymentmethod" && this.correctiveAction.adminFine == true){
                    //     this.correctiveAction.paymentMethod = "The SBO will be contacted for other payment method"
                    // }else{
                    //     this.correctiveAction.paymentMethod = ""
                    // }
                    // if (this.correctiveAction.premedialTraining != null) {
                    //     this.previousRemedialTrainings = this.previousRecord.remedialTraining.split(
                    //       "?"
                    //     );
                    //   }
                    //this.spinner.hide();
                }, (error:any)=> {
                    //this.spinner.hide();
                    // this.toastr.error(
                    //   `${this.messages.user.getUsersGeneralError} <br />
                    //   ${error}`,
                    //   "Error");
                });
    }

    public GetViolationTypeList() {
        this.ViolationTypesService.GetViolationTypeList().subscribe((response: ViolationTypes[]) => {
          const selectedId = this.citation?.violationTypeId;
          this.allViolationTypes = response.map(x => ({
            ...x,
            isDisabled: !x.status && x.id !== selectedId
          }));
    
          this.activeViolationTypes = this.allViolationTypes.filter(x => x.status === true);
          
        }, (error: any) => {
          console.log("error list");
        });
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

  public GetCitationReasonList() {
    
    this.CitationReasonsService.GetCitationReasonList().subscribe((response: CitationReasons[]) => {
      this.CitationReasonsFromDb = response;
      
    
    

    });
  }

   getViolationTypeName(id: number): string {
    // if(this.isCitationEdit == "1"){
    //   const type = this.activeViolationTypes.find((x) => x.id === id);
    //   return type ? type.violationType : "-";
    // }else{
      const type = this.allViolationTypes.find((x) => x.id === id);
      return type ? type.violationType : "-";
    //}
    
    
  }

  getCitaionReasonName(id: number): string {
    //console.log(this.Filtered);
    const type = this.CitationReasonsFromDb.find((x) => x.id === id);
    return type ? type.reason : "-";
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
}
