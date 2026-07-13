import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PendingbadgeapplicantService } from './pendingbadgeapplicant.service';
import { PendingBadgeApplicants, SecurityClearanceStatus } from './pendingbadgeapplicants';
//import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { Cell, Row } from 'jspdf-autotable';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import { mergeScan } from 'rxjs/operators';

import { element } from 'protractor';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { Company } from '../master/company';
import { CompanyService } from '@app/pages/master/company/company.service'

@Component({
  selector: 'app-pendingbadgeapplicants',
  templateUrl: './pendingbadgeapplicants.component.html',
  styleUrls: ['./pendingbadgeapplicants.component.scss']
})
export class PendingbadgeapplicantsComponent implements OnInit {
  isStaffAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isAuthsigner: boolean = false;
  isIssuer: boolean = false;
  user!: any;
  pendingBadgeApplicants: PendingBadgeApplicants[] = [];
  dtOptions: any;
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  displayTable: boolean = false;
  datatableElement!: DataTableDirective;
  isChecked = false;
  header = [['COMPANY NAME (Organization Code)', 'APPLICANT LAST NAME', 'APPLICANT FIRST NAME', 'FINGERPRINT DATE', 'CLEARANCE DATE']];
  dataforPDF = [];
  dataPendingBadge = [];
  dataforExcel = [];
  footerContent = 'CLEARANCE DATE: The applicant must complete the badging process within 30 days of receiving a clearance date. Failure to complete the badging process within 30 days, to include security training & issuance, will require the applicant to be fingerprinted again before a badge can be issued. Should the 30-days period expire, an additional charge may be applicable for processing as additional security check.'
  footerContent1 = "BADGE APPLICATION/VALID GOVERNMENT-ISSUED PHOTO IDENTIFICATION/EMPLOYMENT ALIGIBILITY DOCUMENTS: The applicant must bring a completed badge application and 2 valid forms of identification, and acceptable Employment Eligibility Document(s) pursuant with US Citizenship and Immigration Services (USCIS) Form I-9, List of Acceptable Documents."
  headerArray = [];
  headerArrayExport = [];
  clearanceDateText: string = "";
  clearanceDetails: SecurityClearanceStatus[] = [];
  singleclearanceDetails: SecurityClearanceStatus[] = [];
  singleunapproveDetails: SecurityClearanceStatus[] = [];
  //clearanceData:PendingBadgeApplicants;
  clearanceData = new SecurityClearanceStatus();
  allCompanyList: Company[];
  allAuthSignerCompanyList: Company[];
  companyNames:string[]=[];   
  authSignerCompanyNames: string[] = []
  expiresDate: string
  infoMessage: string;

  constructor(private ref: ChangeDetectorRef,
    private pendingBadgeService: PendingbadgeapplicantService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private appURL: AppConfigService,
    private datePipe: DatePipe,
    private CompanyService: CompanyService,
  ) { }

  ngOnInit() {

    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      ordering: true,

      order: [],
      columnDefs: [
        {
        'targets': [4, 5,6,7,8],
        'type': "date",

      },
      { "orderable": false, "targets": 0 }],
      responsive: true,
      // dom: 'lBfrtip',     
            
    };

    var user = JSON.parse(sessionStorage.getItem("currentUser"));
    this.user = user;
    //alert(this.user.rolename);
    if (this.user.rolename == "StaffAdmin") {
      this.isStaffAdmin = true;

    }
    else if (this.user.rolename == "Superadmin") {
      this.isSuperAdmin = true;
      //this.GetPendingBadgeApplicantsList(0);
    }
    else if (this.user.rolename == "AuthSigner") {
      this.isAuthsigner = true;
      //   this.GetPendingBadgeApplicantsList(this.user.id);
    }
    else if (this.user.rolename == "Issuer") {
      this.isIssuer = true;
      //   this.GetPendingBadgeApplicantsList(this.user.id);
    }
    else {
      this.isStaffAdmin = false;
      // this.GetPendingBadgeApplicantsList(0);

    }
    this.GetCompanyList();
    this.GetAuthSignerCompanyList();

    this.GetPendingBadgeApplicantsList();
    this.clearanceDateText = this.appURL.getClearanceDateText();
  }

  //Get Company List
  public GetCompanyList() {
    this.CompanyService.GetCompanyList().subscribe((response: Company[]) => {
      this.allCompanyList = response;
      this.allCompanyList.forEach(element => {
        this.companyNames.push(element.companyName.toLowerCase().trim())  
      });            
    }, (error:any)=> {
      console.log("error list");
    });
  }

  //Get Company List
  public GetAuthSignerCompanyList() {
    this.pendingBadgeService.GetAuthSignerCompanyList().subscribe((response: string[]) => {
      this.authSignerCompanyNames = response; 
      // this.allAuthSignerCompanyList.forEach(element => {
      //   this.authSignerCompanyNames.push(element.companyName.toLowerCase().trim())  
      // });              
    }, (error:any)=> {
      console.log("error list");
    });
  }

  checkuncheckall() {
    if (this.isChecked == true) {
      this.isChecked = false;
      this.clearanceDetails = [];
    }
    else {
      this.isChecked = true;
      this.clearanceDetails = [];
      for (var pb of this.dataPendingBadge) {
        // const index = this.clearanceDetails.findIndex(a => a.badgekey===i[0]);
        // if (index > -1) {
        //   // This means id is present in the array, so remove it
        //   this.clearanceDetails.splice(index, 1);
        // } 
        if (pb[6] == null && pb[8] == null) {
          this.clearanceData = new SecurityClearanceStatus();
          this.clearanceData.badgekey = pb[0];
          this.clearanceData.companyName = pb[1];
          this.clearanceData.lastName = pb[2];
          this.clearanceData.firstName = pb[3];
          this.clearanceData.fingerprintDate = pb[4];
          this.clearanceData.clearanceDate = pb[5];
          this.clearanceData.notifyBy = this.user.id;
          this.clearanceData.denyBy = this.user.id;
          this.clearanceDetails.push(this.clearanceData);
        }

      }


    }

  }


  public GetPendingBadgeApplicantsList() {

    this.displayTable = false;
    //this.spinner.show();
    this.pendingBadgeService.GetPendingBadgeApplicantsList('Report2').subscribe((response: PendingBadgeApplicants[]) => {
      this.pendingBadgeApplicants = response;
      if (response != null && response != undefined) {
        if (response.length > 0) {
          this.displayTable = true;
          this.headerArray.push(Object.keys(response[0]));
          this.headerArrayExport.push(Object.keys(response[0]));
          this.headerArrayExport[0].shift(); 
        }
        var str = [];
        var strDatatable = [];        
        response.forEach((row: any) => {
          str = [];
          strDatatable = [];          
          Object.values(row).forEach((element: any, index) => {
            if (index != 0) {
              if (index == 4 || index == 5 || index == 6 || index == 7 || index == 8) {
                if (element != null) {
                  element = new Date(element).toLocaleDateString();
                }
                else
                {
                  element = "";
                }

                // if(index == 7)
                // {
                //   if (element != null && element != '') {
                //   this.expiresDate = new Date(element).toLocaleDateString();
                //   }
                // }
                
              }
              str.push(element);              
            }
            strDatatable.push(element);           
          });
          
          this.dataPendingBadge.push(strDatatable);                  
          // console.log(this.dataPendingBadge);  
          this.dataforPDF.push(str)
          this.dataforExcel.push(str)
        })        
      }
      
      //this.spinner.hide();
      /// this.buildDtOptions(response)

      this.ref.detectChanges();
      this.dtTrigger.next();
    },
      (error:any)=> {
        this.toastr.error('Unable to retrieve Pending Badge applicants at this time; please try later', 'Error');
        //this.spinner.hide();
      });
  }


  CompleteProcess(pb) {
    //this.spinner.show();
    this.pendingBadgeService.CompleteBadgeProcess(pb[0]).subscribe((response: Response) => {
      if (response.statusText == "Fail") {
        this.toastr.error('Error closing this record; please try again or contact administrator');
      }
      else {
        this.toastr.success('Closure successfully completed');
      }
      //this.spinner.hide();
    })

    //this.spinner.hide();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
      //console.log(currentUrl);
    });
  }

  saveSingleClearanceDate(pb) {   
    var msg = "Please click OK to send notification emails for " + pb[2] + " " + pb[3];
    if (confirm(msg)) {
      //console.log(pb);
      //this.spinner.show();


      this.clearanceData = new SecurityClearanceStatus();
      this.clearanceData.badgekey = pb[0];
      this.clearanceData.companyName = pb[1];
      this.clearanceData.lastName = pb[2];
      this.clearanceData.firstName = pb[3];
      this.clearanceData.fingerprintDate = pb[4];
      this.clearanceData.clearanceDate = pb[5];
      this.clearanceData.notifyBy = this.user.id;
      this.clearanceData.denyBy = null;

      this.singleclearanceDetails.push(this.clearanceData);


      this.pendingBadgeService.SaveClearanceDetails(this.singleclearanceDetails).subscribe((response: Response) => {
        // this.loading = false;
        if (response.statusText === "Success") {
          $('#dt1').DataTable().destroy();
          // this.GetPendingBadgeApplicantsList();
          this.toastr.success('Notification successfully completed', 'Information');
        }
        else {
          this.toastr.error('Error saving - please try again or contact administrator');
        }
        //this.spinner.hide();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          //console.log(currentUrl);
        });
      });
    }
  }


  unsaveSingleClearanceDate(pb) {   
    var msg = "Please click OK to revert back for " + pb[2] + " " + pb[3];
    if (confirm(msg)) {
      //console.log(pb);
      //this.spinner.show();


      this.clearanceData = new SecurityClearanceStatus();
      this.clearanceData.badgekey = pb[0];
      this.clearanceData.companyName = pb[1];
      this.clearanceData.lastName = pb[2];
      this.clearanceData.firstName = pb[3];
      this.clearanceData.fingerprintDate = pb[4];
      this.clearanceData.clearanceDate = pb[5];
     // this.clearanceData.notifyBy = null;
      this.clearanceData.notificationDate = null;
      this.clearanceData.notifyBy = this.user.name;
      this.clearanceData.denyBy = this.user.name;
      this.clearanceData.reminderMailSent = false;

      this.singleunapproveDetails.push(this.clearanceData);


      this.pendingBadgeService.UnsaveClearanceDetails(this.singleunapproveDetails).subscribe((response: Response) => {
        // this.loading = false;
        if (response.statusText === "Success") {
          $('#dt1').DataTable().destroy();
          // this.GetPendingBadgeApplicantsList();
          this.toastr.success('Unapprove Successfully completed', 'Information');
        }
        else {
          this.toastr.error('Error saving - please try again or contact administrator');
        }
        //this.spinner.hide();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          //console.log(currentUrl);
        });
      });
    }
  }

  saveUndenyDate(pb) {
    var msg = "Please click OK to set undeny for " + pb[2] + " " + pb[3];
    if (confirm(msg)) {
      //this.spinner.show();

      this.clearanceData = new SecurityClearanceStatus();
      this.clearanceData.badgekey = pb[0];
      this.clearanceData.companyName = pb[1];
      this.clearanceData.lastName = pb[2];
      this.clearanceData.firstName = pb[3];
      this.clearanceData.fingerprintDate = pb[4];
      this.clearanceData.clearanceDate = pb[5];
      //this.clearanceData.denyBy = this.user.id;
      this.clearanceData.denyDate = null;
      //this.clearanceData.notifyBy = this.user.id;
      this.clearanceData.notifyBy = this.user.name;
      this.clearanceData.denyBy = this.user.name;
      this.clearanceData.reminderMailSent = false;

      this.singleunapproveDetails.push(this.clearanceData);


      this.pendingBadgeService.SaveUndenyDetails(this.singleunapproveDetails).subscribe((response: Response) => {
        // this.loading = false;
        if (response.statusText === "Success") {
          $('#dt1').DataTable().destroy();
          // this.GetPendingBadgeApplicantsList();
          this.toastr.success('Undenial successfully completed', 'Information');          
        }
        else {
          this.toastr.error('Error saving - please try again or contact administrator');
        }
        //this.spinner.hide();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          //console.log(currentUrl);
        });
      });
    }
  }


  SaveDeny() {
    if (this.clearanceDetails.length <= 0) {
      this.toastr.error('Please check at least one checkbox');
      return;
    }
    var msg = "Please click OK to send denial emails to "+this.clearanceDetails.length+ " applicants";
    if (confirm(msg)) {
   
  
      //this.spinner.show();
      this.clearanceData.denyBy = this.user.id;
      this.pendingBadgeService.SaveDenyDetails(this.clearanceDetails).subscribe((response: Response) => {
        // this.loading = false;
        if (response.statusText === "Success") {
          $('#dt1').DataTable().destroy();
          this.toastr.success('Denial(s) successfully completed', 'Information');


        }
        else {
          this.toastr.error('Error saving - please try again or contact administrator');
        }

        // this.GetPendingBadgeApplicantsList();  
        //this.spinner.hide();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          //console.log(currentUrl);
        });

      });
    
  }
  }

  SaveClearanceDate() {
    if (this.clearanceDetails.length <= 0) {

      this.toastr.error('Please check at least one checkbox');
      return;
    }

      const index = this.clearanceDetails.findIndex(a => a.clearanceDate==null || a.clearanceDate=="");
      // console.log(this.clearanceDetails);
      // console.log(index);
        if (index > -1) {         
          this.toastr.error('One or more of selected applicant(s) have an empty clearance date. Please unselect and retry.');
          return;
        } 
    var msg = "Please click OK to send notification emails to "+this.clearanceDetails.length+ " applicants";
    if (confirm(msg)) {
     
    
        //this.spinner.show();

        //console.log(this.clearanceDetails);
        this.pendingBadgeService.SaveClearanceDetails(this.clearanceDetails).subscribe((response: Response) => {
          // this.loading = false;
          if (response.statusText === "Success") {
            $('#dt1').DataTable().destroy();
            this.toastr.success('Notification(s) successfully completed', 'Information');


          }
          else {
            this.toastr.error('Error saving - please try again or contact administrator');
          }
          // this.GetPendingBadgeApplicantsList();  
          //this.spinner.hide();
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
            //console.log(currentUrl);
          });

        });
      }
    
  }




  saveDenyDate(pb) {
    var msg = "Please click OK to send denial emails for " + pb[2] + " " + pb[3];
    if (confirm(msg)) {
      //this.spinner.show();

      this.clearanceData = new SecurityClearanceStatus();
      this.clearanceData.badgekey = pb[0];
      this.clearanceData.companyName = pb[1];
      this.clearanceData.lastName = pb[2];
      this.clearanceData.firstName = pb[3];
      this.clearanceData.fingerprintDate = pb[4];
      this.clearanceData.clearanceDate = pb[5];
      this.clearanceData.denyBy = this.user.id;
      this.clearanceData.notifyBy = null;
      this.singleclearanceDetails.push(this.clearanceData);


      this.pendingBadgeService.SaveDenyDetails(this.singleclearanceDetails).subscribe((response: Response) => {
        // this.loading = false;
        if (response.statusText === "Success") {
          $('#dt1').DataTable().destroy();
          // this.GetPendingBadgeApplicantsList();
          this.toastr.success('Denial successfully completed', 'Information');          
        }
        else {
          this.toastr.error('Error saving - please try again or contact administrator');
        }
        //this.spinner.hide();
        let currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
          //console.log(currentUrl);
        });
      });
    }
  }

  CheckBoxChange(e, pb) {
    if (!e.target.checked) {
      this.clearanceDetails.splice(this.clearanceDetails.findIndex(a => a.badgekey === pb[0]), 1)
      return
    }

    const index = this.clearanceDetails.findIndex(a => a.badgekey === pb[0]);
    if (index > -1) {
      // This means id is present in the array, so remove it
      this.clearanceDetails.splice(index, 1);
    }
    // console.log(this.clearanceData);
    this.clearanceData = new SecurityClearanceStatus();
    this.clearanceData.badgekey = pb[0];
    this.clearanceData.companyName = pb[1];
    this.clearanceData.lastName = pb[2];
    this.clearanceData.firstName = pb[3];
    this.clearanceData.fingerprintDate = pb[4];
    this.clearanceData.clearanceDate = pb[5];  
    this.clearanceData.notifyBy = this.user.id;
    this.clearanceData.denyBy = this.user.id;  
    this.clearanceDetails.push(this.clearanceData);

  }

  public ExportTableDataToPDF() {
    // const doc = new jsPDF();
    // doc.setFontSize(18);
    // var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    // var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // doc.text('Pending Badge Applicants',pageWidth / 2, 10, {align: 'center'});

    // autoTable(doc, { html: '#dt1' });
    // //below line for Open PDF document in new tab
    // doc.output('dataurlnewwindow');
    // doc.save('Pending Badge Applicants.pdf');


    var doc = new jsPDF();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text('Security Clearance Status Report', pageWidth / 2, 10, { align: 'center' });
    doc.setFontSize(11);
    doc.setTextColor(100);

    (doc as any).autoTable({
      head: [this.headerArrayExport[0]],
      body: this.dataforPDF,
      foot: [[{ content: this.footerContent.concat("\n\n" + this.footerContent1), colSpan: 7 }]],
      theme: 'striped',
    })

    // below line for Open PDF document in new tab
    //doc.output('dataurlnewwindow')

    // below line for Download PDF document  
    doc.save('Security Clearance Status Report.pdf');
  }


  public ExportTableDataToExcel() {
    let reportData = {
      title: 'Security Clearance Status Report',
      data: this.dataforExcel,
      headers: this.headerArrayExport[0],
    }
    this.exportExcel(reportData);
  }

  //Unsubscribe datatable event
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  exportExcel(excelData) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Security Clearance Status Report');


    //Add Row and formatting
    worksheet.mergeCells('A1', 'H2');
    let titleRow = worksheet.getCell('A1');
    titleRow.value = title
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      bold: true,
      color: { argb: '000080' }
    }
    // titleRow.fill ={
    //   type: 'pattern',
    //   pattern:'solid',
    //   fgColor: { argb: 'white' },
    //   bgColor:{ argb:'green'}
    // };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    //worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell, number) => {
      // cell.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: '87CEEB' },//{ argb: '4167B8' },
      //   bgColor: { argb: '' }
      // }
      cell.font = {
        bold: true,
        color: { argb: '000080' },
        size: 12
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.getColumn(number).width = 20;
    })
    worksheet.mergeCells(`A3:A5`);
    worksheet.mergeCells(`B3:B5`);
    worksheet.mergeCells(`C3:C5`);
    worksheet.mergeCells(`D3:D5`);
    worksheet.mergeCells(`E3:E5`);
    worksheet.mergeCells(`F3:F5`);
    worksheet.mergeCells(`G3:G5`);
    worksheet.mergeCells(`H3:H5`);
    // Adding Data with Conditional Formatting
    let row: Row
    data.forEach(d => {
      let row = worksheet.addRow(d)
      row.font = {
        color: { argb: '000080' },
        size: 12
      }
    });


    //worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow([this.footerContent.concat("\n\n" + this.footerContent1)]);
    footerRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
    footerRow.font = {
      name: 'Calibri',
      size: 12,
      italic: true,
      color: { argb: '000080' }
    }

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number + 7}`);


    var rows = worksheet.rowCount;
    var cols = worksheet.columnCount;
    for (var x = 1; x <= rows; x++) {
      for (var y = 1; y <= cols; y++) {
        worksheet.getCell(`A${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`B${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`C${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`D${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`E${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`F${x}:F${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`G${x}:G${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`H${x}:H${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
      }
    }
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      //let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let blob = new Blob([data], { type: 'application/vnd.ms-excel.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  public hideButtons(pba)
  {    
    // var comp = this.allCompanyList.find(x => x.companyName.toString().toLowerCase().trim() == pba[1].toString().toLowerCase().trim())
    // if(comp == undefined)    
    // {
    //   return false
    // }
    // else
    // {
    //   return true;
    // }  

    if(this.authSignerCompanyNames.includes(pba[1].toString().toLowerCase().trim()))
    {      
      return true      
    }
    else
    {
      return false;
    }  
    
  }

  public hideDenyButtons(pba)
  {    
    if(this.authSignerCompanyNames.includes(pba[1].toString().toLowerCase().trim()))
    {      
      if((pba[6] == "") && (pba[8] != ""))
      {
        return true
      }
      else
      {
        return false
      }      
    }
    else
    {
      return false;
    }
    
  }

  public hideButtonApprove(pba)
  {    
    if(this.authSignerCompanyNames.includes(pba[1].toString().toLowerCase().trim()))
    {      
      if((pba[6] == ""))
      {
        return false
      }
      else
      {
        return true
      }      
    }
    else
    {
      return false;
    }
    
  }

  public hideNotifyButtons(pba)
  {    
    // var comp = this.allCompanyList.find(x => x.companyName.toString().toLowerCase().trim() == pba[1].toString().toLowerCase().trim())
    // if(comp == undefined)    
    // {
    //   return false
    // }
    // else
    // {
    //   return true;
    // }  

    if(this.authSignerCompanyNames.includes(pba[1].toString().toLowerCase().trim()))
    {      
      if(pba[8] != "" )
      {
        return false
      }
      else
      {
        return true
      }      
    }
    else
    {
      return false;
    }  
  }

  public showIndicate(pba)
  {
    if(this.companyNames.includes(pba[1].toString().toLowerCase().trim()))
    {      
      if(this.authSignerCompanyNames.includes(pba[1].toString().toLowerCase().trim()))
      {          
        return false         
      }   
      else
      {
        this.infoMessage="Auth Signer is not assigned to company." 
        return true    
      }           
    }
    else
    {
      this.infoMessage="Company doesn't exist."
      return true;
    } 

  }

  
}
