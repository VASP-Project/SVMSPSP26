import { Component, OnInit } from "@angular/core";
import { PagingHeader } from "@app/shared/shared.model";
import { Subject } from "rxjs";
import { TestMacroService } from "../test_macro.service";
import { InputParameters } from "../test_macro";
type AOA = any[][];

@Component({
  selector: "app-test-macro-list",
  templateUrl: "./test-macro-list.component.html",
  styleUrls: ["./test-macro-list.component.scss"],
})
export class TestMacroListComponent implements OnInit {
  data: AOA = [];
  dtOptions: DataTables.Settings = {};
  pageHeaders: PagingHeader = new PagingHeader();
  dtTrigger: Subject<any> = new Subject();
  dataFromApi = [];
  user: any;
  isSuperAdmin: boolean = false;
  isTsaUser: boolean = false;
  isAWSScheduler: boolean = false;
  isTsaApprover: boolean = false;
  isTsaScheduler:boolean = false;
  inputParameters: InputParameters[];
  isAlreadySubmitted: boolean = false;
  isAlreadyVerified: boolean = false;
  isStaffAdmin:boolean = false;

  constructor(private testMacroService: TestMacroService) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [[0, 'desc']],    
  };
  this.user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (this.user.rolename == "Superadmin") {
    this.isSuperAdmin = true;
  }
  if (this.user.rolename == "TSA User") {
    this.isTsaUser = true;
  }
  if (this.user.rolename == "StaffAdmin") {
    this.isStaffAdmin = true;
  }
  if (this.user.isTsaApprover == true) {
    this.isTsaApprover = true;
  }
  if (this.user.isTsaScheduler == true) {
    this.isTsaScheduler = true;
  }
    this.GetScheduleDataList();
  }
  
  public GetScheduleDataList() {
    //this.spinner.show();
    this.testMacroService
      .GetScheduleDataList()
      .subscribe((response: InputParameters[]) => {
        this.inputParameters = response;
        this.inputParameters = response.filter(x => x.isSubmitted === true);
        this.dtTrigger.next();
        //this.spinner.hide();
      });
  }

}
