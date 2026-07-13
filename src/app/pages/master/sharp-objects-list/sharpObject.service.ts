import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfigService } from "src/app/_services/appconfigservice ";
import { SharpObjects } from "./sharpObjects";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class SharpObjectsService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  public GetSharpObjectList() {
    return this.http.get<SharpObjects[]>(
      this.gnBaseURL + "IncidentProhibitedItem/GetSharpObjectList"
    );
  }
  public DeleteSharpObjactsById(id: number) {
    return this.http.get(
      this.gnBaseURL + "IncidentProhibitedItem/DeleteSharpObjectById/" + id
    );
  }
  public GetSharpObjectsById(id: number) {
    return this.http.get<SharpObjects>(
      this.gnBaseURL + "IncidentProhibitedItem/GetSharpObjectsById/" + id
    );
  }
  public checkSharpObjectsExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.gnBaseURL + "IncidentProhibitedItem/checkSharpObjectsExists/" + name
    );
  }
  public AddEditSharpObject(sharpObject) {
    var formData = new FormData();
    formData.append("sharpObjects", JSON.stringify(sharpObject));

    return this.http.post<SharpObjects>(
      this.gnBaseURL + "IncidentProhibitedItem/AddEditSharpObject",
      formData
    );
  }
}
