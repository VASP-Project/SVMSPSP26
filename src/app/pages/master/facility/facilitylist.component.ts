import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataOutputModel, Facilities, FacilitiesList } from '../facility';
import { FacilityService } from './facility.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-facilitylist',
  templateUrl: './facilitylist.component.html',
  styleUrls: ['./facility.component.scss']
})
export class FacilitylistComponent implements OnInit {
  facilities : Facilities[];
  user:any;
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  queryParam: QueryStringParameters = new QueryStringParameters();
  facilitiesList : FacilitiesList[];
  pageHeaders: PagingHeader = new PagingHeader()
  config: any;
  sortDir = 1;//1= 'ASE' -1= DSC

  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private appURL: AppConfigService,
    private facilityService: FacilityService, private router: Router) { }

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

     this.GetFacilityList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      
    };
   
  }

  onClick(facilityId: string, facilityName: string) {
    this.router.navigate(['/facility', facilityId, facilityName])
  }

  public GetFacilityList() {
    //this.spinner.show();
    this.facilities = [];
    this.facilityService.GetFacilityList().subscribe((response: Facilities[]) => {
        this.facilities = response;
        //this.spinner.hide();
        this.dtTrigger.next();
    },
    (error:any)=> {
      this.toastr.error('Error while fetching Facilities', 'Error');
      //this.spinner.hide();
    });
  }

  viewFacility(id: number) {
    let navigationExtras: any = {
      queryParams: {
          'facilityId': id,
          'isEdit': 1,
          'isView': 1
      }
  };

    this.router.navigate(['/admin/facilityedit'], navigationExtras);
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
    this.GetFacilityListNew();
  }

  public GetFacilityListNew() {
    //this.spinner.show();
    this.facilityService.GetFacilityListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.facilitiesList = response.items;
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
    this.GetFacilityListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetFacilityListNew();
  }

  searchtable(){
    this.GetFacilityListNew();
  }

  deleteFacility(id) {
    var ans = confirm("Are you sure you want to delete this Facility?");
    if (ans == true) {
        //this.spinner.show();
        $('#dt1').DataTable().destroy();
        this.facilityService.DeleteFacilityById(id).subscribe((response: Response) => {
            if (response.statusText == "Fail") {
                this.toastr.success('There was some error deleting the record. Please try again later');
            } else if (response.statusText === "Exists") {
                this.toastr.error('Facility not deleted. It is attached to Inspection record');
            }
            else {
                this.toastr.success('Facility deleted successfully');
            }
            //this.spinner.hide();
            this.GetFacilityList();
        });
    }
  }
}
