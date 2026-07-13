import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfigService } from "src/app/_services/appconfigservice ";
import { Observable } from "rxjs";
import { Incendiaries } from "./incendiaries";

@Injectable({ providedIn: "root" })
export class IncendiariesService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  public GetIncendiariesList() {
    return this.http.get<Incendiaries[]>(
      this.gnBaseURL + "IncidentProhibitedItem/GetIncendiariesList"
    );
  }
  public DeleteIncendiariesById(id: number) {
    return this.http.get(
      this.gnBaseURL + "IncidentProhibitedItem/DeleteIncendiariesById/" + id
    );
  }
  public GetIncendiariesById(id: number) {
    return this.http.get<Incendiaries>(
      this.gnBaseURL + "IncidentProhibitedItem/GetIncendiariesById/" + id
    );
  }
  public checkIncendiariesExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.gnBaseURL + "IncidentProhibitedItem/checkIncendiariesExists/" + name
    );
  }
  public AddEditIncendiaries(incendiaries) {
    var formData = new FormData();
    formData.append("incendiaries", JSON.stringify(incendiaries));

    return this.http.post<Incendiaries>(
      this.gnBaseURL + "IncidentProhibitedItem/AddEditIncendiaries",
      formData
    );
  }
}
