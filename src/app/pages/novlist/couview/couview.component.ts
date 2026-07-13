import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Locations } from '../../master/locations';
import { CitationAttachments, CitationDetails, recentCitationMaster } from '../CitationDetails';
import { NovService } from '../nov.service';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { ViolationTypes } from '@app/pages/master/violationtypes';
import { CitationReasons } from '@app/pages/master/citationreasons';
import { CitationReasonsService } from '@app/pages/master/CitationReasons/citationreasons.service';
import { ViolationTypesService } from '@app/pages/master/violationtypes/violationtype.service';

@Component({
  selector: 'app-couview',
  templateUrl: './couview.component.html',
  styleUrls: ['./couview.component.scss']
})
export class CouviewComponent implements OnInit { 
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
cou: CitationDetails = new CitationDetails();
couList: CitationDetails[];
CitationImagesLst: string[] = [];
isdivClass: boolean = false;
dtOptions: any = {};
// We use this trigger because fetching the list can be quite long,
// thus we ensure the data is fetched before rendering
dtTrigger: Subject<any> = new Subject();
showBtn = -1;
couAttachmentsImg: CitationAttachments[] = [];
couAttachmentsFile: CitationAttachments[] = [];
selectedDoorGateNumber: Locations[] = []
selectedDoorNames: string = "";

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
     private datePipe: DatePipe, private spinner: NgxSpinnerService, private toastr: ToastrService,
    private CitationReasonsService: CitationReasonsService, private ViolationTypesService: ViolationTypesService) { }


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
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
        if (!this.user.passwordReseted) {
          //this.spinner.hide();
          this.router.navigate(['admin/changepassword']);
        }
      }    
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
    }
    else if (this.user.rolename == "AuthSigner") {
        this.isStaffAdmin = false;
        this.isAuthsigner = true;
        this.isIssuer = false;      
    }

     this.GetCitationReasonList();

    //Get ViolationType list
    this.GetViolationTypeList();


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
    var couId: number = this.route.snapshot.pathFromRoot[1].queryParams['couId'];
    this.GetCouDetailsById(couId);  
    
    var divClass = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    if (divClass == "0") {
        this.isdivClass = true;
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

  public GetCouDetails() {
    this.router.navigate(["admin/nov"]);
  }

  public GetCouDetailsById(couId: number) {
    var companyId = (this.user.rolename == "AuthSigner" ? this.user.companyId : 0);
    //this.spinner.show();
    this.NovService.GetCitationDetailsById(couId, companyId)
        .subscribe(
            data => {
                this.cou = data;                
                this.dtTrigger.next();
                
                this.couAttachmentsImg = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
                this.couAttachmentsFile = data.citationAttachments.filter(x => x.tabNo == 'Tab1' && x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');

                this.cou.violatorBirthDate = this.datePipe.transform(this.cou.violatorBirthDate, 'yyyy-MM-dd');
                this.cou.violationDate = this.datePipe.transform(this.cou.violationDate, 'yyyy-MM-dd');
                this.getSelectedDoors(couId);
                if(this.cou.personUniqueId != null && this.cou.personUniqueId != ""){
                  this.GetCouRecordsList(null,this.cou.personUniqueId);
                }else{
                  this.GetCouRecordsList(this.cou.securityBadgeNo,null);
                }
                //this.spinner.hide();                
            }, (error:any)=> {
                //this.spinner.hide();
                // //this.spinner.hide();
                // this.toastr.error(
                //   `${this.messages.user.getUsersGeneralError} <br />
                //   ${error}`,
                //   "Error");
            });
    }

    getDateTrans(date)
      {
        return this.datePipe.transform(date, 'MM/dd/yyyy hh:mm a')
      }
    
    public getSelectedDoors(couId)
    {   
        this.NovService.GetSelectedDoors(couId).subscribe((data: Locations[]) => {      
          this.selectedDoorGateNumber = []
          this.selectedDoorGateNumber =  data as Locations[];
          this.selectedDoorGateNumber.forEach(element => {
          this.selectedDoorNames = this.selectedDoorNames + ", " + element.location    
          });
          if(this.selectedDoorNames.charAt(0) == ",")
          {
              this.selectedDoorNames = this.selectedDoorNames.substring(1)
          }
        });
    }

    public GetViolationTypeList() {
        this.ViolationTypesService.GetViolationTypeList().subscribe((response: ViolationTypes[]) => {
          const selectedId = this.cou?.violationTypeId;
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
