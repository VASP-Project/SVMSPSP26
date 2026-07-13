import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AppConfigService } from '@app/_services/appconfigservice ';

@Injectable({ providedIn: 'root' })
export class SMSNovService {
  gnBaseURL;
  //gnBaseURL:string = "http://localhost:54785/api/";
  constructor(
    private http: HttpClient,
    appURL: AppConfigService
  ) {
    this.gnBaseURL = appURL.getServerUrl();
  }


  public GetCitationDetailsById(citationId: number, companyId: number) {

    return this.http.get<any>(this.gnBaseURL + "citation/GetCitationDetailsByIdNewApplication?citationId=" + citationId + `&companyId=` + companyId);

  }


}
