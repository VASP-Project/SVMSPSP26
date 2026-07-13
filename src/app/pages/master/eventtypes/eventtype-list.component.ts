import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataOutputModel, EventTypeList, EventTypes } from '../eventtypes';
import { EventTypesService } from './eventtype.service';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
    templateUrl: './eventtype-list.component.html',
    styleUrls: ['./eventtype.component.css']
})
export class EventTypeslistComponent implements OnInit {
    eventTypes: EventTypes[];
    user:any;
    dtOptions: DataTables.Settings = {};
    queryParam: QueryStringParameters = new QueryStringParameters();
    eventTypeList : EventTypeList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC

    // We use this trigger because fetching the list can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject();
    constructor(private toastr: ToastrService, private spinner: NgxSpinnerService,  private appURL: AppConfigService,
        private eventTypesService: EventTypesService,
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
        this.GetEventTypeList();
    }

    onClick(id: string, type: string) {
        this.router.navigate(['/eventType', id, type])
    }


    public GetEventTypeList() {
        //this.spinner.show();
        this.eventTypesService.GetEventTypeList().subscribe((response: EventTypes[]) => {
            this.eventTypes = response;
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
        this.GetEventTypeListNew();
      }
    
      public GetEventTypeListNew() {
        //this.spinner.show();
        this.eventTypesService.GetEventTypeListNew(this.queryParam).subscribe((response: DataOutputModel) => {
          this.eventTypeList = response.items;
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
        this.GetEventTypeListNew();
      }
    
      onPageSizeChange(): void {
        this.queryParam.pageSize = +this.queryParam.pageSize
        this.queryParam.maxPageSize = +this.queryParam.pageSize
        this.GetEventTypeListNew();
      }
    
      searchtable(){
        this.GetEventTypeListNew();
      }


    viewEventType(id: number) {
        let navigationExtras: any = {
            queryParams: {
                'id': id,
                'isEdit': 1,
                'isView': 1
            }
        };

        this.router.navigate(['/admin/eventtypeedit'], navigationExtras);
    }

    deleteEventTypes(id) {
        var ans = confirm("Are you sure you want to delete this Event Type?");
        if (ans == true) {
            //this.spinner.show();
            this.eventTypesService.DeleteEventTypeById(id).subscribe((response: Response) => {
                if (response.statusText == "Fail") {
                    this.toastr.success('There was some error deleting the record. Please try again later');
                } else if (response.statusText === "Exists") {
                    this.toastr.error('Event Type not deleted. It is attached to a citation record');
                }
                else {
                    this.toastr.success('Event Type deleted successfully');
                }
                //this.spinner.hide();
                $('#dt1').DataTable().destroy();
                this.GetEventTypeList();
            });
        }
    }

}
