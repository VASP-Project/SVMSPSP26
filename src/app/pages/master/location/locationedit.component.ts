import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Facilities } from '../facility';
import { FacilityService } from '../facility/facility.service';
import { LocationPhotos, Locations } from '../locations';
import { LocationService } from './location.service';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { Company } from '../company';
import { CompanyService } from '../company/company.service';

@Component({
  selector: 'app-locationedit',
  templateUrl: './locationedit.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationeditComponent implements OnInit {
  location= new Locations();
  view: boolean = false;
  oldLocationName: string = "";
  oldFacility: number = 0;
  allFacilities: Facilities[];
  user: any;
  public isDirty: boolean = false;
  files: string[] = [];
  deletedFiles: string[] = [];
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  public locationPhotosAttachment: LocationPhotos[] = [];
  // modalRef?: BsModalRef;
  filePath: string;
  allCompanyList: Company[];

  constructor(
    private locationService: LocationService,
    private spinner: NgxSpinnerService,
    private facilityService: FacilityService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService, private appURL: AppConfigService,
    private CompanyService: CompanyService,
    // private modalService: BsModalService,
  ) { }

  ngOnInit() {    
    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams["isEdit"];
    if (isEdit == "1") {
      var isView = this.route.snapshot.pathFromRoot[1].queryParams["isView"];
      var locationId: number = this.route.snapshot.pathFromRoot[1]
        .queryParams["locationId"];
      this.editLocation(locationId, isView);
    }
    this.GetFacilityList();
    this.GetCompanyList()
  }

  editLocation(id, mode) {
    if (mode == "1") {
      this.view = true;
    } else this.view = false;
    this.GetLocationById(id);
  }

  private GetLocationById(id: number) {
    //this.spinner.show();
    this.locationService.GetLocationById(id).subscribe(
      (response: Locations) => {
        this.location = response;
        this.oldLocationName = response.location;
        this.oldFacility = response.facilityId;
        this.location.id = id;
        this.locationPhotosAttachment = this.location.locationPhotos.filter(x => (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
        this.location.xCoordinate = response.xCoordinate;
        this.location.yCoordinate = response.yCoordinate
        this.location.inIncident = response.inIncident
         this.location.companyId = response.companyId
        this.location.companyName = response.companyName
        //this.spinner.hide();
      }
    );
  }

  public GetFacilityList() {
    //this.spinner.show();
    this.facilityService.GetFacilityList().subscribe(
      (response: Facilities[]) => {
        this.allFacilities = response;
        //this.spinner.hide();
      },
      (error:any)=> {
        //this.spinner.hide();
      }
    );
  }

   public GetCompanyList() {
      //this.spinner.show();
      this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
        this.allCompanyList = response;
        //this.spinner.hide();
      }, (error:any)=> {
        //this.spinner.hide();
        console.log("error list");
      });
    }

  onSubmit(formData: NgForm) {
    var location = {
      Id: formData.value.id,
      location: formData.value.Location,
      facilityId: formData.value.facilityId,
      inIncident : this.location.inIncident,
      xCoordinate : formData.value.xCoordinate,
      yCoordinate : formData.value.yCoordinate,
      companyId:formData.value.companyId,
      inSchedule : this.location.inSchedule

    };
    //this.spinner.show();
    if (this.oldLocationName.toUpperCase().trim() != this.location.location.toUpperCase().trim() || this.oldFacility != this.location.facilityId) {
      this.locationService.CheckLocationExists(this.location.location, this.location.facilityId).subscribe((response) => {
        if (response) {
          this.toastr.error('Violation type and Reason already exist. Try other combination', 'Information');
          this.location.location = this.oldLocationName;
          this.location.facilityId = this.oldFacility;
          //this.spinner.hide();
        }
        else {
          this.saveLocation(location, formData);
        }
      }, (error:any)=> {
        this.toastr.error('Facility and Location not saved', 'Information');
        //this.spinner.hide();
      });
    }
    else {
      this.saveLocation(location, formData);
    }
    //this.saveReason(citationReason, formData);
  }


  saveLocation(location, formData: NgForm) {
    this.locationService.AddEditLocation(location,this.files,this.deletedFiles).subscribe(response => {
      this.toastr.success("Record Saved Successfully");
      this.files = [];
      formData.reset();
      //this.spinner.hide();
      this.router.navigate(["/admin/location"]);
    });
  }


  hideaddform() {
    this.router.navigate(["/admin/location"]);
  }
  checkBoxChange(event){
    this.location.inIncident = event.target.checked
  }

  checkBoxChangeforSchedule(event){
    this.location.inSchedule = event.target.checked
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
      //var fs = file.name.split('.').pop()      
    }
    this.myInputVariable.nativeElement.value = "";
  }

  deleteFile(file) {
    //var ans = confirm("Do you want to delete file '" + filetitle + "'?");
    var ans = confirm("Do you want to delete file ?");
    if (ans == true) {
      this.isDirty = true;
      this.location.locationPhotos.splice(this.location.locationPhotos.indexOf(file), 1);
      this.locationPhotosAttachment = this.location.locationPhotos.filter(x => (x.filePath.toLowerCase().split('.', 2)[1] == 'png' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpg' || x.filePath.toLowerCase().split('.', 2)[1] == 'jpeg' || x.filePath.toLowerCase().split('.', 2)[1] == 'gif'));
      //});
      this.deletedFiles.push(file.id);
    }
  }

  //View File
  viewFile(id: number, fileName: string,img) {
    this.locationService.getAttachment(id).subscribe(
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
      (error:any)=> {
        this.toastr.error(
          `Error occurred while fetching attachment.
      ${error.message}`, 'Error');
      });
  }

  removeFile(file) {
    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;
      this.files.splice(this.files.indexOf(file), 1)
    }
  }  

  openImage(id: number)
  {
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById('myImg');
    var modalImg = (<HTMLImageElement> document.getElementById("img01"));
    this.locationService.getAttachment(id).subscribe(
      data => {
        // IE doesn't allow using a blob object directly as link href
        //instead it is necessary to use msSaveOrOpenBlob
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //   var newBlob = new Blob([data], { type: data.type })
        //   window.navigator.msSaveOrOpenBlob(newBlob, fileName);
        //   return;
        // }
        const objectURL = window.URL.createObjectURL(data);
        modal.style.display = "block";
    // modalImg.src = image;
        modalImg.src = objectURL
        // window.open(objectURL, '_blank');
        // setTimeout(function () {
        //   // For Firefox it is necessary to delay revoking the ObjectURL
        //   window.URL.revokeObjectURL(objectURL);
        // }, 100);
      },
      (error:any)=> {
        this.toastr.error(
          `Error occurred while fetching Image.
      ${error.message}`, 'Error');
      });
  }

  close()
  {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

}
