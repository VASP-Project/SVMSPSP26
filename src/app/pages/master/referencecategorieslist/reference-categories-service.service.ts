import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QueryStringParameters } from '@app/shared/shared.model';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { Observable } from 'rxjs';
import { DataOutputModel, ReferenceCategories, ReferenceSortOrders } from './referencecategories';

@Injectable({
  providedIn: 'root'
})
export class ReferenceCategoriesServiceService {gnBaseURL;

  constructor(private http:HttpClient,private appURL:AppConfigService) {this.gnBaseURL=appURL.getServerUrl();
   }
   public AddEditReferenceCategories(referenceCategoryDetails) {
        
    var formData = new FormData();
    formData.append("referenceCategories", JSON.stringify(referenceCategoryDetails));
   
    return this.http
      .post<ReferenceCategories>(this.gnBaseURL +"ReferenceCategories/AddEditReferenceCategories", formData);
  }
  public CheckCategoryExists(name: string): Observable<boolean> {
    return this.http
      .get<boolean>(this.gnBaseURL +"ReferenceCategories/CheckCategoryExists/" + name);
  }
  public GetSortOrderList() {

    return this.http.get<ReferenceSortOrders[]>(this.gnBaseURL +"ReferenceCategories/GetSortOrderList");
}
public GetReferenceCategoriesList() {
        
  return this.http.get<ReferenceCategories[]>(this.gnBaseURL +"ReferenceCategories/GetReferenceCategoriesList");
}
public GetReferenceCategoriesListNew(parameters: QueryStringParameters) {
  let params = new HttpParams();
  params = params.append('MaxPageSize', parameters.maxPageSize);
  params = params.append('PageNumber', parameters.pageNumber);
  params = params.append('PageSize', parameters.pageSize);
  params = params.append('SearchQuery', parameters.searchQuery);
  params = params.append('OrderBy', parameters.orderBy);
  params = params.append('OrderDir', parameters.orderDir);
  return this.http.get<DataOutputModel>(this.gnBaseURL + "ReferenceCategories/GetReferenceCategoriesListNew",{ params: params });
}
public GetSortOrderbyId(id: number) {
        
  return this.http.get<ReferenceSortOrders>(this.gnBaseURL +"ReferenceCategories/GetSortOrderbyId/" + id);
}
public DeleteCategoryById(id: number) {

  return this.http.get(this.gnBaseURL + "ReferenceCategories/DeleteCategoryById/" + id);
}
public GetReferenceCategoryById(id: number) {

  return this.http.get<ReferenceCategories>(this.gnBaseURL + "ReferenceCategories/GetReferenceCategoryById/" + id);
}



}
