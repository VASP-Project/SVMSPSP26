import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { InspectionTypeMaster } from '../inspectiontypemaster';
import { InspectionTypeMasterService } from './inspectiontypemaster.service';

@Component({
  selector: 'app-inspectiontypemaster',
  templateUrl: './inspectiontypemaster.component.html',
  styleUrls: ['./inspectiontypemaster.component.scss']
})
export class InspectiontypemasterComponent implements OnInit {
  inspectiontypemaster : InspectionTypeMaster[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  
  constructor(private router: Router,
    
    private inspectionTypeService: InspectionTypeMasterService,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.GetInspectionTypeMasterList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
    };
    const editedRowId = sessionStorage.getItem("InspectionCategoryEditRowID");

    if (editedRowId) {
      setTimeout(() => {
        const row = document.getElementById("row-" + editedRowId);

        if (row) {
          row.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          row.classList.add("highlight-row");

          setTimeout(() => {
            row.classList.remove("highlight-row");
          }, 3000);
        }
      }, 500);
      sessionStorage.removeItem("InspectionCategoryEditRowID");
    }
  }

    public GetInspectionTypeMasterList() {
      //this.spinner.show();
      this.inspectiontypemaster=[];
      this.inspectionTypeService.GetInspectionTypeMasterList().subscribe((response: InspectionTypeMaster[]) => {
        this.inspectiontypemaster = response;
        //this.spinner.hide();
        this.dtTrigger.next();
      },
      (error:any)=> {
        this.toastr.error('Error while fetching Inspection Category', 'Error');
        //this.spinner.hide();
      });
    }
  
    viewInspectionType(id: number) {
      let navigationExtras: any = {
        queryParams: {
          'inspectionTypeId': id,
          'isEdit': 1,
          'isView': 1
        }
      };
      this.router.navigate(['/admin/inspectionmasteredit'], navigationExtras);
    }

    
  deleteInspectionType(id:number,name:string) {
    var ans = confirm("Are you sure you want to delete this Inspection Category?");
    if (ans == true) {
      $('#dt1').DataTable().destroy();
      this.inspectionTypeService.DeleteInspectionMasterById(id,name).subscribe((response: Response) => {
        if (response.statusText == "Fail") {
          this.toastr.success('There was some error deleting the record. Please try again later.');
        }
        else if (response.statusText === "Exists") {
          this.toastr.error('Inspection Category not deleted. It is attached to a Inspection Type');
        }
        else {
          this.toastr.success('Inspection Category deleted successfully');
        }
        //this.spinner.hide();
        this.GetInspectionTypeMasterList();
      });
    }

  }
  InspectionCategoryEditRow(id: number): void {
    sessionStorage.setItem('InspectionCategoryEditRowID', id.toString());
  }
}
