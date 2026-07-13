import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService } from "@app/_services/appconfigservice ";
import { IncidentLocations } from "../incidentreport/incidentreport.model";

@Injectable({ providedIn: "root" })
export class MapService {
  gnBaseURL: string;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  public GetIncidentLocationList() {
    return this.http.get<IncidentLocations[]>(
      this.gnBaseURL + "IncidentRecord/GetIncidentLocationList"
    );
  }

  public UpdateIncidentLocationMaster(
    incidentLocation: number,
    xCoordinate: number,
    yCoordinate: number
  ) {
    return this.http.get<IncidentLocations>(
      this.gnBaseURL +
        "IncidentRecord/UpdateIncidentLocationMaster/" +
        incidentLocation +
        "/" +
        xCoordinate +
        "/" +
        yCoordinate
    );
  }
}
