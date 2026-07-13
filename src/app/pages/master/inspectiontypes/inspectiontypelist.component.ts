import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataOutputModel, InspectionList, InspectionTypes, InspectionTypesView } from '../inspectiontypes';
import { InspectionTypeService } from './inspectiontypes.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-inspectiontypelist',
  templateUrl: './inspectiontypelist.component.html',
  styleUrls: ['./inspectiontypes.component.scss']
})
export class InspectiontypelistComponent implements OnInit {
  inspectiontypes : InspectionTypes[];
  view: boolean = false;
  user: any;
  dtOptions: DataTables.Settings = {};
  queryParam: QueryStringParameters = new QueryStringParameters();
  inspectionList : InspectionList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
  dtTrigger: Subject<any> = new Subject();

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router,  private appURL: AppConfigService,
    private inspectionTypeService: InspectionTypeService) { }

  ngOnInit() {
    this.queryParam.pageSize = 10
        this.queryParam.pageNumber = 1
        this.queryParam.maxPageSize = 10
        this.config = {
        currentPage: 1,
        itemsPerPage: this.queryParam.pageSize
    };
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
    };
    this.GetInspectionTypeList();
  }


  public GetInspectionTypeList() {
    //this.spinner.show();
    this.inspectiontypes=[];
    this.inspectionTypeService.GetInspectionTypeList().subscribe((response: InspectionTypes[]) => {
      this.inspectiontypes = response;
      //this.spinner.hide();
      this.dtTrigger.next();
    },
    (error:any)=> {
      this.toastr.error('Error while fetching Inspection Type', 'Error');
      //this.spinner.hide();
    });
  }
  onSortClick(event, columnname) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir = -1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir = 1;
    }
    this.queryParam.orderBy = columnname
    this.queryParam.orderDir = this.sortDir == -1 ? "desc" : "asc"
    this.GetInspectionTypeListNew();
  }

  public GetInspectionTypeListNew() {
    //this.spinner.show();
    this.inspectionTypeService.GetInspectionTypeListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.inspectionList = response.items;
      this.pageHeaders = response.paging
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
      
      //this.spinner.hide();
  });
  }
  

  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    this.GetInspectionTypeListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetInspectionTypeListNew();
  }

  searchtable(){
    this.GetInspectionTypeListNew();
  }



  viewInspectionType(id: number) {
    let navigationExtras: any = {
      queryParams: {
        'inspectionTypeId': id,
        'isEdit': 1,
        'isView': 1
      }
    };
    this.router.navigate(['/admin/inspectiontypeedit'], navigationExtras);
  }


  deleteInspectionType(id) {
    var ans = confirm("Are you sure you want to delete this Inspection Type?");
    if (ans == true) {
      //this.spinner.show();
      $('#dt1').DataTable().destroy();
      this.inspectionTypeService.DeleteInspectionTypeById(id).subscribe((response: Response) => {
        if (response.statusText === "Fail") {
          this.toastr.error('There was some error deleting the record. Please try again later');
        }
        else if (response.statusText === "Exists") {
          this.toastr.error('Inspection Type not deleted. It is attached to a inspection record');
        }
        else {
          this.toastr.success('Inspection Type deleted successfully');
        }   //window.location.reload();
        //this.spinner.hide();
        this.GetInspectionTypeList();
      });
    }
  }

  editInspectionType(id,typeName){
    this.inspectionTypeService.GetInspectionTypeByIdName(id,typeName).subscribe((response: InspectionTypesView) => {
      if(response.statusText == 'Exists'){        
        this.toastr.error('Inspection Category not edited. It is attached to a Inspection');
        this.router.navigate(['/admin/inspectiontype']);
      }
      else {
        this.router.navigate(['/admin/inspectiontypeedit'],{
          queryParams: {
            
              'inspectionTypeId': id,
              'inspectionTypeName': typeName,
              'isEdit': 1,
              'isView': 0
            
            
          },skipLocationChange: true
        })
      }
          
      //this.spinner.hide();
    });
  }
}
