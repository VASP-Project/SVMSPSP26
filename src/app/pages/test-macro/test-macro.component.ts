import { Component, OnInit } from "@angular/core";
import { InputParameters } from "./test_macro";
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TestMacroService } from "../../pages/test-macro/test_macro.service";
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
} from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import jspdf from "jspdf";
import html2canvas from "html2canvas";

type AOA = any[][];

@Component({
  selector: "app-test-macro",
  templateUrl: "./test-macro.component.html",
  styleUrls: ["./test-macro.component.scss"],
})
export class TestMacroComponent implements OnInit {
  data: AOA = [];
  wopts: XLSX.WritingOptions = { bookType: "xlsx", type: "array" };
  fileName: string = "SheetJS.xlsx";
  dataFromApi = [];
  isMoreThanOneShift: boolean = false;
  user: any;
  scheduledId: number = 0;
  view: boolean = false;
  inputParameters = new InputParameters();
  submittedScheduledId: number;
  isScheduleVerified: string;
  isSubmitted: boolean = false;
  isSuperAdmin: boolean = false;
  isTsaApprover: boolean = false;
  isTsaScheduler:boolean = false;
  isTsaUser: boolean = false;
  isSecurity:boolean = false;
  formattedDataResponse: any;
  isAlreadySubmitted: boolean = false;
  isAlreadyVerified: boolean = false;
  isScheduleGenerated: boolean = false;
  scheduleId: number;
  isView: string;
  isAWSScheduler: boolean = false;
  isStaffAdmin: boolean = false;
  isIssuer: boolean = false;
  isShow: boolean = true;
  headertext:boolean = false;

  fileNameExcel= 'ExcelSheet.xlsx';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private testMacroService: TestMacroService,
    private route: ActivatedRoute,
    private dateAdapter: NgbDateAdapter<string>,
    private ngbCalendar: NgbCalendar,
    private datePipe: DatePipe,
    
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
  ];
  updateWeeklyHours() {
    this.inputParameters.weeklyHours = 0;
  }
  ngOnInit(): void {
    //this.calculateTotalHours();
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
    this.inputParameters.submittedBy = this.user.name;
    this.inputParameters.approvedBy = this.user.name;
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
  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      // console.log(value)
      const date = value.split("-");
      return {
        month: parseInt(date[0], 10),
        day: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }
  hideaddform() {
    this.router.navigate(["/admin/testmacrolist"]);
  }
  public noOfShifts() {
    if (this.inputParameters.isMoreThanOneShift == "1") {
      this.isMoreThanOneShift = true;
    } else {
      this.isMoreThanOneShift = false;
      this.inputParameters.numberOfShifts = "";
    }
  }
  //to calculate the hours
  calculateTotalHours() {
    const shift1EndTime = this.inputParameters.shift1EndTime;
    const shift1StartTime = this.inputParameters.shift1StartTime;
    const shift1Hours = shift1EndTime - shift1StartTime;
    this.inputParameters.shift1Hours = shift1Hours; //Calculate Hours in shift 1

    const shift2EndTime = this.inputParameters.shift2EndTime;
    const shift2StartTime = this.inputParameters.shift2StartTime;
    const shift2Hours = shift2EndTime - shift2StartTime;
    this.inputParameters.shift2Hours = shift2Hours; //Calculate Hours in shift 2

    const shift3EndTime = this.inputParameters.shift3EndTime;
    const shift3StartTime = this.inputParameters.shift3StartTime;
    const shift3Hours = shift3EndTime - shift3StartTime;
    this.inputParameters.shift3Hours = shift3Hours; //Calculate Hours in shift 3

    // Calculate total hours
    this.inputParameters.totalHours =
      this.inputParameters.shift1Hours +
      this.inputParameters.shift2Hours +
      this.inputParameters.shift3Hours;

    // Calculate total burden
    this.inputParameters.totalBurden =
      this.inputParameters.shift1Burden +
      this.inputParameters.shift2Burden +
      this.inputParameters.shift3Burden;
  }

  //saves the input parameters and generated schedule to database
  onSubmit(formData: any) {
    this.inputParameters.scheduleStartDate = this.inputParameters.newScheduleStartDate;
    this.inputParameters.scheduleStartDate = this.dateAdapter.toModel(this.fromModel(this.inputParameters.scheduleStartDate));
    if (this.inputParameters.isMoreThanOneShift == "0") {
      this.inputParameters.numberOfShifts = "";
    }
    this.testMacroService
      .AddInputParameters(this.inputParameters)
      .subscribe((response) => {
        //generated schedule
        this.dataFromApi = response.item2;
        //input parameters
        this.inputParameters = response.item1;
        this.isAlreadySubmitted = response.item1.isSubmitted;
        this.submittedScheduledId = this.inputParameters.id;
        this.inputParameters.isMoreThanOneShift =
          response.item1.isMoreThanOneShift.toString().toLowerCase() == "true"
            ? "1"
            : "0";
        this.inputParameters.isSpecificDoor =
          response.item1.isSpecificDoor.toString().toLowerCase() == "true"
            ? "1"
            : "0";
        this.inputParameters.scheduleStartDate = this.dateAdapter.toModel(
          this.fromModelResponse(
            response.item1.scheduleStartDate.toString().split("T")[0]
          )
        );
        this.inputParameters.newScheduleStartDate = this.inputParameters.scheduleStartDate;
        //filtered the schedule data to remove empty fields
        const filteredData = this.dataFromApi
          .map((row, rowIndex) => {
            if (rowIndex === 1) {
              return row.filter((cell) => cell !== "");
            } else {
              return row;
            }
          })
          .filter((row) => row.some((cell) => cell !== ""));
        this.data = filteredData;
        if(this.data[1].length == 1){
          this.headertext = true
        }else{
          this.headertext = false
        }
        //this.spinner.hide();
        this.toastr.success("Schedule Generated Successfully");
        this.router.navigate(["/admin/testmacro"]);
        this.isScheduleGenerated = true;
      });
  }

  //update the isSubmit value
  SubmittedBySuperAdmin() {
    this.testMacroService
      .UpdateSubmitBySuperAdmin(this.submittedScheduledId)
      .subscribe((response: InputParameters) => {
        this.inputParameters = response;
        this.isAlreadySubmitted = response.isSubmitted;
        this.inputParameters.scheduleStartDate = this.inputParameters.newScheduleStartDate
        this.inputParameters.scheduleStartDate = this.dateAdapter.toModel(
          this.fromModelResponse(
            response.scheduleStartDate.toString().split("T")[0]
          )
        );
        this.inputParameters.isMoreThanOneShift =
          response.isMoreThanOneShift.toString().toLowerCase() == "true"
            ? "1"
            : "0";
        this.inputParameters.isSpecificDoor =
          response.isSpecificDoor.toString().toLowerCase() == "true"
            ? "1"
            : "0";
        this.isView = "1";
        this.toastr.success("Schedule Submitted Successfully");
      });
  }
  showParams(item: any) {
    this.isShow = !this.isShow;
  }
  //update value of isverified and text to db
  verifiedByTSA() {
    const verifiedtext = this.inputParameters.verifiedText;
    this.inputParameters.approvedBy = this.user.name;
    this.inputParameters.approvedDate = this.datePipe.transform(
      new Date(),
      "MM-dd-yyyy"
    );
    if (verifiedtext == null) {
      this.toastr.error("Enter Notes");
    } else {
      this.testMacroService
        .UpdateVerifyByTSA(
          this.scheduleId,
          verifiedtext,
          this.inputParameters.approvedBy,
          this.inputParameters.approvedDate
        )
        .subscribe((response: InputParameters) => {
          this.inputParameters = response;
          this.isAlreadyVerified = response.isVerified;
          this.toastr.success("Schedule Approved Successfully");
        });
    }
  }

  //get all informaion about a schedule like input parameters and generated schedule data by ID
  private GetScheduleById(id: number) {
    //this.spinner.show();
    this.testMacroService.GetScheduleById(id).subscribe((response) => {
      //generated schedule data
      this.dataFromApi = response.item2;
      //input parameters
      this.inputParameters = response.item1;
      console.log(this.inputParameters);
      if (this.inputParameters.isVerified == false) {
        this.isScheduleGenerated = true;
      }
      this.inputParameters.isMoreThanOneShift =
        response.item1.isMoreThanOneShift.toString().toLowerCase() == "true"
          ? "1"
          : "0";
      this.inputParameters.isSpecificDoor =
        response.item1.isSpecificDoor.toString().toLowerCase() == "true"
          ? "1"
          : "0";
      this.inputParameters.scheduleStartDate = this.dateAdapter.toModel(
        this.fromModelResponse(
          response.item1.scheduleStartDate.toString().split("T")[0]
        )
      );
      this.inputParameters.newScheduleStartDate = this.inputParameters.scheduleStartDate;

      //filtered the schedule data to remove empty fields
      const filteredData = this.dataFromApi
        .map((row, rowIndex) => {
          if (rowIndex === 1) {
            return row.filter((cell) => cell !== "");
          } else {
            return row;
          }
        })
        .filter((row) => row.some((cell) => cell !== ""));
      this.data = filteredData;
      if(this.data[1].length == 1){
        this.headertext = true
      }else{
        this.headertext = false
      }
      
      //this.spinner.hide();
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
