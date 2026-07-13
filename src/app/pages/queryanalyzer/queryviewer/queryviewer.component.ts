import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { arrParams, QueriesList } from '../query.model';
import { QueryService } from '../query.service';
import { NgForm } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { forEach } from 'jszip';
import { element } from 'protractor';

@Component({
  selector: 'app-queryviewer',
  templateUrl: './queryviewer.component.html',
  styleUrls: ['./queryviewer.component.scss']
})
export class QueryviewerComponent implements OnInit {
  @ViewChild('table') table: ElementRef;

  http: HttpClient;
  querylst: QueriesList[] = [];
  queryList = new QueriesList();
  dtOptions: any = {};
  dtInstance: DataTables.Api;
  displayTable: boolean = false;
  NoDataFound: boolean = false;
  errorFound: boolean = false;
  dtTrigger: Subject<any> = new Subject();
  columnsnames: any = ([] = []);

  dtElements: QueryList<DataTableDirective>;
  errorMessage: string = '';
  sampleData: any = ([] = []);
  view: boolean = false;
  dtElement: DataTableDirective;
  isDtInitialized: boolean = false
  user: any;
  notRun: boolean = false;
  //dtInstance;
  headers: string[] = []
  sortedHeaders:string[] = [];
  words: string[];
  qtd: arrParams[] = [];
  arrayParamModel = new arrParams();
  paramString: string = '';
  currentRowId: string = '-';
  //model: QuerieList = new QuerieList();
  showSQLBtnName: string = 'Show SQL';
  isShowDiv: boolean = false;
  isView: string = '-';
  showParamView: boolean = false;
  parametersList = [];
  rowIdforReturn:string = '-';
  queryRowId:string = '-';
  isEditQuery:number = 0;

  constructor(
    public queryService: QueryService,
    http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private ref: ChangeDetectorRef,
    private toaster: ToastrService
  ) { }


  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (this.user.rolename == 'Superadmin') {
      this.notRun = true;
      
    }

    this.queryRowId = this.route.snapshot.queryParamMap.get('rowId');
    this.words = this.route.snapshot.queryParamMap.getAll('words');
    var queryId: number = +this.queryRowId;
    this.qtd = [];
    this.words.forEach((words) => {
      this.arrayParamModel = new arrParams();
      this.arrayParamModel.fieldName = words;
      this.qtd.push(this.arrayParamModel);
    });
    this.currentRowId = this.queryRowId;
    //this.GetQuery();
    if(this.queryRowId != undefined){
      this.editQuery(queryId);
    }
    if(this.words.length > 0){
      this.showParamView = true;
    }

    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams['isEdit'];
    if (isEdit == "1") {
      this.isEditQuery = 1;
      var isView = this.route.snapshot.pathFromRoot[1].queryParams['isView'];
      var queryId: number = this.route.snapshot.pathFromRoot[1].queryParams['queryId'];
      if (this.user.rolename == 'Superadmin') {
        this.notRun = true;
        this.editQuery(queryId);
      }
    }
    
    var isRun = this.route.snapshot.pathFromRoot[1].queryParams['isRun'];
    if (isRun == "1") {
      var queryToRun = this.route.snapshot.pathFromRoot[1].queryParams['queryToRun'];
      var queryId: number = this.route.snapshot.pathFromRoot[1].queryParams['queryId'];
      this.showQueryRunResult(queryId, queryToRun)
      if (this.user.rolename == 'Superadmin') {
        this.notRun = true;
        this.editQuery(queryId);
      }

    }


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      ordering: true,
      order: [0,'asc'],
      //processing: true,
      dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-2'B>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [{ extend: 'excel', text: 'Export to Excel', titleAttr: 'Export to Excel', title: 'Result Query', className: 'btn btn-sm btn-primary' }]
    };
  }



  saveQuery(formData: NgForm) {
    var queryData = {
      Id: formData.value.id,
      Name: formData.value.name,
      Query: formData.value.query,

    };
    //this.spinner.show();
    this.queryService.AddQuery(this.queryList).subscribe((response: QueriesList) => {
      //this.spinner.hide();
      this.queryList = response;
      this.parametersList = response.paramlst;
      const options = {
        queryParams: { words: this.parametersList, rowId: this.queryList.id },
        
      };
      this.router.navigate(["/admin/queryanalyzer"]).then(() => {
        this.router.navigate(['/admin/queryviewer'],options);
      });

    //   if(this.queryRowId == undefined){
    //     this.queryRowId = response[0];
    //   }else{
    //     this.queryRowId = this.queryRowId; 
    //   }
      
      
    
    // this.queryService.getQueryParamaters(this.queryRowId).subscribe((response) => {
    //   console.log(response);
    //   this.parametersList = response;
    //   const options = {
    //     queryParams: { words: this.parametersList, rowId: this.queryRowId },
        
    //   };
    //   this.router.navigate(["/admin/queryanalyzer"]).then(() => {
    //     this.router.navigate(['/admin/queryviewer'],options);
    //   });
    // });
  });
      this.toaster.success('Query Saved Successfully');
  }

  showExecutionResult(formData: NgForm){
    var queryData = {
      Query: formData.value.query,

    };
    this.queryService
        .showExecutionResult(queryData)
        .subscribe((response) => {
          
  });
}
  editQuery(id) {
    
    this.GetQueryById(id);
  }

  private GetQueryById(id: number) {
    //this.spinner.show();GetQueryById
    this.queryService.GetQueryById(id).subscribe((response: QueriesList) => {
      this.queryList = response

      this.queryList.id = id;
      this.queryList.name = response.name
      this.queryList.query = response.query
      //this.spinner.hide();
    });
  }

  // GetQuery() {
  //   this.spinner.show();

  //   this.queryService.GetQuery(this.currentRowId).subscribe((response) => {
  //     this.model = response[0];
  //     //console.log(response);
  //     //this.spinner.hide();
  //   });
  // }

  execute(formdata: NgForm) {
    
      var queryData = {
        Name: formdata.value.name,
        Query: formdata.value.query,
  
      };
      if(this.displayTable == true){
        this.queryService
        .showQueryResult(queryData)
        .subscribe((response) => {
          this.sortedHeaders = [];
          this.headers = [];
          $('#dt1').DataTable().destroy();
          //this.headers = Object.keys(null);

          this.sampleData = response;
          this.headers = Object.keys(response[0]);
          this.sortedHeaders = this.headers.sort();
         
          
        });
      }else{
        this.queryService
        .showQueryResult(queryData)
        .subscribe((response) => {
          //$('#dt1').DataTable().destroy();
          this.sampleData = response;
          this.headers = Object.keys(response[0]);
          this.sortedHeaders = this.headers.sort();
          this.displayTable = true;
          this.dtTrigger.next();
        });
      }
    
  }


  showQueryRunResult(id: number, query: string) {
    var queryData = {
      Name: id,
      Query: query,
    };
    this.queryService.showQueryResult(queryData).subscribe((response) => {
      this.errorMessage = '';

      if (response.length === 0 || response.length === undefined) {
        if (response.Message !== undefined) {
          this.errorMessage = response.Message;
          this.spinner.hide();
          this.errorFound = true;
          this.NoDataFound = false;
          this.displayTable = false;
        } else {
          this.spinner.hide();
          this.errorFound = false;
          this.NoDataFound = true;
          this.displayTable = false;
        }
      } else {
        this.sampleData = response;
        this.headers = Object.keys(response[0]);
        this.sortedHeaders = this.headers.sort();
        console.log(this.headers)
        this.displayTable = true;
        this.dtTrigger.next();
      }
    });
  }

  showQueryResult() {
    console.log(this.qtd);
    this.paramString = '';
    for (let q of this.qtd) {
      this.paramString = this.paramString + q.value + ',';
    }
    this.spinner.show();
    this.columnsnames = [];
    this.sampleData = [];
    this.displayTable = false;
    this.queryService
      .showResult(this.currentRowId, this.paramString)
      .subscribe((response) => {
        console.log(response);

        
        this.errorMessage = '';
        if (response.length === 0 || response.length === undefined || response === null) {
          if (response.Message !== undefined) {
            this.errorMessage = response.Message;
            this.spinner.hide();
            this.errorFound = true;
            this.NoDataFound = false;
            this.displayTable = false;
          } else {
            this.spinner.hide();
            this.errorFound = false;
            this.NoDataFound = true;
            this.displayTable = false;
          }
        } else {
          this.sampleData = response;
          this.dtTrigger = new Subject();
          var columnsIn = response[0];
          //this.headers = Object.keys(response[0]);
          //this.sortedHeaders = this.headers.sort();
          for (var key in columnsIn) {
            console.log(key); //column names of data object
            this.columnsnames.push({
              data: key,
              title: key,
            });
          }
          console.log('new'+this.columnsnames);
          
          this.dtOptions = {
            ordering: false,
            order: [[0, 'asc']],
            pagingType: 'full_numbers',
            pageLength: 10,
            data: this.sampleData,
            //Columns
            columns: this.columnsnames,
            dom: "<'row'<'col-sm-12 col-md-5'l><'col-sm-12 col-md-5'f><'col-sm-12 col-md-2'B>>" +
      "<'row'<'col-sm-12'tr>>" +
      "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [{ extend: 'excelHtml5', text: 'Export to Excel', titleAttr: 'Export to Excel', title: 'Result Query', className: 'btn btn-sm btn-primary' }]
    
          };

          this.displayTable = true;
          this.ref.detectChanges();
          this.dtTrigger.next();
          this.spinner.hide();
          this.errorFound = false;
          this.NoDataFound = false;
        }
      });
  }

  getData(item: any) {
    return typeof item == 'object' ? '-' : item
  }

  getheader(item: any) {
    return typeof item == 'object' ? '-' : item
  }

  ExportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.queryList.name +'.xlsx');
  }
  enablesave() {
    if (this.queryList.name == undefined ||
      this.queryList.query == undefined) {
      return true
    }
    return false
  }

  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    if (this.showSQLBtnName == 'Show SQL') {
      this.showSQLBtnName = 'Hide SQL';
    } else {
      this.showSQLBtnName = 'Show SQL';
    }
  }

}
