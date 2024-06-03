import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import * as moment from 'moment';
import { User } from 'src/app/models/user';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';

import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

import { take } from 'rxjs/operators';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { DatePipe } from '@angular/common'

import { Geolocation } from '@capacitor/geolocation';
import { Schedule } from 'src/app/models/schedule';

@Component({
  selector: 'app-scheduleDay',
  templateUrl: './scheduleDay.page.html',
  styleUrls: ['./scheduleDay.page.scss'],
})
export class scheduleDayPage implements OnInit {

  private schedule = {} as Schedule;
  public schedules: Schedule;
  public user: User;
  public scheduleIdDay;

  public btnCheckIn = true; //is disabled?
  public btnCheckOut = true; //is disabled?

  public time;
  public day;

  public latitude: number;
  public longitude: number;

  //important call MenuController, show icon "menu"
  constructor(
    private menu: MenuController, //icon hamburguer menu
    private appService: AppService,
    private apiService: ApiService,
    private authService: AuthService,
    private tab: TabsPage, //variable global user from page main;
    public datepipe: DatePipe,
  ) {
    console.log("load constructor");
    this.startTime();
    this.menu.enable(true);
    this.getCurrentUser();
    this.getCurrentLocation();
  }

  async ngOnInit() {
    console.log("load ngOnInit");
    this.getCurrentUser();
    this.CheckSchedule();
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

  ionViewWillEnter() {
    console.log("load ionViewWillEnter");
    this.CheckSchedule();
    this.getCurrentLocation();
  }

  CheckSchedule() {
    console.log("load checkSchedule");

    try {
      this.appService.presentLoading(1);
      this.apiService.checkSchedule(this.tab.user.id).subscribe((data: Schedule) => {

        if (Object.keys(data).length === 0) {
          //if return 0 is because it does not have registers
          this.appService.presentLoading(0);
          this.btnCheckOut = true; //is disabled?
          this.btnCheckIn = false; //is disabled?

        } else {
          this.scheduleIdDay = data[0]['id'];//get id schedule of current day

          if (data[0]['check_in_time']) {
            //entry time already checkIn
            console.log('check-in ok');
            this.btnCheckOut = false; //is disabled?
            this.btnCheckIn = true; //is disabled?
          }

          if (data[0]['check_in_time'] && data[0]['check_out_time']) {
            //all time already check
            console.log('check-in and check-out ok');
            this.btnCheckOut = true; //is disabled?
            this.btnCheckIn = true; //is disabled?
          }
          this.appService.presentLoading(0);
        }
      });
    } catch (error) {
      this.appService.presentAlert(error);
    }

  }

  async getCurrentLocation() {

    await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0, timeout: 5000, })
      .then((resp) => {
        this.latitude = resp.coords.latitude,
          this.longitude = resp.coords.longitude
        // console.log('Current position:', resp.coords);
      }).catch((error) => {
        //this.appService.presentToast('Error getting location');
        console.log('Error getting location', error);
      });
  }

  startTime() {
    var intervalVar = setInterval(function () {
      this.time = moment().format('LTS'); //show only time
    }.bind(this), 500);

    this.day = moment().locale('es').format('LL');
  }

  public addCheckInTime() {
    this.appService.presentLoading(1);

    this.btnCheckIn = true; //is disabled?
    this.btnCheckOut = false; //is disabled?
    let response: Observable<Schedule>;

    //convert date and save
    const dateTem = new Date();
    this.schedule.date = this.datepipe.transform(dateTem, 'dd-MM-yyyy');
    this.schedule.check_in_time = this.time;
    this.schedule.check_out_time = null;
    this.schedule.user_id = this.user.id;
    this.schedule.address_latitude_in = this.latitude;
    this.schedule.address_longitude_in = this.longitude;

    response = this.apiService.addSchedule(this.schedule);

    response.pipe(take(1)).subscribe(async (schedule) => {
      await this.appService.presentLoading(0);
      this.appService.presentAlert('Hora de ingreso guardada: ' + this.time);
    });
  }

  public addCheckOutTime() {
    this.appService.presentLoading(1);

    this.btnCheckIn = true; //is disabled?
    this.btnCheckOut = true; //is disabled?
    let response: Observable<Schedule>;

    //convert date and save
    const dateTem = new Date();
    this.schedule.date = this.datepipe.transform(dateTem, 'dd-MM-yyyy');
    this.schedule.check_out_time = this.time;
    this.schedule.user_id = this.user.id;
    this.schedule.address_latitude_out = this.latitude;
    this.schedule.address_longitude_out = this.longitude;

    response = this.apiService.updateSchedule(this.scheduleIdDay, this.schedule);

    response.pipe(take(1)).subscribe(async (schedule) => {
      await this.appService.presentLoading(0);
      this.appService.presentAlert('Hora de salida guardada: ' + this.time);
    });
  }

}
