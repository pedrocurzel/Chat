import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private http: HttpClient) { }


  async validateToken() {
    let token = localStorage.getItem("token")!;
    try {
      await this.http.get<tokenValidation>(environment.api + `/validate-token/${token}`).toPromise()
      return true;
    } catch(error) {
      return false;
    }
  }
}

interface tokenValidation {
  message: string,
  isValid: boolean
}