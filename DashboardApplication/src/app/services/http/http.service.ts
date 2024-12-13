import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, first, throwError } from "rxjs";

import { apiPrefix } from "../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceGeneric<DataType> {

  constructor(private http: HttpClient) { }

  public get = (url: string, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.get<DataType>(apiURL, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public post = (url: string, data?: DataType, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.post<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public put = (url: string, data?: DataType, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.put<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public patch = (url: string, data?: DataType, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.patch<DataType>(apiURL, data, { headers: this.addHeader(), observe: 'response' }).pipe(first(), catchError(this.handleError<HttpResponse<DataType>>()));
  }

  public delete = (url: string, parameters?: string[]): Observable<HttpResponse<DataType>> => {
    const apiURL = this.generateUrl(url, parameters);
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
        errorMessage = `Error Code: ${error.status}\\nMessage: ${error.message}`;
      }

      return throwError(() => error);
    };
  }

  private addHeader = (): HttpHeaders => {
    let headers = new HttpHeaders({
      "Authorization": `Basic ${btoa("Farshad: Pa$$w0rd")}`,
      'Access-Control-Allow-Origin': '*',
    });
    return headers;
  }

  private generateUrl = (url: string, parameters?: string[]): string => {
    if (parameters) {
      parameters.forEach((parameter) => {
        url += `/${parameter}`;
      });
    }

    return apiPrefix + url.replace(new RegExp(`\\b//\\b`, 'g'), '/');
  }
}
