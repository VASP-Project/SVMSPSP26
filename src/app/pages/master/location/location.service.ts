import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryStringParameters } from '@app/shared/shared.model';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { DataOutputModel, Locations, LocationsList } from '../locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) { 
    this.gnBaseURL = appURL.getServerUrl();
  }

  public GetLocationList() {
    return this.http.get<LocationsList[]>(this.gnBaseURL + "Location/GetLocationList");
  }
  public GetLocationListNew(parameters: QueryStringParameters) {
    let params = new HttpParams();
    params = params.append('MaxPageSize', parameters.maxPageSize);
    params = params.append('PageNumber', parameters.pageNumber);
    params = params.append('PageSize', parameters.pageSize);
    params = params.append('SearchQuery', parameters.searchQuery);
    params = params.append('OrderBy', parameters.orderBy);
    params = params.append('OrderDir', parameters.orderDir);
    return this.http.get<DataOutputModel>(this.gnBaseURL + "Location/GetLocationListNew",{ params: params });
  }


  public GetLocationListByFacility(facilityId: number) {
    return this.http.get<Locations[]>(this.gnBaseURL + "Location/GetLocationListByFacility/" + facilityId);
  }

  public GetLocationById(id: number) {
    return this.http.get<Locations>(this.gnBaseURL + "Location/GetLocationById/" + id);
  }

  public DeleteLocationById(id: number) {
    return this.http.get(this.gnBaseURL + "Location/DeleteLocationById/" + id);
  }

  public AddEditLocation(location,files, deletedFiles) {
    var formData = new FormData();
    formData.append("location", JSON.stringify(location));
    formData.append("deletedFiles", JSON.stringify(deletedFiles));
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
      }
    }
    return this.http
        .post<Locations>(this.gnBaseURL + "Location/AddEditLocation", formData);
  }

  public CheckLocationExists(name: string, facilityId: number): Observable<boolean> {
    return this.http
        .get<boolean>(this.gnBaseURL + "Location/checkLocationExists/" + name + "/" + facilityId);
  }

  getAttachment(id: number) {
    return this.http.get(this.gnBaseURL + "Location/filedownload?id=" + id, { responseType: 'blob' }).
      pipe();
  }
}
