//import { ReferenceCategories } from './../referencecategories';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ReferenceCategories, ReferenceSortOrders } from '../referencecategories';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferenceCategoriesServiceService } from '../reference-categories-service.service';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-referencecategoriesedit',
  templateUrl: './referencecategoriesedit.component.html',
  styleUrls: ['./referencecategoriesedit.component.scss']
})
export class ReferencecategorieseditComponent implements OnInit {
  category = new ReferenceCategories();
  view: boolean = false;
  oldcategoryname:string="";
  user:any;
  sortorder: ReferenceSortOrders = new ReferenceSortOrders();
  allSortOrdersNames: ReferenceSortOrders[];
  oldSType: number = 0;
   oldorderName: string = "";

  
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService, 
    private referenceCategoriesServiceService: ReferenceCategoriesServiceService, private appURL: AppConfigService,
    private router: Router, private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
        var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
        if (isEdit == "1") {
            var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
            var referencescategoryId: number = this.route.snapshot.pathFromRoot[1].queryParams['referencescategoryId'];
           this.editreferenceCategory(referencescategoryId, isView);
           
        }
        this.GetSortOrderList()
  }
  editreferenceCategory(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetReferenceCategoryById(id);
}

private GetReferenceCategoryById(id: number) {
  //this.spinner.show();
  this.referenceCategoriesServiceService.GetReferenceCategoryById(id).subscribe
  ((response: ReferenceCategories) => {
      this.category = response;
      this.oldcategoryname = response.referenceCategory;
      this.oldSType=response.referenceSortOrderId;
      this.category.id = id;
      
      //this.spinner.hide();

  });

}

  onSubmit(formData: NgForm) {
    var refcategory = {
        Id: formData.value.id,
        ReferenceCategory: formData.value.referenceCategory,
        ReferenceSortOrderId :formData.value.referenceSortOrderId

    };
    //this.spinner.show();
    if (this.oldcategoryname.toUpperCase().trim() != this.category.referenceCategory.toUpperCase().trim()) 
    {
      this.referenceCategoriesServiceService.CheckCategoryExists(this.category.referenceCategory).subscribe((response) =>
       {
        if (response) {
          this.toastr.error('Reference Category already exist. Try other Category', 'Information');
          this.category.referenceCategory = this.oldcategoryname;
         // this.category.referenceSortOrderId = this.oldSType;
          //this.spinner.hide();
        }
        else {
          this.savecategory(refcategory, formData);
        }
      }, (error:any)=> {
        this.toastr.error(' Reference Category and Sortorder not saved', 'Information');
        //this.spinner.hide();
      });
    }
    else {
      this.savecategory(refcategory, formData);
    }
     
}
/*bindReferenceCategoryDetails() {
  var referenceCategoryDetails = {
    id:this.category.id,
    referenceCategory: this.category.referenceCategory,
    referenceSortOrderId: this.category.referenceSortOrderId,
   
  
  }
    return referenceCategoryDetails;
  }
*/

savecategory(refcategory, formData: NgForm) {
  this.referenceCategoriesServiceService.AddEditReferenceCategories(
    refcategory
  ).subscribe(response => {
    this.toastr.success("Category Saved Successfully");
    formData.reset();
    //this.spinner.hide();
    this.router.navigate(["/admin/referencecategories"]);
  });
}

hideaddform() {
  this.router.navigate(['/admin/referencecategories']);
}

public GetSortOrderList()
  {
    this.referenceCategoriesServiceService.GetSortOrderList().subscribe((response : ReferenceSortOrders[]) => {
      this.allSortOrdersNames = response;  
      this.allSortOrdersNames.sort((a,b) => a.sortOrder > b.sortOrder ? 1 : -1)         
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
      //this.spinner.hide();
    });    
  }

//   private GetSortOrderbyId(id: number) {
//     //this.spinner.show();
//     this.referenceCategoriesServiceService.GetSortOrderbyId(id).subscribe((response: ReferenceSortOrders) => {
//         this.sortordr = response
//         this.sortordr.id = id;
//         //this.oldViolationName = response.violationType;
//         //this.spinner.hide();

//     });

// }


 }


