import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataOutputModel, ViolationTypes } from '../violationtypes';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class ViolationTypesService {gnBaseURL;
    constructor(private http: HttpClient,private appURL: AppConfigService) {this.gnBaseURL = appURL.getServerUrl();
    }

    public GetViolationTypeList() {
        
        return this.http.get<ViolationTypes[]>(this.gnBaseURL +"ViolationType/GetViolationTypeList");
    }
    
    public GetViolationTypeListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "ViolationType/GetViolationTypeListNew",{ params: params });
      }

    public GetViolationTypeById(id: number) {
        
        return this.http.get<ViolationTypes>(this.gnBaseURL +"ViolationType/GetViolationTypeById/" + id);
    }

    public DeleteViolationTypeById(id: number) {
        
        return this.http.get(this.gnBaseURL +"ViolationType/DeleteViolationTypeById/" + id);
    }   
    public AddEditViolationTypes(violationTypes) {
        
        var formData = new FormData();
        formData.append("violationTypes", JSON.stringify(violationTypes));
       
        return this.http
          .post<ViolationTypes>(this.gnBaseURL +"ViolationType/AddEditViolationType", formData);
      }

      public CheckTypeExists(name: string): Observable<boolean> {
        return this.http
          .get<boolean>(this.gnBaseURL +"ViolationType/checkTypeExists/" + name);
      }

    public updateStatus(id: number, status: boolean): Observable<any> {
    const body = {
      id: id,
      status: status
    };

    return this.http.put(this.gnBaseURL+"ViolationType/updateStatus", body);
  }

   public changeActiveFlag(isChecked, id,user) {
        var formData = new FormData();
        formData.append("isChecked", isChecked);
        formData.append("id", id);
        formData.append("user",user);
        // return this.http.get<RemedialTraining[]>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingList");
        return this.http
            .post(this.gnBaseURL + "ViolationType/changeActiveFlag", formData);
  }
}
