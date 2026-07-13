import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ViolationTypes } from '../violationtypes';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { DataOutputModel, EventTypes } from '../eventtypes';
import { QueryStringParameters } from '@app/shared/shared.model';


@Injectable({ providedIn: 'root' })
export class EventTypesService {gnBaseURL;
    constructor(private http: HttpClient,private appURL: AppConfigService) {this.gnBaseURL = appURL.getServerUrl();
    }

    public GetEventTypeList() {
        
        return this.http.get<EventTypes[]>(this.gnBaseURL +"Event/GetEventTypeList");
    }
    public GetEventTypeListNew(parameters: QueryStringParameters) {
        let params = new HttpParams();
        params = params.append('MaxPageSize', parameters.maxPageSize);
        params = params.append('PageNumber', parameters.pageNumber);
        params = params.append('PageSize', parameters.pageSize);
        params = params.append('SearchQuery', parameters.searchQuery);
        params = params.append('OrderBy', parameters.orderBy);
        params = params.append('OrderDir', parameters.orderDir);
        return this.http.get<DataOutputModel>(this.gnBaseURL + "Event/GetEventTypeListNew",{ params: params });
      }

    public GetEventTypeById(id: number) {
        
        return this.http.get<EventTypes>(this.gnBaseURL +"Event/GetEventTypeById/" + id);
    }

    public DeleteEventTypeById(id: number) {
        
        return this.http.get(this.gnBaseURL +"Event/DeleteEventTypeById/" + id);
    }   
    public AddEditEventTypes(violationTypes) {
        
        var formData = new FormData();
        formData.append("eventTypes", JSON.stringify(violationTypes));
       
        return this.http
          .post<EventTypes>(this.gnBaseURL +"Event/AddEditEventType", formData);
      }

      public CheckTypeExists(name: string): Observable<boolean> {
        return this.http
          .get<boolean>(this.gnBaseURL +"Event/checkTypeExists/" + name);
      }
}
