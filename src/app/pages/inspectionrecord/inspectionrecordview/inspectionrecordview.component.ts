import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Locations } from '../../master/locations';
import { CitationDetails } from '../../novlist/CitationDetails';
import { CompanyInformation, InspectionAttachments, InspectionBadgeholder, InspectionEdtAlarm, InspectionEdtResolution, InspetionRecordDetail, VehicleInspection } from '../inspectionrecord.model';
import { InspectionrecordService } from '../inspectionrecord.service';
import { NovService } from '../../novlist/nov.service';
import { element } from 'protractor';
import { Company } from '../../master/company';
import { CompanyService } from '../../master/company/company.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-inspectionrecordview',
  templateUrl: './inspectionrecordview.component.html',
  styleUrls: ['./inspectionrecordview.component.scss']
})
export class InspectionrecordviewComponent implements OnInit {
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  user: any;
  isStaffAdmin: boolean = false;
  isIssuer: boolean = true;
  inspectioninfo : InspetionRecordDetail =  new InspetionRecordDetail();
  inslectionList: InspetionRecordDetail[];
  InspectionImagesLst: string[] = [];
  isdivClass: boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  public inspectionImageList :InspectionAttachments[] = [];  
  public inspectionFilesList: InspectionAttachments[] = [];
  divTab1: boolean = true;
  divTab2: boolean = true;
  showBtn = -1;
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  public citationId:number;  
  selectedDoorGateNumber: Locations[] = []
  selectedDoorNames: string = "";
  citation: CitationDetails = new CitationDetails();
  citationNo: number=0;
  findingDoorList: Locations[];  
  findingDoorNames: string =  "";  
  mappingNOV: CitationDetails[] = [];
  eachMappingNovNo: string = ""
  vehicleInsp: VehicleInspection[] = [];
  badgeholderInsp: InspectionBadgeholder[] = [];
  companyInsp: CompanyInformation[] = [];
  isPerimeterInsp: boolean = false;
  isPortalInsp: boolean = false;
  isAWSInspection:boolean = false;
  isFacilityInsp: boolean = false;
  isDeliveryVehicleInsp: boolean = false;
  isSterileAreaPiInsp: boolean = false;
  isVisitorInfoShow: boolean = false;
  allCompanyList: Company[];
  edtResolutionList: InspectionEdtResolution[] = [];
  edtAlarmList: InspectionEdtAlarm[] = [];

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private InspService : InspectionrecordService, 
    private datePipe: DatePipe, 
    private spinner: NgxSpinnerService, 
    private toastr: ToastrService,
    private NovService: NovService, private appURL: AppConfigService,
    private companyService: CompanyService) { }

  ngOnInit() 
  {
    this.GetCompanyList();
   

    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    

        var tabName = sessionStorage.getItem('tab');
        if (this.user.rolename == "Issuer") 
        {
            this.isStaffAdmin = false;            
            this.isIssuer = true;
        }
        else if (this.user.rolename == "StaffAdmin") 
        {
            this.isStaffAdmin = true;           
            this.isIssuer = false;            
        }
        else if (this.user.rolename == "AuthSigner") 
        {
            this.isStaffAdmin = false;            
            this.isIssuer = false;            
        }

        var inspectionId: number = this.route.snapshot.pathFromRoot[1].queryParams['inspectionId'];
        this.GetInspectionDetailsById(inspectionId);

        var divClass = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
        if (divClass == "0") 
        {
            this.isdivClass = true;
        }
    this.getEdtResolutionList();
    this.getEdtAlarmList();
     this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      order: [[1, 'desc']],
      searching:false,
      info:false,
      bInfo:false,
      bLengthChange:false,
      paging: false, 
      columnDefs: [
        { targets: 1, type :'numberic'  }
      ]
      // retrieve: true,
    };
  }


  getEdtResolutionList(){
    this.InspService.GetEdtResolutionList().subscribe(
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
    this.InspService.GetEdtAlarmList().subscribe(   
      (data: any) => {    
        this.edtAlarmList = data; 
      },
      (error:any) => {  
        console.error("Error fetching EDT alarm list:", error); 
      }
    )
  }   

  //Used for file handling
  showUndoBtn(index, filePath) 
  {
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

  //To download file
  downloadFile(id: number, fileName: string) 
  {
    this.InspService.getAttachment(id).subscribe(
        data => {
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
                `Error occurred while fetching attachment. 
  ${error.message}`, 'Error');
        });
  } 

  //To view file
  viewFile(id: number, fileName: string) 
  {
    this.InspService.getAttachment(id).subscribe(
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
                `Error occurred while fetching attachment.
                ${error.message}`, 'Error');
        });
  }

  public GetInspectionDetails() 
  {
    this.router.navigate(["admin/inspection"]);
  }

  public GetCitationDetailsById(citationId: number, companyId: number) {   
    
    this.NovService.GetCitationDetailsById(citationId, companyId)
      .subscribe(
        (data: CitationDetails) => {
          //this.citation = data as CitationDetails;   
          this.citationNo =data.novNo;
          
        }, (error:any)=> {
          //this.spinner.hide();
          //this.toastr.error(`${error}`, "Error");
        });
  }

  public getSelectedDoors(inspectionId)
  {

    this.InspService.GetSelectedDoors(inspectionId).subscribe((data: Locations[]) => {      
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

  public GetFindingDoors(inspectionId)
  {
    this.InspService.GetFindingDoors(inspectionId).subscribe((data: Locations[]) => {
      this.findingDoorList = []      
      this.findingDoorList = data as Locations[];
      this.findingDoorList.forEach(element =>{
        this.findingDoorNames = this.findingDoorNames + "," + element.location
      });
      if(this.findingDoorNames.charAt(0) == ",")
      {
        this.findingDoorNames = this.findingDoorNames.substring(1);
      }
    });
  }

  public GetMappingNov(inspectionId)
  {
    this.InspService.GetMappingNov(inspectionId).subscribe(response => {
      this.mappingNOV = response as CitationDetails[];
      this.mappingNOV.forEach(element => {
        this.eachMappingNovNo = this.eachMappingNovNo + ", " + element.novNo  
      });
      if(this.eachMappingNovNo.charAt(0) == ",")
      {
        this.eachMappingNovNo = this.eachMappingNovNo.substring(1);
      }            
    });
  }  

  public showFields(inspTypeId : number, inspTypeName)
  {
    // this.GetInspectionTypeList();
    // var inspTypeName = this.allInspectionTypeList.find(x => x.id == inspTypeId)
    if(inspTypeName == "Perimeter Inspection")
    {
      this.isAWSInspection = false;
      this.isPerimeterInsp = true
      this.isPortalInsp = false
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = false      
    }
    else if(inspTypeName == "Portal Inspection")
    {
      this.isAWSInspection = false;
      this.isPerimeterInsp = false
      this.isPortalInsp = true
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = false       
    }
    else if(inspTypeName == "AWS Inspection")
    {
      this.isAWSInspection = true;
      this.isPerimeterInsp = false
      this.isPortalInsp = false
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = false       
    }
    else if(inspTypeName == "Facility Inspection")
    {
      this.isAWSInspection = false;
      this.isPerimeterInsp = false
      this.isPortalInsp = false
      this.isFacilityInsp = true
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = false      
    }
    else if(inspTypeName == "Delivery-Vehicle Inspection")
    {
      this.isAWSInspection = false;
      this.isPerimeterInsp = false
      this.isPortalInsp = false
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = true
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = true      
    }
    else if(inspTypeName == "Sterile Area PI Inspection")
    {
      this.isAWSInspection = false;
      this.isPerimeterInsp = false
      this.isPortalInsp = false
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = true
      this.isVisitorInfoShow = false      
    }
    else{
      this.isAWSInspection = false;
      this.isPerimeterInsp = true
      this.isPortalInsp = false
      this.isFacilityInsp = false
      this.isDeliveryVehicleInsp = false
      this.isSterileAreaPiInsp = false
      this.isVisitorInfoShow = false  
    }
  }

  //To retrieve Company names on page loading
  public GetCompanyList() {
    this.companyService.GetCompanyList().subscribe((response: Company[]) => {
      this.allCompanyList = response;
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });
  }

  getCompanyName(companyId: number) {
    if(companyId != undefined)
    {
      if(companyId > 0)
      {
        return this.allCompanyList.filter(x => x.id == companyId)[0].companyName;
      }      
    }    
  }
  // To retrieve data of Inspection
  public GetInspectionDetailsById(inspectionId: number) 
  {
    var companyId = this.user.companyId;
    //this.spinner.show();
    this.InspService.GetInspectionDetailsById(inspectionId, companyId)
        .subscribe(
            data => {
                this.inspectioninfo = data;  
                this.showFields(this.inspectioninfo.inspectionType,this.inspectioninfo.inspType)               
                this.dtTrigger.next();                

                this.inspectionImageList = data.inspAttachments.filter(x => (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
                this.inspectionFilesList = data.inspAttachments.filter(x => x.filePath.toLowerCase().split('.', 2)[1] != 'png' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpg' && x.filePath.toLowerCase().split('.', 2)[1] != 'jpeg' && x.filePath.toLowerCase().split('.', 2)[1] != 'gif');
                
                this.inspectioninfo.badgeHolderDOB = this.datePipe.transform(this.inspectioninfo.badgeHolderDOB, 'MM/dd/yyyy');
                //this.inspectioninfo.inspectionDate= this.days[new Date(this.inspectioninfo.inspectionDate).getDay()];
                this.inspectioninfo.inspectionDate= this.datePipe.transform(this.inspectioninfo.inspectionDate,'MM/dd/yyyy');
                this.inspectioninfo.securityBadgeHolder=this.inspectioninfo.securityBadgeHolder.toString().toLowerCase()=='true' ? 'Yes' : 'No';  
                this.inspectioninfo.inspectionFinding=this.inspectioninfo.inspectionFinding.toString().toLowerCase()=='false' ? 'No' : 'Yes'; 
                this.inspectioninfo.isLeo=this.inspectioninfo.isLeo.toString().toLowerCase()=='false' ? 'No' : 'Yes';
                this.inspectioninfo.inspectionNOV=this.inspectioninfo.inspectionNOV.toString().toLowerCase()=='true' ? 'Yes' : 'No';
                this.citationId=data.citationId;        
                this.getSelectedDoors(inspectionId)
                this.GetFindingDoors(inspectionId);
                this.GetMappingNov(inspectionId);
                this.badgeholderInsp = this.inspectioninfo.badgeholderList;

                this.inspectioninfo.alarmValue = this.edtAlarmList.find(x => x.id == this.inspectioninfo.edtAlarm)?.alramsValue;
                this.inspectioninfo.resolutionName = this.edtResolutionList.find(x => x.id == this.inspectioninfo.edtResolution)?.resolutionName;  
                // this.badgeholderInsp.forEach(element => {
                //   element.badgeholderDOB = new Date(element.badgeholderDOB).toString();
                //   if(element.companyEscortedId > 0)
                //   {
                //     element.companyEscortedName = this.getCompanyName(element.companyEscortedId)
                //   }                  
                // });
                this.vehicleInsp = this.inspectioninfo.vehicleList;
                this.companyInsp = this.inspectioninfo.companyList;
                if (this.citationId > 0) {      
                  this.GetCitationDetailsById(this.citationId,0);
                  // this.isCitationId = true;
                } 
             
                /*data.citationIds.forEach(element => {
                    this.citationIds +=
                });*/
                //this.spinner.hide();

            }, (error:any)=> {
                this.toastr.error('Error while fetching Inspection data', 'Error');
                //this.spinner.hide();                
            });
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
