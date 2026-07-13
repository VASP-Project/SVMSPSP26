import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QueryStringParameters } from "@app/shared/shared.model";
import { Observable } from "rxjs";
import { AppConfigService } from "src/app/_services/appconfigservice ";
import { InputParameters } from "./test_macro";

@Injectable({ providedIn: "root" })
export class TestMacroService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) {
    this.gnBaseURL = appURL.getServerUrl();
  }

  public AddInputParameters(inputParameters) {
    var formData = new FormData();
    formData.append("TestMacro", JSON.stringify(inputParameters));
    return this.http.post<any>(
      this.gnBaseURL + "TestMacro/AddInputParameters",
      formData
    );
  }
  public GetScheduleById(id: number) {
    return this.http.get<any>(
      this.gnBaseURL + "TestMacro/GetScheduleWithFormattedDataById/" + id
    );
  }
  public GetScheduleDataList() {
    return this.http.get<InputParameters[]>(
      this.gnBaseURL + "TestMacro/GetScheduleDataList"
    );
  }
  public UpdateSubmitBySuperAdmin(id: number) {
    return this.http.get<InputParameters>(
      this.gnBaseURL + "TestMacro/UpdateSubmitBySuperAdmin/" + id
    );
  }
  public UpdateVerifyByTSA(
    id: number,
    verifiedtext: string,
    approvedBy: string,
    approvedDate: string
  ) {
    const params = new HttpParams().set("verifiedtext", verifiedtext);
    return this.http.get<InputParameters>(
      this.gnBaseURL +
        "TestMacro/UpdateVerifyByTSA/" +
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
