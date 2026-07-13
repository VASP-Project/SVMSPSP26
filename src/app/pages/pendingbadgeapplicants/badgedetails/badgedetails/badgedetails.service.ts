import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { BadgeData, BadgeDetails } from './badgedetails.model';


@Injectable({
  providedIn: 'root'
})
export class BadgeDetailsService {
  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) { 
    this.gnBaseURL = appURL.getServerUrl();
  }

  public GetBadgeDetails() {
    return this.http.get<BadgeData>(this.gnBaseURL + "SafeWebAPI/GetBadgeDetails");
  }
  getPhoto(): Observable<Blob> {
    return this.http.get(this.gnBaseURL + "SafeWebAPI/GetPhoto", { responseType: 'blob' });
  }
}