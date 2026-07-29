import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  NgbDateAdapter,
  NgbCalendar,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  ScheduleDisplayRow,
  ScheduleItem,
  Scheduler,
  SchedulerSlotInfo,
} from "./Scheduler";
import { SchedulerService } from "./scheduler.service";
import html2canvas from "html2canvas";
import jspdf from "jspdf";
import * as XLSX from "xlsx";
import { InspectionTypeService } from "../master/inspectiontypes/inspectiontypes.service";
import { InspectionTypes } from "../master/inspectiontypes";

type AOA = any[][];

@Component({
  selector: "app-scheduler-add-edit",
  templateUrl: "./scheduler-add-edit.component.html",
  styleUrls: ["./scheduler-add-edit.component.scss"],
})
export class SchedulerAddEditComponent implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private schedulerService: SchedulerService,
    private route: ActivatedRoute,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe,
    private inspTypeService: InspectionTypeService,
  ) {}
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
  dates: string[] = [];

  //scheduleRows: ScheduleItem[] = [];
  scheduleRows: (ScheduleItem | null)[][] = [];
  slotData: SchedulerSlotInfo[] = [];
  scheduleGrid: { [date: string]: ScheduleDisplayRow[] } = {};
  maxRows = 0;
  isNewSchedule = false;
  inspectionStatuses: { [inspectionId: number]: string } = {};

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
  isTsaScheduler: boolean = false;
  isTsaUser: boolean = false;
  isSecurity: boolean = false;
  isIssuer: boolean = false;
  isView: string;
  scheduleId: number;
  scheduledId: number = 0;
  isScheduleVerified: string;
  view: boolean = false;
  isShow: boolean = true;
  headertext: boolean = false;
  fileNameExcel = "ExcelSheet.xlsx";
  allInspectionTypeDisplayNameList: InspectionTypes[];

  ngOnInit(): void {
    this.GetInspectionTypeList();
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
    this.isShow =
      this.route.snapshot.pathFromRoot[1].queryParams["isShow"] === "true";
    if (submitted == "true") {
      this.isAlreadySubmitted = true;
    }
    if (verified == "true") {
      this.isAlreadyVerified = true;
    }
    var checkIsnew =
      this.route.snapshot.pathFromRoot[1].queryParams["isNewSchedule"];
    if (checkIsnew == "true") {
      this.isNewSchedule = true;
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
      this.inspectionStatuses = response.item3 || {};
      // console.log(this.scheduler);
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
      this.headertext = true; // table has data

      if (
        this.dataFromApi &&
        this.dataFromApi.length > 2 &&
        this.dataFromApi[2].length > 0 &&
        this.dataFromApi[2].length % 10 === 0
      ) {
        this.isNewSchedule = true;
        this.buildScheduleRows();
      } else {
        this.isNewSchedule = false;

        const excludedIndices = [0, 4, 8, 12, 16, 20, 24];

        this.data = this.dataFromApi
          .map((row, rowIndex) => {
            if (rowIndex === 1) {
              return row.filter((cell) => cell !== "");
            }

            if (rowIndex >= 2) {
              return row.filter(
                (cell, index) => !excludedIndices.includes(index),
              );
            }

            return row;
          })
          .filter((row) => row.some((cell) => cell !== ""));
      }
    });
  }

  //update value of isverified and text to db
  verifiedByTSA() {
    const verifiedtext = this.scheduler.verifiedText;
    this.scheduler.approvedBy = this.user.name;
    this.scheduler.approvedDate = this.datePipe.transform(
      new Date(),
      "MM-dd-yyyy",
    );
    if (verifiedtext == null) {
      this.toastr.error("Enter Notes");
    } else {
      this.schedulerService
        .UpdateVerifyByTSA(
          this.scheduleId,
          verifiedtext,
          this.scheduler.approvedBy,
          this.scheduler.approvedDate,
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
  onNumberOfShiftsChange(selectedOption: { label: string; value: string }) {
    // Access the 'value' property of the selected option
    const number = parseInt(selectedOption.value, 10);
    this.filteredShifts = this.thisShift.slice(0, number);
  }

  onSubmit(formData: any) {
    this.scheduler.scheduleStartDate = this.scheduler.newScheduleStartDate;
    this.schedulerService.AddScheduler(this.scheduler).subscribe((response) => {
      //generated schedule
      this.dataFromApi = response.item2;
      //input parameters
      this.scheduler = response.item1;
      this.submittedScheduledId = this.scheduler.id;
      this.isAlreadySubmitted = response.item1.isSubmitted;
      if (
        this.scheduler.isMoreThanOneShift == "" ||
        this.scheduler.isMoreThanOneShift == null
      ) {
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
      this.buildScheduleRows();
      this.isNewSchedule = true;
      //   const excludedIndices = [0, 4, 8, 12, 16, 20, 24];

      // //filtered the schedule data to remove empty fields
      // const filteredData = this.dataFromApi
      //   .map((row, rowIndex) => {
      //     if (rowIndex === 1) {
      //       return row.filter((cell) => cell !== "");
      //     }else if(rowIndex >= 2) {
      //       // Remove items at specified indices for rowIndex 2 and beyond
      //       return row.filter((cell, index) => !excludedIndices.includes(index));
      //     } else {
      //       return row;
      //     }
      //   })
      //   .filter((row) => row.some((cell) => cell !== ""));
      // this.data = filteredData;
      // this.headertext = this.data.length > 0;
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

  exportAsPDF(div_id) {
    let data = document.getElementById(div_id);
    html2canvas(data).then((canvas) => {
      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("l", "cm", "a4"); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      pdf.addImage(contentDataURL, "PNG", 0, 0, 29.7, 21.0);
      pdf.save("Schedule.pdf");
    });
  }

  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById("excel-table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    /* save to file */
    XLSX.writeFile(wb, this.fileNameExcel);
  }

  public GetInspectionTypeList() {
    this.inspTypeService.GetInspectionTypeList().subscribe(
      (response: InspectionTypes[]) => {
        this.allInspectionTypeDisplayNameList = response;
        this.allInspectionTypeDisplayNameList.sort((a, b) =>
          a.displayName > b.displayName ? 1 : -1,
        );
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
        //this.spinner.hide();
      },
    );
  }

  public goToEdit(slot: ScheduleItem) {
    const inspType = this.allInspectionTypeDisplayNameList.find(
      (x) => x.inspectionType === "AWS Inspection",
    );
    var editvalue: number = 0;
    if(slot.inspectionId > 0){
       editvalue = 1
    }else{
       editvalue = 0
    }

    this.router.navigate(["admin/inspection/details"], {
      queryParams: {
        isEdit: editvalue,
        inspTypeId: inspType.id,
        inspTypeName: inspType.inspectionType,
        facilityId: slot.facilityId,
        locationId: slot.locationId,
        scheduleDate: slot.scheduleDate,
        startTime: slot.startTime,
        schedulerId: this.scheduler.id,
        slotId: slot.slotId,
        fromScheduler: true,
        inspectionId: slot.inspectionId,
      },
      skipLocationChange: true,
    });
  }

  viewInspection(id: number) {
    this.router.navigate(["admin/inspection/details"], {
      queryParams: {
        isEdit: 1,
        inspectionId: id,
        fromScheduler: true,
      },
      skipLocationChange: true,
    });
  }

  buildScheduleRows() {
    this.dates = this.dataFromApi[1] || [];

    this.scheduleRows = [];

    for (let rowIndex = 2; rowIndex < this.dataFromApi.length; rowIndex++) {
      const row = this.dataFromApi[rowIndex];

      const scheduleRow: (ScheduleItem | null)[] = [];

      for (let i = 0; i < row.length; i += 10) {
        if (!row[i]) {
          scheduleRow.push(null);
          continue;
        }
        const inspectionId = row[i + 9] ? Number(row[i + 9]) : null;
        scheduleRow.push({
          slotId: row[i],
          facilityId: Number(row[i + 1]),
          locationId: Number(row[i + 2]),
          scheduleDate: row[i + 3],

          shift: row[i + 4],
          duration: row[i + 5],
          startTime: row[i + 6],
          endTime: row[i + 7],
          door: row[i + 8],

          inspectionId: row[i + 9] || null,
          inspectionStatus: inspectionId
        ? this.inspectionStatuses[inspectionId]
        : null
        });
      }

      this.scheduleRows.push(scheduleRow);
    }

    this.headertext = this.scheduleRows.length > 0;
  }
}
