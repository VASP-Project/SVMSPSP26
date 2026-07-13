import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QueryStringParameters } from "@app/shared/shared.model";
import { Observable } from "rxjs";
import { AppConfigService } from "src/app/_services/appconfigservice ";
import { Scheduler } from "./Scheduler";

@Injectable({ providedIn: "root" })
export class SchedulerService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }

  public AddScheduler(scheduler) {
    var formData = new FormData();
    formData.append("Scheduler", JSON.stringify(scheduler));
    return this.http.post<any>(
      this.gnBaseURL + "Scheduler/AddScheduler",
      formData
    );
  }

  public UpdateSubmitBySuperAdmin(id: number) {
    return this.http.get<Scheduler>(
      this.gnBaseURL + "Scheduler/UpdateSubmitBySuperAdmin/" + id
    );
  }

  public GetScheduleDataList() {
    return this.http.get<Scheduler[]>(
      this.gnBaseURL + "Scheduler/GetScheduleDataList"
    );
  }

  public GetScheduleById(id: number) {
    return this.http.get<any>(
      this.gnBaseURL + "Scheduler/GetScheduleWithFormattedDataById/" + id
    );
  }

  public UpdateVerifyByTSA(
    id: number,
    verifiedtext: string,
    approvedBy: string,
    approvedDate: string
  ) {
    const params = new HttpParams().set("verifiedtext", verifiedtext);
    return this.http.get<Scheduler>(
      this.gnBaseURL +
        "Scheduler/UpdateVerifyByTSA/" +
        id +
        "/" +
        verifiedtext +
        "/" +
        approvedBy +
        "/" +
        approvedDate
    );
  }

}
