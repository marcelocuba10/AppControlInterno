import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

import { empty, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { MenuController } from '@ionic/angular';
import { Schedule } from 'src/app/models/schedule';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  user!: User;
  schedules!: Schedule;

  constructor(
    private menu: MenuController, //icon hamburguer menu
    public apiService: ApiService,
    private appService: AppService,
    private tab: TabsPage, //variable global user from page main;
  ) {
    console.log("load constructor");
    this.menu.enable(true);
  }

  ngOnInit() {
    console.log("load ngOnInit");
  }

  async ionViewWillEnter() {
    console.log("load ionViewWillEnter");
    this.getSchedulesByUser();
  }

  async getSchedulesByUser() {
    console.log("load getSchedulesByUser");

    try {
      this.apiService.getSchedulesByUser(this.user.id).subscribe((data: Schedule) => {
        this.schedules = data;
        console.log(this.schedules);
      });
    } catch (error) {
      this.appService.presentAlert('error en la obtencion de horarios');
    }

  }

}
