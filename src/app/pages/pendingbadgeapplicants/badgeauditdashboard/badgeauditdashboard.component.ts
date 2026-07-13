import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbCalendar, NgbModalRef, NgbModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuditCompanies, AuthSignerCountViewModel, BadgeAuditCompanyEmployee, BadgeAuditDetails, DataOutputModel, FromTODate } from '../badgelisting/badgelisting.model';
import { BadgelistingService } from '../badgelisting/badgelistingedit/badgelisting.service';
import { AuditCompanysViewModel, BadgeHolderColorCountViewModel, BadgeHolderCountViewModel, BadgeHolderSeraCountViewModel } from './badgeauditdashboard.model';

@Component({
  selector: 'app-badgeauditdashboard',
  templateUrl: './badgeauditdashboard.component.html',
  styleUrls: ['./badgeauditdashboard.component.scss']
})
export class BadgeauditdashboardComponent implements OnInit {
  public windowRef: Window;
  completionDate: string = ""
  closeResult: string = ""
  companyName: string = ""
  modalReference: NgbModalRef;
  auditCompanysList: AuditCompanysViewModel[] = []
  auditEmployeeList: BadgeAuditCompanyEmployee[] = []
  badgeHolderCountViewModel: BadgeHolderCountViewModel = new BadgeHolderCountViewModel()
  badgeHolderColorCount: BadgeHolderColorCountViewModel[] = [];
  badgeHolderSeraCount: BadgeHolderSeraCountViewModel[] = [];
  auditId: number = 0;
  badgeauditinfo: BadgeAuditDetails = new BadgeAuditDetails();
  infobadge:AuditCompanysViewModel = new AuditCompanysViewModel();
  badgeAuditStatus:string;
  badgeAuditAuthCountViewModel: AuthSignerCountViewModel = new AuthSignerCountViewModel();
  user: any;
  isSubmitted:string;
  fromToDates: FromTODate = new FromTODate();
  badgeauditcompany:AuditCompanies = new AuditCompanies();
  authSignerCom:string;
  selectedCompanyName:string = "";
  selectedAuditId:number;

  constructor(private modalService: NgbModal, private router: Router,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    public datepipe: DatePipe,
    private badgeAuditService: BadgelistingService, private route: ActivatedRoute,
    private toastr: ToastrService,) { }

  async ngOnInit(): Promise<void> {
    this.windowRef = window;
    this.auditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.GetBadgeCompanyList()
    this.GetBadgeColorList()
    await this.GetBadgeAuditByStatus()
    await this.GetbadgeAuditAuthCount()
    
  }
  public GetBadgeCompanyList() {
    this.badgeAuditService.GetBadgeAuditCompanyList(this.auditId).subscribe((response: AuditCompanysViewModel[]) => {
      this.auditCompanysList = response;
      //this.infobadge = response;
     
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");

      //this.spinner.hide();
    });
  }

  closeAudit(content){
    this.fromToDates.toDate = this.dateAdapter.toModel(this.fromModel(this.badgeauditinfo.auditToDate.toString().split('T')[0]));
    var msg = " Do you want to confirm to close the Audit : "+ this.badgeauditinfo.auditName + "  " + this.datepipe.transform(this.badgeauditinfo.auditToDate, 'MM-dd-yyyy') ;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'L' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

closeAuditConfirm(){
  this.badgeAuditService.ClosedAudit(this.auditId).subscribe((response: Response) => {
    this.toastr.success("Audit Closed Successfully.")
    this.router.navigate(['/admin/badgelisting']);
  }, (error: any) => {
    //this.spinner.hide();
    console.log("error list");

    //this.spinner.hide();
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

  public GetBadgeColorList() {
    this.badgeAuditService.GetBadgeAuditColorList(this.auditId).subscribe((response: BadgeHolderCountViewModel) => {
      this.badgeHolderCountViewModel = response;
      this.badgeHolderColorCount = response.badgeHolderColorCount
      this.badgeHolderSeraCount = response.badgeHolderSeraCount
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");

      //this.spinner.hide();
    });
  }

  showemployee(content, companyName: string) {
    this.companyName = companyName;
    this.getCompanyWiseEmployee(companyName)
    this.modalReference = this.modalService.open(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getCompanyWiseEmployee(companyName: string) {
    this.badgeAuditService.GetBadgeAuditEmployeeList(this.auditId, companyName).subscribe((response: BadgeAuditCompanyEmployee[]) => {
      this.auditEmployeeList = response;
      //this.dtTrigger.next();
    }, (error: any) => {
      console.log("Error Fetching Employee Data");
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

  close() {
    this.modalService.dismissAll();
  }

  async GetBadgeAuditByStatus(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
    //this.spinner.show();
    this.badgeAuditService.GetBadgeAuditByDate(this.auditId).subscribe((response: BadgeAuditDetails) => {
      this.badgeauditinfo = response;
      resolve()
    }, (error: any) => {
      console.log("error list");
      reject()
    });
  });
}

  async GetbadgeAuditAuthCount(): Promise<any> {
    return new Promise<void>((resolve, reject) => {
    this.badgeAuditService.GetbadgeAuditAuthCount(this.auditId).subscribe((response: AuthSignerCountViewModel) => {
      this.badgeAuditAuthCountViewModel = response;
      resolve()
    }, (error: any) => {
      console.log("error list");
      reject()
    });
  });
}
  showcomment(content, comment) {
    
    // this.getCompanyWiseEmployee(companyName)
    this.authSignerCom = comment;
    // this.modalReference = this.modalService.open(content);
     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'L' }).result.then((result) => {
       this.closeResult = `Closed with: ${result}`;
     }, (reason) => {
       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     });
   }

   submittolaunch(content, compname, id){
    this.selectedCompanyName = compname;
    this.selectedAuditId = id;
   // this.modalReference = this.modalService.open(content);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'L' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    
  
  }
   saveSubmitToLaunch(){
    this.badgeAuditService.UpdateSubmitToLaunch(this.selectedAuditId, this.selectedCompanyName).subscribe((response: BadgeAuditCompanyEmployee) => {
      this.auditCompanysList =[];
      this.toastr.success("Company Audit returned to Authorized Signer.")      
      this.GetBadgeCompanyList();
      this.GetBadgeColorList();
      this.GetBadgeAuditByStatus();
      this.GetbadgeAuditAuthCount();
      //this.isSubmitDetails = true;
      
    });
   }
}
