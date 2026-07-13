import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateAdapter, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Scheduler } from './Scheduler';
import { SchedulerService } from './scheduler.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import * as XLSX from "xlsx";

type AOA = any[][];

@Component({
  selector: 'app-scheduler-add-edit',
  templateUrl: './scheduler-add-edit.component.html',
  styleUrls: ['./scheduler-add-edit.component.scss']
})
export class SchedulerAddEditComponent implements OnInit {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private schedulerService: SchedulerService,
    private route: ActivatedRoute,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe
  ) { }
  categoryOptions = [
    { label: "X", value: "X" },
    { label: "I", value: "I", selected: true },
    { label: "II", value: "II" },
  ];
  shiftStartTime = [
    { value: "0", label: "0" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
  ];
  shiftEndTime = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "13", label: "13" },
    { value: "14", label: "14" },
    { value: "15", label: "15" },
    { value: "16", label: "16" },
    { value: "17", label: "17" },
    { value: "18", label: "18" },
    { value: "19", label: "19" },
    { value: "20", label: "20" },
    { value: "21", label: "21" },
    { value: "22", label: "22" },
    { value: "23", label: "23" },
    { value: "24", label: "24" },
  ];
  isMoreThanOne = [
    { label: "Yes", value: "1" },
    { label: "No", value: "0" },
  ];
  numberOfShifts = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
  ];
  thisShift = [
    { value: "Shift 1", label: "Shift 1" },
    { value: "Shift 2", label: "Shift 2" },
    { value: "Shift 3", label: "Shift 3" },
    { value: "Shift 4", label: "Shift 4" },
    { value: "Shift 5", label: "Shift 5" },
  ];
  scheduler = new Scheduler();
  dataFromApi = [];
  data: AOA = [];
  isMoreThanOneShift: boolean = false;
  filteredShifts = [];
  submittedScheduledId: number;
  isAlreadySubmitted: boolean = false;
  isAlreadyVerified: boolean = false;
  isScheduleGenerated: boolean = false;
  user: any;
  isAWSScheduler: boolean = false;
  isStaffAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  isTsaApprover: boolean = false;
  isTsaScheduler:boolean = false;
  isTsaUser: boolean = false;
  isSecurity:boolean = false;
  isIssuer: boolean = false;
  isView: string;
  scheduleId: number;
  scheduledId: number = 0;
  isScheduleVerified: string;
  view: boolean = false;
  isShow: boolean = true;
  headertext:boolean = false;
  fileNameExcel= 'ExcelSheet.xlsx';


  ngOnInit(): void {

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
    if (this.user.rolename == "Issuer") {
      this.isIssuer = true;
    }
    if (this.user.rolename == "Security") {
      this.isSecurity = true;
    }
    if (this.user.isTsaApprover == true) {
      this.isTsaApprover = true;
    }
    if (this.user.isTsaScheduler == true) {
      this.isTsaScheduler = true;
    }
    this.scheduler.submittedBy = this.user.name;
    this.scheduler.approvedBy = this.user.name;

    var isEdit = this.route.snapshot.pathFromRoot[1].queryParams["isEdit"];
    this.isView = this.route.snapshot.pathFromRoot[1].queryParams["isView"];
    var submitted =
      this.route.snapshot.pathFromRoot[1].queryParams["submitted"];
    var verified = this.route.snapshot.pathFromRoot[1].queryParams["verified"];

    if (submitted == "true") {
      this.isAlreadySubmitted = true;
    }
    if (verified == "true") {
      this.isAlreadyVerified = true;
    }

    this.scheduleId =
    this.route.snapshot.pathFromRoot[1].queryParams["scheduleId"];
  this.editSchedule(this.scheduleId, this.isView);
  if (this.scheduleId > 0) {
    this.scheduledId = this.scheduleId;
  }
  this.submittedScheduledId = 0;
  this.isScheduleVerified = "";
  }

  editSchedule(id, mode) {
    if (mode == "1") {
      this.view = true;
      this.GetScheduleById(id);
    } else this.view = false;
  }
  hideaddform() {
    this.router.navigate(["/admin/schedulerList"]);
  }
  showParams(item: any) {
    this.isShow = !this.isShow;
  }
  private GetScheduleById(id: number) {
    //this.spinner.show();
    this.schedulerService.GetScheduleById(id).subscribe((response) => {
      //generated schedule data
      this.dataFromApi = response.item2;
      //input parameters
      this.scheduler = response.item1;
      console.log(this.scheduler);
      if (this.scheduler.isVerified == false) {
        this.isScheduleGenerated = true;
      }
      this.scheduler.isMoreThanOneShift =
        response.item1.isMoreThanOneShift.toString().toLowerCase() == "true"
          ? "1"
          : "0";
      this.scheduler.isSpecificDoor =
        response.item1.isSpecificDoor.toString().toLowerCase() == "true"
          ? "1"
          : "0";
      // this.scheduler.scheduleStartDate = this.dateAdapter.toModel(
      //   this.fromModelResponse(
      //     response.item1.scheduleStartDate.toString().split("T")[0]
      //   )
      // );
      // const date = new Date(this.scheduler.scheduleStartDate); // Convert to Date object
      // const day = date.getDate();
      // const month = date.getMonth() + 1; // Months are zero-based
      // const year = date.getFullYear();

      // this.scheduler.newScheduleStartDate = `${day}-${month}-${year}`;

      const excludedIndices = [0, 4, 8, 12, 16, 20, 24];

      //filtered the schedule data to remove empty fields
      const filteredData = this.dataFromApi
        .map((row, rowIndex) => {
          if (rowIndex === 1) {
            return row.filter((cell) => cell !== "");
          }else if(rowIndex >= 2) {
            // Remove items at specified indices for rowIndex 2 and beyond
            return row.filter((cell, index) => !excludedIndices.includes(index));
          } else {
            return row;
          }
        })
        .filter((row) => row.some((cell) => cell !== ""));
      this.data = filteredData;
      this.headertext = this.data.length > 0;

    });
  }

    //update value of isverified and text to db
    verifiedByTSA() {
      const verifiedtext = this.scheduler.verifiedText;
      this.scheduler.approvedBy = this.user.name;
      this.scheduler.approvedDate = this.datePipe.transform(
        new Date(),
        "MM-dd-yyyy"
      );
      if (verifiedtext == null) {
        this.toastr.error("Enter Notes");
      } else {
        this.schedulerService
          .UpdateVerifyByTSA(
            this.scheduleId,
            verifiedtext,
            this.scheduler.approvedBy,
            this.scheduler.approvedDate
          )
          .subscribe((response: Scheduler) => {
            this.scheduler = response;
            this.isAlreadyVerified = response.isVerified;
            this.toastr.success("Schedule Approved Successfully");
          });
      }
    }

  public noOfShifts() {
    if (this.scheduler.isMoreThanOneShift == "1") {
      this.isMoreThanOneShift = true;
    } else {
      this.isMoreThanOneShift = false;
      this.scheduler.numberOfShifts = "";
    }
  }
  updateWeeklyHours() {
    this.scheduler.weeklyHours = 0;
  }
  onNumberOfShiftsChange(selectedOption: { label: string, value: string }) {
    // Access the 'value' property of the selected option
    const number = parseInt(selectedOption.value, 10);
    this.filteredShifts = this.thisShift.slice(0, number);
}

  onSubmit(formData: any) {
    this.scheduler.scheduleStartDate = this.scheduler.newScheduleStartDate;
    this.schedulerService
      .AddScheduler(this.scheduler)
      .subscribe((response) => {
          //generated schedule
          this.dataFromApi = response.item2;
          //input parameters
          this.scheduler = response.item1;
          this.submittedScheduledId = this.scheduler.id;
          this.isAlreadySubmitted = response.item1.isSubmitted;
          if(this.scheduler.isMoreThanOneShift == "" ||this.scheduler.isMoreThanOneShift == null){
            this.scheduler.numberOfShifts = "";
          }
          this.scheduler.isMoreThanOneShift =
          response.item1.isMoreThanOneShift.toString().toLowerCase() == "true"
            ? "1"
            : "0";
        this.scheduler.isSpecificDoor =
          response.item1.isSpecificDoor.toString().toLowerCase() == "true"
            ? "1"
            : "0";
          this.scheduler.newScheduleStartDate = this.scheduler.scheduleStartDate;
          const excludedIndices = [0, 4, 8, 12, 16, 20, 24];

        //filtered the schedule data to remove empty fields
        const filteredData = this.dataFromApi
          .map((row, rowIndex) => {
            if (rowIndex === 1) {
              return row.filter((cell) => cell !== "");
            }else if(rowIndex >= 2) {
              // Remove items at specified indices for rowIndex 2 and beyond
              return row.filter((cell, index) => !excludedIndices.includes(index));
            } else {
              return row;
            }
          })
          .filter((row) => row.some((cell) => cell !== ""));
        this.data = filteredData;
        this.headertext = this.data.length > 0;

      });
      this.isScheduleGenerated = true;
  }

 //update the isSubmit value
 SubmittedBySuperAdmin() {
  this.schedulerService
    .UpdateSubmitBySuperAdmin(this.submittedScheduledId)
    .subscribe((response: Scheduler) => {
      this.scheduler = response;
      this.isAlreadySubmitted = response.isSubmitted;
      this.scheduler.newScheduleStartDate = this.scheduler.scheduleStartDate;
      // this.scheduler.scheduleStartDate = this.dateAdapter.toModel(
      //   this.fromModelResponse(
      //     response.scheduleStartDate.toString().split("T")[0]
      //   )
      // );
      this.scheduler.isMoreThanOneShift =
        response.isMoreThanOneShift.toString().toLowerCase() == "true"
          ? "1"
          : "0";
      this.scheduler.isSpecificDoor =
        response.isSpecificDoor.toString().toLowerCase() == "true"
          ? "1"
          : "0";

          this.isView = "1";
          this.toastr.success("Schedule Submitted Successfully");

    });
}
 //to get date in proper format
 fromModelResponse(value: string | null): NgbDateStruct | null {
  if (value) {
    const date = value.split("-");
    return {
      month: parseInt(date[1]),
      day: parseInt(date[2]),
      year: parseInt(date[0]),
    };
  }
  return null;
}

exportAsPDF(div_id)
{
  let data = document.getElementById(div_id);
  html2canvas(data).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
    // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
    pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
    pdf.save('Schedule.pdf');
  });
}

exportexcel(): void
{
  /* pass here the table id */
  let element = document.getElementById('excel-table');
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */
  XLSX.writeFile(wb, this.fileNameExcel);

}

}




