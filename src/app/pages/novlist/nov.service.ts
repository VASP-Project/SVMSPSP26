import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  CitationDetails,
  CitationDetailsTableLabels,
  CitationEvents,
  CitationStateMaster,
  DataOutputModel,
  GraphModel,
  MobileViewData,
  MonthlyCitationDetails,
  PaymentMethod,
} from "./CitationDetails";
import { CorrectiveActions } from "./correctiveactions";
import { Company } from "../master/company";
import { Badgeholder } from "./badgeholder";
import { Locations } from "../master/locations";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { IncidentStatesMaster } from "../incidentreport/incidentreport.model";

@Injectable({ providedIn: "root" })
export class NovService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }

  public AddCitationDetails(
    citationDetails,
    files,
    deletedFiles,
    CitationImagesLst,
    isSaveFormDetails,
    correctiveActions,
    remedialTrainings,
    deletedeventIds,
    inspectionId,
    selectedDoorList,
    selectedNovDoorList,
   

  ) {
    var formData = new FormData();
    formData.append("citationDetails", JSON.stringify(citationDetails));
    formData.append("deletedFiles", JSON.stringify(deletedFiles));
    formData.append("CitationImagesLst", JSON.stringify(CitationImagesLst));
    formData.append("isSaveFormDetails", isSaveFormDetails);
    formData.append("correctiveActions", JSON.stringify(correctiveActions));
    formData.append("remedialTrainings", JSON.stringify(remedialTrainings));
    formData.append("deletedeventIds", JSON.stringify(deletedeventIds));
    formData.append("inspectionId", inspectionId);
    formData.append("selectedDoorList", JSON.stringify(selectedDoorList));
    formData.append("selectedNovDoorList", JSON.stringify(selectedNovDoorList));
 
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
    }
     console.log(formData);
    return this.http.post<CitationDetails>(
      this.gnBaseURL + "citation/AddCitationDetails",
      formData
    );
   
  }

  public EditCitationEvents(citationEvents: CitationEvents) {
    var formData = new FormData();
    formData.append("citationEvents", JSON.stringify(citationEvents));
    return this.http.post<CitationEvents>(
      this.gnBaseURL + "citation/EditCitationEvents",
      formData
    );
  }

  public AddCitationEvents(citationEvents) {
    var formData = new FormData();
    formData.append("citationEvents", JSON.stringify(citationEvents));
    return this.http.post<CitationEvents>(
      this.gnBaseURL + "citation/AddCitationEvents",
      formData
    );
  }

  public AddCorrectiveActions(
    correctiveActions,
    files,
    deletedFiles,
    remedialTrainings,
    deletedTrainings,
    isSaveFormDetails,
    citationDetails,
    notifyAuth
  ) {
    // console.log(remedialTrainings);
    var formData = new FormData();
    formData.append("correctiveActions", JSON.stringify(correctiveActions));
    formData.append("deletedFiles", JSON.stringify(deletedFiles));
    formData.append("remedialTrainings", JSON.stringify(remedialTrainings));
    formData.append("deletedTrainings", JSON.stringify(deletedTrainings));
    formData.append("isSaveFormDetails", isSaveFormDetails);
    formData.append("citationDetails", JSON.stringify(citationDetails));
    formData.append("notifyAuth", notifyAuth == undefined ? false : notifyAuth);

    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
    }
    return this.http.post<CorrectiveActions>(
      this.gnBaseURL + "citation/AddCorrectiveActions",
      formData
    );
  }

  public AddEditCorrectiveActionsByAuthSigner(
    correctiveActions,
    files,
    deletedFiles,
    citation,
    correctiveActionDetails,
    remedialTrainings
  ) {
    var formData = new FormData();
    formData.append("correctiveActions", JSON.stringify(correctiveActions));
    formData.append("deletedFiles", JSON.stringify(deletedFiles));
    formData.append("citationDetails", JSON.stringify(citation));
    correctiveActionDetails.isCorrectiveActionCompleted =
      correctiveActionDetails.isCorrectiveActionCompleted == true ? 1 : 0;
    formData.append(
      "correctiveActionDetails",
      JSON.stringify(correctiveActionDetails)
    );
    formData.append("remedialTrainings", JSON.stringify(remedialTrainings));
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
    }
    return this.http.post<CorrectiveActions>(
      this.gnBaseURL + "citation/AddEditCorrectiveActionsByAuthSigner",
      formData
    );
  }

  // public SaveCitationCaseStatus(citationDetails) {
  //   var formData = new FormData();
  //   formData.append("citationDetails", JSON.stringify(citationDetails));
  //   return this.http
  //     .post<CitationDetails>(`${environment.apiUrl}citation/SaveCitationCaseStatus`, formData);

  // }

  public CheckNovExists(citationId: number): Observable<boolean> {
    return this.http.get<boolean>(
      this.gnBaseURL + "citation/checkNovExists/" + citationId
    );
  }

  public GetCitationDetails(details) {
    return this.http.post<CitationDetails[]>(
      this.gnBaseURL + "citation/GetCitationDetails",
      details
    );
  }

  public GetCitationDetailsNew(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    params = params.append("CompanyId", parameters.CompanyId);
    params = params.append("FirstName", parameters.FirstName);
    params = params.append("LastName", parameters.LastName);
    params = params.append("DOB", parameters.DOB);
    params = params.append("FromDate", parameters.FromDate);
    params = params.append("ToDate", parameters.ToDate);
    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "citation/GetCitationDetailsNew",
      { params: params }
    );
  }
  public GetCitationDetailsTsaForMobileView(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    params = params.append("CompanyId", parameters.CompanyId);
    params = params.append("FirstName", parameters.FirstName);
    params = params.append("LastName", parameters.LastName);
    params = params.append("DOB", parameters.DOB);
    params = params.append("FromDate", parameters.FromDate);
    params = params.append("ToDate", parameters.ToDate);
    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "citation/GetCitationDetailsTsaForMobileView",
      { params: params }
    );
  }
  public GetCitationDetailsAuthSignerForMobileView(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    params = params.append("UserId", parameters.UserId);
    params = params.append("FirstName", parameters.FirstName);
    params = params.append("LastName", parameters.LastName);
    params = params.append("DOB", parameters.DOB);
    params = params.append("FromDate", parameters.FromDate);
    params = params.append("ToDate", parameters.ToDate);
    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "citation/GetCitationDetailsAuthSignerForMobileView",
      { params: params }
    );
  }

  // public GetCitationDetails(companyId,fromDate,toDate,firstName,lastName,DOB): Observable<CitationDetails[]> {

  //   return this.http
  //     .get<CitationDetails[]>(this.gnBaseURL + "citation/GetCitationDetails/" + companyId + "/" + fromDate + "/" + toDate + "/" + firstName + "/" + lastName + "/" + DOB);
  // }
  public GetCitationDetailsForDashboard(
    companyId
  ): Observable<CitationDetails[]> {
    return this.http.get<CitationDetails[]>(
      this.gnBaseURL + "citation/GetCitationDetailsForDashboard/" + companyId
    );
  }

  public GetOverdueCitationDetailsForDashboard(
    companyId
  ): Observable<CitationDetails[]> {
    return this.http.get<CitationDetails[]>(
      this.gnBaseURL +
        "citation/GetOverdueCitationDetailsForDashboard/" +
        companyId
    );
  }

  public GetCitationGraphData(): Observable<GraphModel[]> {
    return this.http.get<GraphModel[]>(
      this.gnBaseURL + "citation/GetCitationsGraphData"
    );
  }

  public GetCitationDetailsTableData(
    fromDate: string,
    toDate: string,
    companyIdList: string,
    violationTypeIdList: string,
    citationReasonIdList: string
  ) {
    return this.http.get<Object[]>(
      this.gnBaseURL +
        "citation/GetCitationDetailsTableData?fromDate=" +
        fromDate +
        `&toDate=` +
        toDate +
        `&companyIdList=` +
        companyIdList +
        `&violationTypeIdList=` +
        violationTypeIdList +
        `&citationReasonIdList=` +
        citationReasonIdList
    );
  }

  public DeleteCitationEvents(id): Observable<Response> {
    return this.http.get<Response>(
      this.gnBaseURL + "citation/DeleteCitationEvents/" + id
    );
  }

  public DeleteCitationDetails(id): Observable<Response> {
    return this.http.get<Response>(
      this.gnBaseURL + "citation/DeleteCitationDetails/" + id
    );
  }

  public GetCitationDetailsTsa(details) {
    return this.http.post<CitationDetails[]>(
      this.gnBaseURL + "citation/GetCitationDetailsTsa",
      details
    );
  }

  // public GetCitationDetailsTsa(companyId,fromDate,toDate): Observable<CitationDetails[]> {

  //   return this.http
  //     .get<CitationDetails[]>(this.gnBaseURL + "citation/GetCitationDetailsTsa?fromDate=" + fromDate + `&toDate=` + toDate);
  // }

  public GetCitationDetailsAuthSigner(details) {
    return this.http.post<CitationDetails[]>(
      this.gnBaseURL + "citation/GetCitationDetailsAuthSigner",
      details
    );
  }

  // public GetCitationDetailsAuthSigner(id: string,fromDate,toDate): Observable<CitationDetails[]> {
  //   return this.http
  //     .get<CitationDetails[]>(this.gnBaseURL + "citation/GetCitationDetailsAuthSigner?id=" + id + `&fromDate=` + fromDate + `&toDate=` + toDate);
  // }

  public GetCitationDetailsById(
    citationId: number,
    companyId: number
  ): Observable<CitationDetails> {
    return this.http.get<CitationDetails>(
      this.gnBaseURL +
        "citation/GetCitationDetailsById?citationId=" +
        citationId +
        `&companyId=` +
        companyId
    );
  }

  public GetCitationEventsByCitationId(
    citationId: number
  ): Observable<CitationEvents[]> {
    return this.http.get<CitationEvents[]>(
      this.gnBaseURL +
        "citation/GetCitationEventsByCitationId?citationId=" +
        citationId
    );
  }

  public GetCorrectiveActionByCitationId(
    citationId: number
  ): Observable<CorrectiveActions> {
    return this.http.get<CorrectiveActions>(
      this.gnBaseURL + "citation/GetCorrectiveActionByCitationId/" + citationId
    );
  }

  getAttachment(id: number) {
    return this.http
      .get(this.gnBaseURL + "citation/filedownload?id=" + id, {
        responseType: "blob",
      })
      .pipe();
  }

  public GetMonthlyCitationDetails(
    year: number,
    companyName: string,
    selectedMonth: string,
    fromDate: string,
    toDate: string
  ): Observable<MonthlyCitationDetails[]> {
    return this.http.get<MonthlyCitationDetails[]>(
      this.gnBaseURL +
        "citation/GetMonthlyCitationDetails?year=" +
        year +
        `&companyName=` +
        companyName +
        `&selectedMonth=` +
        selectedMonth +
        `&fromDate=` +
        fromDate +
        `&toDate=` +
        toDate
    );
  }

  public GetCitationDetailsTableDataLabels(fromDate: string, toDate: string) {
    return this.http.get<CitationDetailsTableLabels[]>(
      this.gnBaseURL +
        "citation/GetCitationDetailsTableDataLabels?fromDate=" +
        fromDate +
        `&toDate=` +
        toDate
    );
  }

  public GetBadgeholderInfo(badgeNo: string): Observable<Badgeholder> {
    return this.http.get<Badgeholder>(
      this.gnBaseURL + "citation/GetBadgeholderInfo?badgeNo=" + badgeNo
    );
  }

  public GetBadgeholderInfoForMultipleBadgeNumbers(
    badgeNo: string[]
  ): Observable<Badgeholder[]> {
    let params = new HttpParams();
    for (const number of badgeNo) {
      params = params.append("badgeNumbers", number);
    }
    return this.http.get<Badgeholder[]>(
      this.gnBaseURL + "citation/GetBadgeholderInfoForMultipleBadgeNumbers",
      { params: params }
    );
  }

  public GetSelectedDoors(couId): Observable<Locations[]> {
    return this.http.get<Locations[]>(
      this.gnBaseURL + "citation/GetSelectedDoors/" + couId
    );
  }

  public GetNovSelectedDoors(novId): Observable<Locations[]> {
    return this.http.get<Locations[]>(
      this.gnBaseURL + "citation/GetNovSelectedDoors/" + novId
    );
  }
  public goToInspectionPage(inspectionRecordNo: number) {
    return this.http.get<string>(
      this.gnBaseURL +
        "InspectionRecord/goToInspectionPage/" +
        inspectionRecordNo
    );
  }

  public GetStateList() {
    return this.http.get<IncidentStatesMaster[]>(
      this.gnBaseURL + "IncidentRecord/GetStateList"
    );
  }

  public GetPaymentTypeList() {
    return this.http.get<PaymentMethod[]>(
      this.gnBaseURL + "citation/GetPaymentTypeList"
    );
  }
  public GetBadgeByNumber(badgeNumber: string) {
    return this.http.get<any>(
      this.gnBaseURL + "SafeWebAPI/GetBadgeDataByBadgeNo/" + badgeNumber
    );
  }

  public sendToBot(message: string) {
    return this.http.post(this.gnBaseURL + "citation/chatbot/", { message });
  }

  public GetPastCouRecords(badgeNo:string, personUniqueId?:string) {
  return this.http.get<any>(this.gnBaseURL + "citation/GetPastCouRecords?badgeNo=" + badgeNo + (personUniqueId ? `&personUniqueId=${personUniqueId}` : ''));
  }
  getMaxTolerableCount() {
  return this.http.get<any>(this.gnBaseURL + 'citation/max-count');
}
}
