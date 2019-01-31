import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface RequestOptions {
  headers?: { [key: string]: string };
  query?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:4008/';
  private baseHeaders: { [name: string]: string | string[] };

  constructor(private http: HttpClient) {
    this.baseHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  get(url: string, options: RequestOptions = {}): Observable<object> {
    return this.http.get(`${this.BASE_URL}${url}`, {
      headers: new HttpHeaders({
        ...this.baseHeaders,
        ...options.headers
      }),
      params: new HttpParams({ fromObject: options.query })
    });
  }

  post(
    url: string,
    data: any,
    options: RequestOptions = {}
  ): Observable<object> {
    return this.http.post(`${this.BASE_URL}${url}`, data, {
      headers: new HttpHeaders({
        ...this.baseHeaders,
        ...options.headers
      })
    });
  }

  patch(
    url: string,
    data: any,
    options: RequestOptions = {}
  ): Observable<object> {
    return this.http.patch(`${this.BASE_URL}${url}`, data, {
      headers: new HttpHeaders({
        ...this.baseHeaders,
        ...options.headers
      })
    });
  }

  delete(url: string, options: RequestOptions = {}): Observable<object> {
    return this.http.delete(`${this.BASE_URL}${url}`, {
      headers: new HttpHeaders({
        ...this.baseHeaders,
        ...options.headers
      }),
      params: new HttpParams({ fromObject: options.query })
    });
  }
}
