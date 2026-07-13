import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryStringParameters } from '@app/shared/shared.model';
import { BadgeAuditCompanyEmployee, BadgeAuditDetails } from '../../badgelisting/badgelisting.model';
import { BadgelistingService } from '../../badgelisting/badgelistingedit/badgelisting.service';
import { AuditCompanysViewModel } from '../badgeauditdashboard.model';
import * as XLSX from 'xlsx';
import { Subject } from 'rxjs';
import 'html2canvas';
//import {NgxPrintModule} from 'ngx-print';
import { HttpClientModule } from '@angular/common/http';
import jspdf, { jsPDF } from 'jspdf';
 import 'jspdf-autotable';
 import * as pdfMake from "pdfmake/build/pdfmake";  
// import * as pdfFonts from "pdfmake/build/vfs_fonts";  
// declare var require: any;
 const htmlToPdfmake = require("html-to-pdfmake");
 import domtoimage from 'dom-to-image';
// (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-badgeauditexcel',
  templateUrl: './badgeauditexcel.component.html',
  styleUrls: ['./badgeauditexcel.component.scss']
})
export class BadgeauditexcelComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
    auditId: number = 0;
  auditEmployeeList: BadgeAuditCompanyEmployee[] = []
  auditCompanysList: AuditCompanysViewModel[] = []
  sortDir = 1;
  queryParam: QueryStringParameters = new QueryStringParameters()
  user:any;
  config: any;
  companyName:string;
  badgeauditinfo: BadgeAuditDetails = new BadgeAuditDetails();
  auditCompanyList: AuditCompanysViewModel = new AuditCompanysViewModel();
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private badgeAuditService: BadgelistingService, private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
  };

    this.auditId = +this.route.snapshot.pathFromRoot[1].queryParams['auditId'];
    this.companyName = this.route.snapshot.pathFromRoot[1].queryParams['companyName'];
    await this.getCompanyWiseEmployee()
    await this.GetBadgeCompanyList();
    this.GetBadgeAuditByStatus()   
  }

  
  
  async getCompanyWiseEmployee() : Promise<any> {
    return new Promise<void>((resolve, reject) => {
    this.badgeAuditService.GetBadgeAuditEmployeeList(this.auditId, this.companyName).subscribe((response: BadgeAuditCompanyEmployee[]) => {
      this.auditEmployeeList = response;
      this.dtTrigger.next();
      resolve()
    }, (error: any) => {
      console.log("Error Fetching Employee Data");
      reject()
    });
  });
}

  fireEvent()
  {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    /* save to file */
    XLSX.writeFile(wb, 'BadgeAuditReport.xlsx');
    
  }

  private GetBadgeAuditByStatus() {
    //this.spinner.show();
    this.badgeAuditService.GetBadgeAuditByDate(this.auditId).subscribe((response: BadgeAuditDetails) => {
      this.badgeauditinfo = response;
      

    });
  }
  
  async GetBadgeCompanyList(): Promise<any>{
    return new Promise<void>((resolve, reject) => {
    this.badgeAuditService.GetBadgeAuditCompanyList(this.auditId).subscribe((response: AuditCompanysViewModel[]) => {
      this.auditCompanysList = response.filter(c => c.auditId == this.auditId && c.companyName == this.companyName);
      resolve()
      //this.dtTrigger.next();
    }, (error: any) => {
      //this.spinner.hide();
      console.log("error list");
      reject()
      //this.spinner.hide();
    });
  });
}

  toPdf() {
    const dashboard = document.getElementById('dt1');

    const dashboardHeight = dashboard.clientHeight;
    const dashboardWidth = dashboard.clientWidth;
    const options = { background: 'white', width: dashboardWidth, height: dashboardHeight };

    domtoimage.toPng(dashboard, options).then((imgData) => {
         const doc = new jsPDF(dashboardWidth > dashboardHeight ? 'l' : 'p', 'mm', [dashboardWidth, dashboardHeight]);
         const imgProps = doc.getImageProperties(imgData);
         const pdfWidth = doc.internal.pageSize.getWidth();
         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

         doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
         doc.save('Audit.pdf');
    });
}

  // public downloadAsPDF() {
  //   const pdfTable = this.pdfTable.nativeElement;
  //   var html = htmlToPdfmake(pdfTable.innerHTML);
  //   const documentDefinition = { content: html };
  //   pdfMake.createPdf(documentDefinition).download(); 
     
  // }
  
  

  // public openPDF(): void {
  //   let DATA: any = document.getElementById('htmlData');
  //   html2canvas(DATA).then((canvas) => {
  //     let fileWidth = 208;
  //     let fileHeight = (canvas.height * fileWidth) / canvas.width;
  //     const FILEURI = canvas.toDataURL('image/png');
  //     let PDF = new jsPDF('p', 'mm', 'a4');
  //     let position = 0;
  //     PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
  //     PDF.save('angular-demo.pdf');
  //   });
  // }

   
  // public downloadAsPDF() {
  //   const doc = new jsPDF();
   
  //   const pdfTable = this.pdfTable.nativeElement;
   
  //   var html = htmlToPdfmake(pdfTable.innerHTML);
     
  //   const documentDefinition = { content: html };
  //   pdfMake.createPdf(documentDefinition).open(); 
     
  // }

//   public ExportTableDataToPDF() {
//     // const doc = new jsPDF();
//     // doc.setFontSize(18);
//     // var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
//     // var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

//     // doc.text('Pending Badge Applicants',pageWidth / 2, 10, {align: 'center'});

//     // autoTable(doc, { html: '#dt1' });
//     // //below line for Open PDF document in new tab
//     // doc.output('dataurlnewwindow');
//     // doc.save('Pending Badge Applicants.pdf');


//     var doc = new jsPDF();
//     var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
//     doc.setFontSize(18);
//     doc.text('Security Clearance Status Report', pageWidth / 2, 10, { align: 'center' });
//     doc.setFontSize(11);
//     doc.setTextColor(100);

//     (doc as any).autoTable({
//       //head: [this.headerArrayExport[0]],
//       body: this.pdfTable.nativeElement,
//       //foot: [[{ content: this.footerContent.concat("\n\n" + this.footerContent1), colSpan: 7 }]],
//       theme: 'striped',
//     })
  
  
// }

// makePdf() { 
//   let doc = new jsPDF();
//   doc.addHTML(this.pdfTable.nativeElement, function() {
//      doc.save("obrz.pdf");
//   });
// }


}




