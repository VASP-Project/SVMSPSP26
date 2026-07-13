import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PendingbadgeapplicantService } from '../pendingbadgeapplicants/pendingbadgeapplicant.service';
import { PendingBadgeApplicants } from '../pendingbadgeapplicants/pendingbadgeapplicants';
//import * as jsPDF from 'jspdf';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable, { Cell, Row } from 'jspdf-autotable';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Component({
  selector: 'app-pending-badge-view',
  templateUrl: './pending-badge-view.component.html',
  styleUrls: ['./pending-badge-view.component.scss']
})
export class PendingBadgeViewComponent implements OnInit {

  pendingBadgeApplicants: PendingBadgeApplicants[] = [];
  dtOptions: DataTables.Settings = {};
  // We use this trigger because fetching the list can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();
  displayTable: boolean = false;
  header = [['COMPANY NAME (Organization Code)', 'APPLICANT LAST NAME', 'APPLICANT FIRST NAME', 'FINGERPRINT DATE', 'CLEARANCE DATE']];
  dataforPDF = [];
  dataforExcel = [];
  footerContent = 'CLEARANCE DATE: The applicant must complete the badging process within 30 days of receiving a clearance date. Failure to complete the badging process within 30 days, to include security training & issuance, will require the applicant to be fingerprinted again before a badge can be issued. Should the 30-days period expire, an additional charge may be applicable for processing as additional security check.'
  footerContent1 = "BADGE APPLICATION/VALID GOVERNMENT-ISSUED PHOTO IDENTIFICATION/EMPLOYMENT ALIGIBILITY DOCUMENTS: The applicant must bring a completed badge application and 2 valid forms of identification, and acceptable Employment Eligibility Document(s) pursuant with US Citizenship and Immigration Services (USCIS) Form I-9, List of Acceptable Documents."
  headerArray = [];
  headerArray1 = [];
  clearanceDateText: string;

  constructor(private ref: ChangeDetectorRef,
    private pendingBadgeService: PendingbadgeapplicantService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private appURL: AppConfigService,) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      stateSave: true,
      ordering: true,
      order: [],
      columnDefs: [{
        'targets': [3, 4],
        'type': "date"
      }],
      responsive: true
      // dom: 'lBfrtip',       
    };
    this.GetPendingBadgeApplicantsList();
    this.clearanceDateText = this.appURL.getClearanceDateText();
  }


  public GetPendingBadgeApplicantsList() {
    this.displayTable = false;
    //this.spinner.show();
    this.pendingBadgeService.GetPendingBadgeApplicantsList('Report1').subscribe((response: PendingBadgeApplicants[]) => {
      this.pendingBadgeApplicants = response;
      if (response != null && response != undefined) {
        if (response.length > 0) {
          this.displayTable = true;
          // this.headerArray1.push(Object.keys(response[0]));

          // console.log(this.headerArray1);
          // // var len=Object.keys(response[0]).length;
          // // this.headerArray[0].shift();
          // // this.headerArray[0].slice(0, this.headerArray[0].length-2);
          // this.headerArray=  this.headerArray1.splice(1,  this.headerArray1[0].length-2);



          for (let i = 0; i < Object.keys(response[0]).length; i++) {
            if (Object.keys(response[0])[i] != "BadgeKey" && Object.keys(response[0])[i] != "Notify" && Object.keys(response[0])[i] != "Deny") {
              this.headerArray1.push(Object.keys(response[0])[i]);
            }
          }
          // console.log(this.headerArray1);
          this.headerArray.push(this.headerArray1);
          //  this.headerArray.push(Object.keys(response[0]).slice(0,Object.keys(response[0]).length-2));
          // this.headerArray[0].shift();
        }
        var str = [];
        response.forEach((row: any) => {
          str = [];
          Object.values(row).forEach((element: any, index) => {
            if (index != 0 && index != 6 && index != 7) {
              if (index == 4 || index == 5) {
                if (element != null) {
                  element = new Date(element).toLocaleDateString();
                }
              }

              str.push(element);
            }
          });

          this.dataforPDF.push(str)
          this.dataforExcel.push(str)
        })
      }
      //this.spinner.hide();
      /// this.buildDtOptions(response)
      this.displayTable = true;
      this.ref.detectChanges();
      this.dtTrigger.next();
    },
      (error:any)=> {
        this.toastr.error('Error while fetching Pending Badge Applicant Data', 'Error');
        //this.spinner.hide();
      });
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
      head: [this.headerArray[0]],
      body: this.dataforPDF,
      foot: [[{ content: this.footerContent.concat("\n\n" + this.footerContent1), colSpan: 5 }]],
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
      headers: this.headerArray[0],
    }
    this.exportExcel(reportData);
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
    worksheet.mergeCells('A1', 'E2');
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
    worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number + 7}`);


    var rows = worksheet.rowCount;
    var cols = worksheet.columnCount;
    for (var x = 1; x <= rows; x++) {
      for (var y = 1; y <= cols; y++) {
        worksheet.getCell(`A${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`B${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`C${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`D${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
        worksheet.getCell(`E${x}:E${y}`).border = { top: { style: 'thick' }, bottom: { style: 'thick' }, left: { style: 'thick' }, right: { style: 'thick' } }
      }
    }
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

}
