import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from '../company/company.service';
import { Company } from '../company';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from '@app/_services/appconfigservice ';
@Component({
  selector: 'app-companyedit',
  templateUrl: './companyedit.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyeditComponent implements OnInit {
  company = new Company();
  view: boolean = false;
  public imagePath;
  imgURL: any;
  public message: string;
  oldCompanyName:string = "";
  user:any
  constructor(private toastr:ToastrService,private spinner: NgxSpinnerService,private router: Router, private CompanyService: CompanyService, private route: ActivatedRoute, private appURL: AppConfigService,) { }


  ngOnInit() {
       //Get user form local storage
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
      var companyId: number = this.route.snapshot.pathFromRoot[1].queryParams['companyId'];
      this.editCompany(companyId, isView)
    }
  }

  editCompany(id, isView) {
    if (isView == "1")
      this.view = true;
    else
      this.view = false;
    this.GetcompanyById(id);
  }

  private GetcompanyById(id: number) {
    //this.spinner.show();
    this.CompanyService.GetCompanyById(id).subscribe((response: Company) => {
      this.company = response
      this.oldCompanyName = response.companyName;
      this.company.id = id;
      this.imgURL = this.company.companyLogo;          
      //this.spinner.hide();
    });
  }

  checkBoxChange(event) {
  this.company.isConcessionaire = event.target.checked;
}

  //Add User Submit
  onSubmit(formData: NgForm) {
    // var company = {
    //   Id: +formData.value.id,
    //   //CompanyName: encodeURIComponent(formData.value.companyName),
    //   CompanyName: formData.value.companyName,
    //   CompanyLogo: this.imgURL
    // };
    if(this.company.companyName.includes("*")){
      this.toastr.warning("Astrik (*) is not allowed in company name");
      return;
    }
    this.company.id = +this.company.id;
    this.company.isConcessionaire = this.company.isConcessionaire
    this.company.companyName = this.company.companyName.toUpperCase().trim()
    if(this.oldCompanyName.toUpperCase().trim() != this.company.companyName.toUpperCase().trim())
    {           
      this.CompanyService.CheckCompanyExists(this.company).subscribe((response) => {
        if (response) {
          this.toastr.error('Comapany name already exist. Try other Company name', 'Information');
          this.company.companyName = this.oldCompanyName;
          //this.spinner.hide();
        }
        else
        {
          this.company.companyLogo = this.imgURL 
          this.saveCompany(this.company, formData);
        }       
      }, (error:any)=> {
        this.toastr.error('Error Saving Company', 'Information');
        //this.spinner.hide();
      });
    } 
    else
    {
      this.company.companyLogo = this.imgURL 
      this.saveCompany(this.company, formData);
    }     
  }

  saveCompany(company:Company, formData: NgForm)
  {
    //this.spinner.show();
    this.CompanyService.AddEditCompany(company).subscribe((response) => {
      //this.spinner.hide();
      this.toastr.success('Record Saved Successfully');
      formData.reset();
      this.router.navigate(['/admin/company']);
    });
  }
  
  checkCompany()
  {    
    if(this.oldCompanyName != this.company.companyName)
    {
      this.CompanyService.CheckCompanyExists(this.company.companyName).subscribe((response) => {
        if (response) {
          this.toastr.error('Comapany name already exist. Try other Company name', 'Information');
          this.company.companyName = this.oldCompanyName;
        }       
      }, (error:any)=> {
        this.toastr.error('Comapany name already exist. Try other Company name', 'Information');
        //this.spinner.hide();
      });
    }   
  }

  //Hide Add form 
  hideaddform() {
    this.router.navigate(['/admin/company']);
  }


  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  async openImage(imgURL)
  {
    const base64 = await fetch(imgURL);
    const blobImage = (await base64).blob();
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById('myImg');
    var modalImg = (<HTMLImageElement> document.getElementById("img01"));
    const objectURL = window.URL.createObjectURL(await blobImage);
        modal.style.display = "block";
    // modalImg.src = image;
        modalImg.src = objectURL    
  }

  close()
  {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }
}
