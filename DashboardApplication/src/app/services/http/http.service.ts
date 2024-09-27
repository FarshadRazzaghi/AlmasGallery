import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";

import { apiPrefix } from "../../helper/http/http.helper";
import { BaseHttpRequest } from "../../helper/http/http.interface.ts";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceGeneric<T> {

  constructor(private http: HttpClient) { }

  public get = async (url: string, parameters?: string[]): Promise<T | HttpErrorResponse> => {
    const apiURL = generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.get<T>(apiURL, {
          reportProgress: true,
        }));
      return res;
    } catch (err) {
      return <HttpErrorResponse>err;
    }
  }

  public post = async (url: string, data?: BaseHttpRequest, parameters?: string[]): Promise<T | HttpErrorResponse> => {
    const apiURL = generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.post<T>(apiURL, data, {
          reportProgress: true,
          headers: addHeader()
        }));
      return res;
    } catch (err) {
      return <HttpErrorResponse>err;
    }
  }

  public put = async (url: string, data?: BaseHttpRequest, parameters?: string[]): Promise<T | HttpErrorResponse> => {
    const apiURL = generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.put<T>(apiURL, data, {
          reportProgress: true,
        }));
      return res;
    } catch (err) {
      return <HttpErrorResponse>err;
    }
  }

  public patch = async (url: string, data?: BaseHttpRequest, parameters?: string[]): Promise<T | HttpErrorResponse> => {
    const apiURL = generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.patch<T>(apiURL, data, {
          reportProgress: true,
        }));
      return res;
    } catch (err) {
      return <HttpErrorResponse>err;
    }
  }

  public delete = async (url: string, parameters?: string[]): Promise<T | HttpErrorResponse> => {
    const apiURL = generateUrl(url, parameters);

    try {
      const res = await lastValueFrom(
        this.http.delete<T>(apiURL, {
          reportProgress: true,
        }));
      return res;
    } catch (err) {
      return <HttpErrorResponse>err;
    }
  }

  public batchPromise = (promises: T[]): Promise<T[]> => {
    const promise = new Promise<T[]>((resolve, reject) => {

      Promise.all(promises)
        .then((results: Awaited<T>[]) => {
          resolve(results);
        })
        .catch((err: HttpErrorResponse) => {
          reject(err);
        });
    });

    return promise;
  }
}

export const addHeader = (): HttpHeaders => {
  let headers = new HttpHeaders();
  headers = headers.append("Access-Control-Allow-Origin", "*");
  headers = headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  return headers;
}

export const generateUrl = (url: string, parameters?: string[]): string => {
  if (parameters) {
    parameters.forEach((parameter) => {
      url += `/${parameter}`;
    });
  }

  return apiPrefix + url.replace(new RegExp(`\\b//\\b`, 'g'), '/');
}
