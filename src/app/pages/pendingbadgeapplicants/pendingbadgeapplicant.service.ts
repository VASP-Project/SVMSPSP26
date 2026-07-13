import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { Company } from '../master/company';
import { BadgeVerification, PendingBadgeApplicants } from './pendingbadgeapplicants';

@Injectable({
  providedIn: 'root'
})
export class PendingbadgeapplicantService {
  gnBaseURL;

  constructor(private http: HttpClient, private appURL: AppConfigService) { 
    this.gnBaseURL = appURL.getServerUrl();
  }

  // public GetPendingBadgeApplicantsList(userid) {
  //   return this.http.get<PendingBadgeApplicants[]>(this.gnBaseURL + "PendingBadgeApplicant/GetPendingBadgeApplicantsList/"+userid);
  // }
  public GetPendingBadgeApplicantsList(reportFor) {
    return this.http.get<PendingBadgeApplicants[]>(this.gnBaseURL + "PendingBadgeApplicant/GetPendingBadgeApplicantsList/"+reportFor);
  }

  public SaveClearanceDetails(clearanceDetails)
   {    
     var formData = new FormData();
     formData.append("clearanceDetails", JSON.stringify(clearanceDetails));         
     return this.http
       .post(this.gnBaseURL + "PendingBadgeApplicant/SaveClearanceDetails/", formData);        
   }  

   public SaveDenyDetails(denyDetails)
   {    
     var formData = new FormData();
     formData.append("clearanceDetails", JSON.stringify(denyDetails));         
     return this.http
       .post(this.gnBaseURL + "PendingBadgeApplicant/SaveDenyDetails/", formData);        
   }  


  public CompleteBadgeProcess(id: number) 
  {        
    return this.http.get(this.gnBaseURL +"PendingBadgeApplicant/CompleteBadgeProcess/" + id);
  }
  
  public GetAuthSignerCompanyList() 
  {
    return this.http.get<string[]>(this.gnBaseURL +"PendingBadgeApplicant/GetAuthSignerCompanyList");
  }

  public GetBadgeVerificationData(badgeNo): Observable<BadgeVerification[]> 
  {
    return this.http
      .get<BadgeVerification[]>(this.gnBaseURL + "PendingBadgeApplicant/GetBadgeVerificationData/" + badgeNo);
  }

  public GetBadgeVerificationDataByBadgeNo(badgeNo,userid): Observable<any> 
  {
    return this.http
      .get<any>(this.gnBaseURL + "PendingBadgeApplicant/GetBadgeVerificationDataByBadgeNo?badgeNo=" + badgeNo + `&userid=` + userid);
  }

  public UnsaveClearanceDetails(unapproveDetails)
   {    
     var formData = new FormData();
     formData.append("unapproveDetails", JSON.stringify(unapproveDetails));         
     return this.http
       .post(this.gnBaseURL + "PendingBadgeApplicant/UnsaveClearanceDetails/", formData);        
   }

   public SaveUndenyDetails(undenyDetails)
   {    
     var formData = new FormData();
     formData.append("unapproveDetails", JSON.stringify(undenyDetails));         
     return this.http
       .post(this.gnBaseURL + "PendingBadgeApplicant/SaveUndenyDetails/", formData);        
   } 

   public GetBadgeByNumber(badgeNumber: string, userid:string) {
    return this.http
      .get<any>(this.gnBaseURL + "SafeWebAPI/GetBadgeVerificationDataByBadgeNo/" + badgeNumber + "/" + userid);
  }
}
