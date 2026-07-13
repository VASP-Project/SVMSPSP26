import { Component, OnInit } from '@angular/core';
import { IncidentAttachments, IncidentEvents, IncidentFirearmInformation, IncidentHotWash, IncidentIndividuals, IncidentLocations, IncidentNotifications, IncidentPassengerInformation, IncidentProhibitedItems, IncidentTypes, IncidentVehicleInformation, IncidentreportDetail, SelectedInvolvedAgency, SelectedLocation, SelectedRepoAgency } from '../incidentreport.model';
import { ActivatedRoute, Router } from '@angular/router';
import { IncidentReportService } from '../incidentreport.service';
import { ToastrService } from 'ngx-toastr';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incidentview',
  templateUrl: './incidentview.component.html',
  styleUrls: ['./incidentview.component.scss']
})
export class IncidentviewComponent implements OnInit {
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
  view:boolean = false

  showEvacuationDesctext:boolean = false
  showTextForLocation: boolean = false;
  showOtherRepo: boolean = false;
  showOtherInvol: boolean = false;
  
  incidentEvent:IncidentEvents[] = [];
  isIncidentEvent:boolean = false;

  isIncidentPassenger: boolean = false;
  isProhabteditemsshow:boolean = false;
  isFirearminformation:boolean = false;
  isVehicleinformation:boolean = false;
  isAttachInfo:boolean = false;
  isHotwashInfo:boolean = false;
  isReviewInfo:boolean = false;
  isIncidentIndividual:boolean = false;

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
  showFirstEvent: number = 0

  incidentIndividual: IncidentIndividuals = new IncidentIndividuals();
  inciIndividual: IncidentIndividuals[] = [];
  showTextForIndividualType:boolean = false
  incidentPassenger: IncidentPassengerInformation[] = [];
  incidentProhibiteditem: IncidentProhibitedItems[] = []
  incidentFirearmItem: IncidentFirearmInformation[] = [];
  incidentVehicleItem: IncidentVehicleInformation[] = [];
  incidentAttachItem: IncidentAttachments[] = [];
  incidentHotwashItem: IncidentHotWash[] = [];
  incdentNotification: IncidentNotifications[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentreportservice: IncidentReportService,
    private toastr: ToastrService,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    var isClone: string = this.route.snapshot.pathFromRoot[1].queryParams['isClone'];
    var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
    if(isView == '1'){
      this.view = true
      
    }

    this.paramincidentId = this.route.snapshot.pathFromRoot[1].queryParams['incidentId'];
    this.isClone = isClone;
    this.inciTypeId = this.route.snapshot.pathFromRoot[1].queryParams['inciTypeId'];
    this.inciTypeName = this.route.snapshot.pathFromRoot[2].queryParams['inciTypeName'];
    this.incidentinfo.incidentType = this.inciTypeId
    this.incidentinfo.inciType = this.inciTypeName

    this.GetIncidentDetailsById(this.paramincidentId)

   this.isIncidentIndividual = true
   this.isIncidentPassenger = true
   this.isProhabteditemsshow = true
   this.isFirearminformation = true
   this.isVehicleinformation = true
   this.isAttachInfo = true
   this.isHotwashInfo = true
   this.isIncidentEvent = true
  }

  public GetIncidentDetailsById(incidentId: number) {

    this.incidentreportservice.GetIncidentDetailsById(incidentId)
      .subscribe(
        (data: IncidentreportDetail) => {

          this.incidentinfo = data as IncidentreportDetail;                  
          
          this.incidentinfo.newTimeOccurred = this.datePipe.transform(this.incidentinfo.timeOccurred, 'HH:mm');
          this.incidentinfo.newTimeOccurred = this.onTimeChange(this.incidentinfo.newTimeOccurred)

          this.incidentinfo.newTimeReview = this.datePipe.transform(this.incidentinfo.timeReview, 'HH:mm');
          this.incidentinfo.newTimeReview = this.onTimeChange(this.incidentinfo.newTimeReview)
          if(this.incidentinfo.evacuation == 'True'){
            this.showEvacuationDesctext = false
          }
          if (this.incidentinfo.otherLocationTextvalue != null ) {
            this.showTextForLocation = true
          }
          if (this.incidentinfo.otherReportingvalue != null) {
            this.showOtherRepo = true
          }
          if (this.incidentinfo.otherInvolvedvalue != null) {
            this.showOtherInvol = true
          }
          if (this.incidentinfo.tsacheckpointClosure == 'True') {
            this.incidentinfo.tsacheckpointClosure = 'Yes'
          } else {
            this.incidentinfo.tsacheckpointClosure = 'No'
          }
          if (this.incidentinfo.mediaAttention == 'True') {
            this.incidentinfo.mediaAttention = 'Yes'
          } else {
            this.incidentinfo.mediaAttention = 'No'
          }
          if (this.incidentinfo.evacuation == 'True') {
            this.incidentinfo.evacuation = 'Yes'
          } else {
            this.incidentinfo.evacuation = 'No'
          }
          if (this.incidentinfo.tsaNotified == true) {
            this.incidentinfo.tsaNotifiedValue = 'Yes'
          } else {
            this.incidentinfo.tsaNotifiedValue = 'No'
          }
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
            if ( element.otherIndividualTypevalue != null) {
              this.showTextForIndividualType = true
            }else{
              this.showTextForIndividualType = false
            }
          })


          // this.incidentPassenger = data.incidentPassengerInformation
          // this.incidentProhibiteditem = data.incidentProhibitedItems
          // this.incidentFirearmItem = data.incidentFirearmInformation
          // this.incidentVehicleItem = data.incidentVehicleInformation
          // this.incidentAttachItem = data.incidentAttachments
          // this.incidentHotwashItem = data.incidentHotWash
         
          // if(this.inciIndividual.length > 0){
          //   this.isIncidentIndividual = true
          // }
          // if(this.incidentPassenger.length > 0){
          //   this.isIncidentPassenger = true
          // }
          // if(this.incidentProhibiteditem.length > 0){
          //   this.isProhabteditemsshow = true            
          // }
          // if(this.incidentFirearmItem.length > 0){
          //   this.isFirearminformation = true
          // }
          // if(this.incidentVehicleItem.length > 0){
          //   this.isVehicleinformation = true
          // }
          // if(this.incidentAttachItem.length > 0 ){
          //   this.isAttachInfo = true
          // }
          // if(this.incidentHotwashItem.length > 0){
          //   this.isHotwashInfo = true
          // }
          this.isReviewInfo = true;

         
          // this.inciTypeId = data.incidentType;
          // this.inciTypeName = data.inciType;
          // this.setPerimeterBreachRequired(this.inciTypeName);
        }, (error: any) => {
          this.toastr.error(`${error}`, "Getting error");
        });
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

  public showIncidentEvents(item: any) {
    if(this.showFirstEvent == 1){
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
    
 
  this.showFirstEvent = item;
  this.isIncidentEvent = !this.isIncidentEvent;

}

  public showIncidentIndividual(item: any) {
    if(this.showFirstIndividual == 1){
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
    }
      
    
      
    
    this.showFirstIndividual = item;
    this.isIncidentIndividual = !this.isIncidentIndividual;
  }
  public showIncidentPassenger(item: any) {  
    if(this.showFirstPassenger == 1){
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
    }
      
     
    
    this.showFirstPassenger = item;
    this.isIncidentPassenger = !this.isIncidentPassenger;
  }

  showProhabitedItems(item: any) {    
    if(this.showFirstProHibited == 1){
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
    } 
    this.showFirstProHibited = item;
    this.isProhabteditemsshow = !this.isProhabteditemsshow;
  }

  showFirearmInfo(item: any) {    
    if(this.showFirstFirearm == 1){
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
    } 
    this.showFirstFirearm = item;
    this.isFirearminformation = !this.isFirearminformation
  }

  showVehcleInfo(item: any) {    
    if(this.showFirstVehicle == 1){
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
    }
    this.showFirstVehicle = item;
    this.isVehicleinformation = !this.isVehicleinformation
  }

  showAtachInfo(item: any) {   
    if(this.showFirstAttach == 1){
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
    }   
    this.showFirstAttach = item
    this.isAttachInfo = !this.isAttachInfo
  }

  showHotwash(item: any) {
    if(this.showFirstHotwash == 1){
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
    }  
    this.showFirstHotwash = item
    this.isHotwashInfo = !this.isHotwashInfo
  }

  showReview(item: any) {   
    if(this.showFirstReview == 1){
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
      if (this.isHotwashInfo != true) {
        this.isHotwashInfo = this.isHotwashInfo
      } else {
        this.isHotwashInfo = !this.isHotwashInfo
      }
    }   
    this.showFirstReview = item
    this.isReviewInfo = !this.isReviewInfo
  }

  public GetIncidentDetails() {
    this.router.navigate(["/admin/incident"]);
  }
}
