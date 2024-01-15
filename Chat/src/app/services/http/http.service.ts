import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentInterface } from 'ionicons/dist/types/stencil-public-runtime';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  async get(endpoint: string) {
    let url = environment.api + endpoint;
    console.log(url);
    
    return await this.http.get(url, this.setHeaders()).toPromise() as any;
  }

  async getUnauthorized(endpoint: string) {
    return await this.http.get(environment.api + endpoint).toPromise();
  }

  async post(endpoint: string, body: any) {
    return await this.http.post(environment.api + endpoint, body, this.setHeaders()).toPromise();
  }

  async postUnauthorized(endpoint: string, body: any) {
    return await this.http.post(environment.api + endpoint, body).toPromise() as any;
  }

  setHeaders() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")!
      }
    };
  }
}
