import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, lastValueFrom, of } from "rxjs";
import { v7 as uuid } from 'uuid';

import { apiPrefix } from "../../helper/http/http.helper";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceGeneric<DataType> {

  constructor(private http: HttpClient) { }

  public get = (url: string, parameters?: string[]): Observable<DataType> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.get<DataType>(apiURL, { reportProgress: true, responseType: 'json', headers: this.addHeader(), withCredentials: true }).pipe(catchError(this.handleError<DataType>('get')));
  }

  public post = (url: string, data?: DataType, parameters?: string[]): Observable<DataType> => {
    const apiURL = this.generateUrl(url, parameters);
    return this.http.post<DataType>(apiURL, data, { reportProgress: true, responseType: 'json', headers: this.addHeader(), withCredentials: true }).pipe(catchError(this.handleError<DataType>('post')));
  }

  public put = async (url: string, data?: DataType, parameters?: string[]): Promise<DataType> => {
    const apiURL = this.generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.put<DataType>(apiURL, data, {
          reportProgress: true,
          responseType: 'json',
          headers: this.addHeader()
        }));
      return res;
    } catch (err) {
      // TODO - SHOW ALERT MESSAGE ON ERROR
      throw err;
    }
  }

  public patch = async (url: string, data?: DataType, parameters?: string[]): Promise<DataType> => {
    const apiURL = this.generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.patch<DataType>(apiURL, data, {
          reportProgress: true,
          responseType: 'json',
          headers: this.addHeader()
        }));
      return res;
    } catch (err) {
      // TODO - SHOW ALERT MESSAGE ON ERROR
      throw err;
    }
  }

  public delete = async (url: string, parameters?: string[]): Promise<DataType> => {
    const apiURL = this.generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.delete<DataType>(apiURL, {
          reportProgress: true,
          responseType: 'json',
          headers: this.addHeader()
        }));
      return res;
    } catch (err) {
      // TODO - SHOW ALERT MESSAGE ON ERROR
      throw err;
    }
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

  private handleError<DataType>(operation = 'operation', result?: DataType) {
    return (error: HttpErrorResponse): Observable<DataType> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as DataType);
    };
  }

  private addHeader = (): HttpHeaders => {
    let headers = new HttpHeaders();
    headers = headers.append("Api-Key", uuid());
    headers = headers.append("Client-Id", uuid());
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
