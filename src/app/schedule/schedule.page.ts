import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { MenuController } from '@ionic/angular';
import { Schedule } from 'src/app/models/schedule';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  user!: User;
  schedules: Schedule[] = [];

  constructor(
    private menu: MenuController, //icon hamburguer menu
    public apiService: ApiService,
    private appService: AppService,
    private authService: AuthService,
  ) {
    console.log("load constructor");
    this.menu.enable(true);
  }

  ngOnInit() {
    console.log("load ngOnInit");
    this.getCurrentUserAndSchedules();
  }

  async ionViewWillEnter() {
    console.log("load ionViewWillEnter");
    this.getCurrentUserAndSchedules();
  }

  async getCurrentUserAndSchedules() {
    console.log("load getCurrentUserAndSchedules");

    try {
      this.authService.getUser().subscribe(
        user => {
          this.user = user;
          this.apiService.getSchedulesByUser(this.user.id).subscribe((data: Schedule[]) => {
            this.schedules = data;
            console.log(this.schedules);
          });
        },
        error => {
          console.error('Error al obtener los detalles del usuario:', error);
          this.appService.presentAlert('Error al obtener los detalles del usuario');
        }
      );
    } catch (error) {
      this.appService.presentAlert('Error en la obtención de horarios');
    }
  }
}
