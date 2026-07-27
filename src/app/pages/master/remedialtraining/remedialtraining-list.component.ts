import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { DataOutputModel, RemedialTraining, RemeTrainingList } from '../remedialtraining';
import { RemedialTrainingService } from './remedialtraining.service';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
    templateUrl: './remedialtraining-list.component.html',
    styleUrls: ['./remedialtraining.component.css']
})
export class RemedialTraininglistComponent implements OnInit {
    remedialTraining: RemedialTraining[];
    dtOptions: DataTables.Settings = {};
    user: any;
    queryParam: QueryStringParameters = new QueryStringParameters();
    remeTrainingList : RemeTrainingList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
    // We use this trigger because fetching the list can be quite long,
    // thus we ensure the data is fetched before rendering
    dtTrigger: Subject<any> = new Subject();
    constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private remedialTrainingService: RemedialTrainingService, private appURL: AppConfigService,
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

           this.GetRemedialTrainingList();
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            stateSave: true,
            stateDuration: -1
        };
       
    }

    onClick(id: string, trainingType: string) {
        this.router.navigate(['/remedialtraining', id, trainingType])
    }


    public GetRemedialTrainingList() {
        //this.spinner.show();
        this.remedialTrainingService.GetRemedialTrainingList().subscribe((response: RemedialTraining[]) => {
            this.remedialTraining = response;
            // console.log(response);
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
        this.GetRemedialTrainingListNew();
      }
    
      public GetRemedialTrainingListNew() {
        //this.spinner.show();
        this.remedialTrainingService.GetRemedialTrainingListNew(this.queryParam).subscribe((response: DataOutputModel) => {
          this.remeTrainingList = response.items;
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
        this.GetRemedialTrainingListNew();
      }
    
      onPageSizeChange(): void {
        this.queryParam.pageSize = +this.queryParam.pageSize
        this.queryParam.maxPageSize = +this.queryParam.pageSize
        this.GetRemedialTrainingListNew();
      }
    
      searchtable(){
        this.GetRemedialTrainingListNew();
      }

    CheckBoxChange(event, id) {
        //this.User.isTSA = event.target.checked;   
        this.remedialTrainingService.changeActiveFlag(event.target.checked, id).subscribe();
        if (event.target.checked) {
            this.toastr.success('Corrective Action Activated');
        } else {
            this.toastr.error('Corrective Action Deactivate');
        }
    }

    viewRemedialTraining(id: number) {
        let navigationExtras: any = {
            queryParams: {
                'id': id,
                'isEdit': 1,
                'isView': 1
            }
        };

        this.router.navigate(['/admin/remedialtrainingedit'], navigationExtras);
    }

    deleteRemedialTraining(id) {
        var ans = confirm("Are you sure you want to delete this Corrective Action?");
        if (ans == true) {
            //this.spinner.show();
            this.remedialTrainingService.DeleteRemedialTrainingById(id).subscribe((response: Response) => {
                if (response.statusText == "Fail") {
                    this.toastr.success('There was some error deleting the record. Please try again later');
                } else if (response.statusText === "Exists") {
                    this.toastr.error('Corrective Action not deleted. It is attached to a citation record');
                }
                else if (response.statusText == "Updated") {
                    this.toastr.error('Corrective Action deactivated since it is already used');
                }
                else {
                    this.toastr.error('Corrective Action deleted successfully');
                }
                //this.spinner.hide();
                $('#dt1').DataTable().destroy();
                this.GetRemedialTrainingList();
            });
        }
    }

}
