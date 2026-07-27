import { Component, OnInit, Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CitationReasonsService } from '../CitationReasons/citationreasons.service';
import { CitationReasonList, CitationReasons, DataOutputModel } from '../citationreasons';
import { ViolationTypes } from '../violationtypes';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-citationreasons',
  templateUrl: './citationreasons.component.html',
  styleUrls: ['./citationreasons.component.scss']
})
export class CitationreasonsComponent implements OnInit {
  CitationReasonsFromDb: CitationReasons[];
  CitationReasons: CitationReasons[];
  user: any;
  queryParam: QueryStringParameters = new QueryStringParameters();
  citationReasonList : CitationReasonList[];
  pageHeaders: PagingHeader = new PagingHeader()
  config: any;
  sortDir = 1;//1= 'ASE' -1= DSC

  allViolationTypes: ViolationTypes[];

  sampleData: any = [] = [];
  columnsnames: any = [];
  displayTable: boolean = false;
  //dtOptions: any;
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  constructor(private ref: ChangeDetectorRef, private CitationReasonsService: CitationReasonsService, private spinner: NgxSpinnerService, private appURL: AppConfigService,
    private router: Router, private toastr: ToastrService) {

  }

  ngOnInit() {
    this.queryParam.pageSize = 25
        this.queryParam.pageNumber = 1
        this.queryParam.maxPageSize = 100
        this.config = {
        currentPage: 1,
        itemsPerPage: this.queryParam.pageSize
    };
      //Get user form local storage
      this.user = JSON.parse(sessionStorage.getItem("currentUser"));
      console.log(this.user)
      if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
        if (!this.user.passwordReseted) {
          //this.spinner.hide();
          this.router.navigate(['admin/changepassword']);
        }
      }    
      this.GetCitationReasonList();


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      responsive:true,
    };
    
  }




  private processData() {

    const violationTypeIdSeen = {};
    this.CitationReasons = this.CitationReasonsFromDb.sort((a, b) => {
      const violationTypeIdComp = a.violationTypeId.toString().localeCompare(b.violationTypeId.toString());
      return violationTypeIdComp; 
    }).map(x => {
      const violationTypeIdSpan = violationTypeIdSeen[x.violationTypeId.toString()] ? 0 :
        this.CitationReasonsFromDb.filter(y => y.violationTypeId.toString() === x.violationTypeId.toString()).length;
      violationTypeIdSeen[x.violationTypeId.toString()] = true;
      return { ...x, violationTypeIdSpan };
    });
  }


  public GetCitationReasonList() {
    this.sampleData = [];
    this.displayTable = false;
    //this.spinner.show();
    this.CitationReasonsService.GetCitationReasonList().subscribe((response: CitationReasons[]) => {
      this.CitationReasonsFromDb = response;
      this.processData();
      this.displayTable = true;
      this.ref.detectChanges();
      this.dtTrigger.next();
      
      

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
    this.GetCitationReasonListNew();
  }

  public GetCitationReasonListNew() {
    //this.spinner.show();
    this.CitationReasonsService.GetCitationReasonListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.citationReasonList = response.items;

     
      this.pageHeaders = response.paging
      
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
      
      //this.spinner.hide();
  });
  }
  
  onPageChange(newPage: number): void {
    this.queryParam.pageNumber = newPage;
    this.GetCitationReasonListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetCitationReasonListNew();
  }

  searchtable(){
    this.GetCitationReasonListNew();
  }


  deleteCitationReasons(id) {

    var ans = confirm("Are you sure you want to delete this Citation Reason?");
    if (ans == true) {
      //  $('#dt1').DataTable().destroy();
      //this.spinner.show();
      $('#dt1').DataTable().destroy();
      this.CitationReasonsService.DeleteCitationReasonsById(id).subscribe((response: Response) => {
        if (response.statusText == "Fail") {
          this.toastr.success('There was some error deleting the record. Please try again later.');
        }
        else if (response.statusText === "Exists") {
          this.toastr.error('Citation Reason not deleted. It is attached to a citation record');
        }
        else {
          this.toastr.success('Citation Reason deleted successfully');
        }
        //this.spinner.hide();
        this.GetCitationReasonList();
      });
    }

  }

  viewCitationreasons(id: number) {
    let navigationExtras: any = {
      queryParams: {
        'citatitionId': id,
        'isEdit': 1,
        'isView': 1
      }
    };
    this.router.navigate(['/admin/citationreasonsedit'], navigationExtras);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


   CheckBoxChange(event, id) {
        //this.User.isTSA = event.target.checked;   
      
        this.CitationReasonsService.changeActiveFlag(event.target.checked, id,this.user.email).subscribe();
        if (event.target.checked) {
            this.toastr.success('Citation reason Activated');
        } else {
            this.toastr.error('Citation reason Deactivated');
        }
    }


    
  
}


