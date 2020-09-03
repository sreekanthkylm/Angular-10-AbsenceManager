import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AbsenceManagerService {

  constructor(private http: HttpClient) {}

  //Get All Members List From Api(Json File)
  public getMembers(): Observable<any> {
    return this.http.get("./assets/data/members.json");
  }
  
  //Get All Absences List From Api(Json File)
  public getAbsences(): Observable<any> {
    return this.http.get("./assets/data/absences.json");
  }
}
