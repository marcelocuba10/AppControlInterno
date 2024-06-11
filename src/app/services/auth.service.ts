import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  token: any;
  public user!: User;

  constructor(
    private http: HttpClient,
    private storage: NativeStorage,
    private env: ApiService,
    private platform: Platform
  ) { }

  private saveToken(token: any): Promise<any> {
    if (this.platform.is('cordova')) {
      return this.storage.setItem('token', token);
    } else {
      localStorage.setItem('token', JSON.stringify(token));
      return Promise.resolve();
    }
  }

  private loadToken(): Promise<any> {
    if (this.platform.is('cordova')) {
      return this.storage.getItem('token');
    } else {
      const token = localStorage.getItem('token');
      return Promise.resolve(token ? JSON.parse(token) : null);
    }
  }

  getUser(): Observable<User> {
    return new Observable<User>(observer => {
      this.loadToken().then(token => {
        if (!token) {
          observer.error(new Error('Usuario no autenticado'));
          return;
        }

        const headers = new HttpHeaders({ 'Authorization': `${token.token_type} ${token.access_token}` });
        this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers }).subscribe(
          user => {
            observer.next(user);
            observer.complete();
          },
          error => {
            observer.error(error);
          }
        );
      });
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.env.API_URL + 'auth/login', { email, password }).pipe(
      tap(token => {
        this.saveToken(token).then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
      catchError(error => {
        console.error('Error during login', error);
        return throwError(() => error); // Cambio aquí para devolver un observable
      })
    );
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.loadToken().then(token => {
        if (!token) {
          observer.error(new Error('Usuario no autenticado'));
          return;
        }

        const headers = new HttpHeaders({ 'Authorization': `${token.token_type} ${token.access_token}` });
        this.http.get(this.env.API_URL + 'auth/logout', { headers: headers }).pipe(
          tap(() => {
            this.isLoggedIn = false;
            this.token = null;
            if (this.platform.is('cordova')) {
              this.storage.remove('token');
            } else {
              localStorage.removeItem('token');
            }
            observer.next();
            observer.complete();
          }),
          catchError(error => {
            observer.error(error);
            return throwError(() => error); // Cambio aquí para devolver un observable
          })
        ).subscribe();
      });
    });
  }

  getToken() {
    return this.loadToken().then(data => {
      this.token = data;
      this.isLoggedIn = !!this.token;
    },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }
}
