import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ViolationTypes } from '../violationtypes';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { BadgeReportSettings,BadgeReportEmailSettings, DataOutputModel } from '../badgereportsettings';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class BadgeReportSettingsService {gnBaseURL;
    constructor(private http: HttpClient,private appURL: AppConfigService) {this.gnBaseURL = appURL.getServerUrl();
    }

    public GetBadgeReportEmailSettingsList() {
        
        return this.http.get<BadgeReportEmailSettings[]>(this.gnBaseURL +"PendingBadgeApplicant/GetBadgeReportEmailSettingsList");
    }
    public GetBadgeReportEmailSettingsListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "PendingBadgeApplicant/GetBadgeReportEmailSettingsListNew",{ params: params });
      }


    public GetBadgeReportEmailSettingsById(id: number) {
        
        return this.http.get<BadgeReportEmailSettings>(this.gnBaseURL +"PendingBadgeApplicant/GetBadgeReportEmailSettingsById/" + id);
    }
    public GetBadgeReportSettings() {
        
        return this.http.get<BadgeReportSettings>(this.gnBaseURL +"PendingBadgeApplicant/GetBadgeReportSettings");
    }
    public DeleteBadgeReportEmailSettingsById(id: number) {
        
        return this.http.get(this.gnBaseURL +"PendingBadgeApplicant/DeleteBadgeReportEmailSettingsById/" + id);
    }   
    public AddEditBadgeReportEmailSettings(badgereportemailsettings) {
        
        var formData = new FormData();
        formData.append("badgereportemailsettings", JSON.stringify(badgereportemailsettings));
       
        return this.http
          .post<BadgeReportEmailSettings>(this.gnBaseURL +"PendingBadgeApplicant/AddEditBadgeReportEmailSettings", formData);
      }
      public AddEditBadgeReportSettings(badgereportsettings) {
        
        var formData = new FormData();
        formData.append("badgereportsettings", JSON.stringify(badgereportsettings));
       
        return this.http
          .post<BadgeReportSettings>(this.gnBaseURL +"PendingBadgeApplicant/AddEditBadgeReportSettings", formData);
      }

      public CheckBadgeReportEmailSettingsExists(email: string): Observable<boolean> {
        return this.http
          .get<boolean>(this.gnBaseURL +"PendingBadgeApplicant/CheckBadgeReportEmailSettingsExists/" + email);
      }
}
