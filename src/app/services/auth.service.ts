import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { tap } from 'rxjs/operators';
import { User } from '../models/user';
import { ApiService } from './api.service';

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
  ) { }

  getUser() {
    const headers = new HttpHeaders({ 'Authorization': this.token["token_type"] + " " + this.token["access_token"] });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
      .pipe(
        tap(user => user)
      );
  }

  login(email: string, password: string) {
    return this.http.post(this.env.API_URL + 'auth/login', { email, password }
    ).pipe(tap(token => {
      //ver aqui el storage, setItem o set
      this.storage.setItem('token', token).then(
        () => {
          console.log('Token Stored');
        },
        error => console.error('Error storing item', error)
      );
      this.token = token;
      this.isLoggedIn = true;
      return token;
    }),
    );
  }

  register(name: string, email: string, password: string) {
    //const role = "customer";
    console.log('auth register');
    return this.http.put(this.env.API_URL + 'auth/register', { name, email, password });
  }

  updateUserProfile(name: string, last_name: string, phone: string, address: string, email: string, password: string) {
    return this.http.post(this.env.API_URL + 'auth/update', { name, last_name, address, phone, email, password });
  }

  logout() {
    const headers = new HttpHeaders({ 'Authorization': this.token["token_type"] + " " + this.token["access_token"] });
    return this.http.get(this.env.API_URL + 'auth/logout', { headers })
      .pipe(
        tap(data => {
          this.storage.remove('token');
          this.isLoggedIn = false;
          delete this.token;
          return data;
        })
      );
  }

  getToken() {
    return this.storage.getItem('token').then(data => {
      this.token = data;
      if (this.token != null) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  };

}
