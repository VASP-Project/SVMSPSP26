import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataOutputModel, RemedialTraining } from '../remedialtraining';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class RemedialTrainingService {
        gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    public GetRemedialTrainingList() {

        return this.http.get<RemedialTraining[]>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingList");
    }
    public GetRemedialTrainingListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingListNew",{ params: params });
      }

    public changeActiveFlag(isChecked, id) {
        var formData = new FormData();
        formData.append("isChecked", isChecked);
        formData.append("id", id);
        // return this.http.get<RemedialTraining[]>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingList");
        return this.http
            .post(this.gnBaseURL + "RemedialTraining/changeActiveFlag", formData);
    }

    public GetRemedialTrainingById(id: number) {

        return this.http.get<RemedialTraining>(this.gnBaseURL + "RemedialTraining/GetRemedialTrainingById/" + id);
    }

    public DeleteRemedialTrainingById(id: number) {

        return this.http.get(this.gnBaseURL + "RemedialTraining/DeleteRemedialTrainingById/" + id);
    }
    public AddEditRemedialTraining(remedialTraining) {

        var formData = new FormData();
        formData.append("remedialTraining", JSON.stringify(remedialTraining));

        return this.http
            .post<RemedialTraining>(this.gnBaseURL + "RemedialTraining/AddEditRemedialTraining", formData);
    }

    public CheckTypeExists(name: string): Observable<boolean> {
        return this.http
            .get<boolean>(this.gnBaseURL + "RemedialTraining/checkTypeExists/" + name);
    }
}
