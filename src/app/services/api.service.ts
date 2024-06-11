import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //API_URL = 'https://conectafarm.com/api/';
  API_URL = 'http://127.0.0.1:8000/api/';

  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': 'Origin, Accept, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
    })
  };

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  constructor(private http: HttpClient) { }

  /*** schedules ***/
  public addSchedule(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(this.API_URL + 'schedule', schedule, this.httpHeader)
      .pipe(catchError(this.errorHandler));
  }

  // Change the return type to Observable<Schedule[]>
  public getSchedulesByUser(id: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(this.API_URL + 'schedule/user/' + id, this.httpHeader)
      .pipe(
        catchError(this.errorHandler)
      );
  }

  /*** get notifications ***/
  public getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.API_URL + 'notifications', this.httpHeader)
      .pipe(
        catchError(this.errorHandler)
      );
  }
}