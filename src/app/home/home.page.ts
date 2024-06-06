import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Schedule } from '../models/schedule';
import { AuthService } from '../services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  date!: string;
  time!: string;
  userName!: string;
  userId!: number;
  public user!: User;

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);

    this.getCurrentUser();

    // Obtiene los detalles del usuario al cargar la página
    this.authService.getUserDetails().subscribe(
      user => {
        this.userName = user.name; // Asigna el nombre del usuario
        this.userId = user.id; // Asigna el ID del usuario
        console.log(this.userId + this.userName);
      },
      error => {
        console.error('Error al obtener los detalles del usuario:', error);
      }
    );

  }

  public getCurrentUser() {
    console.log("load getCurrentUser");
    this.authService.getUser().subscribe(
      user => {
        this.user = user;
        console.log(this.user);
      }
    );
  }

  updateDateTime() {
    const now = new Date();
    this.date = now.toLocaleDateString();
    this.time = now.toLocaleTimeString();
  }

  startShift() {
    const schedule: Schedule = {
      id: 0,
      user_id: 1, // Aquí se debería capturar el ID del usuario actualmente logueado
      date: this.date,
      check_in_time: this.time,
      check_out_time: '',
      address_latitude_in: 0,
      address_longitude_in: 0,
      address_latitude_out: 0,
      address_longitude_out: 0
    };

    this.apiService.addSchedule(schedule).subscribe(response => {
      console.log('Jornada iniciada:', response);
    }, error => {
      console.error('Error iniciando jornada:', error);
    });
  }
}
