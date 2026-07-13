import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CitationReasons, DataOutputModel } from '../citationreasons';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class CitationReasonsService {
    gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    

    public GetCitationReasonList() {

        return this.http.get<CitationReasons[]>(this.gnBaseURL + "CitationReason/GetCitationReasonList");
    }
    public GetCitationReasonListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "CitationReason/GetCitationReasonListNew",{ params: params });
      }

    public GetCitationReasonListByViolation(violationTypeId: number) {
        return this.http.get<CitationReasons[]>(this.gnBaseURL + "CitationReason/GetCitationReasonListByViolation/" + violationTypeId);
    }
    public GetCitationReasonsById(id: number) {

        return this.http.get<CitationReasons>(this.gnBaseURL + "CitationReason/GetCitationReasonsById/" + id);
    }

    public DeleteCitationReasonsById(id: number) {

        return this.http.get(this.gnBaseURL + "CitationReason/DeleteCitationReasonsById/" + id);
    }
    public AddEditCitationReasons(CitationReasons) {

        var formData = new FormData();
        formData.append("citationreasons", JSON.stringify(CitationReasons));

        return this.http
            .post<CitationReasons>(this.gnBaseURL + "CitationReason/AddEditCitationReasons", formData);
    }

    public CheckReasonExists(name: string, violationTypeId: number): Observable<boolean> {
        return this.http
            .get<boolean>(this.gnBaseURL + "CitationReason/checkReasonExists/" + name + "/" + violationTypeId);
    }


     public updateStatus(id: number, status: boolean,user: string): Observable<any> {
    const body = {
      id: id,
      status: status,
      user: user
    };

    return this.http.put(this.gnBaseURL+"CitationReason/updateStatus", body);
  }

   public changeActiveFlag(isChecked, id,user) {
        var formData = new FormData();
        formData.append("isChecked", isChecked);
        formData.append("id", id);
        formData.append("user",user)
        // return this.http.get<RemedialTraining[]>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingList");
        return this.http
            .post(this.gnBaseURL + "CitationReason/changeActiveFlag", formData);
  }
}
