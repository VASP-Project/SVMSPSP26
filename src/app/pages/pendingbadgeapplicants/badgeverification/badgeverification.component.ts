import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PendingbadgeapplicantService } from '../pendingbadgeapplicant.service';
import { BadgeVerification } from '../pendingbadgeapplicants';

@Component({
  selector: 'app-badgeverification',
  templateUrl: './badgeverification.component.html',
  styleUrls: ['./badgeverification.component.scss']
})
export class BadgeverificationComponent implements OnInit {
  @ViewChild('myInput') private _inputElement: ElementRef
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  badgeVerificationList: BadgeVerification[] = [];
  badge: BadgeVerification = new BadgeVerification();
  active: boolean = false;
  inactive: boolean = false;
  badgeNo: number
  isBadgeNoDisable: boolean = false
  advisoryText: string = ""
  user: any;
  hideSubmitButton: boolean = false
  showData: boolean = false
  accessLevels: any[] = [];
  badgeAccessLevel: string[] =[];

  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private pendingBadgeService: PendingbadgeapplicantService,
    private datePipe: DatePipe,
    private appURL: AppConfigService,) { }

  ngOnInit() {
    //this.spinner.hide()
    this.dtOptions = {
      paging: false,
      columnDefs: [
        { targets: 6, type: 'date' },
      ],
    };
    this.advisoryText = this.appURL.getAdvisoryText();
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));

  }

  ngAfterViewInit(): void {

    window.setTimeout(() => {
      this._inputElement.nativeElement.focus();
    });
  }

  public GetBadgeVerificationData(badgeNo) {
    $('#dt1').DataTable().destroy();
    //this.spinner.show();
    this.badgeVerificationList = [];
    if (badgeNo != undefined) {
      this.pendingBadgeService.GetBadgeVerificationData(badgeNo).subscribe(
        (response: BadgeVerification[]) => {
          this.badgeVerificationList = response;
          this.isBadgeNoDisable = true
          if (response.length > 0) {
            this.active = true
            this.inactive = false
          }
          else {
            this.inactive = true
            this.active = false
          }
          this.dtTrigger.next();
          //this.spinner.hide();
        },
        error => {
          console.log("Error while fetching data");
          //this.spinner.hide();
        }
      );
    }
    else {
      this.toastr.error("Please enter Security Badge Number");
      //this.spinner.hide(); 
    }

  }

  onBadgeNoChange(event: any) {
    if (event.target.value.length >= 15) return false;
  }

  public GetBadgeVerificationDataByBadgeNoASCX(badgeNo) {
     if (badgeNo != undefined) {
    this.pendingBadgeService.GetBadgeByNumber(badgeNo, this.user.id).subscribe({
      next: (res) => {
        this.accessLevels = [];
      if (res && res.data && res.data.length > 0) {
        if (res.data[0].badgeStatus.toLowerCase() == 'Active'.toLowerCase()) {
          this.isBadgeNoDisable = true
          this.hideSubmitButton = true
          this.active = true
          this.inactive = false
          this.showData = true
          const apiBadge = res.data[0];

          // Map API response to BadgeVerification model
          this.badge.Id = this.badge.Id || 0; // id defaults to 0

          this.badge.Company = apiBadge.company;
          this.badge.FirstName = apiBadge.firstName;
          this.badge.LastName = apiBadge.lastName;
          this.badge.BadgeNumber = apiBadge.badgeNumber;
          this.badge.ProxNumber = apiBadge.proxNumber;
          this.badge.Status = apiBadge.badgeStatus;
          this.badge.BadgeColor = apiBadge.badgeColor;
          this.badge.IssuanceDate = apiBadge.issuanceDate;
          this.badge.ExpirationDate = apiBadge.expirationDate;
          this.badge.AccessLevel = apiBadge.accessLevel || []; // map AccessCategory[]
          this.badge.EscortIcon = apiBadge.escortIcon;
          this.badge.DriversIcon = apiBadge.driversIcon;
          this.badge.CustomSeal = apiBadge.customSeal;
          this.badge.PersonUniqueId = apiBadge.personUniqueId;
          this.badge.BirthDate = apiBadge.birthDate;
          this.badge.StreetAddress = apiBadge.streetAddress;
          this.badge.City = apiBadge.city;
          this.badge.State = apiBadge.state;
          this.badge.DriversLicenseNo = apiBadge.driversLicenseNo;
          this.badge.DlState = apiBadge.dlState;
          this.badge.EmailAddress = apiBadge.emailAddress;
          this.badge.MobileNumber = apiBadge.mobileNumber;
          this.badge.Photograph = apiBadge.photograph;

          // Extra fields
          this.badge.BadgeNumber = apiBadge.badgeNumber; // assuming badgeNo = badgeNumber as number
          this.badge.BadgeIcon = apiBadge.badgeIcon;
          this.badge.SealColor = apiBadge.sealColor;

          // If you want to use accessLevels separately
          this.accessLevels = this.badge.AccessLevel;
          
    this.badgeAccessLevel = apiBadge.badgeAccess.split("&");
        

          
        }
        else {
          const apiBadge = res.data[0];

          // Map API response to BadgeVerification model
          this.badge.Id = this.badge.Id || 0; // id defaults to 0

          this.badge.Company = apiBadge.company;
          this.badge.FirstName = apiBadge.firstName;
          this.badge.LastName = apiBadge.lastName;
          this.badge.BadgeNumber = apiBadge.badgeNumber;
          this.badge.ProxNumber = apiBadge.proxNumber;
          this.badge.Status = apiBadge.badgeStatus;
          this.badge.BadgeColor = apiBadge.badgeColor;
          this.badge.IssuanceDate = apiBadge.issuanceDate;
          this.badge.ExpirationDate = apiBadge.expirationDate;
          this.badge.AccessLevel = apiBadge.accessLevel || []; // map AccessCategory[]
          this.badge.EscortIcon = apiBadge.escortIcon;
          this.badge.DriversIcon = apiBadge.driversIcon;
          this.badge.CustomSeal = apiBadge.customSeal;
          this.badge.PersonUniqueId = apiBadge.personUniqueId;
          this.badge.BirthDate = apiBadge.birthDate;
          this.badge.StreetAddress = apiBadge.streetAddress;
          this.badge.City = apiBadge.city;
          this.badge.State = apiBadge.state;
          this.badge.DriversLicenseNo = apiBadge.driversLicenseNo;
          this.badge.DlState = apiBadge.dlState;
          this.badge.EmailAddress = apiBadge.emailAddress;
          this.badge.MobileNumber = apiBadge.mobileNumber;
          this.badge.Photograph = apiBadge.photograph;

          // Extra fields
          this.badge.BadgeNumber = apiBadge.badgeNumber; // assuming badgeNo = badgeNumber as number
          this.badge.BadgeIcon = apiBadge.badgeIcon;
          this.badge.SealColor = apiBadge.sealColor;

          // If you want to use accessLevels separately
          this.accessLevels = this.badge.AccessLevel;
          this.badgeAccessLevel = apiBadge.badgeAccess.split("&");
          this.inactive = true
          this.active = false
          this.showData = true
        }
      } else {
        this.inactive = true
        this.active = false
        this.showData = false
         this.toastr.error("Invalid Badge Number Entered")
      }
    },    
    // error: (err) => {
    //   this.inactive = true;
    //   this.active = false;
    //   this.showData = false;
    //   console.error("API error:", err);
    //   this.toastr.error("Remote badging system is unavailable.");
    // }
     error: (err) => {
      this.inactive = true;
      this.active = false;
      this.showData = false;

      if (err.status === 500) {
        this.toastr.error("Remote badging system is unavailable.");
      } else {
        this.toastr.error("Invalid Badge Number Entered.");
      }

      console.error("API error:", err);
    }
  }
  );
  }else{
    this.toastr.error("Please enter Security Badge Number");
  }
}

  public GetBadgeVerificationDataByBadgeNo(badgeNo) {
    //this.spinner.show();
    if (badgeNo != undefined) {
      this.pendingBadgeService.GetBadgeVerificationDataByBadgeNo(badgeNo, this.user.id)
        .subscribe(
          data => {
            this.isBadgeNoDisable = true
            this.hideSubmitButton = true
            if (data[0] != null) {
              if (data[0].length != 0) {
                if (data[0].Status.toLowerCase() == 'Active'.toLowerCase()) {
                  this.badge = data[0];
                  // this.dtTrigger.next();
                  // this.badge.expirationDate = this.datePipe.transform(this.badge.expirationDate, 'yyyy-MM-dd');
                  this.active = true
                  this.inactive = false
                  this.showData = true
                }
                else {
                  this.badge = data[0];
                  // this.badge.expirationDate = this.datePipe.transform(this.badge.expirationDate, 'yyyy-MM-dd');
                  this.inactive = true
                  this.active = false
                  this.showData = true
                }

              }
              else {
                this.inactive = true
                this.active = false
                this.showData = false
              }
            }
            else {
              this.inactive = true
              this.active = false
              this.showData = false
            }
            //this.spinner.hide();                               
          }, error => {
            console.log("Error while fetching data");
            this.toastr.error("Badge system is Inaccessible.")
            //this.spinner.hide();
          });
    }
    else {
      this.toastr.error("Please enter Security Badge Number");
      //this.spinner.hide(); 
    }
  }

  public clearFields() {
    // $("#dt1").DataTable().clear();
    // $("#dt1").DataTable().destroy();
    this.badge = new BadgeVerification()
    this.badgeNo = null
    this.active = false;
    this.inactive = false;
    this.isBadgeNoDisable = false
    this.hideSubmitButton = false
    this.showData = false
    this.ngAfterViewInit()
  }

}
