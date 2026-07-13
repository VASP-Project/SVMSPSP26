import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { InspectionDashBoard, InspectionDisplayNameWithCompany } from '@app/pages/dashboard/dashboard';
import { QueryStringParameters } from '@app/shared/shared.model';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { InspectionTypeMaster } from '../inspectiontypemaster';
import { DataOutputModel, InspectionTypes } from '../inspectiontypes';

@Injectable({ providedIn: 'root' })
export class InspectionTypeService
{
    gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    public GetInspectionTypeList() {

        return this.http.get<InspectionTypes[]>(this.gnBaseURL +"InspectionType/GetInspectionTypeList");
    }
    public GetInspectionTypeListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "InspectionType/GetInspectionTypeListNew",{ params: params });
      }

    public GetInspectionTypeById(id: number) {

        return this.http.get<InspectionTypes>(this.gnBaseURL +"InspectionType/GetInspectionTypeById/" + id);
    }

    public GetInspectionTypeByIdName(id: number,typeName:string) {

        return this.http.get<InspectionTypes>(this.gnBaseURL +"InspectionType/GetInspectionTypeByIdName/" + id + "/" + typeName);
    }

    public DeleteInspectionTypeById(id: number) {

        return this.http.get(this.gnBaseURL +"InspectionType/DeleteInspectionTypeById/" + id);
    }

    public AddEditInspectionType(inspectiontype) {

        var formData = new FormData();
        formData.append("inspectiontype", JSON.stringify(inspectiontype));

        return this.http
            .post<InspectionTypes>(this.gnBaseURL +"InspectionType/AddEditinspectiontype", formData);
    }

    public CheckinspectiontypeExists(inspectiontype: string): Observable<boolean> {
        return this.http
            .get<boolean>(this.gnBaseURL +"inspectiontype/checkinspectiontypeExists/" + inspectiontype);
    }
   

   
}