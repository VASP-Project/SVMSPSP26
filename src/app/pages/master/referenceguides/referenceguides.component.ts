import { forEach } from 'jszip';
//import { ReferenceCategories } from './../referencecategorieslist/referencecategories';
import { async } from '@angular/core/testing';
import { Component, OnInit, ViewChild, ElementRef, Type, TemplateRef } from '@angular/core';
import { ReferenceGuides, linkModel, Refcat } from '../referenceguides';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgForm } from '@angular/forms';
import { ReferenceguidesService } from './referenceguides.service';
import { catchError } from 'rxjs/operators';
import { RemedialTraining } from '../remedialtraining';
import { Subject } from 'rxjs';
import { element } from 'protractor';
import { FormCanDeactivate } from '@app/_helpers/form-can-deactivate/form-can-deactivate';
import { Role } from '@app/pages/user/user';
import { UserService } from '@app/_services/user.service';
import { ReferenceCategories } from '../referencecategorieslist/referencecategories';
import { ReferenceCategoriesServiceService } from '../referencecategorieslist/reference-categories-service.service';
import { files } from 'jszip';
import { type } from 'os';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
//import { ReferenceCategoriesServiceService } from './reference-categories-service.service';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-referenceguides',
  templateUrl: './referenceguides.component.html',
  styleUrls: ['./referenceguides.component.scss']
})
export class ReferenceguidesComponent extends FormCanDeactivate implements OnInit {
  updates: ReferenceGuides = new ReferenceGuides();
  CategoryInfo: ReferenceCategories = new ReferenceCategories();
  allReferenceCategoriesList: ReferenceCategories[];
  user: any;
  files: string[] = [];
  referenceGuides: ReferenceGuides[];
  showBtn = -1;
  isStaffAdmin: boolean = false;
  isDirty: boolean = false;
  showTable: boolean = false;
  roleList: Role[];
  rolename: string = "";
  referenceCategoryId: number;
  isLink: boolean = false;
  linkname: string = "";
  link: linkModel = new linkModel();
  linkList: linkModel[] = [];
  viewStaffAdmin: boolean = false;
  viewAuthsigner: boolean = false;
  uniqueArr: any[] = []
  ViewIssuer: boolean = false;
  ViewTSAUser: boolean = false;
  ViewTenant: boolean = false;
  selectedCategory = [];
  dropdownSettings = {};
  dropdownSettings2 = {};
  isReferences: boolean = true;
  referenceCategory: ReferenceGuides[];
  selectall: ReferenceCategories;
  collapseall: ReferenceCategories;
  referenceSortOrderId: ReferenceCategories;
  isSelected: boolean = true;
  public on = false;
  public off = true;
  selectedFileId: any;
  closeAccordian: string = "";
  viewdocument: boolean = false;
  expandAll: boolean = false;
  RefcatList: Refcat[] = [];
  @ViewChild('input', { static: false }) myInputVariable: ElementRef;
  dtOptions: DataTables.Settings = {};
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  orderdataTable: any[];
  oldreferenceCategory: number
  oldsortorder: number
  @ViewChild('chatBox') private chatBox!: ElementRef;
  userInput = '';
  closeResult: string = "";
  messages: { text: string | SafeHtml; sender: 'user' | 'bot' }[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _userService: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private referenceCategoriesServiceService: ReferenceCategoriesServiceService, private appURL: AppConfigService,
    private referenceGuidesServices: ReferenceguidesService, private modalService: NgbModal, private location: Location, private http: HttpClient, private sanitizer: DomSanitizer
  ) {
    super();

  }

  async ngOnInit() {


    this.GetRoleList();

    //Get user form local storage
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta') {
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
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
    var refCatid: number = this.route.snapshot.pathFromRoot[1].queryParams['refCatid'];

    if (+refCatid == 0) {
      this.referenceCategoryId = 0
      this.getRegerenceGuides({ id: 0, referenceSortOrderId: 0 });
    }
    else if (+refCatid > 0) {
      this.referenceCategoryId = +refCatid
      this.GetSortorderId(refCatid)
      // this.getRegerenceGuides({id:0,referenceSortOrderId:0});

    }
    else {
      this.showTable = false
      //this.getRegerenceGuides({id:-1,referenceSortOrderId:0});
    }
    this.GetReferenceCategoriesList();
    this.getRefGuide();

  }

  chatInput: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  openChatModal(fileId: string) {
    // Optional: load previous messages or set context
    console.log('Start chat for file ID:', fileId);
  }

  // sendMessage() {
  //   if (this.chatInput.trim()) {
  //     this.chatMessages.push({ sender: 'You', text: this.chatInput });
  //     // Simulate AI reply
  //     this.chatMessages.push({ sender: 'AI', text: 'This is a response from AI.' });
  //     this.chatInput = '';
  //   }
  // }
  viewreference(id: number) {
    let navigationExtras: any = {
      queryParams: {
        'referenceId': id,
        'isEdit': 1,
        'isView': 1
      }
    };

    //this.router.navigate(['/admin/referenceguideedit'], navigationExtras);
  }

  private GetSortorderId(id: number) {
    //this.spinner.show();
    this.referenceGuidesServices.GetSortorderId(id).subscribe(
      (refcat: ReferenceCategories) => {

        this.getRegerenceGuides({ id: +id, referenceSortOrderId: refcat[0].id });

        //this.spinner.hide();
      }
    );
  }
  GetReferenceCategoryGuidesList() {
    // this.spinner.show();
    // $('#dt1').DataTable().destroy();
    this.referenceGuidesServices.GetReferenceCategoryGuidesList(this.referenceCategoryId).subscribe((response: ReferenceGuides[]) => {
      this.referenceGuides = response;
      //this.referenceCategory = response.ReferenceCategory.
      this.dtTrigger.next();
      //this.spinner.hide();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
    });
  }
  getRefGuide() {
    this.referenceGuidesServices.GetReferenceCategoryGuidesList(0).subscribe((response: ReferenceGuides[]) => {
      // console.log(response);

      this.referenceGuides = response;

      this.uniqueArr = [... new Set(this.referenceGuides.map(data => data.referenceCategory))]
      this.uniqueArr = this.uniqueArr.sort((a, b) => (a < b ? -1 : 1));
      this.uniqueArr.forEach(element => {
        let obj = new Refcat();
        obj.categoryName = element;
        if (this.user.rolename === 'Issuer') {
          obj.referencelist = response.filter(x => x.referenceCategory == element && x.viewIssuer == true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
          this.RefcatList.push(obj);
        }
        if (this.user.rolename === 'TSA User') {
          obj.referencelist = response.filter(x => x.referenceCategory == element && x.viewTSAUser == true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
          this.RefcatList.push(obj);
        }
        if (this.user.rolename === 'AuthSigner') {
          obj.referencelist = response.filter(x => x.referenceCategory == element && x.viewAuthsigner == true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
          this.RefcatList.push(obj);
        }
        if (this.user.rolename === 'Tenant') {
          obj.referencelist = response.filter(x => x.referenceCategory == element && x.viewTenant == true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
          this.RefcatList.push(obj);
        }
        if (this.user.rolename === 'Security') {
          obj.referencelist = response.filter(x => x.referenceCategory == element && x.viewSecurity == true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
          this.RefcatList.push(obj);
        }
      });
      //this.spinner.hide();

    });

  }
  getRegerenceGuides(referenceCategory) {

    //this.spinner.show();
    this.showTable = true
    $('#dt1').DataTable().destroy();
    this.oldreferenceCategory = referenceCategory.id
    this.oldsortorder = referenceCategory.referenceSortOrderId
    if (referenceCategory.id == null) {
      referenceCategory.id = '';
    }
    if (referenceCategory.referenceSortOrderId == null) {
      referenceCategory.referenceSortOrderId = 2;
    }
    if (this.user.rolename === 'StaffAdmin') {
      this.orderdataTable = [0, 'desc'];
      if (referenceCategory.referenceSortOrderId == 2) {
        this.orderdataTable = [2, 'asc'];
      }
      else if (referenceCategory.referenceSortOrderId == 3) {
        this.orderdataTable = [3, 'asc'];
      }

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 100,
        order: this.orderdataTable,//[referenceSortOrderId -1 < 0? 0 : referenceSortOrderId -1,'asc'],
        columnDefs: [
          { targets: 0, type: 'date' },
        ]
      };
    }
    else {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 100,
        order: [0, 'asc'],//[referenceSortOrderId -1 < 0? 0 : referenceSortOrderId -1,'asc'],
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
        this.referenceGuides = response.filter(x => x.viewIssuer === true).sort((a, b) => (a.comments < b.comments ? -1 : 1));
      }
      if (this.user.rolename === 'TSA User') {
        this.referenceGuides = response.filter(x => x.viewTSAUser === true).sort((a, b) => (a.comments < b.comments ? -1 : 1));

      }
      if (this.user.rolename === 'AuthSigner') {
        this.referenceGuides = response.filter(x => x.viewAuthsigner === true).sort((a, b) => (a.comments < b.comments ? -1 : 1));

      }
      if (this.user.rolename === 'Tenant') {
        this.referenceGuides = response.filter(x => x.viewTenant === true).sort((a, b) => (a.comments < b.comments ? -1 : 1));

      }
      if (this.user.rolename === 'Security') {
        this.referenceGuides = response.filter(x => x.viewSecurity === true).sort((a, b) => (a.comments < b.comments ? -1 : 1));

      }
      //this.spinner.hide();
      this.dtTrigger.next();
      return this.referenceGuides;

    });
  }
  replaceLineBreak(slink: string) {
    //  return s && s.replace('#', '<br />');
    return slink.split('##').join('<br />');

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


    this.updates.comments = "";
    this.linkname = "";
    this.linkList = [];
    this.files = [];
    this.rolename = "";
    this.referenceCategoryId;
    this.getRegerenceGuides({
      id: 0, referenceSortOrderId: 0,
    });

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


  onRoleChange(event: Event) {
    //this.rolename = event.target['options'][event.target['options'].selectedIndex].text;
    //alert(this.rolename);

    if (this.rolename === 'AuthSigner') {
      this.viewStaffAdmin = true;
      this.viewAuthsigner = true;
      this.ViewIssuer = true;
      this.ViewTSAUser = true;
      this.ViewTenant = true;
    }
    if (this.rolename === 'Issuer') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = true;
      this.ViewTenant = false;
    }
    if (this.rolename === 'StaffAdmin') {
      this.viewStaffAdmin = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = false;
      this.ViewTSAUser = false;
      this.ViewTenant = false;
    }

    if (this.rolename === 'TSA User') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = true;
      this.viewAuthsigner = false;
      this.ViewIssuer = false;
      this.ViewTenant = false;
    }

    if (this.rolename === 'Tenant') {
      this.viewStaffAdmin = true;
      this.ViewTSAUser = false;
      this.viewAuthsigner = false;
      this.ViewIssuer = false;
      this.ViewTenant = true;
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
    }, (error: any) => {
      console.log("error list");
      //this.spinner.hide();
    });
  }
  addFile(files) {
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
      //var fs = file.name.split('.').pop()      
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
          id: this.oldreferenceCategory, referenceSortOrderId: this.oldsortorder,
        });
      });
    }

  }



  chatwithai(id: number) {
    this.referenceGuidesServices.fileuploadtoAi(id, "Summerize all").subscribe(
      data => {
        console.log(data)
        this.toastr.success("File is Uploaded")


      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
    ${error.message}`, 'Error');
      });
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
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
    ${error.message}`, 'Error');
      });
  }


  public GetReferenceCategoriesList() {
    this.referenceCategoriesServiceService.GetReferenceCategoriesList().subscribe((response: ReferenceCategories[]) => {
      if (this.user.rolename == "StaffAdmin") {
        this.selectall = {
          id: 0, referenceCategory: "Select All", referenceSortOrderId: 0, sortOrder: " ", isSelected: false
        }
        this.allReferenceCategoriesList = response;
        this.allReferenceCategoriesList.unshift(this.selectall)
      }
      else {
        //   this.selectall={
        //   id: 0,referenceCategory:"Expand All",referenceSortOrderId:0,sortOrder:" ",isSelected:false
        //   }    
        this.allReferenceCategoriesList = response;
        // this.allReferenceCategoriesList.unshift(this.selectall)


      }
    }, (error: any) => {
      console.log("error list");
    });
  }


  //View File
  viewFile(id: number, fileName: string) {
    this.closeAccordian = fileName;
    //check file is link
    if (fileName.search('href') === -1) {
      //view for below extensions
      this.referenceGuidesServices.getAttachment(id).subscribe(
        data => {
          if ((fileName.split('.').pop() == 'jpg'
            || fileName.split('.').pop() == 'png'
            || fileName.split('.').pop() == 'jpeg'
            || fileName.split('.').pop() == 'gif'
            || fileName.split('.').pop() == 'pdf'
            || fileName.split('.').pop() == 'xls'
            || fileName.split('.').pop() == 'xlsx') && this.width > 768) {
            const objectURL = window.URL.createObjectURL(data);
            window.open(objectURL, '_system');
            setTimeout(function () {
              // For Firefox it is necessary to delay revoking the ObjectURL
              window.URL.revokeObjectURL(objectURL);
            }, 100);
          }
          else {
            //if file extension is not matched to above extensions it downloads file
            const blob = new Blob([data], { type: data.type });
            if (window.navigator) {
              // for Non-IE (chrome, firefox etc.)
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.hidden = true;
              const fileUrl = URL.createObjectURL(blob);
              a.href = fileUrl;
              a.download = fileName;
              a.click();
              URL.revokeObjectURL(a.href);
              a.remove();
            }

            // IE doesn't allow using a blob object directly as link href
            //instead it is necessary to use msSaveOrOpenBlob
            // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //   var newBlob = new Blob([data], { type: data.type })
            //   window.navigator.msSaveOrOpenBlob(newBlob, fileName);
            //   return;
            // }
          }
        })
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  close() {
    this.modalService.dismissAll();
  }
  findreferenceurl(referenceguide) {
    var splitted = referenceguide.split("<a href='", 2);
    if (splitted.length > 1) {
      var splitted2 = splitted[1].split("' target='", 2);
      if (splitted2.length > 0) {
        return splitted2[0];
      }
    }

    return referenceguide
  }


  newtabopen(fileName: any) {
    window.open(
      this.findreferenceurl(fileName), "_system");

  }
  getRefByType(type) {
    return this.referenceGuides.filter(x => x.referenceCategory == type)
  }
  public get width() {
    return window.innerWidth;

  }

  openModalPeri(templatePerimeter: TemplateRef<any>, id: any) {
    //this.showPerimeterDesc = true;
    this.selectedFileId = id;
    this.modalService.open(templatePerimeter, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  FormatResponseToMarkdown(rawResponse: string): string {
    const sb: string[] = [];
    const lines = rawResponse.split('\n');

    for (let line of lines) {
      if (line.startsWith("**") && line.endsWith("**")) {
        sb.push(`### ${line.replace(/\*\*/g, '').replace(/:$/, '').trim()}`);
        sb.push('');
      } else if (line.trimStart().startsWith("- ")) {
        sb.push(line);
      } else if (line.trim() !== '') {
        sb.push(line);
      } else {
        sb.push('');
      }
    }

    return sb.join('\n');
  }

  sendMessage() {
    const userMsg = this.userInput.trim();
    if (!userMsg) return;

    this.messages.push({ sender: 'user', text: userMsg });


    this.referenceGuidesServices.fileuploadtoAi(this.selectedFileId, userMsg).subscribe(
      data => {
        console.log(data)
        const markdown = this.FormatResponseToMarkdown(data.aiResponse); // <--- transform to markdown
        // Convert markdown to HTML        
        const html = marked(markdown);

        //const sanitizedHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
        this.messages.push({ sender: 'bot', text: html });
        this.toastr.success("File is Uploaded and analyzed.");
      },
      (error: any) => {
        this.toastr.error(
          `Error occurred while fetching attachment. <br />
    ${error.message}`, 'Error');
      });

    this.userInput = '';
  }


  // goBackai() {
  //   this.location.back();
  // }
  private scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) { }
  }


}
