import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Company, DataOutputModel } from '../company';
import { Observable } from 'rxjs';
import { LineChartLabelModel } from '../company';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class CompanyService {
  getAllCompanies() {
    throw new Error('Method not implemented.');
  }
        gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    public GetCompanyList() {

        return this.http.get<Company[]>(this.gnBaseURL +"Company/GetCompanyList");
    }
    public GetCompanyListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "Company/GetCompanyListNew",{ params: params });
      }

    public GetCompanyById(id: number) {

        return this.http.get<Company>(this.gnBaseURL +"Company/GetCompanyById/" + id);
    }

    public DeleteCompanyById(id: number) {

        return this.http.get(this.gnBaseURL +"Company/DeleteCompanyById/" + id);
    }
    public AddEditCompany(Company) {

        // var formData = new FormData();
        // formData.append("company", JSON.stringify(Company));

        return this.http
            .post<Company>(this.gnBaseURL +"Company/AddEditCompany", Company);
    }

    public CheckCompanyExists(model: any): Observable<boolean> {
        return this.http
            .post<boolean>(this.gnBaseURL +"Company/CheckCompanyExists", model);
    }
    
    public GetLineChartData(companyRecordLimit: string, selectedTrend: string) {
        return this.http.get<Object[]>(this.gnBaseURL + "Company/GetLineChartData?companyRecordLimit=" + companyRecordLimit + `&selectedTrend=` + selectedTrend);
    }

    public GetLineChartLabelsData(selectedTrend: string) {
        return this.http.get<LineChartLabelModel[]>(this.gnBaseURL + "Company/GetLineChartLabelsData/" + selectedTrend);
    }

}
