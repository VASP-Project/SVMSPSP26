import { HttpClient } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { QueriesList } from './query.model';
import { QueryService } from './query.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-queryanalyzer',
  templateUrl: './queryanalyzer.component.html',
  styleUrls: ['./queryanalyzer.component.scss']
})
export class QueryanalyzerComponent implements OnInit {
  http: HttpClient;
  querylst: QueriesList[] = [];
  querieslist: QueriesList[];
  dtTrigger: Subject<any> = new Subject();
  //dtOptions: any = {};
  currentBtnId: string;
  dtOptions: DataTables.Settings = {};
  user: any;
  addQuery: boolean = false;
  currentId: string = '-';
  lastRow: string;
  parametersList = [];
  question: string = '';
  response: any;
  displayedColumns: string[] = [];

  constructor(
    public queryService: QueryService,
    http: HttpClient,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (this.user.rolename == 'Superadmin') {
      this.addQuery = true;
    }
    this.GetQueryList();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      stateSave: true,
      stateDuration: -1,
      order: [[0, 'asc']]
    };
    

  }

  editQuery(id) {
    this.router.navigate(['/admin/queryviewer'], {
      queryParams: {
        'queryId': id,
        'isEdit': 1
      }
    })
  }

  GetQueryList() {
    //this.spinner.show();
    //this.inspectiontypes=[];
    this.queryService.GetQueryList().subscribe((response: QueriesList[]) => {
      this.querieslist = response;

      this.dtTrigger.next();
    },
      (error: any) => {
        this.toaster.error('Error while fetching Queries', 'Error');

      });



    // this.queryService.GetQueryList().subscribe((response:QueriesList[]) => {


    //   this.querylst = response;

    //   this.dtTrigger.next();

    // });
  }

  deleteQuery(id: number) {
    var ans = confirm("Are you sure you want to delete this query?");
    if (ans == true) {

      this.queryService.DeleteQueryById(id).subscribe((response: Response) => {
        if (response.statusText == "Fail") {
          this.toaster.success('There was some error deleting the record. Please try again later');
        } else {
          this.toaster.success('Query deleted successfully');
        }
        $('#dt1').DataTable().destroy();
        this.GetQueryList();
        //this.spinner.hide();

      });
    }
    //this.GetQueryList();


  }

  RunQuery(rowId) {
    //alert(rowId);
    //Check If the query has paramaters in it
    this.queryService.getQueryParamaters(rowId).subscribe((response) => {
      console.log(response);
      this.parametersList = response;
      //const options = {queryParams: {words: ['chuck', 'norris', 'vs', 'keanu', 'reeves']}};
      const options = {
        queryParams: { words: this.parametersList, rowId: rowId },
      };
      console.log('@@@@@@@@@@@@');
      console.log(options);
      this.router.navigate(['/admin/queryviewer'], options);
      //  this.router.navigate([
      //    '/queryviewer',
      //    rowId,options
      //  ]);
    });
  }

  onSubmit() {

    this.queryService.getTextToSql(this.question).subscribe((response) => {
      console.log(response);
      this.response = response;
      if (response?.result?.length > 0) {
        this.displayedColumns = Object.keys(response.result[0]);
      } else {
        this.displayedColumns = [];
      }
    });
  }

  // onSHowHideQuery(event, rowId, action) {
  //   try {
  //     var target = event.target || event.srcElement || event.currentTarget;
  //     var idAttr = target.attributes.id;
  //     var value = idAttr.nodeValue;
  //     let elementId: string = value;
  //     this.currentBtnId = elementId;

  //     if (action === 1) {
  //       this.currentBtnId = rowId;
  //     } else {
  //       this.currentBtnId = '';
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // onClick(event, rowId) {
  //   this.lastRow = rowId;
  //   var target = event.target || event.srcElement || event.currentTarget;
  //   var idAttr = target.attributes.id;
  //   var value = idAttr.nodeValue;
  //   let elementId: string = value;
  //   this.currentId = elementId;
  //   this.currentBtnId = elementId;
  //   sessionStorage.setItem('lastId', this.currentId);
  //   if (rowId === elementId) {
  //     // this.show = !this.show;
  //     var buttonText = document.getElementById(elementId).innerText;
  //     if (buttonText === 'Show sql query') {
  //       document.getElementById(elementId).innerHTML = 'Hide sql query';
  //       //this.buttonName = "Hide sql query";
  //     } else {
  //       document.getElementById(elementId).innerHTML = 'Show sql query';
  //       //this.buttonName = "Show sql query";
  //       this.currentId = '';
  //       this.currentBtnId = '';
  //     }
  //     sessionStorage.setItem('lastId', this.currentId);
  //   }
  //   // else {

  //   //   this.currentId = "";
  //   //   this.currentBtnId = "";
  //   // }
  //   if (this.currentId !== '' && this.lastRow !== this.currentId) {
  //     var buttonText = document.getElementById(rowId).innerText;
  //     if (buttonText === 'Show sql query') {
  //       document.getElementById(rowId).innerHTML = 'Hide sql query';
  //     } else {
  //       document.getElementById(rowId).innerHTML = 'Show sql query';
  //     }
  //   }
  // }
}
