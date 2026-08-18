import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Company } from "../company";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { QueryStringParameters } from "@app/shared/shared.model";
import {
  DataOutputModel,
  ProhibitedAuditSummary,
  ProhibitedDetails,
  ProhibitedItemAudit,
  ProhibitedItemCheckOut,
  ProhibitedItemForAudit,
} from "../concessionaire-security/concessionaire.model";
import { Locations } from "../locations";
import { MobileViewData } from "@app/pages/inspectionrecord/inspectionrecord.model";

@Injectable({
  providedIn: "root",
})
export class CompanyMasterService {
  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  // ConcessionSecurity/GetCompaniesByUserId/

  getAllCompanies(userId: string): Observable<Company[]> {
    return this.http.get<Company[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetCompaniesByUserId?userId=" +
        userId
    );
  }

  GetComapniesForSA(): Observable<Company[]> {
    return this.http.get<Company[]>(
      this.gnBaseURL + "ConcessionSecurity/GetComapniesForSA"
    );
  }

  FixOldProhibitedImages() {
    return this.http.get<any>(
      this.gnBaseURL + "ConcessionSecurity/FixOldProhibitedImages"
    );
  }

  getAllCompaniesList(userId: string): Observable<Company[]> {
    return this.http.get<Company[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetCompaniesListByUserId?userId=" +
        userId
    );
  }
  DeleteProhibitedRecordById(id: number) {
    return this.http.get(
      this.gnBaseURL + "ConcessionSecurity/DeleteProhibitedRecordById/" + id
    );
  }

  // Optional methods
  addCompany(company: Company): Observable<any> {
    return this.http.post<any>(`${this.gnBaseURL}/add`, company);
  }

  updateCompany(company: Company): Observable<any> {
    return this.http.put<any>(
      `${this.gnBaseURL}/update/${company.id}`,
      company
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.gnBaseURL}/get/${id}`);
  }

  public AddEditProhibitedItemDetails(incidentDetails, files) {
    //  console.log(deletedFiles);
    var formData = new FormData();
    formData.append("IncidentreportDetail", JSON.stringify(incidentDetails));

    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
    }

    return this.http.post<string>(
      this.gnBaseURL + "ConcessionSecurity/AddEditProhibitedItemDetails",
      formData
    );
  }

  // public GetProhibitedItemList() {

  //   return this.http.get<ProhibitedDetails[]>(this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemList");
  // }

  public GetProhibitedItemList(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    // params = params.append("FromDate", parameters.FromDate);
    //  params = params.append("ToDate", parameters.ToDate);
    // params = params.append("FromDate", new Date(parameters.FromDate).toISOString());
    //params = params.append("ToDate", new Date(parameters.ToDate).toISOString());

    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemList",
      { params: params }
    );
  }

  GetProhibitedItemImages(id: number) {
    return this.http.get<any>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemImages/" + id
    );
  }

  public GetProhibitedItemListForExport(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);

    return this.http.get<ProhibitedDetails[]>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemListForExport",
      { params: params }
    );
  }

  GetProhibitedItemThumbImg(id: number) {
    return this.http.get<any>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemThumbImg/" + id
    );
  }

  public GetProhibitedAuditSummary(
    userId: string,
    rolename: string,
    fromDate,
    toDate
  ) {
    return this.http.get<ProhibitedAuditSummary[]>(
      `${this.gnBaseURL}ConcessionSecurity/GetCompanyWiseAuditSummary?userId=${userId}&rolename=${rolename}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  public GetCompanyWiseAuditSummaryForAuthSigner(
    userId: string,    
    fromDate,
    toDate
  ) {
    return this.http.get<ProhibitedAuditSummary[]>(
      `${this.gnBaseURL}ConcessionSecurity/GetCompanyWiseAuditSummaryForAuthSigner?userId=${userId}&fromDate=${fromDate}&toDate=${toDate}`
    );
  }

  public GetProhibitedAuditSummaryByCompanyId(
    companyId: Number,
    fromDate,
    toDate
  ) {
    return this.http.get<ProhibitedAuditSummary[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetCompanyWiseAudits?companyId=" +
        companyId +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  public GetProhibitedItemForAudit(
    logid: number,
    rolename: string,
    auditNo: string,
    userId: string
  ) {
    return this.http.get<ProhibitedItemAudit[]>(
      `${this.gnBaseURL}ConcessionSecurity/GetDailyPohibitedItemForAudit`,
      {
        params: {
          summaryId: logid.toString(),
          roleName: rolename,
          auditNo: auditNo,
          userId: userId
        },
      }
    );
  }

  public GetDailyPohibitedItemForAuditForAuthsigner(
    logid: number,
    rolename: string,
    auditNo: string
  ) {
    return this.http.get<ProhibitedItemAudit[]>(
      `${this.gnBaseURL}ConcessionSecurity/GetDailyPohibitedItemForAuditForAuthsigner`,
      {
        params: {
          summaryId: logid.toString(),
          roleName: rolename,
          auditNo: auditNo,
        },
      }
    );
  }

  GetShortDescriptionsByCompanyId(companyId: number) {
    return this.http.get<any[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetShortDescriptionsByCompanyId?companyId=" +
        companyId
    );
  }

  GetShortDescriptionsByUserId(userId: string) {
    return this.http.get<any[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetShortDescriptionsByUserId?userId=" +
        userId
    );
  }

  GetProhibitedItemsByCompanyId(companyId: number, parameters: MobileViewData, checkuser:number) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    params = params.append("CompanyId", companyId);

    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemsByCompanyId?checkuser=" + checkuser,
      { params: params },
    );
    // return this.http.get<ProhibitedDetails[]>(this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemsByCompanyId?companyId=" + companyId);
  }

  GetOriginalItemImage(id: number) {
  return this.http.get<any>(
    this.gnBaseURL + "ConcessionSecurity/GetOriginalItemImage/" + id
  );
}


  GetProhibitedItemsByCompanyIdForExport(
    companyId: number,
    parameters: MobileViewData
  ) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
    params = params.append("CompanyId", companyId);

    return this.http.get<ProhibitedDetails[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemsByCompanyIdForExport",
      { params: params }
    );
    // return this.http.get<ProhibitedDetails[]>(this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemsByCompanyId?companyId=" + companyId);
  }

  GetProhibitedItemsByAuthSignerUserIdWithoutPagination(userId: string) {
    return this.http.get<ProhibitedDetails[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemsByAuthSignerUserIdWithoutPagination?userId=" +
        userId
    );
  }

  GetProhibitedItemsByAuthSignerUserId(
    userId: string,
    parameters: MobileViewData
  ) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);

    return this.http.get<DataOutputModel>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemsByAuthSignerUserId?userId=" +
        userId,
      { params: params }
    );
  }

  public EditUpdateComment(model: ProhibitedDetails) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/EditUpdateComment",
      model
    );
  }

  UpdateQuantityUsein(model: ProhibitedDetails) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/UpdateQuantityUsein",
      model
    );
  }

  GetProhibitedrecordById(id: number) {
    return this.http.get<ProhibitedDetails>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedrecordById?id=" + id
    );
  }

  public UpdateDiscardQuantity(model: ProhibitedDetails) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/UpdateDiscardQuantity",
      model
    );
  }

  public UpdateProhibitedItemStatus(model: ProhibitedItemAudit) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/UpdateProhibitedItemStatus",
      model
    );
  }

  public UpdateMultipleItemStatus(items: ProhibitedItemAudit[]) {
  return this.http.post(`${this.gnBaseURL}ConcessionSecurity/UpdateMultipleItemStatus`, items);
}


  public UpdateProhibitedDailySummary(
    id: number,
    user: string,
    comment?: string
  ) {
    let url = `${this.gnBaseURL}ConcessionSecurity/UpdateProhibitedDailySummary/${id}/${user}`;

    // Append comment only if it's provided
    if (comment) {
      url += `?comment=${encodeURIComponent(comment)}`;
    }

    return this.http.get(url);
  }

  public ApprovedOnDiscard(model: ProhibitedDetails) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/ApprovedOnDiscard",
      model
    );
  }

  GetLocationListByCompanyId(companyId: number): Observable<Locations[]> {
    return this.http.get<Locations[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetLocationListByCompanyId?companyId=" +
        companyId
    );
  }

  public UpdateForHidden(model: ProhibitedDetails) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/UpdateForHidden",
      model
    );
  }
  public AddEditProhibitedItemCheckOut(CheckOutDetails) {
    //  console.log(deletedFiles);
    var formData = new FormData();
    formData.append("CheckOutDetails", JSON.stringify(CheckOutDetails));

    // if (files != null) {
    //   for (var i = 0; i < files.length; i++) {
    //     formData.append(files[i].name, files[i])
    //   }
    // }

    return this.http.post<string>(
      this.gnBaseURL + "ConcessionSecurity/AddEditProhibitedItemCheckOut",
      formData
    );
  }

  public GetProhibitedItemCheckOutList(fromDate, toDate) {
    return this.http.get<ProhibitedItemCheckOut[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemCheckOutList?fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }
  GetChekoutItemById(id: number) {
    return this.http.get<ProhibitedItemCheckOut>(
      this.gnBaseURL + "ConcessionSecurity/GetChekoutItemById?id=" + id
    );
  }
  public GetProhibitedItemCheckOutListByCompany(companyId) {
    return this.http.get<ProhibitedItemCheckOut[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemCheckOutListByCompany?companyId=" +
        companyId
    );
  }

  public GetProhibitedItemCheckOutListByCompanyForstaffadmin(
    companyId,
    fromDate,
    toDate
  ) {
    return this.http.get<ProhibitedItemCheckOut[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemCheckOutListByCompanyForstaffadmin?companyId=" +
        companyId +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }
  public GetProhibitedItemCheckOutListByUserId(userId) {
    return this.http.get<ProhibitedItemCheckOut[]>(
      this.gnBaseURL +
        "ConcessionSecurity/GetProhibitedItemCheckOutListByUserId?userId=" +
        userId
    );
  }

  DeleteCheckoutRecordById(id: number) {
    return this.http.get(
      this.gnBaseURL + "ConcessionSecurity/DeleteCheckoutRecordById/" + id
    );
  }
  getConcessionVariable(): Observable<any> {
    return this.http.get(
      this.gnBaseURL + "ConcessionSecurity/GetConcessionVariable"
    );
  }

  public EditByStaffadmin(incidentDetails, files) {
    var formData = new FormData();
    formData.append("IncidentreportDetail", JSON.stringify(incidentDetails));

    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i]);
      }
    }

    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/EditByStaffadmin",
      formData
    );
  }

  public EditUpdateCompletedAudit(model: ProhibitedAuditSummary) {
    return this.http.put(
      this.gnBaseURL + "ConcessionSecurity/EditUpdateCompletedAudit",
      model
    );
  }

  public GetLocationById(id: number) {
    return this.http.get<Locations>(this.gnBaseURL + "ConcessionSecurity/GetLocationById/" + id);
  }

  GetProhibitedrecordByIdForCheckout(id: number) {
    return this.http.get<any>(
      this.gnBaseURL + "ConcessionSecurity/GetProhibitedrecordById?id=" + id
    );
  }

  public GetProhibitedItemStatus(
    id:number
  ) {
    return this.http.get<any>(
      `${this.gnBaseURL}ConcessionSecurity/GetProhibitedItemStatus`,
      {
        params: {
          dailyAuditId:id
        },
      }
    );
  }

  public GetProhibitedItemAuditAsync(
    logid: number,
    auditNo: number,
    locationId?:number
  ) {
    let params = new HttpParams();  
    params = params.append("summaryId", logid.toString());
    params = params.append("auditNo", auditNo.toString());
    if(locationId){
      params = params.append("locationId", locationId.toString());
    }
    return this.http.get<ProhibitedItemAudit[]>(
      `${this.gnBaseURL}ConcessionSecurity/GetProhibitedItemAuditAsync`,
      {
        params: params,
      }
    );
  }
  
}
