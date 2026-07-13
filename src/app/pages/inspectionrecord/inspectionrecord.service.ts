import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { InspectionDashBoard } from '../dashboard/dashboard';
import { Locations } from '../master/locations';
import { CitationDetails } from '../novlist/CitationDetails';
import { CompanyInformation, DataOutputModel, InspectionBadgeholder, InspectionEdtAlarm, InspectionEdtResolution, InspetionRecordDetail, MobileViewData, VehicleInspection } from './inspectionrecord.model';

@Injectable({
  providedIn: 'root'
})
export class InspectionrecordService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
   }

   public AddInpsectionDetail(inspectionDetail,isSaveFormDetails,files, deletedFiles,selectedDoorList,findingDoorList,deletedBadgeholderIds,deletedVehicleIds,deletedCompanyIds)
   {
    //  console.log(deletedFiles);
    var formData = new FormData();
    formData.append("inspectionRecordDetail", JSON.stringify(inspectionDetail));
    formData.append("isSaveFormDetails", isSaveFormDetails)
    formData.append("deletedFiles", JSON.stringify(deletedFiles));
    // formData.append("deletedDoorIds", JSON.stringify(deletedDoorIds)); 
    formData.append("selectedDoorList",JSON.stringify(selectedDoorList));
    formData.append("findingDoorList", JSON.stringify(findingDoorList));
    formData.append("deletedBadgeholderIds", JSON.stringify(deletedBadgeholderIds));
    formData.append("deletedVehicleIds", JSON.stringify(deletedVehicleIds));
    formData.append("deletedCompanyIds", JSON.stringify(deletedCompanyIds));
    
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
      }
    }
    return this.http
      .post<string>(this.gnBaseURL + "InspectionRecord/AddInspectionDetail/", formData);    
   }   

   public DeleteInspectionDetails(id): Observable<Response> {

    return this.http
      .get<Response>(this.gnBaseURL + "InspectionRecord/DeleteInspectionDetails/" + id);
  }

  getAttachment(id: number) {
    return this.http.get(this.gnBaseURL + "InspectionRecord/filedownload?id=" + id, { responseType: 'blob' }).
      pipe();
  }

  public GetInspectionList(fromDate,toDate): Observable<InspetionRecordDetail[]> {
    return this.http
      .get<InspetionRecordDetail[]>(this.gnBaseURL + "InspectionRecord/GetInspectionList?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetInspectionListForMobileView(parameters: MobileViewData) {
    let params = new HttpParams();
    params = params.append("MaxPageSize", parameters.maxPageSize);
    params = params.append("PageNumber", parameters.pageNumber);
    params = params.append("PageSize", parameters.pageSize);
    params = params.append("SearchQuery", parameters.searchQuery);
    params = params.append("OrderBy", parameters.orderBy);
    params = params.append("OrderDir", parameters.orderDir);
     params = params.append("FromDate", parameters.FromDate);
     params = params.append("ToDate", parameters.ToDate);
   // params = params.append("FromDate", new Date(parameters.FromDate).toISOString());
//params = params.append("ToDate", new Date(parameters.ToDate).toISOString());

    return this.http.get<DataOutputModel>(
      this.gnBaseURL + "InspectionRecord/GetInspectionListForMobileView",
      { params: params }
    );
  }
  
  public GetInspectionDetailsById(inspectionId: number, companyId: number): Observable<InspetionRecordDetail> {
    return this.http
      .get<InspetionRecordDetail>(this.gnBaseURL + "InspectionRecord/GetInspectionDetailsById?inspectionId=" + inspectionId + `&companyId=` + companyId);
  } 

  public CheckInspectionExists(inspectionId: number): Observable<boolean> {
    return this.http
      .get<boolean>(this.gnBaseURL + "InspectionRecord/CheckInspectionExists/" + inspectionId);
  }

 
  public GetSelectedDoors(inspectionId): Observable<Locations[]> {
    return this.http
      .get<Locations[]>(this.gnBaseURL + "InspectionRecord/GetSelectedDoors/"+ inspectionId);
  }

  public GetFindingDoors(inspectionId): Observable<Locations[]> {
    return this.http
      .get<Locations[]>(this.gnBaseURL + "InspectionRecord/GetFindingDoors/"+ inspectionId);
  }

  public GetMappingNov(inspectionId): Observable<CitationDetails[]> {
    return this.http
      .get<CitationDetails[]>(this.gnBaseURL + "InspectionRecord/GetMappingNov/"+ inspectionId);
  }

  public goToCitationPage(citationNo: number) { 
    return this.http
      .get<string>(this.gnBaseURL + "Citation/goToCitationPage/" + citationNo);
  } 

  public AddBadgeholderRecord(badgeholderModel) {
    var formData = new FormData();
    formData.append("badgeholderModel", JSON.stringify(badgeholderModel));
    return this.http
      .post<InspectionBadgeholder>(this.gnBaseURL + "InspectionRecord/AddBadgeholderRecord", formData);
  }

  public getBadgeholderRecordByInspectionId(inspectionId: number): Observable<InspectionBadgeholder[]> {
    return this.http
      .get<InspectionBadgeholder[]>(this.gnBaseURL + "InspectionRecord/getBadgeholderRecordByInspectionId/" + inspectionId);
  }

  public EditBadgeholderRecord(badgeholderModel: InspectionBadgeholder) {
    var formData = new FormData();
    formData.append("badgeholderModel", JSON.stringify(badgeholderModel));
    return this.http
      .post<InspectionBadgeholder>(this.gnBaseURL + "InspectionRecord/EditBadgeholderRecord", formData);
  }

  public DeleteBadgeholder(id): Observable<Response> {
    return this.http
      .get<Response>(this.gnBaseURL + "InspectionRecord/DeleteBadgeholder/" + id);
  }

  public AddVehicleRecord(vehicleModel) {
    var formData = new FormData();
    formData.append("vehicleModel", JSON.stringify(vehicleModel));
    return this.http
      .post<VehicleInspection>(this.gnBaseURL + "InspectionRecord/AddVehicleRecord", formData);
  }

  public getVehicleRecordByInspectionId(inspectionId: number): Observable<VehicleInspection[]> {
    return this.http
      .get<VehicleInspection[]>(this.gnBaseURL + "InspectionRecord/getVehicleRecordByInspectionId/" + inspectionId);
  }

  public EditVehicleRecord(vehicleModel: VehicleInspection) {
    var formData = new FormData();
    formData.append("vehicleModel", JSON.stringify(vehicleModel));
    return this.http
      .post<VehicleInspection>(this.gnBaseURL + "InspectionRecord/EditVehicleRecord", formData);
  }

  public deleteVehicle(id): Observable<Response> {
    return this.http
      .get<Response>(this.gnBaseURL + "InspectionRecord/deleteVehicle/" + id);
  }

  public AddCompanyRecord(companyModel) {
    var formData = new FormData();
    formData.append("companyModel", JSON.stringify(companyModel));
    return this.http
      .post<CompanyInformation>(this.gnBaseURL + "InspectionRecord/AddCompanyRecord", formData);
  }

  public getCompanyRecordByInspectionId(inspectionId: number): Observable<CompanyInformation[]> {
    return this.http
      .get<CompanyInformation[]>(this.gnBaseURL + "InspectionRecord/getCompanyRecordByInspectionId/" + inspectionId);
  }

  public EditCompanyRecord(companyModel: CompanyInformation) {
    var formData = new FormData();
    formData.append("companyModel", JSON.stringify(companyModel));
    return this.http
      .post<CompanyInformation>(this.gnBaseURL + "InspectionRecord/EditCompanyRecord", formData);
  }

  public deleteCompany(id): Observable<Response> {
    return this.http
      .get<Response>(this.gnBaseURL + "InspectionRecord/deleteCompany/" + id);
  }

  public GetInspectionDashboardData(details) {
    return this.http
      .post<InspectionDashBoard[]>(this.gnBaseURL + "InspectionRecord/GetInspectionDataForDashboard", details);
  }

  public GetEdtResolutionList(): Observable<InspectionEdtResolution[]> {
    return this.http
      .get<InspectionEdtResolution[]>(this.gnBaseURL + "InspectionRecord/GetInspectionEdtResolutions");
  }

  public GetEdtAlarmList(): Observable<InspectionEdtAlarm[]> {
    return this.http
      .get<InspectionEdtAlarm[]>(this.gnBaseURL + "InspectionRecord/GetInspectionEdtAlarm");
  }

  

//   public GetInspectionDashboardData(details) {

//     return this.http.get<InspectionDashBoard[]>(this.gnBaseURL +"InspectionRecord/GetInspectionDataForDashboard",details);
// }
}
