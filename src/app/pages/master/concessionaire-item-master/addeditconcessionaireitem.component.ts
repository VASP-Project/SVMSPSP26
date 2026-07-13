import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyItemModel, FormDataModel, Item, ProhibitedDetails } from '../concessionaire-security/concessionaire.model';
import { Company } from '../company';
import { files } from '@app/pages/incidentreport/incidentreport.model';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { CompanyMasterService } from './company-master.service';
import { ConcessionaireService } from '../concessionaire-security/concessionaire-config.service';
import { Locations } from '../locations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-addeditconcessionaireitem',
  templateUrl: './addeditconcessionaireitem.component.html',
  styleUrls: ['./addeditconcessionaireitem.component.scss']
})
export class AddeditcompanyMasterComponent implements OnInit {
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  @ViewChild('template', { static: true }) templateRef!: TemplateRef<any>;
  modalRef!: NgbModalRef;
  companyItem = new CompanyItemModel();
  isEdit: number = 0;
  companyId: number = 0;
  companies: Company[];
  dtTrigger: any;
  user: any;
  companyName: string
  totalQuantityOfCompany: number;
  prohibitedModel = new ProhibitedDetails();

  files: string[] = [];
  filemodel = new files()
  shortDesc: Item[] = [];

  isShortDescDropdown: boolean = false
  selectedThumbnailImage: string = '';
  selectedShortDesc: any = null;
  formDataModel = new FormDataModel();
  t: any[] = [];
  locationList: Locations[] = []
  getuser: string
  iscompanyselected:number;
  constructor(private router: Router, private route: ActivatedRoute, private toastr: ToastrService, private companyMasterService: CompanyMasterService, private concessionaireService: ConcessionaireService, private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.isEdit = +this.route.snapshot.pathFromRoot[1].queryParams['isEdit'] || 0;
    this.companyId = +this.route.snapshot.pathFromRoot[1].queryParams['companyId'];
    this.companyName = this.route.snapshot.pathFromRoot[1].queryParams['companyName'];
    this.totalQuantityOfCompany = this.route.snapshot.pathFromRoot[1].queryParams['totalquantityofcompany'];
    const recordId = this.route.snapshot.pathFromRoot[1].queryParams['recordId'];
    this.getuser = this.route.snapshot.pathFromRoot[1].queryParams['user'];
    this.prohibitedModel.companyId = this.companyId
    this.prohibitedModel.companyName = this.companyName
    this.iscompanyselected = +this.route.snapshot.pathFromRoot[1].queryParams['companySelected'] ;
    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    this.GetShortDescriptionsByCompanyId(this.companyId)
    this.getConcessionVariable();
    this.GetLocationListByCompanyId(this.companyId)
    if (this.isEdit == 1) {
      this.getProhibitedrecordById(recordId);
    }

    // this.GetCompanyList(this.user.id);
  }


  public GetLocationListByCompanyId(companyId: number) {
    this.companyMasterService.GetLocationListByCompanyId(companyId).subscribe((response: Locations[]) => {
      this.locationList = response;
      this.locationList =  this.locationList.sort((a, b) => a.location.localeCompare(b.location));
      this.dtTrigger.next();
    });
  }

  public GetShortDescriptionsByCompanyId(companyId: number) {
    this.companyMasterService.GetShortDescriptionsByCompanyId(companyId).subscribe({
      next: (response) => {
        this.shortDesc = response.map(item => ({
          shortDescription: item.shortDescription,
          filePath: item.filePath,
          thumbnailImage: item.thumbnailImage
            ? 'data:image/png;base64,' + item.thumbnailImage
            : '',
          description: item.description,
          quantityAllowed: item.quantityAllowed,
          newQuantityAllowed: item.newQuantityAllowed,
          location: item.location,
          locationId: item.locationId
        }));

        const groupedMap = new Map<string, any>();

        this.shortDesc.forEach(item => {
          const key = item.shortDescription;

          if (!groupedMap.has(key)) {
            groupedMap.set(key, {
              shortDescription: key,
              totalQuantityAllowed: item.quantityAllowed || 0,

            });
          } else {
            const existing = groupedMap.get(key);
            existing.totalQuantityAllowed += item.quantityAllowed || 0;

          }
        });

        // Step 3: Assign to `t` array
        this.t = Array.from(groupedMap.values());

      }
    });

  }

  public getProhibitedrecordById(id: number) {
    this.companyMasterService.GetProhibitedrecordById(id).subscribe({
      next: (response: ProhibitedDetails) => {
        this.prohibitedModel = response;
        //this.prohibitedModel.thumbnailImage = response.thumbnailImage? 'data:image/png;base64,' + response.thumbnailImage: ''
        this.prohibitedModel.thumbnailImage = response.thumbnailImage ?? '';
      },
      error: (err) => {
        this.toastr.error('Failed to load item.', 'Error');
      }
    });

  }

  onShortDescChange(selected: any): void {
    if (selected && selected.thumbnailImage) {
      this.selectedThumbnailImage = selected.thumbnailImage;
      this.prohibitedModel.shortDescription = selected.shortDescription;
      this.prohibitedModel.filePath = selected.filePath;
      this.prohibitedModel.description = selected.description;
      this.prohibitedModel.quantityAllowed = selected.quantityAllowed;
      this.prohibitedModel.location = selected.location
      this.prohibitedModel.locationId = selected.locationid
      // this.prohibitedModel.quantityAllowed = this.prohibitedModel.newQuantityAllowed;
    } else {
      this.selectedThumbnailImage = '';
    }
  }


  public GetCompanyList(userId: string) {
    this.companyMasterService.getAllCompanies(userId).subscribe((response: Company[]) => {
      this.companies = response;
      this.dtTrigger.next();
    });
  }

  public getConcessionVariable(): void {
    const id = 1;

    this.concessionaireService.getConcessionVariable().subscribe(
      (response: FormDataModel) => {
        if (response) {
          this.formDataModel = response;
        } else {
          this.toastr.warning('No data received from server.', 'Warning');
        }
      },
      (error: any) => {
        console.error('Failed to load configuration', error);
        this.toastr.error('Failed to load configuration', 'Error');
      }
    );
  }

  onExistingItem(): void {
    // Toggle the dropdown mode
    this.isShortDescDropdown = !this.isShortDescDropdown;

    // Reset the model based on the current state
    this.prohibitedModel.description = "";
    this.prohibitedModel.filePath = "";
    this.prohibitedModel.quantityAllowed = 0;
    this.prohibitedModel.shortDescription = "";


    if (!this.isShortDescDropdown) {
      this.prohibitedModel.thumbnailImage = "";
      this.prohibitedModel.newQuantityAllowed = 0;
    }
  }

  isFormValid(): boolean {

    return (
      !!this.prohibitedModel.companyName &&
      !!this.prohibitedModel.shortDescription &&
      !!this.prohibitedModel.filePath
      // &&
      // !!this.prohibitedModel.description
    );

  }

  public onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.companyItem.photos = Array.from(files);
      console.log('Selected files:', this.companyItem.photos);
    }
  }

  onLocationChanged() {
    const selected = this.locationList.find(x => x.id === this.prohibitedModel.locationId);
    this.prohibitedModel.location = selected ? selected.location : '';
  }

  closemodel() {
    this.modalService.dismissAll();
  }


  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.prohibitedModel.filePath = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.prohibitedModel.thumbnailImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  public onSubmit(formData: NgForm): void {
    if(this.getuser == 'staffadmin') 
    {
      const updateModel = {
        id: this.prohibitedModel.id,
        comment: this.prohibitedModel.comment,
        updatedBy: this.user.id,
        companyId: this.prohibitedModel.companyId,
        shortDescription: this.prohibitedModel.shortDescription,
        status: this.prohibitedModel.status,
        itemId: this.prohibitedModel.itemId,
        description: this.prohibitedModel.description,
        location: this.prohibitedModel.location,
        locationId: this.prohibitedModel.locationId

      } as ProhibitedDetails;
      this.prohibitedModel.updatedBy = this.user.id
      this.companyMasterService.EditByStaffadmin(updateModel, this.files).subscribe({
        next: (response: ProhibitedDetails) => {
          if (response) {
            this.toastr.success("Record updated successfully!", "Success");
            const companyId = response.companyId;
            const companyName = response.companyName;
            this.router.navigate(["/admin/prohibiteditemmaster"], {
              queryParams: {
                companyId: companyId,
                companyName: companyName

              }, skipLocationChange: true
            });
          } else {
            this.toastr.warning(" Update response was empty.", "Warning");
          }
          this.modalRef?.close();
        },
        error: () => {
          this.toastr.error("Failed to Update record", "Error");
          this.modalRef?.close();
        },
      });
    }else {
      if (!this.isFormValid()) {
        this.toastr.error('Please fill all required fields before submitting.', 'Form Incomplete');
        return;
      }
      // Check if itemQuantity is defined
      const matchedItem = this.t.find(x => x.shortDescription === this.prohibitedModel.shortDescription);
      const allowQty = matchedItem ? Number(matchedItem.totalQuantityAllowed) : 0;
      console.log('Form submitted:', this.companyItem);

      this.prohibitedModel.companyId = this.companyId
      this.prohibitedModel.status = "Approval Pending"
      if (this.prohibitedModel.id > 0) {
       // this.prohibitedModel.submittedDate = this.prohibitedModel.submittedDate
        this.prohibitedModel.updatedBy = this.user.id
      }
      this.prohibitedModel.submittedBy = this.user.id


      this.prohibitedModel.quantityUsein = this.prohibitedModel.quantityUsein

      if (this.isShortDescDropdown == true) {
        const newQty = Number(this.prohibitedModel.newQuantityAllowed)
        // if (this.prohibitedModel.quantityAllowed + newQty > 10) {
        //   this.toastr.error(`Only 10 Quantity can Approved cannot exceed available quantity .`, 'Validation Error');
        //   return;
        // }
        // else {
        //   this.prohibitedModel.quantityAllowed = this.prohibitedModel.newQuantityAllowed
        // }
      }
      else {
        // this.prohibitedModel.quantityAllowed = this.prohibitedModel.quantityApproved
        // this.prohibitedModel.description = this.prohibitedModel.description
      }
      var prohibitedDetails = this.prohibitedModel;
      this.companyMasterService.AddEditProhibitedItemDetails(prohibitedDetails, this.files,

      ).subscribe({ next: (response: any) => {
        this.modalRef = this.modalService.open(this.templateRef);
        this.toastr.success('Prohibited Items details saved!!', 'Information');
        const companyId = response.companyId;
        const companyName = response.companyName;
        this.router.navigate(["/admin/prohibiteditemmaster"], {
          queryParams: {
            companyId: companyId,
            companyName: companyName

          }, skipLocationChange: true
        });

        //this.router.navigate(['/admin/prohibiteditemmaster', companyId, companyName]);
      },
    error: (error) => {
      this.toastr.error(
        error?.error?.message || 'An error occurred while uploading the image.',
        'Upload Error'
      );
      this.files = [];
      this.prohibitedModel.filePath = '';
    }
    });
    }

  }




  public goBack(): void {
    if(this.iscompanyselected != 1){      
    
    this.router.navigate(['/admin/prohibiteditemmaster'],  {
          queryParams: {
            companyId: this.prohibitedModel.companyId,
            companyName: this.prohibitedModel.companyName

          }, skipLocationChange: true
        });
      }else{
        this.router.navigate(['/admin/prohibiteditemmaster'], )
      }
  }

  addFile(event:any) {
    const files = event.target.files;
    if (files.length === 0) {
      return;
    }
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    //files.name = 

    for (let file of files) {
      var parts = file.name.split('.');
      if (parts.length <= 1) {
        this.toastr.error("File " + file.name + " is not valid file");
      }
      if (!allowedTypes.includes(file.type)) {
        this.toastr.error(
          `File ${file.name} is not supported. Only JPG and PNG images are allowed.`
        );
        return;
      }
      else {
        this.prohibitedModel.filePath = file.name
        this.filemodel.name = file.name
        this.filemodel.size = file.size
        this.filemodel.lastModified = file.lastModified
        this.filemodel.lastModifiedDate = file.lastModifiedDate
        this.filemodel.webkitRelativePath = file.webkitRelativePath
        this.filemodel.type = file.type;
        const filemodelvalue = { ...this.filemodel }



        this.files.push(file)
        const reader = new FileReader();
        reader.onload = () => {
          this.prohibitedModel.thumbnailImage = reader.result as string;
        };
        reader.readAsDataURL(file);
      }

    }
    this.myInputVariable.nativeElement.value = "";
  }




  //   addFiless(fileList: FileList) {
  //   if (!fileList || fileList.length === 0) return;

  //   const file = fileList[0]; // ✅ Only one file allowed

  //   const parts = file.name.split('.');
  //   if (parts.length <= 1) {
  //     this.toastr.error("File " + file.name + " is not a valid file");
  //     return;
  //   }

  //   // Optional: clear previous file
  //   this.files = [];

  //   this.prohibitedModel.filePath = file.name;

  //   this.filemodel = {
  //     name: file.name,
  //     size: file.size,
  //     lastModified: file.lastModified,
  //     lastModifiedDate: file.lastModified,
  //     webkitRelativePath: file.webkitRelativePath
  //   };

  //   this.files.push(file); // ✅ Only one file stored

  //   this.myInputVariable.nativeElement.value = ""; // Reset input
  // }

}
