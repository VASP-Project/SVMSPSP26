import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryStringParameters } from '@app/shared/shared.model';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { DataOutputModel, Facilities } from '../facility';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) { 
    this.gnBaseURL = appURL.getServerUrl();
  }

  public GetFacilityList() {
        
    return this.http.get<Facilities[]>(this.gnBaseURL +"Facility/GetFacilityList");
  }

  public GetFacilityListNew(parameters: QueryStringParameters) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    return this.http.get<DataOutputModel>(this.gnBaseURL + "Facility/GetFacilityListNew",{ params: params });
  }
  public GetFacilityById(id: number) {
        
    return this.http.get<Facilities>(this.gnBaseURL +"Facility/GetFacilityById/" + id);
  }

  public DeleteFacilityById(id: number) {
        
    return this.http.get(this.gnBaseURL +"Facility/DeleteFacilityById/" + id);
  } 

  public AddEditFacility(facility) {        
    var formData = new FormData();
    formData.append("facility", JSON.stringify(facility));
   
    return this.http
      .post<Facilities>(this.gnBaseURL +"Facility/AddEditFacility", formData);
  }

  public CheckTypeExists(name: string): Observable<boolean> {
    return this.http
      .get<boolean>(this.gnBaseURL +"Facility/checkTypeExists/" + name);
  }
}
