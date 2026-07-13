import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AppConfigService } from "src/app/_services/appconfigservice ";
import { Observable } from "rxjs";
import { Disabling } from "./disabling";

@Injectable({ providedIn: "root" })
export class DisablingService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  public GetDisablingList() {
    return this.http.get<Disabling[]>(
      this.gnBaseURL + "IncidentProhibitedItem/GetDisablingList"
    );
  }
  public DeleteDisablingById(id: number) {
    return this.http.get(
      this.gnBaseURL + "IncidentProhibitedItem/DeleteDisablingById/" + id
    );
  }
  public GetDisablingById(id: number) {
    return this.http.get<Disabling>(
      this.gnBaseURL + "IncidentProhibitedItem/GetDisablingById/" + id
    );
  }
  public checkDisablingExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.gnBaseURL + "IncidentProhibitedItem/checkDisablingExists/" + name
    );
  }
  public AddEditDisabling(disabling) {
    var formData = new FormData();
    formData.append("disabling", JSON.stringify(disabling));
    return this.http.post<Disabling>(
      this.gnBaseURL + "IncidentProhibitedItem/AddEditDisabling",
      formData
    );
  }
}
