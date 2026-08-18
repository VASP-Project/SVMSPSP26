import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from '../company/company.service';
import { Company, CompanyList, DataOutputModel } from '../company';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
  selector: 'app-companylist',
  templateUrl: './companylist.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanylistComponent implements OnInit {
  companies: Company[];
  view: boolean = false;
  public imagePath;
  imgURL: any;
  public message: string;
  user:any;
  dtOptions: DataTables.Settings = {};
  queryParam: QueryStringParameters = new QueryStringParameters();
  companyList : CompanyList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, private router: Router, private CompanyService: CompanyService, private appURL: AppConfigService,) { }

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

    this.GetCompanyList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      
    };
    
    const editedRowId = sessionStorage.getItem("editedCompRowId");

    if (editedRowId) {
      setTimeout(() => {
        const row = document.getElementById("row-" + editedRowId);

        if (row) {
          row.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          row.classList.add("highlight-row");

          row.querySelectorAll("td").forEach((td: any) => {
            td.style.setProperty("--bs-table-accent-bg", "#b5ca77");
          });

          setTimeout(() => {
            row.classList.remove("highlight-row");

            row.querySelectorAll("td").forEach((td: any) => {
              td.style.removeProperty("--bs-table-accent-bg");
            });
          }, 4000);
        }
      }, 500);
      sessionStorage.removeItem("editedCompRowId");
    }
  }

  viewcompany(id: number) {
    let navigationExtras: any = {
      queryParams: {
        'companyId': id,
        'isEdit': 1,
        'isView': 1
      }
    };

    this.router.navigate(['/admin/companyedit'], navigationExtras);
  }
  deleteCompany(id) {
    var ans = confirm("Are you sure you want to delete this Company?");
    if (ans == true) {
      //this.spinner.show();
      $('#dt1').DataTable().destroy();
      this.CompanyService.DeleteCompanyById(id).subscribe((response: Response) => {
        if (response.statusText === "Fail") {
          this.toastr.error('There was some error deleting the record. Please try again later');
        }
        else if (response.statusText === "Exists") {
          this.toastr.error('Company not deleted. It is attached to a citation record');
        }
        else {
          this.toastr.success('Company deleted successfully');
        }   //window.location.reload();
        //this.spinner.hide();
        this.GetCompanyList();
      });
    }
  }

 

  public GetCompanyList() {
    //this.spinner.show();
    this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
      this.companies = response;
      //this.spinner.hide();
      setTimeout(() => {this.dtTrigger.next();}, 300);
     
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
    this.GetCompanyListNew();
  }

  public GetCompanyListNew() {
    //this.spinner.show();
    this.CompanyService.GetCompanyListNew(this.queryParam).subscribe((response: DataOutputModel) => {
      this.companyList = response.items;
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
    this.GetCompanyListNew();
  }

  onPageSizeChange(): void {
    this.queryParam.pageSize = +this.queryParam.pageSize
    this.queryParam.maxPageSize = +this.queryParam.pageSize
    this.GetCompanyListNew();
  }

  searchtable(){
    this.GetCompanyListNew();
  }

  SavecompHighlight(id: number): void {
    sessionStorage.setItem('editedCompRowId', id.toString());
  }


}
