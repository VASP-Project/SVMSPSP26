import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InspetionRecordDetail, InspetionRecordDetailStatus } from '../inspectionrecord/inspectionrecord.model';
import { Observable } from 'rxjs';
import { BadgeVerificationAudit, SecurityClearanceAuditLog } from '../pendingbadgeapplicants/pendingbadgeapplicants';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { SystemLogAudit } from '@app/authentication/login/systemlogs';
import { IncidentRecordDetailStatus, IncidentreportDetail } from '../incidentreport/incidentreport.model';
import { CitationDetails, CitationDetailStatus } from '../novlist/CitationDetails';
import { ProhibitedDetails, ProhibitedDetailsStatus, ProhibitedItemAudit } from '../master/concessionaire-security/concessionaire.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  gnBaseURL;

  constructor(private http: HttpClient, appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }

  public GetCitationDetailsStatusList(fromDate,toDate): Observable<CitationDetailStatus[]> {
    return this.http.get<CitationDetailStatus[]>(this.gnBaseURL + "Citation/GetCitationDetailsStatusList?fromDate=" + fromDate + `&toDate=` + toDate);
  }
  public GetCitationsIdList() {
    return this.http.get<CitationDetails[]>(this.gnBaseURL + "Citation/GetCitationsIdList");
  }

  public GetInspectionDetailsStatusList(fromDate,toDate): Observable<InspetionRecordDetailStatus[]> {
    return this.http.get<InspetionRecordDetailStatus[]>(this.gnBaseURL + "InspectionRecord/GetInspectionDetailsStatusList?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetInspectionsIdList() {
    return this.http.get<InspetionRecordDetail[]>(this.gnBaseURL + "InspectionRecord/GetInspectionsIdList");
  }

  public GetSecurityClearanceData(fromDate,toDate): Observable<SecurityClearanceAuditLog[]> {
    return this.http.get<SecurityClearanceAuditLog[]>(this.gnBaseURL + "PendingBadgeApplicant/GetSecurityClearanceData?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetBadgeVerificationDataForAuditLog(fromDate,toDate): Observable<BadgeVerificationAudit[]> {
    return this.http.get<BadgeVerificationAudit[]>(this.gnBaseURL + "PendingBadgeApplicant/GetBadgeVerificationDataForAuditLog?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetSystemLogsDataForAuditLog(fromDate,toDate): Observable<SystemLogAudit[]> {
    return this.http.get<SystemLogAudit[]>(this.gnBaseURL + "Account/GetSystemLogsDataForAuditLog?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetIncidentList(fromDate,toDate): Observable<IncidentRecordDetailStatus[]> {
    return this.http.get<IncidentRecordDetailStatus[]>(this.gnBaseURL + "IncidentRecord/GetIncidentList?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  public GetProhibitedAuditList(fromDate,toDate): Observable<ProhibitedItemAudit[]> {
    return this.http.get<ProhibitedItemAudit[]>(this.gnBaseURL + "ConcessionSecurity/GetProhibitedAuditList?fromDate=" + fromDate + `&toDate=` + toDate);
  }

   public GetProhibitedItemsList(fromDate,toDate): Observable<ProhibitedDetailsStatus[]> {
    return this.http.get<ProhibitedDetailsStatus[]>(this.gnBaseURL + "ConcessionSecurity/GetProhibitedItemDetailsList?fromDate=" + fromDate + `&toDate=` + toDate);
  }
}
