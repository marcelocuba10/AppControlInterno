import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Schedule } from '../models/schedule';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  date!: string;
  time!: string;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
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
