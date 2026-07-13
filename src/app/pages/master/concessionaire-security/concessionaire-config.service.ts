import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { Observable } from 'rxjs';
import { FormDataModel } from './concessionaire.model';

@Injectable({
  providedIn: 'root'
})
export class ConcessionaireService {
  private baseUrl: string;

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    this.baseUrl = this.appConfigService.getServerUrl(); // e.g., http://localhost:5000/api/
  }

  // saveConfig(payload: {
  //   id: number;
  //   quantityPerItem: number;
  //   quantityPerCompany: number;
  //   noOfAuditsPerDay: number;
  // }): Observable<any> {
  //   const variables = {
  //     id: payload.id,
  //     itemQuantity: payload.quantityPerItem,
  //     itemForCompany: payload.quantityPerCompany,
  //     auditCount: payload.noOfAuditsPerDay
  //   };

  //   // No need for FormData unless you're uploading files
  //   return this.http.post(`${this.baseUrl}ConcessionSecurity/AddEditConcessionvariable`, variables);
  // }

    public saveConfig(concessionaire) {
          
          var formData = new FormData();
          formData.append("variables", JSON.stringify(concessionaire));
         
          return this.http
            .post<FormDataModel>(this.baseUrl +"ConcessionSecurity/AddEditConcessionvariable", formData);
        }

  getConcessionVariable(): Observable<any> {
    return this.http.get(`${this.baseUrl}ConcessionSecurity/GetConcessionVariable`);
  }
}
