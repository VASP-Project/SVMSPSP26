import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import {
  CitationDetails,
  CitationDetailsTableLabels,
  GraphModel,
  MonthlyCitationDetails,
} from "../novlist/CitationDetails";
import { NovService } from "../novlist/nov.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from "@angular/router";
import {
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  SingleDataSet,
} from "ng2-charts";
import * as pluginLabels from "chartjs-plugin-labels";
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Subject } from "rxjs";
import { IDropdownSettings } from "ng-multiselect-dropdown";
// import { BsModalRef, BsModalService } from "ngx-bootstrap";
import {
  ModalDismissReasons,
  NgbCalendar,
  NgbDateAdapter,
  NgbDateStruct,
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import {
  Company,
  LineChartModel,
  LineChartLabelModel,
} from "../master/company";
import { CompanyService } from "../master/company/company.service";
import { ViolationTypesService } from "../master/violationtypes/violationtype.service";
import { ViolationTypes } from "../master/violationtypes";
import { CitationReasons } from "../master/citationreasons";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { CaseStatus } from "@app/app.component";
import {
  DashboardDates,
  InspectionDashBoard,
  InspectionDisplayNameWithCompany,
  InspectionSearch,
} from "./dashboard";
import { InspectionTypes } from "../master/inspectiontypes";
import { InspectionTypeService } from "../master/inspectiontypes/inspectiontypes.service";
import { InspectionrecordService } from "../inspectionrecord/inspectionrecord.service";
import { IncidentLocations, IncidentTypes, IncidentreportDetail } from "../incidentreport/incidentreport.model";
import { MapService } from "../map/map.service";
import { IncidentReportService } from "../incidentreport/incidentreport.service";
import { IncidentrecordModule } from "../incidentreport/incidentrecord.module";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { CitationReasonsService } from "../master/CitationReasons/citationreasons.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("canvas", { static: true }) canvasRef: ElementRef;

  // modalRef: BsModalRef;
  @ViewChild("template") modalContent: TemplateRef<any>;
  modalOptions: NgbModalOptions;
  selectedcompayName: string = "";
  selectedMonth: string = "";
  user: any;
  isShow: boolean = true;
  citationList: CitationDetails[];
  totalcitations: number = 0;
  openCitationCount: number = 0;
  submitCitationCount: number = 0;
  inProcessCitationCount: number = 0;
  PendingCitationCount: number = 0;
  closedCitationCount: number = 0;
  returnedToIssuerCitationCount: number = 0;
  returnedToASCitationCount: number = 0;

  totaloverduecitations: number = 0;
  overduesubmitCitationCount: number = 0;
  overdueinProcessCitationCount: number = 0;
  overduePendingCitationCount: number = 0;
  overduereturnedToIssuerCitationCount: number = 0;
  overduereturnedToASCitationCount: number = 0;

  openIncidentCount: number = 0;
  submitIncidentCount: number = 0;
  closedIncidentCount: number = 0;
  returnedIncidentCount: number = 0;
  incidentList:IncidentreportDetail[]
  totalincidents: number = 0;

  year: number = 0;
  filterString = "";
  filtered;
  allCompanyList: Company[];
  allCompanyListForLineChart: Company[];
  selectedCompanyList: Company[];
  selectedCompanyListForLineChart: Company[];
  //selectedCompanyNameList: string[] = [];
  selectedCompanyNameListForLineChart: string[] = [];
  selectedCompanyIdList: number[] = [];
  companyDropdownSettings: {};
  companyDropdownSettingsForLineChart: {};
  allViolationTypes: ViolationTypes[];
  selectedViolationTypes: ViolationTypes[];
  selectedViolationTypeNames: string[] = [];
  selectedViolationTypesId: number[] = [];
  violationTypeDropdownSettings: {};
  allCitationReasons: CitationReasons[];
  allCitationReasonsToBind: CitationReasons[];
  selectedCitationReasons: CitationReasons[];
  selectedCitationReasonIds: number[];
  citationReasonDropdownSettings: {};
  graphData: GraphModel[] = [];
  // lineChartModelData: LineChartModel[] = [];
  lineChartModelData: Object[] = [];
  selectedTrend: string = "1m";
  selectedCompanyCriteria: string = "top 5";
  dashboardDates: DashboardDates = new DashboardDates();
  fromDate: string = "";
  toDate: string = "";
  tableDataFromDate: string = "";
  tableDataToDate: string = "";
  incidentLocationList: IncidentLocations[];
  incidentLocations = new IncidentLocations();  
  incidentlineChartModelData:Object[] = []
  selectedIncidentTypeCriteria: string = "top 5"
  selectedIncidentTypeListForLineChart: string[] = []
  incidentTypeList:IncidentTypes[] = [];
  selectedIncidentTypeForLinehart:IncidentTypes[] = []
  selectedIncidentListForLineChart: string[] = [];
  incidentDropdownSettingsForLineChart: {};

  public monthlyCitationDetailsLabels: Array<any> = [
    "Violation Type",
    "Citation Reason",
    "Citation Count",
    "Draft",
    "Submitted",
    "Returned to Issuer",
    "Assigned",
    "Returned to AS",
    "Review",
    "Closed",
  ];
  public monthlyCitationDetails: MonthlyCitationDetails[] = [];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: "bottom" },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          // const label = ctx.chart.data.labels[ctx.dataIndex];
          return value;
        },
      },
    },
  };
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        "white",
        "yellow",
        "#faebd7",
        "#93ed89",
        "#ff8c69",
        "#ffa726",
        "#cacaca",
      ],
      borderColor: [
        "black",
        "black",
        "black",
        "black",
        "black",
        "black",
        "black",
      ],
      borderWidth: 0.25,
    },
  ];
  public pieChartLabels: Label[] = [
    ["Draft"],
    ["Submitted"],
    ["Returned to Issuer"],
    "Assigned",
    ["Returned to AS"],
    ["Review"],
    "Closed",
  ];
  public pieChartData: SingleDataSet = [300, 500, 200, 100, 150, 250, 8];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  //pieChartLabels: Label[];
  public pieChartPlugins = [pluginLabels];

  //{ data: [0, 59, 80, 81, 56, 55, 40], label: 'Series A' }
 //#region 
  //Overdue piechart
  overduepieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: "bottom" },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          // const label = ctx.chart.data.labels[ctx.dataIndex];
          return value;
        },
      },
    },
  };
  public overduepieChartColors: Array<any> = [
    {
      backgroundColor: ["yellow", "#faebd7", "#93ed89", "#ff8c69", "#ffa726"],
      borderColor: ["black", "black", "black", "black", "black"],
      borderWidth: 0.25,
    },
  ];
  public overduepieChartLabels: Label[] = [
    ["Submitted-Overdue"],
    ["Returned to Issuer-Overdue"],
    "Assigned-Overdue",
    ["Returned to AS-Overdue"],
    ["Review-Overdue"],
  ];
  public overduepieChartData: SingleDataSet = [300, 500, 200, 100, 150, 250, 8];
  public overduepieChartType: ChartType = "pie";
  public overduepieChartLegend = true;
  public overduepieChartPlugins = [pluginLabels];
  //#endregion

//------------------------------------------------------------------------------
//#region Incident pie chart
  incidentpieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: "bottom" },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {          
          return value;
        },
      },
    },
  };

  public incidentpieChartColors: Array<any> = [
    {
      backgroundColor: [
        "white",
        "yellow",
        "#faebd7",
        
        "#cacaca",
      ],
      borderColor: [
        "black",
        "black",
        "black",
        "black",
        
      ],
      borderWidth: 0.25,
    },
  ];
  public incidentpieChartLabels: Label[] = [
    ["Draft"],
    ["Submitted"],
    ["Returned "],    
    ["Closed"],
  ];
  public incidentpieChartData: SingleDataSet = [300, 500, 200, 8];
  public incidentpieChartType: ChartType = "pie";
  public incidentpieChartLegend = true;  
  public incidentpieChartPlugins = [pluginLabels];

//#endregion
  // lineChart
  public lineChartData: Array<any> = [];
  public lineChartDataTable: Array<any> = [];
  public lineChartLabels: Array<any> = [];
  public tableDataLabels: Array<any> = [];

  // public monthNames: Array<any> = ['Jan', 'Feb', 'Mar', 'Aprl', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  //public monthNamesArray: Array<any> = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
  public monthNamesArray: Array<any> = [];
  //public lineChartLabelsTable: Array<any> = ['Company', 'Jan', 'Feb', 'Mar', 'Aprl', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  public lineChartOptions: any = {
    responsive: true,
    borederWidth: 1,
    // maintainAspectRatio: false,
    scales: {
      //you're missing this
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Count",
          },
          ticks: {
            stepSize: 2,
            beginAtZero: true,
          },
        },
      ],
    },
    legend: { position: "bottom" }, //END scales
  };
  public lineChartColors: Array<any> = [
    // { // grey
    //   backgroundColor: 'red',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = "line";
//----------------------------------------------
//#region Incident Line Chart
  public incidentlineChartData: Array<any> = [];
  public incidentlineChartDataTable: Array<any> = [];
  public incidentlineChartLabels: Array<any> = [];
  public incidenttableDataLabels: Array<any> = [];

  //public monthNamesArray: Array<any> = [];
 
  public incidentlineChartOptions: any = {
    responsive: true,
    borederWidth: 1,
    // maintainAspectRatio: false,
    scales: {
      //you're missing this
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "Count",
          },
          ticks: {
            stepSize: 2,
            beginAtZero: true,
          },
        },
      ],
    },
    legend: { position: "bottom" }, //END scales
  };
  public incidentlineChartColors: Array<any> = [   
  ];
  public incidentlineChartLegend: boolean = true;
  public incidentlineChartType: string = "line";
//#endregion
  closeResult: string;

  companies = [
    { label: "Top 5", value: "top 5" },
    { label: "Top 10", value: "top 10" },
    { label: "All", value: "all" },
  ];

  trendsBy = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 15 Days", value: "15d" },
    { label: "Last 1 Month", value: "1m" },
    { label: "Last 3 Months", value: "3m" },
    { label: "Last 6 Months", value: "6m" },
    { label: "Last 1 Year", value: "1y" },
  ];

  public on = true;
  public off = true;
  showAll: boolean = false;
  inspectiontypes: InspectionTypes[];
  inspectionDashBoard: InspectionDashBoard[];
  isSelected: boolean = true;

  visible: boolean = false;
  visibleCategory: boolean = false;
  fromToDates: InspectionSearch = new InspectionSearch();
  fromDateInsp: string = "";
  toDateInsp: string = "";
  showCitation: boolean = false;
  showIncident: boolean = false;
  showInsp: boolean = false;
  showhideOverdue: boolean = false;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  mapSprite: HTMLImageElement;

  readonly DELIMITER = "/";

  constructor(
    // private modalService: BsModalService,
    private modalService: NgbModal,
    private NovService: NovService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private router: Router,
    private CompanyService: CompanyService,
    private ViolationTypesService: ViolationTypesService,
    private CitationReasonsServicse: CitationReasonsService,
    private toastr: ToastrService,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    private inspectionTypeService: InspectionTypeService,
    private inspectionrecordService: InspectionrecordService,
    private mapService: MapService,
    private incidentreportservice: IncidentReportService, private appURL: AppConfigService,
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.showCitation = true;
    //this.onFilterChange();
   
    this.dropdownList = [
      { item_id: 1, item_text: "Violation type 1" },
      { item_id: 2, item_text: "Violation type 2" },
      { item_id: 3, item_text: "Violation type 3" },
      { item_id: 4, item_text: "Violation type 4" },
      { item_id: 5, item_text: "Violation type 5" },
    ];
    this.selectedItems = [
      { item_id: 3, item_text: "Violation type 3" },
      { item_id: 4, item_text: "Violation type 4" },
    ];

    this.companyDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "companyName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.companyDropdownSettingsForLineChart = {
      singleSelection: false,
      idField: "id",
      textField: "companyName",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    this.violationTypeDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "violationType",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.citationReasonDropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "reason",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };

    this.incidentDropdownSettingsForLineChart = {
      singleSelection: false,
      idField: "id",
      textField: "incidentType",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.year = new Date().getFullYear(); // - 1;
    this.user = JSON.parse(sessionStorage.getItem("currentUser"));

    this.fromToDates.toDateInsp = this.dateAdapter.toModel(
      this.ngbCalendar.getToday()
    );
    this.fromToDates.fromDateInsp = this.dateAdapter.toModel(
      this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), "d", 90)
    );

    this.GetInspectionDashboardData();

    if(this.appURL.getLoginMethod() != 'Azure' && this.appURL.getLoginMethod() != 'Okta'){
      if (!this.user.passwordReseted) {
        //this.spinner.hide();
        this.router.navigate(['admin/changepassword']);
      }
    }    
    if (this.user.rolename == "StaffAdmin") {
      this.isShow = true;
      this.GetCompanyList();
      this.GetViolationTypeList();
      this.GetCitationReasonList();
      this.GetCitationList(0);
      // this.GetLabelsForTable();
      this.BindLineChartLabelsData("top 5", "1m");
      this.GetInspectionTypeList();
      this.GetOverdueCitationList(0);
      this.GetIncidentList(0);
      this.BindIncidentLineChartLabelsData("top 5", "1m")
      this.GetIncidentTypeList();
    } else this.isShow = false;
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }

  onFilterChange() {
    this.filtered = this.lineChartDataTable.filter((invoice) =>
      this.isMatch(invoice)
    );
  }

  isMatch(item) {
    if (item instanceof Object) {
      return Object.keys(item).some((k) => this.isMatch(item[k]));
    } else {
      return item.toString().indexOf(this.filterString) > -1;
    }
  }
  clickhere(d: any) {
    alert(d);
  }
  public GetCitationList(companyId) {
    //this.spinner.show();
    this.NovService.GetCitationDetailsForDashboard(companyId).subscribe(
      (response: CitationDetails[]) => {
        this.citationList = response;
        this.totalcitations = this.citationList.length;
        this.openCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.Open
        ).length;
        this.submitCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.Submitted
        ).length;
        this.inProcessCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.InProcess
        ).length;
        this.PendingCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.PendingCompletion
        ).length;
        this.closedCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.Closed
        ).length;
        this.returnedToIssuerCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.ReturnedToIssuer
        ).length;
        this.returnedToASCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.ReturnedToAS
        ).length;
        this.pieChartData = [
          this.openCitationCount,
          this.submitCitationCount,
          this.returnedToIssuerCitationCount,
          this.inProcessCitationCount,
          this.returnedToASCitationCount,
          this.PendingCitationCount,
          this.closedCitationCount,
        ];
        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public GetOverdueCitationList(companyId) {
    //this.spinner.show();
    this.NovService.GetOverdueCitationDetailsForDashboard(companyId).subscribe(
      (response: CitationDetails[]) => {
        this.citationList = response;
        this.totaloverduecitations = this.citationList.length;
        this.overduesubmitCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.Submitted
        ).length;
        this.overdueinProcessCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.InProcess
        ).length;
        this.overduePendingCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.PendingCompletion
        ).length;
        this.overduereturnedToIssuerCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.ReturnedToIssuer
        ).length;
        this.overduereturnedToASCitationCount = this.citationList.filter(
          (c) => c.currentCitationStatusId == CaseStatus.ReturnedToAS
        ).length;
        this.overduepieChartData = [
          this.overduesubmitCitationCount,
          this.overduereturnedToIssuerCitationCount,
          this.overdueinProcessCitationCount,
          this.overduereturnedToASCitationCount,
          this.overduePendingCitationCount,
        ];
      }
    );
  }

  openModal(template: TemplateRef<any>, citation, id) {
    this.selectedcompayName = citation.data[0];
    if (this.monthNamesArray.length > 0) {
      this.selectedMonth = this.monthNamesArray[id - 1];
    }
    if (this.selectedMonth !== undefined) {
      if (citation.data[id] > 0) {
        var selectedMonthName = "";
        var selectedYear = "";

        var selectedMonthNameAndYear = this.selectedMonth.split("-");
        if (selectedMonthNameAndYear.length > 0) {
          selectedMonthName = selectedMonthNameAndYear[0];
          selectedYear = selectedMonthNameAndYear[1];
        }

        if (this.tableDataFromDate == null) {
          this.tableDataFromDate = "";
        }
        if (this.tableDataToDate == null) {
          this.tableDataToDate = "";
        }

        this.getMonthlyCitationDetails(
          selectedYear,
          this.selectedcompayName,
          selectedMonthName,
          this.tableDataFromDate,
          this.tableDataToDate
        );
        // this.modalRef = this.modalService.show(template, { class: "modal-lg" });

        this.modalService.open(template, { size: "xl" }).result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  public getMonthlyCitationDetails(
    year,
    companyName,
    selectedMonth,
    selectedFromDate,
    selectedToDate
  ) {
    //this.spinner.show();

    this.NovService.GetMonthlyCitationDetails(
      year,
      companyName,
      selectedMonth,
      selectedFromDate,
      selectedToDate
    ).subscribe(
      (response: MonthlyCitationDetails[]) => {
        //console.log(response);
        this.monthlyCitationDetails = response;
        if (this.selectedViolationTypeNames !== undefined) {
          if (this.selectedViolationTypeNames.length > 0) {
            this.monthlyCitationDetails = this.monthlyCitationDetails.filter(
              (obj) =>
                this.selectedViolationTypeNames.includes(obj.violationType)
            );
          }
        }

        if (this.selectedCitationReasonIds !== undefined) {
          if (this.selectedCitationReasonIds.length > 0) {
            this.monthlyCitationDetails = this.monthlyCitationDetails.filter(
              (obj) =>
                this.selectedCitationReasonIds.includes(obj.citationResonId)
            );
          }
        }
        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public GetTableData() {
    //this.GetGraphData();
    this.GetLabelsForTable();
  }

  ValidateDates(selectedFromDate: string, selectedToDate: string) {
    var validDates = true;
    if (selectedToDate < selectedFromDate) {
      validDates = false;
    }
    return validDates;
  }

  convertDate(date): string {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : "";
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

  public GetLabelsForTable() {
    //this.spinner.show();
    this.tableDataLabels = [];
    this.monthNamesArray = [];

    var selectedFromDate = "";
    var selectedToDate = "";

    if (this.dashboardDates.fromDate !== null) {
      if (this.dashboardDates.fromDate !== "") {
        // this.dashboardDates.fromDate = this.dateAdapter.toModel(this.fromModel(this.dashboardDates.fromDate))
        let fromDate = this.dateAdapter.toModel(
          this.fromModel(this.dashboardDates.fromDate)
        );
        selectedFromDate = this.datePipe.transform(fromDate, "yyyy-MM-dd");
      }
    }

    if (this.dashboardDates.toDate !== null) {
      if (this.dashboardDates.toDate !== "") {
        //this.dashboardDates.toDate = this.dateAdapter.toModel(this.fromModel(this.dashboardDates.toDate))
        let toDate = this.dateAdapter.toModel(
          this.fromModel(this.dashboardDates.toDate)
        );
        selectedToDate = this.datePipe.transform(toDate, "yyyy-MM-dd");
      }
    }

    if (selectedFromDate !== "" && selectedToDate !== "") {
      var isValidDates = this.ValidateDates(selectedFromDate, selectedToDate);
      if (isValidDates == false) {
        this.toastr.error(
          "'To Date' should be greater than 'From Date.'",
          "Error"
        );
        this.lineChartDataTable = [];
        //this.spinner.hide();
        return;
      }
    } else if (selectedFromDate == "" && selectedToDate !== "") {
      this.toastr.error("Please select 'From Date.'", "Error");
      this.lineChartDataTable = [];
      //this.spinner.hide();
      return;
    } else if (selectedFromDate !== "" && selectedToDate == "") {
      this.toastr.error("Please select 'To Date'", "Error");
      this.lineChartDataTable = [];
      //this.spinner.hide();
      return;
    }

    this.tableDataFromDate = selectedFromDate;
    this.tableDataToDate = selectedToDate;

    this.NovService.GetCitationDetailsTableDataLabels(
      selectedFromDate,
      selectedToDate
    ).subscribe(
      (response: CitationDetailsTableLabels[]) => {
        //console.log(response);
        this.tableDataLabels.push("Company");
        response.forEach((element) => {
          this.tableDataLabels.push(element.columnName);
          this.monthNamesArray.push(element.columnName);
        });
        this.GetCitationDetailsTableData(selectedFromDate, selectedToDate);
        ////this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public GetCitationDetailsTableData(
    selectedFromDate: string,
    selectedToDate: string
  ) {
    //this.spinner.show();

    var companyIdList = "";
    if (this.selectedCompanyIdList !== undefined) {
      if (this.selectedCompanyIdList.length > 0) {
        companyIdList = this.selectedCompanyIdList.join(",");
      }
    }

    var violationTypeIdList = "";
    if (this.selectedViolationTypesId !== undefined) {
      if (this.selectedViolationTypesId.length > 0) {
        violationTypeIdList = this.selectedViolationTypesId.join(",");
      }
    }

    var citationReasonIdList = "";
    if (this.selectedCitationReasonIds !== undefined) {
      if (this.selectedCitationReasonIds.length > 0) {
        citationReasonIdList = this.selectedCitationReasonIds.join(",");
      }
    }

    this.NovService.GetCitationDetailsTableData(
      selectedFromDate,
      selectedToDate,
      companyIdList,
      violationTypeIdList,
      citationReasonIdList
    ).subscribe(
      (response) => {
        //console.log(response);

        this.lineChartDataTable = [];
        response.forEach((element) => {
          var tableDataArray: Array<any> = [];
          if (this.tableDataLabels.length > 0) {
            this.tableDataLabels.forEach((label) => {
              tableDataArray.push(element[label]);
            });
          }

          var ss = {
            data: tableDataArray,
            label: element["Company"],
            fill: false,
          };
          this.lineChartDataTable.push(ss);
        });

        this.onFilterChange();

        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  // public GetGraphData() {
  //   this.graphData = [];
  //   //this.spinner.show();
  //   this.NovService.GetCitationGraphData().subscribe((response: GraphModel[]) => {
  //     this.graphData = response;
  //     if(this.selectedCompanyNameList !== undefined) {
  //       if(this.selectedCompanyNameList.length > 0) {
  //         response = response.filter(obj => this.selectedCompanyNameList.includes(obj.companyName));
  //       }
  //     }

  //     if(this.selectedViolationTypesId !== undefined) {
  //       if(this.selectedViolationTypesId.length > 0) {
  //         response = response.filter(obj => this.selectedViolationTypesId.includes(obj.violationTypeId));
  //       }
  //     }

  //     if(this.selectedCitationReasonIds !== undefined) {
  //       if(this.selectedCitationReasonIds.length > 0) {
  //         response = response.filter(obj => this.selectedCitationReasonIds.includes(obj.citationResonId));
  //       }
  //     }

  //     var graphDataArray: GraphModel[] = [];
  //     if (response.length > 0) {
  //       response.reduce(function(res, value) {
  //         if (!res[value.companyName]) {
  //           res[value.companyName] = { companyName: value.companyName, january: 0, february: 0, march: 0, april: 0, may: 0, june: 0, july: 0, august: 0, september: 0, october: 0, november: 0, december: 0 };
  //           graphDataArray.push(res[value.companyName])
  //         }
  //         res[value.companyName].january += value.january;
  //         res[value.companyName].february += value.february;
  //         res[value.companyName].march += value.march;
  //         res[value.companyName].april += value.april;
  //         res[value.companyName].may += value.may;
  //         res[value.companyName].june += value.june;
  //         res[value.companyName].july += value.july;
  //         res[value.companyName].august += value.august;
  //         res[value.companyName].september += value.september;
  //         res[value.companyName].october += value.october;
  //         res[value.companyName].november += value.november;
  //         res[value.companyName].december += value.december;
  //         return res;
  //       }, {});
  //     }

  //     this.lineChartDataTable = [];
  //     graphDataArray.forEach(element => {
  //       // var ss = { data: [element.january, element.february, element.march, element.april, element.may, element.june, element.july, element.august, element.september, element.october, element.november, element.december], label: element.companyName, fill: false }
  //       // this.lineChartData.push(ss);
  //       var st = { data: [element.companyName, element.january, element.february, element.march, element.april, element.may, element.june, element.july, element.august, element.september, element.october, element.november, element.december], label: element.companyName, fill: false }
  //       this.lineChartDataTable.push(st);
  //     });

  //     this.onFilterChange();

  //     //this.spinner.hide();
  //   }, (error:any)=> {
  //     console.log("error list");
  //   });
  // }

  // events

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //Get Company List
  public GetCompanyList() {
    this.CompanyService.GetCompanyList().subscribe(
      (response: Company[]) => {
        //console.log(response);
        this.allCompanyList = response;
        this.allCompanyListForLineChart = response;
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public onCompanySelect(item: any) {
    //console.log(item);
    this.selectedCompanyList.push(item);
    this.selectedCompanyIdList.push(item.id);
    //this.selectedCompanyNameList.push(item.companyName);
    //this.GetGraphData();
  }

  public onCompanyDeselect(item: any) {
    //console.log(item);
    this.selectedCompanyList = this.selectedCompanyList.filter(
      (obj) => obj.id !== item.id
    );
    this.selectedCompanyIdList = this.selectedCompanyIdList.filter(
      (obj) => obj !== item.id
    );
    //this.selectedCompanyNameList = this.selectedCompanyNameList.filter(obj => obj !== item.companyName);
    //this.GetGraphData();
  }

  public onSelectAllCompanies(item: any) {
    this.selectedCompanyList = [];
    this.selectedCompanyIdList = [];
    //this.selectedCompanyNameList = [];
    item.forEach((element) => {
      this.selectedCompanyList.push(element);
      this.selectedCompanyIdList.push(element.id);
      //this.selectedCompanyNameList.push(element.companyName);
    });
    //this.GetGraphData();
  }

  public onDeSelectAllCompanies(item: any) {
    this.selectedCompanyList = [];
    this.selectedCompanyIdList = [];
    //this.selectedCompanyNameList = [];
    //console.log(item);
  }

  public GetViolationTypeList() {
    this.ViolationTypesService.GetViolationTypeList().subscribe(
      (response: ViolationTypes[]) => {
        //console.log(response);
        this.allViolationTypes = response.filter(x => x.status === true);
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public onViolationTypeSelect(item: any) {
    //console.log(item);
    this.selectedViolationTypes.push(item);
    this.selectedViolationTypeNames.push(item.violationType);
    this.selectedViolationTypesId.push(item.id);
    this.allCitationReasonsToBind = this.allCitationReasons.filter((obj) =>
      this.selectedViolationTypesId.includes(obj.violationTypeId)
    );
    //this.GetGraphData();
  }

  public onViolationTypeDeselect(item: any) {
    //console.log(item);
    this.selectedViolationTypes = this.selectedViolationTypes.filter(
      (obj) => obj.id !== item.id
    );
    this.selectedViolationTypeNames = this.selectedViolationTypeNames.filter(
      (obj) => obj !== item.violationType
    );
    this.selectedViolationTypesId = this.selectedViolationTypesId.filter(
      (obj) => obj !== item.id
    );
    this.allCitationReasonsToBind = this.allCitationReasons.filter((obj) =>
      this.selectedViolationTypesId.includes(obj.violationTypeId)
    );
    //this.GetGraphData();
  }

  public onSelectAllViolationTypes(item: any) {
    this.selectedViolationTypes = [];
    this.selectedViolationTypesId = [];
    this.selectedViolationTypeNames = [];
    item.forEach((element) => {
      this.selectedViolationTypes.push(element);
      this.selectedViolationTypesId.push(element.id);
      this.selectedViolationTypeNames.push(element.violationType);
      this.allCitationReasonsToBind = this.allCitationReasons.filter((obj) =>
        this.selectedViolationTypesId.includes(obj.violationTypeId)
      );
    });
    //this.GetGraphData();
  }

  public onDeSelectAllViolationTypes(item: any) {
    this.selectedViolationTypes = [];
    this.selectedViolationTypesId = [];
    this.selectedViolationTypeNames = [];
    this.allCitationReasonsToBind = [];
    this.selectedCitationReasons = [];
    this.selectedCitationReasonIds = [];
    //this.GetGraphData();
  }

  public GetCitationReasonList() {
    this.CitationReasonsServicse.GetCitationReasonList().subscribe(
      (response: CitationReasons[]) => {
        //console.log(response);
        this.allCitationReasons = response.filter(x=>x.status == true);
      },
      (error: any) => {
        console.log("error list");
      }
    );
  }

  public onCitationReasonSelect(item: any) {
    //console.log(item);
    this.selectedCitationReasons.push(item);
    this.selectedCitationReasonIds.push(item.id);
    //this.GetGraphData();
  }

  public onCitationReasonDeselect(item: any) {
    //console.log(item);
    this.selectedCitationReasons = this.selectedCitationReasons.filter(
      (obj) => obj.id !== item.id
    );
    this.selectedCitationReasonIds = this.selectedCitationReasonIds.filter(
      (obj) => obj !== item.id
    );
    //this.GetGraphData();
  }

  public onSelectAllCitationReasons(item: any) {
    this.selectedCitationReasons = [];
    this.selectedCitationReasonIds = [];
    item.forEach((element) => {
      this.selectedCitationReasons.push(element);
      this.selectedCitationReasonIds.push(element.id);
    });
    //this.GetGraphData();
  }

  public onDeSelectAllCitationReasons(item: any) {
    this.selectedCitationReasons = [];
    this.selectedCitationReasonIds = [];
    //this.GetGraphData();
  }

  public onCompanySelectForLineChart(item: any) {
    this.selectedCompanyListForLineChart.push(item);
    this.selectedCompanyNameListForLineChart.push(item.companyName);
  }

  public onCompanyDeselectForLineChart(item: any) {
    this.selectedCompanyListForLineChart =
      this.selectedCompanyListForLineChart.filter((obj) => obj.id !== item.id);
    this.selectedCompanyNameListForLineChart =
      this.selectedCompanyNameListForLineChart.filter(
        (obj) => obj !== item.companyName
      );
  }

  public onSelectAllCompaniesForLineChart(item: any) {
    this.selectedCompanyNameListForLineChart = [];
    item.forEach((element) => {
      this.selectedCompanyNameListForLineChart.push(element.companyName);
    });
  }

  public onDeSelectAllCompaniesForLineChart(item: any) {
    this.selectedCompanyListForLineChart = [];
    this.selectedCompanyNameListForLineChart = [];
  }

  // public onTrendsByChange(value: any) {
  //   this.GetLineChartData(value);
  // }

  public GetDataForLineChartByTrends() {
    if (this.selectedCompanyCriteria !== "all") {
      this.selectedCompanyListForLineChart = [];
      this.selectedCompanyNameListForLineChart = [];
    }
    this.BindLineChartLabelsData(
      this.selectedCompanyCriteria,
      this.selectedTrend
    );
  }

  public BindLineChartLabelsData(
    companyRecordLimit: string,
    selectedTrend: string
  ) {
    //this.spinner.show();
    this.lineChartLabels = [];
    this.CompanyService.GetLineChartLabelsData(selectedTrend).subscribe(
      (response: LineChartLabelModel[]) => {
        //console.log(response);
        response.forEach((element) => {
          this.lineChartLabels.push(element.columnName);
        });
        this.GetLineChartData(companyRecordLimit, selectedTrend);
        ////this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public GetLineChartData(companyRecordLimit: string, selectedTrend: string) {
    this.CompanyService.GetLineChartData(
      companyRecordLimit,
      selectedTrend
    ).subscribe(
      (response) => {
        //console.log(response);
        this.lineChartModelData = response;
        this.BindLineChartData();
        //this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public BindLineChartData() {
    this.lineChartData = [];

    if (this.selectedCompanyNameListForLineChart.length > 0) {
      this.lineChartModelData = this.lineChartModelData.filter((obj) =>
        this.selectedCompanyNameListForLineChart.includes(obj["CompanyName"])
      );
    }

    this.lineChartModelData.forEach((element) => {
      var lineChartDataArray: Array<any> = [];
      if (this.lineChartLabels.length > 0) {
        this.lineChartLabels.forEach((label) => {
          lineChartDataArray.push(element[label]);
        });
      }

      var ss = {
        data: lineChartDataArray,
        label: element["CompanyName"],
        fill: false,
      };
      this.lineChartData.push(ss);
    });
  }

  public ExportTableDataToCSV() {
    if (this.lineChartDataTable.length > 0) {
      var html = document.querySelector("#dtCitationData").outerHTML;
      this.export_table_to_csv(html, "Citation Data.csv");
    }
  }

  public export_table_to_csv(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++) row.push(cols[j].innerHTML);

      csv.push(row.join(","));
    }

    // Download CSV
    this.download_csv(csv.join("\n"), filename);
  }

  public download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], { type: "text/csv" });
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }
  /////Inspections///////////
//#region 
  public GetInspectionTypeList() {
    //this.spinner.show();
    this.inspectiontypes = [];
    this.inspectionTypeService.GetInspectionTypeList().subscribe(
      (response: InspectionTypes[]) => {
        this.inspectiontypes = response;
      },
      (error: any) => {
        this.toastr.error("Error while fetching Inspection Type", "Error");
        //this.spinner.hide();
      }
    );
  }
  public GetInspectionDashboardData() {
    var details = {
      FromDate: this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.fromDateInsp)
      ),
      ToDate: this.dateAdapter.toModel(
        this.fromModel(this.fromToDates.toDateInsp)
      ),
      // FromDate:this.fromToDates.fromDate,
      // ToDate: this.fromToDates.toDate
    };
    this.inspectionrecordService.GetInspectionDashboardData(details).subscribe(
      (response: InspectionDashBoard[]) => {
        this.inspectionDashBoard = response;

        this.inspectionDashBoard.forEach((element) => {
          let calculatedHours = 0;
          let calculatedMinutes = 0;
          let calculatedActiveCount = 0;
          element.inspectionDisplayNameWithCompany.forEach((item) => {
            calculatedHours = 0;
            calculatedMinutes = 0;
            calculatedActiveCount = 0;

            item.inspectionCompanys.forEach((data) => {
              calculatedHours = calculatedHours + data.hours;
              calculatedMinutes = calculatedMinutes + data.minutes;
              calculatedActiveCount = calculatedActiveCount + data.activeCount;
              //completedHours = completedHours+calculatedHours
            });
            item.calculatedActiveCount = calculatedActiveCount;
            if (calculatedMinutes >= 60) {
              let displayNameMinutes = Math.floor(calculatedMinutes / 60);
              var minutes = calculatedMinutes % 60;
              item.calculatedHours = calculatedHours + displayNameMinutes;
              item.calculatedMinutes = minutes;
            } else {
              item.calculatedHours = calculatedHours;
              item.calculatedMinutes = calculatedMinutes;
            }
          });
          let completedHours = 0;
          let completedMinutes = 0;
          let completedActiveCount = 0;
          element.inspectionDisplayNameWithCompany.forEach((hourdata) => {
            completedHours = completedHours + hourdata.calculatedHours;
            completedMinutes = completedMinutes + hourdata.calculatedMinutes;
            completedActiveCount =
              completedActiveCount + hourdata.calculatedActiveCount;
          });
          element.completedActiveCount = completedActiveCount;
          if (completedMinutes >= 60) {
            let displayMinutes = Math.floor(completedMinutes / 60);
            var minutes = completedMinutes % 60;
            element.completedHours = completedHours + displayMinutes;
          } else {
            element.completedHours = completedHours;
          }

          //completedHours = 0
        });
      },
      (error: any) => {
        this.toastr.error("Error while fetching Inspection Type", "Error");
        //this.spinner.hide();
      }
    );
  }
//#endregion
  onExpandAll() {
    this.on = this.on == true ? false : true;
    this.showAll = true;
  }
  onclickCateory(id: number, indexOfelement: number) {
    this.inspectionDashBoard[indexOfelement].isVisible =
      this.inspectionDashBoard[indexOfelement].isVisible == false
        ? true
        : false;
    // this.visible = !this.visible
  }

  onclickDisplayName(indexOfelement: number, indexelement: number) {
    this.inspectionDashBoard[indexOfelement].inspectionDisplayNameWithCompany[
      indexelement
    ].isComVisible =
      this.inspectionDashBoard[indexOfelement].inspectionDisplayNameWithCompany[
        indexelement
      ].isComVisible == false
        ? true
        : false;
    //this.visibleCategory = !this.visibleCategory
  }

  basicSearch() {
    this.GetInspectionDashboardData();
  }

  clearSearch() {
    this.fromToDates.toDateInsp = this.dateAdapter.toModel(
      this.ngbCalendar.getToday()
    );
    this.fromToDates.fromDateInsp = this.dateAdapter.toModel(
      this.ngbCalendar.getPrev(this.ngbCalendar.getToday(), "d", 90)
    );
    this.inspectionDashBoard = [];
    this.GetInspectionDashboardData();
  }
  showCitationData() {
    this.showCitation = true;
    this.showIncident = false;
    this.showInsp = false;
  }
  showInspectionData() {
    this.showCitation = false;
    this.showIncident = false;
    this.showInsp = true;
    this.GetInspectionDashboardData();
  }
  showIncidentData() {
    
    this.showCitation = false;
    this.showIncident = true;
    this.showInsp = false;
    this.canvas = this.canvasRef.nativeElement;
    this.context = this.canvas.getContext("2d");
    this.mapSprite = new Image();
    this.context.canvas.width = 100; this.context.canvas.height = 100; 
    this.mapSprite.src = "../../../assets/images/map.png";
    this.mapSprite.onload = () => {
      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;
      const maxCanvasWidth = Math.min(this.mapSprite.width);
      const maxCanvasHeight = Math.min(this.mapSprite.height);
      this.canvas.width = maxCanvasWidth;
      this.canvas.height = maxCanvasHeight;
      this.GetIncidentLocationList();
    };
  }
  // main(): void {
  //   this.draw();
  //   requestAnimationFrame(this.main.bind(this));
  // }

  draw(): void {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.mapSprite, 0, 0);
    for (const marker of this.incidentLocationList) {
      this.context.fillStyle = "red";
      this.context.beginPath();
      this.context.arc(marker.xcoordinate, marker.ycoordinate, 7, 0, 2 * Math.PI);
      this.context.fill();
    }
  }
  public GetIncidentLocationList() {
    this.mapService.GetIncidentLocationList().subscribe(
      (response: IncidentLocations[]) => {
        this.incidentLocationList = response;
        this.draw();
      },
      (error: any) => {
        this.toastr.error(`${error}`, "Error");
      }
    );
  }
  hideOverdue() {
    this.showhideOverdue = false;
  }
  hideOverduenov() {
    this.showhideOverdue = true;
    //this.GetInspectionDashboardData();
  }

//#region INCIDENT
  public GetIncidentList(inciId) {
    //this.spinner.show();
    this.incidentreportservice.GetIncidentDetailsForDashboard(inciId).subscribe(
      (response: IncidentreportDetail[]) => {
        this.incidentList = response;
        this.totalincidents = this.incidentList.length;
        this.openIncidentCount = this.incidentList.filter(
          (c) => c.incidentStatusDisplay == "Draft"
        ).length;
        this.submitIncidentCount = this.incidentList.filter(
          (c) => c.incidentStatusDisplay == "Submitted"
        ).length;
        
        this.returnedIncidentCount = this.incidentList.filter(
          (c) => c.incidentStatusDisplay == "Returned"
        ).length;
        this.closedIncidentCount = this.incidentList.filter(
          (c) => c.incidentStatusDisplay == "Closed"
        ).length;
       
        this.incidentpieChartData = [
          this.openIncidentCount,
          this.submitIncidentCount,
          this.returnedIncidentCount,          
          this.closedIncidentCount,
        ];
        
      },
      (error: any) => {
       
        console.log("error list");
      }
    );
  }

  public BindIncidentLineChartData() {
    this.incidentlineChartData = [];

    if (this.selectedIncidentListForLineChart.length > 0) {
      this.incidentlineChartModelData = this.incidentlineChartModelData.filter((obj) =>
        this.selectedIncidentListForLineChart.includes(obj["IncidentType"])
      );
    }

    this.incidentlineChartModelData.forEach((element) => {
      var incidentlineChartDataArray: Array<any> = [];
      if (this.incidentlineChartLabels.length > 0) {
        this.incidentlineChartLabels.forEach((label) => {
          incidentlineChartDataArray.push(element[label]);
        });
      }

      var ss = {
        data: incidentlineChartDataArray,
        label: element["IncidentType"],
        fill: false,
      };
      this.incidentlineChartData.push(ss);
    });
  }

  public GetIncidentLineChartData(incidentTypeLimit: string, selectedTrend: string) {
    this.incidentreportservice.GetIncidentLineChartData(
      incidentTypeLimit,
      selectedTrend
    ).subscribe(
      (response) => {        
        this.incidentlineChartModelData = response;
        this.BindIncidentLineChartData();        
      },
      (error: any) => {        
        console.log("error list");
      }
    );
  }

  public BindIncidentLineChartLabelsData(
    incidentTypeLimit: string,
    selectedTrend: string
  ) {
    //this.spinner.show();
    this.incidentlineChartLabels = [];
    this.incidentreportservice.GetIncidentLineChartLabelsData(selectedTrend).subscribe(
      (response: LineChartLabelModel[]) => {
        //console.log(response);
        response.forEach((element) => {
          this.incidentlineChartLabels.push(element.columnName);
        });
        this.GetIncidentLineChartData(incidentTypeLimit, selectedTrend);
        ////this.spinner.hide();
      },
      (error: any) => {
        //this.spinner.hide();
        console.log("error list");
      }
    );
  }

  public GetIncidentDataForLineChartByTrends() {
    if (this.selectedIncidentTypeCriteria !== "all") {
      this.selectedIncidentListForLineChart = [];
      this.selectedIncidentTypeListForLineChart = [];
    }
    this.BindIncidentLineChartLabelsData(
      this.selectedIncidentTypeCriteria,
      this.selectedTrend
    );
  }

  public GetIncidentTypeList()
  {
    this.incidentreportservice.GetIncidentTypeList().subscribe((response : IncidentTypes[]) => {
      this.incidentTypeList = response;           
    }, (error:any)=> {
      this.toastr.error(`${error}`, "Error");
    
    });    
  }

  public onIncidentSelectForLineChart(item: any) {
    this.selectedIncidentTypeForLinehart.push(item);
    this.selectedIncidentListForLineChart.push(item.incidentType);
  }

  public onIncidentDeselectForLineChart(item: any) {
    this.selectedIncidentTypeForLinehart =
      this.selectedIncidentTypeForLinehart.filter((obj) => obj.id !== item.id);
    this.selectedIncidentListForLineChart =
      this.selectedIncidentListForLineChart.filter(
        (obj) => obj !== item.incidentType
      );
  }

  public onSelectAllIncidentsForLineChart(item: any) {
    this.selectedIncidentListForLineChart = [];
    item.forEach((element) => {
      this.selectedIncidentListForLineChart.push(element.incidentType);
    });
  }

  public onDeSelectAllIncidentsForLineChart(item: any) {
    this.selectedIncidentTypeForLinehart = [];
    this.selectedIncidentListForLineChart = [];
  }
//#endregion
}
