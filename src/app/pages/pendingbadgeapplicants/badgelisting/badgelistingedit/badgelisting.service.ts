import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { Observable } from 'rxjs';
import { AuditCompanysViewModel, BadgeHolderCountViewModel } from '../../badgeauditdashboard/badgeauditdashboard.model';
import { AuditCompanies, AuthSignerCountViewModel, BadgeAuditCompanyEmployeeList, BadgeAuditDetails, DataOutputModel, DataOutputModelemp } from '../badgelisting.model';
import { BadgeAuditCompanyEmployee } from '../badgelisting.model';

@Injectable({
  providedIn: 'root'
})
export class BadgelistingService {

  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }

  public GetBadgeAuditCompanyList(id: number) {
    return this.http.get<AuditCompanysViewModel[]>(this.gnBaseURL + "BadgeAudit/GetAuditCompanys/" + id);
  }
  public ClosedAudit(id: number) {
    return this.http.get<any>(this.gnBaseURL + "BadgeAudit/ClosedAudit/" + id);
  }
  public GetBadgeAuditColorList(id: number) {
    return this.http.get<BadgeHolderCountViewModel>(this.gnBaseURL + "BadgeAudit/GetBadgeColors/" + id);
  }

  public GetBadgeAuditEmployeeList(id: number, companyName: string) {
    var model = {
      AuditId: id,
      companyName: companyName
    }
    return this.http.post<BadgeAuditCompanyEmployee[]>(this.gnBaseURL + "BadgeAudit/GetBadgeAuditEmployeesByCompany", model);
  }


  public GetBadgeAuditList(parameters: QueryStringParameters) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    return this.http.get<DataOutputModel>(this.gnBaseURL + "BadgeAudit", { params: params });
  }

  public GetBadgeAuditByRole(parameters: QueryStringParameters, id: string) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    return this.http.get<DataOutputModel>(this.gnBaseURL + "BadgeAudit/GetBadgeAuditByRole?id=" + id, { params: params });
  }

  public CheckCompanylaunch(): Observable<boolean> {
    return this.http
      .get<boolean>(this.gnBaseURL + "BadgeAudit/CheckCompanylaunch/");
  }

  public GetBadgeAuditById(id: number) {
    return this.http
      .get(this.gnBaseURL + "BadgeAudit/GetBadgeAuditById?id=" + id);
  }

  public AddBadgeAudit(model: BadgeAuditDetails) {
    // var formData = new FormData();
    // formData.append("model", JSON.stringify(model));
    // formData.append("details", JSON.stringify(details));
    return this.http
      .post(this.gnBaseURL + "BadgeAudit", model);
  }

  public EditBadgeAudit(model: BadgeAuditDetails) {
    return this.http
      .put(this.gnBaseURL + "BadgeAudit/" + model.id, model);
  }



  public AddLaunchBadgeAudit(Details) {

    var formData = new FormData();
    formData.append("details", JSON.stringify(Details));

    return this.http
      .post<BadgeAuditDetails>(this.gnBaseURL + "BadgeAudit/AddLaunchBadgeAudit", formData);
  }

  public GetLaunchBadgeAuditById(id: number) {
    return this.http
      .get(this.gnBaseURL + "BadgeAudit/GetLaunchBadgeAuditById?id=" + id);
  }

  public GetLaunchBadgeAuditByIdNew(parameters: QueryStringParameters, id: number, userId: string) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    params = params.append('SelectedValue', parameters.selectedValue);
    return this.http.get<DataOutputModelemp>(this.gnBaseURL + "BadgeAudit/GetLaunchBadgeAuditByIdNew/" + id + "/" + userId, { params: params });
  }
  // public AddLaunchBadgeAudit(details){
  //   return this.http
  //     .post(this.gnBaseURL + "BadgeAudit/AddLaunchBadgeAudit", details);
  // }GetLaunchBadgeAuditByStaffAdmin

  public GetLaunchBadgeAuditByStaffAdmin(parameters: QueryStringParameters, id: number) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    return this.http.get<DataOutputModelemp>(this.gnBaseURL + "BadgeAudit/GetLaunchBadgeAuditByStaffAdmin?id=" + id, { params: params });
  }

  public EditBadgeAuditEmployee(model: BadgeAuditCompanyEmployee) {
    return this.http
      .put(this.gnBaseURL + "BadgeAudit/UpdateDeaccountable/" + model.id, model);
  }

  public RefreshBadgeAudit(model: BadgeAuditDetails) {
    return this.http
      .put(this.gnBaseURL + "BadgeAudit/RefreshBadgeAudit/" + model.id, model);
  }

  public GetLaunchBadgeAuditCount(id): Observable<BadgeAuditCompanyEmployee[]> {

    return this.http
      .get<BadgeAuditCompanyEmployee[]>(this.gnBaseURL + "BadgeAudit/GetLaunchBadgeAuditCount/" + id);
  }

  public GetBadgeAuditByDate(id: number) {
        
    return this.http.get<BadgeAuditDetails>(this.gnBaseURL +"BadgeAudit/GetBadgeAuditById?id=" + id);
  }


    public GetbadgeAuditAuthCountByCompany(id: number, userId:string) {
      return this.http.get<AuthSignerCountViewModel>(this.gnBaseURL + "BadgeAudit/GetbadgeAuditAuthCountByCompany/" + id + `/` + userId);
    }

    public GetbadgeAuditAuthCount(id: number) {
      return this.http.get<AuthSignerCountViewModel>(this.gnBaseURL + "BadgeAudit/GetbadgeAuditAuthCount/" + id);
    }

    public UpdateSubmitAudit(id: number, userId:string) {
      return this.http.get(this.gnBaseURL + "BadgeAudit/UpdateSubmitAudit/" + id + `/` + userId);
    }

    public GetActiveBadgesByAuth(parameters: QueryStringParameters, userId: string) {
      let params = new HttpParams();
      params = params.append('MaxPageSize', parameters.maxPageSize);
      params = params.append('PageNumber', parameters.pageNumber);
      params = params.append('PageSize', parameters.pageSize);
      params = params.append('SearchQuery', parameters.searchQuery);
      params = params.append('OrderBy', parameters.orderBy);
      params = params.append('OrderDir', parameters.orderDir);
      params = params.append('SelectedValue', parameters.selectedValue);
      return this.http.get<DataOutputModelemp>(this.gnBaseURL + "BadgeAudit/GetActiveBadgesByAuth?userId="  + userId, { params: params });
    }

    public GetBadgeAuditSubmitById(id: number,userId:string) {
        
      return this.http.get<BadgeAuditCompanyEmployee[]>(this.gnBaseURL +"BadgeAudit/GetBadgeAuditSubmitById/" + id+ '/' + userId);
    }
    public EditUpdateSummary(id: number, userId:string, model: AuditCompanies) {
      return this.http.put(this.gnBaseURL + "BadgeAudit/UpdateAuthComment?id="  + id  + "&userId=" + userId, model);
    }
    public addAcknowledge(id: number,userId:string) {
        
      return this.http.get<AuditCompanies[]>(this.gnBaseURL +"BadgeAudit/AddAcknowledge/" + id + "/" + userId);
    }
    public GetAcknowledgeByAuth(id: number, userId:string) {
      return this.http.get<AuditCompanies>(this.gnBaseURL + "BadgeAudit/GetAcknowledgeByAuth/" + id + `/` + userId);
    }
    public GetAcknowledgeByStaffadmin(userId:string) {
      return this.http.get<AuditCompanies[]>(this.gnBaseURL + "BadgeAudit/GetAcknowledgeByStaffadmin/" + userId);
    }
    public AddSubmit(id: number,userId:string) {
        
      return this.http.get<AuditCompanies[]>(this.gnBaseURL + "BadgeAudit/AddSubmit/" + id + "/" + userId);
    }
    
    public Updateaudit(model: BadgeAuditDetails) {
      return this.http
        .put(this.gnBaseURL + "BadgeAudit/Updateaudit/" + model.id, model);
    }
    public UpdateSubmitToLaunch(id: number, compname:string) {
      return this.http.get(this.gnBaseURL + "BadgeAudit/UpdateSubmitToLaunch/" + id + `/` + btoa(compname));
    }
    
}
