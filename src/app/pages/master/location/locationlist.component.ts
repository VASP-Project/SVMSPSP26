import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Facilities } from '../facility';
import { DataOutputModel, LocationList, Locations } from '../locations';
import { LocationService } from './location.service';
import { AppConfigService } from '@app/_services/appconfigservice ';


@Component({
  selector: 'app-locationlist',
  templateUrl: './locationlist.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationlistComponent implements OnInit {
  locationsFromDB : Locations[];
  locations : Locations[];
  user: any;
  allFacilities: Facilities[];
  displayTable: boolean = false;
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  queryParam: QueryStringParameters = new QueryStringParameters();
  locationList : LocationList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
  

  constructor(private ref: ChangeDetectorRef, private locationService: LocationService, private appURL: AppConfigService,
    private spinner: NgxSpinnerService,private router: Router, private toastr: ToastrService) { }

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
    pageLength: 10
  };
  this.GetLocationList();
  }

  public GetLocationList() {
    this.displayTable = false;
    //this.spinner.show();
    this.locationService.GetLocationList().subscribe((response: Locations[]) => {
      this.locationsFromDB = response || [];
      // this.dtTrigger.next();
      //this.spinner.hide();
      /// this.buildDtOptions(response)
      this.displayTable = true;
      this.ref.detectChanges();
      this.dtTrigger.next();
      this.processData();
    },
    (error:any)=> {
      this.toastr.error('Error while fetching Locations', 'Error');
      //this.spinner.hide();
    });
  }

  private processData() {
    const facilityIdSeen = {};
    this.locations = this.locationsFromDB.sort((a, b) => {
      const facilityIdComp = a.facilityId.toString().localeCompare(b.facilityId.toString());
      return facilityIdComp; // ? violationTypeIdComp : a.county.localeCompare(b.county);
    }).map(x => {
      const facilityIdSpan = facilityIdSeen[x.facilityId.toString()] ? 0 :
        this.locationsFromDB.filter(y => y.facilityId.toString() === x.facilityId.toString()).length;
      facilityIdSeen[x.facilityId.toString()] = true;
      return { ...x, facilityIdSpan };
    });
  }


  deleteLocation(id) {
    var ans = confirm("Are you sure you want to delete this Location?");
    if (ans == true) {
      //  $('#dt1').DataTable().destroy();
      //this.spinner.show();
      $('#dt1').DataTable().destroy();
      this.locationService.DeleteLocationById(id).subscribe((response: Response) => {
        if (response.statusText == "Fail") {
          this.toastr.success('There was some error deleting the record. Please try again later.');
        }
        else if (response.statusText === "Exists") {
          this.toastr.error('Location not deleted. It is attached to Inspection record');
        }
        else {
          this.toastr.success('Location deleted successfully');
        }
        //this.spinner.hide();
        this.GetLocationList();
      });
    }
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
    this.GetLocationListNew();
  }

  public GetLocationListNew() {
    //this.spinner.show();
    this.locationService.GetLocationListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.locationList = response.items;
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
    this.GetLocationListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetLocationListNew();
  }

  searchtable(){
    this.GetLocationListNew();
  }


  viewLocation(id: number) {
    let navigationExtras: any = {
      queryParams: {
        'locationId': id,
        'isEdit': 1,
        'isView': 1
      }
    };
    this.router.navigate(['/admin/locationedit'], navigationExtras);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
