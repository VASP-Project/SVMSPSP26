import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataOutputModel, ReferenceCategories, ReferenceCategoryList } from './referencecategories';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReferenceCategoriesServiceService } from './reference-categories-service.service';
import { PagingHeader, QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';


@Component({
  selector: 'app-referencecategorieslist',
  templateUrl: './referencecategorieslist.component.html',
  styleUrls: ['./referencecategorieslist.component.scss']
})
export class ReferencecategorieslistComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  referenceCategories: ReferenceCategories[];
  queryParam: QueryStringParameters = new QueryStringParameters();
  referenceCategoryList : ReferenceCategoryList[];
    pageHeaders: PagingHeader = new PagingHeader()
    config: any;
    sortDir = 1;//1= 'ASE' -1= DSC
//  router: any;
 //ReferenceCategoriesServiceService: any;
  //toastr: any;
  user:any;
  sampleData: any = [] = [];
  displayTable: boolean = false;
  ReferenceCategoryFromDb: ReferenceCategories[];
  ReferenceCategory: ReferenceCategories[];
  //: any;
  
  constructor(private ref: ChangeDetectorRef, private toastr: ToastrService, private appURL: AppConfigService, private spinner: NgxSpinnerService, private referenceCategoriesServiceService: ReferenceCategoriesServiceService,
    private router: Router) { }

  ngOnInit(): void {
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
    this.GetReferenceCategoriesList();
     this.dtOptions = {
         pagingType: 'full_numbers',
         pageLength: 10,
         stateSave: true,
      stateDuration: -1,
     };

     const editedRowId = sessionStorage.getItem("editedRefRowId");

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
       sessionStorage.removeItem("editedRefRowId");
     }
    
  }
/*
  private processData() {

    const referenceSortOrderIdSeen = {};
    this.ReferenceCategory = this.ReferenceCategoryFromDb.sort((a, b) => {
      const referenceSortOrderIdComp = a.referenceSortOrderId.toString().localeCompare(b.referenceSortOrderId.toString());
      return referenceSortOrderIdComp; // ? violationTypeIdComp : a.county.localeCompare(b.county);
    }).map(x => {
      const referenceSortOrderIdSpan = referenceSortOrderIdSeen[x.referenceSortOrderId.toString()] ? 0 :
        this.ReferenceCategoryFromDb.filter(y => y.referenceSortOrderId.toString() === x.referenceSortOrderId.toString()).length;
        referenceSortOrderIdSeen[x.referenceSortOrderId.toString()] = true;
      return { ...x, referenceSortOrderIdSpan };
    });
  }*/
  
public GetReferenceCategoriesList() {
    //this.spinner.show();
    this.referenceCategoriesServiceService.GetReferenceCategoriesList().subscribe((response: ReferenceCategories[]) => {
        this.referenceCategories = response;
        this.dtTrigger.next();
        this.displayTable=true;
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
  this.GetReferenceCategoriesListNew();
}

public GetReferenceCategoriesListNew() {
  //this.spinner.show();
  this.referenceCategoriesServiceService.GetReferenceCategoriesListNew(this.queryParam).subscribe((response: DataOutputModel) => {
    this.referenceCategoryList = response.items;
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
  this.GetReferenceCategoriesListNew();
}

onPageSizeChange(): void {
  this.queryParam.pageSize = +this.queryParam.pageSize
  this.queryParam.maxPageSize = +this.queryParam.pageSize
  this.GetReferenceCategoriesListNew();
}

searchtable(){
  this.GetReferenceCategoriesListNew();
}



/*
public GetReferenceCategoriesList() {
  this.sampleData = [];
  this.displayTable = false;
  //this.spinner.show();
  this.referenceCategoriesServiceService.GetReferenceCategoriesList().subscribe((response: ReferenceCategories[]) => {
    this.ReferenceCategoryFromDb = response;
    // this.dtTrigger.next();
    //this.spinner.hide();
    /// this.buildDtOptions(response)
    this.displayTable = true;
    this.ref.detectChanges();
    this.dtTrigger.next();
    this.processData();

  });
}
*/
/*
deleteReferenceCategory(id) {
  var ans = confirm("Are you sure you want to delete this Reference Category?");
  if (ans == true) {
      //this.spinner.show();
     
      this.referenceCategoriesServiceService.DeleteCategoryById(id).subscribe((response: Response) => {
          if (response.statusText == "Fail") {
              this.toastr.success('There was some error deleting the record. Please try again later');
          }
          else {
              this.toastr.success('Regerence Category deleted successfully');
          }
          //this.spinner.hide();
          $('#dt1').DataTable().destroy();
          this.GetReferenceCategoriesList();
      });
  }
}*/
deleteReferenceCategory(id) {

  var ans = confirm("Are you sure you want to delete this Reference Category?");
  if (ans == true) {
    //  $('#dt1').DataTable().destroy();
    //this.spinner.show();
    $('#dt1').DataTable().destroy();
    this.referenceCategoriesServiceService.DeleteCategoryById(id).subscribe((response: Response) => {
      if (response.statusText == "Fail") {
        this.toastr.success('There was some error deleting the record. Please try again later.');
      }
      else if (response.statusText === "Exists") {
        this.toastr.error('Reference Category not deleted. It is attached to a Reference record');
      }
      else {
        this.toastr.success('Reference Category deleted successfully');
      }
      //this.spinner.hide();
      this.GetReferenceCategoriesList();
    });
  }

}
viewreferencecategories(id: number) {
  let navigationExtras: any = {
      queryParams: {
          'referencescategoryId': id,
          'isEdit': 1,
          'isView': 1
      }
  };
  this.router.navigate(['/admin/referencecategoriesedit'], navigationExtras);
}
ngOnDestroy(): void {
  // Do not forget to unsubscribe the event
  this.dtTrigger.unsubscribe();
}
onEditClick(id: number): void {
  sessionStorage.setItem('editedRefRowId', id.toString());
}
}
