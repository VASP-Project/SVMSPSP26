import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfigService } from '@app/_services/appconfigservice ';
import { QueriesList, QueryVewModel } from './query.model';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  gnBaseURL;
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    appURL: AppConfigService
  ) {
    this.gnBaseURL = appURL.getServerUrl();
  }
  // public GetQueryList() {
  //   try {
  //     return this.http.get<QueriesList[]>(
  //       `${this.gnBaseURL}Query/GetQueryList`);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  public GetQueryList() {

    return this.http.get<QueriesList[]>(this.gnBaseURL + "Query/GetQueryList");
  }

  // public GetQuery(rowId)
  // {
  //   try{
  //     var formData = new FormData();
  //     formData.append('rowId', rowId);

  //     return this.http.post<any>(
  //       `${this.gnBaseURL}Query/GetQuery`,
  //       formData
  //     );
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

  public GetQueryById(id: number) {

    return this.http.get<QueriesList>(this.gnBaseURL + "Query/GetQueryById/" + id);
  }

  public showQueryResult(queryData) {

    var formData = new FormData();
    formData.append("queryData", JSON.stringify(queryData));

    return this.http
      .post<any>(this.gnBaseURL + "Query/showQueryResult", formData);
  }

  public AddQuery(model: QueriesList) {

    var formData = new FormData();
    //formData.append("queryData", JSON.stringify(queryData));

    return this.http
      .post<QueryVewModel>(this.gnBaseURL + "Query/AddQuery", model);
  }

  public DeleteQueryById(id: number) {

    return this.http.get(this.gnBaseURL + "Query/DeleteQueryById/" + id);
  }

  public getQueryParamaters(rowId) {
    var formData = new FormData();
    formData.append('rowId', rowId);
    // var formData = new FormData();
    // formData.append("queryData", JSON.stringify(queryData));

    return this.http
      .post<any>(this.gnBaseURL + "Query/ExtractAndBindQueryParameters", formData);
  }

  public getTextToSql(question: any) {

    const body = { question: question };
    var formData = new FormData();
    formData.append('question', question);
    return this.http
      .post<any>('http://localhost:3000/ask', body);
  }

  public showResult(rowId, arrParams) {
    var formData = new FormData();

    formData.append('rowId', rowId);
    formData.append('arrParams', arrParams);
    return this.http
      .post<any>(this.gnBaseURL + "Query/showResult", formData);
  }

  public GetQuery(rowId) {
    var formData = new FormData();
    formData.append('rowId', rowId);
    return this.http
      .post<any>(this.gnBaseURL + "Query/GetQuery", formData);
  }

  public showExecutionResult(queryData) {

    var formData = new FormData();
    formData.append("queryData", JSON.stringify(queryData));

    return this.http
      .post<any>(this.gnBaseURL + "Query/showExecutionResult", formData);
  }

  // public showQueryResult(arrParams)
  // {
  //   try{
  //     var formData = new FormData();


  //     formData.append('arrParams', arrParams);

  //     return this.http.post<any>(
  //       `${this.gnBaseURL}Query/showQueryResult`,
  //       formData
  //     );
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }
  public ExportToExcel(rowId, arrParams) {
    try {
      return this.http.get(
        `${this.gnBaseURL}Query/ExportToExcel/` + rowId + '/' + arrParams,
        { responseType: 'blob' });
    } catch (error) {
      console.error(error);
    }
  }
  // public getQueryParamaters(rowId)
  // {
  //   try{
  //     var formData = new FormData();
  //     formData.append('rowId', rowId);

  //     return this.http.post<any>(
  //       `${this.gnBaseURL}Query/ExtractAndBindQueryParameters`,
  //       formData
  //     );
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }

  // public showQueryResult(rowId,arrParams)
  // {
  //   try{
  //     var formData = new FormData();

  //     formData.append('rowId', rowId);
  //     formData.append('arrParams', arrParams);

  //     return this.http.post<any>(
  //       `${this.gnBaseURL}Query/showQueryResult/`,
  //       formData
  //     );
  //   }
  //   catch (error) {
  //     console.error(error);
  //   }
  // }
}
