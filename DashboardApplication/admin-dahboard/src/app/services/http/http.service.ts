import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, first, throwError } from "rxjs";

import { apiPrefix } from "../../helper/http/http.helper";
import { BaseQueryStringFilter } from "../../helper/http/http.interface.ts";
import { CustomErrorEvent } from "../../types/shared/shared.type";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceGeneric<DataType> {

  constructor(private http: HttpClient) { }

  public get = (url: string, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, queryStringBuilder, parameters);
    return this.http.get<DataType>(apiURL, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public post = (url: string, data?: DataType, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, queryStringBuilder, parameters);
    return this.http.post<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public put = (url: string, data?: DataType, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, queryStringBuilder, parameters);
    return this.http.put<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public patch = (url: string, data?: DataType, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, queryStringBuilder, parameters);
    return this.http.patch<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public delete = (url: string, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, queryStringBuilder, parameters);
    return this.http.delete<DataType>(apiURL, { headers: this.addHeader(), observe: 'response' }).pipe(catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public batchPromise = (promises: DataType[]): Promise<DataType[]> => {
    const promise = new Promise<DataType[]>((resolve, reject) => {

      Promise.all(promises)
        .then((results: Awaited<DataType>[]) => {
          resolve(results);
        })
        .catch((err: HttpErrorResponse) => {
          reject(err);
        });
    });

    return promise;
  }

  private handleError = <DataType>() => {
    return (error: HttpErrorResponse): Observable<DataType> => {
      let errorMessage = 'Unknown error!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        const castedError = error.error as CustomErrorEvent;
        errorMessage = `Error Code: ${castedError.status}\\nMessage: ${castedError.detail}`;
      }

      console.error(errorMessage);
      return throwError(() => error);
    };
  }

  private addHeader = (): HttpHeaders => {
    const headers = new HttpHeaders({
      "Authorization": `Basic ${btoa("Farshad: Pa$$w0rd")}`,
      'Access-Control-Allow-Origin': '*',
    });
    return headers;
  }

  private generateUrl = (url: string, queryStringBuilder?: BaseQueryStringFilter, parameters?: string[]): string => {
    if (parameters) {
      parameters.forEach((parameter) => {
        url += `/${parameter}`;
      });
    }

    const queryString = this.getQueryStringBuilder(queryStringBuilder);
    const uri = apiPrefix + url.replace(new RegExp(`\\b//\\b`, 'g'), '/');

    return queryString ? `${uri}?${queryString}` : uri;
  }

  private getQueryStringBuilder = (filter?: BaseQueryStringFilter) => {
    let queryString = '';
    if (filter) {
      const objects = Object.keys(filter) as (keyof BaseQueryStringFilter)[];
      objects.forEach((x: keyof BaseQueryStringFilter) => {
        queryString += `${x}=${filter[x]}&`
      })
      queryString = queryString.slice(0, -1);
    }

    return queryString;
  }
}
