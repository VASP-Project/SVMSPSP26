import { fileInfoModel, ReferenceGuides } from './../../referenceguides';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
//import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';

import { catchError } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { element } from 'protractor';
import { FormCanDeactivate } from '@app/_helpers/form-can-deactivate/form-can-deactivate';
import { Role } from '@app/pages/user/user';
import { UserService } from '@app/_services/user.service';
import { linkModel } from '../../referenceguides';
import { ReferenceCategories } from '../../referencecategorieslist/referencecategories';
import { ReferenceCategoriesServiceService } from '../../referencecategorieslist/reference-categories-service.service';
import { ReferenceguidesService } from '../referenceguides.service';
import { AppConfigService } from '@app/_services/appconfigservice ';



@Component({
  selector: 'app-referenceguideedit',
  templateUrl: './referenceguideedit.component.html',
  styleUrls: ['./referenceguideedit.component.scss']
})
export class ReferenceguideeditComponent implements OnInit {
  updates: ReferenceGuides = new ReferenceGuides();
  CategoryInfo : ReferenceCategories=new ReferenceCategories();
  allReferenceCategoriesList: ReferenceCategories[];
  user: any;
  files: string[] = [];
  
  referenceGuides: ReferenceGuides[];
  showBtn = -1;
  isStaffAdmin: boolean = false;
  isDirty: boolean = false;
  //showTable: boolean = true;
  roleList: Role[];
  rolename: string = "";
  referenceCategoryId:number;
  isLink: boolean = false;
  reflink:boolean = false;
  linkname: string = "";
  link: linkModel = new linkModel();
  linkList: linkModel[] = [];
  viewStaffAdmin: boolean = false;
  viewAuthsigner: boolean = false;
  ViewIssuer: boolean = false;
  ViewTSAUser: boolean = false;
  ViewTenant:boolean = false;
  viewSecurity:boolean = false;
  selectedCategory = [];
  dropdownSettings = {};
  dropdownSettings2 = {};
  isReferences: boolean = true;
  referenceCategory:ReferenceGuides[];
  selectall:ReferenceCategories;
  view: boolean = false;
  guide = new ReferenceGuides();
  oldreferenceCategory: number = 0;
  fileName:string;
  showImage:boolean = false;
  showFile:boolean = false;
  isDocumentChange:boolean = false;
  referenceLink: string = "";
  
  public referenceImg: fileInfoModel[] = [];
  public referenceFile: fileInfoModel[] = [];
  
  
  

  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  dtOptions: DataTables.Settings = {};
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  orderdataTable:any [];
  referenceId: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _userService: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private referenceCategoriesServiceService: ReferenceCategoriesServiceService,  private appURL: AppConfigService,
    private referenceGuidesServices: ReferenceguidesService) {
    //super();
  }

 async ngOnInit() {

    this.GetRoleList();
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
        var referenceId: number = this.route.snapshot.pathFromRoot[1].queryParams['referenceId'];
       this.editreferenceGuide(referenceId, isView);
      //  this.GetReferenceGuideById(referenceId)
       
    }
    

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      order: [],
      columnDefs: [
        { targets: 0, type: 'date' }]
    };
    if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;
    }
    this.updates.createdBy = this.user.id;
 //   this.getRegerenceGuides({id:-1,referenceSortOrderId:0});
    this.GetReferenceCategoriesList();
    // this.GetReferenceCategoryGuidesList();
  }
  editreferenceGuide(id, mode) {
    if (mode == "1")
        this.view = true;
    else
        this.view = false;
    this.GetReferenceGuideById(id);
}

findreferenceurl(referenceguide ){
  var splitted = referenceguide.split("<a href='", 2);
  if (splitted.length > 1) {
    var splitted2 = splitted[1].split("' target='", 2);
    if (splitted2.length > 0) {
      return splitted2[0];
    }
  }
  
  return referenceguide
}

private GetReferenceGuideById(id: number) {
  //this.spinner.show();
  this.referenceGuidesServices.GetReferenceGuideById(id).subscribe
  ((response: ReferenceGuides) => {
    
    this.updates=response as ReferenceGuides
    this.referenceId = response.id
   
    this.rolename = response.rolename
    this.ViewIssuer = response.viewIssuer
    this.ViewTSAUser = response.viewTSAUser
    this.viewAuthsigner = response.viewAuthsigner
    this.viewStaffAdmin = response.viewStaffAdmin
    this.viewSecurity = response.viewSecurity
    this.referenceCategoryId = response.referenceCategoryId
    this.updates.fileName = response.fileName
    this.ViewTenant = response.viewTenant
   // this.linkname = response.fileName
    if (response.fileName.toLowerCase().split('.', 2)[1] == 'png' || response.fileName.toLowerCase().split('.', 2)[1] == 'jpg' || response.fileName.toLowerCase().split('.', 2)[1] == 'jpeg' || response.fileName.toLowerCase().split('.', 2)[1] == 'gif')
    {
      this.showImage = true
    }
    if (response.fileName.toLowerCase().split('.', 2)[1]!= 'png' && response.fileName.toLowerCase().split('.', 2)[1] != 'jpg' && response.fileName.toLowerCase().split('.', 2)[1] != 'jpeg' && response.fileName.toLowerCase().split('.', 2)[1] != 'gif')
    {
      this.showFile = true
    }

    if (response.fileName.startsWith("<a href",0))
    {
      this.isLink = true
      this.linkname = this.findreferenceurl(response.fileName)
    }
    else
    {
      this.isLink=false
    }
     
  });

}

  // GetReferenceCategoryGuidesList() {
  //   // this.spinner.show();
  //  // $('#dt1').DataTable().destroy();
  //   this.referenceGuidesServices.GetReferenceCategoryGuidesList(this.referenceCategoryId).subscribe((response: ReferenceGuides[]) => {
  //     this.referenceGuides = response;
  //     this.dtTrigger.next();
  //     //this.spinner.hide();
  //   }, (error:any)=> {
  //     //this.spinner.hide();
  //     console.log("error list");
  //   });
  // }
  getRegerenceGuides(referenceCategory) {
    //this.spinner.show();
    $('#dt1').DataTable().destroy();
    if(referenceCategory.id == null){
      referenceCategory.id = '';
   }
   if (this.user.rolename === 'StaffAdmin'){

   this.orderdataTable=[0,'desc'];
   if (referenceCategory.referenceSortOrderId==2){
    this.orderdataTable=[2,'asc'];
   }
   else
   if (referenceCategory.referenceSortOrderId==3){
    this.orderdataTable=[3,'asc'];
   }
   this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 100,
    order:this.orderdataTable,//[referenceSortOrderId -1 < 0? 0 : referenceSortOrderId -1,'asc'],
    columnDefs: [
      { targets: 0, type: 'date' },
    ]      
  };}
  else{
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 100,
      order:[0,'asc'],//[referenceSortOrderId -1 < 0? 0 : referenceSortOrderId -1,'asc'],
      columnDefs: [
        { targets: 0, type: 'date' },
        
      ]      
    };
    }
    this.referenceGuidesServices.GetReferenceCategoryGuidesList(referenceCategory.id).subscribe((response: ReferenceGuides[]) => {
      // console.log(response);
      this.referenceGuides = response;
      if (this.user.rolename === 'StaffAdmin') {
        this.referenceGuides = response.filter(x => x.viewStaffAdmin === true);
      }
      if (this.user.rolename === 'Issuer') {
        this.referenceGuides = response.filter(x => x.viewIssuer === true);
      }
      if (this.user.rolename === 'TSA User') {
        this.referenceGuides = response.filter(x => x.viewTSAUser === true);
      }
      if (this.user.rolename === 'AuthSigner') {
        this.referenceGuides = response.filter(x=>x.viewAuthsigner === true);

      }
      if (this.user.rolename === 'Tenant') {
        this.referenceGuides = response.filter(x=>x.viewTenant === true);

      }
      if (this.user.rolename === 'Security') {
        this.referenceGuides = response.filter(x=>x.viewSecurity === true);

      }
      //this.spinner.hide();
      this.dtTrigger.next();
    });

  }

  replaceLineBreak(slink: string) {
    //  return s && s.replace('#', '<br />');
    return slink.split('##').join('<br />');

  }
  addRow() {
    //this.newDynamic = { typeofRemedialTraining: "" };
    // this.newDynamic.typeofRemedialTraining="";
    this.link = new linkModel();
    // this.link.id = index;
    this.link.name = this.linkname.toString().trim();
    if (this.linkname.toString().trim() == "") {
      this.toastr.warning("Please enter valid link", '', { closeButton: true });

    } else {
      this.linkList.push(this.link);
      // alert(this.linkname+" "+this.linkList.length+" "+index);
      // console.log(this.linkList);
      this.linkname = "";
    }
    return true;
  }
  CheckedStatus(status) {
    if (status == 'link') {
      this.isLink = true;
    }
    else {
      this.isLink = false;
    }
    //alert(this.isLink);
  }

  deleteRow(index, id) {
    // if (this.linkList.length === 1) {
    //   // this.toastr.error("Can't delete the row when there is only one row", 'Warning');  
    //   return false;
    // } else {
    // this.isDirty = true;
    this.linkList.splice(index, 1);
    // if (id != undefined) {
    //   this.linkList = this.linkList + "," + id;
    // }

    //this.deletedTrainings.push(index);
    return true;
    // }
  }
  addUpdate(updateForm: NgForm) {
    //Add Update here
    // console.log(this.linkList);
    if (updateForm.value.comment == "") {
      this.toastr.warning("Please enter comment to add refrence guides!", '', { closeButton: true });
    }
    else if (this.files.length <= 0 && !this.isLink && this.fileName =='') {
      this.toastr.warning("No document are attached. Please attach document", '', { closeButton: true });
    }
    else if (this.isLink && this.linkList.length === 0) {
      this.toastr.warning("No links are added. Please add link(s)", '', { closeButton: true });
    }
    else if (this.referenceCategoryId ===0) {
      this.toastr.warning("Please select Category to add refrence guides", '', { closeButton: true });
    }
    else {
      var refGuidesUpdate = {
        id:this.updates.id, 
        //id: updateForm.value.id,
        //id:updateForm.value.referenceId,
        createdBy: this.updates.createdBy,
        comments: updateForm.value.comment,
        files: this.files,
        viewStaffAdmin: this.viewStaffAdmin,
        viewAuthsigner: this.viewAuthsigner,
        ViewIssuer: this.ViewIssuer,
        ViewTSAUser: this.ViewTSAUser,
        viewSecurity: this.viewSecurity,
        Rolename: this.rolename,
        ReferenceCategoryId:this.referenceCategoryId,
        ViewTenant:this.ViewTenant
      };
      this.linkname = '';
      this.linkList.forEach(elm => {
        this.linkname = this.linkname + "<a href='" + elm.name + "' target='_blank' >" + elm.name + "</a>##";
      });
      // alert(this.linkname);
      //this.spinner.show();
      this.referenceGuidesServices.AddReferenceGuides(refGuidesUpdate, this.files, this.linkname).subscribe((response: Response) => {
        //this.spinner.hide();
        // alert(response);
        this.resetIsDirtyFlag();
        this.updates.comments = "";
        this.linkname = "";
        this.linkList = [];
        //this.showTable = true;
        this.files = [];
        //this.GetReferenceGuideById(refGuidesUpdate.id)
       //this.referenceCategory=""
    //    this.getRegerenceGuides({
    //     id:0,referenceSortOrderId:0,
    // });
    this.router.navigate(["/admin/referenceguides"],{
    queryParams: {
      refCatid:this.referenceCategoryId
    }
  });
      }, (error:any)=> {
           
        console.log("Here");
        console.log(error);
        //this.spinner.hide();
      });
    }
  }
  
  addReference() {
    // this.router.navigate(['referenceguideadd']);
   // $('#dt1').DataTable().destroy();
    this.dtTrigger = new Subject();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [],
      columnDefs: [
        { targets: 0, type: 'date' },]
    };
   // this.showTable = false;
    this.updates.comments = "";
    this.linkname = "";
    this.linkList = [];
    this.files = [];
    this.rolename = "";
    this.referenceCategoryId = null;
    
    this.getRegerenceGuides({
      id:0,referenceSortOrderId:0,
  });
  }
  goBack() {
   // $('#dt1').DataTable().destroy();
    this.dtTrigger = new Subject();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [],
      columnDefs: [
        { targets: 0, type: 'date' },]
    };

    //this.showTable = true;
    this.updates.comments = "";
    this.linkname = "";
    this.linkList = [];
    this.files = [];
    this.rolename = "";
    this.referenceCategoryId;
    this.getRegerenceGuides({
      id:0,referenceSortOrderId:0,
  });

  }

  onRoleChange(event: Event) {
    //this.rolename = event.target['options'][event.target['options'].selectedIndex].text;
    //alert(this.rolename);

    if (this.rolename === 'AuthSigner') {
      this.viewStaffAdmin = true;
      this.viewAuthsigner = true;
      this.ViewIssuer = true;
      this.ViewTSAUser = true;
      this.ViewTenant = false;
      this.viewSecurity = true;
    }
    if (this.rolename === 'Issuer') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = true;
      this.ViewTenant = false;
      this.viewSecurity = false;
    }
    if (this.rolename === 'StaffAdmin') {
      this.viewStaffAdmin = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = false;
      this.ViewTSAUser = false;
      this.ViewTenant = false;
      this.viewSecurity = false;
    }

    if (this.rolename === 'TSA User') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = false;
      this.ViewTenant = false;
      this.viewSecurity = false;
    }

    if (this.rolename === 'Tenant') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = true;
      this.ViewIssuer = true;
      this.ViewTenant = true;
      this.viewSecurity = true;
    }

    if (this.rolename === 'Security') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = true;
      this.ViewTenant = false;
      this.viewSecurity = true;
    }

    //alert(this.viewStaffAdmin + ' ' + this.viewAuthsigner + ' ' + this.ViewIssuer);
    // if()
    //     viewStaffAdmin:boolean=false;
    //   viewAuthsigner:boolean=false;
    //   ViewIssuer:boolean=false;
  }

  public GetRoleList() {
    //this.spinner.show();
    this._userService.GetAllRolesList().subscribe((response: Role[]) => {
      // this.roleList = response.filter(x => x.name != 'Superadmin');
      this.roleList = response;
      //this.spinner.hide();
    }, (error:any)=> {
      console.log("error list");
      //this.spinner.hide();
    });
  }
  addFile(files) {
    this.showImage = false;
    this.showFile = false;
    if (files.length === 0) {
      return;
    }
    for (let file of files) {
      var parts = file.name.split('.');
      if (parts.length <= 1) {
        this.toastr.error("File " + file.name + " is not valid file");
      }
      else {
        this.isDirty = true;

        this.files.push(file)
      }
           
      
    }
    this.myInputVariable.nativeElement.value = "";
  }

  removeFile(file) {
    var ans = confirm("Do you want to remove file '" + file.name + "'?");
    if (ans == true) {
      this.isDirty = true;

      this.files.splice(this.files.indexOf(file), 1)
    }
  }
  deleteFile2(showImage) {
    var ans = confirm("Do you want to remove file '" + this.showImage + "'?");
    if (ans == true) {
      this.isDirty = true;

      this.files.splice((showImage),1)
    }
  }

  deleteFile(id) {
    var ans = confirm("Do you want to remove file ?");
    if (ans == true) {
      this.isDirty = true;

      //this.spinner.show();
      $('#dt1').DataTable().destroy();
      this.referenceGuidesServices.deleteUpdateDocument(id).subscribe((response: Response) => {
        //this.spinner.hide();
        this.isDirty = false;
        this.getRegerenceGuides({
          id:0,referenceSortOrderId:0,
      });
      });
    }
  }
  setDirtyFlag() {
    this.isDirty = true;
  }

  resetIsDirtyFlag() {
    this.isDirty = false;
  }
  showUndoBtn(id, filePath) {

    this.downloadFile(id, filePath);
  }

  //Download file
  downloadFile(id: number, fileName: string) {
    this.referenceGuidesServices.getAttachment(id).subscribe(
      data => {
        this.toastr.success("File is Downloading....Please wait!!")

        const blob = new Blob([data], { type: data.type });
        // if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
        //   window.navigator.msSaveOrOpenBlob(blob, fileName);
        // } else { // for Non-IE (chrome, firefox etc.)
          var a = document.createElement("a");
          document.body.appendChild(a);
          a.hidden = true;
          var fileUrl = URL.createObjectURL(blob);
          a.href = fileUrl;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(a.href)
          a.remove();
        // }
      },
      (error:any)=> {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
    ${error.message}`, 'Error');
      });
  }

  
  public GetReferenceCategoriesList() {
    this.referenceCategoriesServiceService.GetReferenceCategoriesList().subscribe((response: ReferenceCategories[]) => {
      this.selectall={
        id: 0,referenceCategory:"Select All",referenceSortOrderId:0,sortOrder:" ",isSelected:false
    }    
      this.allReferenceCategoriesList = response;
      this.allReferenceCategoriesList.unshift(this.selectall)
    }, (error:any)=> {
      console.log("error list");
    });
  }

  //View File
  viewFile(id: number, fileName: string) {
    //check file is link
    if (fileName.search('href') === -1) {

      this.referenceGuidesServices.getAttachment(id).subscribe(
        data => {
          // IE doesn't allow using a blob object directly as link href
          //instead it is necessary to use msSaveOrOpenBlob
          // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //   var newBlob = new Blob([data], { type: data.type })
          //   window.navigator.msSaveOrOpenBlob(newBlob, fileName);
          //   return;
          // }
          const objectURL = window.URL.createObjectURL(data);
          window.open(objectURL, '_blank');
          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(objectURL);
          }, 100);
        },
        (error:any)=> {
          this.toastr.error(
            `Error occurred while fetching attachment. <br />
    ${error.message}`, 'Error');
        });
    }
  }
  onItemSelect(item: any) {
    this.allReferenceCategoriesList
    // console.log(item);
  }
  onSelectAll(items: any) {
    
    // console.log(items);
  }
  
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  } 
  
}