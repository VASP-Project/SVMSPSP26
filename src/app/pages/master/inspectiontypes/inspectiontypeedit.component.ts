import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { InspectionTypeMaster } from '../inspectiontypemaster';
import { InspectionTypeMasterService } from '../inspectiontypemaster/inspectiontypemaster.service';
import { InspectionTypes, InspectionTypesView } from '../inspectiontypes';
import { InspectionTypeService } from './inspectiontypes.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-inspectiontypeedit',
  templateUrl: './inspectiontypeedit.component.html',
  styleUrls: ['./inspectiontypes.component.scss']
})
export class InspectiontypeeditComponent implements OnInit {
  inspectiontypes : InspectionTypes[];
  inspectiontype = new InspectionTypes();
  inspType = new InspectionTypes();
  view: boolean = false;
  oldInspectionType:string = "";
  user:any;
  inspectiontypemaster : InspectionTypeMaster[];
  inspectionTypeNames : InspectionTypeMaster[];
    
  constructor(private toastr:ToastrService,private spinner: NgxSpinnerService,private router: Router, 
    private inspectionTypeService: InspectionTypeService, private route: ActivatedRoute, private appURL: AppConfigService,
    private inspectionTypeMasterService:InspectionTypeMasterService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    
    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    if (isEdit == "1") {
      var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
      var inspectionTypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['inspectionTypeId'];
      var inspectionTypeName:string = this.route.snapshot.pathFromRoot[1].queryParams['inspectionTypeName'];
      this.editInspectionType(inspectionTypeId, inspectionTypeName,isView)
      
    }
    this.GetInspectionTypeMasterList()
  }


  editInspectionType(id,typeName, isView) {
    if (isView == "1"){
      this.view = true;
      this.GetInspectionTypeById(id);
    }      
    else{
      this.view = false;
    this.GetInspectionTypeByIdName(id,typeName);
    }
      
  }


  private GetInspectionTypeByIdName(id: number,typeName:string) {
    //this.spinner.show();
    this.inspectionTypeService.GetInspectionTypeByIdName(id,typeName).subscribe((response: InspectionTypesView) => {
      if(response.statusText == 'Exists'){        
        this.toastr.error('Inspection Category can not be edited. It is attached to a Inspection');
        this.router.navigate(['/admin/inspectiontype']);
      }
      else {
        this.inspectiontype = response
        this.oldInspectionType = response.inspectionType;
        this.inspectiontype.id = id; 
        this.inspectiontype.displayName = response.displayName 
        this.inspectiontype.requirementHours = response.requirementHours
      }
          
      //this.spinner.hide();
    });
  }

  private GetInspectionTypeById(id: number) {
    //this.spinner.show();
    this.inspectionTypeService.GetInspectionTypeById(id).subscribe((response: InspectionTypes) => {
      
        this.inspectiontype = response
        this.oldInspectionType = response.inspectionType;
        this.inspectiontype.id = id; 
        this.inspectiontype.displayName = response.displayName 
        this.inspectiontype.requirementHours = response.requirementHours
      
          
      //this.spinner.hide();
    });
  }


  //Add User Submit
  onSubmit(formData: NgForm) {
    var inspectionType = {
      Id: formData.value.id,
      InspectionType: formData.value.inspectionType,
      DisplayName: formData.value.displayName,
      RequirementHours:formData.value.requirementHours      
    };
    
    if(this.oldInspectionType.toUpperCase().trim() != formData.value.inspectionType.toUpperCase().trim())
    {
      // this.inspectionTypeService.CheckinspectiontypeExists(this.inspectiontype.inspectionType).subscribe((response) => {
      //   if (response) {
      //     this.toastr.error('Inspection Type already exist. Try other Inspection Type', 'Information');
      //     this.inspectiontype.inspectionType = this.oldInspectionType;
      //     this.inspectiontype.displayName = "";
      //     //this.spinner.hide();
      //   }
      //   else
      //   {
      //     this.saveInspectionType(inspectionType, formData);
      //   }       
      // }, (error:any)=> {
      //   this.toastr.error('Inspection Type already exist. Try other Inspection Type', 'Information');
      //   //this.spinner.hide();
      // });
      this.saveInspectionType(inspectionType, formData);
    } 
    else
    {
      this.saveInspectionType(inspectionType, formData);
    }  
    
  }


  saveInspectionType(inspectionType, formData: NgForm)
  {
    //this.spinner.show();
    this.inspectionTypeService.AddEditInspectionType(inspectionType).subscribe((response) => {
      //this.spinner.hide();
      this.toastr.success('Inspection Type Saved Successfully');
      formData.reset();
      this.router.navigate(['/admin/inspectiontype']);
    });
  }


  checkInspectionType()
  {    
    if(this.oldInspectionType != this.inspectiontype.inspectionType)
    {
      this.inspectionTypeService.CheckinspectiontypeExists(this.inspectiontype.inspectionType).subscribe((response) => {
        if (response) {
          this.toastr.error('Inspection Type already exist. Try other Inspection Type', 'Information');
          this.inspectiontype.inspectionType = this.oldInspectionType;
        }       
      }, (error:any)=> {
        this.toastr.error('Inspection Type already exist. Try other Inspection Type', 'Information');
        //this.spinner.hide();
      });
    }   
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.toastr.error('Please enter only numbers', 'Information');
      return false;
      
    }
    return true;
  }

  
  //Hide Add form 
  hideaddform() {
    this.router.navigate(['/admin/inspectiontype']);
  }

  GetInspectionTypeMasterList() {
    //this.spinner.show();
    this.inspectiontypemaster=[];
    this.inspectionTypeMasterService.GetInspectionTypeMasterList().subscribe((response: InspectionTypeMaster[]) => {
      this.inspectionTypeNames = response;
      
      
    },
    (error:any)=> {
      this.toastr.error('Error while fetching Inspection Category', 'Error');
      //this.spinner.hide();
    });
  }
}
