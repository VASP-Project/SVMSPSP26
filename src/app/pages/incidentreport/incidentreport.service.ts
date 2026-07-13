import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { DetectionMethod, IncidentAcTypesMaster, IncidentAgency, IncidentAirlineMaster, IncidentAttachmentTypesMaster, IncidentAttachments, IncidentAttendeesMaster, IncidentCountryMaster, IncidentDisablingMaster, IncidentExplosivesMaster, IncidentFirearmInformation, IncidentGunsMaster, IncidentHotWash, IncidentHotwashNameMaster, IncidentIncendiariesMaster, IncidentIndividualTypesMaster, IncidentIndividuals, IncidentLocations, IncidentMastersLists, IncidentNotifications, IncidentPassengerInformation, IncidentPerimeterMaster, IncidentProhibitedItems, IncidentRootCauseMaster, IncidentSharpObjectsMaster, IncidentStatesMaster, IncidentTerminalMaster, IncidentTypes, IncidentVehicleInformation, IncidentreportDetail, NotificationTypes } from "./incidentreport.model";
import { Observable } from "rxjs";
import { Locations } from "../master/locations";
import { IncidentrecordModule } from "./incidentrecord.module";
import { LineChartLabelModel } from "../master/company";
import { Facilities } from "../master/facility";

@Injectable({ providedIn: 'root' })
export class IncidentReportService
{
    gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    public GetIncidentTypeList() {

        return this.http.get<IncidentTypes[]>(this.gnBaseURL +"IncidentType/GetIncidentTypeList");
    }

    public GetIncidentLocationList() {

        return this.http.get<IncidentLocations[]>(this.gnBaseURL +"IncidentRecord/GetIncidentLocationList");
    }

    public GetIncidentAgencyList() {

        return this.http.get<IncidentAgency[]>(this.gnBaseURL +"IncidentRecord/GetIncidentAgencyList");
    }

    public GetSelectedDoors(inspectionId): Observable<Locations[]> {
        return this.http
          .get<Locations[]>(this.gnBaseURL + "InspectionRecord/GetSelectedDoors/"+ inspectionId);
      }
      
    public AddIncidentDetail(incidentDetails,isSaveFormDetails,files,deletedeventIds,deletedncidentEventIds,deletedIndividualId,deletePassengerIds,deleteProhibitedIds,deleteFireIds,
        deleteVhicleIds,deletedAttachmentIds,deletedHotwashIdss)
    {
        //  console.log(deletedFiles);
        var formData = new FormData();
        formData.append("IncidentreportDetail", JSON.stringify(incidentDetails));
        formData.append("deletedeventIds", JSON.stringify(deletedeventIds));
        formData.append("deletedIndividualIds", JSON.stringify(deletedIndividualId));
        formData.append("deletePassengerIds", JSON.stringify(deletePassengerIds));
        formData.append("deleteProhibitedIds", JSON.stringify(deleteProhibitedIds));
        formData.append("deleteFireIds", JSON.stringify(deleteFireIds));
        formData.append("deleteVhicleIds", JSON.stringify(deleteVhicleIds));
        formData.append("deletedAttachmentIds", JSON.stringify(deletedAttachmentIds));
        formData.append("deletedHotwashIdss",JSON.stringify(deletedHotwashIdss));
        formData.append("deletedIncidentEventIds", JSON.stringify(deletedncidentEventIds));
        formData.append("isSaveFormDetails", isSaveFormDetails)
        if (files != null) {
            for (var i = 0; i < files.length; i++) {
              formData.append(files[i].name, files[i])
            }
          }
        
        // formData.append("incidentHotwashList", JSON.stringify(selectedHotwashList));
        // formData.append("incidentRootcauseList", JSON.stringify(selectedRootcauseList));
        //formData.append("incidentRepoAgencyList", JSON.stringify(selectedRepoAgencyList));
       // formData.append("incidentInAgencyList", JSON.stringify(selectedInAgencyList));
        return this.http
        .post<string>(this.gnBaseURL + "IncidentRecord/AddIncidentDetail", formData);    
    } 
    
    public GetInscidentList(fromDate,toDate) {
        return this.http
          .get<IncidentreportDetail[]>(this.gnBaseURL + "IncidentRecord/GetInscidentList?fromDate=" + fromDate + `&toDate=` + toDate);
    }

    public GetIncidentNotiTypeList() {

        return this.http.get<NotificationTypes[]>(this.gnBaseURL +"IncidentRecord/GetIncidentNotiTypeList");
    }

    public GetIncidentDetectionMethodList() {

        return this.http.get<DetectionMethod[]>(this.gnBaseURL +"IncidentRecord/GetIncidentDetectionMethodList");
    }

    public GetIncidentDetailsById(incidentId: number): Observable<IncidentreportDetail> {
        return this.http
          .get<IncidentreportDetail>(this.gnBaseURL + "IncidentRecord/GetIncidentDetailsById?incidentId=" + incidentId);
    } 

    public GetIncidentAttendeesList() {

        return this.http.get<IncidentAttendeesMaster[]>(this.gnBaseURL +"IncidentRecord/GetIncidentAttendeesList");
    }

    public GetIncidentHotwashList() {

        return this.http.get<IncidentHotwashNameMaster[]>(this.gnBaseURL +"IncidentRecord/GetIncidentHotwashList");
    }

    public GetIncidentRootCauseList() {

        return this.http.get<IncidentRootCauseMaster[]>(this.gnBaseURL +"IncidentRecord/GetIncidentRootCauseList");
    }

    public GetIncidentIndividualTypesList() {

        return this.http.get<IncidentIndividualTypesMaster[]>(this.gnBaseURL +"IncidentRecord/GetIncidentIndividualTypesList");
    }

    public GetAirlineTypesList() {

        return this.http.get<IncidentAirlineMaster[]>(this.gnBaseURL +"IncidentRecord/GetAirlineTypesList");
    }

    public GetAcypesList() {

        return this.http.get<IncidentAcTypesMaster[]>(this.gnBaseURL +"IncidentRecord/GetAcypesList");
    }

    public GetExplosiveList() {

        return this.http.get<IncidentExplosivesMaster[]>(this.gnBaseURL +"IncidentRecord/GetExplosiveList");
    }
    public GetGunsList() {

        return this.http.get<IncidentGunsMaster[]>(this.gnBaseURL +"IncidentRecord/GetGunsList");
    }

    public GetSharpobjectList() {

        return this.http.get<IncidentSharpObjectsMaster[]>(this.gnBaseURL +"IncidentRecord/GetSharpobjectList");
    }
    public GetIncendiarietList() {

        return this.http.get<IncidentIncendiariesMaster[]>(this.gnBaseURL +"IncidentRecord/GetIncendiarietList");
    }
    public GetDisablingList() {

        return this.http.get<IncidentDisablingMaster[]>(this.gnBaseURL +"IncidentRecord/GetDisablingList");
    }
    public GetAttachmentTypeList() {

        return this.http.get<IncidentAttachmentTypesMaster[]>(this.gnBaseURL +"IncidentRecord/GetAttachmentTypeList");
    }
    public GetCountyList() {

        return this.http.get<IncidentCountryMaster[]>(this.gnBaseURL +"IncidentRecord/GetCountyList");
    }
    public GetStateList() {

        return this.http.get<IncidentStatesMaster[]>(this.gnBaseURL +"IncidentRecord/GetStateList");
    }
    public GetTerminalList() {

        return this.http.get<IncidentTerminalMaster[]>(this.gnBaseURL +"IncidentRecord/GetTerminalList");
    }
    public GetPerimeterList() {

        return this.http.get<IncidentPerimeterMaster[]>(this.gnBaseURL +"IncidentRecord/GetPerimeterList");
    }
    public GetPerimeterListByid(id) {

        return this.http.get<IncidentPerimeterMaster[]>(this.gnBaseURL +"IncidentRecord/GetPerimeterListByid?catId="+ id);
    }

    public GetNotificationByIncidentId(incidentid: number): Observable<IncidentNotifications[]> {
        return this.http
          .get<IncidentNotifications[]>(this.gnBaseURL + "IncidentRecord/GetNotificationByIncidentId?incidentid=" + incidentid);
    
    }

    public GetIndividualByIncidentId(incidentid: number): Observable<IncidentIndividuals[]> {
        return this.http
          .get<IncidentIndividuals[]>(this.gnBaseURL + "IncidentRecord/GetIndividualByIncidentId?incidentid=" + incidentid);
    
    }

    public GetPassengerInfoByIncidentId(incidentid: number): Observable<IncidentPassengerInformation[]> {
        return this.http
          .get<IncidentPassengerInformation[]>(this.gnBaseURL + "IncidentRecord/GetPassengerInfoByIncidentId?incidentid=" + incidentid);
    
    }

    public GetIncidentProhibitedByIncidentId(incidentid: number): Observable<IncidentProhibitedItems[]> {
        return this.http
          .get<IncidentProhibitedItems[]>(this.gnBaseURL + "IncidentRecord/GetIncidentProhibitedByIncidentId?incidentid=" + incidentid);
    
    }

    public GetFirearmByIncidentId(incidentid: number): Observable<IncidentFirearmInformation[]> {
        return this.http
          .get<IncidentFirearmInformation[]>(this.gnBaseURL + "IncidentRecord/GetFirearmByIncidentId?incidentid=" + incidentid);
    
    }

    public GetMotorVehicleByIncidentId(incidentid: number): Observable<IncidentVehicleInformation[]> {
        return this.http
          .get<IncidentVehicleInformation[]>(this.gnBaseURL + "IncidentRecord/GetMotorVehicleByIncidentId?incidentid=" + incidentid);
    
    }

    public GetAttachmentByIncidentId(incidentid: number): Observable<IncidentAttachments[]> {
        return this.http
          .get<IncidentAttachments[]>(this.gnBaseURL + "IncidentRecord/GetAttachmentByIncidentId?incidentid=" + incidentid);
    
    }

    public GetHotwashByIncidentId(incidentid: number): Observable<IncidentHotWash[]> {
        return this.http
          .get<IncidentHotWash[]>(this.gnBaseURL + "IncidentRecord/GetHotwashByIncidentId?incidentid=" + incidentid);
    
    }
   
    public GetAllIncidentMastersLists(): Observable<IncidentMastersLists> {
        return this.http
          .get<IncidentMastersLists>(this.gnBaseURL + "IncidentRecord/GetAllIncidentMastersLists");
    } 

    getAttachment(id: number) {
        return this.http.get(this.gnBaseURL + "IncidentRecord/filedownload?id=" + id, { responseType: 'blob' }).
          pipe();
    }
//-----------------------IncidentTypes -----------------------------------------
    public DeleteIncidentTypeById(id: number) {
        
        return this.http.get(this.gnBaseURL +"IncidentType/DeleteIncidentTypeById/" + id);
    } 

    public GetIncidentTypeById(id: number) {
        
        return this.http.get<IncidentTypes>(this.gnBaseURL +"IncidentType/GetIncidentTypeById/" + id);
    }

    public AddEditIncidentType(incidentTypes) {
        
        var formData = new FormData();
        formData.append("incidentTypes", JSON.stringify(incidentTypes));
       
        return this.http
          .post<IncidentTypes>(this.gnBaseURL +"IncidentType/AddEditIncidentType", formData);
    }

    public CheckTypeExists(name: string): Observable<boolean> {
        return this.http
          .get<boolean>(this.gnBaseURL +"IncidentType/checkTypeExists/" + name);
    }

//---------------- Prohibited DetectionMethod ----------------------------
//#region
    public GetDetectionMethodList() {

        return this.http.get<DetectionMethod[]>(this.gnBaseURL +"IncidentProhibitedItem/GetDetectionMethodList");
    }

    public DeleteDetectionMethodById(id: number) {
        
        return this.http.get(this.gnBaseURL +"IncidentProhibitedItem/DeleteDetectionMethodById/" + id);
    } 

    public GetDetectionMethodById(id: number) {
        
        return this.http.get<DetectionMethod>(this.gnBaseURL +"IncidentProhibitedItem/GetDetectionMethodById/" + id);
    }

    public AddEditDetectionMethod(detectionMethods) {
        
        var formData = new FormData();
        formData.append("detectionMethod", JSON.stringify(detectionMethods));
       
        return this.http
          .post<DetectionMethod>(this.gnBaseURL +"IncidentProhibitedItem/AddEditDetectionMethod", formData);
    }

    public CheckDetectionExists(name: string): Observable<boolean> {
        return this.http
          .get<boolean>(this.gnBaseURL +"IncidentProhibitedItem/checkDetectionExists/" + name);
    }
//#endregion
//-------------------------------- Explosive -----------------------------------------
//#region
    public GetExplosivesList() {

        return this.http.get<IncidentExplosivesMaster[]>(this.gnBaseURL +"IncidentProhibitedItem/GetExplosivesList");
    }

    public DeleteExplosiveById(id: number) {
        
        return this.http.get(this.gnBaseURL +"IncidentProhibitedItem/DeleteExplosiveById/" + id);
    } 

    public GetExplosiveById(id: number) {
        
        return this.http.get<IncidentExplosivesMaster>(this.gnBaseURL +"IncidentProhibitedItem/GetExplosiveById/" + id);
    }

    public AddEditExplosives(explosive) {
        
        var formData = new FormData();
        formData.append("explosive", JSON.stringify(explosive));
    
        return this.http
        .post<IncidentExplosivesMaster>(this.gnBaseURL +"IncidentProhibitedItem/AddEditExplosives", formData);
    }

    public CheckExplosiveExists(name: string): Observable<boolean> {
        return this.http
        .get<boolean>(this.gnBaseURL +"IncidentProhibitedItem/checkExplosiveExists/" + name);
    }
//#endregion
//------------------------------ Gun Types ----------------------------------
//#region
    public GetGunList() {

        return this.http.get<IncidentGunsMaster[]>(this.gnBaseURL +"IncidentProhibitedItem/GetGunList");
    }

    public DeleteGuntypeById(id: number) {
        
        return this.http.get(this.gnBaseURL +"IncidentProhibitedItem/DeleteGuntypeById/" + id);
    } 

    public GetGunsById(id: number) {
        
        return this.http.get<IncidentGunsMaster>(this.gnBaseURL +"IncidentProhibitedItem/GetGunsById/" + id);
    }

    public AddEditGunType(guntype) {
        
        var formData = new FormData();
        formData.append("guntype", JSON.stringify(guntype));

        return this.http
        .post<IncidentGunsMaster>(this.gnBaseURL +"IncidentProhibitedItem/AddEditGunType", formData);
    }

    public CheckGuntypeExists(name: string): Observable<boolean> {
        return this.http
        .get<boolean>(this.gnBaseURL +"IncidentProhibitedItem/checkGuntypeExists/" + name);
    }
//#endregion
//-------------------------------- Individual Type ----------------------------------------
//#region
    public GetIndividualTypeList() {

        return this.http.get<IncidentIndividualTypesMaster[]>(this.gnBaseURL +"IncidentProhibitedItem/GetIndividualTypeList");
    }

    public DeleteIndividualeById(id: number) {
        
        return this.http.get(this.gnBaseURL +"IncidentProhibitedItem/DeleteIndividualeById/" + id);
    } 

    public GetIndividualTypeById(id: number) {
        
        return this.http.get<IncidentIndividualTypesMaster>(this.gnBaseURL +"IncidentProhibitedItem/GetIndividualTypeById/" + id);
    }

    public AddEditIndividualType(individual) {
        
        var formData = new FormData();
        formData.append("individual", JSON.stringify(individual));

        return this.http
        .post<IncidentIndividualTypesMaster>(this.gnBaseURL +"IncidentProhibitedItem/AddEditIndividualType", formData);
    }

    public CheckIndividualTypeExists(name: string): Observable<boolean> {
        return this.http
        .get<boolean>(this.gnBaseURL +"IncidentProhibitedItem/checkIndividualTypeExists/" + name);
    }
//#endregion

    public GetIncidentDetailsForDashboard(inciId ): Observable<IncidentreportDetail[]>
    {
        return this.http.get<IncidentreportDetail[]>(
        this.gnBaseURL + "IncidentRecord/GetIncidentDetailsForDashboard/" + inciId
        );
    }

    public GetIncidentLineChartData(incidentTypeLimit: string, selectedTrend: string) {
        return this.http.get<Object[]>(this.gnBaseURL + "IncidentRecord/GetIncidentLineChartData?incidentTypeLimit=" + incidentTypeLimit + `&selectedTrend=` + selectedTrend);
    }

    public GetIncidentLineChartLabelsData(selectedTrend: string) {
        return this.http.get<LineChartLabelModel[]>(this.gnBaseURL + "IncidentRecord/GetIncidentLineChartLabelsData/" + selectedTrend);
    }

    public GetFacilityListByDoorGate() {
        
        return this.http.get<Facilities[]>(this.gnBaseURL +"Facility/GetFacilityListByDoorGate");
    }

    public DeleteIncident(id): Observable<Response> {
        return this.http.get<Response>(
          this.gnBaseURL + "IncidentRecord/DeleteIncidentRecord/" + id
        );
    }
}
