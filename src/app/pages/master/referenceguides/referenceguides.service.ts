import { ReferenceCategories } from './../referencecategorieslist/referencecategories';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReferenceGuides } from '../referenceguides';
import { environment } from 'src/environments/environment';
import { AppConfigService } from 'src/app/_services/appconfigservice ';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferenceguidesService {
  gnBaseURL;
  constructor(private http: HttpClient, private appURL: AppConfigService) { this.gnBaseURL = appURL.getServerUrl(); }

  public GetReferenceGuidesList() {
    return this.http.get<ReferenceGuides[]>(this.gnBaseURL + "ReferenceGuides/GetReferenceGuidesList");
  }

  public deleteUpdateDocument(id) {
    return this.http.delete(this.gnBaseURL + "ReferenceGuides/DeleteReferenceGuides/" + id);
  }

  public AddReferenceGuides(referenceGuides, files, links) {
    var formData = new FormData();
    formData.append("referenceGuides", JSON.stringify(referenceGuides));
    formData.append("links", links);
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        formData.append(files[i].name, files[i])
      }
    }
    return this.http.post<any>(this.gnBaseURL + "ReferenceGuides/AddReferenceGuides", formData);
  }
  // public AddReferenceGuides(referenceGuides, files) {
  //   var formData = new FormData();
  //   formData.append("referenceGuides", JSON.stringify(referenceGuides));
  //   if (files != null) {
  //     for (var i = 0; i < files.length; i++) {
  //       formData.append(files[i].name, files[i])
  //     }
  //   }
  //   return this.http.post<any>(this.gnBaseURL +"ReferenceGuides/AddReferenceGuides", formData);
  // }

  getAttachment(id: number) {
    return this.http.get(this.gnBaseURL + "ReferenceGuides/filedownload?id=" + id, { responseType: 'blob' }).
      pipe();
  }
  public GetReferenceCategory(fromDate, toDate): Observable<ReferenceCategories[]> {
    return this.http
      .get<ReferenceCategories[]>(this.gnBaseURL + "ReferenceGuides/GetReferenceCategory?fromDate=" + fromDate + `&toDate=` + toDate);
  }

  GetReferenceCategoryGuidesList(id: number) {
    return this.http.get<ReferenceGuides[]>(this.gnBaseURL + "ReferenceGuides/GetReferenceCategoryGuidesList?id=" + id);
  }
  public GetReferenceGuideById(id: number) {

    return this.http.get<ReferenceGuides>(this.gnBaseURL + "ReferenceGuides/GetReferenceGuideById/" + id);
  }
  public GetSortorderId(id: number) {

    return this.http.get<ReferenceCategories>(this.gnBaseURL + "ReferenceGuides/GetSortorderId/" + id);
  }

  fileuploadtoAi(id: number, msg: string) {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('msg', msg);
    return this.http.post<any>(this.gnBaseURL + "VectorDb/fileuploadtoAi", formData)
  }

  sendmsg(query: string) {
    const body = { query: query };
    return this.http.post<{ reply: string }>(
      this.gnBaseURL + "VectorDb/searchdata",
      body
    );
  }

  getUploadedFileUrl(id: number): string {
    return `${this.gnBaseURL}ReferenceGuides/getuploadfile?id=${id}`;
  }

  downloadUploadedFilenew(id: number) {
    return this.http.get(
      `${this.gnBaseURL}ReferenceGuides/getuploadfile?id=${id}`,
      {
        responseType: 'blob',
        observe: 'response'
      }
    );
  }
}