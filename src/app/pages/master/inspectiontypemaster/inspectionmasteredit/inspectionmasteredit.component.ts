import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InspectionTypeMaster } from '../../inspectiontypemaster';
import { InspectionTypeService } from '../../inspectiontypes/inspectiontypes.service';
import { InspectionTypeMasterService } from '../inspectiontypemaster.service';

@Component({
  selector: 'app-inspectionmasteredit',
  templateUrl: './inspectionmasteredit.component.html',
  styleUrls: ['./inspectionmasteredit.component.scss']
})
export class InspectionmastereditComponent implements OnInit {
  isEdit:number = 0;
  inspectiontypeMaster= new InspectionTypeMaster();
  view: boolean = false;
  constructor( private router: Router,
    
    private inspectionTypeService: InspectionTypeMasterService,
    private route: ActivatedRoute,
    private toastr: ToastrService,) { }

  ngOnInit() {
    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    if (isEdit == "1") {
      var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
      var inspectionTypeId: number = this.route.snapshot.pathFromRoot[1].queryParams['inspectionTypeId'];
      this.editInspectionTypeMaster(inspectionTypeId, isView)
    }
  }

  editInspectionTypeMaster(id, isView) {
    if (isView == "1")
      this.view = true;
    else
      this.view = false;
   this.GetInspectionTypeById(id);
  }

  private GetInspectionTypeById(id: number) {
    //this.spinner.show();
    this.inspectionTypeService.GetInspectionTypeMasterById(id).subscribe((response: InspectionTypeMaster) => {
      this.inspectiontypeMaster = response
      
      this.inspectiontypeMaster.id = id; 
      this.inspectiontypeMaster.typeName = response.typeName
      this.inspectiontypeMaster.requiredHours = response.requiredHours    
      //this.spinner.hide();
    });
  }

    onSubmit(formData: any) {
      var inspectiontypeMaster = {
        Id: formData.value.id,
        TypeName: formData.value.typeName,
        RequiredHours:formData.value.requiredHours      
      };
      this.saveInspectionType(inspectiontypeMaster, formData);
    }

    saveInspectionType(inspectiontypeMaster, formData: NgForm) {
      //this.spinner.show();
      this.inspectionTypeService.AddInspectionMaster(inspectiontypeMaster).subscribe((response) => {
        //this.spinner.hide();
        this.toastr.success('Inspection Category Saved Successfully');
        formData.reset();
        this.router.navigate(['/admin/inspectiontypemaster']);
      });
    }

    numberOnly(event): boolean {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        
        return false;
        
      }
      return true;
    }

    hideaddform() {
      this.router.navigate(['/admin/inspectiontypemaster']);
    }
}
