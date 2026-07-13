import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DataOutputModel, ViolationTypeList, ViolationTypes } from '../violationtypes';
import { ViolationTypesService } from './violationtype.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { HttpClient } from '@angular/common/http';
import { Status } from '@okta/okta-auth-js';
@Component({
    templateUrl: './violationtype-list.component.html',
    styleUrls: ['./violationtype.component.css']
})

export class ViolationTypeslistComponent implements OnInit {
    violationTypes: ViolationTypes[];
    user:any;
    
    dtOptions: DataTables.Settings = {};
    queryParam: QueryStringParameters = new QueryStringParameters();
    violationTypeList : ViolationTypeList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC

    // We use this trigger because fetching the list can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject();
    constructor(private toastr: ToastrService,private http: HttpClient, private cd: ChangeDetectorRef,private spinner: NgxSpinnerService, private violationTypesService: ViolationTypesService, private appURL: AppConfigService,
        private router: Router) { }

    ngOnInit() {
        this.queryParam.pageSize = 10
        this.queryParam.pageNumber = 1
        this.queryParam.maxPageSize = 10
        this.config = {
        currentPage: 1,
        itemsPerPage: this.queryParam.pageSize
    };
                //Get user form local storage
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
        this.GetViolationTypeList();
    }

    onClick(violationId: string, violationType: string) {
        this.router.navigate(['/violationType', violationId, violationType])
    }

 
  onToggle(row: any, event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;

 
  row.status = isChecked;

  const payload = {
    id: row.id,
    status: isChecked,
     user: this.user?.email
  };

  console.log('CLICK WORKING', row.id, isChecked);

   const token = this.user?.token; // 🔥 get token
 
  const headers = {
    Authorization: `Bearer ${token}`
  };

  this.http.post<any>(
    '  http://localhost:54785/api/ViolationType/updateStatus',
    payload,
    { headers }
  ).subscribe({
    next: (res) => {
if(res.success){
   row.status = res.status;

      this.toastr.success(res.status ? 'Activated' : 'Deactivated');
    
}
      console.log('Updated');
  
    },
    error: (err) => {
      console.error('Error:', err);
      row.isActive = !isChecked; 
        this.toastr.error('Something went wrong:', err);
      // rollback
    }
  });
  }



    public GetViolationTypeList() {
        //this.spinner.show();
        this.violationTypesService.GetViolationTypeList().subscribe((response: ViolationTypes[]) => {
            this.violationTypes = response;
            this.cd.detectChanges();
            this.dtTrigger.next();
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
        this.GetViolationTypeListNew();
      }
    
      public GetViolationTypeListNew() {
        //this.spinner.show();
        this.violationTypesService.GetViolationTypeListNew(this.queryParam).subscribe((response: DataOutputModel) => {
          this.violationTypeList = response.items;
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
        this.GetViolationTypeListNew();
      }
    
      onPageSizeChange(): void {
        this.queryParam.pageSize = +this.queryParam.pageSize
        this.queryParam.maxPageSize = +this.queryParam.pageSize
        this.GetViolationTypeListNew();
      }
    
      searchtable(){
        this.GetViolationTypeListNew();
      }


    viewViolationType(id: number) {
        let navigationExtras: any = {
            queryParams: {
                'violationtypeId': id,
                'isEdit': 1,
                'isView': 1
            }
        };
        this.router.navigate(['/admin/violationtypeedit'], navigationExtras);
    }

    deleteViolationTypes(id) {
        var ans = confirm("Are you sure you want to delete this Violation Type?");
        if (ans == true) {
            //this.spinner.show();
            this.violationTypesService.DeleteViolationTypeById(id).subscribe((response: Response) => {
                if (response.statusText == "Fail") {
                    this.toastr.success('There was some error deleting the record. Please try again later');
                } else if (response.statusText === "Exists") {
                    this.toastr.error('Violation Type deactivated. It is attached to a citation record');
                }
                else {
                    this.toastr.success('Violation Type deleted successfully');
                }
                //this.spinner.hide();
                $('#dt1').DataTable().destroy();
                this.GetViolationTypeList();
            });
        }
    }

     CheckBoxChange(event, id) {
        //this.User.isTSA = event.target.checked;   
        this.violationTypesService.changeActiveFlag(event.target.checked, id,this.user.email).subscribe();
        if (event.target.checked) {
            this.toastr.success('Violation Type Activated');
        } else {
            this.toastr.error('Violation Type Deactivated');
        }
    }
}
