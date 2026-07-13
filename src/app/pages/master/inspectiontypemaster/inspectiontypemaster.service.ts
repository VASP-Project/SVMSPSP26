import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { QueryStringParameters } from '@app/shared/shared.model';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { InspectionTypeMaster } from '../inspectiontypemaster';



@Injectable({ providedIn: 'root' })
export class InspectionTypeMasterService
{
    gnBaseURL;
    constructor(private http: HttpClient, private appURL: AppConfigService) {
        this.gnBaseURL = appURL.getServerUrl();
    }

    public AddInspectionMaster(inspectiontypemaster) {
        var formData = new FormData();
        formData.append("inspectiontypemaster", JSON.stringify(inspectiontypemaster));

        return this.http.post(this.gnBaseURL + "InspectionTypeMaster/AddInspectionTypeMaster", formData);
    }
    public GetInspectionTypeMasterList() {

        return this.http.get<InspectionTypeMaster[]>(this.gnBaseURL +"InspectionTypeMaster/GetInspectionTypeMasterList");
    }
    public GetInspectionTypeMasterById(id: number) {

        return this.http.get<InspectionTypeMaster>(this.gnBaseURL +"InspectionTypeMaster/GetInspectionTypeMasterById/" + id);
    }
    public DeleteInspectionMasterById(id: number,name:string) {

        return this.http.get(this.gnBaseURL + "InspectionTypeMaster/DeleteInspectionMasterById/" + id + `/` + name);
    }
}